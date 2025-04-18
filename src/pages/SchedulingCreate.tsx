
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Plus, Save, Trash2 } from "lucide-react";
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

export default function SchedulingCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  const handleTimeToggle = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Agendamento criado com sucesso!",
      description: "Seu link de agendamento está pronto para ser compartilhado.",
    });
    navigate("/dashboard");
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
                    <Input value="https://sensory.app/schedule/xCvB7z" readOnly />
                    <Button variant="outline">Copiar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este link será gerado automaticamente após salvar o agendamento
                  </p>
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
                          <option>09:00 - 25/05/2023</option>
                          <option>09:30 - 25/05/2023</option>
                          <option>10:00 - 25/05/2023</option>
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
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Horários Disponíveis</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTimes(timeSlots)}>
                        Selecionar Todos
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTimes([])}>
                        Limpar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <div
                        key={time}
                        className={`
                          py-2 px-3 rounded-md border text-center cursor-pointer transition-colors
                          ${selectedTimes.includes(time) 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-input hover:bg-accent"}
                        `}
                        onClick={() => handleTimeToggle(time)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label className="mb-2 block">Datas Adicionadas</Label>
                  
                  <div className="space-y-2">
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">25/05/2023</h4>
                          <p className="text-sm text-muted-foreground">8 horários selecionados</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Data
                    </Button>
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
