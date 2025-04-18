
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function InputWithLabel({ label, className, error, icon, ...props }: InputWithLabelProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input 
          className={cn(
            "transition-all duration-200 focus:ring-2 focus:ring-primary/20",
            icon && "pl-10",
            error ? "border-destructive focus:ring-destructive/20" : "",
            className
          )} 
          {...props} 
        />
      </div>
      {error && <p className="text-sm text-destructive animate-fade-in">{error}</p>}
    </div>
  );
}
