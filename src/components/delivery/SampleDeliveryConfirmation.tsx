import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabaseClient } from "@/integrations/supabase/mock-client";

interface SampleDeliveryProps {
  sampleId: string;
  name: string;
  status: "preparing" | "shipped" | "in-transit" | "delivered" | "completed";
  code: string;
  surveyId: string;
}

export function SampleDeliveryConfirmation({ 
  sampleId, 
  name, 
  status, 
  code,
  surveyId
}: SampleDeliveryProps) {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    setIsLoading(true);
    
    try {
      // Update the delivery status in the database using the updated mock client
      const updateResult = await supabaseClient
        .from('sample_deliveries')
        .eq('id', sampleId)
        .update({ status: 'delivered' });
        
      if (updateResult.error) throw updateResult.error;
      
      // Update local state
      setCurrentStatus('delivered');
      
      // Notify the recruiter about the delivery confirmation
      const notificationResult = await supabaseClient
        .from('notifications')
        .insert({
          recipient_id: null, // Will be looked up from the survey
          survey_id: surveyId,
          message: `A amostra ${code} foi recebida pelo participante`,
          type: 'delivery_confirmation',
          read: false
        });
      
      if (notificationResult.error) {
        console.error("Erro ao enviar notificação:", notificationResult.error);
      }
      
      toast({
        title: "Recebimento confirmado!",
        description: "A pesquisa está agora disponível para você."
      });
    } catch (error) {
      console.error("Erro ao confirmar recebimento:", error);
      toast({
        title: "Erro ao confirmar recebimento",
        description: "Por favor tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Already delivered, only show status
  if (currentStatus === 'delivered' || currentStatus === 'completed') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Status da Amostra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">Código: {code}</p>
            </div>
            <Badge className="bg-green-500">
              <CheckCircle className="mr-1 h-4 w-4" />
              Recebido
            </Badge>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => window.location.href = `/surveys/${surveyId}`}>
              Participar da Pesquisa
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Not yet delivered, show confirmation button
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Amostra em Rota de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">Código: {code}</p>
          </div>
          <Badge className="bg-yellow-500">
            <Truck className="mr-1 h-4 w-4" />
            Em Trânsito
          </Badge>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
          <p className="text-sm">Uma amostra foi enviada para você. Quando receber, por favor confirme o recebimento.</p>
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleConfirmDelivery}
          disabled={isLoading}
        >
          <Package className="mr-2 h-4 w-4" />
          {isLoading ? "Processando..." : "Confirmar Recebimento"}
        </Button>
        
        <p className="text-xs text-center mt-2 text-muted-foreground">
          *A pesquisa será liberada automaticamente após a confirmação
        </p>
      </CardContent>
    </Card>
  );
}
