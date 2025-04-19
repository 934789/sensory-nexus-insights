
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Star, PieChart, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function RecruiterProfile() {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("Ana Silva");
  const [bio, setBio] = useState("Especialista em pesquisas de mercado com foco em alimentos e bebidas. Mais de 5 anos de experiência com avaliações sensoriais.");
  
  // Stats data
  const stats = {
    surveysCreated: 24,
    schedulesCreated: 12,
    averageRating: 4.7,
    lastActive: "Hoje, 14:35"
  };
  
  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "João Paulo",
      rating: 5,
      comment: "Muito organizado e profissional.",
      date: "15/04/2023"
    },
    {
      id: 2,
      name: "Mariana Costa",
      rating: 5,
      comment: "Pesquisa muito bem elaborada.",
      date: "02/05/2023"
    },
    {
      id: 3,
      name: "Carlos Eduardo",
      rating: 4,
      comment: "Boa experiência, recomendo.",
      date: "18/05/2023"
    }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas alterações foram salvas com sucesso."
    });
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Perfil do Recrutador</h1>
          <p className="text-muted-foreground">Gerencie seu perfil e visualize suas avaliações</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        {profileImage ? (
                          <AvatarImage src={profileImage} alt="Foto de perfil" />
                        ) : (
                          <AvatarFallback className="text-2xl">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        )}
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute -bottom-2 -right-2 rounded-full bg-primary text-white p-1.5 cursor-pointer"
                      >
                        <Camera size={16} />
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                        />
                      </label>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-xl font-semibold">{name}</h2>
                      <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                        {renderStars(stats.averageRating)}
                        <span className="text-sm font-medium ml-1">{stats.averageRating}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Recrutador desde Janeiro 2023</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio / Descrição</Label>
                    <Textarea 
                      id="bio" 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Avaliações dos Consumidores</h3>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex my-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <PieChart size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pesquisas Criadas</p>
                      <p className="text-xl font-semibold">{stats.surveysCreated}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Agendamentos Criados</p>
                      <p className="text-xl font-semibold">{stats.schedulesCreated}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Star size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avaliação Média</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xl font-semibold">{stats.averageRating}</p>
                        <div className="flex">
                          {renderStars(Math.round(stats.averageRating))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Última Atividade</p>
                      <p className="text-xl font-semibold">{stats.lastActive}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Opções Adicionais</h4>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start">
                  Exportar Dados de Avaliações
                </Button>
                <Button variant="outline" className="justify-start">
                  Preferências de Notificação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
