import { pageMetadata } from '@/lib/metadata';
import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth';
import LoginForm from './login-form';

export const metadata = pageMetadata({
  title: 'Login | ApexFitnessNYC',
  description: 'Sign in to your APEX account or request a password reset.',
  path: '/login',
  privatePage: true,
});

export const dynamic = 'force-dynamic';

/**
 * LEARNING A4: Login. Intended access: Public entry.
 *
 * The login form and server redirect already exist. Validate the untrusted next destination
 * before both the already-signed-in redirect and browser navigation. Use current authorization
 * on the destination page; a valid login alone does not prove a client link.
 *
 * Verify: Test internal return paths, external/protocol-relative next values, wrong credentials,
 * and missing config.
 *
 * @see docs/learning/01-supabase-auth.md
 * @see docs/learning/03-route-map.md
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const claims = await getSessionClaims();

  if (claims) {
    redirect(next || '/dashboard');
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 480 }}>
        <div className="section-label">Members</div>
        <h2 className="section-h2">Login</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
          Sign in to view your dashboard, track your progress, and manage your account.
        </p>

        <LoginForm next={next || '/dashboard'} />
      </div>
    </div>
  );
}
