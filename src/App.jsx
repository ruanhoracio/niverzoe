import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import GiftSection from './components/GiftSection';
import RsvpSection from './components/RsvpSection';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { EVENT, INITIAL_GUESTS } from './data/initialData';
import { 
  supabase, 
  getGuestsFromDb, 
  upsertGuestToDb, 
  batchUpsertGuestsToDb, 
  deleteGuestFromDb, 
  clearAllGuestsFromDb,
  mapRowToGuest 
} from './lib/supabase';

const loadLocal = (key, fallback) => {
  try {
    const s = localStorage.getItem(key);
    if (!s) return fallback;
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) && parsed.length > 0 
      ? parsed.filter(g => !['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].includes(g.id)) 
      : fallback;
  }
  catch { return fallback; }
};

export default function App() {
  const [guests, setGuests] = useState(() => loadLocal('zoe_guests_live', INITIAL_GUESTS));
  const [admin, setAdmin] = useState(false);

  // 1. Initial Load from Supabase on mount
  useEffect(() => {
    async function loadData() {
      const dbGuests = await getGuestsFromDb();
      if (dbGuests !== null) {
        setGuests(dbGuests);
        localStorage.setItem('zoe_guests_live', JSON.stringify(dbGuests));
      }
    }
    loadData();
  }, []);

  // 2. Real-time subscription to database changes (sync across all phones/tablets)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guests' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updated = mapRowToGuest(payload.new);
            setGuests(prev => {
              const exists = prev.some(x => x.id === updated.id);
              const next = exists ? prev.map(x => x.id === updated.id ? updated : x) : [updated, ...prev];
              localStorage.setItem('zoe_guests_live', JSON.stringify(next));
              return next;
            });
          } else if (payload.eventType === 'DELETE') {
            setGuests(prev => {
              const next = prev.filter(x => x.id !== payload.old.id);
              localStorage.setItem('zoe_guests_live', JSON.stringify(next));
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync state to local storage as fallback cache
  useEffect(() => {
    localStorage.setItem('zoe_guests_live', JSON.stringify(guests));
  }, [guests]);

  // Actions (Optimistic Local UI + Supabase Cloud Sync)
  const updateGuest = async (g) => {
    setGuests(prev => {
      const exists = prev.some(x => x.id === g.id);
      return exists ? prev.map(x => x.id === g.id ? g : x) : [g, ...prev];
    });
    await upsertGuestToDb(g);
  };

  const updateMultipleGuests = async (guestsList) => {
    setGuests(prev => {
      const map = new Map(guestsList.map(g => [g.id, g]));
      return prev.map(x => map.has(x.id) ? map.get(x.id) : x);
    });
    await batchUpsertGuestsToDb(guestsList);
  };

  const addGuest = async (g) => {
    setGuests(prev => [g, ...prev]);
    await upsertGuestToDb(g);
  };

  const deleteGuest = async (id) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    await deleteGuestFromDb(id);
  };

  const batchAdd = async (items) => {
    setGuests(prev => [...items, ...prev]);
    await batchUpsertGuestsToDb(items);
  };

  const resetGuests = async (items) => {
    setGuests(items);
    await clearAllGuestsFromDb();
    if (items.length > 0) {
      await batchUpsertGuestsToDb(items);
    }
  };

  const clearAllGuests = async () => {
    setGuests([]);
    await clearAllGuestsFromDb();
  };

  return (
    <>
      <Navbar onAdmin={() => setAdmin(true)} />
      <main>
        <Hero event={EVENT} />
        <EventDetails event={EVENT} />
        <RsvpSection guests={guests} onUpdate={updateGuest} onUpdateMultiple={updateMultipleGuests} />
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
