
import { useState, useEffect } from 'react';
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
import type { Counselor, Activity, Executive } from '@/pages/Index';

interface ActivityManagementProps {
  executive: Executive;
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
  '7° Básico', '8° Básico',
  '1° Medio', '2° Medio', '3° Medio', '4° Medio'
];

const parallels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'];

export const ActivityManagement = ({ 
  executive,
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

  ////////////////
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://prouniversitas-pbezama.pythonanywhere.com/api/obtiene_agendadoreact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: counselor.email,
          colegio: counselor.school,
          colegio_manual: counselor.school_manual,
          region: counselor.region,
          comuna: counselor.commune
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener las actividades');
      }

      const data = await response.json();
      
      // Transformar los datos de la API al formato que espera tu aplicación
      const formattedActivities = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.actividad,
        date: item.fecha,
        startTime: item.hora,
        description: item.descripcion || '',
        course: item.curso,
        parallel: item.paralelo,
        studentCount: Number(item.cant_alumnos)
      }));

      setActivities(formattedActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [counselor]);


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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  const activityData = {
    row_id: editingId || '', // Solo necesario para edición
    correo: counselor.email,
    colegio: counselor.school,
    region: counselor.region,
    comuna: counselor.commune,
    curso: formData.course,
    paralelo: formData.parallel,
    actividad: formData.title,
    fecha: formData.date,
    hora: formData.startTime,
    ejecutiva: executive.name,
    cant_alumnos: formData.studentCount,
    colegio_manual: counselor.school_manual,
    nombre_completo: counselor.fullName,
    cargo: counselor.position,
    telefono: counselor.phone,
    descripcion: formData.description
  };

  try {
    const endpoint = editingId 
      ? 'https://prouniversitas-pbezama.pythonanywhere.com/api/editar_agendadoreact'
      : 'https://prouniversitas-pbezama.pythonanywhere.com/api/guarda_agendadoreact';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al guardar');
    }

    // Manejar la respuesta y actualizar el estado
    if (editingId) {
      setActivities(activities.map(a => 
        a.id === editingId ? { ...a, ...formData, studentCount: Number(formData.studentCount) } : a
      ));
      toast({
        title: "¡Actividad actualizada!",
        description: data.message || "Cambios guardados correctamente",
      });
    } else {
      const newActivity: Activity = {
        id: data.inserted_id?.toString() || Date.now().toString(),
        ...formData,
        studentCount: Number(formData.studentCount)
      };
      setActivities([newActivity, ...activities]);
      toast({
        title: "¡Actividad creada!",
        description: data.message || "Actividad agregada al cronograma",
      });
    }

    // Resetear el formulario
    setFormData({
      title: '',
      date: '',
      startTime: '',
      description: '',
      course: '',
      parallel: '',
      studentCount: ''
    });
    setEditingId(null);

    await fetchActivities();

  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Error al guardar",
      variant: "destructive"
    });
  }
};

  const handleEdit = (activity: Activity) => {
    setFormData({
      ...activity,
      studentCount: activity.studentCount.toString()
    });
    setEditingId(activity.id);
    console.log(activity.id)
  };

  /////
  //const handleDelete = (id: string) => {
    //setActivities(activities.filter(a => a.id !== id));
    //toast({
      //title: "Actividad eliminada",
      //description: "Se ha removido del cronograma.",
    //});
  //};

  const handleDelete = async (id: string) => {
  try {
    const response = await fetch('https://prouniversitas-pbezama.pythonanywhere.com/api/eliminar_agendadoreact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        row_id: id // Solo enviamos el row_id que espera el backend
      })
    });

    const data = await response.json(); // Parsear la respuesta JSON

    if (!response.ok) {
      throw new Error(data.error || 'Error al eliminar en el servidor');
    }

    // Si la API responde OK, actualizar el estado local
    setActivities(activities.filter(a => a.id !== id));
    toast({
      title: "Actividad eliminada",
      description: "Se ha removido del cronograma correctamente.",
    });

    await fetchActivities();

  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Error al eliminar",
      description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
      variant: "destructive"
    });
  }
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
            <p className="text-muted-foreground">{counselor.position} • {counselor.school === '' ? counselor.school_manual : counselor.school}</p>
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
            {!isLoading && activities.length > 0 && (
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium animate-bounce-in">
                {activities.length} actividad{activities.length !== 1 ? 'es' : ''} registrada{activities.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p>Cargando actividades...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/30">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={fetchActivities}
              >
                Reintentar
              </Button>
            </div>
          ) : activities.length === 0 ? (
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
