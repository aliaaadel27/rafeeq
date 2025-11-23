import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';

// eslint-disable-next-line no-unused-vars
export default function AuditoryActivity({ student, payload = null, onComplete }) {
  const audioUrl = payload?.audioUrl ?? '/audio/sample-audio.mp3';
  const question = payload?.question ?? 'ما الفكرة الرئيسية في المقطع؟';
  const audioRef = useRef(null);
  const [played, setPlayed] = useState(false);
  // const [answer, setAnswer] = useState('');

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">نشاط سمعي</div>
      <div className="flex items-center gap-3">
        <audio ref={audioRef} src={audioUrl} onPlay={() => setPlayed(true)} />
        <Button onClick={() => audioRef.current && audioRef.current.play()}>▶ تشغيل</Button>
        <Button onClick={() => audioRef.current && audioRef.current.pause()} variant="ghost">⏸ إيقاف</Button>
        {/* <div className="text-xs text-muted-foreground">{played ? 'تم الاستماع' : 'لم يتم الاستماع بعد'}</div> */}
      </div>

      <div className="text-sm">{question}</div>
      {/* <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full border border-border rounded p-2" /> */}

      <div className="flex justify-end">
        <Button onClick={() => onComplete && onComplete({ type: 'auditory', played })}>إرسال التقييم</Button>
      </div>
    </div>
  );
}
