import { pageMetadata } from '@/lib/metadata';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const metadata = pageMetadata({
  title: 'Client Administration | ApexFitnessNYC',
  description: 'Manage APEX clients and their program enrollments.',
  path: '/admin',
  privatePage: true,
});

export const dynamic = 'force-dynamic';

type ClientRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  auth_user_id: string | null;
  offerings: { name: string } | null;
  nutrition_plans: { name: string } | null;
};

/**
 * Admin client roster. middleware.ts already rewrites unauthenticated/
 * non-admin requests under /admin/* to a genuine 404 based on the JWT
 * claim, but this page independently re-checks (defense in depth against
 * middleware matcher gaps) before rendering anything.
 */
export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const claims = await getSessionClaims();
  if (!isAdminClaims(claims)) notFound();

  const { q } = await searchParams;
  const query = (q ?? '').trim();

  let clientsQuery = getDb()
    .from('clients')
    .select(
      'id,first_name,last_name,email,auth_user_id,offerings:current_offering_id(name),nutrition_plans:current_nutrition_plan_id(name)',
    );

  if (query) {
    // Escape characters that have special meaning inside a PostgREST
    // ilike/or filter string so a search term can't break out of it.
    const escaped = query.replace(/[%,()]/g, '');
    clientsQuery = clientsQuery.or(
      `first_name.ilike.%${escaped}%,last_name.ilike.%${escaped}%,email.ilike.%${escaped}%`,
    );
  }

  const { data, error } = await clientsQuery.order('last_name', { ascending: true });
  const clients = (data ?? []) as unknown as ClientRow[];

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Admin</div>
        <h2 className="section-h2">Clients</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
          {clients.length} client{clients.length === 1 ? '' : 's'} on file.
        </p>

        <form method="get" className="flex items-center gap-4 mb-8 flex-wrap">
          <Input
            unstyled
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email…"
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-5 font-condensed text-[0.95rem] tracking-[0.05em] min-w-[280px] placeholder:text-muted focus:[outline:none] focus:border-gold compact-down:min-w-0 compact-down:w-full"
          />
          <Button variant="unstyled" type="submit" className="btn-outline">
            Search
          </Button>
          {query && (
            <Link
              href="/admin"
              className="text-muted text-[0.85rem] tracking-[0.1em] uppercase [&:hover]:text-gold"
            >
              Clear
            </Link>
          )}
        </form>

        {error ? (
          <p className="text-error text-[0.9rem]">We couldn&apos;t load clients right now.</p>
        ) : clients.length === 0 ? (
          <p className="section-sub">No clients match your search.</p>
        ) : (
          <div className="overflow-x-auto [border:1px_solid_var(--border)]">
            <Table
              unstyled
              className="w-full border-collapse text-[0.9rem] [&_th]:text-left [&_th]:font-condensed [&_th]:text-[0.75rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-4 [&_th]:px-5 [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:bg-charcoal [&_th]:whitespace-nowrap [&_td]:py-4 [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_td]:whitespace-nowrap [&_tr:last-child_td]:[border-bottom:none] [&_tr:hover_td]:[background:rgba(200,_168,_75,_0.04)]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Name</TableHead>
                  <TableHead unstyled>Email</TableHead>
                  <TableHead unstyled>Offering</TableHead>
                  <TableHead unstyled>Nutrition Plan</TableHead>
                  <TableHead unstyled>Portal Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {clients.map((c) => (
                  <TableRow unstyled key={c.id}>
                    <TableCell unstyled>
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="text-cream font-medium [&:hover]:text-gold"
                      >
                        {c.first_name} {c.last_name}
                      </Link>
                    </TableCell>
                    <TableCell unstyled>{c.email}</TableCell>
                    <TableCell unstyled>{c.offerings?.name ?? '—'}</TableCell>
                    <TableCell unstyled>{c.nutrition_plans?.name ?? '—'}</TableCell>
                    <TableCell unstyled>
                      <span
                        className={
                          c.auth_user_id
                            ? 'inline-block py-1 px-3 text-[0.75rem] tracking-logo uppercase font-condensed text-success [border:1px_solid_rgba(74,_222,_128,_0.3)]'
                            : 'inline-block py-1 px-3 text-[0.75rem] tracking-logo uppercase font-condensed text-muted [border:1px_solid_var(--border)]'
                        }
                      >
                        {c.auth_user_id ? 'Linked' : 'Not linked'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
