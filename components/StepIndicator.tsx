import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Upload', 'Configure', 'Process', 'Download'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
        {/* Connection Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
        
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={step} className="flex flex-col items-center bg-slate-50 px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                    isActive ? 'bg-blue-600 border-blue-600 text-white' : 
                    'bg-white border-slate-300 text-slate-400'}`}
              >
                {isCompleted ? <Check size={18} /> : stepNum}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};