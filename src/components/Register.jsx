import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';

export function Register({ onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const SCHOOL_EMAIL_DOMAIN = '@gmail.com'; 

  const isStrongPassword = (pwd) => {
    if (!pwd || pwd.length < 8) return false;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()+=._-]/.test(pwd);
    return hasUpper && hasNumber && hasSymbol;
  };

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('يرجى ملء جميع الحقول');
      return false;
    }
    if (!email.toLowerCase().endsWith(SCHOOL_EMAIL_DOMAIN.toLowerCase())) {
      setError(`يرجى استخدام بريد ${SCHOOL_EMAIL_DOMAIN}`);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('صيغة البريد غير صحيحة');
      return false;
    }
    if (!isStrongPassword(password)) {
      setError('كلمة المرور ضعيفة — استخدمي 8 أحرف على الأقل مع حرف كبير، رقم ورمز خاص.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!validate()) return;

    setLoading(true);
    try {
        const { error: signUpError } = await supabase.auth.signUp(
            { email, password },
            {
                // data: { full_name: name } 
            }
        );
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage('تم إرسال رسالة تحقق إلى بريدك، يرجى التحقق من البريد قبل تسجيل الدخول.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'حصل خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg bg-accent/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <CardHeader className="text-center space-y-4">
          {/* <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div> */}
          <div className="flex items-center justify-center gap-2 font-bold text-xl">
                <span className="text-navy font-extrabold text-4xl">ر<span className="text-primary">ف</span>يق</span>
                <span className="text-m text-muted-foreground ml-1 hidden sm:inline">| Rafeeq</span>
          </div>
          <div>
            <CardTitle>تسجيل مستخدم جديد</CardTitle>
            <CardDescription className="mt-2"></CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {message ? (
            <p className="text-green-600 text-center">{message}</p>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
                <p className="text-xs text-muted-foreground">استخدمي البريد: {SCHOOL_EMAIL_DOMAIN}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير، رقم ورمز.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
              </Button>

              <p className="text-center text-sm mt-2">
                لديك حساب؟{' '}
                <span className="text-blue-950 cursor-pointer" onClick={onBackToLogin}>
                  تسجيل الدخول
                </span>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
