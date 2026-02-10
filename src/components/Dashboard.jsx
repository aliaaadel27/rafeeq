import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { LogOut, User, Users, Grid3x3, Clock, LayoutDashboard, Activity, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { GroupBuilder } from './GroupBuilder';
import { SeatingChart } from './SeatingChart';
import { AddStudent } from './AddStudent';
import { StudentProfileModal } from './StudentProfileModal';
import { QuickSuggestPanel } from './QuickSuggestPanel';
import { StudentList } from './StudentList';
import ActivitiesList from './ActivitiesList';
import { NafesCompetition } from './NafesCompetition';

// eslint-disable-next-line no-unused-vars
const ActionCard = ({ Icon, title, description, onClick }) => (
  <Card className="cursor-pointer bg-card/70 hover:bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl border-2 border-primary/10 shadow-lg" onClick={onClick}>
    <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
      <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-foreground mt-2">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

// eslint-disable-next-line no-unused-vars
const SidebarLink = ({ icon: Icon, label, view, currentView, onClick }) => (
  <button onClick={() => onClick(view)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 text-sm font-medium ${currentView === view ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

export function Dashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQuickSuggest, setShowQuickSuggest] = useState(false);
  const [currentView, setCurrentView] = useState('workspace');
  // const [sessionTime, setSessionTime] = useState(0);
  const [lessonTitle, setLessonTitle] = useState('درس اللغة العربية');
  const [notes, setNotes] = useState('');
  const [showAddClassroom, setShowAddClassroom] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [creatingClassroom, setCreatingClassroom] = useState(false);

  // Timer
  // useEffect(() => {
  //   const interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // const formatTime = (seconds) => {
  //   const hrs = Math.floor(seconds / 3600);
  //   const mins = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  // };

  // Fetch teacher and classrooms once
  useEffect(() => {
    async function fetchTeacherAndClassrooms() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teacherData, error: teacherErr } = await supabase.from('teachers').select('*').eq('id', user.id).single();
      if (teacherErr) console.error(teacherErr);
      setTeacher(teacherData);

      const { data: classroomsData, error: clsErr } = await supabase.from('classrooms').select('*').eq('teacher_id', user.id);
      if (clsErr) console.error(clsErr);
      setClassrooms(classroomsData || []);
      setSelectedClassroom(classroomsData?.[0]?.id || null);
    }
    fetchTeacherAndClassrooms();
  }, []);

  // Fetch students when classroom changes
  useEffect(() => {
    if (!selectedClassroom) {
      setStudents([]);
      return;
    }

    async function fetchStudents() {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*, intervention_logs(*)')
        .eq('classroom_id', selectedClassroom);

      if (error) {
        console.error(error);
        return;
      }

      setStudents((studentsData || []).map(normalizeStudentRecord));
    }

    fetchStudents();
  }, [selectedClassroom]);

  // Normalize DB record into UI-friendly shape
  const normalizeStudentRecord = (student) => {
    const interventionLogs = student?.intervention_logs ?? student?.interventionLogs ?? [];
    const lastIntervention = interventionLogs.length ? [...interventionLogs].sort((a,b)=>new Date(b.date)-new Date(a.date))[0] : student?.lastIntervention ?? null;
    return {
      ...student,
      avatar: student?.avatar ?? student?.avatar_url ?? '',
      tags: student?.tags ?? [],
      strengths: student?.strengths ?? [],
      difficulties: student?.difficulties ?? [],
      learning_style: student?.learning_style ?? 'visual',
      interventionLogs,
      intervention_logs: interventionLogs,
      lastIntervention
    };
  };

  // When a new student is added (from AddStudent)
  const handleStudentAdded = (student) => {
    const normalized = normalizeStudentRecord(student);
    if (normalized.classroom_id === selectedClassroom) {
      setStudents(prev => [...prev, normalized]);
    }
    setCurrentView('students');
  };

  // Create classroom
  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      setCreatingClassroom(true);
      const payload = { name: newClassroomName.trim(), teacher_id: user.id };
      const { data, error } = await supabase.from('classrooms').insert([payload]).select().single();
      if (error) return console.error(error);

      setClassrooms(prev => [data, ...prev]);
      setSelectedClassroom(data.id);
      setNewClassroomName('');
      setShowAddClassroom(false);
    } finally {
      setCreatingClassroom(false);
    }
  };

  // Handler to open modal for a student (passed to StudentList)
  const handleOpenStudent = (student) => {
    // ensure normalized shape
    setSelectedStudent(normalizeStudentRecord(student));
  };

  // onStudentUpdate: called by StudentProfileModal after successful save
  const handleStudentUpdateFromModal = (updatedStudent) => {
    console.log('updatedStudent from modal:', updatedStudent); // للديباغ - امسحه لو حابب
    const normalized = normalizeStudentRecord(updatedStudent);
    setStudents(prev => prev.map(s => s.id === normalized.id ? { ...s, ...normalized } : s));
    // ensure UI shows students list and close modal
    setCurrentView('students');
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 ">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-navy font-extrabold text-2xl">ر<span className="text-primary">ف</span>يق</span>
            <span className="text-sm text-muted-foreground ml-1 hidden sm:inline">| Rafeeq</span>
          </div>
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl border border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono font-medium">{formatTime(sessionTime)}</span>
            </div>
          </div> */}
          <div className="flex items-center gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div className="relative cursor-pointer">
                  <Avatar className="w-10 h-10 bg-primary/20 text-primary">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-card rounded-xl shadow-2xl p-4 mt-2 w-60 border border-border" sideOffset={10} align="end">
                <p className="text-sm text-muted-foreground wrap-break-word">{teacher?.email}</p>
                <p className="text-base font-semibold mt-1">{teacher?.full_name ?? 'المعلم'}</p>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Button variant="destructive" size="icon" onClick={onLogout} className="w-10 h-10 rounded-xl cursor-pointer">
              <LogOut className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="w-64 bg-sidebar border-l border-sidebar-border p-5 flex flex-col gap-3 sticky top-18 h-[calc(100vh-4.5rem)] overflow-y-auto shadow-2xl shadow-primary/5">
          <h3 className="text-lg font-bold text-sidebar-foreground mb-4">الفصول الدراسية</h3>
          <Select onValueChange={setSelectedClassroom} value={selectedClassroom || ''}>
            <SelectTrigger className="w-full p-3 cursor-pointer border border-sidebar-border/30 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground font-semibold">
              <SelectValue placeholder="اختر فصلاً دراسياً..." />
            </SelectTrigger>
            <SelectContent className="bg-sidebar border border-sidebar-border shadow-2xl rounded-xl z-50">
              {classrooms.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer rounded-lg p-2.5">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setShowAddClassroom(true)} className="w-full  cursor-pointer justify-center mt-1 text-sm">
            + إضافة فصل جديد
          </Button>

          <hr className="my-4 border-sidebar-border" />

          <SidebarLink icon={LayoutDashboard} label="لوحة العمل الرئيسية" view="workspace" currentView={currentView} onClick={setCurrentView} />
          <SidebarLink icon={Users} label="بناء المجموعات" view="groups" currentView={currentView} onClick={setCurrentView} />
          <SidebarLink icon={Grid3x3} label="خريطة الجلوس" view="seating" currentView={currentView} onClick={setCurrentView} />
          <SidebarLink icon={List} label="قائمة الطالبات" view="students" currentView={currentView} onClick={setCurrentView} />
          <SidebarLink icon={Activity} label="نافِس" view="nafees" currentView={currentView} onClick={setCurrentView} />
          {/* <SidebarLink icon={Activity} label="إضافة نشاط" view="addActivity" currentView={currentView} onClick={setCurrentView} /> */}
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-background">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {currentView === 'workspace'}
            {currentView === 'groups' && 'بناء المجموعات'}
            {currentView === 'seating' && 'خريطة الجلوس'}
            {currentView === 'students' && 'قائمة الطالبات'}
            {currentView === 'nafees' && 'نافِس'}
            {currentView === 'addStudent' && 'إضافة طالبة جديدة'}
            {/* {currentView === 'addActivity' && 'إضافة نشاط جديد'} */}
          </h1>

          {currentView === 'workspace' && (
            <div className="mx-auto w-full max-w-5xl space-y-8">
              <div className="mb-12">
                <h2 className="text-4xl sm:text-5xl  text-foreground leading-tight">
                  <span className="text-primary">رفيقك</span> في اكتشاف قدرات كل طالبة
                </h2>
                <p className="text-lg text-muted-foreground mt-2 font-medium">مرحباً بك! لنبدأ العمل على تخصيص تجربة التعلم لطالبات فصلك.</p>
              </div>

              <Card className="shadow-xl rounded-2xl border-2 border-primary/10">
                <CardHeader><h3 className="text-xl font-semibold text-primary">معلومات الدرس الحالي</h3></CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground" htmlFor="lesson-title">عنوان الدرس</label>
                    <input id="lesson-title" type="text" value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} className="w-full px-4 py-2 border border-border rounded-xl bg-input-background mb-2" placeholder="أدخل عنوان الدرس..." />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground" htmlFor="lesson-notes">ملاحظات الدرس</label>
                    <Textarea id="lesson-notes" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="أضف ملاحظاتك..." rows={4} />
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold pt-4 pb-2 text-foreground">الإجراءات السريعة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard Icon={Users} title="بناء المجموعات" description="تنظيم الطالبات في مجموعات عمل" onClick={() => setCurrentView('groups')} />
                <ActionCard Icon={Grid3x3} title="خريطة الجلوس" description="أنشطة للطالبات وفقاً للنمط التعليمي لكل طالبة" onClick={() => setCurrentView('seating')} />
                <ActionCard Icon={List} title="قائمة الطالبات" description="عرض وتعديل ملفات طالبات الصف" onClick={() => setCurrentView('students')} />
                <ActionCard Icon={Activity} title="نافِس" description="تحدي بين مجموعات الصف" onClick={() => setCurrentView('nafees')} />
                {/* <ActionCard Icon={Activity} title="الأنشطة"  onClick={() => setCurrentView('activities')} /> */}

              </div>
            </div>
          )}

          {currentView === 'groups' && <GroupBuilder students={students} onBack={() => setCurrentView('workspace')} />}
          {currentView === 'seating' && <SeatingChart students={students} onStudentClick={handleOpenStudent} onBack={() => setCurrentView('workspace')} />}
          {currentView === 'addStudent' && <AddStudent classrooms={classrooms} defaultClassroomId={selectedClassroom} onCancel={()=>setCurrentView('workspace')} onStudentAdded={handleStudentAdded} />}
          {currentView === 'nafees' && <NafesCompetition />}
          {/* {currentView === 'activities' && <ActivitiesList />} */}

          {/* {currentView === 'addActivity' && (
            <ActivityCreatorModal
              isOpen={true}
              onClose={() => setCurrentView('workspace')} 
              onSave={(activity) => {
                // تضيفيه للقائمة المحلية فوراً عشان يبقى متاح كأوبشن
                setActivities(prev => [activity, ...prev]);
                setCurrentView('workspace');
              }}
            />
          )}           */}
          {currentView === 'students' && (
            <StudentList
              students={students}
              classrooms={classrooms}
              selectedClassroom={selectedClassroom}
              onClassroomChange={setSelectedClassroom}
              onStudentClick={handleOpenStudent} // نمرّر الدالة اللي تفتح المودال بطالب واحد
              onAddStudent={() => setCurrentView('addStudent')}
              onAddClassroom={() => setShowAddClassroom(true)}
              onBack={() => setCurrentView('workspace')}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          // الدالة اللي تستدعيها المودال بعد نجاح الحفظ
          onStudentUpdate={handleStudentUpdateFromModal}
          // onSuggestNow لو لازمة
          onSuggestNow={(student) => { setSelectedStudent(student); setShowQuickSuggest(true); }}
        />
      )}

      {showQuickSuggest && selectedStudent && <QuickSuggestPanel student={selectedStudent} onClose={()=>setShowQuickSuggest(false)} />}

      {/* Add Classroom Modal */}
      {showAddClassroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>{ if(!creatingClassroom){ setShowAddClassroom(false); setNewClassroomName(''); }}} />
          <div className="relative z-10 w-full max-w-md bg-card p-6 rounded-2xl shadow-2xl border border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">إضافة فصل جديد</h3>
            <input type="text" value={newClassroomName} onChange={e=>setNewClassroomName(e.target.value)} placeholder="أدخل اسم الفصل..." className="w-full px-4 py-2 border border-border rounded-xl bg-input-background mb-6" disabled={creatingClassroom} />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={()=>setShowAddClassroom(false)} disabled={creatingClassroom}>إلغاء</Button>
              <Button onClick={handleCreateClassroom} disabled={creatingClassroom}>{creatingClassroom ? 'جارٍ الإنشاء...' : 'إنشاء الفصل'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
