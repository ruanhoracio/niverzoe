import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://okxseyoivxubvmgcbwxn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r-UtajADSzee8_Kge6b2dg_1XGjfh4H';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to normalize DB row -> App Guest Object
export const mapRowToGuest = (row) => ({
  id: row.id,
  name: row.name,
  tipo: row.tipo || 'Individual',
  group: row.group_name || row.group || 'Geral',
  status: row.status || 'pending',
  adults: row.adults ?? 1,
  kids: row.kids ?? 0,
  kidsFree: row.kids_free ?? row.kidsFree ?? 0,
  kidsPaying: row.kids_paying ?? row.kidsPaying ?? 0,
  isPaying: row.is_paying ?? row.isPaying ?? ((row.adults ?? 1) > 0 || (row.kids_paying ?? 0) > 0),
  totalPaying: row.total_paying ?? row.totalPaying ?? ((row.adults ?? 1) + (row.kids_paying ?? 0)),
  totalGuests: row.total_guests ?? row.totalGuests ?? ((row.adults ?? 1) + (row.kids ?? 0)),
  diet: row.diet || '',
  msg: row.msg || '',
  updatedAt: row.updated_at || row.created_at
});

// Helper to normalize App Guest Object -> DB row
export const mapGuestToRow = (g) => ({
  id: g.id,
  name: g.name,
  group_name: g.group || 'Convidados',
  status: g.status || 'pending',
  adults: Number(g.adults) ?? 1,
  kids: Number(g.kids) ?? 0,
  diet: g.diet || '',
  msg: g.msg || '',
  updated_at: new Date().toISOString()
});

// Fetch all guests from Supabase
export async function getGuestsFromDb() {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar do Supabase (usando fallback local):', error.message);
      return null;
    }
    return (data || []).map(mapRowToGuest);
  } catch (err) {
    console.warn('Erro de conexão Supabase:', err);
    return null;
  }
}

// Upsert a single guest (create or update)
export async function upsertGuestToDb(guest) {
  try {
    const row = mapGuestToRow(guest);
    const { data, error } = await supabase
      .from('guests')
      .upsert(row, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data ? mapRowToGuest(data[0]) : guest;
  } catch (err) {
    console.error('Erro ao salvar no Supabase:', err);
    return guest;
  }
}

// Batch upsert multiple guests
export async function batchUpsertGuestsToDb(guestsList) {
  try {
    const rows = guestsList.map(mapGuestToRow);
    const { data, error } = await supabase
      .from('guests')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro no batch do Supabase:', err);
    return false;
  }
}

// Delete guest
export async function deleteGuestFromDb(id) {
  try {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao deletar do Supabase:', err);
    return false;
  }
}

// Clear all guests
export async function clearAllGuestsFromDb() {
  try {
    const { error } = await supabase
      .from('guests')
      .delete()
      .neq('id', '___dummy___');

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao limpar convidados no Supabase:', err);
    return false;
  }
}
