import { pageMetadata } from '@/lib/metadata';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { formatDollars } from '@/lib/plans';
import InviteForm from './invite-form';
import RevokeButton from './revoke-button';
import PurgeForm from './purge-form';

export const metadata = pageMetadata({
  title: 'Client Details | ApexFitnessNYC',
  description: 'Review and manage an APEX client profile, programs, and account access.',
  privatePage: true,
});

export const dynamic = 'force-dynamic';

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  auth_user_id: string | null;
};

type HealthMetric = {
  id: string;
  recorded_date: string;
  weight: number | null;
  body_fat_percent: number | null;
  testosterone_level: number | null;
  blood_oxygenation: number | null;
  dietary_restrictions: string | null;
};

type Payment = {
  id: string;
  payment_date: string;
  amount_cents: number;
  note: string | null;
};

type OfferingHistory = {
  id: string;
  start_date: string;
  end_date: string | null;
  offerings: { name: string } | null;
};

type NutritionHistory = {
  id: string;
  start_date: string;
  end_date: string | null;
  nutrition_plans: { name: string } | null;
};

function fmtDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

/**
 * Admin client detail. Same independent admin re-check as app/admin/page.tsx
 * — middleware.ts hides /admin/* by rule, but every page under this scope
 * re-verifies before rendering, per the "defense in depth" requirement.
 */
