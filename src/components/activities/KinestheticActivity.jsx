import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';

export default function KinestheticActivity({ rows = 4, cols = 4, onComplete, payload }) {
  const instructions = payload?.instructions ?? 'انظري للصورة ثم أجيبي';
  const imageUrl = payload?.imageUrl; 
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const sliceImage = useCallback((img) => {
    const totalW = img.naturalWidth;
    const totalH = img.naturalHeight;
    const basePW = Math.floor(totalW / cols);
    const basePH = Math.floor(totalH / rows);
    const newPieces = [];
    let id = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sx = c * basePW;
        const sy = r * basePH;
        const sw = (c === cols - 1) ? (totalW - sx) : basePW;
        const sh = (r === rows - 1) ? (totalH - sy) : basePH;

        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        newPieces.push({ id: id++, src: canvas.toDataURL() });
      }
    }

    setPieces(newPieces);
    setShuffled(shuffle([...newPieces]));
  }, [rows, cols]);



  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      sliceImage(img);
      setImage(img);
    };
    img.src = imageUrl;
  }, [imageUrl, sliceImage]);


  const handleClick = (pieceId) => {
    if (selected === null) {
      setSelected(pieceId);
    } else if (selected !== pieceId) {
      const newShuffled = [...shuffled];
      const fromIndex = newShuffled.findIndex(p => p.id === selected);
      const toIndex = newShuffled.findIndex(p => p.id === pieceId);
      if (fromIndex === -1 || toIndex === -1) {
        setSelected(null);
        return;
      }
      [newShuffled[fromIndex], newShuffled[toIndex]] = [newShuffled[toIndex], newShuffled[fromIndex]];
      setShuffled(newShuffled);
      setSelected(null);
    } else {
      setSelected(null);
    }
  };

  const pieceAspect = image ? `${Math.floor(image.naturalWidth / cols)}/${Math.floor(image.naturalHeight / rows)}` : '1/1';

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        {image && (
          <div className="border p-1 rounded">
            <img src={image.src} alt="reference" className="w-32 h-32 object-contain" />
            <div className="text-xs text-center mt-1">الصورة الأصلية</div>
          </div>
        )}

        <div>
          <div className="text-m">{instructions}</div>
          {shuffled.length > 0 && (
            <div
              className="grid gap-1 mt-2"
              style={{ gridTemplateColumns: `repeat(${cols}, 100px)` }}
            >
              {shuffled.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleClick(p.id)}
                  className={`border rounded cursor-pointer overflow-hidden flex items-center justify-center ${selected === p.id ? 'ring-2 ring-primary' : ''}`}
                  style={{ width: '100px', aspectRatio: pieceAspect }}
                >
                  <img src={p.src} alt={`piece-${p.id}`} className="object-contain h-full w-full" />
                </div>
              ))}
            </div>
          )}

          {shuffled.length > 0 && (
            <div className="flex justify-between mt-2">
              <Button onClick={() => setShuffled(shuffle([...pieces]))} variant="ghost">
                أعد الخلط
              </Button>
              <Button onClick={() => onComplete && onComplete({ type: 'kinesthetic' })}>
                إرسال التقييم
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
