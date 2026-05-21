import { WaitlistForm } from './_components/WaitlistForm'

export default function HomePage() {
  return (
    <>
      <style>{`
        /* ─── Reset & Base ─────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0A0A0A;
          color: #FAFAFA;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ─── Animations ───────────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .fade-up-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .fade-up-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .fade-up-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .fade-up-4 { animation: fadeUp 0.7s ease both 0.55s; }

        .float-anim { animation: float 3s ease-in-out infinite; }

        /* ─── Waitlist form (shared) ───────────────────────── */
        .waitlist-form-inline,
        .waitlist-form-card {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .waitlist-form-card { flex-direction: column; align-items: stretch; }

        .waitlist-input {
          flex: 1;
          min-width: 220px;
          background: #111111;
          border: 1px solid #333;
          color: #FAFAFA;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }
        .waitlist-input:focus { border-color: #6366F1; }
        .waitlist-input::placeholder { color: #71717A; }

        .waitlist-btn-primary {
          background: #6366F1;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.1s;
        }
        .waitlist-btn-primary:hover { background: #5254CC; }
        .waitlist-btn-primary:active { transform: scale(0.98); }
        .waitlist-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .waitlist-btn-pulse { animation: pulse-glow 2.5s ease-in-out infinite; }
        .waitlist-btn-pulse:hover { animation: none; }

        .waitlist-error { color: #EF4444; font-size: 13px; width: 100%; }

        .waitlist-success {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .waitlist-success .success-icon { font-size: 28px; }
        .waitlist-success p { font-size: 16px; font-weight: 500; }
        .waitlist-success .success-sub { font-size: 13px; color: #71717A; }

        /* ─── NAV ──────────────────────────────────────────── */
        .lp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid #1A1A1A;
          position: sticky;
          top: 0;
          background: rgba(10,10,10,0.9);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .lp-wordmark {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #FAFAFA;
          text-decoration: none;
        }
        .lp-wordmark span { color: #6366F1; }
        .lp-nav-actions { display: flex; gap: 12px; align-items: center; }
        .nav-link {
          color: #71717A;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #FAFAFA; }
        .nav-cta {
          background: #6366F1;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: #5254CC; }

        /* ─── HERO ─────────────────────────────────────────── */
        .lp-hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 100px 40px 80px;
          text-align: center;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.3);
          color: #A5B4FC;
          font-size: 13px;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .hero-h1 {
          font-size: clamp(44px, 7vw, 80px);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #FAFAFA 0%, #A1A1AA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-h1 .brand-word { -webkit-text-fill-color: #6366F1; background: none; }
        .hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          color: #71717A;
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 60px;
        }
        .btn-primary {
          background: #6366F1;
          color: #fff;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          transition: background 0.2s, transform 0.1s;
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .btn-primary:hover { background: #5254CC; animation: none; }
        .btn-secondary {
          background: transparent;
          border: 1px solid #333;
          color: #FAFAFA;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          transition: border-color 0.2s;
        }
        .btn-secondary:hover { border-color: #6366F1; }

        .hero-platforms {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          align-items: center;
          color: #71717A;
          font-size: 13px;
        }
        .hero-platforms span { color: #444; }
        .platform-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #111111;
          border: 1px solid #222;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          color: #A1A1AA;
        }

        /* ─── PROBLEM ──────────────────────────────────────── */
        .lp-section { padding: 100px 40px; }
        .lp-section-inner { max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6366F1;
          margin-bottom: 16px;
        }
        .section-h2 {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .section-sub {
          font-size: 17px;
          color: #71717A;
          max-width: 520px;
          line-height: 1.7;
        }

        .problem-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .problem-stats { display: flex; flex-direction: column; gap: 32px; }
        .stat-item {}
        .stat-number {
          font-size: 52px;
          font-weight: 900;
          letter-spacing: -2px;
          color: #6366F1;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-desc { color: #A1A1AA; font-size: 15px; line-height: 1.5; }

        /* Chaotic desk SVG illustration */
        .problem-visual {
          background: #111111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 32px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .chaos-items {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .chaos-card {
          position: absolute;
          background: #1A1A1A;
          border: 1px solid #2A2A2A;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          color: #71717A;
          white-space: nowrap;
        }
        .chaos-card.red { border-color: #EF444433; color: #EF4444; }
        .chaos-card.yellow { border-color: #F59E0B33; color: #F59E0B; }

        /* ─── SOLUTION ─────────────────────────────────────── */
        .solution-bg { background: #0D0D0D; }

        .feature-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
        }
        .feature-card {
          background: #111111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 32px 28px;
          transition: border-color 0.2s, transform 0.2s;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s;
        }
        .feature-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-card:hover { border-color: #6366F1; }
        .feature-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #6366F1;
          margin-bottom: 16px;
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 16px;
          display: block;
        }
        .feature-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .feature-desc { color: #71717A; font-size: 15px; line-height: 1.65; }

        /* ─── DASHBOARD MOCKUP ─────────────────────────────── */
        .dashboard-section { background: #080808; }
        .dashboard-wrap {
          max-width: 900px;
          margin: 60px auto 0;
        }
        .dashboard-mockup {
          background: #111111;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(99,102,241,0.08), 0 0 0 1px #1A1A1A;
        }
        .mock-titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #0D0D0D;
          border-bottom: 1px solid #1E1E1E;
        }
        .mock-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
        }
        .mock-dot-r { background: #EF4444; }
        .mock-dot-y { background: #F59E0B; }
        .mock-dot-g { background: #22C55E; }
        .mock-url {
          flex: 1;
          background: #1A1A1A;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 12px;
          color: #555;
          text-align: center;
        }

        .mock-nav {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 24px;
          border-bottom: 1px solid #1E1E1E;
          background: #0D0D0D;
        }
        .mock-nav-brand {
          font-size: 14px;
          font-weight: 800;
          color: #6366F1;
          padding: 14px 0;
          margin-right: 24px;
        }
        .mock-nav-item {
          font-size: 13px;
          color: #555;
          padding: 14px 16px;
          cursor: default;
          border-bottom: 2px solid transparent;
        }
        .mock-nav-item.active { color: #FAFAFA; border-bottom-color: #6366F1; }

        .mock-body { padding: 24px; }

        .mock-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .mock-stat {
          background: #0D0D0D;
          border: 1px solid #1E1E1E;
          border-radius: 10px;
          padding: 16px;
        }
        .mock-stat-label { font-size: 11px; color: #555; margin-bottom: 6px; }
        .mock-stat-value { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .mock-stat-value.green { color: #22C55E; }
        .mock-stat-value.yellow { color: #F59E0B; }

        .mock-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .mock-filter-chip {
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid transparent;
        }
        .chip-negotiating { background: rgba(99,102,241,0.12); color: #6366F1; border-color: rgba(99,102,241,0.3); }
        .chip-contracted  { background: rgba(59,130,246,0.12); color: #3B82F6; border-color: rgba(59,130,246,0.3); }
        .chip-live        { background: rgba(34,197,94,0.12);  color: #22C55E; border-color: rgba(34,197,94,0.3); }
        .chip-invoiced    { background: rgba(168,85,247,0.12); color: #A855F7; border-color: rgba(168,85,247,0.3); }
        .chip-paid        { background: rgba(16,185,129,0.12); color: #10B981; border-color: rgba(16,185,129,0.3); }

        .mock-deals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .mock-deal-card {
          background: #0D0D0D;
          border: 1px solid #1E1E1E;
          border-radius: 10px;
          padding: 14px;
        }
        .mock-deal-brand { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
        .mock-deal-amount { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .mock-deal-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #71717A;
        }
        .mock-deal-status .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22C55E;
        }
        .mock-deal-status .dot.yellow { background: #F59E0B; }
        .mock-deal-status .dot.blue { background: #3B82F6; }

        /* ─── PRICING ──────────────────────────────────────── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
        }
        .pricing-card {
          background: #111111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .pricing-card.visible { opacity: 1; transform: translateY(0); }
        .pricing-card.featured {
          border-color: #6366F1;
          background: linear-gradient(160deg, #111111 0%, #13113A 100%);
        }
        .pricing-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6366F1;
          margin-bottom: 16px;
          display: block;
        }
        .pricing-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .pricing-price {
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .pricing-period { font-size: 13px; color: #71717A; margin-bottom: 28px; }
        .pricing-features { list-style: none; flex: 1; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .pricing-feature { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; color: #A1A1AA; }
        .pricing-feature::before { content: '✓'; color: #22C55E; font-weight: 700; flex-shrink: 0; }
        .pricing-btn {
          display: block;
          text-align: center;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          border: 1px solid #333;
          color: #A1A1AA;
        }
        .pricing-card.featured .pricing-btn {
          background: #6366F1;
          color: #fff;
          border-color: #6366F1;
        }
        .pricing-card.featured .pricing-btn:hover { background: #5254CC; }
        .pricing-btn:hover { border-color: #6366F1; color: #FAFAFA; }

        /* ─── TESTIMONIALS ─────────────────────────────────── */
        .testimonials-bg { background: #0D0D0D; }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
        }
        .testimonial-card {
          background: #111111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 28px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .testimonial-card.visible { opacity: 1; transform: translateY(0); }
        .testimonial-quote {
          font-size: 15px;
          color: #D4D4D8;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .testimonial-quote::before { content: '"'; font-size: 32px; color: #6366F1; line-height: 0; vertical-align: -12px; margin-right: 4px; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .testimonial-handle { font-size: 13px; font-weight: 600; }
        .testimonial-meta { font-size: 12px; color: #71717A; }

        /* ─── FINAL CTA ────────────────────────────────────── */
        .cta-section {
          text-align: center;
          background: #0A0A0A;
          border-top: 1px solid #1A1A1A;
        }
        .cta-inner { max-width: 640px; margin: 0 auto; }
        .cta-h2 {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 16px;
        }
        .cta-sub { color: #71717A; font-size: 16px; margin-bottom: 40px; }
        .cta-form-wrap { max-width: 520px; margin: 0 auto 24px; }
        .cta-note { font-size: 13px; color: #555; margin-bottom: 20px; }
        .cta-social-proof { font-size: 14px; color: #71717A; }
        .cta-social-proof strong { color: #FAFAFA; }

        /* ─── FOOTER ───────────────────────────────────────── */
        .lp-footer {
          border-top: 1px solid #1A1A1A;
          padding: 40px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          font-size: 13px;
          color: #555;
        }
        .footer-left { display: flex; flex-direction: column; gap: 4px; }
        .footer-brand { font-size: 16px; font-weight: 800; color: #FAFAFA; margin-bottom: 2px; }
        .footer-tagline { color: #555; }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .footer-link { color: #555; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: #FAFAFA; }

        /* ─── Responsive ───────────────────────────────────── */
        @media (max-width: 768px) {
          .lp-nav { padding: 16px 20px; }
          .lp-hero { padding: 60px 20px 60px; }
          .lp-section { padding: 60px 20px; }
          .problem-grid { grid-template-columns: 1fr; gap: 40px; }
          .feature-cards { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .mock-stats { grid-template-columns: 1fr; }
          .mock-deals { grid-template-columns: 1fr; }
          .mock-filters { display: none; }
          .lp-footer { flex-direction: column; padding: 32px 20px; text-align: center; }
        }
      `}</style>

      <div className="lp-root">

        {/* ── NAV ─────────────────────────────────────────── */}
        <nav className="lp-nav">
          <a href="/" className="lp-wordmark">Earn<span>HQ</span></a>
          <div className="lp-nav-actions">
            <a href="/sign-in" className="nav-link">Sign in</a>
            <a href="#waitlist" className="nav-cta">Join waitlist →</a>
          </div>
        </nav>

        {/* ── SECTION 1: HERO ─────────────────────────────── */}
        <section className="lp-hero">
          <div className="hero-badge fade-up-1">✦ Now in early access</div>
          <h1 className="hero-h1 fade-up-2">
            Your brand deal<br />
            <span className="brand-word">command center.</span>
          </h1>
          <p className="hero-sub fade-up-3">
            Stop losing track of sponsorships. EarnHQ connects to your Gmail, finds every brand deal, and manages payments, invoices, and deadlines — automatically.
          </p>
          <div className="hero-actions fade-up-4">
            <a href="#waitlist" className="btn-primary">Join the waitlist →</a>
            <a href="#how-it-works" className="btn-secondary">See how it works ↓</a>
          </div>
          <div className="hero-platforms fade-up-4">
            <span>— Trusted by creators on —</span>
            <span className="platform-pill">🎥 YouTube</span>
            <span className="platform-pill">📸 Instagram</span>
            <span className="platform-pill">🎵 TikTok</span>
            <span className="platform-pill">🎙️ Podcasts</span>
          </div>
        </section>

        {/* ── SECTION 2: PROBLEM ──────────────────────────── */}
        <section className="lp-section" id="problem">
          <div className="lp-section-inner">
            <div className="problem-grid">
              <div>
                <div className="section-label">The problem</div>
                <h2 className="section-h2">You&apos;re managing 10 brand deals.<br />In chaos.</h2>
                <p className="section-sub">One spreadsheet. Multiple email threads. Invoices in Google Docs. Payments weeks late.</p>
                <div className="problem-stats" style={{ marginTop: '40px' }}>
                  <div className="stat-item">
                    <div className="stat-number">87%</div>
                    <div className="stat-desc">of creators report receiving late payments from brand partners.</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">100h</div>
                    <div className="stat-desc">per year spent on sponsorship admin — time you could spend creating.</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">3.2x</div>
                    <div className="stat-desc">more deals managed by creators who use a dedicated back-office tool.</div>
                  </div>
                </div>
              </div>
              <div className="problem-visual">
                <div className="chaos-items">
                  <div className="chaos-card" style={{ top: '8%', left: '5%', transform: 'rotate(-3deg)' }}>📊 deals_tracker_v3_FINAL.xlsx</div>
                  <div className="chaos-card red" style={{ top: '22%', right: '4%', transform: 'rotate(2deg)' }}>⚠️ Nike invoice — 45 days overdue</div>
                  <div className="chaos-card" style={{ top: '38%', left: '8%', transform: 'rotate(-1deg)' }}>📧 Re: Re: Re: contract terms...</div>
                  <div className="chaos-card yellow" style={{ top: '52%', right: '6%', transform: 'rotate(3deg)' }}>⏰ Samsung deliverable DUE TODAY</div>
                  <div className="chaos-card" style={{ top: '66%', left: '12%', transform: 'rotate(-2deg)' }}>💸 Paid? Unpaid? Check Gmail...</div>
                  <div className="chaos-card red" style={{ bottom: '8%', right: '10%', transform: 'rotate(1deg)' }}>🔴 Missing: Apple contract signed?</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: SOLUTION ─────────────────────────── */}
        <section className="lp-section solution-bg" id="how-it-works">
          <div className="lp-section-inner">
            <div className="section-label">How it works</div>
            <h2 className="section-h2">From chaos to clarity<br />in minutes.</h2>
            <div className="feature-cards" id="feature-cards">
              <div className="feature-card">
                <div className="feature-num">01</div>
                <span className="feature-icon">📬</span>
                <h3 className="feature-title">Connect Gmail</h3>
                <p className="feature-desc">One click. EarnHQ scans your inbox and finds every brand deal automatically — no manual entry.</p>
              </div>
              <div className="feature-card">
                <div className="feature-num">02</div>
                <span className="feature-icon">📋</span>
                <h3 className="feature-title">See Every Deal</h3>
                <p className="feature-desc">All your sponsorships in one dashboard. Status, deadlines, and payments — at a glance.</p>
              </div>
              <div className="feature-card">
                <div className="feature-num">03</div>
                <span className="feature-icon">💳</span>
                <h3 className="feature-title">Get Paid Faster</h3>
                <p className="feature-desc">Generate professional invoices in seconds. Automated reminders when brands go quiet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: DASHBOARD MOCKUP ─────────────────── */}
        <section className="lp-section dashboard-section">
          <div className="lp-section-inner">
            <div style={{ textAlign: 'center', marginBottom: '0' }}>
              <div className="section-label" style={{ display: 'inline-block' }}>Product preview</div>
              <h2 className="section-h2">Everything in one place.</h2>
              <p className="section-sub" style={{ margin: '0 auto' }}>A unified view of every deal, every dollar, every deadline.</p>
            </div>
            <div className="dashboard-wrap">
              <div className="dashboard-mockup float-anim">
                <div className="mock-titlebar">
                  <div className="mock-dot mock-dot-r"></div>
                  <div className="mock-dot mock-dot-y"></div>
                  <div className="mock-dot mock-dot-g"></div>
                  <div className="mock-url">app.earnhq.com/dashboard</div>
                </div>
                <div className="mock-nav">
                  <div className="mock-nav-brand">EarnHQ</div>
                  <div className="mock-nav-item active">Dashboard</div>
                  <div className="mock-nav-item">Deals</div>
                  <div className="mock-nav-item">Invoices</div>
                  <div className="mock-nav-item">Payments</div>
                </div>
                <div className="mock-body">
                  <div className="mock-stats">
                    <div className="mock-stat">
                      <div className="mock-stat-label">Pipeline value</div>
                      <div className="mock-stat-value">$24,500</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-label">Earned this year</div>
                      <div className="mock-stat-value green">$18,200</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-label">Outstanding</div>
                      <div className="mock-stat-value yellow">$6,300</div>
                    </div>
                  </div>
                  <div className="mock-filters">
                    <span className="mock-filter-chip chip-negotiating">Negotiating</span>
                    <span className="mock-filter-chip chip-contracted">Contracted</span>
                    <span className="mock-filter-chip chip-live">Live</span>
                    <span className="mock-filter-chip chip-invoiced">Invoiced</span>
                    <span className="mock-filter-chip chip-paid">Paid</span>
                  </div>
                  <div className="mock-deals">
                    <div className="mock-deal-card">
                      <div className="mock-deal-brand">Nike</div>
                      <div className="mock-deal-amount">$2,500</div>
                      <div className="mock-deal-status"><span className="dot yellow"></span>Due in 3d</div>
                    </div>
                    <div className="mock-deal-card">
                      <div className="mock-deal-brand">Samsung</div>
                      <div className="mock-deal-amount">$4,000</div>
                      <div className="mock-deal-status"><span className="dot blue"></span>Due in 7d</div>
                    </div>
                    <div className="mock-deal-card">
                      <div className="mock-deal-brand">Apple</div>
                      <div className="mock-deal-amount">$6,000</div>
                      <div className="mock-deal-status"><span className="dot"></span>Live ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: PRICING ──────────────────────────── */}
        <section className="lp-section" id="pricing">
          <div className="lp-section-inner">
            <div style={{ textAlign: 'center' }}>
              <div className="section-label" style={{ display: 'inline-block' }}>Pricing</div>
              <h2 className="section-h2">Start free. Upgrade when you&apos;re ready.</h2>
            </div>
            <div className="pricing-grid" id="pricing-grid">
              <div className="pricing-card">
                <span className="pricing-badge">Free forever</span>
                <div className="pricing-name">Free</div>
                <div className="pricing-price">$0</div>
                <div className="pricing-period">forever</div>
                <ul className="pricing-features">
                  <li className="pricing-feature">3 active deals</li>
                  <li className="pricing-feature">Manual entry</li>
                  <li className="pricing-feature">Basic dashboard</li>
                </ul>
                <a href="#waitlist" className="pricing-btn">Join waitlist</a>
              </div>
              <div className="pricing-card featured">
                <span className="pricing-badge">Most popular</span>
                <div className="pricing-name">Pro</div>
                <div className="pricing-price">$29</div>
                <div className="pricing-period">per month</div>
                <ul className="pricing-features">
                  <li className="pricing-feature">Unlimited deals</li>
                  <li className="pricing-feature">Gmail integration</li>
                  <li className="pricing-feature">Invoice generator</li>
                  <li className="pricing-feature">Payment tracking</li>
                  <li className="pricing-feature">Rate card</li>
                  <li className="pricing-feature">Overdue alerts</li>
                </ul>
                <a href="#waitlist" className="pricing-btn">Join waitlist</a>
              </div>
              <div className="pricing-card">
                <span className="pricing-badge">For agencies</span>
                <div className="pricing-name">Agency</div>
                <div className="pricing-price">$99</div>
                <div className="pricing-period">per month</div>
                <ul className="pricing-features">
                  <li className="pricing-feature">Multi-creator dashboard</li>
                  <li className="pricing-feature">White-label invoices</li>
                  <li className="pricing-feature">Team access</li>
                  <li className="pricing-feature">Priority support</li>
                  <li className="pricing-feature">Everything in Pro</li>
                </ul>
                <a href="mailto:hello@earnhq.com" className="pricing-btn">Contact us</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: SOCIAL PROOF ─────────────────────── */}
        <section className="lp-section testimonials-bg">
          <div className="lp-section-inner">
            <div style={{ textAlign: 'center' }}>
              <div className="section-label" style={{ display: 'inline-block' }}>Social proof</div>
              <h2 className="section-h2">Creators love EarnHQ.</h2>
            </div>
            <div className="testimonials-grid" id="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-quote">Finally, a tool that understands how sponsorships actually work. I can see every deal at a glance.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">C</div>
                  <div>
                    <div className="testimonial-handle">@CreatorHandle</div>
                    <div className="testimonial-meta">500K subscribers · YouTube</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-quote">I found $4,000 in unpaid invoices in the first 5 minutes. This tool paid for itself instantly.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #22C55E, #3B82F6)' }}>A</div>
                  <div>
                    <div className="testimonial-handle">@AnotherCreator</div>
                    <div className="testimonial-meta">200K subscribers · YouTube</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-quote">My manager uses EarnHQ to track all 12 of my deals. It&apos;s replaced three different spreadsheets.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>B</div>
                  <div>
                    <div className="testimonial-handle">@BigCreator</div>
                    <div className="testimonial-meta">2M followers · TikTok</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: FINAL CTA ─────────────────────────── */}
        <section className="lp-section cta-section" id="waitlist">
          <div className="lp-section-inner cta-inner">
            <h2 className="cta-h2">Ready to take control<br />of your brand deals?</h2>
            <p className="cta-sub">Join thousands of creators managing sponsorships the smart way.</p>
            <div className="cta-form-wrap">
              <WaitlistForm variant="card" />
            </div>
            <p className="cta-note">No credit card. No spam. Just EarnHQ when it&apos;s ready.</p>
            <p className="cta-social-proof">Already <strong>847 creators</strong> on the waitlist.</p>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <footer className="lp-footer">
          <div className="footer-left">
            <div className="footer-brand">EarnHQ</div>
            <div className="footer-tagline">Made for creators, by creators</div>
          </div>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="https://x.com/earnhq" className="footer-link" target="_blank" rel="noopener noreferrer">Twitter / X</a>
          </div>
          <div>© 2025 EarnHQ</div>
        </footer>

        {/* ── SCROLL ANIMATIONS ────────────────────────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var observer = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  var cards = entry.target.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
                  cards.forEach(function(card, i) {
                    setTimeout(function() { card.classList.add('visible'); }, i * 120);
                  });
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });

            ['feature-cards', 'pricing-grid', 'testimonials-grid'].forEach(function(id) {
              var el = document.getElementById(id);
              if (el) observer.observe(el);
            });
          })();
        ` }} />
      </div>
    </>
  )
}
