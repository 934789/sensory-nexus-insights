
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Trash2 } from "lucide-react";

interface QuestionWithImageProps {
  questionText: string;
  onChange: (text: string) => void;
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  children: React.ReactNode;
}

export function QuestionWithImage({ 
  questionText, 
  onChange, 
  imageUrl, 
  onImageChange,
  children 
}: QuestionWithImageProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question-text">Texto da Pergunta</Label>
        <Textarea 
          id="question-text" 
          placeholder="Digite aqui sua pergunta..." 
          className="min-h-[100px] mt-1"
          value={questionText}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div>
        <Label>Imagem da Pergunta</Label>
        <div className="mt-2 border-2 border-dashed rounded-lg p-4">
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Imagem da pergunta" className="mx-auto max-h-48 object-contain rounded" />
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onImageChange(null)} 
                className="absolute top-2 right-2"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <Image className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Clique para fazer upload de uma imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
