import React, { useState } from 'react';
import { X, Lock, Users, CheckCircle2, XCircle, Plus, Trash2, Download, Copy, Check, Share2, FileText } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, guests, onUpdate, onAdd, onDelete, onBatch, onReset, event }) {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState('list');
  const [filter, setFilter] = useState('all');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Família');
  const [batch, setBatch] = useState('');
  const [batchGroup, setBatchGroup] = useState('Convidados');
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const login = (e) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() === (event.password || 'zoe').toLowerCase()) { setAuth(true); setErr(false); }
    else setErr(true);
  };

  const confirmed = guests.filter(g => g.status === 'confirmed');
  const declined = guests.filter(g => g.status === 'declined');
  const pending = guests.filter(g => g.status === 'pending');
  const totalAdults = confirmed.reduce((a, g) => a + (Number(g.adults) || 1), 0);
  const totalKids = confirmed.reduce((a, g) => a + (Number(g.kids) || 0), 0);

  const shown = guests.filter(g => filter === 'all' || g.status === filter);

  const addOne = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: 'g_' + Date.now(), name: name.trim(), group, status: 'pending', adults: 2, kids: 0, diet: '', msg: '' });
    setName('');
  };

  const doBatch = () => {
    const lines = batch.split('\n').map(l => l.replace(/^(\d+[\.\)\-]?|\*|\-)\s*/, '').trim()).filter(Boolean);
    if (!lines.length) return;
    const items = lines.map((n, i) => ({ id: 'b_' + Date.now() + '_' + i, name: n, group: batchGroup, status: 'pending', adults: 2, kids: 0, diet: '', msg: '' }));
    onBatch(items);
    setBatch('');
    setTab('list');
  };

  const exportCsv = () => {
    const rows = [['Nome', 'Grupo', 'Status', 'Adultos', 'Crianças', 'Obs', 'Mensagem'].join(';')];
    guests.forEach(g => rows.push([`"${g.name}"`, `"${g.group}"`, g.status === 'confirmed' ? 'Confirmado' : g.status === 'declined' ? 'Recusado' : 'Pendente', g.adults || 0, g.kids || 0, `"${g.diet || ''}"`, `"${g.msg || ''}"`].join(';')));
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lista_zoe_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const copyWa = () => {
    let t = `🎂 *PRESENÇAS - ANIVERSÁRIO DA ZOE*\n📅 ${event.date} às ${event.time}\n📍 ${event.venue}\n\n`;
    t += `✅ Confirmados: ${confirmed.length} (${totalAdults} adultos + ${totalKids} crianças)\n⏳ Pendentes: ${pending.length}\n❌ Recusados: ${declined.length}\n\n`;
    t += `*CONFIRMADOS:*\n`;
    confirmed.forEach((g, i) => { t += `${i + 1}. ${g.name} (${g.adults}A${g.kids > 0 ? ` + ${g.kids}C` : ''})\n`; });
    if (pending.length) { t += `\n*PENDENTES:*\n`; pending.forEach(g => { t += `- ${g.name}\n`; }); }
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareMsg = `Olá! Você é nosso convidado especial para o *1º Aninho da Zoe*! 🎂✨\n\n📅 ${event.date} às ${event.time}\n📍 ${event.venue}\n\nConfirme sua presença:\n👉 ${window.location.origin}\n\nEsperamos você com carinho! ❤️`;
  const copyShare = () => { navigator.clipboard.writeText(shareMsg); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2500); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
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
              {err && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>Senha incorreta. Dica: <strong>zoe</strong></p>}
              <button type="submit" className="btn btn-gold btn-block">Entrar</button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>Painel da Zoe</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Gerenciamento de presenças</p>
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
                <div className="stats">
                  <div className="stat" style={{ borderLeft: '3px solid var(--gold)' }}>
                    <div className="stat-num" style={{ color: 'var(--gold-dark)' }}>{totalAdults + totalKids}</div>
                    <div className="stat-lab">Pessoas</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{totalAdults}A + {totalKids}C</div>
                  </div>
                  <div className="stat"><div className="stat-num">{guests.length}</div><div className="stat-lab">Convites</div></div>
                  <div className="stat" style={{ borderLeft: '3px solid var(--green)' }}><div className="stat-num" style={{ color: 'var(--green)' }}>{confirmed.length}</div><div className="stat-lab">Confirmados</div></div>
                  <div className="stat"><div className="stat-num" style={{ color: 'var(--text-tertiary)' }}>{pending.length}</div><div className="stat-lab">Pendentes</div></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={copyWa} className="btn btn-outline btn-sm">
                      {copied ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                      {copied ? 'Copiado!' : 'Resumo WhatsApp'}
                    </button>
                    <button onClick={exportCsv} className="btn btn-outline btn-sm"><Download size={13} /> CSV</button>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['all', 'confirmed', 'declined', 'pending'].map(s => (
                      <button key={s} onClick={() => setFilter(s)}
                        style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: filter === s ? 'var(--text)' : 'var(--bg)', color: filter === s ? '#fff' : 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        {s === 'all' ? 'Todos' : s === 'confirmed' ? '✅' : s === 'declined' ? '❌' : '⏳'}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={addOne} style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                  <input className="search-input" style={{ flex: 2, minWidth: 180, paddingLeft: 14 }} placeholder="Adicionar convidado..." value={name} onChange={e => setName(e.target.value)} />
                  <select style={{ flex: 1, minWidth: 100, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 13, background: '#fff', fontFamily: 'var(--sans)' }} value={group} onChange={e => setGroup(e.target.value)}>
                    <option>Família</option><option>Amigos</option><option>Trabalho</option><option>Outros</option>
                  </select>
                  <button type="submit" className="btn btn-gold btn-sm"><Plus size={13} /> Adicionar</button>
                </form>

                <div style={{ overflowX: 'auto', maxHeight: 340, border: '1px solid var(--border)', borderRadius: 'var(--r-m)' }}>
                  <table className="tbl">
                    <thead><tr style={{ background: 'var(--bg)' }}><th>Nome</th><th>Grupo</th><th>Status</th><th>Qt.</th><th>Obs</th><th></th></tr></thead>
                    <tbody>
                      {shown.map(g => (
                        <tr key={g.id}>
                          <td><strong>{g.name}</strong></td>
                          <td><span className="badge">{g.group}</span></td>
                          <td><span className={`pill ${g.status === 'confirmed' ? 'pill-ok' : g.status === 'declined' ? 'pill-no' : 'pill-wait'}`}>
                            {g.status === 'confirmed' ? '✅' : g.status === 'declined' ? '❌' : '⏳'}
                          </span></td>
                          <td>{g.status === 'confirmed' ? <span>{g.adults}A{g.kids > 0 ? ` +${g.kids}C` : ''}</span> : '—'}</td>
                          <td style={{ maxWidth: 140, fontSize: 12, color: 'var(--text-secondary)' }}>
                            {g.diet && <span>🍴 {g.diet} </span>}
                            {g.msg && <span style={{ fontStyle: 'italic' }}>💬 {g.msg.slice(0, 40)}{g.msg.length > 40 ? '...' : ''}</span>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 2 }}>
                              <button title="Confirmar" onClick={() => onUpdate({ ...g, status: 'confirmed', adults: g.adults || 1 })} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--green)', padding: 2 }}><CheckCircle2 size={15} /></button>
                              <button title="Recusar" onClick={() => onUpdate({ ...g, status: 'declined', adults: 0, kids: 0 })} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--red)', padding: 2 }}><XCircle size={15} /></button>
                              <button title="Excluir" onClick={() => { if (confirm(`Remover "${g.name}"?`)) onDelete(g.id); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2 }}><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                  <textarea rows={8} placeholder={"Vovô Roberto & Vovó Maria\nTia Camila\nLucas & Mariana\n..."} value={batch} onChange={e => setBatch(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 13 }} />
                </div>
                <div className="field">
                  <label>Grupo</label>
                  <select value={batchGroup} onChange={e => setBatchGroup(e.target.value)}>
                    <option>Família</option><option>Amigos</option><option>Convidados</option>
                  </select>
                </div>
                <button onClick={doBatch} className="btn btn-gold btn-block" disabled={!batch.trim()}><Plus size={14} /> Importar Nomes</button>
              </div>
            )}

            {tab === 'share' && (
              <div className="fade-up">
                <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Convite para WhatsApp</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Copie e envie nos grupos ou conversas individuais.</p>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-m)', padding: 16, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {shareMsg}
                </div>
                <button onClick={copyShare} className="btn btn-gold btn-block btn-lg">
                  {copiedShare ? <Check size={16} /> : <Copy size={16} />}
                  {copiedShare ? 'Copiado!' : 'Copiar Convite'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
