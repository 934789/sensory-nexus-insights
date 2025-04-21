
import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShareSurveyProps {
  surveyId: string;
  surveyName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmitRating?: (rating: number, comment: string) => void;
}

export function ShareSurvey({ 
  surveyId, 
  surveyName, 
  open, 
  onOpenChange,
  onSubmitRating 
}: ShareSurveyProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const shareUrl = `https://sensory.app/survey/${surveyId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma classificação com estrelas.",
        variant: "destructive"
      });
      return;
    }
    
    if (onSubmitRating) {
      onSubmitRating(rating, comment);
    }
    
    setHasSubmitted(true);
    
    toast({
      title: "Avaliação enviada!",
      description: "Obrigado pelo seu feedback.",
    });
  };

  // Se for usado como modal
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Pesquisa</DialogTitle>
            <DialogDescription>
              {surveyName ? `Compartilhe a pesquisa "${surveyName}" com participantes` : "Compartilhe esta pesquisa com participantes"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Ou compartilhe via</p>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full">
                <span>Email</span>
              </Button>
              <Button variant="outline" className="w-full">
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Se for usado como componente standalone
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Obrigado pela participação!</h2>
            <p className="text-muted-foreground mt-2">
              Sua resposta foi registrada com sucesso.
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-center font-medium mb-3">Compartilhe esta pesquisa</p>
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <Input value={shareUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={handleCopy} className="flex-shrink-0">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {!hasSubmitted && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Como foi sua experiência?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Avalie a experiência com este recrutador
              </p>
            </div>
            
            <div className="flex justify-center">
              <StarRating
                total={5}
                initialRating={0}
                size={32}
                onChange={(value) => setRating(value)}
              />
            </div>
            
            <div>
              <Textarea
                placeholder="Comentário adicional (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleSubmitRating}>
                Enviar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
