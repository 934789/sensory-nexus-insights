
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type DeliveryStatus = 
  | "preparing" 
  | "shipped" 
  | "in-transit" 
  | "delivered" 
  | "completed" 
  | "canceled";

interface Sample {
  id: string;
  name: string;
  code: string;
  scheduledDate: string;
  scheduledTime?: string;
  instructions?: string;
  status: DeliveryStatus;
  address?: string;
  trackingCode?: string;
  surveyLink?: string;
}

interface SampleDeliveryTrackerProps {
  sampleId: string;
  onStatusChange?: (sampleId: string, newStatus: DeliveryStatus) => void;
}

export function SampleDeliveryTracker({ 
  sampleId,
  onStatusChange 
}: SampleDeliveryTrackerProps) {
  const { toast } = useToast();
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock function to fetch sample data - replace with Supabase query
  const fetchSample = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - in a real app this would come from Supabase
    const mockSample: Sample = {
      id,
      name: "Kit de Avaliação - Iogurtes Zero Açúcar",
      code: "YOG-2023-05-A",
      scheduledDate: "25/05/2023",
      scheduledTime: "14:00 - 18:00",
      instructions: "Mantenha refrigerado. Não consuma antes da sessão online.",
      status: "in-transit",
      address: "Av. Paulista, 1000, Apto 123, São Paulo - SP",
      trackingCode: "BR12345678SP",
      surveyLink: "/surveys/sample-test-yogurt"
    };
    
    setSample(mockSample);
    setLoading(false);
  };

  useEffect(() => {
    fetchSample(sampleId);
  }, [sampleId]);

  const handleConfirmDelivery = async () => {
    try {
      // Here you would call Supabase to update the status
      setSample(prev => prev ? { ...prev, status: "delivered" } : null);
      
      toast({
        title: "Recebimento confirmado!",
        description: "Você já pode acessar a pesquisa quando estiver pronto."
      });
      
      if (onStatusChange) {
        onStatusChange(sampleId, "delivered");
      }
    } catch (error) {
      toast({
        title: "Erro ao confirmar recebimento",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleStartSurvey = () => {
    if (!sample?.surveyLink) return;
    
    // Navigate to survey or open it
    window.location.href = sample.surveyLink;
  };

  const renderStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "preparing":
        return <Badge className="bg-blue-500">Em preparação</Badge>;
      case "shipped":
        return <Badge className="bg-indigo-500">Enviado</Badge>;
      case "in-transit":
        return <Badge className="bg-yellow-500">Em trânsito</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Entregue</Badge>;
      case "completed":
        return <Badge className="bg-green-700">Concluído</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>;
    }
  };

  const renderStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "preparing":
        return <Package size={24} className="text-blue-500" />;
      case "shipped":
        return <Truck size={24} className="text-indigo-500" />;
      case "in-transit":
        return <Truck size={24} className="text-yellow-500" />;
      case "delivered":
        return <CheckCircle size={24} className="text-green-500" />;
      case "completed":
        return <CheckCircle size={24} className="text-green-700" />;
      case "canceled":
        return <XCircle size={24} className="text-red-500" />;
      default:
        return <AlertCircle size={24} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <p>Carregando informações da amostra...</p>
        </CardContent>
      </Card>
    );
  }

  if (!sample) {
    return (
      <Card>
        <CardContent className="p-8">
          <p>Amostra não encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{sample.name}</CardTitle>
          {renderStatusBadge(sample.status)}
        </div>
        <p className="text-sm text-muted-foreground">Código: {sample.code}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Data agendada</p>
              </div>
              <p>{sample.scheduledDate}</p>
              {sample.scheduledTime && <p className="text-sm flex items-center gap-1 mt-1">
                <Clock size={14} className="text-muted-foreground" />
                <span>{sample.scheduledTime}</span>
              </p>}
            </div>
            
            {sample.address && (
              <div className="flex-1 border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-muted-foreground" />
                  <p className="text-sm font-medium">Endereço de entrega</p>
                </div>
                <p className="text-sm">{sample.address}</p>
              </div>
            )}
          </div>
          
          {/* Timeline for delivery tracking */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Status da Entrega</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-1 bg-green-100 text-green-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="w-px h-full bg-gray-200 mx-auto my-1"></div>
                </div>
                <div>
                  <p className="font-medium">Preparação</p>
                  <p className="text-sm text-muted-foreground">Amostra preparada para envio</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-1 bg-green-100 text-green-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="w-px h-full bg-gray-200 mx-auto my-1"></div>
                </div>
                <div>
                  <p className="font-medium">Envio</p>
                  <p className="text-sm text-muted-foreground">
                    Amostra despachada
                    {sample.trackingCode && (
                      <span className="block mt-1">
                        Código de rastreio: <span className="font-mono">{sample.trackingCode}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-1 ${sample.status === "in-transit" ? "bg-yellow-100 text-yellow-600" : sample.status === "delivered" || sample.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {sample.status === "in-transit" ? <Truck size={16} /> : sample.status === "delivered" || sample.status === "completed" ? <CheckCircle size={16} /> : <div className="w-4 h-4" />}
                  </div>
                  <div className="w-px h-full bg-gray-200 mx-auto my-1"></div>
                </div>
                <div>
                  <p className="font-medium">Em trânsito</p>
                  <p className="text-sm text-muted-foreground">Amostra a caminho do seu endereço</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-1 ${sample.status === "delivered" || sample.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {sample.status === "delivered" || sample.status === "completed" ? <CheckCircle size={16} /> : <div className="w-4 h-4" />}
                  </div>
                  <div className="w-px h-full bg-gray-200 mx-auto my-1"></div>
                </div>
                <div>
                  <p className="font-medium">Entrega</p>
                  <p className="text-sm text-muted-foreground">Amostra entregue ao consumidor</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-1 ${sample.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {sample.status === "completed" ? <CheckCircle size={16} /> : <div className="w-4 h-4" />}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Avaliação</p>
                  <p className="text-sm text-muted-foreground">Pesquisa concluída</p>
                </div>
              </div>
            </div>
          </div>
          
          {sample.instructions && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-500" />
                Instruções Especiais
              </h3>
              <p className="text-sm">{sample.instructions}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            {sample.status === "in-transit" && (
              <Button onClick={handleConfirmDelivery} className="w-full sm:w-auto">
                Confirmar Recebimento
              </Button>
            )}
            
            {sample.status === "delivered" && (
              <Button onClick={handleStartSurvey} className="w-full sm:w-auto">
                Iniciar Avaliação
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
