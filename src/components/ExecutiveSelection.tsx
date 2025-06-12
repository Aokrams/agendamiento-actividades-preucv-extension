
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import type { Executive } from '@/pages/Index';

interface ExecutiveSelectionProps {
  onExecutiveSelected: (executive: Executive) => void;
  onBack: () => void;
}

const executives: Executive[] = [
  { id: '1', name: 'Paula Rojas' },
  { id: '2', name: 'Evelyn Mora' },
  { id: '3', name: 'Belén Pizarro' }
];

export const ExecutiveSelection = ({ onExecutiveSelected, onBack }: ExecutiveSelectionProps) => {
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
          <h1 className="text-3xl font-bold">Seleccionar ejecutiva</h1>
          <p className="text-muted-foreground">Elige la ejecutiva responsable del proceso</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ejecutivas disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {executives.map((executive) => (
            <Button
              key={executive.id}
              variant="outline"
              className="w-full h-auto p-4 justify-start text-left hover:bg-primary/10 hover:border-primary"
              onClick={() => onExecutiveSelected(executive)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {executive.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-medium">{executive.name}</span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
