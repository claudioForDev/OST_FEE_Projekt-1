declare module "@seald-io/nedb" {
  type Query<T> = Partial<Record<keyof T, unknown>>;

  interface UpdateOptions {
    multi?: boolean;
    upsert?: boolean;
  }

  export default class Datastore<T extends object> {
    constructor(options: { filename: string; autoload?: boolean });

    findAsync(query: Query<T>): Promise<T[]>;
    findOneAsync(query: Query<T>): Promise<T | null>;
    insertAsync(doc: Partial<T>): Promise<T>;
    updateAsync(
      query: Query<T>,
      update: { $set: Partial<T> },
      options?: UpdateOptions
    ): Promise<{ numAffected: number }>;
  }
}
