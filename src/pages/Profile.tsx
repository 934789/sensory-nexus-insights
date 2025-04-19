
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Key, Bell, Star, BarChart, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("perfil");
  const [displayNameInSurvey, setDisplayNameInSurvey] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stats data (mock)
  const stats = {
    surveysCreated: 24,
    schedulesCreated: 8,
    participantsTotal: 352,
    rating: 4.8,
    feedbacks: [
      { comment: "Pesquisa muito bem organizada", rating: 5, date: "12/05/2023" },
      { comment: "Recrutador profissional e atencioso", rating: 5, date: "08/05/2023" },
      { comment: "O teste foi rápido e bem conduzido", rating: 4, date: "02/05/2023" },
    ]
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div>
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
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'senha' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("senha")}
                  >
                    <Key size={16} />
                    Senha
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'estatisticas' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("estatisticas")}
                  >
                    <BarChart size={16} />
                    Estatísticas
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'avaliacoes' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("avaliacoes")}
                  >
                    <Star size={16} />
                    Avaliações
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'notificacoes' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("notificacoes")}
                  >
                    <Bell size={16} />
                    Notificações
                  </button>
                  <button 
                    className={`flex items-center justify-start gap-2 px-3 py-1.5 rounded-sm text-sm font-medium ${activeTab === 'configuracoes' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab("configuracoes")}
                  >
                    <Settings size={16} />
                    Configurações
                  </button>
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
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col items-center mb-4">
                      <div className="mb-4">
                        <Avatar className="h-24 w-24">
                          {avatar ? (
                            <AvatarImage src={avatar} alt="Avatar" />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">JS</AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-md hover:bg-primary/20 transition-colors">
                            Alterar foto
                          </div>
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" defaultValue="João Silva" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" defaultValue="SensoryNexus Ltda." />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="(11) 98765-4321" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="position">Cargo</Label>
                        <Input id="position" defaultValue="Analista Sensorial" />
                      </div>
                      <div>
                        <Label htmlFor="department">Departamento</Label>
                        <Input id="department" defaultValue="Pesquisa e Desenvolvimento" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="display-name" 
                        checked={displayNameInSurvey}
                        onCheckedChange={setDisplayNameInSurvey}
                      />
                      <Label htmlFor="display-name">Exibir nome no rodapé das pesquisas</Label>
                    </div>

                    <Button type="submit" className="mt-4">Salvar Alterações</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "senha" && (
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button type="submit" className="mt-4">Alterar Senha</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "estatisticas" && (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas do Recrutador</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-sm font-medium text-muted-foreground">Pesquisas Criadas</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats.surveysCreated}</p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-sm font-medium text-muted-foreground">Agendamentos</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats.schedulesCreated}</p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-sm font-medium text-muted-foreground">Participantes</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats.participantsTotal}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Histórico de Atividades</h3>
                    <div className="space-y-3">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>Pesquisa "Avaliação de Iogurte" criada</div>
                          <Badge variant="outline">15/05/2023</Badge>
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>Agendamento "Teste de Cosméticos" atualizado</div>
                          <Badge variant="outline">10/05/2023</Badge>
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>Pesquisa "Bebidas Energéticas" finalizada</div>
                          <Badge variant="outline">02/05/2023</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "avaliacoes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span>Avaliações dos Consumidores</span>
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      {stats.rating} ★
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                      <div className="w-12 text-sm">5 ★</div>
                      <div className="w-10 text-sm text-muted-foreground">80%</div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                      <div className="w-12 text-sm">4 ★</div>
                      <div className="w-10 text-sm text-muted-foreground">15%</div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "5%" }}></div>
                      </div>
                      <div className="w-12 text-sm">3 ★</div>
                      <div className="w-10 text-sm text-muted-foreground">5%</div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                      <div className="w-12 text-sm">2 ★</div>
                      <div className="w-10 text-sm text-muted-foreground">0%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                      <div className="w-12 text-sm">1 ★</div>
                      <div className="w-10 text-sm text-muted-foreground">0%</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Comentários Recentes</h3>
                    <div className="space-y-4">
                      {stats.feedbacks.map((feedback, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{feedback.comment}</div>
                            <Badge variant="outline">{feedback.date}</Badge>
                          </div>
                          <div className="flex">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notificacoes" && (
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configurações de notificação serão implementadas em breve.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "configuracoes" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configurações da conta serão implementadas em breve.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
