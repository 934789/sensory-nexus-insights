
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Key, Bell } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("perfil");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div>
            <Card>
              <CardContent className="p-4">
                <Tabs value={activeTab} orientation="vertical" onValueChange={setActiveTab} className="h-full">
                  <TabsList className="flex flex-col items-stretch h-full bg-transparent space-y-1">
                    <TabsTrigger 
                      value="perfil" 
                      className="justify-start gap-2 px-3"
                    >
                      <User size={16} />
                      Perfil
                    </TabsTrigger>
                    <TabsTrigger 
                      value="senha" 
                      className="justify-start gap-2 px-3"
                    >
                      <Key size={16} />
                      Senha
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notificacoes" 
                      className="justify-start gap-2 px-3"
                    >
                      <Bell size={16} />
                      Notificações
                    </TabsTrigger>
                    <TabsTrigger 
                      value="configuracoes" 
                      className="justify-start gap-2 px-3"
                    >
                      <Settings size={16} />
                      Configurações
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <TabsContent value="perfil" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" defaultValue="João Silva" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" defaultValue="SensoryNexus Ltda." />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="(11) 98765-4321" />
                      </div>
                    </div>

                    <Button type="submit" className="mt-4">Salvar Alterações</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="senha" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button type="submit" className="mt-4">Alterar Senha</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configurações de notificação serão implementadas em breve.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configurações da conta serão implementadas em breve.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </main>
    </div>
  );
}
