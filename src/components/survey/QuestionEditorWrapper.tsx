
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { Question, QuestionEditor } from "./QuestionEditor";
import { TemplateBank } from "./template-bank";
import { v4 as uuidv4 } from 'uuid';

interface QuestionEditorWrapperProps {
  initialQuestions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
  onSuggestQuestions: () => void;
}

export function QuestionEditorWrapper({ 
  initialQuestions, 
  onQuestionsChange,
  onSuggestQuestions
}: QuestionEditorWrapperProps) {
  const [activeTab, setActiveTab] = useState("question1");
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  // Sync questions with parent
  useEffect(() => {
    onQuestionsChange(questions);
  }, [questions, onQuestionsChange]);

  // Sync with any external changes
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  // Get current question index
  const getCurrentQuestionIndex = () => {
    const match = activeTab.match(/question(\d+)/);
    return match ? parseInt(match[1]) - 1 : -1;
  };

  // Get current question
  const getCurrentQuestion = () => {
    const index = getCurrentQuestionIndex();
    return index >= 0 ? questions[index] : null;
  };

  // Add a new question
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      text: "",
      type: "single",
      options: [
        { id: `opt-${Date.now()}`, text: 'Opção 1', code: '' },
        { id: `opt-${Date.now() + 1}`, text: 'Opção 2', code: '' }
      ]
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    // Switch to the new tab
    setActiveTab(`question${updatedQuestions.length}`);
  };

  // Update a specific question
  const handleQuestionChange = (updatedQuestion: Question) => {
    const currentIndex = getCurrentQuestionIndex();
    if (currentIndex < 0) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  // Add a template as a question
  const handleAddTemplate = (template: any) => {
    const newQuestion: Question = {
      id: uuidv4(),
      text: template.text,
      type: template.type,
      options: template.options.map((opt: string) => ({ 
        id: `opt-${Date.now()}-${Math.random()}`,
        text: opt,
        code: '' 
      }))
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    // Switch to the new tab
    setActiveTab(`question${updatedQuestions.length}`);
  };

  // Handle saving a template
  const handleSaveTemplate = (template: any) => {
    // This would typically save to a database
    toast({
      title: "Template salvo",
      description: `O template "${template.name}" foi salvo com sucesso.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Criação de Perguntas</h3>
        <div className="flex items-center gap-2">
          <TemplateBank onSelectTemplate={handleAddTemplate} />
          
          <Button variant="outline" size="sm" onClick={onSuggestQuestions} className="flex items-center gap-2">
            <Book size={16} />
            <span>Sugerir Perguntas</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleAddQuestion} className="flex items-center gap-2">
            <BookPlus size={16} />
            <span>Adicionar Pergunta</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="overflow-x-auto">
            {questions.map((q, i) => (
              <TabsTrigger key={q.id} value={`question${i+1}`}>Pergunta {i+1}</TabsTrigger>
            ))}
            <TabsTrigger value="new" onClick={handleAddQuestion}>+ Nova</TabsTrigger>
          </TabsList>
        </div>
        
        {questions.map((question, i) => (
          <TabsContent key={question.id} value={`question${i+1}`} className="space-y-6">
            <QuestionEditor 
              question={question}
              onQuestionChange={handleQuestionChange}
              onSaveTemplate={handleSaveTemplate}
            />
          </TabsContent>
        ))}
        
        <TabsContent value="new">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Clique em "+" acima para adicionar uma nova pergunta</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
