import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Users, Calendar, Clock, Link as LinkIcon, 
  ExternalLink, Edit, Trash2, Download, Mail 
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const schedulingData = {
  id: "1",
  title: "Avaliação de Iogurte - Maio 2023",
  description: "Agendamento para teste presencial de novos sabores de iogurte",
  date: "25/05/2023",
  timeSlots: [
    { time: "09:00", capacity: 8, registered: 5 },
    { time: "10:00", capacity: 8, registered: 8 },
    { time: "11:00", capacity: 10, registered: 3 },
    { time: "14:00", capacity: 10, registered: 7 },
    { time: "15:00", capacity: 8, registered: 2 }
  ],
  status: "active",
  shareLink: "https://sensory.app/scheduling/xCvB7z",
  participants: [
    { id: 1, name: "Ana Maria", email: "ana@email.com", slot: "09:00", status: "confirmed" },
    { id: 2, name: "Carlos Silva", email: "carlos@email.com", slot: "09:00", status: "confirmed" },
    { id: 3, name: "Mariana Costa", email: "mariana@email.com", slot: "09:00", status: "confirmed" },
    { id: 4, name: "João Paulo", email: "joao@email.com", slot: "09:00", status: "confirmed" },
    { id: 5, name: "Fernanda Lima", email: "fernanda@email.com", slot: "09:00", status: "confirmed" },
    { id: 6, name: "Roberto Alves", email: "roberto@email.com", slot: "10:00", status: "confirmed" },
    { id: 7, name: "Juliana Mendes", email: "juliana@email.com", slot: "10:00", status: "confirmed" },
    { id: 8, name: "Ricardo Santos", email: "ricardo@email.com", slot: "10:00", status: "confirmed" },
    { id: 9, name: "Patricia Gomes", email: "patricia@email.com", slot: "10:00", status: "confirmed" },
    { id: 10, name: "Marcelo Dias", email: "marcelo@email.com", slot: "10:00", status: "confirmed" },
    { id: 11, name: "Luciana Costa", email: "luciana@email.com", slot: "10:00", status: "confirmed" },
    { id: 12, name: "Fernando Sousa", email: "fernando@email.com", slot: "10:00", status: "confirmed" },
    { id: 13, name: "Aline Ferreira", email: "aline@email.com", slot: "10:00", status: "confirmed" },
    { id: 14, name: "Gabriel Lima", email: "gabriel@email.com", slot: "11:00", status: "confirmed" },
    { id: 15, name: "Carolina Santos", email: "carolina@email.com", slot: "11:00", status: "confirmed" },
    { id: 16, name: "Rodrigo Alves", email: "rodrigo@email.com", slot: "11:00", status: "confirmed" },
    { id: 17, name: "Bianca Martins", email: "bianca@email.com", slot: "14:00", status: "confirmed" },
    { id: 18, name: "Leonardo Costa", email: "leonardo@email.com", slot: "14:00", status: "confirmed" },
    { id: 19, name: "Amanda Silva", email: "amanda@email.com", slot: "14:00", status: "confirmed" },
    { id: 20, name: "Felipe Oliveira", email: "felipe@email.com", slot: "14:00", status: "confirmed" },
    { id: 21, name: "Tatiana Rocha", email: "tatiana@email.com", slot: "14:00", status: "confirmed" },
    { id: 22, name: "Guilherme Nunes", email: "guilherme@email.com", slot: "14:00", status: "confirmed" },
    { id: 23, name: "Renata Dias", email: "renata@email.com", slot: "14:00", status: "confirmed" },
    { id: 24, name: "Bruno Mendes", email: "bruno@email.com", slot: "15:00", status: "confirmed" },
    { id: 25, name: "Sabrina Lima", email: "sabrina@email.com", slot: "15:00", status: "confirmed" }
  ]
};

