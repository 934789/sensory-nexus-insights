
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionWithImage } from "./question-types/QuestionWithImage";
import { ConcordanceQuestion } from "./question-types/ConcordanceQuestion";
import { VideoQuestion } from "./question-types/VideoQuestion";
import { RankingQuestion } from "./question-types/RankingQuestion";
import { SaveTemplateDialog } from "./template-bank";
import { cn } from "@/lib/utils";

// Tipos de perguntas disponíveis
const QUESTION_TYPES = [
  { id: 'single', label: 'Única Escolha' },
  { id: 'multiple', label: 'Múltipla Escolha' },
  { id: 'text', label: 'Dissertação' },
  { id: 'scale', label: 'Escala de Intensidade' },
  { id: 'single_image', label: 'Única Escolha c/ Imagem' },
  { id: 'multiple_image', label: 'Múltipla Escolha c/ Imagem' },
  { id: 'text_image', label: 'Dissertação c/ Imagem' },
  { id: 'scale_image', label: 'Escala c/ Imagem' },
  { id: 'concordance', label: 'Concordância' },
  { id: 'video', label: 'Vídeo + Pergunta' },
  { id: 'ranking', label: 'Ranqueamento' }
];

// Tipos que utilizam imagem
const IMAGE_TYPES = ['single_image', 'multiple_image', 'text_image', 'scale_image'];

// Tipos que utilizam opções
const OPTIONS_TYPES = ['single', 'multiple', 'single_image', 'multiple_image', 'concordance', 'ranking'];

interface QuestionOption {
  id: string;
  text: string;
  code: string;
}

interface Statement {
  id: string;
  text: string;
  code: string;
}

interface RankOption {
  id: string;
  text: string;
  code: string;
  position: number;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  options: QuestionOption[];
  questionImage?: string | null;
  statements?: Statement[];
  videoUrl?: string;
  videoFile?: File | null;
  rankOptions?: RankOption[];
}

interface QuestionEditorProps {
  question: Question;
  onQuestionChange: (updatedQuestion: Question) => void;
  onSaveTemplate: (template: any) => void;
}

