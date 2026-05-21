import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function ensureDefaultAdmin() {
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users(email);`);

  const staleUsers = await query(
    `SELECT id, password FROM users
     WHERE (password_hash IS NULL OR password_hash = '')
       AND password IS NOT NULL`
  );

  for (const row of staleUsers.rows) {
    await query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [hashPassword(row.password), row.id]
    );
  }

  await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ['Administrator', 'admin@gudangku.com', hashPassword('admin123'), 'ADMIN']
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    await ensureDefaultAdmin();

    const hashed = hashPassword(password);
    const result = await query(
      `SELECT id, username, name, email, role FROM users WHERE email = $1 AND password_hash = $2 LIMIT 1`,
      [email.toLowerCase(), hashed]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    const user = result.rows[0];
    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server pada login." }, { status: 500 });
  }
}
