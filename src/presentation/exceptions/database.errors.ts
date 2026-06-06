// src/shared/errors/database.errors.ts
export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: any,
    public context?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(originalError?: any, context?: string) {
    super('Failed to connect to database', originalError, context);
    this.name = 'DatabaseConnectionError';
  }
}

export class DatabaseMigrationError extends DatabaseError {
  constructor(originalError?: any, context?: string) {
    super('Database migration failed', originalError, context);
    this.name = 'DatabaseMigrationError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(
    public constraintName: string,
    public tableName: string,
    originalError?: any,
    context?: string
  ) {
    super(
      `Unique constraint violation on ${tableName} (${constraintName})`,
      originalError,
      context
    );
    this.name = 'UniqueConstraintError';
  }
}

export class SchemaSyncError extends DatabaseError {
  constructor(public operation: string, originalError?: any, context?: string) {
    super(`Schema synchronization failed during ${operation}`, originalError, context);
    this.name = 'SchemaSyncError';
  }
}