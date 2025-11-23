import React, { useState } from 'react';
import { Button } from '../ui/button';

export default function AcademicActivity({ student, payload = null, onComplete }) {
  const demo = {
    questions: [
      { id: 'd1', q: 'ما نتيجة 8 × 7؟', choices: ['54', '56', '48', '58'], answer: '56' },
    ],
  };
  const questions = payload?.questions ?? demo.questions;

  // State لكل محاولة
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[index];

  const submit = () => {
    if (selected == null) return;

    const newScore = selected === current.answer ? score + 1 : score;

    if (index < questions.length - 1) {
      setIndex(i => i + 1);
      setSelected(null);
      setScore(newScore);
    } else {
      setScore(newScore);
      setCompleted(true);
      onComplete && onComplete({
        type: 'academic',
        score: newScore,
        total: questions.length,
      });
    }
  };

  const resetActivity = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="space-y-4" key={student.id}>
      <div className="text-sm text-muted-foreground">نشاط أكاديمي</div>

      {!completed ? (
        <>
          <div className="text-base font-medium">{current.q}</div>
          <div className="grid gap-2">
            {current.choices.map(c => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`text-left p-3 border rounded ${selected === c ? 'ring-2 ring-primary' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <div className="text-sm">السؤال {index + 1} / {questions.length}</div>
            <Button onClick={submit}>إرسال</Button>
          </div>
        </>
      ) : (
        <div className="space-y-3 text-center">
          <div className="text-lg font-semibold">انتهى الاختبار</div>
          <div>النتيجة: {score} / {questions.length}</div>
          <div className="flex justify-center gap-2">
            <Button onClick={resetActivity} variant="ghost">أعد المحاولة</Button>
            <Button onClick={() => onComplete && onComplete({ type: 'academic', score, total: questions.length })}>
              حفظ و خروج
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
