import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://iqkrulkbvctycogyegju.supabase.co' ;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3J1bGtidmN0eWNvZ3llZ2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjEwNTAsImV4cCI6MjA3ODc5NzA1MH0.08OU615NPxjGORs_ZvsvN_5bl5VoMyvz4Tnn0DSIXK8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);