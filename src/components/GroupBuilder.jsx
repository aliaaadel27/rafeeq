import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Users, RefreshCw } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

/** Helper: map a filterKey (style/level) to a tailwind color class */
// const colorMap = {
//   // learning styles
//   visual: 'bg-amber-100 border-amber-300 text-amber-800',
//   auditory: 'bg-sky-100 border-sky-300 text-sky-800',
//   kinesthetic: 'bg-emerald-100 border-emerald-300 text-emerald-800',
//   'غير محدد': 'bg-gray-100 border-gray-300 text-gray-800',

//   // academic levels (example)
//   ممتاز: 'bg-purple-100 border-purple-300 text-purple-800',
//   'جيد جداً': 'bg-indigo-100 border-indigo-300 text-indigo-800',
//   جيد: 'bg-rose-100 border-rose-300 text-rose-800',
//   عام: 'bg-gray-100 border-gray-300 text-gray-800',
// };

// const getGroupColorClass = (key) => {
//   if (!key) return 'bg-gray-100 border-gray-300';
//   return colorMap[key] ?? 'bg-gray-100 border-gray-300';
// };

const learningStyleLabels = {
  visual: "بصري",
  auditory: "سمعي",
  kinesthetic: "حركي"
};

// --- Draggable Student Component ---
function DraggableStudent({ student, groupId, criteria }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: { studentId: student.id, groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // اختر القيمة للـ Badge حسب الفلتر الحالي
  const badgeValue =
    criteria === 'learning_style'
      ? learningStyleLabels[student.learning_style] || "غير محدد"
      : student.academic_level || 'عام';

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 rounded-md cursor-move hover:shadow-md transition-shadow border ${isDragging ? 'opacity-50' : ''}`}
      style={{ background: 'transparent' }}
    >
      <Avatar className="w-8 h-8">
        {student.avatar ? (
          <AvatarImage src={student.avatar} alt={student.name} />
        ) : (
          <AvatarFallback>{student.name?.charAt(0) ?? '؟'}</AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm truncate font-medium">{student.name}</p>
          {/* Badge حسب الفلتر */}
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {badgeValue}
          </Badge>
        </div>
        <div className="flex gap-1 mt-1">
          {(student.tags || []).slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}


// --- Droppable Group Component ---
function DroppableGroup({ group, onDrop, criteria }) {
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

  // const colorClass = getGroupColorClass(group.meta?.filterKey);

  return (
    <Card ref={drop} className={`${isOver ? 'ring-2 ring-primary' : ''} border`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* <div className={`px-2 py-1 rounded-md border ${colorClass}`}>
              <span className="text-xs font-semibold">{group.meta?.filterKey ?? 'عام'}</span>
            </div> */}
            <span className="font-medium">{group.name}</span>
          </div>
          <Badge variant="outline">{group.students.length} طالبات</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {group.students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
            اسحب الطلاب هنا
          </div>
        ) : (
          group.students.map((student) => (
            <DraggableStudent key={student.id} student={student} groupId={group.id} criteria={criteria} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

// --- Main GroupBuilder Component ---
export function GroupBuilder({ students = [], onBack }) {
  const [criteria, setCriteria] = useState('learning_style'); // 'learning_style' | 'academic_level'
  const [distributionType, setDistributionType] = useState('balanced'); // 'balanced' | 'homogeneous'
  const [groupSize, setGroupSize] = useState('4'); // string because Select returns string
  const [groups, setGroups] = useState([]);

  // Helper: create N empty groups with base name
  const createEmptyGroups = (n, baseName = 'المجموعة') => {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push({ id: `${baseName}-${i}`, name: `${baseName} ${i + 1}`, meta: {}, students: [] });
    return arr;
  };

  // Balanced distribution across groups from buckets (round-robin across buckets)
  const distributeBalancedFromBuckets = (buckets, sizeLimit) => {
    // حساب عدد الجروبات المطلوبة
    const totalStudents = buckets.reduce((s, b) => s + b.length, 0);
    const numGroups = Math.max(1, Math.ceil(totalStudents / sizeLimit));
    const newGroups = createEmptyGroups(numGroups, 'المجموعة');

    console.groupCollapsed(`بدء توزيع متوازن (balanced)`);
    console.log(`عدد الطلاب الكلي: ${totalStudents}, حد المجموعة: ${sizeLimit}, عدد الجروبات: ${numGroups}`);

    // نعمل نسخة من كل bucket للتعامل كـ queue
    const queues = buckets.map(b => [...b]);

    let step = 1;
    // توزيع Bucket by Bucket
    for (let bucketIndex = 0; bucketIndex < queues.length; bucketIndex++) {
      const queue = queues[bucketIndex];
      let groupIndex = 0;

      while (queue.length > 0) {
        const student = queue.shift();
        // نحط الطالب في الجروب الحالي إذا فيه مساحة
        while (newGroups[groupIndex].students.length >= sizeLimit) {
          groupIndex = (groupIndex + 1) % newGroups.length;
        }
        newGroups[groupIndex].students.push(student);
        console.log(
          `خطوة ${step}: أخذنا طالب (${student.name}) من bucket ${bucketIndex} ووضعناه في المجموعة ${groupIndex + 1} (حجم الآن: ${newGroups[groupIndex].students.length})`
        );
        step++;
        groupIndex = (groupIndex + 1) % newGroups.length;
      }
    }

    console.groupEnd();
    console.groupCollapsed(`ملخص التوزيع النهائي (balanced)`);
    newGroups.forEach((g, idx) => {
      console.log(`المجموعة ${idx + 1}: ${g.students.map(s => s.name).join(', ')}`);
    });
    console.groupEnd();

    return newGroups;
  };



  // Build groups according to selected criteria, distributionType, and groupSize
  const buildGroups = () => {
    const size = Math.max(1, parseInt(groupSize, 10) || 4);
    let newGroups = [];

    if (criteria === 'learning_style' || criteria === 'academic_level') {
      const byKey = students.reduce((acc, s) => {
        const key = criteria === 'learning_style' ? (s.learning_style || 'غير محدد') : (s.academic_level || 'عام');
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
      }, {});

      // ======= عرض الـ buckets قبل التوزيع =======
      console.groupCollapsed('Buckets قبل التوزيع');
      Object.entries(byKey).forEach(([key, list], idx) => {
        const label =
          criteria === 'learning_style'
            ? (typeof learningStyleLabels !== 'undefined' ? (learningStyleLabels[key] || key) : key)
            : key;
        console.log(`Bucket ${idx} — ${label} (${list.length} طالب):`);
        // اطبع قائمة الأسماء (أو id لو الاسم مش موجود)
        console.log(list.map(s => s.name || s.id));
        // لو حبيتي جدول مرتب بدل اللستة استخدمي console.table:
        // console.table(list.map(s => ({ id: s.id, name: s.name, learning_style: s.learning_style, academic_level: s.academic_level })));
      });
      console.groupEnd();
      // ======= end buckets log =======

      if (distributionType === 'homogeneous') {
        // homogeneous: groups per key — with logs
        Object.entries(byKey).forEach(([key, list]) => {
          const numGroupsForKey = Math.max(1, Math.ceil(list.length / size));
          console.groupCollapsed(`بناء جروبات لنمط/مستوى: ${key} — total ${list.length}, groups ${numGroupsForKey}`);
          for (let g = 0; g < numGroupsForKey; g++) {
            const studentsSlice = list.slice(g * size, (g + 1) * size);
            newGroups.push({
              id: `${criteria === 'learning_style' ? 'gs' : 'gl'}-${key}-${g}`,
              name: `${learningStyleLabels[key] || key} - مجموعة ${g + 1}`,
              meta: { filterKey: key },
              students: studentsSlice,
            });
            console.log(`جروب ${g + 1} لنمط ${key}: ${studentsSlice.map(s => s.name || s.id).join(', ')}`);
          }
          console.groupEnd();
        });
      } else {
        // balanced: interleave buckets
        const buckets = Object.values(byKey).map(list => [...list]);
        newGroups = distributeBalancedFromBuckets(buckets, size);

        // determine majority key per group for meta.filterKey and localized name
        newGroups = newGroups.map((grp, idx) => {
          const freq = {};
          grp.students.forEach(s => {
            const k = criteria === 'learning_style' ? (s.learning_style || 'غير محدد') : (s.academic_level || 'عام');
            freq[k] = (freq[k] || 0) + 1;
          });
          const majorityKey = Object.keys(freq).reduce((a, b) => (freq[a] >= freq[b] ? a : b), Object.keys(freq)[0] || null);
          return {
            ...grp,
            id: grp.id || `group-${idx}`,
            name: grp.name || `${learningStyleLabels[majorityKey] || majorityKey} - المجموعة ${idx + 1}`,
            meta: { filterKey: majorityKey },
          };
        });
      }
    } else {
      // fallback balanced across whole class (shouldn't happen but safe)
      const numGroups = Math.max(1, Math.ceil(students.length / size));
      newGroups = createEmptyGroups(numGroups, 'المجموعة');
      students.forEach((student, i) => {
        newGroups[i % newGroups.length].students.push(student);
      });
    }

    setGroups(newGroups);
    toast.success(`تم إنشاء ${newGroups.length} مجموعة بنجاح`);
  };


  const handleStudentMove = (studentId, fromGroupId, toGroupId) => {
    setGroups((prevGroups) => {
      const newGroups = prevGroups.map((g) => ({ ...g, students: [...g.students] }));
      const fromGroup = newGroups.find((g) => g.id === fromGroupId);
      const toGroup = newGroups.find((g) => g.id === toGroupId);
      if (!fromGroup || !toGroup) return prevGroups;

      if (fromGroup.meta?.filterKey && toGroup.meta?.filterKey && fromGroup.meta.filterKey !== toGroup.meta.filterKey) {
        toast.error('لا يمكن نقل طالب إلى مجموعة من فلتر مختلف');
        return prevGroups;
      }

      const index = fromGroup.students.findIndex((s) => s.id === studentId);
      if (index === -1) return prevGroups;

      const [student] = fromGroup.students.splice(index, 1);

      const sizeLimit = Math.max(1, parseInt(groupSize, 10) || 4);
      if (toGroup.students.length >= sizeLimit) {
        fromGroup.students.splice(index, 0, student);
        toast.error('وصلت المجموعة للحد الأقصى من الطلاب');
        return newGroups;
      }

      toGroup.students.push(student);
      toast.success(`تم نقل ${student.name} بنجاح`);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* معيار التجميع */}
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-medium text-foreground">معيار التجميع</Label>
                  <Select value={criteria} onValueChange={setCriteria}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="اختر معيار التجميع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning_style">نمط التعلم</SelectItem>
                      <SelectItem value="academic_level">المستوى الأكاديمي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* حجم المجموعة */}
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-medium text-foreground">حجم المجموعة</Label>
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="اختر حجم المجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 طالبات</SelectItem>
                      <SelectItem value="4">4 طالبات</SelectItem>
                      <SelectItem value="5">5 طالبات</SelectItem>
                      <SelectItem value="6">6 طالبات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* نوع التوزيع */}
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-medium text-foreground">نوع التوزيع</Label>
                  <Select value={distributionType} onValueChange={setDistributionType}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="اختر نوع التوزيع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">متوازن</SelectItem>
                      <SelectItem value="homogeneous">متجانس</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2 border-t border-border gap-2">
                <Button onClick={buildGroups} size="sm" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  بناء المجموعات
                </Button>
              </div>
            </div>
          </CardContent>

        </Card>

        {groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <DroppableGroup key={group.id} group={group} onDrop={handleStudentMove} criteria={criteria} />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
}
