import { pageMetadata } from '@/lib/metadata';
import PasswordForm from '../password-form';

export const metadata = pageMetadata({
  title: 'Change Password | ApexFitnessNYC',
  description: 'Change the password for your APEX account.',
  path: '/account/password',
  privatePage: true,
});

/**
 * LEARNING A4: Change password. Intended access: Authenticated identity.
 *
 * Proxy currently provides the navigation guard. Add/verify a server identity check on this
 * entry point and use Supabase Auth for the password change, never a custom password column.
 * Require suitable recent authentication according to the chosen Auth settings.
 *
 * Verify: A signed-out request cannot use the password form; a valid user can change and
 * reauthenticate.
 *
 * @see docs/learning/01-supabase-auth.md
 * @see docs/learning/03-route-map.md
 */
export default function ChangePasswordPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="section-label">Account</div>
        <h2 className="section-h2">Change Password</h2>
        <p className="section-sub" style={{ marginBottom: '3rem' }}>
          Choose a new password for your account.
        </p>

        <PasswordForm redirectTo="/account" />
      </div>
    </div>
  );
}
