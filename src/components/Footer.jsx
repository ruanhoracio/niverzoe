import React from 'react';
import { Heart, Shield } from 'lucide-react';

export default function Footer({ onAdmin }) {
  return (
    <footer>
      <div className="wrap-sm">
        <div className="brand">Zoe</div>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 24 }}>
          Primeiro Aninho · 15 de Novembro
        </div>
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          <span>© 2026</span>
          <button onClick={onAdmin} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={11} /> Painel
          </button>
        </div>
      </div>
    </footer>
  );
}
