
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ComparisonOption {
  id: string;
  label: string;
  code: string;
}

interface ComparisonPairsProps {
  options: ComparisonOption[];
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
  onOptionChange: (id: string, text: string) => void;
  onCodeChange: (id: string, code: string) => void;
}

export function ComparisonPairs({
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onCodeChange
}: ComparisonPairsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Opções de Comparação</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Configure as amostras que serão comparadas. Por padrão, as respostas serão: A, B, Ambas, Nenhuma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4 border-2 border-primary/20">
          <CardContent className="p-0 space-y-2">
            <div className="font-medium flex items-center justify-center h-8 bg-primary/10 rounded">
              Amostra A
            </div>
            <div className="space-y-3 mt-2">
              {options.filter((_, i) => i === 0).map((option, index) => (
                <div key={option.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Descrição da amostra A"
                      value={option.label}
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 border-2 border-primary/20">
          <CardContent className="p-0 space-y-2">
            <div className="font-medium flex items-center justify-center h-8 bg-primary/10 rounded">
              Amostra B
            </div>
            <div className="space-y-3 mt-2">
              {options.filter((_, i) => i === 1).map((option, index) => (
                <div key={option.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Descrição da amostra B"
                      value={option.label}
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label className="text-base">Visualização da Pergunta</Label>
        <div className="mt-2 p-4 border rounded-md bg-gray-50">
          <p className="mb-3">Qual amostra você prefere?</p>
          <RadioGroup defaultValue="a">
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="a" id="a" />
              <Label htmlFor="a">Amostra A {options[0]?.label ? `(${options[0].label})` : ""}</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="b" id="b" />
              <Label htmlFor="b">Amostra B {options[1]?.label ? `(${options[1].label})` : ""}</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Ambas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">Nenhuma</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
