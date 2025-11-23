// ResultReview.jsx
import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Button } from './ui/button';

export default function ResultReview({ student, activity,onCancel, onConfirm }) {
  const [outcome, setOutcome] = useState('success'); // 'success' | 'partial' | 'failed'
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-6">
      <Motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">مراجعة نتيجة النشاط</div>
          <div className="text-sm text-muted-foreground">الطالب: {student.name} • النشاط: {activity.title ?? activity.type}</div>
        </div>

        <div className="space-y-3">
          {/* <div>
            <div className="text-sm text-muted-foreground mb-2">النتيجة المرسلة من النشاط:</div>
            <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded">{JSON.stringify(initialResult, null, 2)}</pre>
          </div> */}

          <div>
            <div className="text-sm mb-2">اختاري حالة الأداء:</div>
            <div className="flex gap-3">
              <label className={`p-2 border rounded cursor-pointer ${outcome === 'success' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="outcome" value="success" checked={outcome === 'success'} onChange={() => setOutcome('success')} className="hidden" />
                ناجح
              </label>
              <label className={`p-2 border rounded cursor-pointer ${outcome === 'partial' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="outcome" value="partial" checked={outcome === 'partial'} onChange={() => setOutcome('partial')} className="hidden" />
                ناجح جزئياً
              </label>
              <label className={`p-2 border rounded cursor-pointer ${outcome === 'failed' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="outcome" value="failed" checked={outcome === 'failed'} onChange={() => setOutcome('failed')} className="hidden" />
                فشل
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">ملاحظات المعلم (اختياري):</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-border rounded p-2" rows={4} placeholder="اكتبي ملاحظات قصيرة عن أداء الطالب..." />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>إلغاء</Button>
          <Button onClick={() => onConfirm({ outcome, notes })}>تأكيد وحفظ</Button>
        </div>
      </Motion.div>
    </div>
  );
}
