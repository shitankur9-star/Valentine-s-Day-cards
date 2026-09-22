import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Heart, Link2, Share2, Sparkles, WandSparkles } from "lucide-react";
import Header from "./components/Header";
import CardPreview from "./components/CardPreview";
import TemplateSelector from "./components/TemplateSelector";
import MessageSuggestions from "./components/MessageSuggestions";
import { allMessages } from "./data/messages";
import { DEFAULT_CARD, type CardConfig, type ExportFormat, type ExportSize } from "./types/card";
import { dimensions, exportCard } from "./utils/exportCard";
import { decodeConfig, encodeConfig } from "./utils/urlState";

const STORAGE = "valentine-card-config-v1";

export default function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<CardConfig>(() => {
    const saved = localStorage.getItem(STORAGE);
    if (saved) try { return JSON.parse(saved); } catch {}
    const param = new URLSearchParams(location.search).get("card");
    return param ? decodeConfig(param) ?? DEFAULT_CARD : DEFAULT_CARD;
  });
  const [format, setFormat] = useState<ExportFormat>("png");
  const [size, setSize] = useState<ExportSize>("standard");
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => localStorage.setItem(STORAGE, JSON.stringify(config)), [config]);

  const templateName = useMemo(() => config.template, [config.template]);
  const update = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) => setConfig(c => ({ ...c, [key]: value }));

  function surprise() {
    const templates = ["rose","hearts","elegant","pastel","minimal","floral"] as const;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const message = allMessages[Math.floor(Math.random() * allMessages.length)];
    setConfig(c => ({ ...c, template, message }));
  }

  async function download() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await exportCard(previewRef.current, format, size, config.recipientName);
      setNotice(`Your ${format.toUpperCase()} card is ready.`);
    } catch (e) {
      console.error(e);
      setNotice("Something went wrong while exporting your card. Please try again.");
    } finally { setExporting(false); }
  }

  async function share() {
    const text = `Happy Valentine's Day ❤️\\n\\nDear ${config.recipientName},\\n${config.message}\\n\\nWith love, ${config.senderName}`;
    try {
      if (navigator.share) await navigator.share({ title: "Valentine's Day Card", text });
      else await navigator.clipboard.writeText(text);
      setNotice(navigator.share ? "Share sheet opened." : "Card text copied.");
    } catch {}
  }

  async function copyText() {
    await navigator.clipboard.writeText(`Happy Valentine's Day ❤️\\n\\nDear ${config.recipientName},\\n${config.message}\\n\\nWith love, ${config.senderName}`);
    setNotice("Card text copied.");
  }

  async function copyLink() {
    const url = `${location.origin}${location.pathname}?card=${encodeConfig(config)}`;
    await navigator.clipboard.writeText(url);
    setNotice("Personalized card link copied.");
  }

  return <>
    <Header />
    <main>
      <section className="hero">
        <div>
          <div className="pill"><Heart size={15} fill="currentColor" /> Personalized • Free • Instant</div>
          <h1>Create a Valentine’s Card <span>❤️</span></h1>
          <p>Make a beautiful personalized card in seconds.</p>
          <a className="primary" href="#create">Create Your Card</a>
        </div>
        <div className="hero-hearts">♥　♡　♥<br />♡　♥　♡</div>
      </section>

      <section id="create" className="workspace">
        <aside className="editor panel">
          <div className="panel-title"><div><span className="kicker">CUSTOMIZE</span><h2>Your Card</h2></div><button className="surprise" onClick={surprise}><WandSparkles size={16}/> Surprise Me</button></div>

          <label>Recipient Name<input value={config.recipientName} onChange={e => update("recipientName", e.target.value)} placeholder="Enter name" /></label>
          <label>Your Name<input value={config.senderName} onChange={e => update("senderName", e.target.value)} placeholder="Enter your name" /></label>
          <label>Personal Message<textarea value={config.message} onChange={e => update("message", e.target.value)} rows={5} placeholder="Write your message..." /></label>

          <div className="field-title">Message Ideas</div>
          <MessageSuggestions onSelect={m => update("message", m)} />

          <div className="field-title" id="templates">Card Template</div>
          <TemplateSelector value={templateName} onChange={v => update("template", v)} />

          <label>Text Alignment
            <select value={config.textAlign} onChange={e => update("textAlign", e.target.value as CardConfig["textAlign"])}>
              <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
            </select>
          </label>

          <div className="field-title">Decorations</div>
          <div className="toggles">
            {Object.entries({ hearts:"❤️ Hearts", roses:"🌹 Roses", sparkles:"✨ Sparkles", floatingHearts:"💕 Floating hearts" }).map(([key,label]) => (
              <label className="toggle" key={key}><input type="checkbox" checked={config.decorations[key as keyof CardConfig["decorations"]]} onChange={e => setConfig(c => ({...c, decorations:{...c.decorations,[key]:e.target.checked}}))}/><span>{label}</span></label>
            ))}
          </div>
        </aside>

        <section className="preview-panel">
          <div className="preview-header"><div><span className="kicker">LIVE PREVIEW</span><h2>Your finished card</h2></div><span className="size-badge">{dimensions[size].label}</span></div>
          <CardPreview ref={previewRef} config={config} />

          <div className="export-box">
            <div className="export-row">
              <label>Size<select value={size} onChange={e => setSize(e.target.value as ExportSize)}>{Object.entries(dimensions).map(([k,v]) => <option value={k} key={k}>{v.label}</option>)}</select></label>
              <label>Format<select value={format} onChange={e => setFormat(e.target.value as ExportFormat)}><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="pdf">PDF</option></select></label>
              <button className="download" onClick={download} disabled={exporting}><Download size={18}/>{exporting ? "Exporting…" : `Download ${format.toUpperCase()}`}</button>
            </div>
            <div className="actions">
              <button onClick={share}><Share2 size={16}/> Share</button>
              <button onClick={copyText}><Copy size={16}/> Copy Text</button>
              <button onClick={copyLink}><Link2 size={16}/> Copy Link</button>
            </div>
            {notice && <div className="notice">{notice}</div>}
          </div>
        </section>
      </section>

      <section id="about" className="info-section">
        <div><Sparkles size={22}/><h2>Made to share a little love.</h2><p>Create, customize, download, and share a polished Valentine’s card without needing a design app.</p></div>
      </section>
    </main>
    <footer>Made with ❤️ for Valentine's Day · Create • Customize • Share</footer>
  </>;
}