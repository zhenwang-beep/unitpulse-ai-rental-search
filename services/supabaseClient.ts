import { createClient } from '@supabase/supabase-js';

// Public anon credentials — safe to expose in client-side code
const SUPABASE_URL = 'https://gunthdnpdaodgyphkcfm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bnRoZG5wZGFvZGd5cGhrY2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDYxMzgsImV4cCI6MjA5MDcyMjEzOH0.7bhmqA4FrxORwFOJoeeAsJB8nCQKm0dH-MeGHOt6EHI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
