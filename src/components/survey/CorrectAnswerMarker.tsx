
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CorrectAnswerMarkerProps {
  isCorrect?: boolean;
  onChange: (isCorrect: boolean) => void;
  className?: string;
}

export function CorrectAnswerMarker({ 
  isCorrect = false, 
  onChange,
  className = ""
}: CorrectAnswerMarkerProps) {
  const [checked, setChecked] = useState(isCorrect);
  
  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange(newValue);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant={checked ? "default" : "outline"}
            className={`h-6 w-6 rounded-full ${checked ? "bg-green-600 hover:bg-green-700" : "border-dashed"} ${className}`}
            onClick={handleToggle}
          >
            <Check className={`h-3 w-3 ${checked ? "text-white" : "text-muted-foreground"}`} />
            <span className="sr-only">Marcar como resposta correta</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{checked ? "Marcada como resposta correta" : "Marcar como resposta correta"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
