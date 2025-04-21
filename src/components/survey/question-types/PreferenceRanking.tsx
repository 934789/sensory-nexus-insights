
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

interface RankOption {
  id: string;
  text: string;
  code: string;
  position: number;
}

interface PreferenceRankingProps {
  options: RankOption[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, text: string) => void;
  onCodeChange: (id: string, code: string) => void;
  onPositionChange: (id: string, newPosition: number) => void;
}

export function PreferenceRanking({
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onCodeChange,
  onPositionChange
}: PreferenceRankingProps) {
  const [sortedOptions, setSortedOptions] = useState<RankOption[]>([...options].sort((a, b) => a.position - b.position));

  // Move option up in the list
  const moveUp = (index: number) => {
    if (index <= 0) return;
    
    const newOptions = [...sortedOptions];
    [newOptions[index].position, newOptions[index - 1].position] = 
      [newOptions[index - 1].position, newOptions[index].position];
    
    // Swap the elements in the array
    [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
    
    setSortedOptions(newOptions);
    options.forEach(opt => {
      const newOpt = newOptions.find(no => no.id === opt.id);
      if (newOpt && newOpt.position !== opt.position) {
        onPositionChange(opt.id, newOpt.position);
      }
    });
  };

  // Move option down in the list
  const moveDown = (index: number) => {
    if (index >= sortedOptions.length - 1) return;
    
    const newOptions = [...sortedOptions];
    [newOptions[index].position, newOptions[index + 1].position] = 
      [newOptions[index + 1].position, newOptions[index].position];
    
    // Swap the elements in the array
    [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
    
    setSortedOptions(newOptions);
    options.forEach(opt => {
      const newOpt = newOptions.find(no => no.id === opt.id);
      if (newOpt && newOpt.position !== opt.position) {
        onPositionChange(opt.id, newOpt.position);
      }
    });
  };

  React.useEffect(() => {
    setSortedOptions([...options].sort((a, b) => a.position - b.position));
  }, [options]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Opções para Ranqueamento</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Adicione as opções que o participante poderá ordenar por preferência.
        </p>
      </div>

      <div className="space-y-3 mt-2">
        {sortedOptions.map((option, index) => (
          <Card key={option.id} className="border">
            <CardContent className="flex items-center p-3 gap-2">
              <div className="flex items-center justify-center bg-muted rounded-md p-1 w-8">
                <span className="font-medium text-sm">{index + 1}</span>
              </div>
              
              <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground cursor-grab" />
              
              <div className="flex-1">
                <Input
                  placeholder={`Opção ${index + 1}`}
                  value={option.text}
                  onChange={(e) => onOptionChange(option.id, e.target.value)}
                />
              </div>
              
              <div className="w-24">
                <Input
                  placeholder="Código"
                  value={option.code}
                  onChange={(e) => onCodeChange(option.id, e.target.value)}
                />
              </div>
              
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveDown(index)}
                  disabled={index === sortedOptions.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemoveOption(option.id)}
                disabled={sortedOptions.length <= 2}
              >
                -
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={onAddOption}
        >
          + Adicionar Opção
        </Button>
      </div>

      <div>
        <Label className="text-base">Visualização da Pergunta</Label>
        <div className="mt-2 p-4 border rounded-md bg-gray-50">
          <p className="mb-3">Ordene as opções da mais preferida para a menos preferida:</p>
          <div className="space-y-2">
            {sortedOptions.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2 p-2 bg-white border rounded-md">
                <div className="flex items-center justify-center bg-primary/10 rounded-full w-6 h-6">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
                <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
