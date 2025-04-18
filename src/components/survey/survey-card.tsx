
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SurveyCardProps {
  title: string;
  description: string;
  participantCount: number;
  status: "active" | "paused" | "finished";
  imageSrc?: string;
  date: string;
  onClick?: () => void;
}

export function SurveyCard({ 
  title, 
  description, 
  participantCount, 
  status, 
  imageSrc, 
  date,
  onClick
}: SurveyCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
        onClick ? "hover:translate-y-[-2px]" : ""
      )}
      onClick={onClick}
    >
      {imageSrc && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge 
            variant={
              status === "active" ? "default" : 
              status === "paused" ? "secondary" : "outline"
            }
            className={cn(
              status === "active" && "bg-green-100 text-green-800 hover:bg-green-100",
              status === "paused" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
              status === "finished" && "bg-gray-100 text-gray-800 hover:bg-gray-100"
            )}
          >
            {status === "active" ? "Ativa" : 
             status === "paused" ? "Pausada" : "Finalizada"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{participantCount} {participantCount === 1 ? "participante" : "participantes"}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {date}
      </CardFooter>
    </Card>
  );
}
