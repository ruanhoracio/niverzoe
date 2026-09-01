import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Search, CheckCircle2, XCircle, Heart, MessageSquare, Sparkles, UserPlus, RotateCcw, Users, Check, X, Plus } from 'lucide-react';

export default function RsvpSection({ guests, onUpdate, onUpdateMultiple }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState(new Map()); // Map<id, guest>
  const [choice, setChoice] = useState('confirmed');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [confirmedNames, setConfirmedNames] = useState([]);
  const [manual, setManual] = useState(false);
  const [manualName, setManualName] = useState('');

  // Busca inteligente (busca por qualquer parte do nome)
  const filtered = q.trim()
    ? guests.filter(g => g.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .includes(q.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
    : [];

  const toggleGuest = (g) => {
    setSelectedMap(prev => {
      const next = new Map(prev);
      if (next.has(g.id)) {
        next.delete(g.id);
      } else {
        next.set(g.id, g);
      }
      return next;
    });
  };

  const removeGuest = (id) => {
    setSelectedMap(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const addFamilyOf = (g) => {
    if (!g.familyId) return;
    const fam = guests.filter(x => x.familyId === g.familyId);
    setSelectedMap(prev => {
      const next = new Map(prev);
      fam.forEach(m => next.set(m.id, m));
      return next;
    });
  };

  const startManual = () => {
    if (!q.trim()) return;
    const newGuest = { 
      id: 'manual_' + Date.now(), 
      name: q.trim(), 
      tipo: 'Individual', 
      group: 'Outros', 
      status: 'pending', 
      adults: 1, 
      kids: 0, 
      diet: '', 
      msg: '' 
    };
    setSelectedMap(prev => {
      const next = new Map(prev);
      next.set(newGuest.id, newGuest);
      return next;
    });
    setQ('');
    setOpen(false);
  };

  const boom = () => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#B08D6E', '#D4AF37', '#E8D3C5', '#F5EFEB', '#4A6357'] });
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 }, colors: ['#B08D6E', '#D4AF37'] });
      confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 }, colors: ['#B08D6E', '#D4AF37'] });
    }, 200);
  };

  const submit = async (e) => {
    e.preventDefault();
    const selectedList = Array.from(selectedMap.values());
    if (selectedList.length === 0) return;

    const updates = selectedList.map(m => ({
      ...m,
      status: choice,
      msg: msg.trim(),
      updatedAt: new Date().toISOString()
    }));

    const namesList = selectedList.map(m => m.name);
    setConfirmedNames(namesList);

    if (onUpdateMultiple) {
      await onUpdateMultiple(updates);
    } else {
      for (const u of updates) {
        if (onUpdate) onUpdate(u);
      }
    }

    if (choice === 'confirmed') boom();
    setDone(true);
  };

  // Voltar limpo para a tela de preencher outro convidado
  const resetToSearch = () => {
    setDone(false);
    setSelectedMap(new Map());
    setQ('');
    setManualName('');
    setManual(false);
    setMsg('');
  };

  // Voltar para editar os mesmos dados
  const backToEdit = () => {
    setDone(false);
  };

  const formatNamesList = (names) => {
    if (!names || names.length === 0) return 'Convidado';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} e ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
  };

  const selectedList = Array.from(selectedMap.values());
  const hasMultiple = selectedList.length > 1;

  return (
    <section className="section" id="confirmar">
      <div className="wrap-sm">
        {/* Cabeçalho do Prazo */}
        <div style={{ textAlign: 'center', marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
          <h2 className="section-title">Confirmação de Presença</h2>
          <div style={{ fontSize: 'clamp(13px, 3.6vw, 14.5px)', lineHeight: 1.8, color: 'var(--text-secondary)', fontFamily: 'var(--sans)', marginTop: 14 }}>
            <p style={{ margin: '0 0 6px 0', whiteSpace: 'normal' }}>
              As confirmações serão recebidas até <strong style={{ color: 'var(--text)', textDecoration: 'underline', fontWeight: 700 }}>10 de outubro</strong>.
            </p>
            <p style={{ margin: '0 0 6px 0', whiteSpace: 'normal' }}>
              Após essa data, não será possível incluir novas confirmações.
            </p>
            <p style={{ margin: 0, whiteSpace: 'normal' }}>
              Em caso de imprevisto, pedimos a gentileza de nos avisar.
            </p>
          </div>
        </div>

        <div className="rsvp-card">
          {done ? (
            <div className="success-wrap fade-up" style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div className="success-check">
                {choice === 'confirmed' ? <CheckCircle2 size={36} /> : <Heart size={36} style={{ color: 'var(--text-secondary)' }} />}
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: 12 }}>
                {choice === 'confirmed' ? 'Presença Confirmada! 🎉' : 'Resposta Registrada'}
              </h3>
              
              <div style={{ color: 'var(--text)', marginBottom: 28, fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.7 }}>
                {choice === 'confirmed' ? (
                  <>
                    <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
                      Que alegria, {formatNamesList(confirmedNames)}.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {hasMultiple ? 'Estamos ansiosos para celebrar com vocês!' : 'Estamos ansiosos para celebrar com você!'}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>
                      Obrigado por avisar, {formatNamesList(confirmedNames)}.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {hasMultiple ? 'Sentiremos a falta de vocês!' : 'Sentiremos sua falta!'}
                    </p>
                  </>
                )}
              </div>

              {/* Botões de Ação Claros */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                <button 
                  onClick={resetToSearch} 
                  className="btn btn-gold btn-block btn-lg"
                  style={{ fontSize: 14 }}
                >
                  <Users size={16} /> Confirmar mais pessoas da família
                </button>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 6 }}>
                  <a href="#detalhes" className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    Ver Local
                  </a>
                  <button 
                    onClick={backToEdit} 
                    className="btn btn-ghost btn-sm" 
                    style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 12 }}
                  >
                    <RotateCcw size={13} /> Alterar resposta
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-up">
              {/* 1. Barra de Busca com Múltipla Seleção */}
              <div>
                <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block', color: 'var(--text)' }}>
                  Busque e selecione os convidados da sua família:
                </label>
                <div className="search-wrap" style={{ marginBottom: 12 }}>
                  <Search className="search-icon" size={18} />
                  <input
                    className="search-input"
                    placeholder="Digite seu nome (ex: Ruan, Karolayne, Marco...)"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                  />
                  {open && q.trim() && (
                    <div className="dropdown fade-up" style={{ maxHeight: 280 }}>
                      {filtered.length > 0 ? filtered.map(g => {
                        const isChecked = selectedMap.has(g.id);
                        return (
                          <div 
                            key={g.id} 
                            className="dropdown-row" 
                            onClick={() => toggleGuest(g)}
                            style={{ 
                              padding: '12px 16px',
                              background: isChecked ? 'var(--gold-bg)' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ 
                                width: 20, 
                                height: 20, 
                                borderRadius: 4, 
                                border: isChecked ? 'none' : '1.5px solid var(--text-tertiary)', 
                                background: isChecked ? 'var(--gold)' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                flexShrink: 0
                              }}>
                                {isChecked && <Check size={14} strokeWidth={3} />}
                              </div>
                              <div style={{ fontWeight: isChecked ? 600 : 500, fontSize: 15, color: 'var(--text)' }}>
                                {g.name}
                              </div>
                            </div>

                            {/* Botão para puxar a família inteira de uma vez */}
                            {g.familyId && !isChecked && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addFamilyOf(g);
                                }}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--r-full)',
                                  padding: '3px 8px',
                                  fontSize: 11,
                                  color: 'var(--gold-dark)',
                                  cursor: 'pointer'
                                }}
                              >
                                + Família
                              </button>
                            )}
                          </div>
                        );
                      }) : (
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
              </div>

              {/* 2. Chips dos Convidados Selecionados */}
              {selectedList.length > 0 && (
                <div style={{ 
                  background: 'var(--bg)', 
                  border: '1.5px solid var(--border)', 
                  borderRadius: 'var(--r-l)', 
                  padding: '16px 18px',
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-dark)', fontWeight: 600 }}>
                      Pessoas selecionadas ({selectedList.length}):
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedMap(new Map())}
                      style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Limpar todos
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedList.map(g => (
                      <div 
                        key={g.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#fff',
                          border: '1px solid var(--gold)',
                          padding: '6px 12px',
                          borderRadius: 'var(--r-full)',
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <Check size={14} style={{ color: 'var(--gold)' }} />
                        <span>{g.name}</span>
                        <button
                          type="button"
                          onClick={() => removeGuest(g.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            padding: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Formulário de Confirmação (ativo quando há pessoas selecionadas) */}
              {selectedList.length > 0 ? (
                <form onSubmit={submit} className="fade-up">
                  <div className="field">
                    <label style={{ fontSize: 14, fontWeight: 600 }}>
                      {hasMultiple ? 'Vocês poderão comparecer?' : 'Você poderá comparecer?'}
                    </label>
                    <div className="choice-grid">
                      <button type="button" className={`choice-btn ${choice === 'confirmed' ? 'yes' : ''}`} onClick={() => setChoice('confirmed')}>
                        <CheckCircle2 size={20} />
                        {hasMultiple ? 'Sim, vamos! 🎉' : 'Sim, vou! 🎉'}
                      </button>
                      <button type="button" className={`choice-btn ${choice === 'declined' ? 'no' : ''}`} onClick={() => setChoice('declined')}>
                        <XCircle size={20} />
                        {hasMultiple ? 'Não poderemos 🥺' : 'Não poderei 🥺'}
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5 }}>
                      <MessageSquare size={13} style={{ color: 'var(--gold)' }} />
                      Alguma observação? (opcional)
                    </label>
                    <textarea rows={3} placeholder="Ex: Meu filho não poderá ir, chegaremos um pouco mais tarde, etc..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-gold btn-block btn-lg" style={{ marginTop: 10 }}>
                    <Sparkles size={16} />
                    {choice === 'confirmed' 
                      ? (hasMultiple ? `Confirmar Presença (${selectedList.length} pessoas)` : 'Confirmar Presença')
                      : 'Enviar Resposta'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '14px 10px 6px', color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>
                  👆 Digite seu nome e o nome dos familiares que deseja confirmar junto (filhos, cônjuge e/ou namorado(a)).
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
