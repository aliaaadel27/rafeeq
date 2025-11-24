import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

export function StudentList({ students: initialStudents, classrooms, selectedClassroom, onClassroomChange, onStudentClick, onAddStudent, onAddClassroom , onBack}) {  
  const [students, setStudents] = useState(initialStudents);
  const learningStyleLabels = {
  visual: 'بصري',
  auditory: 'سمعي',
  kinesthetic: 'حركي',
  'undefined': 'غير محدد'
};

  // لو الـ prop بتتغير من بره، نحدث الـ state
  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const getOutcomeColor = (outcome) => {
    if (outcome === 'success') return 'bg-success';
    if (outcome === 'partial') return 'bg-warning';
    return 'bg-destructive';
  };

  // هتتعامل مع التحديث الفوري للطالب
  // const handleStudentUpdate = (updatedStudent) => {
  //   setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  // };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="mb-4">
            ← العودة للوحة الرئيسية
        </Button>
        <div className="flex items-center gap-2">
          <Select value={selectedClassroom || ''} onValueChange={onClassroomChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختار فصل" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={onAddStudent}>إضافة طالبة</Button>
          <Button size="sm" onClick={onAddClassroom}>إضافة فصل</Button>
        </div>
      </div>

      <div className="space-y-3">
        {students.length === 0 && (
          <Card><CardContent className="p-4 text-center text-sm text-muted-foreground">لا يوجد طلاب في هذا الفصل</CardContent></Card>
        )}

        {[...students]
          .sort((a, b) => {
            if (!a.name) return 1;
            if (!b.name) return -1;
            return a.name.localeCompare(b.name, 'ar');
          })
          .map(student => {
            const lastIntervention = student.lastIntervention;
            return (
              <Card 
                key={student.id} 
                className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => onStudentClick(student)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student.name}</p>

                    {/* Badges للنمط والمستوى */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {learningStyleLabels[student.learning_style] || 'غير محدد'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {student.academic_level || 'عام'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {(student.tags || []).slice(0,2).map((tag,i)=>
                        <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                      )}
                      {(student.tags || []).length > 2 && 
                        <Badge variant="outline" className="text-xs">+{(student.tags || []).length - 2}</Badge>
                      }
                    </div>

                    {lastIntervention && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${getOutcomeColor(lastIntervention.outcome)}`}></div>
                        <p className="text-xs text-muted-foreground">{new Date(lastIntervention.date).toLocaleDateString('ar-SA')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
        })}

      </div>
    </div>
  );
}
