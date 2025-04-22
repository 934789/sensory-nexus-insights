
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Calendar, CheckCircle, Filter, MapPin, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Define types for deliveries
type DeliveryStatus = 
  | "preparing" 
  | "shipped" 
  | "in-transit" 
  | "delivered" 
  | "completed" 
  | "canceled";

interface Consumer {
  id: string;
  name: string;
  location: string;
  email: string;
  approved?: boolean;
}

interface Delivery {
  id: string;
  name: string;
  code: string;
  scheduledDate: string;
  consumer: Consumer;
  status: DeliveryStatus;
  trackingCode: string | null;
  surveyId?: string;
}

export default function DeliveryManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch delivery data from Supabase
  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sample_deliveries')
        .select(`
          id,
          name,
          code,
          scheduled_date,
          status,
          tracking_code,
          survey_id,
          consumer:consumer_id (
            id,
            name,
            location,
            email,
            approved
          )
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      // Format the data to match our interface
      const formattedData: Delivery[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        scheduledDate: new Date(item.scheduled_date).toLocaleDateString('pt-BR'),
        consumer: item.consumer,
        status: item.status,
        trackingCode: item.tracking_code,
        surveyId: item.survey_id
      }));

      setDeliveries(formattedData);

      // Extract unique locations
      const uniqueLocations = Array.from(new Set(
        formattedData.map(delivery => delivery.consumer.location)
      )).filter(Boolean) as string[];

      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as entregas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    // Set up real-time subscription
    const deliverySubscription = supabase
      .channel('delivery-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sample_deliveries' 
      }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(deliverySubscription);
    };
  }, []);

  const handleStatusUpdate = async (deliveryId: string, newStatus: DeliveryStatus) => {
    try {
      const { error } = await supabase
        .from('sample_deliveries')
        .update({ status: newStatus })
        .eq('id', deliveryId);
      
      if (error) throw error;
      
      setDeliveries(prev => 
        prev.map(item => 
          item.id === deliveryId ? { ...item, status: newStatus } : item
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `O status da entrega foi atualizado com sucesso para: ${getStatusLabel(newStatus)}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da entrega.",
        variant: "destructive"
      });
    }
  };

  const handleApproveParticipant = async (consumerId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('consumer_profiles')
        .update({ approved })
        .eq('id', consumerId);
      
      if (error) throw error;
      
      setDeliveries(prev => 
        prev.map(item => 
          item.consumer.id === consumerId 
            ? { ...item, consumer: { ...item.consumer, approved } } 
            : item
        )
      );
      
      toast({
        title: approved ? "Participante aprovado" : "Participante reprovado",
        description: `O status de aprovação do participante foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status de aprovação do participante.",
        variant: "destructive"
      });
    }
  };

  const handleSendTrackingEmail = async (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    try {
      // Here we would call a Supabase Edge Function to send the email
      // For demo, we'll just update a notification field
      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: delivery.consumer.id,
          message: `Sua amostra ${delivery.code} foi enviada e está a caminho.`,
          type: 'tracking_notification',
          read: false
        });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Email com informações de rastreio enviado ao consumidor.",
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar a notificação ao consumidor.",
        variant: "destructive"
      });
    }
  };

  const handleFilter = () => {
    fetchDeliveries().then(() => {
      let filtered = [...deliveries];
      
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
      
      if (locationFilter) {
        filtered = filtered.filter(delivery => 
          delivery.consumer.location.toLowerCase() === locationFilter.toLowerCase()
        );
      }
      
      if (approvalFilter) {
        if (approvalFilter === 'approved') {
          filtered = filtered.filter(delivery => delivery.consumer.approved === true);
        } else if (approvalFilter === 'rejected') {
          filtered = filtered.filter(delivery => delivery.consumer.approved === false);
        } else if (approvalFilter === 'pending') {
          filtered = filtered.filter(delivery => delivery.consumer.approved === undefined);
        }
      }
      
      setDeliveries(filtered);
    });
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter(null);
    setLocationFilter(null);
    setApprovalFilter(null);
    fetchDeliveries();
  };

  // Calculate deliveries by city for route optimization
  const deliveriesByCity = deliveries.reduce((acc: Record<string, Delivery[]>, delivery) => {
    const city = delivery.consumer.location.split(',')[0].trim();
    if (!acc[city]) acc[city] = [];
    acc[city].push(delivery);
    return acc;
  }, {});

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

  const getApprovalBadge = (approved: boolean | undefined) => {
    if (approved === undefined) return <Badge variant="outline">Pendente</Badge>;
    
    return approved ? (
      <Badge className="bg-green-600">
        <ThumbsUp size={14} className="mr-1" /> Aprovado
      </Badge>
    ) : (
      <Badge className="bg-red-600">
        <ThumbsDown size={14} className="mr-1" /> Reprovado
      </Badge>
    );
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
            <Button className="flex items-center gap-2" onClick={() => navigate("/surveys/create")}>
              <Package size={16} />
              <span>Nova Remessa</span>
            </Button>
          </div>
        </div>

        {/* Route Optimization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-primary" />
              Rotas Otimizadas por Região
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(deliveriesByCity).length === 0 ? (
                <p className="text-muted-foreground">Nenhuma entrega pendente para roteirização.</p>
              ) : (
                Object.entries(deliveriesByCity).map(([city, cityDeliveries]) => (
                  <div key={city} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold flex items-center">
                        <MapPin size={18} className="mr-2 text-primary" />
                        {city}
                      </h3>
                      <Badge variant="outline">{cityDeliveries.length} entregas</Badge>
                    </div>
                    <div className="space-y-2">
                      {cityDeliveries.map(delivery => (
                        <div key={delivery.id} className="pl-6 flex justify-between items-center text-sm border-b pb-2">
                          <div>
                            <span className="font-medium">{delivery.consumer.name}</span> - {delivery.name}
                          </div>
                          <Badge className={getStatusColor(delivery.status)}>
                            {getStatusLabel(delivery.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline">
                        <MapPin size={14} className="mr-1" />
                        Ver no Mapa
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

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
                <div className="w-full md:w-48">
                  <Select value={locationFilter || ""} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Localização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={approvalFilter || ""} onValueChange={setApprovalFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aprovação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Reprovados</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
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
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Carregando entregas...</p>
                  </CardContent>
                </Card>
              ) : filteredDeliveries.length === 0 ? (
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
                              <div className="flex items-center gap-2">
                                <p>{delivery.consumer.name}</p>
                                {getApprovalBadge(delivery.consumer.approved)}
                              </div>
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
                        
                        <div className="border-t p-4 bg-gray-50 flex flex-wrap justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
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
                              onClick={() => navigate(`/surveys/${delivery.surveyId}`)}
                            >
                              Ver Pesquisa
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveParticipant(delivery.consumer.id, true)}
                            >
                              <ThumbsUp size={16} className="mr-1" />
                              Aprovar Participante
                            </Button>
                            
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleApproveParticipant(delivery.consumer.id, false)}
                            >
                              <ThumbsDown size={16} className="mr-1" />
                              Reprovar Participante
                            </Button>
                          </div>
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
