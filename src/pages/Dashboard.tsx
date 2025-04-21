
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  FileText,
  BarChart2,
  UserCheck,
  PlusCircle,
  PauseCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { SurveyCard } from "@/components/survey/survey-card";
import { Navbar } from "@/components/layout/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for the dashboard
const pieChartData = [
  { name: "Ativas", value: 5, color: "#10b981" },
  { name: "Finalizadas", value: 12, color: "#6b7280" },
  { name: "Pausadas", value: 3, color: "#f59e0b" },
];

const barChartData = [
  { name: "Pesquisa A", value: 45 },
  { name: "Pesquisa B", value: 32 },
  { name: "Pesquisa C", value: 78 },
  { name: "Pesquisa D", value: 23 },
  { name: "Pesquisa E", value: 56 },
];

const recentSurveys = [
  {
    id: "1",
    title: "Análise Sensorial de Iogurte",
    description: "Avaliação das características sensoriais de novo iogurte sabor morango",
    participantCount: 32,
    status: "active" as const,
    date: "Criado em 15/04/2023",
    imageSrc: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Teste de Embalagem - Cosméticos",
    description: "Avaliação de nova embalagem de produtos para cuidados com a pele",
    participantCount: 18,
    status: "paused" as const,
    date: "Atualizado em 10/04/2023",
    imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Pesquisa de Sabor - Bebida Energética",
    description: "Percepção de sabor e intenção de compra de nova bebida energética",
    participantCount: 56,
    status: "finished" as const,
    date: "Finalizado em 05/04/2023",
    imageSrc: "https://images.unsplash.com/photo-1621263764928-df1444c5e882?q=80&w=500&auto=format&fit=crop"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recentes");

  const handleCreateSurvey = () => {
    navigate("/surveys/create");
  };

  const handleCreateScheduling = () => {
    navigate("/scheduling/create");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta! Confira os resumos das suas pesquisas.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateSurvey} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Nova Pesquisa</span>
            </Button>
            <Button onClick={handleCreateScheduling} variant="outline" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Novo Agendamento</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Pesquisas Ativas"
            value="5"
            icon={<ClipboardList />}
            trend={{ value: 10, positive: true }}
          />
          <StatCard
            title="Pesquisas Finalizadas"
            value="12"
            icon={<CheckCircle />}
            trend={{ value: 25, positive: true }}
          />
          <StatCard
            title="Pesquisas Pausadas"
            value="3"
            icon={<PauseCircle />}
            trend={{ value: 5, positive: false }}
          />
          <StatCard
            title="Total de Participantes"
            value="482"
            icon={<UserCheck />}
            trend={{ value: 12, positive: true }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 size={18} />
                Status das Pesquisas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={pieChartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck size={18} />
                Participantes por Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={barChartData} />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pesquisas</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="recentes">Recentes</TabsTrigger>
              <TabsTrigger value="ativas">Ativas</TabsTrigger>
              <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            </TabsList>
            <TabsContent value="recentes" className="animate-fade-in">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentSurveys.map((survey) => (
                  <SurveyCard
                    key={survey.id}
                    id={survey.id}
                    title={survey.title}
                    description={survey.description}
                    participantCount={survey.participantCount}
                    status={survey.status}
                    date={survey.date}
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="ativas" className="animate-fade-in">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentSurveys
                  .filter((survey) => survey.status === "active")
                  .map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      id={survey.id}
                      title={survey.title}
                      description={survey.description}
                      participantCount={survey.participantCount}
                      status={survey.status}
                      date={survey.date}
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="finalizadas" className="animate-fade-in">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentSurveys
                  .filter((survey) => survey.status === "finished")
                  .map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      id={survey.id}
                      title={survey.title}
                      description={survey.description}
                      participantCount={survey.participantCount}
                      status={survey.status}
                      date={survey.date}
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
