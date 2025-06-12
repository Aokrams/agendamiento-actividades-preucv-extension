
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar } from 'lucide-react';

export const EmptyState = () => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-8 text-center">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <div className="relative">
            <Calendar className="h-8 w-8 text-primary" />
            <BookOpen className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">¡Todo listo para empezar!</h3>
        <p className="text-muted-foreground mb-4">
          Aún no hay actividades registradas. ¡Agrega la primera usando el formulario de la izquierda!
        </p>
        <div className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Puedes añadir sesiones individuales, talleres grupales, seguimientos, etc.
        </div>
      </CardContent>
    </Card>
  );
};
