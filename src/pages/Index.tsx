
import { useState } from 'react';
import { CounselorForm } from '@/components/CounselorForm';
import { ActivityManagement } from '@/components/ActivityManagement';
import { WelcomeHeader } from '@/components/WelcomeHeader';

export interface Counselor {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'counselor' | 'activities'>('welcome');
  const [currentCounselor, setCurrentCounselor] = useState<Counselor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleCounselorSaved = (counselor: Counselor) => {
    setCurrentCounselor(counselor);
    setCurrentStep('activities');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setCurrentCounselor(null);
    setActivities([]);
  };

  const handleStartFlow = () => {
    setCurrentStep('counselor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 'welcome' && (
          <WelcomeHeader onStart={handleStartFlow} />
        )}
        
        {currentStep === 'counselor' && (
          <CounselorForm 
            onCounselorSaved={handleCounselorSaved}
            onBack={handleBackToWelcome}
          />
        )}
        
        {currentStep === 'activities' && currentCounselor && (
          <ActivityManagement 
            counselor={currentCounselor}
            activities={activities}
            setActivities={setActivities}
            onBack={handleBackToWelcome}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
