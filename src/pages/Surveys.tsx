
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { SurveyCard } from "@/components/survey/survey-card";

// Dummy data for surveys
const surveys = [
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

export default function Surveys() {
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    navigate("/surveys/create");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Pesquisas</h1>
            <p className="text-muted-foreground">Gerencie todas as suas pesquisas e avaliações</p>
          </div>
          <div>
            <Button onClick={handleCreateSurvey} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Nova Pesquisa</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              title={survey.title}
              description={survey.description}
              participantCount={survey.participantCount}
              status={survey.status}
              date={survey.date}
              imageSrc={survey.imageSrc}
              onClick={() => navigate(`/surveys/${survey.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
