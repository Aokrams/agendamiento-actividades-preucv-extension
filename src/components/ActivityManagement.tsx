
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Calendar, Clock, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState } from '@/components/EmptyState';
import type { Counselor, Activity } from '@/pages/Index';

interface ActivityManagementProps {
  counselor: Counselor;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  onBack: () => void;
}

const activityTitles = [
  'Test Midas',
  'Test Holland',
  'Ensayo lenguaje',
  'Ensayo matemáticas'
];

const courses = [
  '1° Básico', '2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico', '7° Básico', '8° Básico',
  '1° Medio', '2° Medio', '3° Medio', '4° Medio'
];

const parallels = ['A', 'B', 'C', 'D', 'E', 'F'];

export const ActivityManagement = ({ 
  counselor, 
  activities, 
  setActivities, 
  onBack 
}: ActivityManagementProps) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    description: '',
    course: '',
    parallel: '',
    studentCount: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const getAvatarDetails = (avatar: string) => {
    const [colorClass, initials] = avatar.split('|');
    return { colorClass, initials };
  };

  const { colorClass, initials } = getAvatarDetails(counselor.avatar);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = 'Debes seleccionar un tipo de actividad';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es obligatoria';
    }

    if (!formData.course) {
      newErrors.course = 'Debes seleccionar un curso';
    }

    if (!formData.parallel) {
      newErrors.parallel = 'Debes seleccionar un paralelo';
    }

    if (!formData.studentCount) {
      newErrors.studentCount = 'La cantidad de alumnos es obligatoria';
    } else if (isNaN(Number(formData.studentCount)) || Number(formData.studentCount) <= 0) {
      newErrors.studentCount = 'Debe ser un número mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const activity: Activity = {
      id: editingId || Date.now().toString(),
      ...formData,
      studentCount: Number(formData.studentCount)
    };

    if (editingId) {
      setActivities(activities.map(a => a.id === editingId ? activity : a));
      setEditingId(null);
      toast({
        title: "¡Actividad actualizada! ✨",
        description: "Los cambios se han guardado correctamente.",
      });
    } else {
      setActivities([activity, ...activities]);
      toast({
        title: "¡Actividad guardada, buen trabajo! 🎯",
        description: `"${formData.title}" se añadió al cronograma.`,
      });
    }

    setFormData({
      title: '',
      date: '',
      startTime: '',
      description: '',
      course: '',
      parallel: '',
      studentCount: ''
    });
  };

  const handleEdit = (activity: Activity) => {
    setFormData({
      ...activity,
      studentCount: activity.studentCount.toString()
    });
    setEditingId(activity.id);
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    toast({
      title: "Actividad eliminada",
      description: "Se ha removido del cronograma.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      startTime: '',
      description: '',
      course: '',
      parallel: '',
      studentCount: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center text-white font-semibold`}>
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Actividades de {counselor.fullName || 'Orientador'}</h1>
            <p className="text-muted-foreground">{counselor.position} • {counselor.school}</p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Ejecutiva</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Datos del orientador</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-sm font-medium">Actividades</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {editingId ? 'Editar actividad' : 'Nueva actividad'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tipo de actividad *</Label>
                <Select onValueChange={(value) => handleInputChange('title', value)} value={formData.title}>
                  <SelectTrigger className={errors.title ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona el tipo de actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora inicio *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={errors.startTime ? 'border-destructive' : ''}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">{errors.startTime}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Curso *</Label>
                  <Select onValueChange={(value) => handleInputChange('course', value)} value={formData.course}>
                    <SelectTrigger className={errors.course ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && (
                    <p className="text-sm text-destructive">{errors.course}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parallel">Paralelo *</Label>
                  <Select onValueChange={(value) => handleInputChange('parallel', value)} value={formData.parallel}>
                    <SelectTrigger className={errors.parallel ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Paralelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {parallels.map((parallel) => (
                        <SelectItem key={parallel} value={parallel}>
                          {parallel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.parallel && (
                    <p className="text-sm text-destructive">{errors.parallel}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCount">N° Alumnos *</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    min="1"
                    value={formData.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    placeholder="0"
                    className={errors.studentCount ? 'border-destructive' : ''}
                  />
                  {errors.studentCount && (
                    <p className="text-sm text-destructive">{errors.studentCount}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descripción de la actividad..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Actualizar actividad' : 'Agregar actividad'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Activities List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Cronograma de actividades
            </h2>
            {activities.length > 0 && (
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium animate-bounce-in">
                {activities.length} actividad{activities.length !== 1 ? 'es' : ''} registrada{activities.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {activities.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
