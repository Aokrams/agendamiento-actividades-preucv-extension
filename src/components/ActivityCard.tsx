
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash } from 'lucide-react';
import type { Activity } from '@/pages/Index';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

export const ActivityCard = ({ activity, onEdit, onDelete, style }: ActivityCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 animate-fade-in-up group"
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg leading-tight">
              {activity.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(activity.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(activity.startTime)}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                {activity.course} {activity.parallel}
              </span>
              <span className="text-xs">
                {activity.studentCount} alumno{activity.studentCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            {activity.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(activity)}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(activity.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
