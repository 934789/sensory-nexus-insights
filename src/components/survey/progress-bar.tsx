
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Pergunta {currentStep} de {totalSteps}
        </span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