export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const claims = await getSessionClaims();
  if (!isAdminClaims(claims)) notFound();

  const { id } = await params;
  const db = getDb();

  const [clientRes, metricsRes, paymentsRes, offeringRes, nutritionRes] = await Promise.all([
    db
      .from('clients')
      .select('id,first_name,last_name,email,phone,address,created_at,auth_user_id')
      .eq('id', id)
      .maybeSingle<Client>(),
    db
      .from('health_metrics')
      .select(
        'id,recorded_date,weight,body_fat_percent,testosterone_level,blood_oxygenation,dietary_restrictions',
      )
      .eq('client_id', id)
      .order('recorded_date', { ascending: false }),
    db
      .from('training_payments')
      .select('id,payment_date,amount_cents,note')
      .eq('client_id', id)
      .order('payment_date', { ascending: false }),
    db
      .from('client_offerings')
      .select('id,start_date,end_date,offerings(name)')
      .eq('client_id', id)
      .order('start_date', { ascending: false }),
    db
      .from('client_nutrition_plans')
      .select('id,start_date,end_date,nutrition_plans(name)')
      .eq('client_id', id)
      .order('start_date', { ascending: false }),
  ]);

  const client = clientRes.data;
  if (!client) notFound();

  const healthMetrics = (metricsRes.data ?? []) as HealthMetric[];
  const trainingPayments = (paymentsRes.data ?? []) as Payment[];
  const offerings = (offeringRes.data ?? []) as unknown as OfferingHistory[];
  const nutritionPlans = (nutritionRes.data ?? []) as unknown as NutritionHistory[];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <Link
          href="/admin"
          className="inline-block text-gold font-condensed text-[0.85rem] tracking-[0.1em] uppercase mb-8 [&:hover]:opacity-[0.8]"
        >
          <ArrowLeft size={16} className="inline-block align-middle" aria-hidden="true" /> All
          Clients
        </Link>
        <div className="section-label">Admin</div>
        <h2 className="section-h2">
          {client.first_name} {client.last_name}
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-6 max-w-[900px] my-8 mx-0 p-8 bg-charcoal [border:1px_solid_var(--border)] [&_>_div]:flex [&_>_div]:flex-col [&_>_div]:gap-[0.4rem]">
          <div>
            <span className="font-condensed text-[0.7rem] tracking-button uppercase text-gold">
              Email
            </span>
            <span>{client.email}</span>
          </div>
          <div>
            <span className="font-condensed text-[0.7rem] tracking-button uppercase text-gold">
              Phone
            </span>
            <span>{client.phone ?? '—'}</span>
          </div>
          <div>
            <span className="font-condensed text-[0.7rem] tracking-button uppercase text-gold">
              Address
            </span>
            <span>{client.address ?? '—'}</span>
          </div>
          <div>
            <span className="font-condensed text-[0.7rem] tracking-button uppercase text-gold">
              Client Since
            </span>
            <span>{fmtDate(client.created_at)}</span>
          </div>
          <div>
            <span className="font-condensed text-[0.7rem] tracking-button uppercase text-gold">
              Portal Access
            </span>
            <span
              className={
                client.auth_user_id
                  ? 'inline-block w-fit py-1 px-3 text-[0.75rem] tracking-logo uppercase font-condensed text-success [border:1px_solid_rgba(74,_222,_128,_0.3)]'
                  : 'inline-block w-fit py-1 px-3 text-[0.75rem] tracking-logo uppercase font-condensed text-muted [border:1px_solid_var(--border)]'
              }
            >
              {client.auth_user_id ? 'Linked' : 'Not linked'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 items-start mb-14">
          {!client.auth_user_id && <InviteForm clientId={client.id} initialEmail={client.email} />}
          {client.auth_user_id && <RevokeButton clientId={client.id} />}
          <PurgeForm clientId={client.id} />
        </div>

        <section className="mb-12">
          <h3 className="font-condensed tracking-[0.1em] uppercase text-cream text-[1rem] mb-4">
            Offering History
          </h3>
          {offerings.length === 0 ? (
            <p className="text-muted text-[0.9rem]">No offerings on record.</p>
          ) : (
            <Table
              unstyled
              className="w-full border-collapse text-[0.9rem] [border:1px_solid_var(--border)] [&_th]:text-left [&_th]:font-condensed [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-[0.85rem] [&_th]:px-5 [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:bg-charcoal [&_td]:py-[0.85rem] [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_tr:last-child_td]:[border-bottom:none]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Offering</TableHead>
                  <TableHead unstyled>Start</TableHead>
                  <TableHead unstyled>End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {offerings.map((o) => (
                  <TableRow unstyled key={o.id}>
                    <TableCell unstyled>{o.offerings?.name ?? '—'}</TableCell>
                    <TableCell unstyled>{fmtDate(o.start_date)}</TableCell>
                    <TableCell unstyled>{o.end_date ? fmtDate(o.end_date) : 'Active'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <section className="mb-12">
          <h3 className="font-condensed tracking-[0.1em] uppercase text-cream text-[1rem] mb-4">
            Nutrition Plan History
          </h3>
          {nutritionPlans.length === 0 ? (
            <p className="text-muted text-[0.9rem]">No nutrition plans on record.</p>
          ) : (
            <Table
              unstyled
              className="w-full border-collapse text-[0.9rem] [border:1px_solid_var(--border)] [&_th]:text-left [&_th]:font-condensed [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-[0.85rem] [&_th]:px-5 [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:bg-charcoal [&_td]:py-[0.85rem] [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_tr:last-child_td]:[border-bottom:none]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Plan</TableHead>
                  <TableHead unstyled>Start</TableHead>
                  <TableHead unstyled>End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {nutritionPlans.map((n) => (
                  <TableRow unstyled key={n.id}>
                    <TableCell unstyled>{n.nutrition_plans?.name ?? '—'}</TableCell>
                    <TableCell unstyled>{fmtDate(n.start_date)}</TableCell>
                    <TableCell unstyled>{n.end_date ? fmtDate(n.end_date) : 'Active'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <section className="mb-12">
          <h3 className="font-condensed tracking-[0.1em] uppercase text-cream text-[1rem] mb-4">
            Training Payments
          </h3>
          {trainingPayments.length === 0 ? (
            <p className="text-muted text-[0.9rem]">No payments on record.</p>
          ) : (
            <Table
              unstyled
              className="w-full border-collapse text-[0.9rem] [border:1px_solid_var(--border)] [&_th]:text-left [&_th]:font-condensed [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-[0.85rem] [&_th]:px-5 [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:bg-charcoal [&_td]:py-[0.85rem] [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_tr:last-child_td]:[border-bottom:none]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Date</TableHead>
                  <TableHead unstyled>Amount</TableHead>
                  <TableHead unstyled>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {trainingPayments.map((p) => (
                  <TableRow unstyled key={p.id}>
                    <TableCell unstyled>{fmtDate(p.payment_date)}</TableCell>
                    <TableCell unstyled>${formatDollars(p.amount_cents)}</TableCell>
                    <TableCell unstyled>{p.note ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <section className="mb-12">
          <h3 className="font-condensed tracking-[0.1em] uppercase text-cream text-[1rem] mb-4">
            Health Metrics
          </h3>
          {healthMetrics.length === 0 ? (
            <p className="text-muted text-[0.9rem]">No health metrics on record.</p>
          ) : (
            <Table
              unstyled
              className="w-full border-collapse text-[0.9rem] [border:1px_solid_var(--border)] [&_th]:text-left [&_th]:font-condensed [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-[0.85rem] [&_th]:px-5 [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:bg-charcoal [&_td]:py-[0.85rem] [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_tr:last-child_td]:[border-bottom:none]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Date</TableHead>
                  <TableHead unstyled>Weight</TableHead>
                  <TableHead unstyled>Body Fat %</TableHead>
                  <TableHead unstyled>Testosterone</TableHead>
                  <TableHead unstyled>Blood O2</TableHead>
                  <TableHead unstyled>Dietary Restrictions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {healthMetrics.map((m) => (
                  <TableRow unstyled key={m.id}>
                    <TableCell unstyled>{fmtDate(m.recorded_date)}</TableCell>
                    <TableCell unstyled>{m.weight ?? '—'}</TableCell>
                    <TableCell unstyled>{m.body_fat_percent ?? '—'}</TableCell>
                    <TableCell unstyled>{m.testosterone_level ?? '—'}</TableCell>
                    <TableCell unstyled>{m.blood_oxygenation ?? '—'}</TableCell>
                    <TableCell unstyled>{m.dietary_restrictions ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
