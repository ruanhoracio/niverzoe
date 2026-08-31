import React, { useState } from 'react';
import { Gift, Shirt, Footprints, Heart, Copy, Check } from 'lucide-react';
import { GIFT_SUGGESTIONS } from '../data/initialData';

export default function GiftSection() {
  const [copied, setCopied] = useState(false);
  const { intro, items } = GIFT_SUGGESTIONS;

  const copyPix = (pix) => {
    if (!pix) return;
    navigator.clipboard.writeText(pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Shirt': return <Shirt size={22} />;
      case 'Footprints': return <Footprints size={22} />;
      case 'Gift': return <Gift size={22} />;
      default: return <Heart size={22} />;
    }
  };

  return (
    <section className="section" id="presentes" style={{ background: 'var(--bg-alt)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
          <div className="section-label">Carinho & Mimos</div>
          <h2 className="section-title">Sugestão de Presentes</h2>
          <p className="section-desc">
            {intro}
          </p>
        </div>

        <div className="detail-grid" style={{ maxWidth: 840, margin: '0 auto' }}>
          {items.map((item, idx) => (
            <div key={idx} className="detail-card">
              <div className="detail-icon">
                {getIcon(item.icon)}
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{item.category}</h3>
              <div style={{ 
                fontFamily: 'var(--serif)', 
                fontStyle: 'italic',
                fontSize: '1.05rem', 
                color: 'var(--gold-dark)', 
                fontWeight: 500,
                marginBottom: 4 
              }}>
                {item.size}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {item.tip}
              </p>

              {item.pixKey && (
                <button 
                  onClick={() => copyPix(item.pixKey)} 
                  className="btn btn-outline btn-sm btn-block"
                  style={{ marginTop: 'auto', fontSize: 12 }}
                >
                  {copied ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                  {copied ? 'Chave PIX Copiada!' : 'Copiar Chave PIX'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            ✨ Fique à vontade para escolher o que seu coração desejar!
          </p>
        </div>
      </div>
    </section>
  );
}
