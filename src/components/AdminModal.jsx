import React, { useState } from 'react';
import { X, Lock, Users, CheckCircle2, XCircle, Plus, Trash2, Download, Copy, Check, Share2, FileText, Edit3, Save } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, guests, onUpdate, onAdd, onDelete, onBatch, onReset, onClearAll, event }) {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState('list');
  const [filter, setFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Família materna');
  const [tipo, setTipo] = useState('Individual');
  const [isAdult, setIsAdult] = useState(true);
  const [batch, setBatch] = useState('');
  const [batchGroup, setBatchGroup] = useState('Convidados');
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Estado para Edição do Convidado
  const [editingGuest, setEditingGuest] = useState(null);

  if (!isOpen) return null;

  const login = (e) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() === (event.password || '2905').toLowerCase()) { setAuth(true); setErr(false); }
    else setErr(true);
  };

  const confirmed = guests.filter(g => g.status === 'confirmed');
  const declined = guests.filter(g => g.status === 'declined');
  const pending = guests.filter(g => g.status === 'pending');

  // Totais gerais
  const totalGuestsCount = guests.length;
  const totalPayingPredicted = guests.filter(g => g.isPaying !== false && (g.adults > 0 || g.kidsPaying > 0 || (g.adults === undefined && g.kids === 0))).length;
  const totalFreeKids = guests.filter(g => g.kidsFree > 0 || (g.kids > 0 && g.isPaying === false)).length;

  // Confirmados detalhados
  const confirmedPaying = confirmed.filter(g => g.isPaying !== false && (g.adults > 0 || g.kidsPaying > 0 || (g.adults === undefined && g.kids === 0))).length;
  const confirmedFreeKids = confirmed.filter(g => g.kidsFree > 0 || (g.kids > 0 && g.isPaying === false)).length;
  const confirmedTotalPeople = confirmed.length;

  // Grupos únicos para filtro
  const availableGroups = ['all', ...Array.from(new Set(guests.map(g => g.group).filter(Boolean)))];

  const shown = guests.filter(g => {
    const statusMatch = filter === 'all' || g.status === filter;
    const groupMatch = groupFilter === 'all' || g.group === groupFilter;
    return statusMatch && groupMatch;
  });

  // Alternar rapidamente entre Pagante e Isento (<2 anos) com um clique na tabela
  const togglePaying = (g) => {
    const nextIsPaying = g.isPaying === false;
    const updated = {
      ...g,
      isPaying: nextIsPaying,
      adults: nextIsPaying ? 1 : 0,
      kids: nextIsPaying ? 0 : 1,
      kidsFree: nextIsPaying ? 0 : 1,
      kidsPaying: 0,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updated);
  };

  // Alternar rapidamente status com um clique no badge de status
  const cycleStatus = (g) => {
    const order = ['pending', 'confirmed', 'declined'];
    const currentIdx = order.indexOf(g.status || 'pending');
    const nextStatus = order[(currentIdx + 1) % order.length];
    onUpdate({ ...g, status: nextStatus, updatedAt: new Date().toISOString() });
  };

  const saveEditedGuest = (e) => {
    e.preventDefault();
    if (!editingGuest) return;
    onUpdate({ ...editingGuest, updatedAt: new Date().toISOString() });
    setEditingGuest(null);
  };

  const addOne = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newGuest = {
      id: 'g_' + Date.now(),
      name: name.trim(),
      tipo,
      group,
      status: 'pending',
      adults: isAdult ? 1 : 0,
      kids: isAdult ? 0 : 1,
      kidsFree: isAdult ? 0 : 1,
      kidsPaying: 0,
      isPaying: isAdult,
      diet: '',
      msg: ''
    };
    onAdd(newGuest);
    setName('');
  };

  const doBatch = () => {
    const lines = batch.split('\n').map(l => l.replace(/^(\d+[\.\)\-]?|\*|\-)\s*/, '').trim()).filter(Boolean);
    if (!lines.length) return;
    const items = lines.map((n, i) => ({
      id: 'b_' + Date.now() + '_' + i,
      name: n,
      tipo: 'Individual',
      group: batchGroup,
      status: 'pending',
      adults: 1,
      kids: 0,
      kidsFree: 0,
      kidsPaying: 0,
      isPaying: true,
      diet: '',
      msg: ''
    }));
    onBatch(items);
    setBatch('');
    setTab('list');
  };

  const clearAll = () => {
    if (window.confirm('Tem certeza que deseja zerar e limpar todos os convidados da lista?')) {
      if (onClearAll) onClearAll();
      else if (onReset) onReset([]);
    }
  };

  const exportCsv = () => {
    const rows = [['Tipo', 'Nome', 'Categoria', 'Status', 'Pagante?', 'Adultos', 'Crianças', 'Obs'].join(';')];
    guests.forEach(g => {
      const isPaganteStr = g.isPaying === false ? 'Não (Criança <2 anos)' : 'Sim';
      rows.push([
        `"${g.tipo || 'Individual'}"`,
        `"${g.name}"`,
        `"${g.group || 'Geral'}"`,
        g.status === 'confirmed' ? 'Confirmado' : g.status === 'declined' ? 'Recusado' : 'Pendente',
        `"${isPaganteStr}"`,
        g.adults || 0,
        g.kids || 0,
        `"${g.msg || ''}"`
      ].join(';'));
    });
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lista_buffet_zoe_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const copyWa = () => {
    let t = `🎂 *RELATÓRIO DE PRESENÇAS - 1º ANO DA ZOE*\n📅 ${event.date} às ${event.time}\n📍 ${event.venue}\n\n`;
    t += `📊 *RESUMO DO BUFFET:*\n`;
    t += `• Total de Convidados: ${totalGuestsCount}\n`;
    t += `• ✅ Confirmados: ${confirmedTotalPeople} pessoas\n`;
    t += `  ↳ Pagantes Confirmados: ${confirmedPaying}\n`;
    if (confirmedFreeKids > 0) t += `  ↳ Crianças até 2 anos (Isentas): ${confirmedFreeKids}\n`;
    t += `• ⏳ Pendentes: ${pending.length}\n`;
    t += `• ❌ Recusados: ${declined.length}\n\n`;
    
    t += `*LISTA DE CONFIRMADOS (${confirmed.length}):*\n`;
    confirmed.forEach((g, i) => {
      const tag = g.isPaying === false ? ' [Criança <2a]' : '';
      t += `${i + 1}. ${g.name} (${g.group})${tag}${g.msg ? ` - Obs: "${g.msg}"` : ''}\n`;
    });

    if (pending.length > 0) {
      t += `\n*PENDENTES (${pending.length}):*\n`;
      pending.forEach(g => { t += `• ${g.name} (${g.group})\n`; });
    }

    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareMsg = `Olá! Você é nosso convidado especial para o *1º Aninho da Zoe*! 🎂✨\n\n📅 ${event.date} às ${event.time}\n📍 ${event.venue}\n\nConfirme sua presença:\n👉 https://zoe1ano.vercel.app\n\nEsperamos você com carinho! ❤️`;
  const copyShare = () => { navigator.clipboard.writeText(shareMsg); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2500); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 980 }}>
        <button onClick={onClose} className="modal-close"><X size={16} /></button>

        {!auth ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gold-bg)', color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Área dos Pais</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>Digite a senha para acessar.</p>
            <form onSubmit={login} style={{ maxWidth: 280, margin: '0 auto' }}>
              <div className="field">
                <input type="password" placeholder="Senha" value={pw} onChange={e => setPw(e.target.value)} autoFocus style={{ textAlign: 'center' }} />
              </div>
              {err && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>Senha incorreta.</p>}
              <button type="submit" className="btn btn-gold btn-block">Entrar</button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>Painel da Zoe ✨</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Gerenciamento e controle de pagantes do buffet</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[['list', Users, 'Convidados'], ['batch', FileText, 'Importar'], ['share', Share2, 'WhatsApp']].map(([k, Icon, label]) => (
                  <button key={k} onClick={() => setTab(k)} className={`btn btn-sm ${tab === k ? 'btn-dark' : 'btn-outline'}`}>
                    <Icon size={13} /><span className="nav-hide">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {tab === 'list' && (
              <>
                {/* ─── Cards do Dashboard com Pagantes e Não Pagantes ─── */}
                <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
                  <div className="stat" style={{ borderLeft: '3px solid var(--gold)' }}>
                    <div className="stat-num" style={{ color: 'var(--gold-dark)' }}>{totalGuestsCount}</div>
                    <div className="stat-lab">Total Lista</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{totalPayingPredicted} Pagantes</div>
                  </div>

                  <div className="stat" style={{ borderLeft: '3px solid var(--green)' }}>
                    <div className="stat-num" style={{ color: 'var(--green)' }}>{confirmedPaying}</div>
                    <div className="stat-lab">Pagantes Confirmados</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>de {totalPayingPredicted} previstos</div>
                  </div>

                  <div className="stat" style={{ borderLeft: '3px solid #7B9E89' }}>
                    <div className="stat-num" style={{ color: '#4A6357' }}>{confirmedFreeKids}</div>
                    <div className="stat-lab">Crianças &lt; 2 anos</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Não pagantes ({totalFreeKids} total)</div>
                  </div>

                  <div className="stat">
                    <div className="stat-num" style={{ color: 'var(--text)' }}>{confirmedTotalPeople}</div>
                    <div className="stat-lab">Total Confirmados</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{confirmedPaying}P + {confirmedFreeKids}NP</div>
                  </div>

                  <div className="stat" style={{ borderLeft: '3px solid #D4AF37' }}>
                    <div className="stat-num" style={{ color: '#8A6D50' }}>{pending.length}</div>
                    <div className="stat-lab">Pendentes</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>aguardando resposta</div>
                  </div>

                  <div className="stat" style={{ borderLeft: '3px solid var(--red)' }}>
                    <div className="stat-num" style={{ color: 'var(--red)' }}>{declined.length}</div>
                    <div className="stat-lab">Recusados</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>não irão</div>
                  </div>
                </div>

                {/* ─── Barra de Ações & Filtros ─── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={copyWa} className="btn btn-outline btn-sm">
                      {copied ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                      {copied ? 'Copiado!' : 'Relatório WhatsApp'}
                    </button>
                    <button onClick={exportCsv} className="btn btn-outline btn-sm"><Download size={13} /> Exportar Planilha</button>
                    {guests.length > 0 && (
                      <button onClick={clearAll} className="btn btn-outline btn-sm" style={{ color: 'var(--red)' }} title="Zerar lista inteira">
                        <Trash2 size={13} /> Limpar Tudo
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {/* Filtro de Categoria */}
                    <select 
                      value={groupFilter} 
                      onChange={e => setGroupFilter(e.target.value)}
                      style={{ padding: '4px 10px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: '#fff', fontSize: 12, color: 'var(--text)' }}
                    >
                      {availableGroups.map(g => (
                        <option key={g} value={g}>{g === 'all' ? 'Todas Categorias' : g}</option>
                      ))}
                    </select>

                    {/* Filtro de Status */}
                    {['all', 'confirmed', 'declined', 'pending'].map(s => (
                      <button key={s} onClick={() => setFilter(s)}
                        style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: filter === s ? 'var(--text)' : 'var(--bg)', color: filter === s ? '#fff' : 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        {s === 'all' ? 'Todos' : s === 'confirmed' ? '✅' : s === 'declined' ? '❌' : '⏳'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Adicionar Convidado Manual ─── */}
                <form onSubmit={addOne} style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                  <input className="search-input" style={{ flex: 3, minWidth: 160, paddingLeft: 14 }} placeholder="Nome completo do convidado..." value={name} onChange={e => setName(e.target.value)} />
                  <select style={{ flex: 1.5, minWidth: 110, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 13, background: '#fff', fontFamily: 'var(--sans)' }} value={group} onChange={e => setGroup(e.target.value)}>
                    <option>Família materna</option>
                    <option>Família paterna</option>
                    <option>Padrinhos</option>
                    <option>Igreja</option>
                    <option>Trabalho</option>
                    <option>Amigos</option>
                    <option>Outros</option>
                  </select>
                  <select style={{ flex: 1, minWidth: 90, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 13, background: '#fff', fontFamily: 'var(--sans)' }} value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option>Individual</option>
                    <option>Casal</option>
                    <option>Família</option>
                  </select>
                  <select style={{ flex: 1.2, minWidth: 100, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 13, background: '#fff', fontFamily: 'var(--sans)' }} value={isAdult ? 'adult' : 'kid'} onChange={e => setIsAdult(e.target.value === 'adult')}>
                    <option value="adult">Adulto / Pagante</option>
                    <option value="kid">Criança &lt; 2a (Isenta)</option>
                  </select>
                  <button type="submit" className="btn btn-gold btn-sm"><Plus size={13} /> Adicionar</button>
                </form>

                {/* ─── Tabela Oficial de Convidados com Edição Rápida e Direta ─── */}
                <div style={{ overflowX: 'auto', maxHeight: 380, border: '1px solid var(--border)', borderRadius: 'var(--r-m)' }}>
                  <table className="tbl">
                    <thead>
                      <tr style={{ background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 3 }}>
                        <th>Tipo</th>
                        <th>Nome Convidado</th>
                        <th>Categoria / Grupo</th>
                        <th style={{ textAlign: 'center' }}>Pagante? (Clique p/ alternar)</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th>Observações</th>
                        <th style={{ textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.length > 0 ? (
                        shown.map(g => {
                          const isFreeKid = g.isPaying === false || g.kidsFree > 0;
                          return (
                            <tr key={g.id}>
                              <td>
                                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                                  {g.tipo || 'Individual'}
                                </span>
                              </td>
                              <td><strong>{g.name}</strong></td>
                              <td><span className="badge">{g.group}</span></td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => togglePaying(g)}
                                  title="Clique para alternar entre Pagante e Isento (< 2 anos)"
                                  style={{
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    background: isFreeKid ? '#E8EFEA' : 'var(--gold-bg)',
                                    color: isFreeKid ? '#3B5949' : 'var(--gold-dark)',
                                    padding: '4px 10px',
                                    borderRadius: 'var(--r-full)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {isFreeKid ? 'Isento (< 2a) 👶' : 'Pagante 💳'}
                                </button>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => cycleStatus(g)}
                                  title="Clique para alternar o status de presença"
                                  className={`pill ${g.status === 'confirmed' ? 'pill-ok' : g.status === 'declined' ? 'pill-no' : 'pill-wait'}`}
                                  style={{ border: 'none', cursor: 'pointer' }}
                                >
                                  {g.status === 'confirmed' ? '✅ Confirmado' : g.status === 'declined' ? '❌ Não irá' : '⏳ Pendente'}
                                </button>
                              </td>
                              <td style={{ maxWidth: 160, fontSize: 12, color: 'var(--text-secondary)' }}>
                                {g.msg ? <span style={{ fontStyle: 'italic', color: 'var(--text)' }}>💬 "{g.msg}"</span> : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                                  <button title="Editar Dados Completos" onClick={() => setEditingGuest(g)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gold-dark)', padding: 3 }}><Edit3 size={15} /></button>
                                  <button title="Confirmar" onClick={() => onUpdate({ ...g, status: 'confirmed' })} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--green)', padding: 3 }}><CheckCircle2 size={16} /></button>
                                  <button title="Recusar" onClick={() => onUpdate({ ...g, status: 'declined' })} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--red)', padding: 3 }}><XCircle size={16} /></button>
                                  <button title="Excluir" onClick={() => { if (confirm(`Remover "${g.name}"?`)) onDelete(g.id); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 3 }}><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                            Nenhum convidado encontrado para os filtros selecionados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'batch' && (
              <div className="fade-up">
                <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Importar Lista em Lote</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Cole os nomes do WhatsApp ou Bloco de Notas — um por linha.</p>
                <div className="field">
                  <label>Nomes (1 por linha)</label>
                  <textarea rows={8} placeholder={"Nome do Convidado ou Família\nNome 2\nNome 3\n..."} value={batch} onChange={e => setBatch(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 13 }} />
                </div>
                <div className="field">
                  <label>Categoria / Grupo</label>
                  <select value={batchGroup} onChange={e => setBatchGroup(e.target.value)}>
                    <option>Família materna</option>
                    <option>Família paterna</option>
                    <option>Padrinhos</option>
                    <option>Igreja</option>
                    <option>Trabalho</option>
                    <option>Amigos</option>
                    <option>Outros</option>
                  </select>
                </div>
                <button onClick={doBatch} className="btn btn-gold btn-block" disabled={!batch.trim()}><Plus size={14} /> Importar Nomes</button>
              </div>
            )}

            {tab === 'share' && (
              <div className="fade-up">
                <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Convite para WhatsApp</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Copie e envie nos grupos ou conversas individuais.</p>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-m)', padding: 16, marginBottom: 16, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6 }}>
                  {shareMsg}
                </div>
                <button onClick={copyShare} className="btn btn-gold btn-block">
                  {copiedShare ? <Check size={14} /> : <Copy size={14} />}
                  {copiedShare ? 'Texto do Convite Copiado!' : 'Copiar Convite Formatado'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Modal de Edição Detalhada do Convidado ─── */}
        {editingGuest && (
          <div className="overlay" style={{ zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditingGuest(null)}>
            <div className="modal" style={{ maxWidth: 460, padding: 28 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Editar Convidado</h3>
                <button onClick={() => setEditingGuest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={18} /></button>
              </div>

              <form onSubmit={saveEditedGuest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field">
                  <label>Nome do Convidado</label>
                  <input
                    value={editingGuest.name || ''}
                    onChange={e => setEditingGuest({ ...editingGuest, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="field">
                    <label>Categoria / Grupo</label>
                    <select
                      value={editingGuest.group || 'Família materna'}
                      onChange={e => setEditingGuest({ ...editingGuest, group: e.target.value })}
                    >
                      <option>Família materna</option>
                      <option>Família paterna</option>
                      <option>Padrinhos</option>
                      <option>Igreja</option>
                      <option>Trabalho</option>
                      <option>Amigos</option>
                      <option>Outros</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Tipo</label>
                    <select
                      value={editingGuest.tipo || 'Individual'}
                      onChange={e => setEditingGuest({ ...editingGuest, tipo: e.target.value })}
                    >
                      <option>Individual</option>
                      <option>Casal</option>
                      <option>Família</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="field">
                    <label>Cobrança Buffet</label>
                    <select
                      value={editingGuest.isPaying === false ? 'free' : 'paying'}
                      onChange={e => {
                        const isPay = e.target.value === 'paying';
                        setEditingGuest({
                          ...editingGuest,
                          isPaying: isPay,
                          adults: isPay ? 1 : 0,
                          kids: isPay ? 0 : 1,
                          kidsFree: isPay ? 0 : 1,
                          kidsPaying: 0
                        });
                      }}
                    >
                      <option value="paying">Pagante (Adulto / Criança 3+)</option>
                      <option value="free">Isento (Criança &lt; 2 anos)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Status de Presença</label>
                    <select
                      value={editingGuest.status || 'pending'}
                      onChange={e => setEditingGuest({ ...editingGuest, status: e.target.value })}
                    >
                      <option value="pending">⏳ Pendente</option>
                      <option value="confirmed">✅ Confirmado</option>
                      <option value="declined">❌ Não irá</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Observação / Recado</label>
                  <input
                    placeholder="Ex: Chegará mais tarde, etc..."
                    value={editingGuest.msg || ''}
                    onChange={e => setEditingGuest({ ...editingGuest, msg: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button type="button" onClick={() => setEditingGuest(null)} className="btn btn-outline" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-gold" style={{ flex: 1.5 }}>
                    <Save size={15} /> Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
