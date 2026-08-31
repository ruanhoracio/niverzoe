import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import GiftSection from './components/GiftSection';
import RsvpSection from './components/RsvpSection';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { EVENT, INITIAL_GUESTS } from './data/initialData';

const load = (key, fallback) => {
  try {
    const s = localStorage.getItem(key);
    if (!s) return fallback;
    const parsed = JSON.parse(s);
    // Remove sample mock guests if they were stored previously
    return Array.isArray(parsed) ? parsed.filter(g => !['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].includes(g.id)) : fallback;
  }
  catch { return fallback; }
};

export default function App() {
  const [guests, setGuests] = useState(() => load('zoe_guests_live', []));
  const [admin, setAdmin] = useState(false);

  useEffect(() => { localStorage.setItem('zoe_guests_live', JSON.stringify(guests)); }, [guests]);

  const updateGuest = (g) => setGuests(prev => {
    const exists = prev.some(x => x.id === g.id);
    return exists ? prev.map(x => x.id === g.id ? g : x) : [g, ...prev];
  });
  const addGuest = (g) => setGuests(prev => [g, ...prev]);
  const deleteGuest = (id) => setGuests(prev => prev.filter(g => g.id !== id));
  const batchAdd = (items) => setGuests(prev => [...items, ...prev]);
  const resetGuests = (items) => setGuests(items);
  const clearAllGuests = () => setGuests([]);

  return (
    <>
      <Navbar onAdmin={() => setAdmin(true)} />
      <main>
        <Hero event={EVENT} />
        <EventDetails event={EVENT} />
        <RsvpSection guests={guests} onUpdate={updateGuest} />
        <GiftSection />
      </main>
      <Footer onAdmin={() => setAdmin(true)} />
      <AdminModal
        isOpen={admin} onClose={() => setAdmin(false)}
        guests={guests} onUpdate={updateGuest} onAdd={addGuest}
        onDelete={deleteGuest} onBatch={batchAdd} onReset={resetGuests}
        onClearAll={clearAllGuests}
        event={EVENT}
      />
    </>
  );
}
