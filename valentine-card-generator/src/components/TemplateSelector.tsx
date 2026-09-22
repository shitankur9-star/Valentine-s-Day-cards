/** @jsx createElement */
import { createElement } from "react";
import type { TemplateId } from "../types/card";
import { templates } from "../data/templates";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

export default function TemplateSelector({ value, onChange }: { value: TemplateId; onChange: (v: TemplateId) => void }) {
  return <div className="template-grid">
    {templates.map(t => (
      <button key={t.id} className={`template-card ${value === t.id ? "selected" : ""}`} onClick={() => onChange(t.id)} type="button">
        <span className="template-swatch" style={{ background: t.background }} />
        <span><strong>{t.name}</strong><small>{t.description}</small></span>
      </button>
    ))}
  </div>;
}