// Sample data for Teacher Differentiation Dashboard (JavaScript)

export const students = [
  {
    id: '1',
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohamed',
    avatar: '👨‍🎓',
    tags: ['ضعف قراءة', 'بصري'],
    strengths: ['رياضيات قوية', 'منطق جيد'],
    difficulties: ['صعوبة في القراءة', 'بطء في فهم النصوص'],
    learning_style: 'بصري',
    dateOfBirth: '2012-03-15',
    recentInterventions: [
      {
        id: 'log1',
        interventionId: 'int1',
        interventionTitle: 'قراءة بالصور',
        date: '2025-11-10',
        outcome: 'نجح',
        notes: 'تحسن ملحوظ في الفهم'
      },
      {
        id: 'log2',
        interventionId: 'int2',
        interventionTitle: 'تمرين الكلمات المصورة',
        date: '2025-11-08',
        outcome: 'جزئي',
        notes: 'يحتاج مزيد من الوقت'
      }
    ]
  },
  {
    id: '2',
    name: 'فاطمة علي',
    nameEn: 'Fatima Ali',
    avatar: '👩‍🎓',
    tags: ['متميز', 'سريع التعلم'],
    strengths: ['قراءة متقدمة', 'فهم سريع', 'إبداعية'],
    difficulties: [],
    learning_style: 'سمعي',
    dateOfBirth: '2012-07-22',
    recentInterventions: [
      {
        id: 'log3',
        interventionId: 'int8',
        interventionTitle: 'مشروع بحثي متقدم',
        date: '2025-11-12',
        outcome: 'نجح',
        notes: 'أداء متميز'
      }
    ]
  },
  {
    id: '3',
    name: 'خالد أحمد',
    nameEn: 'Khaled Ahmed',
    avatar: '👦',
    tags: ['بطيء كتابة', 'حركي'],
    strengths: ['نشيط', 'متعاون'],
    difficulties: ['الكتابة البطيئة', 'صعوبة في التركيز'],
    learning_style: 'حركي',
    dateOfBirth: '2012-05-10',
    recentInterventions: [
      {
        id: 'log4',
        interventionId: 'int3',
        interventionTitle: 'التعلم بالحركة',
        date: '2025-11-11',
        outcome: 'نجح',
        notes: 'استجابة ممتازة'
      }
    ]
  },
  {
    id: '4',
    name: 'نور حسن',
    nameEn: 'Nour Hassan',
    avatar: '👧',
    tags: ['ADHD', 'بصري'],
    strengths: ['طاقة عالية', 'تفكير خلاق'],
    difficulties: ['صعوبة التركيز', 'الجلوس لفترات طويلة'],
    learning_style: 'بصري',
    dateOfBirth: '2012-09-18',
    recentInterventions: [
      {
        id: 'log5',
        interventionId: 'int4',
        interventionTitle: 'فترات راحة منتظمة',
        date: '2025-11-10',
        outcome: 'جزئي',
        notes: 'تحسن طفيف'
      }
    ]
  },
  {
    id: '5',
    name: 'سارة عبدالله',
    nameEn: 'Sara Abdullah',
    avatar: '👩',
    tags: ['ضعف قراءة', 'سمعي'],
    strengths: ['استماع جيد', 'ذاكرة سمعية قوية'],
    difficulties: ['عسر القراءة', 'صعوبة في التهجئة'],
    learning_style: 'سمعي',
    dateOfBirth: '2012-12-05',
    recentInterventions: [
      {
        id: 'log6',
        interventionId: 'int5',
        interventionTitle: 'الكتب المسموعة',
        date: '2025-11-09',
        outcome: 'نجح',
        notes: 'فهم ممتاز عند الاستماع'
      }
    ]
  },
  {
    id: '6',
    name: 'يوسف إبراهيم',
    nameEn: 'Youssef Ibrahim',
    avatar: '👨',
    tags: ['بطيء كتابة', 'بصري'],
    strengths: ['رسم جيد', 'منظم'],
    difficulties: ['الكتابة اليدوية', 'بطء في إنجاز المهام'],
    learning_style: 'بصري',
    dateOfBirth: '2012-04-27',
    recentInterventions: [
      {
        id: 'log7',
        interventionId: 'int6',
        interventionTitle: 'استخدام الأدوات الرقمية',
        date: '2025-11-12',
        outcome: 'نجح',
        notes: 'تحسن كبير مع الكتابة الرقمية'
      }
    ]
  },
  {
    id: '7',
    name: 'مريم سعيد',
    nameEn: 'Mariam Said',
    avatar: '👧',
    tags: ['متميز', 'بصري'],
    strengths: ['رياضيات متقدمة', 'حل المشكلات'],
    difficulties: [],
    learning_style: 'بصري',
    dateOfBirth: '2012-11-30',
    recentInterventions: [
      {
        id: 'log8',
        interventionId: 'int8',
        interventionTitle: 'مشروع بحثي متقدم',
        date: '2025-11-11',
        outcome: 'نجح',
        notes: 'إنجاز رائع'
      }
    ]
  },
  {
    id: '8',
    name: 'عمر فهد',
    nameEn: 'Omar Fahad',
    avatar: '👦',
    tags: ['حركي', 'ADHD'],
    strengths: ['رياضة', 'عمل جماعي'],
    difficulties: ['التركيز', 'الجلوس الهادئ'],
    learning_style: 'حركي',
    dateOfBirth: '2012-06-14',
    recentInterventions: [
      {
        id: 'log9',
        interventionId: 'int3',
        interventionTitle: 'التعلم بالحركة',
        date: '2025-11-10',
        outcome: 'نجح',
        notes: 'نتائج إيجابية'
      }
    ]
  },
  {
    id: '9',
    name: 'ليلى خالد',
    nameEn: 'Layla Khaled',
    avatar: '👩',
    tags: ['سمعي', 'خجول'],
    strengths: ['استماع ممتاز', 'متابعة التعليمات'],
    difficulties: ['المشاركة الصفية', 'الثقة بالنفس'],
    learning_style: 'سمعي',
    dateOfBirth: '2012-08-21',
    recentInterventions: [
      {
        id: 'log10',
        interventionId: 'int7',
        interventionTitle: 'العمل في مجموعات صغيرة',
        date: '2025-11-09',
        outcome: 'جزئي',
        notes: 'تشارك أكثر في مجموعات صغيرة'
      }
    ]
  },
  {
    id: '10',
    name: 'حمزة ناصر',
    nameEn: 'Hamza Nasser',
    avatar: '👨',
    tags: ['بطيء كتابة', 'بصري'],
    strengths: ['ذاكرة بصرية', 'دقيق'],
    difficulties: ['الكتابة', 'السرعة'],
    learning_style: 'بصري',
    dateOfBirth: '2012-10-03',
    recentInterventions: [
      {
        id: 'log11',
        interventionId: 'int6',
        interventionTitle: 'استخدام الأدوات الرقمية',
        date: '2025-11-11',
        outcome: 'نجح',
        notes: 'يفضل الكتابة الرقمية'
      }
    ]
  },
  {
    id: '11',
    name: 'رنا محمود',
    nameEn: 'Rana Mahmoud',
    avatar: '👧',
    tags: ['ضعف قراءة', 'حركي'],
    strengths: ['فنون', 'عملي'],
    difficulties: ['القراءة', 'التركيز على النصوص'],
    learning_style: 'حركي',
    dateOfBirth: '2012-02-17',
    recentInterventions: [
      {
        id: 'log12',
        interventionId: 'int1',
        interventionTitle: 'قراءة بالصور',
        date: '2025-11-08',
        outcome: 'جزئي',
        notes: 'تحتاج مزيد من الدعم'
      }
    ]
  },
  {
    id: '12',
    name: 'عبدالرحمن صالح',
    nameEn: 'Abdulrahman Saleh',
    avatar: '👦',
    tags: ['متميز', 'سمعي'],
    strengths: ['حفظ سريع', 'فهم عميق'],
    difficulties: [],
    learning_style: 'سمعي',
    dateOfBirth: '2012-01-09',
    recentInterventions: [
      {
        id: 'log13',
        interventionId: 'int8',
        interventionTitle: 'مشروع بحثي متقدم',
        date: '2025-11-12',
        outcome: 'نجح',
        notes: 'أداء متفوق'
      }
    ]
  },
  {
    id: '13',
    name: 'هدى عامر',
    nameEn: 'Huda Amer',
    avatar: '👩',
    tags: ['ADHD', 'حركي'],
    strengths: ['نشاط', 'حماس'],
    difficulties: ['التركيز', 'إتمام المهام'],
    learning_style: 'حركي',
    dateOfBirth: '2012-07-25',
    recentInterventions: [
      {
        id: 'log14',
        interventionId: 'int4',
        interventionTitle: 'فترات راحة منتظمة',
        date: '2025-11-10',
        outcome: 'جزئي',
        notes: 'تحسن مع فترات الراحة'
      }
    ]
  },
  {
    id: '14',
    name: 'طارق عمر',
    nameEn: 'Tarek Omar',
    avatar: '👨',
    tags: ['بصري', 'هادئ'],
    strengths: ['تركيز عالي', 'منظم'],
    difficulties: ['المشاركة الشفوية'],
    learning_style: 'بصري',
    dateOfBirth: '2012-03-28',
    recentInterventions: [
      {
        id: 'log15',
        interventionId: 'int7',
        interventionTitle: 'العمل في مجموعات صغيرة',
        date: '2025-11-09',
        outcome: 'نجح',
        notes: 'يشارك بشكل أفضل'
      }
    ]
  },
  {
    id: '15',
    name: 'دانة جمال',
    nameEn: 'Dana Jamal',
    avatar: '👧',
    tags: ['بطيء كتابة', 'سمعي'],
    strengths: ['فهم سمعي ممتاز', 'صبورة'],
    difficulties: ['الكتابة', 'التعبير الكتابي'],
    learning_style: 'سمعي',
    dateOfBirth: '2012-09-12',
    recentInterventions: [
      {
        id: 'log16',
        interventionId: 'int5',
        interventionTitle: 'الكتب المسموعة',
        date: '2025-11-11',
        outcome: 'نجح',
        notes: 'تستجيب بشكل رائع'
      }
    ]
  },
  {
    id: '16',
    name: 'زياد رامي',
    nameEn: 'Ziad Rami',
    avatar: '👦',
    tags: ['ضعف قراءة', 'حركي'],
    strengths: ['رياضة', 'اجتماعي'],
    difficulties: ['القراءة', 'الكتابة'],
    learning_style: 'حركي',
    dateOfBirth: '2012-05-19',
    recentInterventions: [
      {
        id: 'log17',
        interventionId: 'int3',
        interventionTitle: 'التعلم بالحركة',
        date: '2025-11-10',
        outcome: 'نجح',
        notes: 'يتعلم بشكل أفضل عند التحرك'
      }
    ]
  },
  {
    id: '17',
    name: 'جنى وليد',
    nameEn: 'Jana Walid',
    avatar: '👧',
    tags: ['متميز', 'بصري'],
    strengths: ['قيادة', 'منظمة', 'متفوقة'],
    difficulties: [],
    learning_style: 'بصري',
    dateOfBirth: '2012-04-05',
    recentInterventions: [
      {
        id: 'log18',
        interventionId: 'int8',
        interventionTitle: 'مشروع بحثي متقدم',
        date: '2025-11-12',
        outcome: 'نجح',
        notes: 'تجاوزت التوقعات'
      }
    ]
  },
  {
    id: '18',
    name: 'محمود فيصل',
    nameEn: 'Mahmoud Faisal',
    avatar: '👨',
    tags: ['ADHD', 'بصري'],
    strengths: ['إبداعي', 'طاقة عالية'],
    difficulties: ['الانتباه', 'الاستمرارية'],
    learning_style: 'بصري',
    dateOfBirth: '2012-11-20',
    recentInterventions: [
      {
        id: 'log19',
        interventionId: 'int4',
        interventionTitle: 'فترات راحة منتظمة',
        date: '2025-11-10',
        outcome: 'جزئي',
        notes: 'يحتاج استراتيجيات إضافية'
      }
    ]
  },
  {
    id: '19',
    name: 'ريم ماجد',
    nameEn: 'Reem Majed',
    avatar: '👩',
    tags: ['سمعي', 'هادئ'],
    strengths: ['استماع نشط', 'متابعة دقيقة'],
    difficulties: ['الثقة في العرض'],
    learning_style: 'سمعي',
    dateOfBirth: '2012-06-08',
    recentInterventions: [
      {
        id: 'log20',
        interventionId: 'int7',
        interventionTitle: 'العمل في مجموعات صغيرة',
        date: '2025-11-09',
        outcome: 'نجح',
        notes: 'تقدم ملحوظ في المشاركة'
      }
    ]
  },
  {
    id: '20',
    name: 'كريم سامي',
    nameEn: 'Karim Sami',
    avatar: '👦',
    tags: ['بطيء كتابة', 'بصري'],
    strengths: ['دقة', 'انتباه للتفاصيل'],
    difficulties: ['سرعة الكتابة', 'إنهاء في الوقت'],
    learning_style: 'بصري',
    dateOfBirth: '2012-08-16',
    recentInterventions: [
      {
        id: 'log21',
        interventionId: 'int6',
        interventionTitle: 'استخدام الأدوات الرقمية',
        date: '2025-11-11',
        outcome: 'نجح',
        notes: 'أداء أفضل مع التقنية'
      }
    ]
  }
];

