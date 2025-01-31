//  Definição do tipo de chave permitido
export type ChainKey = 'output' | 'postrouting' | 'prerouting';

export interface OptionField {
  command: string;
  type: "text" | "select" | "select/text" | "checkbox";
  placeholder?: string;
  title: string;
  info: string;
  options?: string[]; // Usado para campos do tipo 'select' ou 'select/text'
  optional?: OptionField[]; // Permite opções aninhadas dentro de outras
}

// Tipagem para uma regra dentro de uma cadeia (ex.: 'masquerade', 'snat')
export interface ChainRule {
  required?: OptionField[]; // Campos obrigatórios
  optional?: OptionField[]; // Campos opcionais
  info?: string;
}

// Tipagem para um conjunto de regras (ex.: POSTROUTING, PREROUTING)
export type Chain = Record<string, ChainRule>; // Exemplo: { masquerade: ChainRule, snat: ChainRule }
// 🔹 Define a estrutura de `chainOptions`, limitando as chaves a `ChainKey`
export interface ChainOptions extends Partial<Record<ChainKey, Chain>> {}

export interface FormItem extends OptionField {
  required: boolean
}