export default function SchedulingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const scheduling = schedulingData;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scheduling.shareLink);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handlePreviewScheduling = () => {
    navigate(`/scheduling/${id}/preview`);
  };

  const handleEditScheduling = () => {
    navigate(`/scheduling/edit/${id}`);
  };

  const handleDeleteScheduling = () => {
    toast({
      title: "Agendamento excluído",
      description: "O agendamento foi excluído com sucesso.",
    });
    navigate("/scheduling");
  };

  const handleSendReminders = () => {
    toast({
      title: "Lembretes enviados",
      description: "Os lembretes foram enviados para todos os participantes.",
    });
  };

  const handleExportParticipants = () => {
    toast({
      title: "Lista exportada",
      description: "A lista de participantes foi exportada com sucesso.",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "upcoming":
        return "Futuro";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/scheduling")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Agendamentos
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-display">{scheduling.title}</h1>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(scheduling.status)}`}>
                  {getStatusText(scheduling.status)}
                </span>
              </div>
              <p className="text-muted-foreground">{scheduling.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyLink} className="flex items-center gap-1">
                <LinkIcon size={16} />
                Copiar Link
              </Button>
              
              <Button variant="outline" onClick={handlePreviewScheduling} className="flex items-center gap-1">
                <ExternalLink size={16} />
                Visualizar
              </Button>
              
              <Button variant="outline" onClick={handleEditScheduling} className="flex items-center gap-1">
                <Edit size={16} />
                Editar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="participants">Participantes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Horários e Vagas</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {scheduling.timeSlots.map((slot, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex flex-col items-center">
                              <Clock className="h-6 w-6 text-primary mb-2" />
                              <p className="text-lg font-medium">{slot.time}</p>
                              <p className="text-sm text-muted-foreground">{scheduling.date}</p>
                              <div className="mt-2 flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">
                                  {slot.registered}/{slot.capacity} vagas preenchidas
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border text-center">
                        <p className="text-muted-foreground text-sm">Total de Vagas</p>
                        <p className="text-2xl font-semibold">
                          {scheduling.timeSlots.reduce((acc, slot) => acc + slot.capacity, 0)}
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border text-center">
                        <p className="text-muted-foreground text-sm">Participantes</p>
                        <p className="text-2xl font-semibold">
                          {scheduling.timeSlots.reduce((acc, slot) => acc + slot.registered, 0)}
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border text-center">
                        <p className="text-muted-foreground text-sm">Taxa de Ocupação</p>
                        <p className="text-2xl font-semibold">
                          {Math.round((scheduling.timeSlots.reduce((acc, slot) => acc + slot.registered, 0) / 
                            scheduling.timeSlots.reduce((acc, slot) => acc + slot.capacity, 0)) * 100)}%
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border text-center">
                        <p className="text-muted-foreground text-sm">Horários</p>
                        <p className="text-2xl font-semibold">{scheduling.timeSlots.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="participants" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Lista de Participantes</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSendReminders} className="flex items-center gap-1">
                          <Mail size={16} />
                          <span>Enviar Lembretes</span>
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={handleExportParticipants} className="flex items-center gap-1">
                          <Download size={16} />
                          <span>Exportar Lista</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-600">
                            <tr>
                              <th className="px-6 py-3 text-left">Nome</th>
                              <th className="px-6 py-3 text-left">Email</th>
                              <th className="px-6 py-3 text-left">Horário</th>
                              <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {scheduling.participants.map((participant) => (
                              <tr key={participant.id} className="bg-white">
                                <td className="px-6 py-4 flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{participant.name}</span>
                                </td>
                                <td className="px-6 py-4">{participant.email}</td>
                                <td className="px-6 py-4">{participant.slot}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    Confirmado
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Compartilhamento</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input value={scheduling.shareLink} readOnly />
                      <Button variant="outline" onClick={handleCopyLink}>
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <Button variant="outline" className="w-full" onClick={handlePreviewScheduling}>
                        Visualizar Página de Inscrição
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Datas</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span>{scheduling.date}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horários:</span>
                      <span>{scheduling.timeSlots.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(scheduling.status)}`}>
                        {getStatusText(scheduling.status)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 text-red-600">Zona de Perigo</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleDeleteScheduling}
                    >
                      <Trash2 size={16} />
                      <span>Excluir Agendamento</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