export function QuestionEditor({ question, onQuestionChange, onSaveTemplate }: QuestionEditorProps) {
  // Funções para atualizar a pergunta
  const handleTextChange = (text: string) => {
    onQuestionChange({ ...question, text });
  };

  const handleTypeChange = (type: string) => {
    onQuestionChange({ 
      ...question, 
      type,
      // Reset options if changing to a non-option type
      options: OPTIONS_TYPES.includes(type) ? question.options : []
    });
  };

  const handleAddOption = () => {
    onQuestionChange({
      ...question,
      options: [
        ...question.options,
        { id: `opt-${Date.now()}`, text: `Opção ${question.options.length + 1}`, code: '' }
      ]
    });
  };

  const handleRemoveOption = (id: string) => {
    onQuestionChange({
      ...question,
      options: question.options.filter(opt => opt.id !== id)
    });
  };

  const handleOptionChange = (id: string, text: string) => {
    onQuestionChange({
      ...question,
      options: question.options.map(opt => opt.id === id ? { ...opt, text } : opt)
    });
  };

  const handleOptionCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      options: question.options.map(opt => opt.id === id ? { ...opt, code } : opt)
    });
  };

  // Tratamento para perguntas com imagem
  const handleImageChange = (questionImage: string | null) => {
    onQuestionChange({ ...question, questionImage });
  };

  // Tratamento para perguntas de concordância
  const handleAddStatement = () => {
    const statements = question.statements || [];
    onQuestionChange({
      ...question,
      statements: [
        ...statements,
        { id: `stmt-${Date.now()}`, text: `Afirmação ${statements.length + 1}`, code: '' }
      ]
    });
  };

  const handleRemoveStatement = (id: string) => {
    onQuestionChange({
      ...question,
      statements: (question.statements || []).filter(stmt => stmt.id !== id)
    });
  };

  const handleStatementChange = (id: string, text: string) => {
    onQuestionChange({
      ...question,
      statements: (question.statements || []).map(stmt => 
        stmt.id === id ? { ...stmt, text } : stmt
      )
    });
  };

  const handleStatementCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      statements: (question.statements || []).map(stmt => 
        stmt.id === id ? { ...stmt, code } : stmt
      )
    });
  };

  // Tratamento para perguntas com vídeo
  const handleVideoUrlChange = (videoUrl: string) => {
    onQuestionChange({ ...question, videoUrl });
  };

  const handleVideoFileChange = (videoFile: File | null) => {
    onQuestionChange({ ...question, videoFile });
  };

  // Tratamento para perguntas de ranqueamento
  const handleAddRankOption = () => {
    const rankOptions = question.rankOptions || [];
    onQuestionChange({
      ...question,
      rankOptions: [
        ...rankOptions,
        { id: `rank-${Date.now()}`, text: `Opção ${rankOptions.length + 1}`, code: '', position: rankOptions.length }
      ]
    });
  };

  const handleRemoveRankOption = (id: string) => {
    onQuestionChange({
      ...question,
      rankOptions: (question.rankOptions || []).filter(opt => opt.id !== id)
    });
  };

  const handleRankOptionChange = (id: string, text: string) => {
    onQuestionChange({
      ...question,
      rankOptions: (question.rankOptions || []).map(opt => 
        opt.id === id ? { ...opt, text } : opt
      )
    });
  };

  const handleRankOptionCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      rankOptions: (question.rankOptions || []).map(opt => 
        opt.id === id ? { ...opt, code } : opt
      )
    });
  };

  // Inicialização de novos tipos de pergunta quando são selecionados
  const initializeQuestionTypeData = (type: string) => {
    let updates = {};
    
    if (type === 'concordance' && (!question.statements || question.statements.length === 0)) {
      updates = {
        statements: [
          { id: `stmt-${Date.now()}`, text: 'Afirmação 1', code: '' },
          { id: `stmt-${Date.now() + 1}`, text: 'Afirmação 2', code: '' }
        ]
      };
    }
    
    if (type === 'video' && !question.videoUrl) {
      updates = { videoUrl: '', videoFile: null };
    }
    
    if (type === 'ranking' && (!question.rankOptions || question.rankOptions.length === 0)) {
      updates = {
        rankOptions: [
          { id: `rank-${Date.now()}`, text: 'Opção 1', code: '', position: 0 },
          { id: `rank-${Date.now() + 1}`, text: 'Opção 2', code: '', position: 1 },
          { id: `rank-${Date.now() + 2}`, text: 'Opção 3', code: '', position: 2 }
        ]
      };
    }
    
    if (Object.keys(updates).length > 0) {
      onQuestionChange({ ...question, ...updates });
    }
  };

  // Renderização condicional do editor baseado no tipo de pergunta
  const renderQuestionEditor = () => {
    // Para tipos com imagem na pergunta
    if (IMAGE_TYPES.includes(question.type)) {
      return (
        <QuestionWithImage
          questionText={question.text}
          onChange={handleTextChange}
          imageUrl={question.questionImage}
          onImageChange={handleImageChange}
        >
          {/* Renderizar campos específicos baseados no subtipo */}
          {renderOptionsBasedOnType()}
        </QuestionWithImage>
      );
    }
    
    // Para tipo concordância
    if (question.type === 'concordance') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Marque com quais afirmações você concorda sobre o produto" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <ConcordanceQuestion 
            statements={question.statements || []}
            onAddStatement={handleAddStatement}
            onRemoveStatement={handleRemoveStatement}
            onStatementChange={handleStatementChange}
            onCodeChange={handleStatementCodeChange}
          />
        </div>
      );
    }

    // Para tipo vídeo + pergunta
    if (question.type === 'video') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta (exibido após o vídeo)</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: O que você achou do vídeo apresentado?" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <VideoQuestion 
            videoUrl={question.videoUrl || ''}
            onVideoUrlChange={handleVideoUrlChange}
            videoFile={question.videoFile || null}
            onVideoFileChange={handleVideoFileChange}
          />
          
          {/* Renderizar campos para tipo de resposta (única escolha, múltipla, etc) */}
          {renderOptionsBasedOnType()}
        </div>
      );
    }

    // Para tipo ranking
    if (question.type === 'ranking') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Classifique os produtos do seu favorito ao menos favorito" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <RankingQuestion 
            options={question.rankOptions || []}
            onAddOption={handleAddRankOption}
            onRemoveOption={handleRemoveRankOption}
            onOptionChange={handleRankOptionChange}
            onCodeChange={handleRankOptionCodeChange}
            onPositionChange={() => {}} // Será implementado para drag-and-drop
          />
        </div>
      );
    }
    
    // Para tipos básicos
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="question-text">Texto da Pergunta</Label>
          <Textarea 
            id="question-text" 
            placeholder="Digite aqui sua pergunta..." 
            className="min-h-[100px]"
            value={question.text}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>

        {renderOptionsBasedOnType()}
      </div>
    );
  };

  // Renderiza as opções baseadas no tipo básico (escolha única, múltipla, etc)
  const renderOptionsBasedOnType = () => {
    const baseType = question.type.replace('_image', '');
    
    if (baseType === 'single' || baseType === 'multiple') {
      return (
        <div>
          <Label>Opções de Resposta</Label>
          <div className="space-y-3 mt-2">
            {question.options.map((option, optionIndex) => (
              <div key={option.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder={`Opção ${optionIndex + 1}`} 
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  />
                </div>
                <div className="w-32">
                  <Input 
                    placeholder="Código" 
                    value={option.code}
                    onChange={(e) => handleOptionCodeChange(option.id, e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRemoveOption(option.id)}
                  disabled={question.options.length <= 2}
                >
                  -
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleAddOption}
            >
              + Adicionar Opção
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Garantir que temos alguma opção para tipos de pergunta que necessitam
  if (OPTIONS_TYPES.includes(question.type) && (!question.options || question.options.length === 0)) {
    onQuestionChange({
      ...question,
      options: [
        { id: `opt-${Date.now()}`, text: 'Opção 1', code: '' },
        { id: `opt-${Date.now() + 1}`, text: 'Opção 2', code: '' }
      ]
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Tipo de Pergunta</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {QUESTION_TYPES.map((type) => (
            <Card 
              key={type.id} 
              className={cn(
                "cursor-pointer hover:border-primary transition-colors p-2",
                question.type === type.id && "border-primary bg-primary/5"
              )}
              onClick={() => {
                handleTypeChange(type.id);
                initializeQuestionTypeData(type.id);
              }}
            >
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{type.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {renderQuestionEditor()}

      {/* Template save option */}
      <div className="flex justify-end">
        <SaveTemplateDialog 
          question={{
            text: question.text,
            type: question.type,
            options: question.options
          }}
          onSave={onSaveTemplate}
        />
      </div>
    </div>
  );
}
