import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const result = await query(
    `SELECT id, product_id AS "productId", type, product_name AS "productName", category, qty, unit, user_name AS "user", role, TO_CHAR(date, 'YYYY-MM-DD') AS date
     FROM transactions
     ORDER BY id DESC`
  );

  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const { productId, type, productName, category, qty, unit, user, role, date } = body;

  if (!productId || !type || !productName || !category || !qty || !unit || !date) {
    return NextResponse.json({ error: "Missing required transaction fields." }, { status: 400 });
  }

  const updateResult = await query(
    `UPDATE products
     SET stock = GREATEST(stock + $1, 0)
     WHERE id = $2`,
    [type === "masuk" ? Number(qty) : -Number(qty), productId]
  );

  if (updateResult.rowCount === 0) {
    return NextResponse.json({ error: "Product tidak ditemukan." }, { status: 404 });
  }

  const result = await query(
    `INSERT INTO transactions (product_id, type, product_name, category, qty, unit, user_name, role, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [productId, type, productName, category, qty, unit, user || null, role || null, date]
  );

  return NextResponse.json({ id: result.rows[0].id });
}

export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID transaksi wajib diberikan." }, { status: 400 });
  }

  const transactionResult = await query(
    `SELECT id, product_id, type, qty FROM transactions WHERE id = $1 LIMIT 1`,
    [id]
  );

  if (transactionResult.rows.length === 0) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  const transaction = transactionResult.rows[0];
  const delta = transaction.type === "masuk" ? -Number(transaction.qty) : Number(transaction.qty);

  const updateResult = await query(
    `UPDATE products
     SET stock = GREATEST(stock + $1, 0)
     WHERE id = $2
     RETURNING stock`,
    [delta, transaction.product_id]
  );

  if (updateResult.rowCount === 0) {
    return NextResponse.json({ error: "Product tidak ditemukan." }, { status: 404 });
  }

  await query(`DELETE FROM transactions WHERE id = $1`, [id]);

  return NextResponse.json({
    id,
    productId: transaction.product_id,
    newStock: updateResult.rows[0].stock,
    delta,
  });
}
