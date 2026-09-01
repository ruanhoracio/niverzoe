import React from 'react';
import { Calendar, MapPin, CalendarPlus, Navigation } from 'lucide-react';

export default function EventDetails({ event }) {
  const gcalUrl = () => {
    const t = encodeURIComponent('Aniversário de 1 Ano da Zoe 🎂');
    const d = encodeURIComponent(`Celebração do 1º aninho da Zoe! Local: ${event.venue}`);
    const l = encodeURIComponent(event.venue);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${t}&details=${d}&location=${l}&dates=20261115T183000Z/20261115T233000Z`;
  };

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261115T183000Z", "DTEND:20261115T233000Z",
      `SUMMARY:Aniversário da Zoe - 1 Aninho 🎂`,
      `LOCATION:${event.venue}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'aniversario-zoe.ics';
    a.click();
  };

  return (
    <section className="section event-details-section" id="detalhes">
      <div className="venue-bg-layer" />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 40px' }}>
          <div className="section-label">Informações</div>
          <h2 className="section-title">Detalhes do Evento</h2>
          <p className="section-desc">
            Preparamos tudo com muito carinho para receber você e sua família.
          </p>
        </div>

        <div className="detail-grid" style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Date */}
          <div className="detail-card">
            <div className="detail-icon"><Calendar size={22} /></div>
            <h3>Data & Horário</h3>
            <p>
              <strong style={{ color: 'var(--text)', fontSize: 15 }}>{event.date}</strong><br />
              Às {event.time}
            </p>
            <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 'auto' }}>
              <a href={gcalUrl()} target="_blank" rel="noopener" className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 12 }}>
                <CalendarPlus size={13} /> Google
              </a>
              <button onClick={downloadIcs} className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 12 }}>
                iCal
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="detail-card">
            <div className="detail-icon"><MapPin size={22} /></div>
            <h3>Local</h3>
            <p>
              <strong style={{ color: 'var(--text)', fontSize: 15 }}>{event.venue}</strong><br />
              {event.address}
            </p>
            <a href={event.mapUrl} target="_blank" rel="noopener" className="btn btn-gold btn-sm btn-block" style={{ fontSize: 13, marginTop: 'auto' }}>
              <Navigation size={13} /> Abrir no Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
