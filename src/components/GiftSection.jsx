import React, { useState } from 'react';
import { Gift, Shirt, Footprints, HeartHandshake, Copy, Check, QrCode, X } from 'lucide-react';
import { GIFT_SUGGESTIONS } from '../data/initialData';

export default function GiftSection() {
  const [copied, setCopied] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const { intro, items } = GIFT_SUGGESTIONS;

  const pixItem = items.find(i => i.category.includes('PIX') || i.pixKey !== undefined);
  const pixKey = pixItem?.pixKey || "pix@zoe1ano.com"; // Chave PIX configurável

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Shirt': return <Shirt size={22} />;
      case 'Footprints': return <Footprints size={22} />;
      case 'Gift': return <Gift size={22} />;
      default: return <HeartHandshake size={22} />;
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
          {items.map((item, idx) => {
            const isPix = item.category.includes('PIX') || item.icon === 'HeartHandshake';

            return (
              <div key={idx} className="detail-card" style={{ display: 'flex', flexDirection: 'column' }}>
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
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: isPix ? 14 : 0 }}>
                  {item.tip}
                </p>

                {isPix && (
                  <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button 
                      onClick={() => setShowPixModal(true)} 
                      className="btn btn-gold btn-sm btn-block"
                      style={{ fontSize: 13 }}
                    >
                      <QrCode size={14} /> Ver QR Code / Chave PIX
                    </button>
                    <button 
                      onClick={copyPix} 
                      className="btn btn-outline btn-sm btn-block"
                      style={{ fontSize: 12 }}
                    >
                      {copied ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                      {copied ? 'Chave PIX Copiada!' : 'Copiar Chave PIX'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal QR Code PIX */}
      {showPixModal && (
        <div className="overlay" onClick={() => setShowPixModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, textAlign: 'center' }}>
            <button onClick={() => setShowPixModal(false)} className="modal-close"><X size={16} /></button>
            
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-bg)', color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <HeartHandshake size={24} />
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Mimo para a Zoe ✨</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 18 }}>
              Aponte a câmera do seu banco para o QR Code ou copie a chave abaixo:
            </p>

            <div style={{ 
              background: '#fff', 
              padding: 12, 
              borderRadius: 'var(--r-m)', 
              display: 'inline-block', 
              border: '1.5px solid var(--border)',
              marginBottom: 16,
              boxShadow: 'var(--shadow-s)'
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixKey)}`} 
                alt="QR Code PIX" 
                style={{ width: 180, height: 180, display: 'block', margin: '0 auto' }} 
              />
            </div>

            <div style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--r-m)', 
              padding: '10px 14px', 
              fontSize: 13, 
              color: 'var(--text)', 
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              marginBottom: 14
            }}>
              {pixKey}
            </div>

            <button onClick={copyPix} className="btn btn-gold btn-block btn-lg">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Chave Copiada com Sucesso!' : 'Copiar Chave PIX'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
