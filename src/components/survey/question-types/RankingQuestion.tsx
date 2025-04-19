
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";

interface RankingOption {
  id: string;
  text: string;
  code: string;
  position: number;
}

interface RankingQuestionProps {
  options: RankingOption[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, text: string) => void;
  onCodeChange: (id: string, code: string) => void;
  onPositionChange: (id: string, position: number) => void;
}

export function RankingQuestion({
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onCodeChange
}: RankingQuestionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm text-muted-foreground">Opções para Ranqueamento</Label>
        <div className="space-y-3 mt-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2 border rounded-md p-2 bg-white">
              <div className="text-muted-foreground cursor-move">
                <GripVertical size={18} />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <Input 
                  placeholder={`Opção ${index + 1}`} 
                  value={option.text}
                  onChange={(e) => onOptionChange(option.id, e.target.value)}
                />
              </div>
              <div className="w-32">
                <Input 
                  placeholder="Código" 
                  value={option.code}
                  onChange={(e) => onCodeChange(option.id, e.target.value)}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveOption(option.id)}
                disabled={options.length <= 2}
              >
                <Trash2 size={16} className="text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={onAddOption}
          >
            + Adicionar Opção
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium mb-2">Preview</h4>
        <p className="text-sm mb-4">Como o consumidor verá esta pergunta:</p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 bg-white border rounded-md p-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {index + 1}
              </div>
              <div>{option.text || `Opção ${index + 1}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
