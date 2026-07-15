'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Play,
  MessageSquare,
  BookOpen,
  Brain,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  ChevronRight,
  Activity,
} from 'lucide-react';
import type { EventType, TeachingStrategy, DeliveryFormat, EventPayload } from '../types/domain';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
);

interface TabConfig {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  format: DeliveryFormat;
  strategy: TeachingStrategy;
  accent: string;
  accentRing: string;
  accentBg: string;
  accentText: string;
}

const TABS: TabConfig[] = [
  {
    id: 'simulation',
    label: 'Grafikle Canlandır',
    sublabel: 'Simülasyon · Keşif',
    icon: Play,
    format: 'SIMULATION',
    strategy: 'DISCOVERY',
    accent: 'indigo',
    accentRing: 'ring-indigo-500/50',
    accentBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-400',
  },
  {
    id: 'socratic',
    label: 'Adım Adım Çöz',
    sublabel: 'Diyalog · Sokratik',
    icon: MessageSquare,
    format: 'DIALOGUE',
    strategy: 'SOCRATIC',
    accent: 'violet',
    accentRing: 'ring-violet-500/50',
    accentBg: 'bg-violet-500/10',
    accentText: 'text-violet-400',
  },
  {
    id: 'theory',
    label: 'Önce Kuralı Gör',
    sublabel: 'Metin · Teori',
    icon: BookOpen,
    format: 'TEXT',
    strategy: 'THEORY_FIRST',
    accent: 'sky',
    accentRing: 'ring-sky-500/50',
    accentBg: 'bg-sky-500/10',
    accentText: 'text-sky-400',
  },
];

const OPTIONS = [
  { value: 10, label: 'A' },
  { value: 13, label: 'B' },
  { value: 16, label: 'C' },
  { value: 19, label: 'D' },
];
const CORRECT_OPTION = 16;

