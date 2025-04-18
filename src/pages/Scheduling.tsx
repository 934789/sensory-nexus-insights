
import { useNavigate } from "react-router-dom";
import { PlusCircle, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data for scheduling
const schedulingData = [
  {
    id: "1",
    title: "Avaliação de Iogurte - Maio 2023",
    description: "Agendamento para teste presencial de novos sabores de iogurte",
    date: "25/05/2023",
    timeSlots: 8,
    participantsRegistered: 5,
    status: "active"
  },
  {
    id: "2",
    title: "Teste de Cosméticos - Junho 2023",
    description: "Agendamento para avaliação de novos produtos de skincare",
    date: "12/06/2023",
    timeSlots: 12,
    participantsRegistered: 0,
    status: "upcoming"
  },
  {
    id: "3",
    title: "Avaliação de Bebidas - Abril 2023",
    description: "Teste de sabor de novas bebidas energéticas",
    date: "15/04/2023",
    timeSlots: 10,
    participantsRegistered: 10,
    status: "completed"
  }
];

export default function Scheduling() {
  const navigate = useNavigate();

  const handleCreateScheduling = () => {
    navigate("/scheduling/create");
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie seus agendamentos para testes presenciais</p>
          </div>
          <div>
            <Button onClick={handleCreateScheduling} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Novo Agendamento</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedulingData.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Calendar className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-md" />
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">{item.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horários:</span>
                      <span className="font-medium">{item.timeSlots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participantes:</span>
                      <span className="font-medium">{item.participantsRegistered}/{item.timeSlots}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-4 bg-gray-50">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/scheduling/${item.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
