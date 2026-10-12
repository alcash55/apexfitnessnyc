import { pageMetadata } from '@/lib/metadata';
import PasswordForm from '../password-form';

export const metadata = pageMetadata({
  title: 'Set Your Password | ApexFitnessNYC',
  description: 'Set your password to finish setting up or recovering your APEX account.',
  path: '/account/set-password',
  privatePage: true,
});

/**
 * Landing page after an invite/recovery email link. By the time this
 * renders, app/auth/callback/route.ts has already exchanged the email
 * link's code for a valid session, so this reuses the same password form as
 * app/account/password/page.tsx.
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
