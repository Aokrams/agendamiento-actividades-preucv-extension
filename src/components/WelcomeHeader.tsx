
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Heart, BookOpen } from 'lucide-react';

interface WelcomeHeaderProps {
  onStart: () => void;
}

export const WelcomeHeader = ({ onStart }: WelcomeHeaderProps) => {
  return (
    <div className="text-center space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Sistema de Orientación
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gestiona orientadores y sus actividades de forma simple, intuitiva y encantadora
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-12">
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">Orientadores</h3>
          <p className="text-muted-foreground">Registra y gestiona el equipo de orientación estudiantil</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up-delayed">
          <BookOpen className="h-12 w-12 mx-auto text-accent mb-4" />
          <h3 className="font-semibold text-lg mb-2">Actividades</h3>
          <p className="text-muted-foreground">Organiza sesiones, talleres y seguimientos</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up-delayed" style={{ animationDelay: '0.2s' }}>
          <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Experiencia</h3>
          <p className="text-muted-foreground">Interfaz amigable y motivadora para uso diario</p>
        </Card>
      </div>

      <Button 
        onClick={onStart}
        size="lg"
        className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
      >
        ¡Comenzar registro! 🎯
      </Button>
    </div>
  );
};
