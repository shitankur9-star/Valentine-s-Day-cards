import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import type { ExportFormat, ExportSize } from "../types/card";

export const dimensions: Record<ExportSize, { width: number; height: number; label: string }> = {
  standard: { width: 1600, height: 1200, label: "Standard 4:3" },
  instagram: { width: 1080, height: 1350, label: "Instagram 4:5" },
  story: { width: 1080, height: 1920, label: "Story / Status 9:16" },
  square: { width: 1080, height: 1080, label: "Square 1:1" },
  print: { width: 2550, height: 3300, label: "Print 8.5×11 @ 300 DPI" }
};

function safeName(name: string) {
  const clean = name.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "");
  return clean || "card";
}

export async function exportCard(node: HTMLElement, format: ExportFormat, size: ExportSize, recipient: string) {
  const { width, height } = dimensions[size];
  const name = `valentine-card-${safeName(recipient)}`;

  const options = {
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#fff"
  };

  if (format === "png") {
    const dataUrl = await toPng(node, options);
    download(dataUrl, `${name}.png`);
    return;
  }

  const jpegUrl = await toJpeg(node, { ...options, quality: 0.95 });
  if (format === "jpeg") {
    download(jpegUrl, `${name}.jpg`);
    return;
  }

  const orientation = width >= height ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    compress: true
  });
  pdf.addImage(jpegUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
  pdf.save(`${name}.pdf`);
}

function download(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}