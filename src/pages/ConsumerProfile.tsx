import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Star, Calendar, Clock, Award, Gift, ChartBar, Package } from "lucide-react";
import { supabaseClient } from "@/integrations/supabase/mock-client";
import { supabase } from "@/integrations/supabase/client";
import { SampleDeliveryConfirmation } from "@/components/delivery/SampleDeliveryConfirmation";

const LEVELS = [
  { name: "Bronze", min: 0, color: "bg-amber-600" },
  { name: "Prata", min: 100, color: "bg-gray-400" },
  { name: "Ouro", min: 300, color: "bg-yellow-400" },
  { name: "Platina", min: 600, color: "bg-blue-300" },
  { name: "Diamante", min: 1000, color: "bg-purple-400" }
];

type DeliveryData = {
  id: string;
  code: string;
  name: string;
  status: string;
  surveys?: {
    id?: string;
    title?: string;
  }
};

type ConsumerProfileData = {
  name: string;
  email: string;
  points: number;
  completedSurveys: number;
  location: string;
  allergies: string;
  preferences: string;
  memberSince: string;
};

export default function ConsumerProfile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("perfil");
  const [profile, setProfile] = useState<ConsumerProfileData>({
    name: "Maria Silva",
    email: "maria.silva@exemplo.com",
    points: 320,
    completedSurveys: 14,
    location: "São Paulo, SP",
    allergies: "Glúten, Frutos do Mar",
    preferences: "Produtos veganos, Baixo açúcar",
    memberSince: "Janeiro 2023"
  });
  const [pendingDeliveries, setPendingDeliveries] = useState<DeliveryData[]>([]);
  
  const achievements = [
    { 
      id: 1, 
      title: "Primeira Pesquisa", 
      description: "Completou sua primeira pesquisa sensorial", 
      icon: <Star size={20} />,
      earned: true 
    },
    { 
      id: 2, 
      title: "Degustador Fiel", 
      description: "Participou de 10 pesquisas", 
      icon: <Award size={20} />,
      earned: true 
    },
    { 
      id: 3, 
      title: "Especialista em Aromas", 
      description: "Acertou todas as questões de identificação de aroma", 
      icon: <Award size={20} />,
      earned: true 
    },
    { 
      id: 4, 
      title: "Paladar de Ouro", 
      description: "Participou de 25 pesquisas", 
      icon: <Award size={20} />,
      earned: false 
    },
  ];

  const surveyHistory = [
    {
      id: "s-1",
      title: "Avaliação de Iogurtes Zero Açúcar",
      date: "15/04/2023",
      points: 35,
      status: "completed",
      approved: true,
      feedback: "Suas respostas foram muito detalhadas e úteis!"
    },
    {
      id: "s-2",
      title: "Teste de Novos Sabores de Café",
      date: "02/05/2023",
      points: 45,
      status: "completed",
      approved: true,
      feedback: "Excelente participação. Seu feedback foi valioso!"
    },
    {
      id: "s-3",
      title: "Teste de Fragrâncias Florais",
      date: "18/05/2023",
      points: 30,
      status: "completed",
      approved: false,
      feedback: "Algumas respostas não atenderam aos critérios da pesquisa."
    },
    {
      id: "s-4",
      title: "Avaliação de Textura: Snacks Proteicos",
      date: "15/06/2023",
      points: null,
      status: "in-transit",
      approved: null,
      feedback: null
    }
  ];

  const rewards = [
    {
      id: "r-1",
      title: "Cupom de 10% em Supermercados",
      points: 100,
      image: "https://via.placeholder.com/100",
      available: true
    },
    {
      id: "r-2",
      title: "Vale Presente R$50",
      points: 350,
      image: "https://via.placeholder.com/100",
      available: false
    },
    {
      id: "r-3",
      title: "Kit Degustação Premium",
      points: 550,
      image: "https://via.placeholder.com/100",
      available: false
    },
    {
      id: "r-4",
      title: "Frasco de Perfume Exclusivo",
      points: 450,
      image: "https://via.placeholder.com/100",
      available: false
    }
  ];

  const getCurrentLevel = () => {
    const sortedLevels = [...LEVELS].sort((a, b) => b.min - a.min);
    return sortedLevels.find(level => profile.points >= level.min) || LEVELS[0];
  };
  
  const currentLevel = getCurrentLevel();
  const nextLevel = LEVELS.find(level => level.min > profile.points);
  const pointsForNextLevel = nextLevel ? nextLevel.min - profile.points : 0;
  
  const getProgressPercentage = () => {
    if (!nextLevel) return 100;
    
    const currentLevelMin = LEVELS.find(level => level.name === currentLevel.name)?.min || 0;
    const nextLevelMin = nextLevel.min;
    
    const totalPointsNeeded = nextLevelMin - currentLevelMin;
    const pointsEarned = profile.points - currentLevelMin;
    
    return Math.round((pointsEarned / totalPointsNeeded) * 100);
  };

  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    if (profile.points < reward.points) {
      toast({
        title: "Pontos insuficientes",
        description: `Você precisa de ${reward.points - profile.points} pontos a mais para resgatar esta recompensa.`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Recompensa resgatada!",
      description: `Você resgatou: ${reward.title}. Um e-mail de confirmação foi enviado.`
    });
  };

  const loadProfileData = async () => {
    try {
      const sessionPromise = await supabase.auth.getSession();
      const userId = sessionPromise.data?.session?.user.id;
      
      if (!userId) return;
      
      try {
        const profileResult = await supabaseClient
          .from('consumer_profiles')
          .select('*')
          .eq('user_id', userId);
        
        if (profileResult.error) {
          console.error("Erro ao carregar perfil:", profileResult.error);
          return;
        }
        
        const profileData = profileResult.data?.[0];
        
        if (profileData && typeof profileData === 'object') {
          setProfile(prev => ({
            ...prev,
            name: profileData.name || prev.name,
            email: profileData.email || prev.email,
            points: profileData.points || prev.points,
            completedSurveys: profileData.completed_surveys || prev.completedSurveys,
            location: profileData.location || prev.location,
            allergies: profileData.allergies || prev.allergies,
            preferences: profileData.preferences || prev.preferences,
            memberSince: profileData.created_at 
              ? new Date(profileData.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
              : prev.memberSince
          }));
        }
      } catch (e) {
        console.error("Erro ao processar dados do perfil:", e);
      }
      
      try {
        const deliveriesResult = await supabaseClient
          .from('sample_deliveries')
          .select(`
            id,
            code,
            name,
            status,
            surveys(id, title)
          `)
          .eq('consumer_id', userId)
          .in('status', ['shipped', 'in-transit']);
        
        if (deliveriesResult.error) {
          console.error("Erro ao carregar entregas:", deliveriesResult.error);
          return;
        }
        
        const deliveriesData = deliveriesResult.data || [];
        
        const validDeliveries: DeliveryData[] = deliveriesData
          .filter((d: any) => d && typeof d === 'object' && d.id && d.code && d.name && d.status)
          .map((d: any) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            status: d.status,
            surveys: d.surveys
          }));
        
        setPendingDeliveries(validDeliveries);
      } catch (e) {
        console.error("Erro ao processar entregas:", e);
      }
      
    } catch (error) {
      console.error("Erro em loadProfileData:", error);
    }
  };

  useEffect(() => {
    loadProfileData();
    
    const setupRealtimeSubscription = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user.id || 'anonymous';
        const channelName = `profile-delivery-updates-${userId}`;
        
        const deliveriesSubscription = supabase
          .channel(channelName)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'sample_deliveries'
            },
            () => {
              loadProfileData();
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(deliveriesSubscription);
        };
      } catch (error) {
        console.error("Erro ao configurar assinatura em tempo real:", error);
        return () => {};
      }
    };
    
    setupRealtimeSubscription();
  }, []);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case "in-transit":
        return <Badge className="bg-yellow-500">Amostra em trânsito</Badge>;
      case "scheduled":
        return <Badge className="bg-purple-500">Agendado</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>;
    }
  };

  const renderApprovalBadge = (approved: boolean | null) => {
    if (approved === null) return null;
    
    return approved 
      ? <Badge className="ml-2 bg-green-600">Aprovado</Badge>
      : <Badge className="ml-2 bg-red-600">Reprovado</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Perfil do Consumidor</h1>
          <p className="text-muted-foreground">Gerencie seu perfil e visualize seu histórico de pesquisas</p>
        </div>

        {pendingDeliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="text-primary" />
              <span>Amostras em Trânsito</span>
              <Badge className="ml-2 bg-yellow-500">{pendingDeliveries.length}</Badge>
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {pendingDeliveries.map((delivery) => (
                <SampleDeliveryConfirmation
                  key={delivery.id}
                  sampleId={delivery.id}
                  name={delivery.name || delivery.surveys?.title || ""}
                  status={delivery.status as any}
                  code={delivery.code}
                  surveyId={delivery.surveys?.id || ""}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-stretch h-full space-y-1">
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'perfil' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("perfil")}
                  >
                    <User size={16} />
                    Perfil
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'historico' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("historico")}
                  >
                    <Calendar size={16} />
                    Histórico
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'conquistas' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("conquistas")}
                  >
                    <Award size={16} />
                    Conquistas
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'recompensas' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("recompensas")}
                  >
                    <Gift size={16} />
                    Recompensas
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'sensorial' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("sensorial")}
                  >
                    <ChartBar size={16} />
                    Perfil Sensorial
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-3 ${currentLevel.color}`}>
                    <span className="font-semibold">{currentLevel.name}</span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Nível atual: {currentLevel.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {nextLevel 
                        ? `Faltam ${pointsForNextLevel} pontos para o nível ${nextLevel.name}`
                        : "Nível máximo atingido!"}
                    </p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                    
                    <p className="mt-3 font-medium">{profile.points} pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {activeTab === "perfil" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-3 text-center">
                        <Badge className={`${currentLevel.color} hover:${currentLevel.color}`}>
                          {currentLevel.name}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                          <p className="font-medium">{profile.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Localização</h3>
                          <p className="font-medium">{profile.location}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Membro desde</h3>
                          <p className="font-medium">{profile.memberSince}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Total de pontos</h3>
                          <p className="font-medium">{profile.points} pontos</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Pesquisas concluídas</h3>
                          <p className="font-medium">{profile.completedSurveys}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Alergias</h3>
                      <p>{profile.allergies || "Nenhuma alergia informada"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Preferências</h3>
                      <p>{profile.preferences || "Nenhuma preferência informada"}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Button>Editar perfil</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "historico" && (
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pesquisas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {surveyHistory.map(survey => (
                      <div key={survey.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{survey.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar size={14} />
                              <span>{survey.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(survey.status)}
                            {renderApprovalBadge(survey.approved)}
                            {survey.points && (
                              <Badge variant="outline" className="ml-2">
                                +{survey.points} pontos
                              </Badge>
                            )}
                          </div>
                        </div>
                        {survey.feedback && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm italic text-muted-foreground">{survey.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "conquistas" && (
              <Card>
                <CardHeader>
                  <CardTitle>Suas Conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map(achievement => (
                      <div 
                        key={achievement.id} 
                        className={`border rounded-lg p-4 ${!achievement.earned ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${achievement.earned ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.earned && (
                          <Badge className="mt-2 bg-green-500">Conquistado</Badge>
                        )}
                        {!achievement.earned && (
                          <Badge className="mt-2" variant="outline">Bloqueado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "recompensas" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Loja de Recompensas</span>
                    <Badge variant="outline" className="ml-2">Seus pontos: {profile.points}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewards.map(reward => {
                      const canRedeem = profile.points >= reward.points;
                      
                      return (
                        <div key={reward.id} className="border rounded-lg overflow-hidden">
                          <div className="aspect-video bg-gray-100 flex items-center justify-center">
                            <img 
                              src={reward.image} 
                              alt={reward.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{reward.title}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline">{reward.points} pontos</Badge>
                              <Button 
                                size="sm" 
                                disabled={!canRedeem}
                                onClick={() => handleRedeemReward(reward.id)}
                              >
                                Resgatar
                              </Button>
                            </div>
                            {!canRedeem && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Faltam {reward.points - profile.points} pontos
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "sensorial" && (
              <Card>
                <CardHeader>
                  <CardTitle>Seu Perfil Sensorial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Baseado em suas avaliações anteriores, identificamos suas preferências sensoriais.
                    Este perfil ajuda a conectar você com pesquisas mais relevantes.
                  </p>

                  <h3 className="font-medium mb-2">Preferências de Sabor</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Doce</span>
                        <span>75%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Salgado</span>
                        <span>45%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ácido</span>
                        <span>30%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Amargo</span>
                        <span>20%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Umami</span>
                        <span>60%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">Texturas Preferidas</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Crocante</span>
                        <span>80%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Macio</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cremoso</span>
                        <span>90%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium">Dicas para melhorar seu perfil:</h4>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Participe de pesquisas variadas para expandir seu perfil</li>
                      <li>Quando disponível, forneça detalhes nas respostas descritivas</li>
                      <li>Complete seu perfil com informações adicionais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
