
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, Share2, Calendar, Clock, Users, Check, 
  BarChart3, FileText, Download, Edit, Eye, Trash2 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ShareSurvey } from "@/components/survey/ShareSurvey";
import { SampleDeliveryStatus } from "@/components/delivery/SampleDeliveryStatus";

// Mock data for the survey
const mockSurvey = {
  id: "survey1",
  title: "Avaliação Sensorial - Produto Beta",
  description: "Teste de sabor e textura do novo produto linha Beta",
  status: "active",
  type: "sensorial",
  createdAt: "2023-05-10T10:30:00Z",
  endDate: "2023-05-20T23:59:59Z",
  totalResponses: 34,
  targetResponses: 50,
  questions: [
    {
      id: "q1",
      text: "O que você achou do sabor do produto?",
      type: "scale",
      options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    },
    {
      id: "q2",
      text: "Qual característica mais te agradou?",
      type: "multiple",
      options: ["Sabor", "Textura", "Aroma", "Aparência", "Embalagem"]
    },
    {
      id: "q3",
      text: "Descreva com suas palavras o que achou do produto",
      type: "text"
    }
  ],
  sampleDelivery: {
    status: "in-transit",
    trackingCode: "BR1234567890",
    scheduledDate: "15/05/2023",
    recipientName: "João Silva"
  }
};

export default function SurveyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState(mockSurvey);
  const [activeTab, setActiveTab] = useState("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(survey.sampleDelivery.status);

  useEffect(() => {
    // Simulando carregamento dos dados
    console.log(`Carregando pesquisa com ID: ${id}`);
    // Em um caso real, aqui teria uma chamada para API
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setDeliveryStatus(newStatus);
    toast({
      title: "Status atualizado",
      description: `O status da amostra foi atualizado para: ${newStatus === 'delivered' ? 'Entregue' : 'Concluído'}`
    });
  };

  const handleDelete = () => {
    toast({
      title: "Pesquisa excluída",
      description: "A pesquisa foi excluída permanentemente.",
      variant: "destructive"
    });
    navigate("/surveys");
  };

  const getStatusBadge = () => {
    switch (survey.status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Agendada</Badge>;
      case "completed":
        return <Badge className="bg-purple-500">Concluída</Badge>;
      default:
        return <Badge variant="outline">{survey.status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatProgress = () => {
    const percentage = Math.round((survey.totalResponses / survey.targetResponses) * 100);
    return `${percentage}% (${survey.totalResponses}/${survey.targetResponses})`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/surveys")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Pesquisas
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-display">{survey.title}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground mt-1">{survey.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/surveys/create?edit=${id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button onClick={() => setIsShareOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
                <TabsTrigger value="responses">Respostas</TabsTrigger>
                <TabsTrigger value="analytics">Análise</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total de Respostas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{survey.totalResponses}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Meta: {survey.targetResponses}
                      </p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min((survey.totalResponses / survey.targetResponses) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Data de Criação</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <div className="text-lg font-medium">{formatDate(survey.createdAt)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Data Final</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <div className="text-lg font-medium">{formatDate(survey.endDate)}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Pesquisa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">ID da Pesquisa</dt>
                          <dd className="text-sm mt-1">{id}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Tipo</dt>
                          <dd className="text-sm mt-1 capitalize">{survey.type}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Progresso</dt>
                          <dd className="text-sm mt-1">{formatProgress()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Perguntas</dt>
                          <dd className="text-sm mt-1">{survey.questions.length}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="flex flex-col items-center justify-center h-20 p-2">
                          <Eye className="h-5 w-5 mb-1" />
                          <span className="text-xs">Visualizar</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center justify-center h-20 p-2">
                          <Download className="h-5 w-5 mb-1" />
                          <span className="text-xs">Exportar Dados</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center justify-center h-20 p-2">
                          <FileText className="h-5 w-5 mb-1" />
                          <span className="text-xs">Relatórios</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex flex-col items-center justify-center h-20 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={handleDelete}
                        >
                          <Trash2 className="h-5 w-5 mb-1" />
                          <span className="text-xs">Excluir</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle>Perguntas da Pesquisa</CardTitle>
                    <CardDescription>
                      Esta pesquisa contém {survey.questions.length} perguntas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {survey.questions.map((question, index) => (
                        <div key={question.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center bg-primary/10 h-6 w-6 rounded-full">
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                            <h3 className="text-base font-medium">{question.text}</h3>
                          </div>
                          <div className="mt-2 text-muted-foreground text-sm flex items-center gap-2">
                            <Badge variant="outline">
                              {question.type === 'scale' 
                                ? 'Escala' 
                                : question.type === 'multiple' 
                                  ? 'Múltipla Escolha' 
                                  : 'Dissertativa'}
                            </Badge>
                          </div>
                          
                          {question.type !== 'text' && (
                            <div className="mt-3 pl-8">
                              <p className="text-sm text-muted-foreground mb-2">Opções:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className="text-sm border rounded-md p-2 bg-gray-50"
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="responses">
                <Card>
                  <CardHeader>
                    <CardTitle>Respostas</CardTitle>
                    <CardDescription>
                      {survey.totalResponses} respostas recebidas até agora.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Dados disponíveis no painel de análise</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Para visualizar respostas individuais e dados agregados, acesse a aba de Análise.
                      </p>
                      <Button onClick={() => setActiveTab("analytics")}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Análises
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise dos Resultados</CardTitle>
                    <CardDescription>
                      Visualização de dados e insights da pesquisa.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Acesse o painel completo de análises</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Utilize nosso painel de análises para explorar dados detalhados e visualizações interativas.
                      </p>
                      <Button onClick={() => navigate(`/analytics?survey=${id}`)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Abrir Painel Analítico
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Status da amostra e check-in/checkout */}
            <SampleDeliveryStatus 
              status={deliveryStatus as any}
              trackingCode={survey.sampleDelivery.trackingCode}
              scheduledDate={survey.sampleDelivery.scheduledDate}
              recipientName={survey.sampleDelivery.recipientName}
              sampleName={`Kit de avaliação - ${survey.title}`}
              onStatusChange={handleStatusChange}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Link da Pesquisa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between border rounded-md p-2">
                  <code className="text-xs truncate bg-gray-50 p-1 rounded flex-1 mr-2">
                    https://sensorynexus.app/s/{id}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(`https://sensorynexus.app/s/${id}`);
                    toast({ description: "Link copiado para o clipboard!" });
                  }}>
                    Copiar
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setIsShareOpen(true)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Pesquisa
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-2xl font-bold">{survey.totalResponses}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta</p>
                    <p className="text-lg">{survey.targetResponses}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${Math.min((survey.totalResponses / survey.targetResponses) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {formatProgress()} respostas obtidas
                </p>

                <Button variant="outline" className="w-full mt-2">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Perfil dos Participantes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ShareSurvey 
        open={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        surveyId={id || ""} 
        surveyName={survey.title}
      />
    </div>
  );
}
