import React from 'react';
import { Heart } from 'lucide-react';

export default function GuestbookSection({ messages }) {
  if (!messages || messages.length === 0) return null;

  return (
    <section className="section" id="mural" style={{ background: 'var(--bg-alt)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 40px' }}>
          <div className="section-label">Amor & Carinho</div>
          <h2 className="section-title">Mural de Recados</h2>
          <p className="section-desc">Mensagens especiais para guardar no coração.</p>
        </div>

        <div className="msg-grid">
          {messages.map(m => (
            <div key={m.id} className="msg-card">
              <div>
                <Heart size={14} fill="var(--gold)" color="var(--gold)" style={{ marginBottom: 10 }} />
                <p className="msg-text">"{m.text}"</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="msg-author">{m.author}</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{m.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
