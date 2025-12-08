import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessSteps = ({ steps, currentStep }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-headline font-semibold text-foreground mb-6">
        Service Process Steps
      </h3>
      <div className="relative">
        {steps?.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="relative pb-8 last:pb-0">
              {index < steps?.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`} />
              )}
              <div className="relative flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-smooth ${
                  isCompleted ? 'bg-success text-white' : isCurrent ?'bg-primary text-white': 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={24} />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-semibold ${
                      isCurrent ? 'text-primary' : 'text-foreground'
                    }`}>
                      {step?.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                        Current Step
                      </span>
                    )}
                    {isCompleted && (
                      <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {step?.description}
                  </p>

                  {step?.requirements && step?.requirements?.length > 0 && (
                    <div className="space-y-2">
                      {step?.requirements?.map((req, reqIndex) => (
                        <div key={reqIndex} className="flex items-start space-x-2 text-xs text-muted-foreground">
                          <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {step?.estimatedTime && (
                    <div className="flex items-center space-x-2 mt-3 text-xs text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>Estimated time: {step?.estimatedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessSteps;