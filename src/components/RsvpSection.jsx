import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Search, CheckCircle2, XCircle, Heart, MessageSquare, Sparkles, UserPlus, RotateCcw } from 'lucide-react';

export default function RsvpSection({ guests, onUpdate }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState(null);
  const [manual, setManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [choice, setChoice] = useState('confirmed');
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [diet, setDiet] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  const filtered = q.trim() ? guests.filter(g => g.name.toLowerCase().includes(q.toLowerCase())) : [];

  const pick = (g) => {
    setGuest(g); setQ(g.name); setOpen(false); setManual(false);
    setChoice(g.status === 'declined' ? 'declined' : 'confirmed');
    setAdults(g.adults || 1); setKids(g.kids || 0);
    setDiet(g.diet || ''); setMsg(g.msg || '');
  };

  const startManual = () => {
    setManual(true);
    setGuest({ id: 'new_' + Date.now(), name: '', group: 'Convidado', status: 'pending' });
    setChoice('confirmed'); setAdults(1); setKids(0); setOpen(false);
  };

  const boom = () => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#B08D6E', '#D4AF37', '#E8D3C5', '#F5EFEB', '#4A6357'] });
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 }, colors: ['#B08D6E', '#D4AF37'] });
      confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 }, colors: ['#B08D6E', '#D4AF37'] });
    }, 200);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!guest) return;
    const data = {
      ...guest,
      name: manual ? manualName : guest.name,
      status: choice,
      adults: choice === 'confirmed' ? Number(adults) : 0,
      kids: choice === 'confirmed' ? Number(kids) : 0,
      diet: diet.trim(),
      msg: msg.trim(),
      updatedAt: new Date().toISOString()
    };
    onUpdate(data);

    if (choice === 'confirmed') boom();
    setDone(true);
  };

  const reset = () => {
    setDone(false); setGuest(null); setQ(''); setManualName('');
    setManual(false); setMsg(''); setDiet('');
  };

  return (
    <section className="section" id="confirmar">
      <div className="wrap-sm">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Sua presença é essencial</div>
          <h2 className="section-title">Confirmação de Presença</h2>
          <p className="section-desc">Confirme até 10 de Outubro para que possamos preparar tudo com carinho.</p>
        </div>

        <div className="rsvp-card">
          {done ? (
            <div className="success-wrap fade-up">
              <div className="success-check">
                {choice === 'confirmed' ? <CheckCircle2 size={32} /> : <Heart size={32} style={{ color: 'var(--text-secondary)' }} />}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>
                {choice === 'confirmed' ? 'Presença Confirmada! 🎉' : 'Resposta Registrada'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                {choice === 'confirmed'
                  ? <>Que alegria, <strong>{guest?.name}</strong>! Estamos ansiosos para celebrar com você!</>
                  : <>Obrigado por nos avisar, <strong>{guest?.name}</strong>. Sentiremos sua falta!</>}
              </p>
              {choice === 'confirmed' && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-m)', padding: 14, maxWidth: 320, margin: '0 auto 20px', textAlign: 'left', fontSize: 14 }}>
                  <div style={{ fontWeight: 600 }}>• Adultos: {adults}</div>
                  {kids > 0 && <div style={{ fontWeight: 600 }}>• Crianças: {kids}</div>}
                  {diet && <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>• {diet}</div>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="#detalhes" className="btn btn-outline btn-sm">Ver Local</a>
                <button onClick={reset} className="btn btn-ghost btn-sm"><RotateCcw size={13} /> Alterar</button>
              </div>
            </div>
          ) : (
            <div>
              {!guest ? (
                <div className="fade-up">
                  <label style={{ fontWeight: 500, fontSize: 14, marginBottom: 10, display: 'block' }}>
                    Busque seu nome ou família:
                  </label>
                  <div className="search-wrap">
                    <Search className="search-icon" size={18} />
                    <input
                      className="search-input"
                      placeholder="Digite seu nome ou família..."
                      value={q}
                      onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                      onFocus={() => setOpen(true)}
                    />
                    {open && q.trim() && (
                      <div className="dropdown fade-up">
                        {filtered.length > 0 ? filtered.map(g => (
                          <div key={g.id} className="dropdown-row" onClick={() => pick(g)}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                {g.status === 'confirmed' ? '✅ Confirmado' : g.status === 'declined' ? '❌ Recusou' : '⏳ Pendente'}
                              </div>
                            </div>
                            <span className="badge">{g.group}</span>
                          </div>
                        )) : (
                          <div style={{ padding: 16, textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Nome não encontrado na lista.</p>
                            <button onClick={startManual} className="btn btn-gold btn-sm">
                              <UserPlus size={13} /> Confirmar como "{q}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 14 }}>
                    <button onClick={startManual} style={{ background: 'none', border: 'none', color: 'var(--gold-dark)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                      Não está na lista? Confirme diretamente
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="fade-up">
                  <div className="guest-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 500 }}>
                        {manual ? 'Novo Convidado' : 'Convidado'}
                      </span>
                      <button type="button" onClick={() => setGuest(null)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                        Trocar
                      </button>
                    </div>
                    {manual ? (
                      <input className="search-input" style={{ paddingLeft: 16, fontSize: 16, fontWeight: 600, fontFamily: 'var(--serif)' }}
                        placeholder="Seu nome completo..." value={manualName} onChange={(e) => setManualName(e.target.value)} required autoFocus />
                    ) : (
                      <div className="guest-name">{guest.name}</div>
                    )}
                  </div>

                  <div className="field">
                    <label>Você poderá comparecer?</label>
                    <div className="choice-grid">
                      <button type="button" className={`choice-btn ${choice === 'confirmed' ? 'yes' : ''}`} onClick={() => setChoice('confirmed')}>
                        <CheckCircle2 size={20} />
                        Sim, vou! 🎉
                      </button>
                      <button type="button" className={`choice-btn ${choice === 'declined' ? 'no' : ''}`} onClick={() => setChoice('declined')}>
                        <XCircle size={20} />
                        Não poderei 🥺
                      </button>
                    </div>
                  </div>

                  {choice === 'confirmed' && (
                    <div className="fade-up">
                      <div className="counter-row">
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>Adultos</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Incluindo você</div>
                        </div>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}>−</button>
                          <span style={{ fontWeight: 600, fontSize: 16, minWidth: 20, textAlign: 'center' }}>{adults}</span>
                          <button type="button" className="counter-btn" onClick={() => setAdults(adults + 1)}>+</button>
                        </div>
                      </div>
                      <div className="counter-row">
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>Crianças</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Até 10 anos</div>
                        </div>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => setKids(Math.max(0, kids - 1))} disabled={kids <= 0}>−</button>
                          <span style={{ fontWeight: 600, fontSize: 16, minWidth: 20, textAlign: 'center' }}>{kids}</span>
                          <button type="button" className="counter-btn" onClick={() => setKids(kids + 1)}>+</button>
                        </div>
                      </div>
                      <div className="field" style={{ marginTop: 16 }}>
                        <label>Restrição alimentar ou observação? (opcional)</label>
                        <input placeholder="Ex: Vegetariano, sem lactose..." value={diet} onChange={(e) => setDiet(e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MessageSquare size={13} style={{ color: 'var(--gold)' }} />
                      Mensagem para a Zoe (opcional)
                    </label>
                    <textarea rows={3} placeholder="Seus votos de amor e carinho para o primeiro aninho da Zoe..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-gold btn-block btn-lg" style={{ marginTop: 8 }}>
                    <Sparkles size={16} />
                    {choice === 'confirmed' ? 'Confirmar Presença' : 'Enviar Resposta'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
