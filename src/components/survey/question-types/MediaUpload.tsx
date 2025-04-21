
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileVideo, FileImage, Upload } from "lucide-react";

interface MediaUploadProps {
  type: "image" | "video" | "both";
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
  previewUrl: string | null;
}

export function MediaUpload({
  type,
  onFileSelected,
  selectedFile,
  previewUrl
}: MediaUploadProps) {
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
    
    if (type === "image" && !isImage) {
      alert("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    if (type === "video" && !isVideo) {
      alert("Por favor, selecione apenas arquivos de vídeo");
      return;
    }
    
    if (type === "both" && !isImage && !isVideo) {
      alert("Por favor, selecione arquivos de imagem ou vídeo");
      return;
    }
    
    onFileSelected(file);
  };

  const removeFile = () => {
    onFileSelected(null);
  };

  const getAcceptValue = () => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    return "image/*,video/*";
  };

  const renderPreview = () => {
    if (!previewUrl) return null;
    
    if (selectedFile?.type.startsWith("image/")) {
      return (
        <img 
          src={previewUrl} 
          alt="Prévia da imagem" 
          className="max-h-64 max-w-full mx-auto rounded object-contain"
        />
      );
    }
    
    if (selectedFile?.type.startsWith("video/")) {
      return (
        <video 
          src={previewUrl} 
          controls 
          className="max-h-64 max-w-full mx-auto rounded"
        />
      );
    }
    
    return null;
  };

  const getIcon = () => {
    if (type === "image") return <FileImage className="h-10 w-10 text-primary/60" />;
    if (type === "video") return <FileVideo className="h-10 w-10 text-primary/60" />;
    return <Upload className="h-10 w-10 text-primary/60" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">
          Upload de {type === "image" ? "Imagem" : type === "video" ? "Vídeo" : "Mídia"}
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          {type === "image" 
            ? "Adicione uma imagem que o consumidor poderá enviar como resposta" 
            : type === "video" 
              ? "Adicione um vídeo que o consumidor poderá enviar como resposta"
              : "Adicione uma imagem ou vídeo que o consumidor poderá enviar como resposta"}
        </p>
      </div>

      {selectedFile && previewUrl ? (
        <div className="space-y-3">
          <div className="border rounded-lg p-3">
            {renderPreview()}
            <div className="mt-3 text-center">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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
                {type === "image" 
                  ? "PNG, JPG ou GIF até 5MB"
                  : type === "video"
                    ? "MP4, MOV ou AVI até 50MB"
                    : "PNG, JPG, GIF, MP4, MOV até 50MB"}
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
    </div>
  );
}
