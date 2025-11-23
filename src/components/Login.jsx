import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';

export function Login({ onLogin, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }
      const userId = data.user?.id;
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', userId)
        .single();

      if (!teacherData) {
        await supabase
          .from('teachers')
          .insert([{ id: userId, email}]);
      }


      onLogin && onLogin();
    } catch (err) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
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
            {/* <CardTitle></CardTitle> */}
            <CardDescription className="mt-2">تسجيل الدخول</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button type="submit" className="w-full bg-primary cursor-pointer">
              تسجيل الدخول
            </Button>

            <p className="text-center text-sm mt-2">
              مستخدم جديد؟{' '}
              <span className="text-blue-950 cursor-pointer" onClick={onRegisterClick}>
                سجل هنا
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
