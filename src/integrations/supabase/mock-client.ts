
import { supabase } from './client';

// Define common return types for our mock client
interface MockResponse<T = any> {
  data: T | null;
  error: any | null;
}

// Type for query builder methods
type QueryMethod = 'eq' | 'neq' | 'in' | 'order' | 'limit' | 'single';

class MockQueryBuilder {
  private tableName: string;
  private methods: Array<{
    name: QueryMethod;
    args: any[];
  }> = [];

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Generic method to add a query method and return this builder
  private addMethod(name: QueryMethod, ...args: any[]): MockQueryBuilder {
    this.methods.push({ name, args });
    return this;
  }

  // Select method
  select(query?: string): MockQueryBuilder {
    return this.addMethod('select', query);
  }

  // Filter methods
  eq(column: string, value: any): MockQueryBuilder {
    return this.addMethod('eq', column, value);
  }

  neq(column: string, value: any): MockQueryBuilder {
    return this.addMethod('neq', column, value);
  }

  in(column: string, values: any[]): MockQueryBuilder {
    return this.addMethod('in', column, values);
  }

  // Order method
  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder {
    return this.addMethod('order', column, options);
  }

  // Limit method
  limit(count: number): MockQueryBuilder {
    return this.addMethod('limit', count);
    return this;
  }

  // Single result method
  single(): MockQueryBuilder {
    return this.addMethod('single', null);
  }

  // This does all the mock query execution at the end of the chain
  async then(onFulfilled: (value: MockResponse) => any): Promise<any> {
    // In a real implementation, this would properly chain all the query methods
    // For simplicity, we'll just return a successful mock response
    try {
      // Attempt to execute the real query against Supabase
      let query = supabase.from(this.tableName);
      
      // Apply all methods in the chain
      for (const method of this.methods) {
        if (method.name === 'select') {
          query = (query as any).select(method.args[0]);
        } else if (method.name === 'eq') {
          query = (query as any).eq(method.args[0], method.args[1]);
        } else if (method.name === 'neq') {
          query = (query as any).neq(method.args[0], method.args[1]);
        } else if (method.name === 'in') {
          query = (query as any).in(method.args[0], method.args[1]);
        } else if (method.name === 'order') {
          query = (query as any).order(method.args[0], method.args[1]);
        } else if (method.name === 'limit') {
          query = (query as any).limit(method.args[0]);
        } else if (method.name === 'single') {
          query = (query as any).single();
        }
      }

      // Execute the query
      const result = await query;
      return onFulfilled(result);
    } catch (error) {
      console.error(`Error executing query on ${this.tableName}:`, error);
      const response: MockResponse = { data: null, error };
      return onFulfilled(response);
    }
  }

  // Execute methods for insert, update, upsert, delete
  async insert(values: any, options?: any): Promise<MockResponse> {
    try {
      const { data, error } = await supabase.from(this.tableName).insert(values, options);
      return { data, error };
    } catch (error) {
      console.error(`Error inserting into ${this.tableName}:`, error);
      return { data: null, error };
    }
  }

  async update(values: any): Promise<MockResponse> {
    try {
      // Apply all methods in the chain
      let query = supabase.from(this.tableName).update(values);

      for (const method of this.methods) {
        if (method.name === 'eq') {
          query = query.eq(method.args[0], method.args[1]);
        }
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return { data: null, error };
    }
  }

  async upsert(values: any, options?: any): Promise<MockResponse> {
    try {
      const { data, error } = await supabase.from(this.tableName).upsert(values, options);
      return { data, error };
    } catch (error) {
      console.error(`Error upserting into ${this.tableName}:`, error);
      return { data: null, error };
    }
  }

  async delete(): Promise<MockResponse> {
    try {
      // Apply all methods in the chain
      let query = supabase.from(this.tableName).delete();

      for (const method of this.methods) {
        if (method.name === 'eq') {
          query = query.eq(method.args[0], method.args[1]);
        }
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      return { data: null, error };
    }
  }
}

// The mock client itself
const mockClient = {
  from: (table: string) => new MockQueryBuilder(table),
  auth: supabase.auth,
  channel: (channel: string) => {
    return supabase.channel(channel);
  },
  removeChannel: supabase.removeChannel,
};

export const supabaseClient = mockClient;
