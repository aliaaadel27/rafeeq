import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, UserPlus } from 'lucide-react';

const avatarSeeds = ['2'];

const avatarOptions = avatarSeeds.map((seed) => ({
  seed,
  url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
}));

export function AddStudent({
  classrooms,
  defaultClassroomId,
  onCancel,
  onStudentAdded,
}) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    classroomId: defaultClassroomId || '',
    learning_style: 'visual',
    academic_level: 'ممتاز', 

  });
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].url);
  // const [tags, setTags] = useState([]);
  // const [tagInput, setTagInput] = useState('');
  // const [strengths, setStrengths] = useState([]);
  // const [strengthInput, setStrengthInput] = useState('');
  // const [difficulties, setDifficulties] = useState([]);
  // const [difficultyInput, setDifficultyInput] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleAddTag = () => {
  //   if (!tagInput.trim()) return;
  //   if (tags.includes(tagInput.trim())) {
  //     setTagInput('');
  //     return;
  //   }
  //   setTags((prev) => [...prev, tagInput.trim()]);
  //   setTagInput('');
  // };

  // const handleRemoveTag = (tagToRemove) => {
  //   setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  // };

  // const handleAddStrength = () => {
  //   if (!strengthInput.trim()) return;
  //   if (strengths.includes(strengthInput.trim())) {
  //     setStrengthInput('');
  //     return;
  //   }
  //   setStrengths((prev) => [...prev, strengthInput.trim()]);
  //   setStrengthInput('');
  // };

  // const handleRemoveStrength = (strengthToRemove) => {
  //   setStrengths((prev) => prev.filter((item) => item !== strengthToRemove));
  // };

  // const handleAddDifficulty = () => {
  //   if (!difficultyInput.trim()) return;
  //   if (difficulties.includes(difficultyInput.trim())) {
  //     setDifficultyInput('');
  //     return;
  //   }
  //   setDifficulties((prev) => [...prev, difficultyInput.trim()]);
  //   setDifficultyInput('');
  // };

  // const handleRemoveDifficulty = (difficultyToRemove) => {
  //   setDifficulties((prev) => prev.filter((item) => item !== difficultyToRemove));
  // };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.classroomId) {
      setStatus({
        loading: false,
        error: 'الاسم والفصل مطلوبان لإضافة الطالب.',
        success: '',
      });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    const payload = {
      name: formData.name.trim(),
      dob: formData.dob || null,
      classroom_id: formData.classroomId,
      avatar_url: selectedAvatar,
      learning_style: formData.learning_style,
      academic_level: formData.academic_level,
      // tags,
      // strengths,
      // difficulties,
    };

    const { data, error } = await supabase
      .from('students')
      .insert(payload)
      .select('*, intervention_logs(*)')
      .single();

    if (error) {
      setStatus({
        loading: false,
        error: 'حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.',
        success: '',
      });
      console.error(error);
      return;
    }

    setStatus({
      loading: false,
      error: '',
      success: 'تمت إضافة الطالب بنجاح!',
    });

    if (onStudentAdded) {
      onStudentAdded({
        ...data,
        tags: data.tags || [],
        strengths: data.strengths || [],
        difficulties: data.difficulties || [],
        interventionLogs: data.interventionLogs || [],
        intervention_logs: data.intervention_logs || [],
      });
    }

    // Reset form
    setFormData({
      name: '',
      dob: '',
      classroomId: defaultClassroomId || '',
      learning_style: 'visual',
      academic_level: 'ممتاز'

      
    });
    // setTags([]);
    // setTagInput('');
    // setStrengths([]);
    // setStrengthInput('');
    // setDifficulties([]);
    // setDifficultyInput('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إضافة طالبة جديدة</CardTitle>
        {/* <p className="text-sm text-muted-foreground">
          أدخل بيانات الطالب واختر له صورة رمزية ثم اربطه بالفصل المناسب.
        </p> */}
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم الطالبة *</label>
              <Input
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="مثال: ريم محمد"
              />
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">تاريخ الميلاد</label>
              <Input
                type="date"
                value={formData.dob}
                onChange={handleInputChange('dob')}
              />
            </div> */}
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر الفصل *</label>
              <Select
                value={formData.classroomId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, classroomId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">نمط التعلم المفضل</label>
                <Select
                  value={formData.learning_style}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, learning_style: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">بصري</SelectItem>
                    <SelectItem value="auditory">سمعي</SelectItem>
                    <SelectItem value="kinesthetic">حركي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
              <label className="text-sm font-medium">المستوى الأكاديمي</label>
              <Select
                value={formData.academic_level}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, academic_level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                  <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                  <SelectItem value="جيد">جيد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Avatar Selection */}
          <section>
            <h3 className="text-sm font-medium mb-3">اختر صورة رمزية</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {avatarOptions.map((option) => (
                <button
                  type="button"
                  key={option.seed}
                  onClick={() => setSelectedAvatar(option.url)}
                  className={`border rounded-lg p-2 flex flex-col items-center gap-2 transition ${
                    selectedAvatar === option.url
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/60'
                  }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={option.url} alt={option.seed} />
                    <AvatarFallback>{option.seed.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs capitalize">{option.seed}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          {/* <section>
            <h3 className="text-sm font-medium mb-2">الوسوم (اختياري)</h3>
            <div className="flex gap-2 mb-3">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="مثال: ضعف قراءة"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 && (
                <p className="text-xs text-muted-foreground">لا توجد وسوم بعد.</p>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </section> */}

          {/* Strengths & Difficulties */}
          {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">نقاط القوة</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  value={strengthInput}
                  onChange={(event) => setStrengthInput(event.target.value)}
                  placeholder="مثال: الرياضيات"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddStrength();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddStrength} >
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengths.length === 0 && (
                  <p className="text-xs text-muted-foreground">لا توجد نقاط قوة بعد.</p>
                )}
                {strengths.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleRemoveStrength(item)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">الصعوبات</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  value={difficultyInput}
                  onChange={(event) => setDifficultyInput(event.target.value)}
                  placeholder="مثال: الكتابة اليدوية"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddDifficulty();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddDifficulty}>
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {difficulties.length === 0 && (
                  <p className="text-xs text-muted-foreground">لا توجد صعوبات بعد.</p>
                )}
                {difficulties.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleRemoveDifficulty(item)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          </section> */}

          {status.error && (
            <Alert variant="destructive">
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}
          {status.success && (
            <Alert>
              <AlertDescription>{status.success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={status.loading}>
              {status.loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              حفظ
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
