-- Fallback: użytkownik może utworzyć własny profil, gdy trigger z jakiegoś powodu nie zadziałał
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);
