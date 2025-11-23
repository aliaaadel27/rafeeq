import { useState } from 'react';
import { interventions } from '../lib/data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Settings, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPanel({ onBack }) {
  const [interventionList, setInterventionList] = useState(interventions);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('medium');
  const [formTags, setFormTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDifficulty('medium');
    setFormTags([]);
    setNewTag('');
    setEditingIntervention(null);
  };

  const handleEdit = (intervention) => {
    setEditingIntervention(intervention);
    setFormTitle(intervention.title);
    setFormDescription(intervention.description);
    setFormDifficulty(intervention.difficulty);
    setFormTags(intervention.tags);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setInterventionList(interventionList.filter((i) => i.id !== id));
    toast.success('تم حذف التدخل بنجاح');
  };

  const handleSave = () => {
    if (!formTitle || !formDescription) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (editingIntervention) {
      setInterventionList(
        interventionList.map((i) =>
          i.id === editingIntervention.id
            ? { ...i, title: formTitle, description: formDescription, difficulty: formDifficulty, tags: formTags }
            : i
        )
      );
      toast.success('تم تحديث التدخل بنجاح');
    } else {
      const newIntervention = {
        id: `int-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        difficulty: formDifficulty,
        tags: formTags,
      };
      setInterventionList([...interventionList, newIntervention]);
      toast.success('تم إضافة التدخل بنجاح');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddTag = () => {
    if (newTag && !formTags.includes(newTag)) {
      setFormTags([...formTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormTags(formTags.filter((t) => t !== tag));
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { variant: 'default', text: 'سهل' };
      case 'medium':
        return { variant: 'secondary', text: 'متوسط' };
      case 'hard':
        return { variant: 'outline', text: 'صعب' };
      default:
        return { variant: 'default', text: difficulty };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <CardTitle>إعدادات مكتبة التدخلات</CardTitle>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowRight className="w-4 h-4 ml-2" />
              رجوع
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              إدارة قالب التدخلات المتاحة للاستخدام
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة تدخل جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingIntervention ? 'تعديل التدخل' : 'إضافة تدخل جديد'}
                  </DialogTitle>
                  <DialogDescription>
                    املأ البيانات أدناه لإضافة تدخل جديد إلى المكتبة
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">عنوان التدخل *</Label>
                    <Input
                      id="title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="مثال: قراءة بصوت عالٍ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">الوصف *</Label>
                    <Textarea
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="وصف مختصر للتدخل وكيفية تطبيقه"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                    <Select value={formDifficulty} onValueChange={setFormDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">سهل</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="hard">صعب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الوسوم المرتبطة</Label>
                    <div className="flex flex-wrap gap-2 mb-3 mt-2">
                      {formTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="إضافة وسم..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSave}>حفظ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Interventions List */}
          <div className="space-y-3">
            {interventionList.map((intervention) => {
              const badge = getDifficultyBadge(intervention.difficulty);
              return (
                <Card key={intervention.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4>{intervention.title}</h4>
                          <Badge variant={badge.variant}>{badge.text}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {intervention.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {intervention.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(intervention)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(intervention.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
