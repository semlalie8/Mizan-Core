import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg' },
    { code: 'fr', label: 'Français', flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg' },
    { code: 'ar', label: 'العربية', flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/MA.svg' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="dashboard">
      <header className="dash-header glass-panel">
        <div className="brand">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="Mizan Core Logo" className="logo-img" />
          </Link>
          <h1>{t("Mizan Core").split(' ')[0]} <span>{t("Mizan Core").split(' ')[1] || ''}</span></h1>
        </div>
        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t("Murabaha")}</Link>
          <Link to="/mudaraba" className={location.pathname === '/mudaraba' ? 'active' : ''}>{t("Mudaraba")}</Link>
          <Link to="/musharaka" className={location.pathname === '/musharaka' ? 'active' : ''}>{t("Musharaka")}</Link>
          <Link to="/ijarah" className={location.pathname === '/ijarah' ? 'active' : ''}>{t("Ijarah")}</Link>
          <Link to="/takaful" className={location.pathname === '/takaful' ? 'active' : ''}>{t("Takaful")}</Link>
          <Link to="/waqf" className={location.pathname === '/waqf' ? 'active' : ''}>{t("Waqf")}</Link>
          <Link to="/intelligence" className={location.pathname === '/intelligence' ? 'active' : ''} style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{t("AI Intelligence")}</Link>
        </nav>
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="lang-dropdown-container" style={{ position: 'relative' }}>
            <button 
              className="lang-toggle glass-panel" 
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <img src={currentLang.flag} alt="" style={{ width: '20px', height: 'auto', borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>{currentLang.code.toUpperCase()}</span>
            </button>
            
            {isLangOpen && (
              <div 
                className="lang-menu glass-panel" 
                style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 1000, background: 'rgba(20,25,35,0.98)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '6px', minWidth: '150px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
              >
                {languages.map((lang) => (
                  <div 
                    key={lang.code}
                    className="lang-item"
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', background: i18n.language === lang.code ? 'rgba(0, 202, 114, 0.12)' : 'transparent' }}
                  >
                    <img src={lang.flag} alt="" style={{ width: '18px', height: 'auto', borderRadius: '1px' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: i18n.language === lang.code ? 'var(--accent-green)' : 'var(--text-primary)' }}>{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="badge compliance-badge">
            <ShieldCheck size={14} style={{ marginRight: '4px' }} />
            {t("100% Sharia Compliant")}
          </span>
        </div>
      </header>

      <main className="dash-main">
        {children}
      </main>

      <footer className="dash-footer glass-panel">
        <div className="footer-brand">
          <img src={logo} alt="Mizan Core Logo" className="footer-logo" />
          <div className="footer-text">
            &copy; {new Date().getFullYear()} {t("Mizan Core")}. {t("All rights reserved")}.
          </div>
        </div>
        <div className="social-links">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
