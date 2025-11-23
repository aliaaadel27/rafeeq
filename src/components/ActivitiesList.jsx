import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء جلب الأنشطة.');
    } finally {
      setLoading(false);
    }
  };

  // جلب الأنشطة أول مرة
  useEffect(() => {
    fetchActivities();
  }, []);

  // لتحديث قائمة الأنشطة فور أي تعديل أو إضافة
  const handleActivityUpdate = (updatedActivity) => {
    setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
  };

  const handleActivityAdd = (newActivity) => {
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">قائمة الأنشطة</h2>

      {loading && <p>جاري تحميل الأنشطة...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && activities.length === 0 && <p>لا توجد أنشطة حالياً.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map(act => (
          <Card key={act.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent>
              <h3 className="font-medium">{act.title || act.type}</h3>
              <p className="text-sm text-muted-foreground">
                نوع النشاط: {act.type} {act.learning_style ? `• ${act.learning_style}` : ''} {act.academic_level ? `• ${act.academic_level}` : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                تاريخ الإنشاء: {new Date(act.created_at).toLocaleDateString('ar-SA')}
              </p>
              <Button size="sm" className="mt-2" onClick={() => console.log(act)}>
                عرض التفاصيل
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
