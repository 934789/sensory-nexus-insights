
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminUserSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Registrar usuário
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) throw new Error("Não foi possível obter o ID do usuário");

      // Inserir diretamente no banco de dados usando função rpc para contornar as políticas RLS
      // Isso evita o problema de recursão infinita
      const { error: roleErr } = await supabase.rpc('add_user_role', {
        user_id_param: userId,
        role_param: 'admin'
      });
      
      if (roleErr) throw roleErr;
      
      // Adicionar também papel de recrutador
      const { error: recruiterRoleErr } = await supabase.rpc('add_user_role', {
        user_id_param: userId,
        role_param: 'recruiter'
      });
      
      if (recruiterRoleErr) throw recruiterRoleErr;

      toast({
        title: "Conta admin criada com sucesso!",
        description: "Você já pode fazer login como admin.",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      toast({
        title: "Erro ao criar conta admin",
        description: err.message,
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
              placeholder="admin@exemplo.com"
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
