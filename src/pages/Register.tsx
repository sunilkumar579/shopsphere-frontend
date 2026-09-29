import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

type Challenge = {
  email: string;
  phone: string;
  message: string;
  debugEmailOtp?: string;
  debugSmsOtp?: string;
};

export default function Register() {
  const { register, verifyRegistration, resendRegistrationOtp, error } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [codes, setCodes] = useState({ emailOtp: '', smsOtp: '' });
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const nav = useNavigate();

  const setField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      setChallenge(await register(form));
    } catch {
      // The shared auth context displays the error.
    } finally {
      setBusy(false);
    }
  };

  const verifyCodes = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await verifyRegistration(form.email, codes.emailOtp, codes.smsOtp);
      nav('/');
    } catch {
      // The shared auth context displays the error.
    } finally {
      setBusy(false);
    }
  };

  const resendCodes = async () => {
    setResending(true);
    try {
      setChallenge(await resendRegistrationOtp(form.email));
      setCodes({ emailOtp: '', smsOtp: '' });
    } catch {
      // The shared auth context displays the error.
    } finally {
      setResending(false);
    }
  };

  const setCode = (key: keyof typeof codes, value: string) => {
    setCodes((current) => ({ ...current, [key]: value.replace(/\D/g, '').slice(0, 6) }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">MORROW <span>STUDIO</span></div>
        {challenge ? (
          <>
            <h1>Verify your details</h1>
            <p>Enter the six-digit codes sent to {challenge.email} and {challenge.phone}.</p>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={verifyCodes}>
              <label>
                Email verification code
                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={codes.emailOtp}
                  onChange={(event) => setCode('emailOtp', event.target.value)}
                  placeholder="6-digit email code"
                />
              </label>
              <label>
                SMS verification code
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={codes.smsOtp}
                  onChange={(event) => setCode('smsOtp', event.target.value)}
                  placeholder="6-digit SMS code"
                />
              </label>
              {(challenge.debugEmailOtp || challenge.debugSmsOtp) && (
                <div className="dev-otp-note" role="status">
                  Development codes — email: <b>{challenge.debugEmailOtp ?? 'sent'}</b>, SMS: <b>{challenge.debugSmsOtp ?? 'sent'}</b>
                </div>
              )}
              <button className="primary-btn full" disabled={busy}>
                {busy ? 'Verifying…' : 'Verify and create account'}
              </button>
            </form>
            <button className="text-link otp-resend" type="button" disabled={resending} onClick={resendCodes}>
              {resending ? 'Sending new codes…' : 'Resend codes'}
            </button>
            <button className="text-link otp-back" type="button" onClick={() => setChallenge(null)}>
              Back to registration details
            </button>
          </>
        ) : (
          <>
            <h1>Make it yours</h1>
            <p>Create an account to save your favourite pieces and follow your orders.</p>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={startRegistration}>
              <label>Full name<input required value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Your name" /></label>
              <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="you@example.com" /></label>
              <label>Mobile number<input required type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" minLength={10} maxLength={10} value={form.phone} onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" /></label>
              <label>Password<input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setField('password', event.target.value)} placeholder="At least 8 characters" /></label>
              <button className="primary-btn full" disabled={busy}>{busy ? 'Sending verification codes…' : 'Create account'}</button>
            </form>
          </>
        )}
        <p className="auth-bottom">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
