import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { HERO_PHOTOS } from '../data/initialData';

export default function Hero({ event }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(event.iso).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.iso]);

  // Duplicate photos for seamless infinite scroll
  const photos = [...HERO_PHOTOS, ...HERO_PHOTOS];

  return (
    <section className="hero" id="hero">
      {/* Text content */}
      <div className="hero-top">
        <div className="hero-eyebrow">Celebração Especial</div>

        <h1>
          Zoe faz <em>1 aninho.</em>
        </h1>

        <p className="hero-sub">{event.subtitle}</p>

        <div className="hero-meta">
          <span className="hero-meta-item">
            <Calendar size={15} />
            {event.date}
          </span>
          <span className="hero-meta-item">
            <Clock size={15} />
            {event.time}
          </span>
          <span className="hero-meta-item">
            <MapPin size={15} />
            {event.venue}
          </span>
        </div>

        <div className="hero-actions">
          <a href="#confirmar" className="btn btn-gold btn-lg">
            <Heart size={16} fill="#fff" />
            Confirmar Presença
          </a>
          <a href="#detalhes" className="btn btn-outline btn-lg">
            Detalhes & Local
          </a>
        </div>
      </div>

      {/* Countdown */}
      <div className="countdown">
        <div className="cd-unit">
          <div className="cd-num">{time.d}</div>
          <div className="cd-label">Dias</div>
        </div>
        <span className="cd-sep">:</span>
        <div className="cd-unit">
          <div className="cd-num">{String(time.h).padStart(2, '0')}</div>
          <div className="cd-label">Horas</div>
        </div>
        <span className="cd-sep">:</span>
        <div className="cd-unit">
          <div className="cd-num">{String(time.m).padStart(2, '0')}</div>
          <div className="cd-label">Min</div>
        </div>
        <span className="cd-sep">:</span>
        <div className="cd-unit">
          <div className="cd-num">{String(time.s).padStart(2, '0')}</div>
          <div className="cd-label">Seg</div>
        </div>
      </div>

      {/* Infinite photo carousel */}
      <div className="carousel-wrapper">
        <div className="carousel-fade-l" />
        <div className="carousel-fade-r" />
        <div className="carousel-track">
          {photos.map((f, i) => (
            <img
              key={i}
              src={`/fotos/${f}`}
              alt="Zoe"
              className="carousel-img"
              loading={i > 6 ? "lazy" : "eager"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
