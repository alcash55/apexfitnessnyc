import { pageMetadata } from '@/lib/metadata';
import PasswordForm from '../password-form';

export const metadata = pageMetadata({
  title: 'Set Your Password | ApexFitnessNYC',
  description: 'Set your password to finish setting up or recovering your APEX account.',
  path: '/account/set-password',
  privatePage: true,
});

/**
 * LEARNING A4: Set password. Intended access: Verified invite/recovery session.
 *
 * The current comment assumes a callback already established a session; prove that assumption
 * for the actual email template. Check identity here and handle expired/reused links explicitly.
 * Setting a password does not establish client/admin membership by itself.
 *
 * Verify: Test invite and recovery links separately, including opening an invite in a fresh
 * browser.
 *
 * @see docs/learning/01-supabase-auth.md
 * @see docs/learning/03-route-map.md
 */
export default function SetPasswordPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Welcome</div>
        <h2 className="section-h2">Set Your Password</h2>
        <p className="section-sub" style={{ marginBottom: '3rem' }}>
          Choose a password to finish setting up your account.
        </p>

        <PasswordForm redirectTo="/account" />
      </div>
    </div>
  );
}
