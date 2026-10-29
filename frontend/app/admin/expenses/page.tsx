import { pageMetadata } from '@/lib/metadata';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { notFound } from 'next/navigation';
import { getSessionClaims, isAdminClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';
import { formatDollars } from '@/lib/plans';
import ExpenseForm from './expense-form';
import ExpenseRowActions from './expense-row-actions';

export const metadata = pageMetadata({
  title: 'Expenses | ApexFitnessNYC',
  description: 'Manage APEX business expenses and expense records.',
  path: '/admin/expenses',
  privatePage: true,
});

export const dynamic = 'force-dynamic';

type Expense = {
  id: string;
  expense_date: string;
  amount_cents: number;
  category: string | null;
  description: string | null;
};

/**
 * LEARNING A5: Admin expenses. Intended access: Current admin.
 *
 * Financial expense data requires current admin membership before the service-role read. The
 * form and row-action handlers must have their own authorization. Do not present a failed
 * database read as an empty ledger.
 *
 * Verify: An ordinary or removed admin cannot read or mutate expenses, including by direct API
 * calls.
 *
 * @see docs/learning/01-supabase-auth.md
 * @see docs/learning/03-route-map.md
 */
export default async function ExpensesPage() {
  const claims = await getSessionClaims();

  if (!isAdminClaims(claims)) notFound();

  const { data, error } = await getDb()
    .from('expenses')
    .select('id,expense_date,amount_cents,category,description')
    .order('expense_date', { ascending: false });

  const expenses = (error ? [] : data) as Expense[] | null;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="max-w-[600px] mb-12">
          <div className="section-label">Admin</div>
          <h2 className="section-h2">Business Expenses</h2>
          <p className="section-sub">
            Track rent, equipment, and supplies. This is business overhead, separate from client
            billing.
          </p>
        </div>

        <ExpenseForm />

        <div className="max-w-[1100px] overflow-x-auto [border:1px_solid_var(--border)]">
          {error ? (
            <div className="p-10 text-center text-muted">
              We couldn&apos;t load expenses right now. Please try again shortly.
            </div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="p-10 text-center text-muted">No expenses recorded yet.</div>
          ) : (
            <Table
              unstyled
              className="w-full border-collapse font-condensed [&_th]:text-left [&_th]:text-[0.7rem] [&_th]:tracking-button [&_th]:uppercase [&_th]:text-gold [&_th]:py-4 [&_th]:px-5 [&_th]:bg-charcoal [&_th]:[border-bottom:1px_solid_var(--border)] [&_th]:whitespace-nowrap [&_td]:py-4 [&_td]:px-5 [&_td]:[border-bottom:1px_solid_var(--border)] [&_td]:text-text [&_td]:text-[0.95rem] [&_td]:whitespace-nowrap [&_tbody_tr:last-child_td]:[border-bottom:none]"
            >
              <TableHeader unstyled>
                <TableRow unstyled>
                  <TableHead unstyled>Date</TableHead>
                  <TableHead unstyled>Amount</TableHead>
                  <TableHead unstyled>Category</TableHead>
                  <TableHead unstyled>Description</TableHead>
                  <TableHead unstyled></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody unstyled>
                {expenses.map((row) => (
                  <TableRow unstyled key={row.id}>
                    <TableCell unstyled>{row.expense_date}</TableCell>
                    <TableCell unstyled className="text-cream tabular-nums">
                      ${formatDollars(row.amount_cents)}
                    </TableCell>
                    <TableCell unstyled>{row.category || '—'}</TableCell>
                    <TableCell unstyled>{row.description || '—'}</TableCell>
                    <TableCell unstyled>
                      <ExpenseRowActions id={row.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
