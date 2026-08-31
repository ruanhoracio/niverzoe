import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/initialData';
import { X } from 'lucide-react';

export default function PhotoGallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="section" id="fotos">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 48px' }}>
          <div className="section-label">Momentos Preciosos</div>
          <h2 className="section-title">Nossa Menininha</h2>
          <p className="section-desc">
            Um ano de sorrisos, descobertas e amor sem medidas.
          </p>
        </div>

        <div className="gallery-masonry">
          {GALLERY_PHOTOS.map((f, i) => (
            <div key={i} className="gallery-item" onClick={() => setLightbox(f)}>
              <img src={`/fotos/${f}`} alt="Zoe" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="overlay lightbox" onClick={() => setLightbox(null)}>
          <button className="modal-close" onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 20, zIndex: 1001 }}>
            <X size={16} />
          </button>
          <img src={`/fotos/${lightbox}`} alt="Zoe" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
