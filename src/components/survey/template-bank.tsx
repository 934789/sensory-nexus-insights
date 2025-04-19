
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookPlus, Book, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export interface QuestionTemplate {
  id: string;
  name: string;
  text: string;
  type: string;
  options: string[];
}

interface TemplateBankProps {
  onSelectTemplate: (template: QuestionTemplate) => void;
}

export function TemplateBank({ onSelectTemplate }: TemplateBankProps) {
  const [templates, setTemplates] = useState<QuestionTemplate[]>([
    {
      id: "template1",
      name: "Escala de Satisfação",
      text: "Qual o seu grau de satisfação com o produto?",
      type: "scale",
      options: ["1", "2", "3", "4", "5"]
    },
    {
      id: "template2",
      name: "Intenção de Compra",
      text: "Qual a probabilidade de você comprar este produto?",
      type: "single",
      options: ["Certamente compraria", "Provavelmente compraria", "Talvez compraria", "Provavelmente não compraria", "Certamente não compraria"]
    },
    {
      id: "template3",
      name: "Feedback Aberto",
      text: "Compartilhe suas opiniões ou sugestões sobre o produto:",
      type: "text",
      options: []
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTemplate = (template: QuestionTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
    toast({
      title: "Template adicionado",
      description: `O template "${template.name}" foi adicionado à sua pesquisa.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Book size={16} />
          <span>Banco de Perguntas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Banco de Perguntas</DialogTitle>
          <DialogDescription>
            Selecione um template de pergunta para adicionar à sua pesquisa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Buscar templates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          {filteredTemplates.length > 0 ? (
            <div className="grid gap-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-3 cursor-pointer hover:border-primary transition-all" onClick={() => handleSelectTemplate(template)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.text}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {template.type === "single" ? "Única Escolha" : 
                           template.type === "multiple" ? "Múltipla Escolha" : 
                           template.type === "text" ? "Dissertação" : "Escala"}
                        </span>
                        {template.options.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {template.options.length} opções
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Check size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum template encontrado.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SaveTemplateDialog({ 
  question, 
  onSave 
}: { 
  question: { text: string; type: string; options: string[] }, 
  onSave: (template: Omit<QuestionTemplate, "id">) => void 
}) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o template.",
        variant: "destructive"
      });
      return;
    }
    
    onSave({
      name,
      text: question.text,
      type: question.type,
      options: question.options
    });
    
    setIsOpen(false);
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BookPlus size={16} />
          <span>Salvar como Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Salvar como Template</DialogTitle>
          <DialogDescription>
            Salve esta pergunta como um template para reutilizá-la em futuras pesquisas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="template-name">Nome do Template</Label>
            <Input
              id="template-name"
              placeholder="Ex: Escala de Satisfação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Prévia</Label>
            <div className="mt-1 p-3 bg-muted/30 rounded-md text-sm">
              <p className="font-medium">{question.text}</p>
              {question.options.length > 0 && (
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {question.options.slice(0, 3).map((opt, i) => (
                    <li key={i} className="text-xs">• {opt}</li>
                  ))}
                  {question.options.length > 3 && (
                    <li className="text-xs">• ...</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X size={16} className="mr-1" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Check size={16} className="mr-1" />
            Salvar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
