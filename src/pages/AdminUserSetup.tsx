
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminUserSetup() {
  const [email, setEmail] = useState("admin@sensorytest.com");
  const [password, setPassword] = useState("SensoryAdmin2024!");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Iniciando criação de usuário admin");
      
      // Primeiro, tenta criar o usuário
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            user_type: 'admin'
          }
        }
      });

      console.log("Resultado da criação de usuário:", { data, error });
      
      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }

      const userId = data.user?.id;
      if (!userId) throw new Error("Não foi possível obter o ID do usuário");

      // Adicionar papéis de admin e recrutador
      const roles = ['admin', 'recruiter'];
      for (const role of roles) {
        console.log(`Adicionando papel: ${role}`);
        const { error: roleErr } = await supabase.rpc('add_user_role' as any, {
          user_id_param: userId,
          role_param: role
        });
        
        if (roleErr) {
          console.error(`Erro ao adicionar papel ${role}:`, roleErr);
          throw roleErr;
        }
      }

      toast({
        title: "Conta admin criada com sucesso!",
        description: "Você pode fazer login com admin@sensorytest.com",
      });
      
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      console.error("Erro completo:", err);
      
      const errorMessage = err.message || "Erro desconhecido ao criar conta admin";
      
      toast({
        title: "Erro ao criar conta admin",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 space-y-4">
          <CardTitle>Criar Conta Admin</CardTitle>
          <form className="space-y-4" onSubmit={handleCreateAdmin}>
            <InputWithLabel
              label="E-mail"
              id="admin-email"
              type="email"
              placeholder="admin@sensorytest.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <InputWithLabel
              label="Senha"
              id="admin-password"
              type="password"
              placeholder="Senha forte"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar conta admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
