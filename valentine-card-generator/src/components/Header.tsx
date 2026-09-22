import { Heart } from "lucide-react";

export default function Header() {
  return <header className="header">
    <div className="brand"><Heart fill="currentColor" size={22} /> Valentine Card Maker</div>
    <nav><a href="#create">Create Card</a><a href="#templates">Templates</a><a href="#about">About</a></nav>
  </header>;
}