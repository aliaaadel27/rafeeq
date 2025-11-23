import { useState } from 'react';
import { interventions } from '../lib/data';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { X, Sparkles, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'sonner';

export function QuickSuggestPanel({ student, onClose }) {
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [outcome, setOutcome] = useState('success');
  const [notes, setNotes] = useState('');
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);

  const suggestedInterventions = interventions
    .filter((intervention) =>
      intervention.tags.some((tag) => student.tags.includes(tag))
    )
    .slice(0, 3);

  const handleApply = (interventionId) => {
    setSelectedIntervention(interventionId);
    setShowOutcomeForm(true);
  };

  const handleSave = () => {
    const intervention = interventions.find((i) => i.id === selectedIntervention);
    if (intervention) {
      toast.success('تم حفظ التدخل بنجاح', {
        description: `تم تسجيل التدخل "${intervention.title}" للطالب ${student.name}`,
      });
      onClose();
    }
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
        return { variant: 'outline', text: difficulty };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-3xl bg-card rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <div>
                  <h2>اقتراحات تدخل</h2>
                  <p className="text-sm opacity-90">للطالب: {student.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showOutcomeForm ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  التدخلات المقترحة بناءً على خصائص الطالب
                </p>
                {suggestedInterventions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    لا توجد اقتراحات متاحة حالياً
                  </div>
                ) : (
                  suggestedInterventions.map((intervention) => {
                    const difficultyBadge = getDifficultyBadge(intervention.difficulty);
                    const matchingTags = intervention.tags.filter((tag) =>
                      student.tags.includes(tag)
                    );

                    return (
                      <div
                        key={intervention.id}
                        className="border border-border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3>{intervention.title}</h3>
                              <Badge variant={difficultyBadge.variant}>
                                {difficultyBadge.text}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">
                              {intervention.description}
                            </p>
                            <div>
                              <p className="text-sm mb-2">مناسب بسبب:</p>
                              <div className="flex flex-wrap gap-2">
                                {matchingTags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => handleApply(intervention.id)}>
                            تطبيق
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="mb-1">
                    {interventions.find((i) => i.id === selectedIntervention)?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {interventions.find((i) => i.id === selectedIntervention)?.description}
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">نتيجة التدخل</Label>
                  <RadioGroup value={outcome} onValueChange={setOutcome}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="success" id="success" />
                        <Label htmlFor="success" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          <div>
                            <p>نجح</p>
                            <p className="text-sm text-muted-foreground">
                              التدخل كان ناجحاً وحقق النتائج المرجوة
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial" className="flex items-center gap-2 cursor-pointer flex-1">
                          <AlertCircle className="w-5 h-5 text-warning" />
                          <div>
                            <p>جزئي</p>
                            <p className="text-sm text-muted-foreground">
                              التدخل حقق بعض النتائج لكن يحتاج تحسين
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="fail" id="fail" />
                        <Label htmlFor="fail" className="flex items-center gap-2 cursor-pointer flex-1">
                          <XCircle className="w-5 h-5 text-destructive" />
                          <div>
                            <p>فشل</p>
                            <p className="text-sm text-muted-foreground">
                              التدخل لم يحقق النتائج المرجوة
                            </p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="notes" className="mb-2 block">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أضف ملاحظاتك حول التدخل..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSave} className="flex-1">
                    حفظ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowOutcomeForm(false)}
                    className="flex-1"
                  >
                    رجوع
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
