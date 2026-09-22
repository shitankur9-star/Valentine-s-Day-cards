export type TemplateId = "rose" | "hearts" | "elegant" | "pastel" | "minimal" | "floral";
export type ExportSize = "standard" | "instagram" | "story" | "square" | "print";
export type ExportFormat = "png" | "jpeg" | "pdf";
export type TextAlign = "left" | "center" | "right";

export interface CardConfig {
  recipientName: string;
  senderName: string;
  message: string;
  template: TemplateId;
  textAlign: TextAlign;
  decorations: {
    hearts: boolean;
    roses: boolean;
    sparkles: boolean;
    floatingHearts: boolean;
  };
}

export const DEFAULT_CARD: CardConfig = {
  recipientName: "Someone Special",
  senderName: "With love",
  message: "You make every day brighter. Wishing you a beautiful Valentine's Day filled with happiness and love. ❤️",
  template: "rose",
  textAlign: "center",
  decorations: { hearts: true, roses: true, sparkles: true, floatingHearts: true },
};