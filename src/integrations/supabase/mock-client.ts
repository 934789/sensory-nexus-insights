
import { supabase } from './client';

// Define common return types for our mock client
interface MockResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Simple mock implementation that wraps the actual Supabase client
// but provides safety against type errors
class SafeSupabaseMock {
  private client;
  
  constructor() {
    this.client = supabase;
  }

  // Safe from() method that won't cause type errors
  from(table: string) {
    return new TableQueryBuilder(this.client, table);
  }

  // Pass through auth methods directly
  get auth() {
    return this.client.auth;
  }

  // Pass through channel methods
  channel(channel: string) {
    return this.client.channel(channel);
  }

  removeChannel = this.client.removeChannel;
}

// Builder for table operations that handles type safety
class TableQueryBuilder {
  private client;
  private tableName: string;
  private queryFilters: Array<{method: string, args: any[]}> = [];

  constructor(client: any, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  // Select method
  select(columns?: string) {
    this.queryFilters.push({method: 'select', args: [columns]});
    return this;
  }

  // Filter by equality
  eq(column: string, value: any) {
    this.queryFilters.push({method: 'eq', args: [column, value]});
    return this;
  }

  // Filter by inequality
  neq(column: string, value: any) {
    this.queryFilters.push({method: 'neq', args: [column, value]});
    return this;
  }

  // Filter by "in" values
  in(column: string, values: any[]) {
    this.queryFilters.push({method: 'in', args: [column, values]});
    return this;
  }

  // Order results
  order(column: string, options?: { ascending?: boolean }) {
    this.queryFilters.push({method: 'order', args: [column, options]});
    return this;
  }

  // Limit results
  limit(count: number) {
    this.queryFilters.push({method: 'limit', args: [count]});
    return this;
  }

  // Get single result
  single() {
    this.queryFilters.push({method: 'single', args: []});
    return this;
  }

  // Execute the query by applying all filters
  async then(onFulfilled: (value: MockResponse) => any): Promise<any> {
    try {
      // Start with the base query
      let query = this.client.from(this.tableName);
      
      // Apply all stored filters in order
      for (const filter of this.queryFilters) {
        if (typeof query[filter.method] === 'function') {
          query = query[filter.method](...filter.args);
        }
      }

      // Execute the query against the real Supabase client
      const result = await query;
      return onFulfilled(result);
    } catch (error) {
      console.error(`Error executing query on ${this.tableName}:`, error);
      const mockError = error instanceof Error ? error : new Error(String(error));
      const response: MockResponse = { data: null, error: mockError };
      return onFulfilled(response);
    }
  }

  // Insert data
  async insert(values: any, options?: any): Promise<MockResponse> {
    try {
      const result = await this.client.from(this.tableName).insert(values, options);
      return result;
    } catch (error) {
      console.error(`Error inserting into ${this.tableName}:`, error);
      const mockError = error instanceof Error ? error : new Error(String(error));
      return { data: null, error: mockError };
    }
  }

  // Update data
  async update(values: any): Promise<MockResponse> {
    try {
      let query = this.client.from(this.tableName).update(values);
      
      // Apply any eq filters
      for (const filter of this.queryFilters) {
        if (filter.method === 'eq' && typeof query.eq === 'function') {
          query = query.eq(filter.args[0], filter.args[1]);
        }
      }
      
      return await query;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      const mockError = error instanceof Error ? error : new Error(String(error));
      return { data: null, error: mockError };
    }
  }

  // Upsert data
  async upsert(values: any, options?: any): Promise<MockResponse> {
    try {
      const result = await this.client.from(this.tableName).upsert(values, options);
      return result;
    } catch (error) {
      console.error(`Error upserting into ${this.tableName}:`, error);
      const mockError = error instanceof Error ? error : new Error(String(error));
      return { data: null, error: mockError };
    }
  }

  // Delete data
  async delete(): Promise<MockResponse> {
    try {
      let query = this.client.from(this.tableName).delete();
      
      // Apply any eq filters
      for (const filter of this.queryFilters) {
        if (filter.method === 'eq' && typeof query.eq === 'function') {
          query = query.eq(filter.args[0], filter.args[1]);
        }
      }
      
      return await query;
    } catch (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      const mockError = error instanceof Error ? error : new Error(String(error));
      return { data: null, error: mockError };
    }
  }
}

// Create and export the mock client instance
export const supabaseClient = new SafeSupabaseMock();
