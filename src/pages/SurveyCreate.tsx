
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Image, Save } from "lucide-react";
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

export default function SurveyCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOnline, setIsOnline] = useState(true);
  const [surveyImage, setSurveyImage] = useState<string | null>(null);
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  
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
                        <Input id="title" placeholder="Ex: Análise Sensorial de Novo Produto" />
                      </div>

                      <div>
                        <Label htmlFor="brand">Marca/Empresa</Label>
                        <Input id="brand" placeholder="Ex: Empresa ABC" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva brevemente o objetivo desta pesquisa..." className="min-h-[100px]" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Período da Avaliação</Label>
                        <DatePickerWithRange date={date} setDate={setDate} />
                      </div>

                      <div>
                        <Label htmlFor="categories">Categorias</Label>
                        <Select>
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
                        <Textarea id="success-message" placeholder="Obrigado por participar da nossa pesquisa!" />
                      </div>

                      <div>
                        <Label htmlFor="rejection-message">Mensagem de Reprovação</Label>
                        <Textarea id="rejection-message" placeholder="Infelizmente você não atende aos critérios desta pesquisa." />
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
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Criação de Perguntas</h3>
                      <Button variant="outline" size="sm">
                        + Adicionar Pergunta
                      </Button>
                    </div>

                    <Tabs defaultValue="question1">
                      <div className="flex justify-between items-center mb-4">
                        <TabsList>
                          <TabsTrigger value="question1">Pergunta 1</TabsTrigger>
                          <TabsTrigger value="question2">Pergunta 2</TabsTrigger>
                          <TabsTrigger value="question3">+ Nova</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="question1" className="space-y-6">
                        <div>
                          <Label htmlFor="question-text">Texto da Pergunta</Label>
                          <Textarea id="question-text" placeholder="Digite aqui sua pergunta..." className="min-h-[100px]" />
                        </div>

                        <div>
                          <Label>Tipo de Pergunta</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            {['Única Escolha', 'Múltipla Escolha', 'Dissertação', 'Upload de Imagem', 
                             'Escala de Intensidade', 'Concordância', 'Ranqueamento'].map((type) => (
                              <Card key={type} className="cursor-pointer hover:border-primary transition-colors p-2">
                                <CardContent className="p-2 text-center">
                                  <p className="text-sm font-medium">{type}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Opções de Resposta</Label>
                          <div className="space-y-3 mt-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Input placeholder={`Opção ${i}`} />
                                <Button variant="outline" size="icon">-</Button>
                              </div>
                            ))}
                            <Button variant="outline" className="w-full mt-2">+ Adicionar Opção</Button>
                          </div>
                        </div>

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
                                  <SelectItem value="q2">Pergunta 2</SelectItem>
                                  <SelectItem value="q3">Pergunta 3</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="question2" className="space-y-4">
                        <div>
                          <Label htmlFor="question-text-2">Texto da Pergunta</Label>
                          <Textarea id="question-text-2" placeholder="Digite aqui sua segunda pergunta..." className="min-h-[100px]" />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="question3">
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
