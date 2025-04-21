
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Calendar, CheckCircle, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Mock data for deliveries
const mockDeliveries = [
  {
    id: "d1",
    name: "Kit de Avaliação - Iogurtes Zero Açúcar",
    code: "YOG-2023-05-A",
    scheduledDate: "25/05/2023",
    consumer: { 
      id: "u1", 
      name: "Maria Silva", 
      location: "São Paulo, SP", 
      email: "maria.silva@exemplo.com" 
    },
    status: "delivered",
    trackingCode: "BR12345678SP"
  },
  {
    id: "d2",
    name: "Teste de Fragrâncias - Kit Primavera",
    code: "FRAG-2023-06-B",
    scheduledDate: "12/06/2023",
    consumer: { 
      id: "u2", 
      name: "João Santos", 
      location: "Rio de Janeiro, RJ", 
      email: "joao.santos@exemplo.com" 
    },
    status: "preparing",
    trackingCode: null
  },
  {
    id: "d3",
    name: "Teste de Snacks Proteicos",
    code: "SNACK-2023-05-C",
    scheduledDate: "30/05/2023",
    consumer: { 
      id: "u3", 
      name: "Ana Oliveira", 
      location: "Belo Horizonte, MG", 
      email: "ana.oliveira@exemplo.com" 
    },
    status: "shipped",
    trackingCode: "BR98765432MG"
  },
  {
    id: "d4",
    name: "Teste de Bebidas Energéticas",
    code: "DRINK-2023-06-A",
    scheduledDate: "05/06/2023",
    consumer: { 
      id: "u4", 
      name: "Carlos Pereira", 
      location: "Curitiba, PR", 
      email: "carlos.pereira@exemplo.com" 
    },
    status: "in-transit",
    trackingCode: "BR56781234PR"
  },
  {
    id: "d5",
    name: "Kit de Sabonetes Hidratantes",
    code: "SOAP-2023-05-B",
    scheduledDate: "28/05/2023",
    consumer: { 
      id: "u5", 
      name: "Luciana Ferreira", 
      location: "Porto Alegre, RS", 
      email: "luciana.ferreira@exemplo.com" 
    },
    status: "completed",
    trackingCode: "BR43216789RS"
  }
];

export default function DeliveryManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState(mockDeliveries);

  const handleStatusUpdate = (deliveryId: string, newStatus: string) => {
    setDeliveries(prev => 
      prev.map(item => 
        item.id === deliveryId ? { ...item, status: newStatus } : item
      )
    );
    
    toast({
      title: "Status atualizado",
      description: `O status da entrega foi atualizado com sucesso para: ${getStatusLabel(newStatus)}`,
    });
  };

  const handleSendTrackingEmail = (deliveryId: string) => {
    // This would integrate with Supabase Edge Functions to send emails
    toast({
      title: "Email enviado",
      description: "Email com informações de rastreio enviado ao consumidor.",
    });
  };

  const handleFilter = () => {
    let filtered = mockDeliveries;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(delivery => 
        delivery.name.toLowerCase().includes(searchLower) || 
        delivery.code.toLowerCase().includes(searchLower) ||
        delivery.consumer.name.toLowerCase().includes(searchLower) ||
        delivery.consumer.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }
    
    setDeliveries(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter(null);
    setDeliveries(mockDeliveries);
  };

  const filteredDeliveries = activeTab === "all" 
    ? deliveries 
    : deliveries.filter(delivery => delivery.status === activeTab);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "preparing": return "Em preparação";
      case "shipped": return "Enviado";
      case "in-transit": return "Em trânsito";
      case "delivered": return "Entregue";
      case "completed": return "Concluído";
      case "canceled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-blue-500";
      case "shipped": return "bg-indigo-500";
      case "in-transit": return "bg-yellow-500";
      case "delivered": return "bg-green-500";
      case "completed": return "bg-green-700";
      case "canceled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Gestão de Entregas</h1>
            <p className="text-muted-foreground">Gerencie o envio e recebimento de amostras</p>
          </div>
          <div>
            <Button className="flex items-center gap-2">
              <Package size={16} />
              <span>Nova Remessa</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, código ou consumidor..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter || ""} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="preparing">Em preparação</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="in-transit">Em trânsito</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={handleFilter}>
                  <Filter size={16} className="mr-2" /> Filtrar
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="preparing">Em preparação</TabsTrigger>
              <TabsTrigger value="shipped">Enviados</TabsTrigger>
              <TabsTrigger value="in-transit">Em trânsito</TabsTrigger>
              <TabsTrigger value="delivered">Entregues</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredDeliveries.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhuma entrega encontrada para os filtros selecionados.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredDeliveries.map(delivery => (
                    <Card key={delivery.id}>
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{delivery.name}</h3>
                                <Badge className={getStatusColor(delivery.status)}>
                                  {getStatusLabel(delivery.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Código: {delivery.code}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-muted-foreground" />
                              <span className="text-sm">{delivery.scheduledDate}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between mt-4 pt-4 border-t">
                            <div>
                              <p className="text-sm font-medium">Consumidor:</p>
                              <p>{delivery.consumer.name}</p>
                              <p className="text-sm text-muted-foreground">{delivery.consumer.location}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mt-3 sm:mt-0">Código de Rastreio:</p>
                              <p className="font-mono">
                                {delivery.trackingCode || "Não disponível"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t p-4 bg-gray-50 flex flex-wrap gap-3">
                          {delivery.status === "preparing" && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.id, "shipped")}
                              >
                                Marcar como Enviado
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.id, "canceled")}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          
                          {delivery.status === "shipped" && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleSendTrackingEmail(delivery.id)}
                              >
                                Enviar Email de Rastreio
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.id, "in-transit")}
                              >
                                Marcar Em Trânsito
                              </Button>
                            </>
                          )}
                          
                          {delivery.status === "in-transit" && (
                            <Button 
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, "delivered")}
                            >
                              Marcar como Entregue
                            </Button>
                          )}
                          
                          {delivery.status === "delivered" && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(delivery.id, "completed")}
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Marcar como Concluído
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
