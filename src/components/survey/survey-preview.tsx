
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurveyPreviewProps {
  title: string;
  description?: string;
  questions: {
    id: string;
    text: string;
    type: string;
    options?: string[];
  }[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function SurveyPreview({
  title,
  description,
  questions,
  isVisible,
  onToggleVisibility,
}: SurveyPreviewProps) {
  if (!isVisible) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleVisibility}
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          <span>Mostrar Preview</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Preview da Pesquisa</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleVisibility}
          className="flex items-center gap-2"
        >
          <EyeOff size={16} />
          <span>Ocultar Preview</span>
        </Button>
      </div>

      <Card className="mb-6 border-dashed border-2 overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg">{title || "Título da Pesquisa"}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent className="p-4">
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-md p-4">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.text || "Texto da pergunta"}
                  </p>
                  
                  {question.type === "multiple" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`preview-${question.id}-option-${i}`}
                            className="rounded border-gray-300"
                            disabled
                          />
                          <label htmlFor={`preview-${question.id}-option-${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "single" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`preview-${question.id}`}
                            id={`preview-${question.id}-option-${i}`}
                            className="rounded border-gray-300"
                            disabled
                          />
                          <label htmlFor={`preview-${question.id}-option-${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "text" && (
                    <div>
                      <div className="border rounded-md p-2 bg-muted/20 text-sm text-muted-foreground italic">
                        Campo para resposta de texto
                      </div>
                    </div>
                  )}
                  
                  {question.type === "scale" && (
                    <div>
                      <div className="flex justify-between items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className={cn(
                              "w-10 h-10 flex items-center justify-center border rounded-full",
                              "bg-background text-foreground"
                            )}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Muito insatisfeito</span>
                        <span>Muito satisfeito</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Adicione perguntas para visualizar o preview</p>
            </div>
          )}

          <div className="mt-6">
            <Button disabled className="w-full">Enviar Respostas</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
