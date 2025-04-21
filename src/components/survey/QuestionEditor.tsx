
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
import { ComparisonPairs } from "./question-types/ComparisonPairs";
import { PreferenceRanking } from "./question-types/PreferenceRanking";
import { EvaluationMatrix } from "./question-types/EvaluationMatrix";
import { MediaUpload } from "./question-types/MediaUpload";
import { QuestionWithMedia } from "./question-types/QuestionWithMedia";
import { SaveTemplateDialog } from "./template-bank";
import { cn } from "@/lib/utils";

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
  { id: 'ranking', label: 'Ranqueamento' },
  { id: 'comparison', label: 'Comparação A vs B' },
  { id: 'preference_ranking', label: 'Ranking de Preferência' },
  { id: 'evaluation_matrix', label: 'Matriz de Avaliação' },
  { id: 'media_upload', label: 'Upload de Mídia' },
  { id: 'question_with_media', label: 'Pergunta com Mídia' }
];

const IMAGE_TYPES = ['single_image', 'multiple_image', 'text_image', 'scale_image'];

const OPTIONS_TYPES = ['single', 'multiple', 'single_image', 'multiple_image', 'concordance', 'ranking', 'comparison'];

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

interface ComparisonOption {
  id: string;
  label: string;
  code: string;
}

interface Attribute {
  id: string;
  name: string;
  code: string;
}

interface Sample {
  id: string;
  name: string;
  code: string;
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
  comparisonOptions?: ComparisonOption[];
  attributes?: Attribute[];
  samples?: Sample[];
  mediaType?: 'image' | 'video' | 'audio';
  mediaUrl?: string | null;
  mediaFile?: File | null;
  uploadType?: 'image' | 'video' | 'both';
}

interface QuestionEditorProps {
  question: Question;
  onQuestionChange: (updatedQuestion: Question) => void;
  onSaveTemplate: (template: any) => void;
}

