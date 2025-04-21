
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface EvaluationMatrixProps {
  attributes: Attribute[];
  samples: Sample[];
  onAddAttribute: () => void;
  onRemoveAttribute: (id: string) => void;
  onAttributeChange: (id: string, name: string) => void;
  onAttributeCodeChange: (id: string, code: string) => void;
  onAddSample: () => void;
  onRemoveSample: (id: string) => void;
  onSampleChange: (id: string, name: string) => void;
  onSampleCodeChange: (id: string, code: string) => void;
}

export function EvaluationMatrix({
  attributes,
  samples,
  onAddAttribute,
  onRemoveAttribute,
  onAttributeChange,
  onAttributeCodeChange,
  onAddSample,
  onRemoveSample,
  onSampleChange,
  onSampleCodeChange
}: EvaluationMatrixProps) {
  // Scale options (1-9)
  const scales = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Atributos</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Adicione os atributos que serão avaliados (ex: sabor, textura, aroma)
          </p>
        </div>

        <div className="space-y-3">
          {attributes.map((attribute) => (
            <div key={attribute.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Nome do atributo"
                  value={attribute.name}
                  onChange={(e) => onAttributeChange(attribute.id, e.target.value)}
                />
              </div>
              <div className="w-32">
                <Input
                  placeholder="Código"
                  value={attribute.code}
                  onChange={(e) => onAttributeCodeChange(attribute.id, e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveAttribute(attribute.id)}
                disabled={attributes.length <= 1}
              >
                -
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onAddAttribute}
          >
            + Adicionar Atributo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base">Amostras</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Adicione as amostras que serão avaliadas
          </p>
        </div>

        <div className="space-y-3">
          {samples.map((sample) => (
            <div key={sample.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Nome da amostra"
                  value={sample.name}
                  onChange={(e) => onSampleChange(sample.id, e.target.value)}
                />
              </div>
              <div className="w-32">
                <Input
                  placeholder="Código"
                  value={sample.code}
                  onChange={(e) => onSampleCodeChange(sample.id, e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveSample(sample.id)}
                disabled={samples.length <= 1}
              >
                -
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onAddSample}
          >
            + Adicionar Amostra
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-base">Visualização da Matriz</Label>
        <div className="mt-2 border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Atributos</TableHead>
                {samples.map((sample) => (
                  <TableHead key={sample.id}>{sample.name || `Amostra ${sample.id.slice(0, 2)}`}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">{attribute.name || `Atributo ${attribute.id.slice(0, 2)}`}</TableCell>
                  {samples.map((sample) => (
                    <TableCell key={`${attribute.id}-${sample.id}`}>
                      <div className="flex items-center justify-center">
                        <select className="w-12 h-8 rounded border text-center">
                          <option value="">-</option>
                          {scales.map((scale) => (
                            <option key={scale} value={scale}>
                              {scale}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Escala de Intensidade (1-9)</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>1-3: Intensidade baixa</div>
          <div>4-6: Intensidade média</div>
          <div>7-9: Intensidade alta</div>
        </div>
      </div>
    </div>
  );
}
