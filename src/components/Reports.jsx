import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export function Reports({ students }) {
  const [dateRange, setDateRange] = useState('week');

  const allLogs = students.flatMap((s) => s.interventionLogs);
  const totalInterventions = allLogs.length;
  const successCount = allLogs.filter((log) => log.outcome === 'success').length;
  const partialCount = allLogs.filter((log) => log.outcome === 'partial').length;
  const failCount = allLogs.filter((log) => log.outcome === 'fail').length;

  const successRate = totalInterventions > 0 ? ((successCount / totalInterventions) * 100).toFixed(1) : 0;

  const outcomeData = [
    { name: 'نجح', value: successCount, color: '#10B981' },
    { name: 'جزئي', value: partialCount, color: '#F59E0B' },
    { name: 'فشل', value: failCount, color: '#EF4444' },
  ];

  const interventionsByType = {};
  allLogs.forEach((log) => {
    interventionsByType[log.interventionTitle] = (interventionsByType[log.interventionTitle] || 0) + 1;
  });

  const interventionTypeData = Object.entries(interventionsByType)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'success':
        return { variant: 'default', text: 'نجح' };
      case 'partial':
        return { variant: 'secondary', text: 'جزئي' };
      case 'fail':
        return { variant: 'destructive', text: 'فشل' };
      default:
        return { variant: 'default', text: outcome };
    }
  };

  const handleExportCSV = () => {
    toast.success('تم تصدير التقرير كملف CSV');
  };

  const handleExportPDF = () => {
    toast.success('تم تصدير التقرير كملف PDF');
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            التقارير والإحصائيات
          </CardTitle>
          <CardDescription>
            تحليل نتائج التدخلات ومتابعة التقدم
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label className="mb-2 block">الفترة الزمنية</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">الأسبوع الحالي</SelectItem>
                  <SelectItem value="month">الشهر الحالي</SelectItem>
                  <SelectItem value="term">الفصل الدراسي</SelectItem>
                  <SelectItem value="all">جميع الفترات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير CSV
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">إجمالي التدخلات</p>
            <p className="text-3xl">{totalInterventions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">معدل النجاح</p>
            <p className="text-3xl text-success">{successRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">تدخلات ناجحة</p>
            <p className="text-3xl text-success">{successCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">تحتاج متابعة</p>
            <p className="text-3xl text-warning">{partialCount + failCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>نتائج التدخلات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={85}
                  innerRadius={35}
                  dataKey="value"
                  labelLine={{ strokeWidth: 2, stroke: '#666', length: 15, lengthType: 'percent' }}
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أكثر التدخلات استخداماً</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={interventionTypeData} margin={{ top: 20, right: 20, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  interval={0}
                  tick={{ fontSize: 11, fill: '#666' }}
                  tickMargin={12}
                  dy={10}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0B7285" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر التدخلات المسجلة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الطالب</TableHead>
                <TableHead className="text-right">التدخل</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">النتيجة</TableHead>
                <TableHead className="text-right">الملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLogs
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((log) => {
                  const student = students.find((s) =>
                    s.interventionLogs.some((l) => l.id === log.id)
                  );
                  const badge = getOutcomeBadge(log.outcome);
                  return (
                    <TableRow key={log.id}>
                      <TableCell>{student?.name}</TableCell>
                      <TableCell>{log.interventionTitle}</TableCell>
                      <TableCell>{new Date(log.date).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>
                        <Badge variant={badge.variant}>{badge.text}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{log.notes}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
