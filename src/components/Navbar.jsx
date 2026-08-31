import React from 'react';
import { Shield } from 'lucide-react';

export default function Navbar({ onAdmin }) {
  return (
    <nav className="nav">
      <a href="#hero" className="nav-brand">Zoe</a>
      <a href="#detalhes" className="nav-link nav-hide">Detalhes</a>
      <a href="#confirmar" className="nav-link" style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>Confirmar</a>
      <button onClick={onAdmin} className="btn btn-outline btn-sm" style={{ marginLeft: 4, gap: 5 }}>
        <Shield size={13} />
        <span className="nav-hide">Painel</span>
      </button>
    </nav>
  );
}