export function QuestionEditor({ question, onQuestionChange, onSaveTemplate }: QuestionEditorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Effect to create preview URL for uploaded files
  useState(() => {
    if (question.videoFile) {
      const videoUrl = URL.createObjectURL(question.videoFile);
      setPreviewUrl(videoUrl);
      return () => URL.revokeObjectURL(videoUrl);
    }
    if (question.mediaFile) {
      const mediaUrl = URL.createObjectURL(question.mediaFile);
      setPreviewUrl(mediaUrl);
      return () => URL.revokeObjectURL(mediaUrl);
    }
    return undefined;
  });

  const handleTextChange = (text: string) => {
    onQuestionChange({ ...question, text });
  };

  const handleTypeChange = (type: string) => {
    onQuestionChange({ 
      ...question, 
      type,
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

  const handleImageChange = (questionImage: string | null) => {
    onQuestionChange({ ...question, questionImage });
  };

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

  const handleVideoUrlChange = (videoUrl: string) => {
    onQuestionChange({ ...question, videoUrl });
  };

  const handleVideoFileChange = (videoFile: File | null) => {
    onQuestionChange({ ...question, videoFile });
  };

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

  const handleRankPositionChange = (id: string, position: number) => {
    onQuestionChange({
      ...question,
      rankOptions: (question.rankOptions || []).map(opt => 
        opt.id === id ? { ...opt, position } : opt
      )
    });
  };

  // Comparison pairs handlers
  const handleAddComparisonOption = () => {
    const comparisonOptions = question.comparisonOptions || [];
    onQuestionChange({
      ...question,
      comparisonOptions: [
        ...comparisonOptions,
        { id: `comp-${Date.now()}`, label: `Amostra ${comparisonOptions.length + 1}`, code: '' }
      ]
    });
  };

  const handleRemoveComparisonOption = (id: string) => {
    onQuestionChange({
      ...question,
      comparisonOptions: (question.comparisonOptions || []).filter(opt => opt.id !== id)
    });
  };

  const handleComparisonOptionChange = (id: string, label: string) => {
    onQuestionChange({
      ...question,
      comparisonOptions: (question.comparisonOptions || []).map(opt => 
        opt.id === id ? { ...opt, label } : opt
      )
    });
  };

  const handleComparisonOptionCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      comparisonOptions: (question.comparisonOptions || []).map(opt => 
        opt.id === id ? { ...opt, code } : opt
      )
    });
  };

  // Evaluation matrix handlers
  const handleAddAttribute = () => {
    const attributes = question.attributes || [];
    onQuestionChange({
      ...question,
      attributes: [
        ...attributes,
        { id: `attr-${Date.now()}`, name: `Atributo ${attributes.length + 1}`, code: '' }
      ]
    });
  };

  const handleRemoveAttribute = (id: string) => {
    onQuestionChange({
      ...question,
      attributes: (question.attributes || []).filter(attr => attr.id !== id)
    });
  };

  const handleAttributeChange = (id: string, name: string) => {
    onQuestionChange({
      ...question,
      attributes: (question.attributes || []).map(attr => 
        attr.id === id ? { ...attr, name } : attr
      )
    });
  };

  const handleAttributeCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      attributes: (question.attributes || []).map(attr => 
        attr.id === id ? { ...attr, code } : attr
      )
    });
  };

  const handleAddSample = () => {
    const samples = question.samples || [];
    onQuestionChange({
      ...question,
      samples: [
        ...samples,
        { id: `sample-${Date.now()}`, name: `Amostra ${samples.length + 1}`, code: '' }
      ]
    });
  };

  const handleRemoveSample = (id: string) => {
    onQuestionChange({
      ...question,
      samples: (question.samples || []).filter(sample => sample.id !== id)
    });
  };

  const handleSampleChange = (id: string, name: string) => {
    onQuestionChange({
      ...question,
      samples: (question.samples || []).map(sample => 
        sample.id === id ? { ...sample, name } : sample
      )
    });
  };

  const handleSampleCodeChange = (id: string, code: string) => {
    onQuestionChange({
      ...question,
      samples: (question.samples || []).map(sample => 
        sample.id === id ? { ...sample, code } : sample
      )
    });
  };

  // Media handlers
  const handleMediaTypeChange = (mediaType: 'image' | 'video' | 'audio') => {
    onQuestionChange({
      ...question,
      mediaType,
      mediaUrl: null,
      mediaFile: null
    });
  };

  const handleMediaUrlChange = (mediaUrl: string) => {
    onQuestionChange({
      ...question,
      mediaUrl
    });
  };

  const handleMediaFileChange = (mediaFile: File | null) => {
    onQuestionChange({
      ...question,
      mediaFile
    });

    // Create preview URL
    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Upload type handlers
  const handleUploadTypeChange = (uploadType: 'image' | 'video' | 'both') => {
    onQuestionChange({
      ...question,
      uploadType
    });
  };

  const handleSelectedFileChange = (file: File | null) => {
    onQuestionChange({
      ...question,
      mediaFile: file
    });

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

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

    if (type === 'comparison' && (!question.comparisonOptions || question.comparisonOptions.length === 0)) {
      updates = {
        comparisonOptions: [
          { id: `comp-${Date.now()}`, label: 'Amostra A', code: 'A' },
          { id: `comp-${Date.now() + 1}`, label: 'Amostra B', code: 'B' }
        ]
      };
    }

    if (type === 'preference_ranking' && (!question.rankOptions || question.rankOptions.length === 0)) {
      updates = {
        rankOptions: [
          { id: `rank-${Date.now()}`, text: 'Opção 1', code: '', position: 0 },
          { id: `rank-${Date.now() + 1}`, text: 'Opção 2', code: '', position: 1 },
          { id: `rank-${Date.now() + 2}`, text: 'Opção 3', code: '', position: 2 }
        ]
      };
    }

    if (type === 'evaluation_matrix' && (!question.attributes || question.attributes.length === 0)) {
      updates = {
        attributes: [
          { id: `attr-${Date.now()}`, name: 'Sabor', code: 'FLAVOR' },
          { id: `attr-${Date.now() + 1}`, name: 'Textura', code: 'TEXTURE' },
          { id: `attr-${Date.now() + 2}`, name: 'Aroma', code: 'AROMA' }
        ],
        samples: [
          { id: `sample-${Date.now()}`, name: 'Amostra A', code: 'A' },
          { id: `sample-${Date.now() + 1}`, name: 'Amostra B', code: 'B' }
        ]
      };
    }

    if (type === 'media_upload' && !question.uploadType) {
      updates = {
        uploadType: 'both'
      };
    }

    if (type === 'question_with_media' && !question.mediaType) {
      updates = {
        mediaType: 'image',
        mediaUrl: null,
        mediaFile: null
      };
    }
    
    if (Object.keys(updates).length > 0) {
      onQuestionChange({ ...question, ...updates });
    }
  };

  const renderQuestionEditor = () => {
    if (IMAGE_TYPES.includes(question.type)) {
      return (
        <QuestionWithImage
          questionText={question.text}
          onChange={handleTextChange}
          imageUrl={question.questionImage}
          onImageChange={handleImageChange}
        >
          {renderOptionsBasedOnType()}
        </QuestionWithImage>
      );
    }
    
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
          
          {renderOptionsBasedOnType()}
        </div>
      );
    }

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
            onPositionChange={handleRankPositionChange}
          />
        </div>
      );
    }

    if (question.type === 'comparison') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Qual amostra tem aroma mais agradável?" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <ComparisonPairs 
            options={question.comparisonOptions || []}
            onAddOption={handleAddComparisonOption}
            onRemoveOption={handleRemoveComparisonOption}
            onOptionChange={handleComparisonOptionChange}
            onCodeChange={handleComparisonOptionCodeChange}
          />
        </div>
      );
    }

    if (question.type === 'preference_ranking') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Ordene as amostras da mais saborosa para a menos" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <PreferenceRanking 
            options={question.rankOptions || []}
            onAddOption={handleAddRankOption}
            onRemoveOption={handleRemoveRankOption}
            onOptionChange={handleRankOptionChange}
            onCodeChange={handleRankOptionCodeChange}
            onPositionChange={handleRankPositionChange}
          />
        </div>
      );
    }

    if (question.type === 'evaluation_matrix') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Avalie cada amostra nos seguintes atributos utilizando a escala de 1 a 9" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <EvaluationMatrix 
            attributes={question.attributes || []}
            samples={question.samples || []}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
            onAttributeChange={handleAttributeChange}
            onAttributeCodeChange={handleAttributeCodeChange}
            onAddSample={handleAddSample}
            onRemoveSample={handleRemoveSample}
            onSampleChange={handleSampleChange}
            onSampleCodeChange={handleSampleCodeChange}
          />
        </div>
      );
    }

    if (question.type === 'media_upload') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Envie uma foto do produto após abrir o kit" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Upload</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                {id: 'image', label: 'Apenas Imagens'},
                {id: 'video', label: 'Apenas Vídeos'},
                {id: 'both', label: 'Imagens e Vídeos'}
              ].map((type) => (
                <Card 
                  key={type.id} 
                  className={cn(
                    "cursor-pointer hover:border-primary transition-colors p-2",
                    question.uploadType === type.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleUploadTypeChange(type.id as 'image' | 'video' | 'both')}
                >
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">{type.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <MediaUpload
            type={question.uploadType || 'both'}
            onFileSelected={handleSelectedFileChange}
            selectedFile={question.mediaFile || null}
            previewUrl={previewUrl}
          />
        </div>
      );
    }

    if (question.type === 'question_with_media') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea 
              id="question-text" 
              placeholder="Ex: Após assistir ao vídeo/ver a imagem, o que você achou do produto?" 
              className="min-h-[100px] mt-1"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Mídia</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                {id: 'image', label: 'Imagem'},
                {id: 'video', label: 'Vídeo'},
                {id: 'audio', label: 'Áudio'}
              ].map((type) => (
                <Card 
                  key={type.id} 
                  className={cn(
                    "cursor-pointer hover:border-primary transition-colors p-2",
                    question.mediaType === type.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleMediaTypeChange(type.id as 'image' | 'video' | 'audio')}
                >
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">{type.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <QuestionWithMedia
            mediaType={question.mediaType || 'image'}
            mediaUrl={question.mediaUrl || null}
            mediaFile={question.mediaFile || null}
            onMediaUrlChange={handleMediaUrlChange}
            onMediaFileChange={handleMediaFileChange}
            previewUrl={previewUrl}
          />
          
          {renderOptionsBasedOnType()}
        </div>
      );
    }
    
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

  // Initialize options for appropriate question types
  if (OPTIONS_TYPES.includes(question.type) && (!question.options || question.options.length === 0)) {
    onQuestionChange({
      ...question,
      options: [
        { id: `opt-${Date.now()}`, text: 'Opção 1', code: '' },
        { id: `opt-${Date.now() + 1}`, text: 'Opção 2', code: '' }
      ]
    });
  }

  const handleSaveTemplateClick = (template: any) => {
    if (template.question && Array.isArray(template.question.options)) {
      const modifiedTemplate = {
        ...template,
        question: {
          ...template.question,
          options: template.question.options.map((opt: QuestionOption) => opt.text)
        }
      };
      onSaveTemplate(modifiedTemplate);
    } else {
      onSaveTemplate(template);
    }
  };

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

      <div className="flex justify-end">
        <SaveTemplateDialog 
          question={{
            text: question.text,
            type: question.type,
            options: question.options.map(opt => opt.text)
          }}
          onSave={handleSaveTemplateClick}
        />
      </div>
    </div>
  );
}
