import { useState } from 'react';
import { Mail, Lock, User, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: { email: string; name: string }) => void;
  onGuestBypass: () => void;
}

export default function AuthPage({ onAuthSuccess, onGuestBypass }: AuthPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Common validations
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (authMode === 'login') {
        // Mock Login Credentials Audit
        if (email.toLowerCase().trim() === 'admin@alphaboard.ai' && password === 'password123') {
          setIsLoading(false);
          setSuccessMsg('Login successful! Redirecting to Research Terminal...');
          setTimeout(() => {
            onAuthSuccess({ email: 'admin@alphaboard.ai', name: 'Admin Officer' });
          }, 1000);
        } else {
          // Check if user is registered in local storage
          const usersList = JSON.parse(localStorage.getItem('alphaboard_users') || '[]');
          const matchedUser = usersList.find(
            (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
          );

          setIsLoading(false);
          if (matchedUser) {
            setSuccessMsg(`Welcome back, ${matchedUser.name}! Redirecting...`);
            setTimeout(() => {
              onAuthSuccess({ email: matchedUser.email, name: matchedUser.name });
            }, 1000);
          } else {
            setErrorMsg('Invalid email credentials or incorrect password. (Use admin@alphaboard.ai / password123)');
          }
        }
      } else {
        // Register Mode validations
        if (!name.trim()) {
          setIsLoading(false);
          setErrorMsg('Please enter your full name.');
          return;
        }

        if (password !== confirmPassword) {
          setIsLoading(false);
          setErrorMsg('Passwords do not match. Please verify.');
          return;
        }

        if (!acceptTerms) {
          setIsLoading(false);
          setErrorMsg('You must accept the terms & regulatory disclosures.');
          return;
        }

        // Mock Register process
        const usersList = JSON.parse(localStorage.getItem('alphaboard_users') || '[]');
        const exists = usersList.some((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());

        if (exists || email.toLowerCase().trim() === 'admin@alphaboard.ai') {
          setIsLoading(false);
          setErrorMsg('A user account with this email address already exists.');
          return;
        }

        // Save user
        const newUser = { name, email: email.toLowerCase().trim(), password };
        usersList.push(newUser);
        localStorage.setItem('alphaboard_users', JSON.stringify(usersList));

        setIsLoading(false);
        setSuccessMsg('Registration successful! Setting up your allocation portfolio...');
        setTimeout(() => {
          onAuthSuccess({ email: newUser.email, name: newUser.name });
        }, 1200);
      }
    }, 1200);
  };

  const handleToggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1.5rem', background: '#060810', position: 'relative', overflow: 'hidden' }}>

      {/* Background Blobs */}
      <div className="gradient-blob blob-indigo" />
      <div className="gradient-blob blob-purple" />

      {/* Glassmorphic Form Card */}
      <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'rgba(8, 12, 24, 0.75)', border: '1px solid var(--border-medium)', position: 'relative', zIndex: 10 }}>

        {/* Glowing border top */}
        <div className="glow-border-indigo" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit' }} />

        {/* Logo Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem', animation: 'float 3s infinite ease-in-out' }}>📈</span>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AlphaBoard AI Terminal
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            "Don't Ask One AI. Ask an Entire Investment Committee."
          </p>
        </div>

        {/* Auth Mode Tabs Switch */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem' }}>
          <button
            className="glass-button"
            type="button"
            style={{
              flex: 1,
              border: 'none',
              padding: '0.5rem',
              fontSize: '0.85rem',
              justifyContent: 'center',
              background: authMode === 'login' ? 'var(--color-primary-glow)' : 'transparent',
              color: authMode === 'login' ? 'var(--color-primary)' : 'var(--text-secondary)'
            }}
            onClick={handleToggleMode}
          >
            Sign In
          </button>
          <button
            className="glass-button"
            type="button"
            style={{
              flex: 1,
              border: 'none',
              padding: '0.5rem',
              fontSize: '0.85rem',
              justifyContent: 'center',
              background: authMode === 'register' ? 'var(--color-primary-glow)' : 'transparent',
              color: authMode === 'register' ? 'var(--color-primary)' : 'var(--text-secondary)'
            }}
            onClick={handleToggleMode}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.05)', borderColor: 'rgba(244, 63, 94, 0.25)', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-sell)' }}>
            <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.25)', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-buy)' }}>
            <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Input Form Fields */}
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {authMode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
                placeholder={authMode === 'login' ? 'admin@alphaboard.ai' : 'email@example.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
                placeholder={authMode === 'login' ? '•••••••• (password123)' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Accept Terms checkbox (only for Register mode) */}
          {authMode === 'register' && (
            <label className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', cursor: 'pointer', userSelect: 'none', margin: '0.25rem 0' }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                disabled={isLoading}
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                I agree to the SEC Terms and Board Regulations
              </span>
            </label>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="glass-button glass-button-primary flex-center"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex-center" style={{ gap: '0.5rem' }}>
                <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span>Processing...</span>
              </div>
            ) : (
              <span>{authMode === 'login' ? 'Sign In to Terminal' : 'Register Account'}</span>
            )}
          </button>
        </form>

        {/* Guest Mode bypass option */}
        <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            className="glass-button"
            style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem' }}
            onClick={onGuestBypass}
            disabled={isLoading}
          >
            <span>Continue as Guest (Read Only) &rarr;</span>
          </button>
        </div>

        {/* Mock user reminder helper */}
        {authMode === 'login' && (
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
            Admin login: <strong style={{ color: 'var(--color-primary)' }}>admin@alphaboard.ai</strong> / password: <strong style={{ color: 'var(--color-primary)' }}>password123</strong>
          </div>
        )}

      </div>
    </div>
  );
}
