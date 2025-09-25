import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { products } from '@/lib/products';

export const runtime = 'nodejs';

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const productMap = new Map(products.map(p => [p.id, p]));

const MAX_QTY_PER_ITEM = 10;

type Item = { id: string; title: string; price: number; qty: number };
type Buyer = { name?: string; email?: string; phone?: string; address?: string; zip?: string };

export async function POST(req: Request) {
  try {
    const { items, buyer } = (await req.json()) as { items: Item[]; buyer?: Buyer };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Carrito vacío' }, { status: 400 });
    }

    if (!ACCESS_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Configuración incompleta' }, { status: 500 });
    }

    const aggregated = new Map<string, number>();
    for (const raw of items) {
      if (!raw || typeof raw !== 'object') continue;
      const id = String(raw.id || '').trim();
      const product = productMap.get(id);
      if (!product || !product.inStock) continue;
      const qty = Number(raw.qty);
      if (!Number.isFinite(qty)) continue;
      const normalizedQty = Math.max(0, Math.floor(qty));
      if (!normalizedQty) continue;
      const current = aggregated.get(id) || 0;
      aggregated.set(id, Math.min(current + normalizedQty, MAX_QTY_PER_ITEM));
    }

    const sanitizedItems = Array.from(aggregated.entries()).map(([id, qty]) => {
      const product = productMap.get(id)!;
      return {
        id,
        title: product.title,
        quantity: qty,
        currency_id: 'COP' as const,
        unit_price: Math.round(product.price),
      };
    });

    if (sanitizedItems.length === 0) {
      return NextResponse.json({ ok: false, error: 'Carrito inválido' }, { status: 400 });
    }

    const safeBuyer = buyer && typeof buyer === 'object' ? buyer : undefined;
    const safeName = safeBuyer?.name && typeof safeBuyer.name === 'string' ? safeBuyer.name.trim() : undefined;
    const safeEmail = safeBuyer?.email && typeof safeBuyer.email === 'string' ? safeBuyer.email.trim() : undefined;
    const safePhone = safeBuyer?.phone && typeof safeBuyer.phone === 'string' ? safeBuyer.phone.trim() : undefined;
    const safeAddress = safeBuyer?.address && typeof safeBuyer.address === 'string' ? safeBuyer.address.trim() : undefined;
    const safeZip = safeBuyer?.zip && typeof safeBuyer.zip === 'string' ? safeBuyer.zip.trim() : undefined;

    const payer = (safeName || safeEmail || safePhone || safeAddress) ? {
      name: safeName,
      email: safeEmail,
      phone: safePhone ? { number: safePhone } : undefined,
      address: safeAddress ? { street_name: safeAddress, zip_code: safeZip } : undefined,
    } : undefined;

    const mp = new Preference(new MercadoPagoConfig({ accessToken: ACCESS_TOKEN }));

    const body = {
      items: sanitizedItems,
      payer,
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
