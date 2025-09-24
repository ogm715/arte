import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const runtime = 'nodejs';

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const mp = new Preference(new MercadoPagoConfig({ accessToken: ACCESS_TOKEN }));

type Item = { id: string; title: string; price: number; qty: number };
type Buyer = { name?: string; email?: string; phone?: string; address?: string; zip?: string };

export async function POST(req: Request) {
  try {
    const { items, buyer } = (await req.json()) as { items: Item[]; buyer?: Buyer };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Carrito vacío' }, { status: 400 });
    }

    const body = {
      items: items.map(it => ({
        id: it.id,
        title: it.title,
        quantity: Number(it.qty) || 1,
        currency_id: 'COP',
        unit_price: Math.round(Number(it.price)),
      })),
      payer: buyer ? {
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone ? { number: buyer.phone } : undefined,
        address: buyer.address ? { street_name: buyer.address, zip_code: buyer.zip } : undefined,
      } : undefined,
      back_urls: {
        success: `${BASE_URL}/checkout?status=success`,
        pending: `${BASE_URL}/checkout?status=pending`,
        failure: `${BASE_URL}/checkout?status=failure`,
      },
      auto_return: 'approved' as const,
      statement_descriptor: 'DISIENTO ARTE',
      binary_mode: true
    };

    const pref = await mp.create({ body });
    return NextResponse.json({ ok: true, id: pref.id, init_point: pref.init_point, sandbox_init_point: pref.sandbox_init_point });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'MP API error', detail: e?.message || String(e) }, { status: 500 });
  }
}

