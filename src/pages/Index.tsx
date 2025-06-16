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
  school_manual: string;
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
  const [navigationHistory, setNavigationHistory] = useState<('welcome' | 'executive' | 'counselor' | 'activities')[]>(['welcome']);
  const currentStep = navigationHistory[navigationHistory.length - 1];
  
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [currentCounselor, setCurrentCounselor] = useState<Counselor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [counselorFormData, setCounselorFormData] = useState<Partial<Counselor> | null>(null);

  const navigateTo = (step: 'welcome' | 'executive' | 'counselor' | 'activities') => {
    setNavigationHistory(prev => [...prev, step]);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      setNavigationHistory(prev => prev.slice(0, -1));
      // Solo limpiamos todo al volver al inicio
      if (navigationHistory[navigationHistory.length - 2] === 'welcome') {
        setSelectedExecutive(null);
        setCurrentCounselor(null);
        setActivities([]);
        setCounselorFormData(null);
      }
    }
  };

  const handleBackFromCounselor = (formData?: Partial<Counselor>) => {
    setCounselorFormData(formData || null);
    goBack();
  };

  const handleExecutiveSelected = (executive: Executive) => {
    setSelectedExecutive(executive);
    navigateTo('counselor');
  };

  const handleCounselorSaved = (counselor: Counselor) => {
    setCurrentCounselor(counselor);
    // No limpiamos counselorFormData para mantener los datos
    navigateTo('activities');
  };

  const handleStartFlow = () => {
    navigateTo('executive');
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
            onBack={() => goBack()}
          />
        )}
        
        {currentStep === 'counselor' && selectedExecutive && (
          <CounselorForm 
            executive={selectedExecutive}
            onCounselorSaved={handleCounselorSaved}
            onBack={(formData) => {
              setCounselorFormData(formData); // Guarda los datos al retroceder
              goBack();
            }}
            initialData={currentCounselor || counselorFormData}
          />
        )}
        
        {currentStep === 'activities' && currentCounselor && (
          <ActivityManagement 
            executive={selectedExecutive}
            counselor={currentCounselor}
            activities={activities}
            setActivities={setActivities}
            onBack={() => goBack()}
          />
        )}
      </div>
    </div>
  );
};

export default Index;