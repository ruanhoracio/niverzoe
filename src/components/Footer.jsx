import React from 'react';
import { Heart, Shield } from 'lucide-react';

export default function Footer({ onAdmin }) {
  return (
    <footer>
      <div className="wrap-sm">
        <div className="brand">Zoe</div>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 16 }}>
          Primeiro Aninho · 15 de Novembro
        </div>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 380, margin: '0 auto 20px', lineHeight: 1.5 }}>
          "Agradecemos de coração a cada um que celebra com a gente."
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 20 }}>
          Feito com amor <Heart size={12} fill="var(--gold)" color="var(--gold)" />
        </div>
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          <span>© 2026</span>
          <button onClick={onAdmin} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={11} /> Painel
          </button>
        </div>
      </div>
    </footer>
  );
}
