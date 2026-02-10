import { useEffect, useMemo, useState } from 'react';
import { Sparkles, TimerReset } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Textarea } from './ui/textarea';

const QUESTION_DURATION = 5;
const INTERMISSION_DURATION = 10;
const defaultSteps = [
  {
    id: 'image-question',
    type: 'imageQuestion',
    title: 'سؤال ١',
    question: '',
    imageUrl: '',
    duration: QUESTION_DURATION,
  },
  {
    id: 'missing-word',
    type: 'missingWord',
    title: 'سؤال ٢',
    prompt: 'اعثري على الكلمة الناقصة من الجملة',
    question: '',
    sentence: '',
    missingWord: '',
    duration: QUESTION_DURATION,
  },
  {
    id: 'circle-choices',
    type: 'choiceCircles',
    title: 'سؤال ٣',
    question: '',
    choices: [],
    duration: QUESTION_DURATION,
  },
  {
    id: 'final-question',
    type: 'text',
    title: 'سؤال ٤',
    question: '',
    duration: QUESTION_DURATION,
  },
];

const padTime = (seconds) => seconds.toString().padStart(2, '0');

const buildStepsFromForm = (form) => ([

  {
    id: 'missing-word',
    type: 'missingWord',
    title: 'سؤال 1',
    prompt: 'اعثري على الكلمة الناقصة من الجملة',
    question: form.q1Question,
    sentence: form.q1Sentence,
    missingWord: form.q1MissingWord,
    duration: form.q1Duration,
  },

  {
    id: 'image-question',
    type: 'imageQuestion',
    title: 'سؤال 2',
    question: form.q2Question,
    imageUrl: form.q2ImageUrl,
    duration: form.q2Duration,
  },
  {
    id: 'circle-choices',
    type: 'choiceCircles',
    title: 'سؤال 3',
    question: form.q3Question,
    choices: form.q3Choices,
    duration: form.q3Duration,
  },
  {
    id: 'final-question',
    type: 'text',
    title: 'سؤال 4',
    question: form.q4Question,
    duration: form.q4Duration,
  },
]);


const extractFormFromSteps = (steps) => {
  const q1 = steps.find((s) => s.id === 'missing-word') ?? {};
  const q2 = steps.find((s) => s.id === 'image-question') ?? {};
  const q3 = steps.find((s) => s.id === 'circle-choices') ?? {};
  const q4 = steps.find((s) => s.id === 'final-question') ?? {};

  return {
    q1Question: q1.question ?? '',
    q1Sentence: q1.sentence ?? '',
    q1MissingWord: q1.missingWord ?? '',
    q1Duration: Number.isFinite(q1.duration) ? q1.duration : QUESTION_DURATION,
    q2Question: q2.question ?? '',
    q2ImageUrl: q2.imageUrl ?? '',
    q2Duration: Number.isFinite(q2.duration) ? q2.duration : QUESTION_DURATION,
    q3Question: q3.question ?? '',
    q3Choices: Array.isArray(q3.choices) ? q3.choices : [],
    q3Duration: Number.isFinite(q3.duration) ? q3.duration : QUESTION_DURATION,
    q4Question: q4.question ?? '',
    q4Duration: Number.isFinite(q4.duration) ? q4.duration : QUESTION_DURATION,
  };
};

