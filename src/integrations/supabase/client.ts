// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://khlsosxeakdmxjyisawb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHNvc3hlYWtkbXhqeWlzYXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDg3NjEsImV4cCI6MjA1MDAyNDc2MX0.A3yfDr9etNbDWXjzyMBobL2GZY8NA8qFUQZXRms195A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);