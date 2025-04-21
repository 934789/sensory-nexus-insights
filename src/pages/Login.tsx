
import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login validation
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock credentials for demo
    if (email === "demo@sensory.com" && password === "password") {
      toast({
        title: "Login realizado com sucesso!",
        description: userType === "recruiter" 
          ? "Bem-vindo(a) ao painel de recrutador."
          : "Bem-vindo(a) ao seu perfil de consumidor.",
      });
      
      if (userType === "recruiter") {
        navigate("/dashboard");
      } else {
        navigate("/consumer-profile");
      }
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }

    setIsLoading(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro em progresso",
      description: "Esta funcionalidade está em desenvolvimento.",
    });
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
                    required
                  />

                  <InputWithLabel
                    label="Email"
                    id="register-email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="seu.email@empresa.com"
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
                      />
                      <InputWithLabel
                        label="Preferências Alimentares"
                        id="preferences"
                        placeholder="Ex: Vegano, Baixo Açúcar, Sem Conservantes"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      Concordo com os <Button variant="link" className="h-auto p-0">Termos de Uso</Button> e <Button variant="link" className="h-auto p-0">Política de Privacidade</Button>
                    </Label>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                  >
                    Cadastrar
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
