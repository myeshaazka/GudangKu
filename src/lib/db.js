import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

let initPromise;

async function ensureSchema() {
  if (!initPromise) {
    initPromise = Promise.all([
      pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `),
      pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users(email);
      `),
      pool.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'id_user'
          ) AND NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'id'
          ) THEN
            EXECUTE 'ALTER TABLE users RENAME COLUMN id_user TO id';
          END IF;
        END
        $$;`),
      pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          stock INTEGER NOT NULL,
          unit TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `),
      pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id BIGSERIAL PRIMARY KEY,
          product_id TEXT REFERENCES products(id),
          type TEXT NOT NULL,
          product_name TEXT NOT NULL,
          category TEXT NOT NULL,
          qty INTEGER NOT NULL,
          unit TEXT NOT NULL,
          user_name TEXT,
          role TEXT,
          date DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `),
      pool.query(`
        ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Administrator';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL DEFAULT 'admin@gudangku.com';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'ADMIN';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;
      `),
      pool.query(`
        ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'PCS';
      `),
      pool.query(`
        ALTER TABLE IF EXISTS transactions ADD COLUMN IF NOT EXISTS product_id TEXT REFERENCES products(id);
      `),
      pool.query(`
        ALTER TABLE IF EXISTS transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
      `),
    ]);
  }
  await initPromise;
}

export async function query(text, params) {
  await ensureSchema();
  return pool.query(text, params);
}

export default pool;