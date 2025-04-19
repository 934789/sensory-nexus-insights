
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Image, Save, Lightbulb, 
  BookPlus, Book, Eye, EyeOff 
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";
import { SurveyPreview } from "@/components/survey/survey-preview";
import { ProgressBar } from "@/components/survey/progress-bar";
import { TemplateBank, SaveTemplateDialog, QuestionTemplate } from "@/components/survey/template-bank";

export default function SurveyCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOnline, setIsOnline] = useState(true);
  const [surveyImage, setSurveyImage] = useState<string | null>(null);
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  
  // Survey data state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("Obrigado por participar da nossa pesquisa!");
  const [rejectionMessage, setRejectionMessage] = useState("Infelizmente você não atende aos critérios desta pesquisa.");
  
  // Questions state
  const [questions, setQuestions] = useState<{
    id: string;
    text: string;
    type: string;
    options: string[];
  }[]>([
    {
      id: "q1",
      text: "O que você achou do produto?",
      type: "single",
      options: ["Excelente", "Bom", "Regular", "Ruim", "Péssimo"]
    }
  ]);
  
  // Templates state
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
    }
  ]);
  
  // Active tab
  const [activeTab, setActiveTab] = useState("question1");
  
  // Preview visibility state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  // Auto-save functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      console.log("Auto-saving survey...");
      // In a real app, this would save to localStorage or backend
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, []);
  
  const handleNext = () => {
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  const handleSave = () => {
    toast({
      title: "Pesquisa criada com sucesso!",
      description: "Sua pesquisa foi salva e está pronta para ser compartilhada.",
    });
    navigate("/dashboard");
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSurveyImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, text } : q)
    );
  };

  const handleAddQuestion = () => {
    const newId = `q${questions.length + 1}`;
    const newQuestion = {
      id: newId,
      text: "",
      type: "single",
      options: ["Opção 1", "Opção 2", "Opção 3"]
    };
    setQuestions([...questions, newQuestion]);
    
    // Switch to the new tab
    setActiveTab(`question${questions.length + 1}`);
  };

  const handleQuestionTypeChange = (id: string, type: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, type } : q)
    );
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === questionId 
        ? { ...q, options: [...q.options, `Opção ${q.options.length + 1}`] } 
        : q
      )
    );
  };

  const handleRemoveOption = (questionId: string, optionIndex: number) => {
    setQuestions(prev =>
      prev.map(q => q.id === questionId
        ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        : q
      )
    );
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt, i) => i === optionIndex ? value : opt)
          }
        : q
      )
    );
  };

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  // Get current question based on active tab
  const getCurrentQuestion = () => {
    const questionIndex = parseInt(activeTab.replace("question", "")) - 1;
    return questions[questionIndex] || null;
  };

  // Handle adding a template to the questions
  const handleAddTemplate = (template: QuestionTemplate) => {
    const newId = `q${questions.length + 1}`;
    const newQuestion = {
      id: newId,
      text: template.text,
      type: template.type,
      options: [...template.options]
    };
    
    setQuestions([...questions, newQuestion]);
    setActiveTab(`question${questions.length + 1}`);
  };

  // Handle saving a question as template
  const handleSaveTemplate = (template: Omit<QuestionTemplate, "id">) => {
    const newTemplate: QuestionTemplate = {
      ...template,
      id: `template${templates.length + 1}`
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: "Template salvo",
      description: `O template "${template.name}" foi salvo com sucesso.`
    });
  };

  // Function to suggest questions based on category
  const suggestQuestions = () => {
    if (!category) {
      toast({
        title: "Selecione uma categoria",
        description: "Por favor, selecione uma categoria para receber sugestões de perguntas.",
        variant: "destructive"
      });
      return;
    }

    // Different question suggestions based on category
    let suggestedQuestions = [];
    
    if (category === "food") {
      suggestedQuestions = [
        {
          id: `q${questions.length + 1}`,
          text: "Como você avalia o sabor deste produto?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          id: `q${questions.length + 2}`,
          text: "Qual característica mais te agradou neste alimento?",
          type: "multiple",
          options: ["Sabor", "Textura", "Aroma", "Aparência", "Consistência"]
        }
      ];
    } else if (category === "cosmetics") {
      suggestedQuestions = [
        {
          id: `q${questions.length + 1}`,
          text: "Como você avalia a textura deste produto na pele?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          id: `q${questions.length + 2}`,
          text: "Qual sensação o produto deixou na sua pele?",
          type: "multiple",
          options: ["Hidratada", "Macia", "Oleosa", "Seca", "Irritada"]
        }
      ];
    } else {
      suggestedQuestions = [
        {
          id: `q${questions.length + 1}`,
          text: "Como você avalia este produto?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          id: `q${questions.length + 2}`,
          text: "Você recomendaria este produto a um amigo?",
          type: "single",
          options: ["Certamente recomendaria", "Provavelmente recomendaria", "Talvez", "Provavelmente não", "Certamente não"]
        }
      ];
    }
    
    setQuestions([...questions, ...suggestedQuestions]);
    setActiveTab(`question${questions.length + 1}`);
    
    toast({
      title: "Sugestões adicionadas!",
      description: "Perguntas sugeridas foram adicionadas ao seu questionário."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Dashboard
          </Button>
          <h1 className="text-3xl font-bold font-display">Criar Nova Avaliação</h1>
          <p className="text-muted-foreground">Configure os detalhes da sua pesquisa sensorial</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>1</div>
              <div className={`h-0.5 w-8 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>2</div>
            </div>
            <p className="text-sm text-muted-foreground">Passo {step} de 2</p>
          </div>

          {step === 1 ? (
            <div className="animate-fade-in">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="title">Título da Avaliação</Label>
                        <Input 
                          id="title" 
                          placeholder="Ex: Análise Sensorial de Novo Produto" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand">Marca/Empresa</Label>
                        <Input 
                          id="brand" 
                          placeholder="Ex: Empresa ABC" 
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descreva brevemente o objetivo desta pesquisa..." 
                        className="min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Período da Avaliação</Label>
                        <DatePickerWithRange date={date} setDate={setDate} />
                      </div>

                      <div>
                        <Label htmlFor="categories">Categorias</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Alimentos</SelectItem>
                            <SelectItem value="beverage">Bebidas</SelectItem>
                            <SelectItem value="cosmetics">Cosméticos</SelectItem>
                            <SelectItem value="home">Produtos Domésticos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Label>Tipo de Avaliação</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="online" checked={isOnline} onCheckedChange={setIsOnline} />
                        <Label htmlFor="online" className="cursor-pointer">
                          {isOnline ? "Online" : "Presencial"}
                        </Label>
                      </div>
                    </div>

                    <div>
                      <Label>Imagem de Capa</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                        {surveyImage ? (
                          <div className="relative">
                            <img src={surveyImage} alt="Capa da pesquisa" className="mx-auto max-h-48 object-contain rounded" />
                            <Button variant="destructive" size="sm" onClick={() => setSurveyImage(null)} className="absolute top-2 right-2">
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <Image className="h-10 w-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Clique para fazer upload de uma imagem</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="success-message">Mensagem de Agradecimento</Label>
                        <Textarea 
                          id="success-message" 
                          placeholder="Obrigado por participar da nossa pesquisa!" 
                          value={successMessage}
                          onChange={(e) => setSuccessMessage(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="rejection-message">Mensagem de Reprovação</Label>
                        <Textarea 
                          id="rejection-message" 
                          placeholder="Infelizmente você não atende aos critérios desta pesquisa." 
                          value={rejectionMessage}
                          onChange={(e) => setRejectionMessage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end mt-6">
                <Button onClick={handleNext} className="flex items-center">
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Preview panel */}
              <SurveyPreview 
                title={title}
                description={description}
                questions={questions}
                isVisible={isPreviewVisible}
                onToggleVisibility={togglePreview}
              />

              {/* Progress bar for the survey taker */}
              <div className="mb-6">
                <Label className="mb-2 block">Progresso do Participante</Label>
                <ProgressBar currentStep={3} totalSteps={questions.length > 0 ? questions.length : 1} />
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Criação de Perguntas</h3>
                      <div className="flex items-center gap-2">
                        <TemplateBank onSelectTemplate={handleAddTemplate} />
                        
                        <Button variant="outline" size="sm" onClick={suggestQuestions} className="flex items-center gap-2">
                          <Lightbulb size={16} />
                          <span>Sugerir Perguntas</span>
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={handleAddQuestion}>
                          + Adicionar Pergunta
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
                          <div>
                            <Label htmlFor={`question-text-${i}`}>Texto da Pergunta</Label>
                            <Textarea 
                              id={`question-text-${i}`} 
                              placeholder="Digite aqui sua pergunta..." 
                              className="min-h-[100px]"
                              value={question.text}
                              onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>Tipo de Pergunta</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                              {[
                                {id: 'single', label: 'Única Escolha'},
                                {id: 'multiple', label: 'Múltipla Escolha'},
                                {id: 'text', label: 'Dissertação'},
                                {id: 'scale', label: 'Escala de Intensidade'}
                              ].map((type) => (
                                <Card 
                                  key={type.id} 
                                  className={cn(
                                    "cursor-pointer hover:border-primary transition-colors p-2",
                                    question.type === type.id && "border-primary bg-primary/5"
                                  )}
                                  onClick={() => handleQuestionTypeChange(question.id, type.id)}
                                >
                                  <CardContent className="p-2 text-center">
                                    <p className="text-sm font-medium">{type.label}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {(question.type === 'single' || question.type === 'multiple') && (
                            <div>
                              <Label>Opções de Resposta</Label>
                              <div className="space-y-3 mt-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <Input 
                                      placeholder={`Opção ${optionIndex + 1}`} 
                                      value={option}
                                      onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => handleRemoveOption(question.id, optionIndex)}
                                      disabled={question.options.length <= 2}
                                    >
                                      -
                                    </Button>
                                  </div>
                                ))}
                                <Button 
                                  variant="outline" 
                                  className="w-full mt-2"
                                  onClick={() => handleAddOption(question.id)}
                                >
                                  + Adicionar Opção
                                </Button>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-base">Configurações Avançadas</Label>
                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <Label htmlFor="option-code" className="text-sm">Código da Resposta</Label>
                                <Input id="option-code" placeholder="Ex: Q1_OPT2" />
                              </div>
                              <div>
                                <Label htmlFor="next-question" className="text-sm">Próxima Pergunta</Label>
                                <Select>
                                  <SelectTrigger id="next-question">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="next">Próxima na sequência</SelectItem>
                                    {questions.map((q, idx) => (
                                      q.id !== question.id && (
                                        <SelectItem key={q.id} value={q.id}>Pergunta {idx + 1}</SelectItem>
                                      )
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Template save option */}
                          <div className="flex justify-end">
                            <SaveTemplateDialog 
                              question={{
                                text: question.text,
                                type: question.type,
                                options: question.options
                              }}
                              onSave={handleSaveTemplate}
                            />
                          </div>
                        </TabsContent>
                      ))}
                      
                      <TabsContent value="new">
                        <div className="p-8 text-center">
                          <p className="text-muted-foreground">Clique em "+" acima para adicionar uma nova pergunta</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack} className="flex items-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleSave} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Pesquisa
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
