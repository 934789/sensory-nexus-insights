
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, FileImage, Mic } from "lucide-react";

interface QuestionWithMediaProps {
  mediaType: "image" | "video" | "audio";
  mediaUrl: string | null; 
  mediaFile: File | null;
  onMediaUrlChange: (url: string) => void;
  onMediaFileChange: (file: File | null) => void;
  previewUrl: string | null;
}

export function QuestionWithMedia({
  mediaType,
  mediaUrl,
  mediaFile,
  onMediaUrlChange,
  onMediaFileChange,
  previewUrl
}: QuestionWithMediaProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");
    
    if (mediaType === "image" && !isImage) {
      alert("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    if (mediaType === "video" && !isVideo) {
      alert("Por favor, selecione apenas arquivos de vídeo");
      return;
    }
    
    if (mediaType === "audio" && !isAudio) {
      alert("Por favor, selecione apenas arquivos de áudio");
      return;
    }
    
    onMediaFileChange(file);
  };

  const removeFile = () => {
    onMediaFileChange(null);
  };

  const getAcceptValue = () => {
    if (mediaType === "image") return "image/*";
    if (mediaType === "video") return "video/*";
    return "audio/*";
  };

  const renderPreview = () => {
    if (activeTab === "upload" && previewUrl) {
      if (mediaType === "image") {
        return (
          <img 
            src={previewUrl} 
            alt="Prévia da imagem" 
            className="max-h-64 max-w-full mx-auto rounded object-contain"
          />
        );
      }
      
      if (mediaType === "video") {
        return (
          <video 
            src={previewUrl} 
            controls 
            className="max-h-64 max-w-full mx-auto rounded"
          />
        );
      }
      
      if (mediaType === "audio") {
        return (
          <audio 
            src={previewUrl} 
            controls 
            className="w-full mt-2"
          />
        );
      }
    }
    
    if (activeTab === "url" && mediaUrl) {
      if (mediaType === "image") {
        return (
          <img 
            src={mediaUrl} 
            alt="Imagem externa" 
            className="max-h-64 max-w-full mx-auto rounded object-contain"
            onError={() => console.log("Erro ao carregar imagem")}
          />
        );
      }
      
      if (mediaType === "video") {
        // Check if it's a YouTube URL
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = mediaUrl.match(youtubeRegex);
        
        if (match && match[1]) {
          const videoId = match[1];
          return (
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded"
            ></iframe>
          );
        }
        
        return (
          <video 
            src={mediaUrl} 
            controls 
            className="max-h-64 max-w-full mx-auto rounded"
            onError={() => console.log("Erro ao carregar vídeo")}
          />
        );
      }
      
      if (mediaType === "audio") {
        return (
          <audio 
            src={mediaUrl} 
            controls 
            className="w-full mt-2"
            onError={() => console.log("Erro ao carregar áudio")}
          />
        );
      }
    }
    
    return null;
  };

  const getIcon = () => {
    if (mediaType === "image") return <FileImage className="h-10 w-10 text-primary/60" />;
    if (mediaType === "video") return <FileVideo className="h-10 w-10 text-primary/60" />;
    return <Mic className="h-10 w-10 text-primary/60" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">
          Mídia da Pergunta ({mediaType === "image" ? "Imagem" : mediaType === "video" ? "Vídeo" : "Áudio"})
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Adicione {mediaType === "image" ? "uma imagem" : mediaType === "video" ? "um vídeo" : "um áudio"} para ser exibido junto com a pergunta
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
          <TabsTrigger value="url">URL Externa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          {mediaFile && previewUrl ? (
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                {renderPreview()}
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium">{mediaFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(mediaFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={removeFile}
                >
                  Remover arquivo
                </Button>
              </div>
            </div>
          ) : (
            <Card
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? "border-primary bg-primary/5" : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                {getIcon()}
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Arraste e solte um arquivo ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mediaType === "image" 
                      ? "PNG, JPG ou GIF até 5MB"
                      : mediaType === "video"
                        ? "MP4, MOV ou AVI até 50MB"
                        : "MP3, WAV ou OGG até 10MB"}
                  </p>
                </div>
                <Button size="sm" variant="secondary" asChild>
                  <label className="cursor-pointer">
                    Selecionar arquivo
                    <input
                      type="file"
                      className="sr-only"
                      accept={getAcceptValue()}
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="url">
          <div className="space-y-4">
            <div>
              <Label htmlFor="media-url">URL da {mediaType === "image" ? "imagem" : mediaType === "video" ? "vídeo" : "áudio"}</Label>
              <Input 
                id="media-url" 
                type="url" 
                placeholder={mediaType === "image" 
                  ? "https://exemplo.com/imagem.jpg" 
                  : mediaType === "video" 
                    ? "https://exemplo.com/video.mp4 ou URL do YouTube" 
                    : "https://exemplo.com/audio.mp3"
                }
                value={mediaUrl || ""}
                onChange={(e) => onMediaUrlChange(e.target.value)}
                className="mt-1"
              />
            </div>

            {mediaUrl && (
              <div className="border rounded-lg p-3">
                {renderPreview()}
                {!renderPreview() && (
                  <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Não foi possível visualizar a mídia
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Label className="text-base">Visualização do Layout</Label>
        <div className="mt-2 p-4 border rounded-md">
          <div className="space-y-4">
            {(mediaUrl || previewUrl) && (
              <div className="bg-gray-50 p-2 rounded-md">
                {renderPreview() || (
                  <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Prévia da mídia
                    </p>
                  </div>
                )}
              </div>
            )}
            <div>
              <p className="text-base font-medium">Exemplo de texto da pergunta</p>
              <p className="text-sm text-muted-foreground">
                As respostas aparecerão abaixo da mídia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
