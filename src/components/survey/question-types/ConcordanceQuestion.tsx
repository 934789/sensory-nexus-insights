
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConcordanceQuestionProps {
  statements: { id: string, text: string, code: string }[];
  onAddStatement: () => void;
  onRemoveStatement: (id: string) => void;
  onStatementChange: (id: string, text: string) => void;
  onCodeChange: (id: string, code: string) => void;
}

export function ConcordanceQuestion({
  statements,
  onAddStatement,
  onRemoveStatement,
  onStatementChange,
  onCodeChange
}: ConcordanceQuestionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm text-muted-foreground">Afirmações (respondidas com "Concordo", "Discordo", "Neutro")</Label>
        <div className="space-y-3 mt-2">
          {statements.map((statement) => (
            <div key={statement.id} className="flex gap-2">
              <div className="flex-1">
                <Input 
                  placeholder="Digite a afirmação..." 
                  value={statement.text}
                  onChange={(e) => onStatementChange(statement.id, e.target.value)}
                />
              </div>
              <div className="w-32">
                <Input 
                  placeholder="Código" 
                  value={statement.code}
                  onChange={(e) => onCodeChange(statement.id, e.target.code)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onRemoveStatement(statement.id)}
                disabled={statements.length <= 1}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={onAddStatement}
          >
            + Adicionar Afirmação
          </Button>
        </div>
      </div>
    </div>
  );
}
