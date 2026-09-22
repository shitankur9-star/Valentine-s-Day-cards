import { forwardRef } from "react";
import type { CardConfig } from "../types/card";
import { templates } from "../data/templates";

interface Props { config: CardConfig; }

const CardPreview = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  const template = templates.find(t => t.id === config.template)!;
  const d = config.decorations;

  return (
    <div className="preview-wrap">
      <div ref={ref} className="card-art" style={{ background: template.background, color: template.accent, textAlign: config.textAlign }}>
        <div className="card-glow" />
        {d.floatingHearts && <div className="floating-hearts" aria-hidden="true">♥　♡　♥　♡　♥</div>}
        {d.sparkles && <div className="sparkles" aria-hidden="true">✦　✧　✦</div>}
        {d.roses && <div className="roses" aria-hidden="true">🌹　🌹</div>}
        <div className="card-inner">
          <div className="eyebrow">A little note for you</div>
          <h2>Happy Valentine's Day <span>♥</span></h2>
          <div className="divider">♡</div>
          <p className="dear">Dear {config.recipientName || "Someone Special"},</p>
          <p className="message">{config.message || "Write your message here..."}</p>
          <p className="signoff">With love,<br /><strong>{config.senderName || "Your Name"}</strong></p>
        </div>
        {d.hearts && <div className="corner-heart heart-a">♥</div>}
        {d.hearts && <div className="corner-heart heart-b">♥</div>}
      </div>
    </div>
  );
});

CardPreview.displayName = "CardPreview";
export default CardPreview;