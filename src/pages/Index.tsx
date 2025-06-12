
import { useState } from 'react';
import { CounselorForm } from '@/components/CounselorForm';
import { ActivityManagement } from '@/components/ActivityManagement';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { ExecutiveSelection } from '@/components/ExecutiveSelection';

export interface Executive {
  id: string;
  name: string;
}

export interface Counselor {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone?: string;
  avatar: string;
  region: string;
  commune: string;
  school: string;
  executiveId: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  description: string;
  course: string;
  parallel: string;
  studentCount: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'executive' | 'counselor' | 'activities'>('welcome');
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [currentCounselor, setCurrentCounselor] = useState<Counselor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleExecutiveSelected = (executive: Executive) => {
    setSelectedExecutive(executive);
    setCurrentStep('counselor');
  };

  const handleCounselorSaved = (counselor: Counselor) => {
    setCurrentCounselor(counselor);
    setCurrentStep('activities');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setSelectedExecutive(null);
    setCurrentCounselor(null);
    setActivities([]);
  };

  const handleBackToExecutive = () => {
    setCurrentStep('executive');
    setCurrentCounselor(null);
    setActivities([]);
  };

  const handleStartFlow = () => {
    setCurrentStep('executive');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 'welcome' && (
          <WelcomeHeader onStart={handleStartFlow} />
        )}
        
        {currentStep === 'executive' && (
          <ExecutiveSelection 
            onExecutiveSelected={handleExecutiveSelected}
            onBack={handleBackToWelcome}
          />
        )}
        
        {currentStep === 'counselor' && selectedExecutive && (
          <CounselorForm 
            executive={selectedExecutive}
            onCounselorSaved={handleCounselorSaved}
            onBack={handleBackToExecutive}
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
