import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const defaultUsers = [
  {
    name: "Administrator",
    email: "admin@gudangku.com",
    password: "admin123",
    role: "ADMIN",
  },
];

export async function GET() {
  const result = await query(`SELECT id, name, email, role FROM users ORDER BY id ASC`);

  if (result.rows.length === 0) {
    await Promise.all(
      defaultUsers.map((user) =>
        query(
          `INSERT INTO users (name, email, password_hash, role)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO NOTHING`,
          [user.name, user.email.toLowerCase(), hashPassword(user.password), user.role]
        )
      )
    );

    const seeded = await query(`SELECT id, name, email, role FROM users ORDER BY id ASC`);
    return NextResponse.json(seeded.rows);
  }

  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const { name, email, password, role } = body;
  const normalizedEmail = email?.toLowerCase?.();

  if (!name || !normalizedEmail || !password || !role) {
    return NextResponse.json({ error: "Nama, email, password, dan role wajib diisi." }, { status: 400 });
  }

  const hashed = hashPassword(password);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name.trim(), normalizedEmail, hashed, role]
  );

  return NextResponse.json(result.rows[0]);
}
