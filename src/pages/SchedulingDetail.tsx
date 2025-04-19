
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for demonstration
const schedulingData = {
  id: "1",
  title: "Avaliação de Iogurte - Maio 2023",
  description: "Agendamento para teste presencial de novos sabores de iogurte",
  date: "25/05/2023",
  location: "Laboratório Sensorial - Rua das Flores, 123 - São Paulo",
  timeSlots: [
    { time: "09:00", capacity: 10, enrolled: 8 },
    { time: "09:30", capacity: 10, enrolled: 10 },
    { time: "10:00", capacity: 10, enrolled: 5 },
    { time: "10:30", capacity: 10, enrolled: 2 },
    { time: "11:00", capacity: 10, enrolled: 0 },
  ],
  participants: [
    { id: 1, name: "Ana Silva", cpf: "123.456.789-10", timeslot: "09:00", status: "confirmado" },
    { id: 2, name: "Bruno Costa", cpf: "234.567.890-12", timeslot: "09:00", status: "confirmado" },
    { id: 3, name: "Carla Mendes", cpf: "345.678.901-23", timeslot: "09:30", status: "confirmado" },
    { id: 4, name: "Daniel Oliveira", cpf: "456.789.012-34", timeslot: "10:00", status: "confirmado" },
    { id: 5, name: "Ellen Souza", cpf: "567.890.123-45", timeslot: "10:00", status: "cancelado" },
  ],
  status: "active"
};

export default function SchedulingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(`https://sensory.app/scheduling/${id}`);
    // Idealmente usaríamos um toast aqui
    alert("Link copiado para a área de transferência!");
  };

  const handlePreviewForm = () => {
    // Em produção, isso abriria em uma nova aba ou modal
    navigate(`/scheduling/${id}/preview`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/scheduling")}
            className="mb-4"
          >
            ← Voltar para Agendamentos
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display">{schedulingData.title}</h1>
              <p className="text-muted-foreground">{schedulingData.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShareLink}>
                Copiar Link
              </Button>
              <Button variant="outline" onClick={handlePreviewForm}>
                Visualizar Formulário
              </Button>
              <Button>Editar Agendamento</Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Data: {schedulingData.date}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Local: {schedulingData.location}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>Total de participantes: {schedulingData.participants.filter(p => p.status === "confirmado").length}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Horários disponíveis: {schedulingData.timeSlots.filter(slot => slot.enrolled < slot.capacity).length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Preenchimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedulingData.timeSlots.map((slot, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.time}</span>
                          </div>
                          <span className="text-sm">{slot.enrolled}/{slot.capacity} vagas</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(slot.enrolled / slot.capacity) * 100}%` }}
                          ></div>
                        </div>
                        
                        {slot.enrolled >= slot.capacity && (
                          <p className="text-xs text-destructive">Horário esgotado</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedulingData.participants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{participant.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{participant.cpf}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{participant.timeslot}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeClass(participant.status)}>
                              {participant.status === "confirmado" ? "Confirmado" : "Cancelado"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="ghost" size="sm">Detalhes</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Agendamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações adicionais serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
