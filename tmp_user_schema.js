const fs = require('fs');
const { Pool } = require('pg');
const env = fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx > 0) acc[line.slice(0, idx)] = line.slice(idx + 1).replace(/^'+|'+$/g, '');
  return acc;
}, {});

const pool = new Pool({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

(async () => {
  try {
    const cols = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position");
    console.log('users columns:', cols.rows);
    const constr = await pool.query("SELECT conname, contype, conkey FROM pg_constraint WHERE conrelid = 'users'::regclass");
    console.log('users constraints:', constr.rows);
    const rows = await pool.query("SELECT * FROM users LIMIT 5");
    console.log('sample rows:', rows.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
})();
