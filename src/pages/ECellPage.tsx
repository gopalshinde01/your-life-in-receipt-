import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export interface ECellPageProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ECellPage: React.FC<ECellPageProps> = ({ onShowToast = () => {} }) => {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantBranch, setApplicantBranch] = useState('Computer Science & Engg');
  const [applicantRole, setApplicantRole] = useState('Technical & Full Stack');
  const [applicantPitch, setApplicantPitch] = useState('');

  // Random particles for realistic floating embers effect
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 37) % 96}%`,
      top: `${(i * 29) % 85}%`,
      size: `${(i % 3) * 2 + 3}px`,
      duration: `${4 + (i % 5) * 1.5}s`,
      delay: `${(i % 7) * 0.7}s`,
      opacity: (i % 4) === 0 ? 0.85 : (i % 2) === 0 ? 0.6 : 0.4,
    }));
  }, []);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      onShowToast('Validation Error', 'Please enter your full name.', 'error');
      return;
    }
    setJoinModalOpen(false);
    onShowToast(
      'Application Submitted!',
      `Thank you, ${applicantName}! Your E-Cell DYPTC executive application has been registered.`,
      'success'
    );
    setApplicantName('');
    setApplicantPitch('');
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0102] text-neutral-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* ================= HEADER / BRAND BAR ================= */}
      <nav className="sticky top-0 z-50 w-full ecell-nav-bg transition-all shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Institution Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-md flex-shrink-0">
              {/* Institutional Crest Icon */}
              <div className="w-full h-full rounded border-2 border-red-900 flex flex-col items-center justify-center text-red-950 font-black text-xs leading-none">
                <span className="text-[11px] font-black tracking-tighter">DYP</span>
                <span className="text-[8px] font-bold text-amber-700">★</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-amber-400 tracking-tight leading-none uppercase">
                E-CELL DYPTC
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-300 font-medium tracking-wide">
                Talsande, Kolhapur
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-neutral-200">
            <a href="#about" className="hover:text-amber-400 transition-colors">
              About
            </a>
            <a href="#events" className="hover:text-amber-400 transition-colors">
              Events
            </a>
            <a href="#timeline" className="hover:text-amber-400 transition-colors">
              Timeline
            </a>
            <a href="#team" className="hover:text-amber-400 transition-colors">
              Team
            </a>
            <a href="#startups" className="hover:text-amber-400 transition-colors text-amber-300">
              Startups
            </a>
            <a href="#gallery" className="hover:text-amber-400 transition-colors">
              Gallery
            </a>
            <a href="#news" className="hover:text-amber-400 transition-colors">
              News
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              Contact
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
              title="Launch Your Life In Receipts App"
            >
              <span>🧾</span>
              <span>Launch App</span>
            </Link>

            <button
              onClick={() => setJoinModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white ecell-btn-primary"
            >
              Join E-Cell
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION (MATCHING SCREENSHOT) ================= */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex flex-col items-center justify-center text-center px-4 pt-12 pb-20 ecell-hero-gradient overflow-hidden">
        {/* Ambient Floating Embers / Fireflies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-amber-400 animate-ember"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
                opacity: p.opacity,
                boxShadow: '0 0 8px 2px rgba(245, 158, 11, 0.65)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-7">
          {/* Glowing Affiliation Pill Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full ecell-badge text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg">
            <span>🚀</span>
            <span>AUTONOMOUS INSTITUTE AFFILIATED WITH SHIVAJI UNIVERSITY, KOLHAPUR</span>
          </div>

          {/* Massive Display Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Turning Ideas Into Impact
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-200/90 max-w-3xl mx-auto font-normal leading-relaxed">
            The official Entrepreneurship Cell of D Y Patil Technical Campus, Talsande — established in AY 2026–27 to foster innovation, ideation, and student startups.
          </p>

          {/* Dual Balanced CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={() => setJoinModalOpen(true)}
              className="w-full sm:w-48 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white ecell-btn-primary"
            >
              Join E-Cell
            </button>

            <a
              href="#startups"
              className="w-full sm:w-56 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base ecell-btn-white flex items-center justify-center gap-2"
            >
              <span>Explore Programs</span>
              <span>→</span>
            </a>
          </div>

          {/* Stat Pills Row */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium">
            <div className="px-5 py-2.5 rounded-full ecell-stat-pill flex items-center gap-2">
              <span className="font-extrabold text-amber-400 text-base">3</span>
              <span className="text-neutral-200">Flagship Programs</span>
            </div>

            <div className="px-5 py-2.5 rounded-full ecell-stat-pill flex items-center gap-2">
              <span className="font-extrabold text-amber-400 text-base">1</span>
              <span className="text-neutral-200">Incubated Ventures</span>
            </div>

            <div className="px-5 py-2.5 rounded-full ecell-stat-pill flex items-center gap-2">
              <span className="font-extrabold text-amber-400 text-base">33</span>
              <span className="text-neutral-200">Student Executive Leads</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED VENTURE SPOTLIGHT: YOUR LIFE IN RECEIPT ================= */}
      <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>⭐ Star Incubated Venture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Born at E-Cell DYPTC
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base">
            Engineered by students at D Y Patil Technical Campus for the national frontend engineering hackathon.
          </p>
        </div>

        {/* Highlight Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2b0407] to-[#160103] border border-red-900/60 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Venture Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950 border border-red-800 text-red-300 text-xs font-mono">
                <span>VENTURE ID: DYPTC-ST-001</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">100% PRODUCTION READY</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Your Life In Receipt
              </h3>

              <p className="text-base text-neutral-300 leading-relaxed">
                A high-performance personal ledger web app that converts your daily time, financial expenses, compounded goals, and emotional vibes into an authentic itemized thermal receipt docket.
              </p>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-red-900/40">
                  <span className="text-neutral-400 block">Architecture</span>
                  <span className="text-neutral-100 font-bold">Zero Backend / LocalStorage</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-red-900/40">
                  <span className="text-neutral-400 block">Performance</span>
                  <span className="text-amber-400 font-bold">Core Web Vitals ~ 100</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-red-900/40">
                  <span className="text-neutral-400 block">Accessibility</span>
                  <span className="text-emerald-400 font-bold">WCAG AA & ARIA Validated</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={ROUTES.HOME}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <span>🚀 Launch Live Dashboard</span>
                  <span>→</span>
                </Link>

                <Link
                  to={ROUTES.RECEIPT}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
                >
                  <span>🧾 View Receipt Docket</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Mini Interactive Receipt Teaser */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-[#faf8f5] text-[#1f1e1d] p-6 font-mono text-xs shadow-2xl border-4 border-[#e6e1da] rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="text-center border-b-2 border-dashed border-[#1f1e1d]/40 pb-3 mb-3">
                  <p className="font-black text-sm tracking-widest uppercase">E-CELL DYPTC LEDGER</p>
                  <p className="text-[10px] text-neutral-600">INNOVATION & STUDENT STARTUPS</p>
                  <p className="text-[9px] text-neutral-500 mt-1">TERM: AY 2026-27 • KOLHAPUR</p>
                </div>

                <div className="space-y-1.5 py-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Incubator Track</span>
                    <span className="font-bold">Fintech / Productivity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Developer</span>
                    <span className="font-bold">Gopal Shinde</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Reliability</span>
                    <span className="font-bold text-emerald-700">39/39 Tests Passing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages</span>
                    <span className="font-bold">EN / हिन्दी / मराठी</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-[#1f1e1d]/40 pt-3 mt-3 text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-700">LIFE SCORE INDEX: 85/100</p>
                  <p className="text-[9px] text-neutral-500 mt-1">D Y Patil Technical Campus, Talsande</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT E-CELL DYPTC ================= */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-red-950/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">About The Cell</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Fostering the Next Wave of Technopreneurs
            </h2>
            <p className="text-neutral-300 text-base leading-relaxed">
              Established in Academic Year 2026–27, the Entrepreneurship Cell at D Y Patil Technical Campus, Talsande provides comprehensive incubation, seed mentorship, and technical infrastructure for ambitious student innovators.
            </p>
            <p className="text-neutral-300 text-base leading-relaxed">
              Affiliated with Shivaji University, Kolhapur as an Autonomous Institute, we bridge the gap between academic classroom learning and real-world high-impact venture creation.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/50">
                <h4 className="font-bold text-amber-400 text-lg">Innovation Hub</h4>
                <p className="text-xs text-neutral-300 mt-1">24/7 maker space and collaborative design studios.</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/50">
                <h4 className="font-bold text-amber-400 text-lg">Mentorship</h4>
                <p className="text-xs text-neutral-300 mt-1">Direct access to industry CTOs and venture capital networks.</p>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#1c0205] border border-red-900/50 hover:border-amber-500/50 transition-colors">
              <span className="text-2xl block mb-2">💡</span>
              <h3 className="text-lg font-bold text-white">Ideate & Prototype</h3>
              <p className="text-sm text-neutral-300 mt-1">From initial concept and architectural design to fully functioning client-side MVPs.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1c0205] border border-red-900/50 hover:border-amber-500/50 transition-colors">
              <span className="text-2xl block mb-2">🚀</span>
              <h3 className="text-lg font-bold text-white">Incubate & Validate</h3>
              <p className="text-sm text-neutral-300 mt-1">Testing real user retention, accessibility standards, and automated evaluation metrics.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1c0205] border border-red-900/50 hover:border-amber-500/50 transition-colors">
              <span className="text-2xl block mb-2">📈</span>
              <h3 className="text-lg font-bold text-white">Scale to Market</h3>
              <p className="text-sm text-neutral-300 mt-1">Participating in regional, national, and global hackathons and venture showcase competitions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENTS & FLAGSHIP PROGRAMS ================= */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-red-950/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Calendar & Initiatives</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Flagship Programs
          </h2>
          <p className="text-neutral-300 text-sm">
            High-octane competitions, hackathons, and founder bootcamps hosted throughout the academic year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#1c0205] border border-red-900/50 p-6 flex flex-col justify-between hover:-translate-y-1.5 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg mb-4 font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-white">DYPTC Ideathon 2026</h3>
              <p className="text-xs text-amber-400 mt-1 font-semibold">Annual Innovation Challenge</p>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                48-hour student sprint challenging interdisciplinary teams to solve regional agriculture, education, and health problems.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-red-950 flex items-center justify-between text-xs text-neutral-400">
              <span>Status: Active</span>
              <span className="text-amber-300 font-bold">₹50,000 Prize Pool</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1c0205] border border-red-900/50 p-6 flex flex-col justify-between hover:-translate-y-1.5 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg mb-4 font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Founder's Bootcamp</h3>
              <p className="text-xs text-amber-400 mt-1 font-semibold">12-Week Intensive Incubation</p>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                Weekly masterclasses on unit economics, legal structure, patent filing, and automated code review compliance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-red-950 flex items-center justify-between text-xs text-neutral-400">
              <span>Cohort: 2026–27</span>
              <span className="text-amber-300 font-bold">12 Teams</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1c0205] border border-red-900/50 p-6 flex flex-col justify-between hover:-translate-y-1.5 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg mb-4 font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-white">E-Summit Kolhapur</h3>
              <p className="text-xs text-amber-400 mt-1 font-semibold">Regional Angel Conclave</p>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                Gathering angel investors, alumni founders, and startup enthusiasts from across Western Maharashtra.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-red-950 flex items-center justify-between text-xs text-neutral-400">
              <span>Scheduled: Nov 2026</span>
              <span className="text-amber-300 font-bold">500+ Attendees</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STUDENT LEADERSHIP TEAM ================= */}
      <section id="team" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-red-950/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Executive Leads (AY 2026–27)
          </h2>
          <p className="text-neutral-300 text-sm">
            Passionate student leaders and engineers powering the entrepreneurial spirit of DYPTC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#190204] border border-red-900/50 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-2xl">
              👨‍💻
            </div>
            <h3 className="font-bold text-white text-base">Gopal Shinde</h3>
            <p className="text-xs text-amber-400 font-semibold">Technical Head & Lead Architect</p>
            <p className="text-xs text-neutral-400">Developer of "Your Life In Receipt" and technical evaluation systems.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#190204] border border-red-900/50 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="font-bold text-white text-base">Student President</h3>
            <p className="text-xs text-amber-400 font-semibold">Executive Convener</p>
            <p className="text-xs text-neutral-400">Oversees cell governance, institute liaisons, and strategic partnerships.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#190204] border border-red-900/50 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 mx-auto flex items-center justify-center text-2xl">
              🚀
            </div>
            <h3 className="font-bold text-white text-base">Incubation Lead</h3>
            <p className="text-xs text-amber-400 font-semibold">Venture Development</p>
            <p className="text-xs text-neutral-400">Manages cohort milestones, mentor pairing, and pitch deck reviews.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#190204] border border-red-900/50 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-2xl">
              📢
            </div>
            <h3 className="font-bold text-white text-base">Outreach & Media</h3>
            <p className="text-xs text-amber-400 font-semibold">Brand Communications</p>
            <p className="text-xs text-neutral-400">Drives campus awareness, press releases, and community events.</p>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION FOOTER BANNER ================= */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center space-y-6">
        <div className="rounded-3xl ecell-hero-gradient border border-red-900/70 p-8 sm:p-14 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Build Your Startup?
          </h2>
          <p className="text-base sm:text-lg text-neutral-200 max-w-2xl mx-auto">
            Join the 33 student executive leads and transform your ideas into scalable ventures today at D Y Patil Technical Campus, Talsande.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setJoinModalOpen(true)}
              className="w-full sm:w-52 py-3.5 px-6 rounded-xl font-bold text-white ecell-btn-primary"
            >
              Apply to Join E-Cell
            </button>
            <Link
              to={ROUTES.HOME}
              className="w-full sm:w-52 py-3.5 px-6 rounded-xl font-bold ecell-btn-white"
            >
              Open Life Receipt App →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= OFFICIAL FOOTER ================= */}
      <footer id="contact" className="border-t border-red-950/80 bg-[#080102] py-12 px-4 text-center text-xs text-neutral-400 space-y-3">
        <p className="font-bold text-neutral-200 text-sm">
          E-CELL DYPTC • D Y PATIL TECHNICAL CAMPUS, TALSANDE, KOLHAPUR
        </p>
        <p className="text-neutral-500">
          An Autonomous Institute Affiliated with Shivaji University, Kolhapur • Established Academic Year 2026–27
        </p>
        <p className="text-amber-500/80 font-mono">
          Venture Spotlight: "Your Life In Receipt" • Built with React, TypeScript & Vite
        </p>
      </footer>

      {/* ================= JOIN E-CELL APPLICATION MODAL ================= */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join E-Cell DYPTC (AY 2026–27)"
      >
        <form onSubmit={handleJoinSubmit} className="space-y-4">
          <Input
            id="ecell-applicant-name"
            label="Full Name"
            placeholder="e.g. Gopal Shinde"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
          />

          <div>
            <label htmlFor="ecell-branch" className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Department / Branch
            </label>
            <select
              id="ecell-branch"
              value={applicantBranch}
              onChange={(e) => setApplicantBranch(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <option value="Computer Science & Engg">Computer Science & Engg</option>
              <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronics & Telecommunication">Electronics & Telecom</option>
              <option value="Management Studies">Management Studies</option>
            </select>
          </div>

          <div>
            <label htmlFor="ecell-role" className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Domain / Team Preference
            </label>
            <select
              id="ecell-role"
              value={applicantRole}
              onChange={(e) => setApplicantRole(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <option value="Technical & Full Stack">Technical Architecture & Full Stack</option>
              <option value="Startup Founder / Ideator">Startup Founder / Ideator</option>
              <option value="Events & Hackathon Logistics">Events & Hackathon Logistics</option>
              <option value="UI/UX & Brand Design">UI/UX & Brand Design</option>
              <option value="Corporate Relations & Sponsorship">Corporate Relations & Sponsorship</option>
            </select>
          </div>

          <div>
            <label htmlFor="ecell-pitch" className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Your Startup Idea or Statement of Purpose (Optional)
            </label>
            <textarea
              id="ecell-pitch"
              rows={3}
              placeholder="Tell us what you want to build or what excites you about E-Cell DYPTC..."
              value={applicantPitch}
              onChange={(e) => setApplicantPitch(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
