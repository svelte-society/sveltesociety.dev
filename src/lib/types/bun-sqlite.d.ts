declare module 'bun:sqlite' {
  export interface Database {
    prepare<T = unknown>(sql: string): Statement<T>;
    transaction<T extends (...args: any[]) => any>(fn: T): T;
    exec(sql: string): void;
    query<T = unknown>(sql: string): T[];
    close(): void;
  }

  export interface Statement<T = unknown> {
    get(...params: any[]): T;
    all(...params: any[]): T[];
    run(...params: any[]): { lastInsertRowid: number; changes: number };
    finalize(): void;
    values(...params: any[]): T[];
  }

  export class Database {
    constructor(filename: string, options?: { readonly?: boolean; create?: boolean; strict?: boolean });
    static open(filename: string): Database;
  }
} 