
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Map } from "lucide-react";

interface SensoryData {
  id: string;
  region: string;
  state: string;
  sweet: number;
  salty: number;
  bitter: number;
  sour: number;
  umami: number;
  participants: number;
}

interface SensoryHeatMapProps {
  title?: string;
  data?: SensoryData[];
  productName?: string;
  showControls?: boolean;
}

export function SensoryHeatMap({
  title = "Mapa Sensorial - Brasil",
  data,
  productName = "Produto A",
  showControls = true
}: SensoryHeatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("sweet");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(productName);
  
  // Mock data if none provided
  const sensoryData = data || [
    { id: "1", region: "Norte", state: "AM", sweet: 75, salty: 30, bitter: 15, sour: 25, umami: 40, participants: 120 },
    { id: "2", region: "Norte", state: "PA", sweet: 70, salty: 35, bitter: 20, sour: 30, umami: 35, participants: 95 },
    { id: "3", region: "Nordeste", state: "BA", sweet: 85, salty: 25, bitter: 10, sour: 45, umami: 20, participants: 200 },
    { id: "4", region: "Nordeste", state: "PE", sweet: 80, salty: 20, bitter: 15, sour: 50, umami: 15, participants: 175 },
    { id: "5", region: "Centro-Oeste", state: "DF", sweet: 65, salty: 45, bitter: 30, sour: 20, umami: 50, participants: 150 },
    { id: "6", region: "Centro-Oeste", state: "GO", sweet: 60, salty: 50, bitter: 25, sour: 15, umami: 55, participants: 130 },
    { id: "7", region: "Sudeste", state: "SP", sweet: 70, salty: 60, bitter: 40, sour: 25, umami: 45, participants: 350 },
    { id: "8", region: "Sudeste", state: "RJ", sweet: 75, salty: 55, bitter: 35, sour: 30, umami: 40, participants: 280 },
    { id: "9", region: "Sul", state: "RS", sweet: 55, salty: 65, bitter: 45, sour: 20, umami: 60, participants: 185 },
    { id: "10", region: "Sul", state: "PR", sweet: 60, salty: 60, bitter: 50, sour: 15, umami: 55, participants: 165 }
  ];
  
  // Filter data by region
  const filteredData = selectedRegion === "all" 
    ? sensoryData 
    : sensoryData.filter(item => item.region === selectedRegion);
  
  // Get average for each taste profile across the filtered regions
  const calculateAverages = () => {
    if (!filteredData.length) return { sweet: 0, salty: 0, bitter: 0, sour: 0, umami: 0, participants: 0 };
    
    const totals = filteredData.reduce((acc, item) => {
      return {
        sweet: acc.sweet + item.sweet,
        salty: acc.salty + item.salty,
        bitter: acc.bitter + item.bitter,
        sour: acc.sour + item.sour,
        umami: acc.umami + item.umami,
        participants: acc.participants + item.participants
      };
    }, { sweet: 0, salty: 0, bitter: 0, sour: 0, umami: 0, participants: 0 });
    
    return {
      sweet: Math.round(totals.sweet / filteredData.length),
      salty: Math.round(totals.salty / filteredData.length),
      bitter: Math.round(totals.bitter / filteredData.length),
      sour: Math.round(totals.sour / filteredData.length),
      umami: Math.round(totals.umami / filteredData.length),
      participants: totals.participants
    };
  };
  
  const averages = calculateAverages();

  // Get color intensity based on score
  const getIntensityColor = (value: number) => {
    if (value >= 80) return "bg-red-600";
    if (value >= 60) return "bg-orange-500";
    if (value >= 40) return "bg-yellow-400";
    if (value >= 20) return "bg-green-400";
    return "bg-blue-300";
  };

  // In a real application, you would use a mapping library like Mapbox, Leaflet or Google Maps
  // Here we'll show a simplified visualization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // This is a placeholder for a real map
    // In production, this would be replaced with proper map setup
    mapContainerRef.current.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="text-muted-foreground mb-2">
            <span class="flex items-center justify-center">
              <svg class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Mapa Interativo
            </span>
          </div>
          <p class="text-sm">
            Esta é uma visualização simplificada. Em produção, esta área exibiria um mapa interativo do Brasil com dados sensoriais por região.
          </p>
        </div>
      </div>
    `;
  }, [activeTab, filteredData]);

  const handleExport = () => {
    // In a real application, this would generate and download a report
    console.log("Exporting data:", { activeTab, filteredData, averages });
    alert("Funcionalidade de exportação será implementada em breve!");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          
          {showControls && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produto A">Produto A</SelectItem>
                  <SelectItem value="Produto B">Produto B</SelectItem>
                  <SelectItem value="Produto C">Produto C</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={handleExport} title="Exportar dados">
                <Download size={16} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <div ref={mapContainerRef} className="h-[400px] border rounded-md bg-gray-50 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <Map size={32} className="text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Mapa interativo do Brasil
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Detalhes do Produto</h3>
              <div className="p-3 border rounded-md">
                <p className="text-lg font-medium">{selectedProduct}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {filteredData.length} regiões
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {averages.participants} participantes
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Perfil Sensorial</h3>
              <Tabs defaultValue="sweet" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="sweet">Doce</TabsTrigger>
                  <TabsTrigger value="salty">Salgado</TabsTrigger>
                  <TabsTrigger value="bitter">Amargo</TabsTrigger>
                  <TabsTrigger value="sour">Ácido</TabsTrigger>
                  <TabsTrigger value="umami">Umami</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sweet" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intensidade</span>
                      <span>{averages.sweet}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div 
                        className={`h-4 rounded-full ${getIntensityColor(averages.sweet)}`} 
                        style={{ width: `${averages.sweet}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      Percepção de doçura {averages.sweet >= 50 ? "alta" : "moderada"} em {selectedRegion === "all" ? "todas as regiões" : `${selectedRegion}`}.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="salty" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intensidade</span>
                      <span>{averages.salty}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div 
                        className={`h-4 rounded-full ${getIntensityColor(averages.salty)}`} 
                        style={{ width: `${averages.salty}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      Percepção de salinidade {averages.salty >= 50 ? "alta" : "moderada"} em {selectedRegion === "all" ? "todas as regiões" : `${selectedRegion}`}.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="bitter" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intensidade</span>
                      <span>{averages.bitter}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div 
                        className={`h-4 rounded-full ${getIntensityColor(averages.bitter)}`} 
                        style={{ width: `${averages.bitter}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      Percepção de amargor {averages.bitter >= 50 ? "alta" : "moderada"} em {selectedRegion === "all" ? "todas as regiões" : `${selectedRegion}`}.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="sour" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intensidade</span>
                      <span>{averages.sour}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div 
                        className={`h-4 rounded-full ${getIntensityColor(averages.sour)}`} 
                        style={{ width: `${averages.sour}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      Percepção de acidez {averages.sour >= 50 ? "alta" : "moderada"} em {selectedRegion === "all" ? "todas as regiões" : `${selectedRegion}`}.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="umami" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intensidade</span>
                      <span>{averages.umami}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div 
                        className={`h-4 rounded-full ${getIntensityColor(averages.umami)}`} 
                        style={{ width: `${averages.umami}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      Percepção de umami {averages.umami >= 50 ? "alta" : "moderada"} em {selectedRegion === "all" ? "todas as regiões" : `${selectedRegion}`}.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Regiões Avaliadas</h3>
              <div className="max-h-[200px] overflow-y-auto border rounded-md divide-y">
                {filteredData.map(region => (
                  <div key={region.id} className="p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{region.state}</p>
                      <Badge variant="outline">{region.region}</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm">
                        <span className="w-20">Percepção:</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2">
                          <div 
                            className={`h-2 rounded-full ${getIntensityColor(region[activeTab as keyof typeof region] as number)}`} 
                            style={{ width: `${region[activeTab as keyof typeof region]}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 w-8 text-right">
                          {region[activeTab as keyof typeof region]}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
