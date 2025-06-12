
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Calendar, Clock, BookOpen, Edit, Trash } from 'lucide-react';
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
    endTime: '',
    description: ''
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es obligatoria';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'La hora de fin es obligatoria';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior al inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const activity: Activity = {
      id: editingId || Date.now().toString(),
      ...formData
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
      endTime: '',
      description: ''
    });
  };

  const handleEdit = (activity: Activity) => {
    setFormData(activity);
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
      endTime: '',
      description: ''
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
            <h1 className="text-3xl font-bold">Actividades de {counselor.fullName}</h1>
            <p className="text-muted-foreground">{counselor.position} • {counselor.email}</p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Datos del orientador</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            2
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
                <Label htmlFor="title">Título / Nombre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Sesión individual de orientación vocacional"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={errors.endTime ? 'border-destructive' : ''}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción corta</Label>
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
