
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Counselor } from '@/pages/Index';

interface CounselorFormProps {
  onCounselorSaved: (counselor: Counselor) => void;
  onBack: () => void;
}

const positions = [
  'Orientador',
  'Psicólogo',
  'Trabajador Social',
  'Coordinador de Bienestar',
  'Psicopedagogo'
];

const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500'
];

export const CounselorForm = ({ onCounselorSaved, onBack }: CounselorFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateAvatar = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    return `${colorClass}|${initials}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }
    
    if (!formData.position) {
      newErrors.position = 'Debes seleccionar un cargo';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Ingresa un correo válido (@colegio.edu)';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono/extensión es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Oops! Faltan algunos datos",
        description: "Revisa los campos marcados en rojo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const counselor: Counselor = {
      id: Date.now().toString(),
      ...formData,
      avatar: generateAvatar(formData.fullName)
    };

    toast({
      title: "¡Orientador guardado con éxito! 🎉",
      description: `Bienvenido/a ${formData.fullName}. Ahora vamos con las actividades.`,
    });

    setIsLoading(false);
    onCounselorSaved(counselor);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo orientador</h1>
          <p className="text-muted-foreground">¡Cuéntanos quién guiará a los estudiantes!</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="ml-2 text-sm font-medium">Datos del orientador</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm">
            2
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Actividades</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ej: María González López"
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Select onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger className={errors.position ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona un cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo institucional *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="maria.gonzalez@colegio.edu"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">Solo correo @colegio.edu</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono / Extensión *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: +57 300 123 4567 o Ext. 1234"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar orientador
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
