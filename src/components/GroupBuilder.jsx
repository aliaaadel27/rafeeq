import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Users, Download, RefreshCw } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

// --- Draggable Student Component ---
function DraggableStudent({ student, groupId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: { studentId: student.id, groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 bg-card border border-border rounded-md cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={student.avatar} alt={student.name} />
        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{student.name}</p>
        <div className="flex gap-1 mt-1">
          {student.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Droppable Group Component ---
function DroppableGroup({ group, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'student',
    drop: (item) => {
      if (item.groupId !== group.id) {
        onDrop(item.studentId, item.groupId, group.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Card ref={drop} className={`${isOver ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{group.name}</span>
          <Badge variant="outline">{group.students.length} طلاب</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {group.students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
            اسحب الطلاب هنا
          </div>
        ) : (
          group.students.map((student) => (
            <DraggableStudent key={student.id} student={student} groupId={group.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

// --- Main GroupBuilder Component ---
export function GroupBuilder({ students, onBack }) {
  const [criteria, setCriteria] = useState('learning_style');
  const [groupSize, setGroupSize] = useState('4');
  const [groups, setGroups] = useState([]);

  const buildGroups = () => {
    const numGroups = Math.ceil(students.length / parseInt(groupSize));
    const newGroups = [];

    // دائماً متوازن
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({ id: `group-${i}`, name: `المجموعة ${i + 1}`, students: [] });
    }

    if (criteria === 'learning_style') {
      const byStyle = {};
      students.forEach((student) => {
        if (!byStyle[student.learning_style]) byStyle[student.learning_style] = [];
        byStyle[student.learning_style].push(student);
      });
      // eslint-disable-next-line no-unused-vars
      Object.entries(byStyle).forEach(([style, styledStudents], index) => {
        styledStudents.forEach((student, i) => {
          newGroups[i % numGroups].students.push(student);
        });
      });
    } else if (criteria === 'academic_level') {
      const byLevel = {};
      students.forEach((student) => {
        const level = student.academic_level || 'عام';
        if (!byLevel[level]) byLevel[level] = [];
        byLevel[level].push(student);
      });
      // eslint-disable-next-line no-unused-vars
      Object.entries(byLevel).forEach(([level, levelStudents], index) => {
        levelStudents.forEach((student, i) => {
          newGroups[i % numGroups].students.push(student);
        });
      });
    }

    setGroups(newGroups);
    toast.success(`تم إنشاء ${newGroups.length} مجموعة بنجاح`);
  };

  const handleStudentMove = (studentId, fromGroupId, toGroupId) => {
    setGroups((prevGroups) => {
      const newGroups = prevGroups.map((group) => ({ ...group, students: [...group.students] }));
      const fromGroup = newGroups.find((g) => g.id === fromGroupId);
      const toGroup = newGroups.find((g) => g.id === toGroupId);
      if (fromGroup && toGroup) {
        const index = fromGroup.students.findIndex((s) => s.id === studentId);
        if (index !== -1) {
          const [student] = fromGroup.students.splice(index, 1);
          toGroup.students.push(student);
          toast.success(`تم نقل ${student.name} بنجاح`);
        }
      }
      return newGroups;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← العودة للوحة الرئيسية
        </Button>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5" /> بناء المجموعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Controls Section */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* طريقة التوزيع دايمًا متوازن */}
                {/* <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap min-w-[120px]">طريقة التوزيع</Label>
                  <Select value="balanced" disabled>
                    <SelectTrigger className="flex-1 h-9 justify-start gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">متوازن</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* معيار التجميع */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap min-w-[120px]">معيار التجميع</Label>
                  <Select value={criteria} onValueChange={setCriteria}>
                    <SelectTrigger className="flex-1 h-9 justify-start gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning_style">نمط التعلم</SelectItem>
                      <SelectItem value="academic_level">المستوى الأكاديمي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* حجم المجموعة */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap min-w-[120px]">حجم المجموعة</Label>
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger className="flex-1 h-9 justify-start gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 طلاب</SelectItem>
                      <SelectItem value="4">4 طلاب</SelectItem>
                      <SelectItem value="5">5 طلاب</SelectItem>
                      <SelectItem value="6">6 طلاب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {groups.length > 0 && (
                  <>
                    {/* <Button variant="outline" size="sm" onClick={() => toast.success('تم حفظ المجموعات بنجاح')}>
                      حفظ
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.success('تم تصدير المجموعات')} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      تصدير
                    </Button> */}
                  </>
                )}
                <Button onClick={buildGroups} size="sm" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  بناء المجموعات
                </Button>
              </div>
            </div>

            {/* Empty State */}
            {groups.length === 0 && (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20 mt-4">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">انقر على "بناء المجموعات" لبدء تنظيم الطلاب</p>
              </div>
            )}
          </CardContent>
        </Card>

        {groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <DroppableGroup key={group.id} group={group} onDrop={handleStudentMove} />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
}
