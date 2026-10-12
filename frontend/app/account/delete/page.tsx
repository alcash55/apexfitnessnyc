import { pageMetadata } from '@/lib/metadata';
import DeleteAccountForm from './delete-form';

export const metadata = pageMetadata({
  title: 'Delete Account | ApexFitnessNYC',
  description: 'Manage the permanent deactivation of your APEX account.',
  path: '/account/delete',
  privatePage: true,
});

export default function DeleteAccountPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Account</div>
        <h2 className="section-h2">Delete Account</h2>
        <p className="section-sub" style={{ marginBottom: '2rem' }}>
          This deactivates your login — it is permanent and cannot be undone from here.
        </p>

        <div
          className="mt-16 p-8 [border:1px_solid_rgba(248,_113,_113,_0.3)] max-w-[860px] [&_h3]:font-condensed [&_h3]:tracking-[0.1em] [&_h3]:uppercase [&_h3]:text-error [&_h3]:text-[1rem] [&_h3]:mb-4 [&_p]:text-muted [&_p]:text-[0.9rem] [&_p]:leading-[1.6] [&_p]:mb-3"
          style={{ marginTop: 0 }}
        >
          <h3>What happens</h3>
          <p>You will be signed out immediately and will no longer be able to log in.</p>
          <p>
            Your payment history and health/training records are <strong>not deleted</strong> — they
            stay on file, consistent with our{' '}
            <a href="/privacy" style={{ color: 'var(--gold)' }}>
              Privacy Policy
            </a>
            .
          </p>
          <p>If you want access again, your coach will need to send you a new invite.</p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
