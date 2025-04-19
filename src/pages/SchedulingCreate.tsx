
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Plus, Save, Trash2, Users, Link as LinkIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

interface TimeSlot {
  time: string;
  capacity: number;
  selected: boolean;
}

export default function SchedulingCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scheduledDates, setScheduledDates] = useState<{date: string, slots: TimeSlot[]}[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>(
    timeSlots.map(time => ({ time, capacity: 10, selected: false }))
  );
  const [shareLink, setShareLink] = useState<string>("https://sensory.app/schedule/xCvB7z");
  
  // Adicionar vagas por horário
  const handleCapacityChange = (time: string, capacity: number) => {
    setSlots(slots.map(slot => 
      slot.time === time ? { ...slot, capacity } : slot
    ));
  };
  
  const handleTimeToggle = (time: string) => {
    setSlots(slots.map(slot => 
      slot.time === time ? { ...slot, selected: !slot.selected } : slot
    ));
  };
  
  const handleSave = () => {
    toast({
      title: "Agendamento criado com sucesso!",
      description: "Seu link de agendamento está pronto para ser compartilhado.",
    });
    navigate("/dashboard");
  };

  const handleAddDate = () => {
    if (!date) return;
    
    const formattedDate = date.toLocaleDateString('pt-BR');
    if (scheduledDates.find(item => item.date === formattedDate)) {
      toast({
        title: "Data já adicionada",
        description: "Esta data já foi adicionada ao agendamento.",
        variant: "destructive"
      });
      return;
    }

    const selectedSlots = slots.filter(slot => slot.selected);
    if (selectedSlots.length === 0) {
      toast({
        title: "Nenhum horário selecionado",
        description: "Selecione pelo menos um horário para esta data.",
        variant: "destructive"
      });
      return;
    }

    setScheduledDates([
      ...scheduledDates, 
      { 
        date: formattedDate, 
        slots: selectedSlots
      }
    ]);

    // Reset selections
    setSlots(slots.map(slot => ({ ...slot, selected: false })));
    setSelectedDate(formattedDate);
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setScheduledDates(scheduledDates.filter(item => item.date !== dateToRemove));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handlePreviewForm = () => {
    // Em produção, isso abriria em uma nova aba ou modal
    toast({
      title: "Visualização do formulário",
      description: "Esta funcionalidade estará disponível após salvar o agendamento.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Dashboard
          </Button>
          <h1 className="text-3xl font-bold font-display">Criar Novo Agendamento</h1>
          <p className="text-muted-foreground">Configure datas e horários disponíveis para testes presenciais</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label htmlFor="title">Título do Agendamento</Label>
                  <Input id="title" placeholder="Ex: Teste de Produto X - Maio 2023" />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva os detalhes do agendamento, como local, duração, etc." 
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Link de Compartilhamento</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={shareLink} readOnly />
                    <Button variant="outline" onClick={handleCopyLink}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este link será gerado automaticamente após salvar o agendamento
                  </p>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full" onClick={handlePreviewForm}>
                    Visualizar Formulário para Consumidores
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div>
                  <Label className="text-lg mb-4 block">Visualização do Formulário para Consumidores</Label>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Agendamento - Teste de Produto</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="demo-name">Nome Completo</Label>
                        <Input id="demo-name" placeholder="Digite seu nome completo" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="demo-cpf">CPF</Label>
                          <Input id="demo-cpf" placeholder="000.000.000-00" />
                        </div>
                        
                        <div>
                          <Label htmlFor="demo-birth">Data de Nascimento</Label>
                          <Input type="date" id="demo-birth" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="demo-time">Selecione um Horário</Label>
                        <select id="demo-time" className="w-full h-10 px-3 rounded-md border">
                          <option>09:00 - 25/05/2023 (8 vagas disponíveis)</option>
                          <option>09:30 - 25/05/2023 (5 vagas disponíveis)</option>
                          <option>10:00 - 25/05/2023 (10 vagas disponíveis)</option>
                        </select>
                      </div>
                      
                      <Button className="w-full">Agendar Participação</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <Label className="text-lg mb-4 block">Datas e Horários Disponíveis</Label>
                
                <div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mb-4"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Horários Disponíveis</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSlots(slots.map(slot => ({...slot, selected: true})))}
                      >
                        Selecionar Todos
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSlots(slots.map(slot => ({...slot, selected: false})))}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {slots.map(slot => (
                      <div
                        key={slot.time}
                        className={`
                          py-2 px-3 rounded-md border text-center cursor-pointer transition-colors
                          ${slot.selected 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-input hover:bg-accent"}
                        `}
                        onClick={() => handleTimeToggle(slot.time)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{slot.time}</span>
                        </div>
                        
                        {slot.selected && (
                          <div className="mt-2 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <Input
                              type="number"
                              min="1"
                              value={slot.capacity}
                              onChange={(e) => handleCapacityChange(slot.time, parseInt(e.target.value) || 1)}
                              className="h-6 w-16 text-xs text-center"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs ml-1">vagas</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={handleAddDate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Data
                  </Button>
                </div>
                
                <div>
                  <Label className="mb-2 block">Datas Adicionadas</Label>
                  
                  <div className="space-y-2">
                    {scheduledDates.map((scheduledDate) => (
                      <div key={scheduledDate.date} className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{scheduledDate.date}</h4>
                            <p className="text-sm text-muted-foreground">
                              {scheduledDate.slots.length} horários • {
                                scheduledDate.slots.reduce((total, slot) => total + slot.capacity, 0)
                              } vagas
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveDate(scheduledDate.date)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-1">
                          {scheduledDate.slots.map((slot) => (
                            <div key={slot.time} className="text-xs bg-gray-100 rounded px-2 py-1 flex justify-between">
                              <span>{slot.time}</span>
                              <span>{slot.capacity} vagas</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {scheduledDates.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border rounded-md">
                        <p>Nenhuma data adicionada ainda</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Salvar Agendamento
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
