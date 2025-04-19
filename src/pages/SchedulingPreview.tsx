
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, Users, Check, X } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Dummy data for scheduling
const schedulingData = {
  id: "1",
  title: "Avaliação de Iogurte - Maio 2023",
  description: "Agendamento para teste presencial de novos sabores de iogurte. O teste terá duração de aproximadamente 30 minutos. Local: Laboratório de Análise Sensorial, Rua das Flores, 123 - Centro.",
  date: "25/05/2023",
  timeSlots: [
    { time: "09:00", capacity: 8, registered: 5 },
    { time: "10:00", capacity: 8, registered: 8 },
    { time: "11:00", capacity: 10, registered: 3 },
    { time: "14:00", capacity: 10, registered: 7 },
    { time: "15:00", capacity: 8, registered: 2 }
  ],
  status: "active",
  location: "Laboratório de Análise Sensorial, Rua das Flores, 123 - Centro",
  compensation: "R$ 50,00 em vale-compras",
  duration: "30 minutos",
  logoUrl: null
};

export default function SchedulingPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [previewMode, setPreviewMode] = useState(true);
  
  // In a real app, we would fetch the scheduling data based on the ID
  const scheduling = schedulingData;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (previewMode) {
      toast({
        title: "Modo de visualização",
        description: "No modo de visualização, o registro não é processado. Este é apenas um preview.",
      });
      return;
    }
    
    // In a real app, we would submit the form data to an API
    toast({
      title: "Participação agendada!",
      description: "Seu agendamento foi confirmado com sucesso.",
    });
    
    // Clear form
    setSelectedSlot("");
    setName("");
    setEmail("");
    setPhone("");
    setCpf("");
    setBirthdate("");
    setGender("");
  };

  const getAvailableSlots = () => {
    return scheduling.timeSlots.filter(slot => slot.registered < slot.capacity);
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        {previewMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Modo de Visualização</h3>
              <p className="text-blue-700 text-sm">Esta é uma visualização de como os consumidores verão sua página de agendamento.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/scheduling/${id}`)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para Detalhes
              </Button>
              <Button onClick={() => setPreviewMode(false)}>
                Sair do Modo Preview
              </Button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold font-display">{scheduling.title}</h1>
              <p className="text-muted-foreground mt-2">{scheduling.description}</p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Informações do Teste</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Data</p>
                        <p className="text-muted-foreground">{scheduling.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Duração</p>
                        <p className="text-muted-foreground">{scheduling.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Localização</p>
                        <p className="text-muted-foreground">{scheduling.location}</p>
                      </div>
                    </div>
                    
                    {scheduling.compensation && (
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 text-primary mt-0.5 flex items-center justify-center">
                          <span className="font-bold">R$</span>
                        </div>
                        <div>
                          <p className="font-medium">Compensação</p>
                          <p className="text-muted-foreground">{scheduling.compensation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Horários Disponíveis</h3>
                  
                  <div>
                    <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot}>
                      <div className="grid grid-cols-1 gap-3">
                        {scheduling.timeSlots.map((slot, i) => {
                          const isFull = slot.registered >= slot.capacity;
                          
                          return (
                            <div 
                              key={i} 
                              className={`border rounded-lg p-4 transition-colors ${
                                selectedSlot === `${slot.time}` 
                                  ? "border-primary bg-primary/5" 
                                  : isFull 
                                  ? "bg-gray-100 opacity-60 cursor-not-allowed" 
                                  : "hover:border-primary/50 cursor-pointer"
                              }`}
                            >
                              <RadioGroupItem 
                                value={`${slot.time}`}
                                id={`slot-${i}`}
                                className="hidden"
                                disabled={isFull}
                              />
                              <label 
                                htmlFor={`slot-${i}`}
                                className={`flex items-center justify-between cursor-pointer ${isFull ? "cursor-not-allowed" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                    <Clock className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{slot.time}</p>
                                    <p className="text-sm text-muted-foreground">{scheduling.date}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  {isFull ? (
                                    <span className="flex items-center text-sm text-rose-600 gap-1">
                                      <X size={14} />
                                      Lotado
                                    </span>
                                  ) : (
                                    <>
                                      {selectedSlot === `${slot.time}` && (
                                        <Check className="h-5 w-5 text-primary" />
                                      )}
                                      <span className="text-sm text-muted-foreground ml-2">
                                        {slot.capacity - slot.registered} vagas disponíveis
                                      </span>
                                    </>
                                  )}
                                </div>
                              </label>
                            </div>
                          );
                        })}
                        
                        {availableSlots.length === 0 && (
                          <div className="text-center p-6 border rounded-lg">
                            <p className="text-muted-foreground">Todos os horários estão lotados</p>
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Dados para Agendamento</h3>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input 
                        id="cpf" 
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="birthdate">Data de Nascimento</Label>
                      <Input 
                        id="birthdate" 
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="non-binary">Não-binário</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={!selectedSlot}
                    >
                      Confirmar Agendamento
                    </Button>
                    
                    {!selectedSlot && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Selecione um horário disponível para continuar
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {availableSlots.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {availableSlots.length} {availableSlots.length === 1 ? 'horário disponível' : 'horários disponíveis'} para agendamento.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
