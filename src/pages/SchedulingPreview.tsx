
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Dados fictícios para demonstração
const schedulingData = {
  title: "Avaliação de Iogurte - Maio 2023",
  description: "Agendamento para teste presencial de novos sabores de iogurte",
  location: "Laboratório Sensorial - Rua das Flores, 123 - São Paulo",
  availableSlots: [
    { date: "25/05/2023", time: "09:00", capacity: 10, available: 2 },
    { date: "25/05/2023", time: "10:00", capacity: 10, available: 5 },
    { date: "25/05/2023", time: "11:00", capacity: 10, available: 10 },
    { date: "26/05/2023", time: "09:00", capacity: 8, available: 0 },
    { date: "26/05/2023", time: "10:00", capacity: 8, available: 3 },
  ]
};

export default function SchedulingPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Agendamento enviado com sucesso! Em um sistema real, os dados seriam salvos no banco de dados.");
  };

  const availableSlots = schedulingData.availableSlots.filter(slot => slot.available > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 border-b">
        <div className="container">
          <Button variant="ghost" onClick={goBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Visualização do Formulário</h1>
              <p className="text-sm text-muted-foreground">
                Pré-visualização de como o consumidor verá este agendamento
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                Modo Visualização
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">{schedulingData.title}</h2>
                </div>
              </div>

              <div className="border-t my-6"></div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">{schedulingData.description}</p>
                  <p className="text-sm bg-blue-50 text-blue-800 p-3 rounded-md">
                    <strong>Local:</strong> {schedulingData.location}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full-name">Nome Completo</Label>
                      <Input id="full-name" placeholder="Digite seu nome completo" required />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(00) 00000-0000" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthdate">Data de Nascimento</Label>
                    <Input id="birthdate" type="date" required />
                  </div>

                  <div className="space-y-3">
                    <Label>Selecione um Horário Disponível</Label>

                    {availableSlots.length > 0 ? (
                      <RadioGroup value={selectedSlot || ""} onValueChange={setSelectedSlot}>
                        <div className="space-y-2">
                          {availableSlots.map((slot, index) => (
                            <div 
                              key={index}
                              className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50"
                            >
                              <RadioGroupItem value={`${slot.date}-${slot.time}`} id={`slot-${index}`} />
                              <Label htmlFor={`slot-${index}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{slot.date} às {slot.time}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {slot.available} {slot.available === 1 ? "vaga disponível" : "vagas disponíveis"}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-md">
                        <p>Não há horários disponíveis no momento</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={!selectedSlot}>
                      Agendar Participação
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-4">
        <div className="container text-center text-sm text-muted-foreground">
          © 2023 SensoryNexus • Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}
