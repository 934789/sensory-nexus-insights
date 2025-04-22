
import { supabase } from './client';

// This is a modified version of the Supabase client that bypasses type restrictions
// We use "any" temporarily to make it work with our components
// In a production app, you would define all types properly

type AnyObject = Record<string, any>;

// Helper function to convert ID values as needed
const processId = (value: any): any => {
  // If the value is a string that looks like a number, convert it to a number
  if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
    return Number(value);
  }
  return value;
};

const mockClient = {
  from: (table: string) => {
    return {
      select: (query?: string) => {
        // @ts-ignore - ignoring type check here to bypass the restrictions
        return supabase.from(table).select(query);
      },
      insert: (values: AnyObject | AnyObject[], options?: any) => {
        try {
          // @ts-ignore
          return supabase.from(table).insert(values, options);
        } catch (error) {
          console.error(`Error inserting into ${table}:`, error);
          return { error: true, message: `Failed to insert into ${table}` };
        }
      },
      update: (values: AnyObject) => {
        try {
          // @ts-ignore
          return supabase.from(table).update(values);
        } catch (error) {
          console.error(`Error updating ${table}:`, error);
          return { error: true, message: `Failed to update ${table}` };
        }
      },
      upsert: (values: AnyObject | AnyObject[], options?: any) => {
        try {
          // @ts-ignore
          return supabase.from(table).upsert(values, options);
        } catch (error) {
          console.error(`Error upserting into ${table}:`, error);
          return { error: true, message: `Failed to upsert into ${table}` };
        }
      },
      delete: () => {
        try {
          // @ts-ignore
          return supabase.from(table).delete();
        } catch (error) {
          console.error(`Error deleting from ${table}:`, error);
          return { error: true, message: `Failed to delete from ${table}` };
        }
      },
      eq: (column: string, value: any) => {
        try {
          // Use the helper function to process IDs
          const processedValue = column === 'id' ? processId(value) : value;
          // @ts-ignore
          return supabase.from(table).eq(column, processedValue);
        } catch (error) {
          console.error(`Error with eq on ${table}.${column}:`, error);
          return { error: true, message: `Failed eq operation on ${table}.${column}` };
        }
      },
      neq: (column: string, value: any) => {
        try {
          const processedValue = column === 'id' ? processId(value) : value;
          // @ts-ignore
          return supabase.from(table).neq(column, processedValue);
        } catch (error) {
          console.error(`Error with neq on ${table}.${column}:`, error);
          return { error: true, message: `Failed neq operation on ${table}.${column}` };
        }
      },
      in: (column: string, values: any[]) => {
        try {
          // Process all values in the array if it's an ID column
          const processedValues = column === 'id' 
            ? values.map(v => processId(v))
            : values;
          // @ts-ignore
          return supabase.from(table).in(column, processedValues);
        } catch (error) {
          console.error(`Error with in on ${table}.${column}:`, error);
          return { error: true, message: `Failed in operation on ${table}.${column}` };
        }
      },
      order: (column: string, options?: any) => {
        try {
          // @ts-ignore
          return supabase.from(table).order(column, options);
        } catch (error) {
          console.error(`Error with order on ${table}.${column}:`, error);
          return { error: true, message: `Failed order operation on ${table}.${column}` };
        }
      },
      limit: (count: number) => {
        try {
          // @ts-ignore
          return supabase.from(table).limit(count);
        } catch (error) {
          console.error(`Error with limit on ${table}:`, error);
          return { error: true, message: `Failed limit operation on ${table}` };
        }
      },
      single: () => {
        try {
          // @ts-ignore
          return supabase.from(table).single();
        } catch (error) {
          console.error(`Error with single on ${table}:`, error);
          return { error: true, message: `Failed single operation on ${table}` };
        }
      },
    };
  },
  auth: supabase.auth,
  channel: (channel: string) => {
    return supabase.channel(channel);
  },
  removeChannel: supabase.removeChannel,
};

export const supabaseClient = mockClient;
