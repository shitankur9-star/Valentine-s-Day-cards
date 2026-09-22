import type { TemplateId } from "../types/card";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  background: string;
  accent: string;
}

export const templates: Template[] = [
  { id: "rose", name: "Romantic Rose", description: "Warm rose romance", background: "linear-gradient(135deg,#6b1026,#c43d5c 52%,#f8c6cf)", accent: "#fff4f5" },
  { id: "hearts", name: "Pink Hearts", description: "Playful hearts", background: "linear-gradient(135deg,#ff6f91,#ff9fba 50%,#ffd6e0)", accent: "#4d1022" },
  { id: "elegant", name: "Elegant Red", description: "Classic and refined", background: "linear-gradient(135deg,#16070a,#5b0c18 55%,#9d273b)", accent: "#fff7ed" },
  { id: "pastel", name: "Cute Pastel", description: "Soft and cheerful", background: "linear-gradient(135deg,#ffe2ea,#ffd5e6 50%,#fff1f5)", accent: "#7b3450" },
  { id: "minimal", name: "Minimal Love", description: "Clean and modern", background: "linear-gradient(135deg,#fffaf7,#f7e8e8)", accent: "#6b2638" },
  { id: "floral", name: "Floral Valentine", description: "Fresh floral feeling", background: "linear-gradient(135deg,#fce1e8,#e8d9ed 50%,#fff2e8)", accent: "#65384d" }
];