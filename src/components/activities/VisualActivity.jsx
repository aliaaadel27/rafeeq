import React, { useState } from 'react';
import { Button } from '../ui/button';

// eslint-disable-next-line no-unused-vars
export default function VisualActivity({ student, payload = null, onComplete }) {
  const images = payload?.images ?? [{ id:1, src: '/images/sample1.jpg', caption: 'ما الشيء المختلف؟' }];
  const instructions = payload?.instructions ?? 'انظري للصورة ثم أجيبي';
  const [index] = useState(0);
  // const [answer, setAnswer] = useState('');

  const image = images[index];

  return (
    <div className="space-y-4">
      {/* <div className="text-sm text-muted-foreground">نشاط بصري</div> */}
      <div className="w-full h-56 flex items-center justify-center bg-muted rounded">
        <img src={image.src} alt={image.caption} className="max-h-full object-contain" />
      </div>
      <div className="text-sm">{instructions}</div>
      {/* <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="اكتب إجابتك..." className="w-full border border-border rounded px-3 py-2" /> */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {/* <Button onClick={() => setIndex(i => Math.max(0, i-1))} variant="ghost">سابق</Button>
          <Button onClick={() => setIndex(i => Math.min(images.length-1, i+1))} variant="ghost">التالي</Button> */}
        </div>
        <Button onClick={() => onComplete && onComplete({ type: 'visual', imageId: image.id})}>إرسال التقييم</Button>
      </div>
    </div>
  );
}
