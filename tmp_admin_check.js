const fs = require('fs');
const crypto = require('crypto');
const { Pool } = require('pg');
const env = fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx > 0) {
    acc[line.slice(0, idx)] = line.slice(idx + 1).replace(/^'+|'+$/g, '');
  }
  return acc;
}, {});

process.env.DATABASE_URL = env.DATABASE_URL;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

function hash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

(async () => {
  try {
    await pool.query(`DO $$
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
      $$;`
    );

    const stale = await pool.query(`SELECT id, password FROM users WHERE email='admin@gudangku.com' AND (password_hash IS NULL OR password_hash = '') AND password IS NOT NULL`);
    for (const row of stale.rows) {
      await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash(row.password), row.id]);
    }

    const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position");
    console.log('users columns:', cols.rows.map(r => r.column_name));
    const res = await pool.query("SELECT id, email, role, name, password_hash, password FROM users WHERE email='admin@gudangku.com' LIMIT 1");
    console.log('admin row:', JSON.stringify(res.rows[0] || null, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
})();
