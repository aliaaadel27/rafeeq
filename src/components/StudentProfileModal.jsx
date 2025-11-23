import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { X, Plus } from 'lucide-react';
import { AnimatePresence, motion as Motion } from "framer-motion";

export function StudentProfileModal({ student, onClose, onStudentUpdate }) {
  // INIT state from prop (use lazy initializer to avoid immediate effect)
  const [localStudent, setLocalStudent] = useState(() => ({
    ...student,
    strengths: student?.strengths || [],
    difficulties: student?.difficulties || [],
  }));
  const [tags, setTags] = useState(() => student?.tags || []);
  // const [newTag, setNewTag] = useState('');
  // const [newStrength, setNewStrength] = useState('');
  // const [newDifficulty, setNewDifficulty] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync only when the selected student actually changes (guard by id)
  useEffect(() => {
    // اگر مفيش student أو نفس id ما نعملش setState لتجنّب renders غير لازمة
    if (!student) return;
    if (student.id === localStudent?.id) return;

    setLocalStudent({
      ...student,
      strengths: student?.strengths || [],
      difficulties: student?.difficulties || [],
    });
    setTags(student?.tags || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id]); // نعتمد على id فقط عشان نتجنّب setState مكرّر

  // الوسوم
  // const handleAddTag = () => {
  //   const trimmed = (newTag || '').trim();
  //   if (!trimmed) return;
  //   setTags(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  //   setNewTag('');
  // };
  // const handleRemoveTag = (tagToRemove) => setTags(prev => prev.filter(t => t !== tagToRemove));

  // نقاط القوة
  // const handleAddStrength = () => {
  //   const trimmed = (newStrength || '').trim();
  //   if (!trimmed) return;
  //   setLocalStudent(prev => ({ ...prev, strengths: [...(prev.strengths || []), trimmed] }));
  //   setNewStrength('');
  // };
  // const handleRemoveStrength = (s) => setLocalStudent(prev => ({ ...prev, strengths: (prev.strengths || []).filter(str => str !== s) }));

  // الصعوبات
  // const handleAddDifficulty = () => {
  //   const trimmed = (newDifficulty || '').trim();
  //   if (!trimmed) return;
  //   setLocalStudent(prev => ({ ...prev, difficulties: [...(prev.difficulties || []), trimmed] }));
  //   setNewDifficulty('');
  // };
  // const handleRemoveDifficulty = (d) => setLocalStudent(prev => ({ ...prev, difficulties: (prev.difficulties || []).filter(diff => diff !== d) }));

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      name: localStudent.name,
      learning_style: localStudent.learning_style,
      academic_level: localStudent.academic_level,
      tags,
      strengths: localStudent.strengths || [],
      difficulties: localStudent.difficulties || [],
    };

    const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', student.id);

    if (error) {
      console.error(error);
      setSaving(false);
      return;
    }

    // رجّع نسخة محدثة للـ parent (تأكد إن parent يحدث الـ students state)
    const updatedStudent = {
      ...localStudent,
      id: student.id,
      tags,
      strengths: payload.strengths,
      difficulties: payload.difficulties,
    };

    if (onStudentUpdate) {
      onStudentUpdate(updatedStudent);
    }

    setSaving(false);
    onClose();
  };

  // helper لاسم الصورة (fallback بين avatar_url و avatar)
  const avatarSrc = localStudent?.avatar_url || localStudent?.avatar || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
        <Motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-2xl h-full bg-card shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border z-10 p-6 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={avatarSrc} alt={localStudent?.name} />
                <AvatarFallback>{(localStudent?.name || '')?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  value={localStudent?.name || ''}
                  onChange={(e) => setLocalStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-bold"
                />
                {/* <p className="text-sm text-muted-foreground">
                  تاريخ الميلاد: {localStudent?.dob ? new Date(localStudent.dob).toLocaleDateString('ar-SA') : '-'}
                </p> */}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Academic Level */}
            <div>
              <h3 className="mb-2 font-medium">المستوى الأكاديمي</h3>
              <select
                value={localStudent?.academic_level || 'متوسط'}
                onChange={(e) => setLocalStudent(prev => ({ ...prev, academic_level: e.target.value }))}
                className="border border-border rounded-md px-3 py-2 w-full"
              >
                <option value="ممتاز">ممتاز</option>
                <option value="جيد جداً">جيد جداً</option>
                <option value="جيد">جيد</option>
              </select>
            </div>

            {/* Learning Style */}
            <div>
              <h3 className="mb-2 font-medium">نمط التعلم</h3>
              <select
                value={localStudent?.learning_style || ''}
                onChange={(e) => setLocalStudent(prev => ({ ...prev, learning_style: e.target.value }))}
                className="border border-border rounded-md px-3 py-2 w-full"
              >
                <option value="visual">بصري</option>
                <option value="auditory">سمعي</option>
                <option value="kinesthetic">حركي</option>
              </select>
            </div>

            {/* Tags */}
            {/* <div>
              <h3 className="mb-2 font-medium">الوسوم</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="إضافة وسم جديد..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </div> */}

            {/* Strengths */}
            {/* <div>
              <h3 className="mb-2 font-medium">نقاط القوة</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {(localStudent?.strengths || []).map((s, i) => (
                  <Badge key={i} variant="default" className="cursor-pointer" onClick={() => handleRemoveStrength(s)}>
                    {s} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="إضافة نقطة قوة"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStrength()}
                />
                <Button onClick={handleAddStrength} size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </div> */}

            {/* Difficulties */}
            {/* <div>
              <h3 className="mb-2 font-medium">الصعوبات</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {(localStudent?.difficulties || []).map((d, i) => (
                  <Badge key={i} variant="destructive" className="cursor-pointer" onClick={() => handleRemoveDifficulty(d)}>
                    {d} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  placeholder="إضافة صعوبة"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDifficulty()}
                />
                <Button onClick={handleAddDifficulty} size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </div> */}

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </div>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}
