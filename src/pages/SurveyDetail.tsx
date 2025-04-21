
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, ClipboardList, CalendarDays, BarChart2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for a specific survey
const getSurveyById = (id: string) => {
  const surveys = [
    {
      id: "1",
      title: "Análise Sensorial de Iogurte",
      description: "Avaliação das características sensoriais de novo iogurte sabor morango",
      participantCount: 32,
      status: "active" as const,
      date: "Criado em 15/04/2023",
      imageSrc: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
      details: "Este teste avalia as características sensoriais de um novo iogurte sabor morango, incluindo sabor, textura, aroma e aparência.",
      targetAudience: "Consumidores de iogurte, idade 18-65, sem intolerância a lactose",
      questions: [
        {
          type: "hedonic",
          question: "Qual sua impressão sobre o sabor deste iogurte?",
          options: ["1 - Desgostei extremamente", "2", "3", "4", "5 - Nem gostei nem desgostei", "6", "7", "8", "9 - Gostei extremamente"]
        },
        {
          type: "multiple_choice",
          question: "Quais características se destacam neste produto?",
          options: ["Doçura", "Acidez", "Cremosidade", "Aroma", "Textura"]
        },
        {
          type: "descriptive",
          question: "Descreva sua experiência ao degustar este iogurte:"
        }
      ],
      schedule: [
        { date: "22/04/2023", time: "14:00 - 16:00", location: "Lab Sensorial - São Paulo", available: 10, filled: 8 },
        { date: "23/04/2023", time: "10:00 - 12:00", location: "Lab Sensorial - São Paulo", available: 10, filled: 5 },
        { date: "24/04/2023", time: "14:00 - 16:00", location: "Remoto (envio de amostras)", available: 20, filled: 19 }
      ]
    },
    {
      id: "2",
      title: "Teste de Embalagem - Cosméticos",
      description: "Avaliação de nova embalagem de produtos para cuidados com a pele",
      participantCount: 18,
      status: "paused" as const,
      date: "Atualizado em 10/04/2023",
      imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
      details: "Este teste avalia a percepção do consumidor sobre uma nova embalagem para produtos de cuidados com a pele, incluindo usabilidade, atratividade e intenção de compra.",
      targetAudience: "Consumidores de produtos para pele, idade 25-50, todos os gêneros",
      questions: [
        {
          type: "hedonic",
          question: "Avalie o design da embalagem:",
          options: ["1 - Muito ruim", "2", "3", "4", "5 - Nem bom nem ruim", "6", "7", "8", "9 - Excelente"]
        },
        {
          type: "multiple_choice",
          question: "Esta embalagem parece adequada para qual tipo de produto?",
          options: ["Premium", "Econômico", "Sustentável", "Prático", "Luxuoso"]
        }
      ],
      schedule: [
        { date: "15/04/2023", time: "14:00 - 16:00", location: "Online", available: 20, filled: 18 }
      ]
    },
    {
      id: "3",
      title: "Pesquisa de Sabor - Bebida Energética",
      description: "Percepção de sabor e intenção de compra de nova bebida energética",
      participantCount: 56,
      status: "finished" as const,
      date: "Finalizado em 05/04/2023",
      imageSrc: "https://images.unsplash.com/photo-1621263764928-df1444c5e882?q=80&w=500&auto=format&fit=crop",
      details: "Este teste avaliou a percepção de sabor e a intenção de compra de uma nova bebida energética. Foram analisados diferentes aspectos como sabor, acidez, doçura e impressão geral.",
      targetAudience: "Consumidores de bebidas energéticas, idade 18-35",
      questions: [
        {
          type: "hedonic",
          question: "Avalie o sabor desta bebida:",
          options: ["1 - Desgostei extremamente", "2", "3", "4", "5 - Nem gostei nem desgostei", "6", "7", "8", "9 - Gostei extremamente"]
        },
        {
          type: "multiple_choice",
          question: "Qual das seguintes características você identifica nesta bebida?",
          options: ["Doce", "Amargo", "Ácido", "Refrescante", "Artificial"]
        }
      ],
      results: {
        averageRating: 7.2,
        purchaseIntent: "72% dos participantes indicaram intenção de compra",
        favoriteAttributes: ["Sabor refrescante", "Energia duradoura", "Baixas calorias"]
      }
    }
  ];

  return surveys.find(survey => survey.id === id);
};

