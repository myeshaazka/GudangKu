import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const initialProducts = [
  { id: "001", name: "Beras Wangi 5kg", category: "SEMBAKO", stock: 5, unit: "PACK" },
  { id: "002", name: "Minyak Goreng 2L", category: "SEMBAKO", stock: 5, unit: "PACK" },
  { id: "003", name: "Sabun Cuci Piring", category: "KEBERSIHAN", stock: 12, unit: "PACK" },
  { id: "004", name: "Tepung Terigu 1kg", category: "SEMBAKO", stock: 8, unit: "PACK" },
];

export async function GET() {
  const result = await query(
    `SELECT id, name, category, stock, unit
     FROM products
     ORDER BY id ASC`
  );

  if (result.rows.length === 0) {
    await Promise.all(
      initialProducts.map((product) =>
        query(
          `INSERT INTO products (id, name, category, stock, unit)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [product.id, product.name, product.category, product.stock, product.unit]
        )
      )
    );

    const seeded = await query(
      `SELECT id, name, category, stock, unit
       FROM products
       ORDER BY id ASC`
    );
    return NextResponse.json(seeded.rows);
  }

  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const { name, category, stock, unit } = body;
  const stockValue = Number(stock);

  if (!name || !category || !stock || Number.isNaN(stockValue) || stockValue <= 0 || !unit) {
    return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
  }

  const lastIdResult = await query(`SELECT id FROM products ORDER BY id DESC LIMIT 1`);
  const nextId = lastIdResult.rows.length ? String(Number(lastIdResult.rows[0].id) + 1).padStart(3, "0") : "001";

  const result = await query(
    `INSERT INTO products (id, name, category, stock, unit)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, category, stock, unit`,
    [nextId, name.trim(), category, stockValue, unit]
  );

  return NextResponse.json(result.rows[0]);
}

export async function PUT(request) {
  const body = await request.json();
  const { id, name, category, stock, unit } = body;
  const stockValue = Number(stock);

  if (!id || !name || !category || !stock || Number.isNaN(stockValue) || stockValue < 0 || !unit) {
    return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
  }

  const result = await query(
    `UPDATE products
     SET name = $1,
         category = $2,
         stock = $3,
         unit = $4
     WHERE id = $5
     RETURNING id, name, category, stock, unit`,
    [name.trim(), category, stockValue, unit, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Product tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID produk wajib diberikan." }, { status: 400 });
  }

  const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Product tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
