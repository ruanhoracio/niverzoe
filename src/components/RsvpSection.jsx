import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Search, CheckCircle2, XCircle, Heart, MessageSquare, Sparkles, UserPlus, RotateCcw, Users, Check } from 'lucide-react';

export default function RsvpSection({ guests, onUpdate, onUpdateMultiple }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [primaryGuest, setPrimaryGuest] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [choice, setChoice] = useState('confirmed');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [confirmedNames, setConfirmedNames] = useState([]);
  const [manual, setManual] = useState(false);
  const [manualName, setManualName] = useState('');

  // Busca inteligente
  const filtered = q.trim()
    ? guests.filter(g => g.name.toLowerCase().includes(q.toLowerCase().trim()))
    : [];

  // Pega membros da mesma família/casal
  const familyMembers = primaryGuest
    ? (primaryGuest.familyId 
        ? guests.filter(x => x.familyId === primaryGuest.familyId) 
        : [primaryGuest])
    : [];

  const pick = (g) => {
    setPrimaryGuest(g);
    setManual(false);
    
    // Encontrar todos os familiares
    const fam = g.familyId ? guests.filter(x => x.familyId === g.familyId) : [g];
    // Selecionar todos da família por padrão
    setSelectedIds(new Set(fam.map(m => m.id)));
    
    setChoice(g.status === 'declined' ? 'declined' : 'confirmed');
    setMsg(g.msg || '');
    setOpen(false);
  };

  const toggleMember = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // manter pelo menos 1 selecionado
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(familyMembers.map(m => m.id)));
  };

  const startManual = () => {
    const newGuest = { 
      id: 'manual_' + Date.now(), 
      name: q.trim() || 'Novo Convidado', 
      tipo: 'Individual', 
      group: 'Outros', 
      status: 'pending', 
      adults: 1, 
      kids: 0, 
      diet: '', 
      msg: '' 
    };
    setPrimaryGuest(newGuest);
    setSelectedIds(new Set([newGuest.id]));
    setManual(true);
    setManualName(q.trim());
    setChoice('confirmed');
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
    if (!primaryGuest) return;

    if (manual) {
      const finalName = manualName.trim() || primaryGuest.name;
      const data = {
        ...primaryGuest,
        name: finalName,
        status: choice,
        adults: choice === 'confirmed' ? 1 : 0,
        kids: 0,
        diet: '',
        msg: msg.trim(),
        updatedAt: new Date().toISOString()
      };
      if (onUpdate) onUpdate(data);
      setConfirmedNames([finalName]);
    } else {
      // Atualizar todos os membros selecionados
      const updates = familyMembers.map(m => {
        const isSelected = selectedIds.has(m.id);
        const memberStatus = choice === 'declined' 
          ? (isSelected ? 'declined' : m.status)
          : (isSelected ? 'confirmed' : 'pending');

        return {
          ...m,
          status: memberStatus,
          msg: isSelected ? msg.trim() : (m.msg || ''),
          updatedAt: new Date().toISOString()
        };
      });

      const confirmedList = familyMembers
        .filter(m => selectedIds.has(m.id))
        .map(m => m.name);

      setConfirmedNames(confirmedList);

      if (onUpdateMultiple) {
        await onUpdateMultiple(updates);
      } else {
        for (const u of updates) {
          if (onUpdate) onUpdate(u);
        }
      }
    }

    if (choice === 'confirmed') boom();
    setDone(true);
  };

  // Voltar limpo para a tela de preencher outro convidado
  const resetToSearch = () => {
    setDone(false);
    setPrimaryGuest(null);
    setSelectedIds(new Set());
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

  return (
    <section className="section" id="confirmar">
      <div className="wrap-sm">
        <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
          <h2 className="section-title">Confirmação de Presença</h2>
          <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', fontFamily: 'var(--sans)', marginTop: 14 }}>
            <p style={{ marginBottom: 6 }}>
              As confirmações serão recebidas até <strong style={{ color: 'var(--text)', textDecoration: 'underline', fontWeight: 700 }}>10 de outubro</strong>.
            </p>
            <p style={{ marginBottom: 6 }}>
              Após essa data, não será possível incluir novas confirmações.
            </p>
            <p>
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
              
              <div style={{ color: 'var(--text)', marginBottom: 28, fontSize: 15, lineHeight: 1.7 }}>
                {choice === 'confirmed' ? (
                  <>
                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>
                      Que alegria, {formatNamesList(confirmedNames)}.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                      {confirmedNames.length > 1 ? 'Estamos ansiosos para celebrar com vocês!' : 'Estamos ansiosos para celebrar com você!'}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 600 }}>
                      Obrigado por avisar, {formatNamesList(confirmedNames)}.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                      {confirmedNames.length > 1 ? 'Sentiremos a falta de vocês!' : 'Sentiremos sua falta!'}
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
            <div>
              {!primaryGuest ? (
                <div className="fade-up">
                  <label style={{ fontWeight: 500, fontSize: 14, marginBottom: 10, display: 'block' }}>
                    Busque seu nome:
                  </label>
                  <div className="search-wrap">
                    <Search className="search-icon" size={18} />
                    <input
                      className="search-input"
                      placeholder="Digite seu nome..."
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
                                {g.status === 'confirmed' ? '✅ Já confirmado' : g.status === 'declined' ? '❌ Recusou' : '⏳ Pendente'}
                              </div>
                            </div>
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
                  {/* Cabeçalho do Convidado ou Família */}
                  <div className="guest-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>
                        {manual ? 'Novo Convidado' : (familyMembers.length > 1 ? 'Sua Família / Casal' : 'Convidado')}
                      </span>
                      <button type="button" onClick={resetToSearch} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                        Trocar nome
                      </button>
                    </div>

                    {manual ? (
                      <input className="search-input" style={{ paddingLeft: 16, fontSize: 16, fontWeight: 600, fontFamily: 'var(--serif)' }}
                        placeholder="Seu nome completo..." value={manualName} onChange={(e) => setManualName(e.target.value)} required autoFocus />
                    ) : (
                      <>
                        {familyMembers.length > 1 ? (
                          <div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                              Selecione quem irá comparecer:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {familyMembers.map(m => {
                                const isChecked = selectedIds.has(m.id);
                                return (
                                  <label 
                                    key={m.id}
                                    onClick={(e) => { e.preventDefault(); toggleMember(m.id); }}
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      padding: '10px 14px', 
                                      borderRadius: 'var(--r-m)', 
                                      border: isChecked ? '1.5px solid var(--gold)' : '1px solid var(--border)', 
                                      background: isChecked ? 'var(--gold-bg)' : '#fff',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div style={{ 
                                        width: 20, 
                                        height: 20, 
                                        borderRadius: 4, 
                                        border: isChecked ? 'none' : '1.5px solid var(--text-tertiary)', 
                                        background: isChecked ? 'var(--gold)' : '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff'
                                      }}>
                                        {isChecked && <Check size={14} strokeWidth={3} />}
                                      </div>
                                      <span style={{ fontWeight: isChecked ? 600 : 400, fontSize: 15, color: 'var(--text)' }}>
                                        {m.name}
                                      </span>
                                    </div>
                                    {m.status === 'confirmed' && (
                                      <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
                                        Confirmado
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="guest-name">{primaryGuest.name}</div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="field">
                    <label>
                      {familyMembers.length > 1 && selectedIds.size > 1 ? 'Vocês poderão comparecer?' : 'Você poderá comparecer?'}
                    </label>
                    <div className="choice-grid">
                      <button type="button" className={`choice-btn ${choice === 'confirmed' ? 'yes' : ''}`} onClick={() => setChoice('confirmed')}>
                        <CheckCircle2 size={20} />
                        {familyMembers.length > 1 && selectedIds.size > 1 ? 'Sim, vamos! 🎉' : 'Sim, vou! 🎉'}
                      </button>
                      <button type="button" className={`choice-btn ${choice === 'declined' ? 'no' : ''}`} onClick={() => setChoice('declined')}>
                        <XCircle size={20} />
                        {familyMembers.length > 1 && selectedIds.size > 1 ? 'Não poderemos 🥺' : 'Não poderei 🥺'}
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MessageSquare size={13} style={{ color: 'var(--gold)' }} />
                      Alguma observação? (opcional)
                    </label>
                    <textarea rows={3} placeholder="Ex: Meu filho não poderá ir, chegaremos um pouco mais tarde, etc..." value={msg} onChange={(e) => setMsg(e.target.value)} />
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
