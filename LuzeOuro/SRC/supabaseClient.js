import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://gmwzycdrksubikeenime.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtd3p5Y2Rya3N1YmlrZWVuaW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDM1MzEsImV4cCI6MjA3MzE3OTUzMX0.NV5ddKBpf6zKn0A_OIP9OOQQRMNFhroxhqXuF6PhB_0';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // evita erro no modo web
  },
  global: {
    fetch: (...args) => fetch(...args), // usa o fetch nativo (funciona em web e RN)
  },
});
