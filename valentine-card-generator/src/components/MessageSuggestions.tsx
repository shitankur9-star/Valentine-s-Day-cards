import { messages } from "../data/messages";

export default function MessageSuggestions({ onSelect }: { onSelect: (s: string) => void }) {
  return <div className="suggestions">
    {Object.entries(messages).map(([category, list]) => (
      <div key={category}>
        <h4>{category}</h4>
        <div className="chips">{list.slice(0, 3).map((m, i) => <button key={i} type="button" onClick={() => onSelect(m)}>{m}</button>)}</div>
      </div>
    ))}
  </div>;
}