// ─── Terminal Simulation Content ───────────────────────────────────────────
function SimulationContent() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s < 4 ? s + 1 : s)), 900);
    return () => clearInterval(id);
  }, []);

  const lines = [
    { prefix: '$ ', text: 'input(x = 5)', color: 'text-slate-400' },
    { prefix: '→ ', text: 'evaluate: x - 2 = 5 - 2 = 3', color: 'text-indigo-400' },
    { prefix: '→ ', text: 'f(3) maps to: 3(5) + 1', color: 'text-violet-400' },
    { prefix: '→ ', text: '= 15 + 1', color: 'text-violet-400' },
    { prefix: '✓ ', text: 'f(3) = 16', color: 'text-emerald-400 font-bold' },
  ];

  return (
    <div className="space-y-5">
      <p className="text-slate-400 text-sm leading-relaxed">
        Fonksiyon bir <span className="text-indigo-400 font-medium">dönüşüm makinesi</span>dir.
        Girdiyi alır, işler ve çıktı üretir. Aşağıdaki terminali izle:
      </p>
      <div className="bg-black/60 border border-white/[0.07] rounded-2xl p-5 font-mono text-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="text-slate-600 text-xs ml-2">edos_engine — f(x-2)=3x+1</span>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <AnimatePresence key={i}>
              {step >= i && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${line.color}`}
                >
                  <span className="text-slate-600 select-none">{line.prefix}</span>
                  <span>{line.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 text-slate-500 mt-3"
            >
              <span>$</span>
              <span className="inline-block w-2 h-4 bg-slate-500 animate-pulse" />
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex gap-3 items-center bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
        <Activity size={16} className="text-indigo-400 shrink-0" />
        <p className="text-slate-400 text-xs">
          <span className="text-indigo-400 font-medium">İpucu:</span> f(3) bulmak için x-2=3 eşitliğini çöz, x=5 bulursun. Sonra f formülüne x=5 yaz.
        </p>
      </div>
    </div>
  );
}

// ─── Socratic Dialog Content ────────────────────────────────────────────────
function SocraticContent() {
  const messages = [
    { from: 'ai', text: 'f(3) değerini bulmak istiyoruz. Peki, parantez içinin 3 olması için ne yapmalıyız?' },
    { from: 'user', text: 'x - 2 = 3 yazmam lazım!' },
    { from: 'ai', text: 'Tam isabet! O zaman x = 5 çıkıyor. Şimdi bu x değerini formüle yaz: 3(5) + 1 = ?' },
    { from: 'user', text: '15 + 1 = 16 🎉' },
    { from: 'ai', text: 'Mükemmel! f(3) = 16. Mantığı kendin keşfettin, bu çok daha kalıcı olacak.' },
  ];

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.from === 'ai'
                ? 'bg-white/[0.04] border border-white/[0.07] text-slate-300 rounded-tl-sm'
                : 'bg-violet-500/15 border border-violet-500/25 text-violet-200 rounded-tr-sm'
              }`}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Theory Content ─────────────────────────────────────────────────────────
function TheoryContent() {
  const steps = [
    { n: '1', title: 'İfadeleri Eşitle', desc: 'Parantez içini istenen değere eşitle: x - 2 = 3', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/5' },
    { n: '2', title: 'x Değerini Bul', desc: 'Denklemden x = 5 elde edilir', color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5' },
    { n: '3', title: 'Formüle Yaz', desc: '3(5) + 1 = 15 + 1 = 16', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Kural</p>
        <p className="text-slate-200 font-mono text-sm">
          f(<span className="text-sky-400">A</span>) = B ise, f(<span className="text-violet-400">C</span>) için:<br />
          → <span className="text-sky-400">A</span> = <span className="text-violet-400">C</span> eşit­le, x bul, B'ye yaz
        </p>
      </div>
      <div className="space-y-3">
        {steps.map((s) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Number(s.n) * 0.1 }}
            className={`flex gap-4 items-start p-4 rounded-xl border ${s.border} ${s.bg}`}
          >
            <span className={`text-lg font-black ${s.color} shrink-0`}>{s.n}</span>
            <div>
              <p className={`font-semibold text-sm ${s.color}`}>{s.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Result Screen ───────────────────────────────────────────────────────────
function ResultScreen({ isCorrect, activeTab }: { isCorrect: boolean; activeTab: number }) {
  const profiles = [
    {
      label: 'Görsel / Simülasyon',
      value: 65,
      color: 'bg-indigo-500',
      insight: 'Keşfederek öğrenmeye yatkınsın. Görsel örüntüler seni hızlandırıyor.',
    },
    {
      label: 'Diyalog / Sokratik',
      value: 72,
      color: 'bg-violet-500',
      insight: 'Adım adım rehberlik altında öğrenmeyi tercih ediyorsun.',
    },
    {
      label: 'Analitik / Teori',
      value: 80,
      color: 'bg-sky-500',
      insight: 'Önce büyük resmi görmen sana hız kazandırıyor.',
    },
  ];
  const profile = profiles[activeTab];

  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none ${isCorrect ? 'bg-emerald-500' : 'bg-orange-500'}`} />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] p-8 space-y-7">

          {/* Badge */}
          <div className="flex flex-col items-center text-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', damping: 15 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isCorrect
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                }`}
            >
              {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
            </motion.div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {isCorrect ? 'Harika İş Çıkardın!' : 'Neredeyse Biliyordun'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Doğru cevap: <span className="text-emerald-400 font-mono font-bold">f(3) = 16</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* Profile section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
                Anlık Öğrenme Profilin
              </h3>
            </div>

            {/* Active profile bar */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-medium">{profile.label}</span>
                <span className="text-white font-black text-lg">%{profile.value}</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.value}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${profile.color}`}
                />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{profile.insight}</p>
            </div>

            {/* Secondary bars */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hız', value: isCorrect ? 88 : 52, color: 'bg-violet-500' },
                { label: 'Özgüven', value: isCorrect ? 91 : 60, color: 'bg-sky-500' },
              ].map((bar) => (
                <div key={bar.label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs">{bar.label}</span>
                    <span className="text-slate-300 text-xs font-bold">%{bar.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* CTA */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
            >
              <Zap size={18} />
              Bekleme Listesine Katıl
              <ChevronRight size={18} className="ml-auto" />
            </motion.button>
            <p className="text-center text-slate-600 text-xs leading-relaxed">
              Bu motor tamamlandığında seni tanıyan bir AI koç olmasını ister misin?
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LearningApp() {
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const tabEntryTimeRef = useRef<number>(Date.now());

  const logEvent = async (uid: string, eventType: EventType, payload: EventPayload) => {
    if (!uid) return;
    try {
      await supabase.from('learning_events').insert({
        user_id: uid,
        event_type: eventType,
        payload,
      });
    } catch (_) { }
  };

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({})
        .select('id')
        .single();
      if (!error && data) {
        setUserId(data.id);
        const now = Date.now();
        startTimeRef.current = now;
        tabEntryTimeRef.current = now;
        logEvent(data.id, 'QUESTION_VIEWED', {
          nodeId: 'tyt_func_01',
          currentStrategy: TABS[0].strategy,
          currentFormat: TABS[0].format,
        });
      }
    };
    init();
  }, []);

  const handleTabSwitch = (index: number) => {
    if (index === activeTab || hasAnswered) return;
    const now = Date.now();
    logEvent(userId, 'TAB_SWITCHED', {
      nodeId: 'tyt_func_01',
      timeSpentMs: now - tabEntryTimeRef.current,
      currentStrategy: TABS[index].strategy,
      currentFormat: TABS[index].format,
      metadata: { fromTab: TABS[activeTab].id, toTab: TABS[index].id },
    });
    logEvent(userId, 'STRATEGY_CHANGED', {
      nodeId: 'tyt_func_01',
      currentStrategy: TABS[index].strategy,
      currentFormat: TABS[index].format,
    });
    setActiveTab(index);
    tabEntryTimeRef.current = now;
  };

  const handleOptionHover = (value: number) => {
    if (hasAnswered) return;
    logEvent(userId, 'OPTION_HOVERED', {
      nodeId: 'tyt_func_01',
      currentStrategy: TABS[activeTab].strategy,
      currentFormat: TABS[activeTab].format,
      metadata: { hoveredValue: value },
    });
  };

  const handleAnswerSubmit = (value: number) => {
    if (hasAnswered) return;
    const correct = value === CORRECT_OPTION;
    const now = Date.now();
    setSelectedOption(value);
    setIsCorrect(correct);

    logEvent(userId, 'ANSWER_SUBMITTED', {
      nodeId: 'tyt_func_01',
      timeSpentMs: now - startTimeRef.current,
      currentStrategy: TABS[activeTab].strategy,
      currentFormat: TABS[activeTab].format,
      metadata: { selectedValue: value, isCorrect: correct },
    });

    // Brief delay for selection feedback before transitioning
    setTimeout(() => setHasAnswered(true), 500);
  };

  // ── Result Screen ──────────────────────────────────────────────────────────
  if (hasAnswered && isCorrect !== null) {
    return <ResultScreen isCorrect={isCorrect} activeTab={activeTab} />;
  }

  const tab = TABS[activeTab];

  // ── Main Screen ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 relative overflow-hidden">
      {/* Ambient radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-12 md:py-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-5 mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-xs font-medium text-slate-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            EDOS Engine · Öğrenme DNA Analizi Aktif
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              3 Dakikada Öğrenme
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              DNA&apos;nı Keşfet
            </span>
          </h1>

          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Bu soru boyunca seni izliyoruz. Hangi yöntemle daha hızlı öğrendiğini hesaplıyoruz.
          </p>
        </motion.header>

        {/* ── The 3 Doors ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {TABS.map((t, idx) => {
            const Icon = t.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(idx)}
                className={`relative flex flex-col gap-3 p-4 md:p-5 rounded-2xl border transition-all duration-300 text-left group ${isActive
                    ? `${t.accentBg} ${t.accentRing} ring-2 border-transparent`
                    : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]'
                  }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${isActive
                    ? `${t.accentBg} border-current ${t.accentText}`
                    : 'bg-white/[0.04] border-white/[0.07] text-slate-500 group-hover:text-slate-300'
                  }`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className={`font-semibold text-sm leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {t.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? t.accentText : 'text-slate-600'}`}>
                    {t.sublabel}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="tabActiveIndicator"
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${idx === 0 ? 'bg-indigo-400' : idx === 1 ? 'bg-violet-400' : 'bg-sky-400'
                      }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Content Card ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden"
        >
          {/* Question stem */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 uppercase tracking-widest">
                TYT Fonksiyonlar
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.06]">
                Orta Düzey
              </span>
            </div>
            <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
              Gerçek sayılarda tanımlı bir{' '}
              <code className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">f</code>{' '}
              fonksiyonu için{' '}
              <code className="px-2 py-0.5 rounded-lg bg-white/[0.06] text-white font-mono border border-white/[0.08]">
                f(x&nbsp;&minus;&nbsp;2) = 3x + 1
              </code>{' '}
              olduğuna göre,{' '}
              <code className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-300 font-mono border border-violet-500/20 font-bold">
                f(3)
              </code>{' '}
              kaçtır?
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-0 divide-x divide-white/[0.05]">

            {/* Left: Strategy content */}
            <div className="p-8 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === 0 && <SimulationContent />}
                  {activeTab === 1 && <SocraticContent />}
                  {activeTab === 2 && <TheoryContent />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Options */}
            <div className="p-8 flex flex-col justify-center gap-3">
              <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">Cevabını İşaretle</p>
              {OPTIONS.map((opt) => {
                const isSelected = selectedOption === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => handleOptionHover(opt.value)}
                    onClick={() => handleAnswerSubmit(opt.value)}
                    className={`relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-200 text-left group ${isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/50 ring-1 ring-indigo-500/30'
                        : 'bg-white/[0.02] border-white/[0.07] hover:border-indigo-500/50 hover:bg-white/[0.05]'
                      }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors shrink-0 ${isSelected
                        ? 'bg-indigo-500/30 border-indigo-500/50 text-indigo-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-500 group-hover:border-indigo-500/40 group-hover:text-indigo-400'
                      }`}>
                      {opt.label}
                    </span>
                    <span className={`font-mono font-bold text-lg transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                      {opt.value}
                    </span>
                    <ArrowRight
                      size={16}
                      className={`ml-auto transition-all duration-200 ${isSelected
                          ? 'text-indigo-400 opacity-100'
                          : 'text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400'
                        }`}
                    />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Footer hint ─────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-700 text-xs mt-8"
        >
          Süren ve strateji değişimlerin anonim olarak analiz ediliyor · Session aktif
        </motion.p>

      </div>
    </div>
  );
}
