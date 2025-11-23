// import React, { useEffect, useState } from 'react';
// import { Button } from './ui/button';
// import { toast } from 'sonner';
// import { supabase } from '../lib/supabaseClient';

// export default function ActivityCreatorModal({ isOpen, onClose, onSave }) {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('visual');
//   const [learningStyle, setLearningStyle] = useState(null);
//   const [academicLevel, setAcademicLevel] = useState(null);
//   const [question, setQuestion] = useState('');
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     console.log('ActivityCreatorModal isOpen:', isOpen);
//     if (!isOpen) {
//       setTitle('');
//       setType('visual');
//       setLearningStyle(null);
//       setAcademicLevel(null);
//       setQuestion('');
//       setFile(null);
//       setPreviewUrl(null);
//       setUploading(false);
//     }
//   }, [isOpen]);

//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0] || null;
//     if (!f) return;
//     console.log('Selected file:', f);
//     setFile(f);
//     setPreviewUrl(URL.createObjectURL(f));
//   };

//   const uploadFileToStorage = async (file) => {
//     if (!file) return null;

//     const timestamp = Date.now();
//     const safeName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
//     const bucket = 'activities';

//     console.log('Uploading file to bucket:', bucket, safeName);

//     const { error: uploadError } = await supabase.storage
//       .from(bucket)
//       .upload(safeName, file, { cacheControl: '3600', upsert: true });

//     if (uploadError) throw new Error(`فشل رفع الملف: ${uploadError.message}`);

//     const { publicURL, error: urlError } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(safeName);

//     if (urlError) throw new Error(`فشل الحصول على رابط الملف: ${urlError.message}`);

//     console.log('File uploaded. Public URL:', publicURL);
//     return publicURL;
//   };

//   const handleSave = async () => {
//     if (!file) return toast.error('اختر ملف للنشاط');

//     try {
//       setUploading(true);

//       const file_url = await uploadFileToStorage(file);

//       toast.success('تم رفع الملف بنجاح');
//       console.log('Public URL:', file_url);

//       // ترجع URL للوالد
//       onSave && onSave(file_url);
//       onClose && onClose();
//     } catch (err) {
//       console.error('Error in handleSave:', err);
//       toast.error(`حدث خطأ أثناء رفع الملف: ${err.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium">إضافة نشاط جديد</h3>
//           <button onClick={() => onClose && onClose()} className="text-muted-foreground">✕</button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">عنوان النشاط</label>
//             <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-2 py-1 rounded" />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">نوع النشاط</label>
//             <select value={type} onChange={(e) => { setType(e.target.value); setFile(null); setPreviewUrl(null); }} className="w-full border px-2 py-1 rounded">
//               <option value="visual">بصري (صورة)</option>
//               <option value="kinesthetic">حركي (صورة/نشاط عملي)</option>
//               <option value="auditory">سمعي (ملف صوتي)</option>
//               <option value="academic">أكاديمي (أسئلة/تمارين)</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="block text-sm mb-1">النمط التعليمي (اختياري)</label>
//               <select value={learningStyle || ''} onChange={(e) => setLearningStyle(e.target.value || null)} className="w-full border px-2 py-1 rounded">
//                 <option value="">-- اختر --</option>
//                 <option value="visual">بصري</option>
//                 <option value="auditory">سمعي</option>
//                 <option value="kinesthetic">حركي</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm mb-1">المستوى الأكاديمي (اختياري)</label>
//               <select value={academicLevel || ''} onChange={(e) => setAcademicLevel(e.target.value || null)} className="w-full border px-2 py-1 rounded">
//                 <option value="">-- اختر --</option>
//                 <option value="advanced">متقدم</option>
//                 <option value="mid">متوسط</option>
//                 <option value="low">مبتدئ</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm mb-1">سؤال / وصف النشاط</label>
//             <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full border rounded p-2" rows={3} />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">ارفع ملف للنشاط {type === 'auditory' ? '(ملف صوتي)' : ''}</label>
//             <input type="file" accept={type === 'auditory' ? 'audio/*' : 'image/*,application/pdf'} onChange={handleFileChange} />
//             {previewUrl && (
//               <div className="mt-2">
//                 {type === 'auditory' ? <audio controls src={previewUrl} /> : <img src={previewUrl} alt="preview" className="w-40 h-40 object-cover rounded" />}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end gap-2">
//             <Button type="button" variant="ghost" onClick={() => onClose && onClose()}>إلغاء</Button>
//             <Button type="button" onClick={handleSave} disabled={uploading}>{uploading ? 'جاري الحفظ...' : 'حفظ النشاط'}</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
