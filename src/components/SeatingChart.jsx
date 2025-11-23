import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Grid3x3, Save } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ActivityModal from './ActivityModal';
import DroppableSeat from './DroppableSeat';
import { toast } from 'sonner';

export function SeatingChart({ students = [], onBack }) {
  const rows = 5, cols = 6, totalSeats = rows * cols;
  const [seats, setSeats] = useState(() => {
    const initialSeats = [];
    for (let i = 0; i < totalSeats; i++) {
      initialSeats.push({ id: `seat-${i}`, student: i < students.length ? students[i] : null });
    }
    return initialSeats;
  });

  const [filterType, setFilterType] = useState('none'); // 'none' | 'learningStyle' | 'academicLevel'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentMove = (studentId, fromSeatId, toSeatId) => {
    setSeats(prev => {
      const newSeats = prev.map(seat => ({ id: seat.id, student: seat.student ? { ...seat.student } : null }));
      const fromIndex = newSeats.findIndex(s => s.id === fromSeatId);
      const toIndex = newSeats.findIndex(s => s.id === toSeatId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const fromStudent = newSeats[fromIndex].student;
        const toStudent = newSeats[toIndex].student;
        newSeats[toIndex].student = fromStudent;
        newSeats[fromIndex].student = toStudent;
        if (fromStudent) toast.success(`تم نقل ${fromStudent.name} بنجاح`);
      }
      return newSeats;
    });
  };

  const handleSave = () => toast.success('تم حفظ خريطة الجلوس بنجاح');

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const seatIndex = i * cols + j;
        const seat = seats[seatIndex];
        row.push(
          <DroppableSeat
            key={`${seat.id}-${seat.student?.id || 'empty'}`}
            seat={seat}
            onDrop={handleStudentMove}
            onStudentClick={(s) => setSelectedStudent(s)}
          />
        );
      }
      grid.push(<div key={i} className="flex gap-3 justify-center">{row}</div>);
    }
    return grid;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">← العودة للوحة الرئيسية</Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Grid3x3 className="w-5 h-5" /> خريطة الجلوس</div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm">فلتر:</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-border rounded px-2 py-1">
                    <option value="none">بدون فلتر</option>
                    <option value="learningStyle">حسب النمط التعليمي</option>
                    <option value="academicLevel">حسب المستوى الأكاديمي</option>
                  </select>
                </div>

                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> حفظ
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-center mb-6">
              <div className="inline-block bg-primary text-primary-foreground px-12 py-4 rounded-lg">مكتب المعلم</div>
            </div>

            <div className="space-y-3">{renderGrid()}</div>

            <div className="flex gap-4 justify-center pt-4 border-t border-border mt-6">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-card border-2 border-primary rounded"></div><span className="text-sm">طالب</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-muted/30 border-2 border-dashed border-border rounded"></div><span className="text-sm">مقعد فارغ</span></div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-3">اسحب الطلاب لتغيير أماكن الجلوس. انقر على طالب لعرض الأنشطة (يفتح النشاط بناءً على الفلتر).</p>
          </CardContent>
        </Card>

        {selectedStudent && (
          <ActivityModal
            student={selectedStudent}
            filterType={filterType}
            onClose={() => setSelectedStudent(null)}
            onComplete={(res) => {
              console.log('Activity completed:', res);
              toast.success('انتهى النشاط');
              setSelectedStudent(null);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}
