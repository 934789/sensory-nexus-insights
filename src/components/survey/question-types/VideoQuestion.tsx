
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, Upload, Link } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VideoQuestionProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  videoFile: File | null;
  onVideoFileChange: (file: File | null) => void;
}

export function VideoQuestion({
  videoUrl,
  onVideoUrlChange,
  videoFile,
  onVideoFileChange
}: VideoQuestionProps) {
  const [videoTab, setVideoTab] = useState<string>("url");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoFileChange(file);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    
    try {
      if (url.includes("youtube.com/watch")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("youtu.be")) {
        const videoId = new URL(url).pathname.split("/")[1];
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("vimeo.com")) {
        const videoId = new URL(url).pathname.split("/")[1];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-4">
      <Label>Vídeo da Pergunta</Label>
      
      <Tabs defaultValue={videoTab} onValueChange={setVideoTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="url" className="flex-1">URL (YouTube, Vimeo)</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload Direto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Cole a URL do vídeo (YouTube, Vimeo, etc)" 
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Link size={16} className="mr-2" />
                Verificar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>
          
          {videoUrl && (
            <div className="aspect-video mt-4 rounded-md overflow-hidden border">
              <iframe
                src={getYoutubeEmbedUrl(videoUrl)}
                className="w-full h-full"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              {videoFile ? (
                <>
                  <Video size={32} className="text-primary" />
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onVideoFileChange(null)}
                    >
                      Remover
                    </Button>
                    <Button size="sm">
                      <Upload size={14} className="mr-1" />
                      Fazer upload
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Video size={32} className="text-muted-foreground" />
                  <p>Arraste um vídeo ou clique para fazer upload</p>
                  <p className="text-sm text-muted-foreground">MP4, WebM ou AVI (max. 50MB)</p>
                  <label>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload size={14} className="mr-1" />
                      Selecionar arquivo
                    </Button>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="video/mp4,video/webm,video/avi" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
