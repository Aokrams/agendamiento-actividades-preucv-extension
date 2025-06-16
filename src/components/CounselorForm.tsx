
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Counselor, Executive } from '@/pages/Index';

interface CounselorFormProps {
  executive: Executive;
  onCounselorSaved: (counselor: Counselor) => void;
  onBack: (formData?: Partial<Counselor>) => void;
  initialData?: Partial<Counselor>;
}

const positions = [
  'Orientador',
  'Psicólogo',
  'Trabajador Social',
  'Coordinador de Bienestar',
  'Psicopedagogo'
];

const regions = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    "Libertador General Bernardo O'Higgins",
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén del General Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
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

export const CounselorForm = ({ executive, onCounselorSaved, onBack, initialData  }: CounselorFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    region: '',
    commune: '',
    school: '',
    school_manual:''
  });

  const [comunas, setComunas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingComunas, setLoadingComunas] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colegios, setColegios] = useState<string[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);


  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || prev.fullName,
        position: initialData.position || prev.position,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,
        region: initialData.region || prev.region,
        commune: initialData.commune || prev.commune,
        school: initialData.school || prev.school,
        school_manual: initialData.school_manual || prev.school_manual
      }));
    }
  }, [initialData]);

  // Efecto para cargar comunas cuando cambia la región
  useEffect(() => {
    const fetchComunas = async () => {
      if (!formData.region) {
        setComunas([]);
        return;
      }

      setLoadingComunas(true);
      try {
        const response = await fetch(`https://prouniversitas-pbezama.pythonanywhere.com/api/comunasreact/${encodeURIComponent(formData.region)}`);
        if (!response.ok) {
          throw new Error('Error al obtener las comunas');
        }
        const data = await response.json();
        setComunas(data);
        // Resetear comuna seleccionada si ya no está en las nuevas comunas
        if (formData.commune && !data.includes(formData.commune)) {
          setFormData(prev => ({ ...prev, commune: '' }));
        }
      } catch (error) {
        console.error('Error fetching comunas:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las comunas",
          variant: "destructive",
        });
      } finally {
        setLoadingComunas(false);
      }
    };

    fetchComunas();
  }, [formData.region]);

  // Efecto para cargar colegios cuando cambia la comuna
  useEffect(() => {
    const fetchColegios = async () => {
      if (!formData.commune) {
        setColegios([]);
        return;
      }

      setLoadingColegios(true);
      try {
        const response = await fetch(`https://prouniversitas-pbezama.pythonanywhere.com/api/colegiosreact/${encodeURIComponent(formData.region)}/${encodeURIComponent(formData.commune)}`);
        if (!response.ok) {
          throw new Error('Error al obtener los colegios');
        }
        const data = await response.json();
        setColegios(data);
        // Resetear colegio seleccionado si ya no está en los nuevos colegios
        if (formData.school && !data.includes(formData.school)) {
          setFormData(prev => ({ ...prev, school: '' }));
        }
      } catch (error) {
        console.error('Error fetching colegios:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los colegios",
          variant: "destructive",
        });
      } finally {
        setLoadingColegios(false);
      }
    };

    fetchColegios();
  }, [formData.commune]);


  

  const generateAvatar = (name: string) => {
    const initials = name || 'OR';
    const acronym = initials.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    return `${colorClass}|${acronym}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.position) {
      newErrors.position = 'Debes seleccionar un cargo';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!formData.region) {
      newErrors.region = 'Debes seleccionar una región';
    }

    if (!formData.commune.trim()) {
      newErrors.commune = 'La comuna es obligatoria';
    }

    if (!formData.school.trim() && !formData.school_manual.trim()) {
      newErrors.school_manual = 'Seleccione un colegio o escribalo';
      newErrors.school = 'Seleccione un colegio o escribalo';
    }

    if (!/^569\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'El formato de numero es: 569XXXXXXXX';
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
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const counselor: Counselor = {
      id: Date.now().toString(),
      ...formData,
      avatar: generateAvatar(formData.fullName || 'Orientador'),
      executiveId: executive.id
    };

    toast({
      title: "¡Orientador guardado con éxito! 🎉",
      description: `Datos guardados correctamente. Ahora vamos con las actividades.`,
    });

    setIsLoading(false);
    onCounselorSaved(counselor);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackClick = () => {
    onBack(formData); // Envía los datos actuales al padre
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBackClick}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo orientador</h1>
          <p className="text-muted-foreground">Ejecutiva: <strong>{executive.name}</strong></p>
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
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="ml-2 text-sm font-medium">Datos del orientador</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm">
            3
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Actividades</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información del orientador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ej: María González López"
                />
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
                <Label htmlFor="email">Correo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              

              


              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Ej: 56912345678"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!formData.email) {
                        toast({
                          title: "Error",
                          description: "Por favor ingresa un email primero",
                          variant: "destructive",
                        });
                        return;
                      }

                      setIsSearchingPhone(true);
                      try {
                        const response = await fetch(`https://prouniversitas-pbezama.pythonanywhere.com/api/telefonoreact`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            email: formData.email
                          })
                        });

                        if (!response.ok) {
                          throw new Error('Error al obtener el teléfono');
                        }

                        const telefono = await response.json();
                        if (telefono) {
                          setFormData(prev => ({ ...prev, phone: telefono }));
                        } else {
                          toast({
                            title: "No encontrado",
                            description: "No se encontró un teléfono asociado a este email",
                            variant: "default",
                          });
                        }
                      } catch (error) {
                        console.error('Error buscando teléfono:', error);
                        toast({
                          title: "Error",
                          description: "No se pudo obtener el teléfono",
                          variant: "destructive",
                        });
                      } finally {
                        setIsSearchingPhone(false);
                      }
                    }}
                    disabled={isSearchingPhone || !formData.email}
                  >
                    {isSearchingPhone ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Buscando...
                      </>
                    ) : (
                      "Buscar Teléfono"
                    )}
                  </Button>
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <Select 
                  onValueChange={(value) => handleInputChange('region', value)}
                  value={formData.region}
                >
                  <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-destructive">{errors.region}</p>
                )}
              </div>

              {/* Selector de Comuna */}
              <div className="space-y-2">
                <Label htmlFor="commune">Comuna *</Label>
                <Select
                  onValueChange={(value) => handleInputChange('commune', value)}
                  value={formData.commune}
                  disabled={!formData.region || loadingComunas}
                >
                  <SelectTrigger className={errors.commune ? 'border-destructive' : ''}>
                    {loadingComunas ? (
                      <span>Cargando comunas...</span>
                    ) : (
                      <SelectValue placeholder={
                        formData.region
                          ? comunas.length === 0
                            ? 'No hay comunas disponibles'
                            : 'Selecciona una comuna'
                          : 'Primero selecciona una región'
                      } />
                    )}
                  </SelectTrigger>
                  {comunas.length > 0 && (
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna} value={comuna}>
                          {comuna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {errors.commune && (
                  <p className="text-sm text-destructive">{errors.commune}</p>
                )}
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="school">Colegio *</Label>
                <Select
                  onValueChange={(value) => handleInputChange('school', value)}
                  value={formData.school}
                  disabled={!formData.commune || loadingColegios}
                >
                  <SelectTrigger className={errors.school ? 'border-destructive' : ''}>
                    {loadingColegios ? (
                      <span>Cargando colegios...</span>
                    ) : (
                      <SelectValue placeholder={
                        formData.commune
                          ? colegios.length === 0
                            ? 'No hay colegios disponibles'
                            : 'Selecciona un colegio'
                          : 'Primero selecciona una comuna'
                      } />
                    )}
                  </SelectTrigger>
                  {colegios.length > 0 && (
                    <SelectContent>
                      {colegios.map((colegio) => (
                        <SelectItem key={colegio} value={colegio}>
                          {colegio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {errors.school && (
                  <p className="text-sm text-destructive">{errors.school}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_manual">Colegio Manual*</Label>
                <Input
                  id="school_manual"
                  value={formData.school_manual}
                  onChange={(e) => handleInputChange('school_manual', e.target.value)}
                  placeholder="Escriba el colegio, solo si no lo encuentra en la lista"
                  className={errors.school_manual ? 'border-destructive' : ''}
                />
                {errors.school_manual && (
                  <p className="text-sm text-destructive">{errors.school_manual}</p>
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
