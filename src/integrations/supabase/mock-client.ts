
import { supabase } from './client';

// This is a type-safe wrapper for Supabase that works around the type limitations
// We're using any type here temporarily to make it work with our component code
// In a production app, you would properly define all these types

const mockClient = {
  from: (table: string) => {
    // Return the original client but with type assertions
    return supabase.from(table as any);
  },
  auth: supabase.auth,
  channel: (channel: string) => {
    return supabase.channel(channel);
  },
  removeChannel: supabase.removeChannel,
};

export const supabaseClient = mockClient;
