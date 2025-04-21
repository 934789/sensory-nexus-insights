
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensoryHeatMap } from "@/components/analytics/SensoryHeatMap";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Download, FileText, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, Sector } from "recharts";
import { useState } from "react";

// Sample data for charts
const ageData = [
  { name: '18-24', value: 120 },
  { name: '25-34', value: 180 },
  { name: '35-44', value: 150 },
  { name: '45-54', value: 110 },
  { name: '55+', value: 80 },
];

const genderData = [
  { name: 'Feminino', value: 340 },
  { name: 'Masculino', value: 280 },
  { name: 'Não-binário', value: 20 },
];

const regionData = [
  { name: 'Sudeste', value: 280 },
  { name: 'Nordeste', value: 140 },
  { name: 'Sul', value: 120 },
  { name: 'Centro-Oeste', value: 60 },
  { name: 'Norte', value: 40 },
];

const scoreData = [
  {
    name: 'Produto A',
    aparência: 85,
    aroma: 78,
    sabor: 82,
    textura: 75,
    geral: 80
  },
  {
    name: 'Produto B',
    aparência: 70,
    aroma: 82,
    sabor: 74,
    textura: 68,
    geral: 75
  },
  {
    name: 'Produto C',
    aparência: 78,
    aroma: 65,
    sabor: 80,
    textura: 82,
    geral: 78
  },
];

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Render active shape for pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-4} textAnchor="middle" fill="#888">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#333" fontSize={16} fontWeight="bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={40} textAnchor="middle" fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard Analítico</h1>
            <p className="text-muted-foreground">Visualize e analise os resultados das pesquisas sensoriais</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os produtos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="product-a">Produto A</SelectItem>
                <SelectItem value="product-b">Produto B</SelectItem>
                <SelectItem value="product-c">Produto C</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Exportar Relatório</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="summary">
              <Layers size={16} className="mr-2" />
              Sumário
            </TabsTrigger>
            <TabsTrigger value="demographic">
              <PieChartIcon size={16} className="mr-2" />
              Demográfico
            </TabsTrigger>
            <TabsTrigger value="sensory">
              <BarChartIcon size={16} className="mr-2" />
              Sensorial
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText size={16} className="mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Pesquisas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +12% que o mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Participantes Únicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">640</div>
                  <p className="text-xs text-muted-foreground">
                    +8% que o mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avaliação Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2/5.0</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3 que o mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Conclusão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% que o mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Avaliações por Produto</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ sweet: {}, aroma: {}, sabor: {}, textura: {}, geral: {} }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={scoreData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Legend />
                        <Bar dataKey="aparência" fill="#8884d8" name="Aparência" />
                        <Bar dataKey="aroma" fill="#82ca9d" name="Aroma" />
                        <Bar dataKey="sabor" fill="#ffc658" name="Sabor" />
                        <Bar dataKey="textura" fill="#ff8042" name="Textura" />
                        <Bar dataKey="geral" fill="#a4de6c" name="Geral" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Participantes por Região</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ 
                    Sudeste: {}, 
                    Nordeste: {}, 
                    Sul: {}, 
                    'Centro-Oeste': {}, 
                    Norte: {} 
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            
            <SensoryHeatMap />
          </TabsContent>
          
          <TabsContent value="demographic" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Idade</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ 
                    '18-24': {}, '25-34': {}, '35-44': {}, '45-54': {}, '55+': {} 
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="value" fill="#8884d8">
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Gênero</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ 
                    Feminino: {}, Masculino: {}, 'Não-binário': {} 
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Região</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{ 
                    Sudeste: {}, Nordeste: {}, Sul: {}, 'Centro-Oeste': {}, Norte: {} 
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações Demográficas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Aqui seriam apresentadas informações demográficas detalhadas, como cruzamento entre idade e região,
                  preferências por tipo de produto, e outros dados relevantes para a análise de mercado.
                </p>
                
                <div className="bg-muted p-4 rounded-md text-center">
                  <p>Dados detalhados disponíveis para análise customizada</p>
                  <Button variant="outline" className="mt-4">
                    Gerar Relatório Customizado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sensory" className="space-y-6">
            <SensoryHeatMap />
            
            <Card>
              <CardHeader>
                <CardTitle>Perfis Sensoriais Comparativos</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer config={{ aroma: {}, sabor: {}, aparência: {}, textura: {}, doçura: {} }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Legend />
                      <Bar dataKey="aparência" fill="#8884d8" name="Aparência" />
                      <Bar dataKey="aroma" fill="#82ca9d" name="Aroma" />
                      <Bar dataKey="sabor" fill="#ffc658" name="Sabor" />
                      <Bar dataKey="textura" fill="#ff8042" name="Textura" />
                      <Bar dataKey="geral" fill="#a4de6c" name="Geral" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Preferência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Produto A vs Produto B</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto A</span>
                            <span>68%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto B</span>
                            <span>32%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-2">Produto B vs Produto C</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto B</span>
                            <span>45%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto C</span>
                            <span>55%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-2">Produto A vs Produto C</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto A</span>
                            <span>52%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "52%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Produto C</span>
                            <span>48%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "48%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Insights Sensoriais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-100">
                    <h4 className="font-medium mb-2">Principais Descobertas</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Produto A tem maior aceitação entre consumidores de 25-34 anos</li>
                      <li>Produto C é preferido na região Sul do país</li>
                      <li>Produto B tem maior preferência entre consumidores que valorizam textura</li>
                      <li>Nível de doçura do Produto A é percebido como ideal por 72% dos consumidores</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                    <h4 className="font-medium mb-2">Recomendações</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Ajustar nível de acidez do Produto C para aumentar aceitação</li>
                      <li>Focar comunicação do Produto A em seu perfil aromático, destacado como diferencial</li>
                      <li>Aprimorar textura do Produto B para maior competitividade</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full">Ver Análise Detalhada</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-medium">Relatório de Pesquisa - Produto A</h3>
                        <p className="text-sm text-muted-foreground">Análise completa de perfil sensorial e aceitação</p>
                      </div>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-medium">Relatório Comparativo - Produtos A, B e C</h3>
                        <p className="text-sm text-muted-foreground">Comparação detalhada entre produtos da mesma categoria</p>
                      </div>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-medium">Relatório Demográfico - Q2 2023</h3>
                        <p className="text-sm text-muted-foreground">Análise do público participante das pesquisas</p>
                      </div>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-medium">Dados Brutos - Exportação CSV</h3>
                        <p className="text-sm text-muted-foreground">Dados completos para análise em ferramentas externas</p>
                      </div>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download CSV
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Gerar Novo Relatório</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Select defaultValue="product-a">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar Produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-a">Produto A</SelectItem>
                        <SelectItem value="product-b">Produto B</SelectItem>
                        <SelectItem value="product-c">Produto C</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="full">
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Relatório Completo</SelectItem>
                        <SelectItem value="summary">Sumário Executivo</SelectItem>
                        <SelectItem value="sensory">Perfil Sensorial</SelectItem>
                        <SelectItem value="comparative">Análise Comparativa</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button>Gerar Relatório</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