export function NafesCompetition() {
  const [activeTab, setActiveTab] = useState('list');
  const [configId, setConfigId] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [form, setForm] = useState({
    title: '',
    q1Question: '',
    q1Sentence: '',
    q1MissingWord: '',
    q1Duration: QUESTION_DURATION,
    q2Question: '',
    q2ImageUrl: '',
    q2Duration: QUESTION_DURATION,
    q3Question: '',
    q3Choices: [],
    q3Duration: QUESTION_DURATION,
    q4Question: '',
    q4Duration: QUESTION_DURATION,
  });
  const [q3ChoicesText, setQ3ChoicesText] = useState('');
  const [savedSteps, setSavedSteps] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isImageReady, setIsImageReady] = useState(true);

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);

  const resetFormState = () => {
    setConfigId(null);
    setForm({
      title: '',
      q1Question: '',
      q1Sentence: '',
      q1MissingWord: '',
      q1Duration: QUESTION_DURATION,
      q2Question: '',
      q2ImageUrl: '',
      q2Duration: QUESTION_DURATION,
      q3Question: '',
      q3Choices: [],
      q3Duration: QUESTION_DURATION,
      q4Question: '',
      q4Duration: QUESTION_DURATION,
    });
    setQ3ChoicesText('');
    setImageFile(null);
    setSavedSteps([]);
  };

  const gameSteps = useMemo(() => {
    if (savedSteps.length) return savedSteps;
    return defaultSteps;
  }, [savedSteps]);

  const activeStep = gameSteps[stepIndex];
  // const activeDuration = Number.isFinite(activeStep?.duration) ? activeStep.duration : QUESTION_DURATION;

  const loadCompetitions = async () => {
    setLoadingConfig(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoadingConfig(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('nafees_competitions')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('تعذر تحميل إعدادات المسابقة.');
      setCompetitions([]);
    } else {
      setCompetitions(data ?? []);
    }
    setLoadingConfig(false);
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (activeStep?.type === 'imageQuestion' && activeStep?.imageUrl) {
      setIsImageReady(false);
    } else {
      setIsImageReady(true);
    }
  }, [activeStep]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'finished') return;
    if (activeStep?.type === 'imageQuestion' && !isImageReady) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, stepIndex, activeStep, isImageReady]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'finished') return;
    if (timeLeft > 0) return;

    if (phase === 'question') {
      setPhase('intermission');
      setTimeLeft(INTERMISSION_DURATION);
      return;
    }

    if (phase === 'intermission') {
      if (stepIndex < gameSteps.length - 1) {
        const nextStep = gameSteps[stepIndex + 1];
        const nextDuration = Number.isFinite(nextStep?.duration) ? nextStep.duration : QUESTION_DURATION;
        setStepIndex((prev) => prev + 1);
        setPhase('question');
        setTimeLeft(nextDuration);
      } else {
        setPhase('finished');
        setTimeLeft(0);
      }
    }
  }, [timeLeft, phase, gameSteps.length, stepIndex, gameSteps]);

  const handleReset = () => {
    const firstStep = gameSteps[0];
    const firstDuration = Number.isFinite(firstStep?.duration) ? firstStep.duration : QUESTION_DURATION;
    setStepIndex(0);
    setPhase('question');
    setTimeLeft(firstDuration);
  };

  const handleSkip = () => {
    if (phase === 'finished') return;
    if (phase === 'question') {
      setPhase('intermission');
      setTimeLeft(INTERMISSION_DURATION);
      return;
    }
    if (stepIndex < gameSteps.length - 1) {
      const nextStep = gameSteps[stepIndex + 1];
      const nextDuration = Number.isFinite(nextStep?.duration) ? nextStep.duration : QUESTION_DURATION;
      setStepIndex((prev) => prev + 1);
      setPhase('question');
      setTimeLeft(nextDuration);
      return;
    }
    setPhase('finished');
    setTimeLeft(0);
  };

  const parseChoices = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return [];

    const hasDelimiter = /[\n,;]/.test(trimmed);
    const parts = hasDelimiter
      ? trimmed.split(/[\n,;]/)
      : trimmed.split(/\s+/);

    return parts
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 10);
  };

  const handleSave = async () => {
    setSavingConfig(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('يلزم تسجيل الدخول لحفظ المسابقة.');
        return;
      }

      let imageUrl = form.q2ImageUrl;
      if (imageFile) {
        const filename = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('nafees-images')
          .upload(filename, imageFile, { upsert: true });
        if (uploadError) {
          setError('تعذر رفع الصورة، تأكدي من إعدادات التخزين.');
          return;
        }
        const { data: publicData } = supabase.storage
          .from('nafees-images')
          .getPublicUrl(filename);
        imageUrl = publicData?.publicUrl ?? imageUrl;
      }

      const normalizedChoices = parseChoices(q3ChoicesText);
      const steps = buildStepsFromForm({ ...form, q2ImageUrl: imageUrl, q3Choices: normalizedChoices });
      const payload = {
        teacher_id: user.id,
        title: form.title?.trim() || 'نافِس',
        steps,
      };

      if (configId) {
        const { error: updateError } = await supabase
          .from('nafees_competitions')
          .update(payload)
          .eq('id', configId);
        if (updateError) {
          setError('تعذر تحديد المسابقة.');
          return;
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('nafees_competitions')
          .insert([payload])
          .select('id')
          .single();
        if (insertError) {
          setError('تعذر حفظ المسابقة.');
          return;
        }
        setConfigId(data?.id ?? null);
      }

      setSavedSteps(steps);
      setForm((prev) => ({ ...prev, q2ImageUrl: imageUrl, q3Choices: normalizedChoices }));
      setQ3ChoicesText(normalizedChoices.join('\n'));
      setImageFile(null);
      await loadCompetitions();
    } finally {
      setSavingConfig(false);
    }
  };
  const handleCreateNew = () => {
    setError('');
    resetFormState();
    setLoadingForm(false);
    setActiveTab('setup');
    setPhase('idle');
    setStepIndex(0);
    setTimeLeft(QUESTION_DURATION);
  };

  const handleSelectForEdit = (competition) => {
    const fetchCompetition = async () => {
      setLoadingForm(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('nafees_competitions')
        .select('*')
        .eq('id', competition.id)
        .single();

      if (fetchError || !data) {
        setError('تعذر تحميل بيانات المسابقة.');
        setLoadingForm(false);
        return;
      }

      const steps = Array.isArray(data.steps) ? data.steps : [];
      const extracted = extractFormFromSteps(steps);
      setConfigId(data.id);
      setSavedSteps(steps);
      setForm({
        ...extracted,
        title: data.title ?? '',
      });
      setQ3ChoicesText(extracted.q3Choices.join('\n'));
      setImageFile(null);
      setActiveTab('setup');
      setLoadingForm(false);
    };

    fetchCompetition();
  };

  const handleSelectForView = (competition) => {
    const steps = Array.isArray(competition.steps) ? competition.steps : [];
    const extracted = extractFormFromSteps(steps);
    const firstStep = steps[0];
    const firstDuration = Number.isFinite(firstStep?.duration) ? firstStep.duration : QUESTION_DURATION;
    setConfigId(competition.id);
    setSavedSteps(steps);
    setForm({
      ...extracted,
      title: competition.title ?? '',
    });
    setQ3ChoicesText(extracted.q3Choices.join('\n'));
    setImageFile(null);
    setActiveTab('play');
    setPhase('idle');
    setStepIndex(0);
    setTimeLeft(firstDuration);
    setError('');
  };

  const handleDeleteCompetition = async (competition) => {
    const confirmed = window.confirm('هل تريدين حذف هذه المسابقة؟ لا يمكن التراجع عن ذلك.');
    if (!confirmed) return;

    setError('');
    const { error: deleteError } = await supabase
      .from('nafees_competitions')
      .delete()
      .eq('id', competition.id);

    if (deleteError) {
      setError('تعذر حذف المسابقة.');
      return;
    }

    if (configId === competition.id) {
      resetFormState();
      setActiveTab('list');
      setPhase('idle');
      setStepIndex(0);
      setTimeLeft(QUESTION_DURATION);
    }

    await loadCompetitions();
  };
  const handleStart = () => {
    if (!savedSteps.length) {
      setActiveTab('setup');
      setError('احرصي على إعدادات المسابقة أولاً.');
      return;
    }

    setStepIndex(0);
    setPhase('question');
    const firstStep = savedSteps[0];
    const firstDuration = Number.isFinite(firstStep?.duration) ? firstStep.duration : QUESTION_DURATION;
    setTimeLeft(firstDuration);
    setActiveTab('play');
  };

  return (
    <div
      className={`mx-auto w-full ${activeTab === 'play' ? 'max-w-7xl' : 'max-w-6xl'} space-y-6`}
    >
      <Card className="border-2 border-primary/10 shadow-xl">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-foreground">المسابقات المحفوظة</h3>
              <p className="text-sm text-muted-foreground">اختاري مسابقة لعرضها أو تعديلها.</p>
            </div>
            <Button onClick={handleCreateNew} className="rounded-full cursor-pointer">
              إنشاء مسابقة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingConfig ? (
            <p className="text-sm text-muted-foreground">جارٍ تحميل المسابقات...</p>
          ) : competitions.length ? (
            competitions.map((competition) => {
              // eslint-disable-next-line no-unused-vars
              const createdAt = competition.created_at
                ? new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(
                  new Date(competition.created_at),
                )
                : '';
              return (
                <div
                  key={competition.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-background/80 px-4 py-3"
                >
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {competition.title || 'مسابقة بدون عنوان'}
                    </p>
                    {/* {createdAt && (
                      <p className="text-xs text-muted-foreground">آخر إنشاء: {createdAt}</p>
                    )} */}
                  </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSelectForView(competition)}
                        className="cursor-pointer"
                      >
                        عرض
                      </Button>
                      <Button onClick={() => handleSelectForEdit(competition)} className="cursor-pointer">
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCompetition(competition)}
                        className="cursor-pointer"
                      >
                        حذف
                      </Button>
                    </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد مسابقات محفوظة حتى الآن.</p>
          )}
        </CardContent>
      </Card>
      
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {activeTab === 'setup' && (
        <Card className="border-2 border-primary/10 shadow-xl">
          <CardHeader>
            <h3 className="text-xl font-semibold text-foreground">إعداد الأسئلة</h3>
            <p className="text-sm text-muted-foreground">
              أدخلي الصور والجمل هنا قبل بدء المسابقة.
            </p>

          </CardHeader>
          <CardContent className="space-y-6">
            {loadingForm ? (
              <p className="text-sm text-muted-foreground">جاري تحميل الإعدادات...</p>
            ) : (
              <>
                <div className="space-y-3 rounded-2xl border border-primary/10 bg-background/80 p-5">
                  <h4 className="text-lg font-semibold">بيانات المسابقة</h4>
                  <label className="text-sm text-muted-foreground">اسم المسابقة</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                    placeholder="اكتبي اسم المسابقة"
                  />
                </div>
                
                <div className="space-y-3 rounded-2xl border border-primary/10 bg-background/80 p-5">
                  <h4 className="text-lg font-semibold">سؤال 1 - الكلمة الناقصة</h4>
                  <label className="text-sm text-muted-foreground">نص السؤال</label>
                  <input
                    type="text"
                    value={form.q1Question}
                    onChange={(e) => setForm((prev) => ({ ...prev, q1Question: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                    placeholder="اكتبي نص السؤال هنا"
                  />
                  <label className="text-sm text-muted-foreground">الجملة</label>
                  <Textarea
                    value={form.q1Sentence}
                    onChange={(e) => setForm((prev) => ({ ...prev, q1Sentence: e.target.value }))}
                    placeholder="اكتبي الجملة مع وضع نقاط محل الكلمة الناقصة"
                    rows={3}
                  />
                  <label className="text-sm text-muted-foreground">الكلمة الناقصة</label>
                  <input
                    type="text"
                    value={form.q1MissingWord}
                    onChange={(e) => setForm((prev) => ({ ...prev, q1MissingWord: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                    placeholder="اكتبي الكلمة الناقصة"
                  />
                  <label className="text-sm text-muted-foreground">مدة السؤال (ثواني)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.q1Duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, q1Duration: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                  />
                </div>
                
                <div className="space-y-3 rounded-2xl border border-primary/10 bg-background/80 p-5">
                  <h4 className="text-lg font-semibold">سؤال 2 - صورة</h4>
                  <label className="text-sm text-muted-foreground">نص السؤال</label>
                  <input
                    type="text"
                    value={form.q2Question}
                    onChange={(e) => setForm((prev) => ({ ...prev, q2Question: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                    placeholder="اكتبي سؤال الصورة هنا"
                  />
                  <label className="text-sm text-muted-foreground">ارفع صورة السؤال</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                  />
                  {(imagePreviewUrl || form.q2ImageUrl) && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {imagePreviewUrl ? 'تم اختيار صورة جديدة.' : 'تم حفظ صورة مسبقاً.'}
                      </p>
                      <div className="aspect-4/3 w-full max-w-xs overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-muted/40">
                        <img
                          src={imagePreviewUrl || form.q2ImageUrl}
                          alt="صورة السؤال"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <label className="text-sm text-muted-foreground">مدة السؤال (ثواني)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.q2Duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, q2Duration: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                  />
                  
                </div>


                <div className="space-y-3 rounded-2xl border border-primary/10 bg-background/80 p-5">
                  <h4 className="text-lg font-semibold">سؤال 3 - الخيارات</h4>
                  <label className="text-sm text-muted-foreground">نص السؤال</label>
                  <input
                    type="text"
                    value={form.q3Question}
                    onChange={(e) => setForm((prev) => ({ ...prev, q3Question: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                    placeholder="اكتبي نص السؤال هنا"
                  />
                  <label className="text-sm text-muted-foreground">
                    الكلمات (10 كلمات، كل كلمة في سطر أو مفصولة بفاصلة)
                  </label>
                  <Textarea
                    value={q3ChoicesText}
                    onChange={(e) => setQ3ChoicesText(e.target.value)}
                    rows={5}
                    placeholder="كلمة 1&#10;كلمة 2&#10;كلمة 3..."
                  />
                  <label className="text-sm text-muted-foreground">مدة السؤال (ثواني)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.q3Duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, q3Duration: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                  />
                </div>


                <div className="space-y-3 rounded-2xl border border-primary/10 bg-background/80 p-5">
                  <h4 className="text-lg font-semibold">سؤال 4 - تحديد</h4>
                  <label className="text-sm text-muted-foreground">نص السؤال</label>
                  <Textarea
                    value={form.q4Question}
                    onChange={(e) => setForm((prev) => ({ ...prev, q4Question: e.target.value }))}
                    placeholder="اكتبي نص السؤال هنا"
                    rows={3}
                  />
                  <label className="text-sm text-muted-foreground">مدة السؤال (ثواني)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.q4Duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, q4Duration: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-2"
                  />
                </div>


                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={handleSave} disabled={savingConfig}>
                    {savingConfig ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </Button>
                  <Button variant="outline" onClick={handleStart}>
                    ابدأ المسابقة
                  </Button>
                </div>

              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'play' && (
        <Card className="relative min-h-[75vh] overflow-hidden border-2 border-primary/20 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fcd34d,transparent_45%),radial-gradient(circle_at_bottom,#93c5fd,transparent_45%)] opacity-40" />
          <CardHeader className="relative z-10 flex flex-wrap items-center justify-between gap-6 py-6">
              <div>
                {phase !== 'idle' && (
                  <p className="text-sm text-muted-foreground">{activeStep?.title}</p>
                )}
                <h3 className="text-3xl font-bold text-foreground">
                  {phase === 'intermission'
                    ? 'وقت البحث عن الإجابة الصحيحة'
                    : phase === 'finished'
                  ? 'انتهت الجولة'
                  : phase === 'idle'
                  ? 'هيا ننطلق؟'
                  : ''}
              </h3>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-background/90 px-5 py-3 text-lg font-bold text-foreground shadow-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>الوقت المتبقي: {padTime(timeLeft)} ثانية</span>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-8 pb-12">
          {phase === 'idle' && (
            <div className="rounded-3xl border border-primary/20 bg-background/80 p-10 text-center">
              <p className="text-lg text-muted-foreground">اضغط لبدء المسابقة.</p>
              <Button onClick={handleStart} className="mt-4">
                ابدأ المسابقة
              </Button>
            </div>
            )}

            {phase === 'intermission' && (
              <div className="rounded-3xl border border-dashed border-primary/30 bg-background/70 p-10 text-center">
                {/* <p className="text-lg text-muted-foreground">وقت البحت عن الإجابة! ركزوا بسرعة.</p> */}
                <p className="mt-3 text-3xl font-bold text-primary">نحو القمة</p>
              </div>
            )}

            {phase === 'finished' && (
              <div className="rounded-3xl border border-primary/20 bg-background/80 p-10 text-center">
                <p className="text-lg text-muted-foreground">أحسنتن! انتهت أسئلة الجولة.</p>
              </div>
            )}


            {phase === 'question' && activeStep?.type === 'imageQuestion' && (
              <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] items-center">
                <div className="rounded-3xl border border-primary/10 bg-background/80 p-6 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground">صورة السؤال</p>
                  <div className="mt-4 aspect-4/3 w-full overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-muted/40">
                    {activeStep.imageUrl ? (
                      <div className="relative h-full w-full">
                        {!isImageReady && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 text-sm text-muted-foreground">
                            جاري تحميل الصورة...
                          </div>
                        )}
                        <img
                          src={activeStep.imageUrl}
                          alt="سؤال"
                          className="h-full w-full object-cover"
                          onLoad={() => setIsImageReady(true)}
                          onError={() => setIsImageReady(true)}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        لم يتم اختيار صورة.
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-foreground">{activeStep.question}</p>
                </div>
              </div>
            )}


            {phase === 'question' && activeStep?.type === 'missingWord' && (
              <div className="space-y-6">
                <p className="text-lg font-semibold text-foreground">
                  {activeStep.question || activeStep.prompt}
                </p>
                <div className="rounded-3xl border border-primary/10 bg-background/80 p-6 text-center text-2xl font-bold text-foreground">
                  {activeStep.sentence}
                </div>
              </div>
            )}

            {phase === 'question' && activeStep?.type === 'choiceCircles' && (
              <div className="space-y-6">
                <p className="text-lg font-semibold text-foreground">{activeStep.question}</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {(activeStep.choices ?? []).map((choice) => (
                    <div
                      key={choice}
                      className="flex h-20 items-center justify-center rounded-full border-2 border-primary/20 bg-background/80 text-center text-sm font-semibold text-foreground shadow-sm"
                    >
                      {choice}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase === 'question' && activeStep?.type === 'text' && (
              <div className="rounded-3xl border border-primary/20 bg-background/80 p-6 text-center">
                <p className="text-lg font-semibold text-foreground">{activeStep.question}</p>
              </div>
            )}

            {phase !== 'idle' && (
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleSkip} className="rounded-full">
                  تخطي المرحلة
                </Button>
                <Button onClick={handleReset} className="rounded-full">
                  <TimerReset className="ml-2 h-4 w-4" />
                  ابدأ من جديد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}








