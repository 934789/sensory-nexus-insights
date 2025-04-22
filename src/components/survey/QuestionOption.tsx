
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CorrectAnswerMarker } from "./CorrectAnswerMarker";

interface QuestionOptionProps {
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  isCorrect?: boolean;
  onCorrectChange?: (isCorrect: boolean) => void;
  showCorrectOption?: boolean;
  placeholder?: string;
}

export function QuestionOption({
  value,
  onChange,
  onRemove,
  isCorrect = false,
  onCorrectChange,
  showCorrectOption = true,
  placeholder = "Opção de resposta..."
}: QuestionOptionProps) {
  return (
    <div className="flex items-center gap-2">
      {showCorrectOption && onCorrectChange && (
        <CorrectAnswerMarker 
          isCorrect={isCorrect} 
          onChange={onCorrectChange}
        />
      )}
      
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remover opção</span>
        </Button>
      )}
    </div>
  );
}
