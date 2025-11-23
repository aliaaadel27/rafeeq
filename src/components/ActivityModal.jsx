import React, { useEffect, useState } from 'react';
import { motion as Motion} from 'framer-motion';
import { Button } from './ui/button';
import VisualActivity from './activities/VisualActivity';
import AuditoryActivity from './activities/AuditoryActivity';
import KinestheticActivity from './activities/KinestheticActivity';
import AcademicActivity from './activities/AcademicActivity';
import ResultReview from './ResultReview';
import { supabase } from '../lib/supabaseClient';

export default function ActivityModal({ student, filterType = 'none', onClose, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState('');

  const [pendingResult, setPendingResult] = useState(null);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      setActivities([]);
      setSelectedActivity(null);

      try {
        // fetch student row
        let sRow = null;
        try {
          const { data, error } = await supabase
            .from('students')
            .select('id, name, learning_style, academic_level')
            .eq('id', student.id)
            .single();
          if (error) throw error;
          sRow = data;
        } catch (err) {
          console.warn('Student not found, using fallback:', err);
          sRow = null;
        }

        const fresh = sRow || {
          id: student.id,
          name: student.name,
          learning_style: student.learningStyle ?? student.learning_style,
          academic_level: student.academicLevel ?? student.academic_level
        };

        // تحديد نوع الفلتر
        let column = null, value = null;
        if (filterType === 'learningStyle') { column = 'learning_style'; value = fresh.learning_style; }
        else if (filterType === 'academicLevel') { column = 'academic_level'; value = fresh.academic_level; }
        else {
          if (fresh.learning_style) { column = 'learning_style'; value = fresh.learning_style; }
          else if (fresh.academic_level) { column = 'academic_level'; value = fresh.academic_level; }
          else { column = 'type'; value = 'visual'; }
        }

        // جلب الأنشطة
        let query = supabase.from('activities').select('*');
        if (column && value) query = query.eq(column, value);
        query = query.order('created_at', { ascending: false });

        const { data: acts, error: actsErr } = await query;
        
                // ✨ أضف هذا هنا
        console.log("=== DEBUG ACTIVITIES ===");
        console.log("Filter column:", column);
        console.log("Filter value:", value);
        console.log("Activities from Supabase:", acts);
        console.log("========================");
        if (actsErr) throw actsErr;

        if (mounted) setActivities(acts || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError('حدث خطأ أثناء جلب الأنشطة.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchActivities();
    return () => { mounted = false; };
  }, [student, filterType]);

  const handleActivityComplete = (result, act) => {
    setPendingResult(result);
    setPendingActivity(act);
    setShowReview(true);
  };

  const handleSaveReviewedResult = async ({ outcome, notes }) => {
    if (!pendingActivity || !pendingResult) {
      console.warn('No pending activity/result to save');
      setShowReview(false);
      return;
    }

    const resultPayload = {
      ...pendingResult,
      outcome,
      notes: notes ?? '',
      activity_id: pendingActivity.id ?? null,
      student_id: student.id,
      saved_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('activity_results')
        .insert([{
          student_id: student.id,
          activity_id: pendingActivity.id ?? null,
          type: pendingActivity.type ?? resultPayload.type ?? null,
          outcome,
          notes: notes ?? '',
          result: resultPayload
        }]);

      if (error) {
        console.error('Failed to save activity result:', error);
      } else {
        const saved = Array.isArray(data) ? data[0] : data;
        if (onComplete) onComplete(saved);
      }
    } catch (err) {
      console.error('Unexpected error saving activity result:', err);
    } finally {
      setPendingActivity(null);
      setPendingResult(null);
      setShowReview(false);
      onClose();
    }
  };

  const renderActivityByType = (act) => {
    const payload = act?.payload ?? null;
    const type = act?.type ?? 'visual';
    if (type === 'visual') return <VisualActivity student={student} payload={payload} onComplete={(res) => handleActivityComplete(res, act)} />;
    if (type === 'auditory') return <AuditoryActivity student={student} payload={payload} onComplete={(res) => handleActivityComplete(res, act)} />;
    if (type === 'kinesthetic') return <KinestheticActivity student={student} payload={payload} onComplete={(res) => handleActivityComplete(res, act)} />;
    if (type === 'academic') return <AcademicActivity student={student} payload={payload} onComplete={(res) => handleActivityComplete(res, act)} />;
    return <VisualActivity student={student} payload={payload} onComplete={(res) => handleActivityComplete(res, act)} />;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-6">
        <Motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-4xl bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{student.name}</div>
              <div className="text-sm text-muted-foreground">اختر نشاطًا ثم ابدأه</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">عدد الأنشطة: {activities.length}</div>
              <Button variant="ghost" onClick={onClose}>إغلاق</Button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-6">
            <div className="col-span-1 border-r border-border pr-4">
              <div className="mb-3 text-sm text-muted-foreground">الأنشطة المطابقة</div>
              {loading && <div className="text-sm text-muted-foreground">جاري جلب الأنشطة...</div>}
              {error && <div className="text-sm text-destructive">{error}</div>}
              {!loading && activities.length === 0 && <div className="text-sm text-muted-foreground">لا توجد أنشطة مطابقة.</div>}
              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {activities.map(act => (
                  <div key={act.id} className={`p-2 rounded border ${selectedActivity?.id === act.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{act.title ?? act.type}</div>
                        {/* <div className="text-xs text-muted-foreground">
                          {act.type} {act.learning_style ? `• ${act.learning_style}` : ''} {act.academic_level ? `• ${act.academic_level}` : ''}
                        </div> */}
                      </div>
                      <div className="shrink-0 ml-2">
                        <Button size="sm" variant={selectedActivity?.id === act.id ? 'secondary' : 'ghost'} onClick={() => setSelectedActivity(act)}>
                          {selectedActivity?.id === act.id ? 'محدد' : 'عرض'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              {!selectedActivity && <div className="text-center text-sm text-muted-foreground">اختر نشاطًا من القائمة لعرضه.</div>}
              {selectedActivity && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{selectedActivity.title ?? selectedActivity.type}</div>
                      {/* <div className="text-xs text-muted-foreground">
                        {selectedActivity.type} {selectedActivity.learning_style ? `• ${selectedActivity.learning_style}` : ''} {selectedActivity.academic_level ? `• ${selectedActivity.academic_level}` : ''}
                      </div> */}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setSelectedActivity(null)}>إلغاء العرض</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    {renderActivityByType(selectedActivity)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Motion.div>
      </div>

      {showReview && pendingActivity && pendingResult && (
        <ResultReview
          student={student}
          activity={pendingActivity}
          initialResult={pendingResult}
          onCancel={() => { setShowReview(false); setPendingActivity(null); setPendingResult(null); }}
          onConfirm={(data) => handleSaveReviewedResult(data)}
        />
      )}
    </>
  );
}
