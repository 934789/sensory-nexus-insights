
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Check, Truck, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SampleDeliveryStatusProps {
  status: 'preparing' | 'shipped' | 'in-transit' | 'delivered' | 'completed' | 'canceled';
  trackingCode?: string;
  scheduledDate?: string;
  recipientName?: string;
  sampleName?: string;
  onStatusChange?: (newStatus: string) => void;
}

export function SampleDeliveryStatus({
  status,
  trackingCode,
  scheduledDate,
  recipientName,
  sampleName = "Kit de avaliação",
  onStatusChange
}: SampleDeliveryStatusProps) {
  const getStatusLabel = () => {
    switch (status) {
      case "preparing": return "Em preparação";
      case "shipped": return "Enviado";
      case "in-transit": return "Em trânsito";
      case "delivered": return "Entregue";
      case "completed": return "Concluído";
      case "canceled": return "Cancelado";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "preparing": return "bg-blue-500";
      case "shipped": return "bg-indigo-500";
      case "in-transit": return "bg-yellow-500";
      case "delivered": return "bg-green-500";
      case "completed": return "bg-green-700";
      case "canceled": return "bg-red-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "preparing": return <Package className="h-5 w-5" />;
      case "shipped": return <Truck className="h-5 w-5" />;
      case "in-transit": return <Truck className="h-5 w-5" />;
      case "delivered": return <Check className="h-5 w-5" />;
      case "completed": return <Check className="h-5 w-5" />;
      case "canceled": return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const handleConfirmDelivery = () => {
    if (onStatusChange) {
      onStatusChange("delivered");
    }
    
    toast({
      title: "Entrega confirmada!",
      description: "O check-in da sua amostra foi registrado com sucesso."
    });
  };

  const handleCompleteEvaluation = () => {
    if (onStatusChange) {
      onStatusChange("completed");
    }
    
    toast({
      title: "Avaliação concluída!",
      description: "Check-out da amostra registrado e avaliação finalizada."
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Status da Entrega</span>
          <Badge className={getStatusColor()}>
            {getStatusLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>Amostra: <span className="font-medium">{sampleName}</span></span>
          </div>

          {recipientName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="h-4 w-4 text-muted-foreground">👤</span>
              <span>Destinatário: <span className="font-medium">{recipientName}</span></span>
            </div>
          )}

          {scheduledDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Data programada: <span className="font-medium">{scheduledDate}</span></span>
            </div>
          )}

          {trackingCode && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Código de rastreio: <span className="font-mono font-medium">{trackingCode}</span></span>
            </div>
          )}

          {(status === "in-transit" || status === "shipped") && (
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
              <Package className="h-4 w-4" />
              <AlertTitle>Amostra a caminho</AlertTitle>
              <AlertDescription>
                Ao receber sua amostra, confirme o recebimento clicando no botão abaixo para iniciar a avaliação.
              </AlertDescription>
            </Alert>
          )}

          {status === "delivered" && (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Amostra recebida</AlertTitle>
              <AlertDescription>
                Você já pode iniciar sua avaliação. Ao finalizar, não se esqueça de registrar o check-out da amostra.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2 pt-2">
            {(status === "in-transit" || status === "shipped") && (
              <Button onClick={handleConfirmDelivery}>
                Confirmar Recebimento (Check-in)
              </Button>
            )}

            {status === "delivered" && (
              <Button variant="outline" onClick={handleCompleteEvaluation}>
                Finalizar Avaliação (Check-out)
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
