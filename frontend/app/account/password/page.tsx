import { pageMetadata } from '@/lib/metadata';
import PasswordForm from '../password-form';

export const metadata = pageMetadata({
  title: 'Change Password | ApexFitnessNYC',
  description: 'Change the password for your APEX account.',
  path: '/account/password',
  privatePage: true,
});

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
