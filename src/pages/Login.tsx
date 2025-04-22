import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { supabaseClient } from "@/integrations/supabase/mock-client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("recruiter");
  const [activeTab, setActiveTab] = useState("login");
  
  // Registration fields
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [allergies, setAllergies] = useState("");
  const [preferences, setPreferences] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Redirect based on user type (stored in user metadata)
        const userType = data.session.user.user_metadata?.user_type || 'consumer';
        
        if (userType === 'recruiter') {
          navigate("/dashboard");
        } else {
          navigate("/consumer-profile");
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso!",
        description: data.user?.user_metadata?.user_type === "recruiter" 
          ? "Bem-vindo(a) ao painel de recrutador."
          : "Bem-vindo(a) ao seu perfil de consumidor.",
      });
      
      // Redirect based on user type
      if (data.user?.user_metadata?.user_type === "recruiter") {
        navigate("/dashboard");
      } else {
        navigate("/consumer-profile");
      }
      
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError("É necessário aceitar os termos de uso para continuar.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            user_type: userType,
            full_name: name,
            allergies: userType === 'consumer' ? allergies : null,
            preferences: userType === 'consumer' ? preferences : null,
          },
        }
      });
      
      if (error) throw error;
      
      // Create profile record in appropriate table
      const profileTable = userType === 'recruiter' ? 'recruiter_profiles' : 'consumer_profiles';
      
      const { error: profileError } = await supabaseClient
        .from(profileTable)
        .insert({
          user_id: data.user?.id,
          name,
          email: registerEmail,
          allergies: userType === 'consumer' ? allergies : null,
          preferences: userType === 'consumer' ? preferences : null,
        });
      
      if (profileError) throw profileError;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo(a) à plataforma SensoryNexus.",
      });
      
      // Redirect based on user type
      if (userType === "recruiter") {
        navigate("/dashboard");
      } else {
        navigate("/consumer-profile");
      }
      
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-blue-50"
      style={{ 
        backgroundImage: `url(/src/assets/research-bg.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-display text-primary">SensoryNexus</CardTitle>
            <CardDescription>
              Plataforma para pesquisas e análises sensoriais
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm animate-fade-in">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <RadioGroup 
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                      value={userType} 
                      onValueChange={setUserType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="recruiter" />
                        <Label htmlFor="recruiter" className="cursor-pointer">Recrutador/Pesquisador</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consumer" id="consumer" />
                        <Label htmlFor="consumer" className="cursor-pointer">Consumidor/Participante</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <InputWithLabel
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="seu.email@empresa.com"
                    required
                  />

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <InputWithLabel
                        label=""
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock className="h-4 w-4" />}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(!!checked)} 
                      />
                      <Label htmlFor="remember" className="text-sm">Manter-me conectado</Label>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm" type="button">
                      Esqueceu a senha?
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm animate-fade-in">
                      {error}
                    </div>
                  )}
                
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <RadioGroup 
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                      value={userType} 
                      onValueChange={setUserType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="reg-recruiter" />
                        <Label htmlFor="reg-recruiter" className="cursor-pointer">Recrutador/Pesquisador</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consumer" id="reg-consumer" />
                        <Label htmlFor="reg-consumer" className="cursor-pointer">Consumidor/Participante</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <InputWithLabel
                    label="Nome Completo"
                    id="name"
                    type="text"
                    icon={<User className="h-4 w-4" />}
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <InputWithLabel
                    label="Email"
                    id="register-email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="seu.email@empresa.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <InputWithLabel
                        label=""
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        icon={<Lock className="h-4 w-4" />}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {userType === "consumer" && (
                    <div className="space-y-2">
                      <Label>Preferências e Alergias</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        Essas informações nos ajudam a encontrar pesquisas adequadas para você
                      </div>
                      <InputWithLabel
                        label="Alergias ou Restrições"
                        id="allergies"
                        placeholder="Ex: Glúten, Frutos do mar, Lactose"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                      />
                      <InputWithLabel
                        label="Preferências Alimentares"
                        id="preferences"
                        placeholder="Ex: Vegano, Baixo Açúcar, Sem Conservantes"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Concordo com os <Button variant="link" className="h-auto p-0">Termos de Uso</Button> e <Button variant="link" className="h-auto p-0">Política de Privacidade</Button>
                    </Label>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {activeTab === "login" ? (
            <p>Novo usuário? <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>Cadastre-se aqui</Button></p>
          ) : (
            <p>Já tem uma conta? <Button variant="link" className="p-0" onClick={() => setActiveTab("login")}>Faça login</Button></p>
          )}
        </div>
      </div>
    </div>
  );
}
