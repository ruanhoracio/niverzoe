-- TABELA DE CONVIDADOS E CONFIRMAÇÃO DE PRESENÇA (RSVP) DA ZOE
-- Execute este script no SQL Editor do seu Supabase (https://supabase.com/dashboard/project/okxseyoivxubvmgcbwxn/sql)

create table if not exists public.guests (
  id text primary key,
  name text not null,
  group_name text default 'Convidados',
  status text default 'pending',
  adults integer default 1,
  kids integer default 0,
  diet text default '',
  msg text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.guests enable row level security;

-- Política de leitura pública (qualquer convidado ou painel pode consultar)
create policy "Permitir leitura pública de convidados" 
on public.guests for select 
using (true);

-- Política de inserção pública (convidados e pais podem cadastrar)
create policy "Permitir inserção pública de convidados" 
on public.guests for insert 
with check (true);

-- Política de atualização pública (convidados e pais podem confirmar presença)
create policy "Permitir atualização pública de convidados" 
on public.guests for update 
using (true);

-- Política de exclusão pública (painel dos pais pode remover)
create policy "Permitir exclusão pública de convidados" 
on public.guests for delete 
using (true);

-- Habilitar publicação em tempo real para sincronização instantânea entre celulares
alter publication supabase_realtime add table public.guests;
