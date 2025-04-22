
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, BarChart, ChevronRight, Users, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";

interface SurveyCardProps {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "scheduled" | "completed" | "paused" | "finished";
  totalResponses?: number;
  targetResponses?: number;
  participantCount?: number;
  approvedCount?: number;
  rejectedCount?: number;
  date?: string;
  className?: string;
  imageSrc?: string;
  onClick?: () => void;
}

export function SurveyCard({
  id,
  title,
  description,
  status,
  totalResponses = 0,
  targetResponses = 100,
  participantCount,
  approvedCount = 0,
  rejectedCount = 0,
  date,
  className,
  onClick
}: SurveyCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Agendada</Badge>;
      case "completed":
        return <Badge className="bg-purple-500">Concluída</Badge>;
      case "paused":
        return <Badge className="bg-orange-500">Pausada</Badge>;
      case "finished":
        return <Badge className="bg-gray-500">Finalizada</Badge>;
    }
  };

  const getCompletionRate = () => {
    return Math.round((totalResponses / targetResponses) * 100);
  };

  // Use participantCount se fornecido, caso contrário, use totalResponses
  const responseCount = participantCount !== undefined ? participantCount : totalResponses;

  return (
    <Card className={cn("transition-all hover:border-primary", className)} onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>{responseCount} respostas</span>
            </div>
            {date && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{date}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span>Progresso</span>
              <span className="font-medium">{getCompletionRate()}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
          </div>
          
          {/* Participant approval stats */}
          {(approvedCount > 0 || rejectedCount > 0) && (
            <div className="flex justify-between items-center text-sm pt-2">
              <div className="flex items-center text-green-600">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{approvedCount} aprovados</span>
              </div>
              <div className="flex items-center text-red-600">
                <ThumbsDown className="mr-1 h-4 w-4" />
                <span>{rejectedCount} reprovados</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button asChild variant="outline" size="sm">
            <Link to={`/surveys/${id}`}>
              <span>Ver Detalhes</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          {status === "active" && (
            <Button asChild size="sm" variant="secondary">
              <Link to={`/analytics?survey=${id}`}>
                <BarChart className="mr-1 h-4 w-4" />
                <span>Análises</span>
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
