// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ukupnblhgekbwfzmvaiq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdXBuYmxoZ2VrYndmem12YWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTAzNDksImV4cCI6MjA2MzgyNjM0OX0.A6FJzTqNsLiVhrn2HOMXJi-JDEXTupZgavHH3L7u9xQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);