export default function SurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const survey = getSurveyById(id || "");

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center mt-12">
            <h1 className="text-2xl font-bold mb-4">Pesquisa não encontrada</h1>
            <Button onClick={() => navigate("/surveys")}>Voltar para Pesquisas</Button>
          </div>
        </main>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500">Pausada</Badge>;
      case "finished":
        return <Badge className="bg-gray-500">Finalizada</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/surveys")} className="mr-4">
            <ChevronLeft size={16} className="mr-1" /> Voltar
          </Button>
          <h1 className="text-3xl font-bold font-display">{survey.title}</h1>
          {renderStatusBadge(survey.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre esta Pesquisa</CardTitle>
                <CardDescription>{survey.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-gray-100 mb-6 overflow-hidden">
                  <img
                    src={survey.imageSrc}
                    alt={survey.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p>{survey.description}</p>
                  <p>{survey.details}</p>
                  <div>
                    <h3 className="font-semibold mb-1">Público-alvo:</h3>
                    <p>{survey.targetAudience}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="perguntas">
              <TabsList className="mb-4">
                <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
                {survey.status === "finished" && <TabsTrigger value="resultados">Resultados</TabsTrigger>}
              </TabsList>

              <TabsContent value="perguntas">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Questões da Pesquisa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {survey.questions.map((question, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <ClipboardList size={18} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">{question.question}</h3>
                              {question.type === "hedonic" && question.options && (
                                <div className="grid grid-cols-9 gap-1 mt-2">
                                  {question.options.map((option, idx) => (
                                    <div key={idx} className="text-center">
                                      <div className={`h-8 w-8 rounded-full mx-auto mb-1 border flex items-center justify-center ${idx === 4 ? 'bg-gray-100' : ''}`}>
                                        {option.charAt(0)}
                                      </div>
                                      {idx % 2 === 0 && (
                                        <span className="text-xs">{option}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {question.type === "multiple_choice" && question.options && (
                                <div className="mt-2 space-y-2">
                                  {question.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <div className="h-4 w-4 rounded-full border mr-2"></div>
                                      <span>{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {question.type === "descriptive" && (
                                <div className="mt-2 border rounded-md h-24 bg-gray-50"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agenda">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agenda de Coleta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {survey.schedule?.map((slot, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <CalendarDays size={18} className="text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{slot.date} • {slot.time}</h3>
                                <p className="text-muted-foreground">{slot.location}</p>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <Badge variant="outline" className="ml-2">
                                {slot.filled} / {slot.available} vagas
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {survey.status === "finished" && (
                <TabsContent value="resultados">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resultados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {survey.results ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <BarChart2 size={18} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Avaliação Média</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                  {survey.results.averageRating} / 9
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-1">Intenção de Compra:</h3>
                            <p>{survey.results.purchaseIntent}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-1">Atributos Favoritos:</h3>
                            <div className="flex flex-wrap gap-2">
                              {survey.results.favoriteAttributes.map((attr, idx) => (
                                <Badge key={idx} variant="secondary">{attr}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>Resultados não disponíveis para esta pesquisa.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Pesquisa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total de Participantes</div>
                      <div className="font-semibold">{survey.participantCount}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CalendarDays size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-semibold">
                        {survey.status === "active" && "Ativa"}
                        {survey.status === "paused" && "Pausada"}
                        {survey.status === "finished" && "Finalizada"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full">Editar Pesquisa</Button>
                  {survey.status === "active" && (
                    <Button variant="outline" className="w-full">Pausar Pesquisa</Button>
                  )}
                  {survey.status === "paused" && (
                    <Button variant="outline" className="w-full">Reativar Pesquisa</Button>
                  )}
                  <Button variant="outline" className="w-full">Duplicar</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {survey.status === "active" && (
                    <Button className="w-full">Convidar Participantes</Button>
                  )}
                  <Button variant="outline" className="w-full">Ver Todos Participantes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