export const interventions = [
  {
    id: 'int1',
    title: 'قراءة بالصور',
    titleEn: 'Picture Reading',
    description: 'استخدام الصور والرسومات لدعم فهم النص',
    difficulty: 'سهل',
    relatedTags: ['ضعف قراءة', 'بصري']
  },
  {
    id: 'int2',
    title: 'تمرين الكلمات المصورة',
    titleEn: 'Visual Word Exercise',
    description: 'ربط الكلمات بالصور لتحسين الذاكرة البصرية',
    difficulty: 'سهل',
    relatedTags: ['ضعف قراءة', 'بصري']
  },
  {
    id: 'int3',
    title: 'التعلم بالحركة',
    titleEn: 'Learning Through Movement',
    description: 'دمج الحركة والنشاط البدني في عملية التعلم',
    difficulty: 'متوسط',
    relatedTags: ['حركي', 'ADHD']
  },
  {
    id: 'int4',
    title: 'فترات راحة منتظمة',
    titleEn: 'Regular Breaks',
    description: 'جدولة فترات راحة قصيرة لتحسين التركيز',
    difficulty: 'سهل',
    relatedTags: ['ADHD', 'حركي']
  },
  {
    id: 'int5',
    title: 'الكتب المسموعة',
    titleEn: 'Audio Books',
    description: 'استخدام الكتب الصوتية لتحسين الفهم',
    difficulty: 'سهل',
    relatedTags: ['ضعف قراءة', 'سمعي']
  },
  {
    id: 'int6',
    title: 'استخدام الأدوات الرقمية',
    titleEn: 'Digital Tools',
    description: 'الاستعانة بالحاسوب والأجهزة اللوحية للكتابة',
    difficulty: 'متوسط',
    relatedTags: ['بطيء كتابة', 'بصري']
  },
  {
    id: 'int7',
    title: 'العمل في مجموعات صغيرة',
    titleEn: 'Small Group Work',
    description: 'تشجيع المشاركة من خلال مجموعات صغيرة',
    difficulty: 'سهل',
    relatedTags: ['خجول', 'سمعي']
  },
  {
    id: 'int8',
    title: 'مشروع بحثي متقدم',
    titleEn: 'Advanced Research Project',
    description: 'مهام تحدي للطلاب المتميزين',
    difficulty: 'صعب',
    relatedTags: ['متميز']
  },
  {
    id: 'int9',
    title: 'خرائط ذهنية',
    titleEn: 'Mind Mapping',
    description: 'استخدام الخرائط الذهنية لتنظيم الأفكار',
    difficulty: 'متوسط',
    relatedTags: ['بصري', 'منظم']
  },
  {
    id: 'int10',
    title: 'التسجيل الصوتي للملاحظات',
    titleEn: 'Audio Note Recording',
    description: 'تسجيل الملاحظات بدلاً من كتابتها',
    difficulty: 'سهل',
    relatedTags: ['بطيء كتابة', 'سمعي']
  }
];

export const classrooms = [
  {
    id: 'class1',
    name: 'الصف السادس - أ',
    grade: '6A',
    studentIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  {
    id: 'class2',
    name: 'الصف السادس - ب',
    grade: '6B',
    studentIds: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
  },
  {
    id: 'class3',
    name: 'الصف الخامس - أ',
    grade: '5A',
    studentIds: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']
  }
];

export const teacherInfo = {
  name: 'المعلمة سارة أحمد',
  nameEn: 'Teacher Sara Ahmed',
  email: 'sara.ahmed@school.edu',
  subjects: ['اللغة العربية', 'التربية الإسلامية']
};
