
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
  Palette,
  Search,
  Settings,
  RefreshCcw
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
  {
    id: 'metaphor',
    label: 'Görsel & Metaforik',
    sublabel: 'Hikaye · Günlük Hayat',
    icon: Palette,
    format: 'TEXT',
    strategy: 'DISCOVERY',
    accent: 'fuchsia',
    accentRing: 'ring-fuchsia-500/50',
    accentBg: 'bg-fuchsia-500/10',
    accentText: 'text-fuchsia-400',
  },
  {
    id: 'reverse_engineering',
    label: 'Tersine Mühendislik',
    sublabel: 'Hack · Şıklardan Git',
    icon: Search,
    format: 'SIMULATION',
    strategy: 'SOCRATIC',
    accent: 'emerald',
    accentRing: 'ring-emerald-500/50',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
  },
  {
    id: 'real_life',
    label: 'Gerçek Hayat Uyg.',
    sublabel: 'Endüstri · Kullanım',
    icon: Settings,
    format: 'TEXT',
    strategy: 'THEORY_FIRST',
    accent: 'amber',
    accentRing: 'ring-amber-500/50',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
  },
];

const QUESTIONS = [
  {
    id: 'tyt_func_01',
    tags: ['TYT Fonksiyonlar', 'Orta Düzey'],
    questionText: (
      <>
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
      </>
    ),
    options: [
      { value: 10, label: 'A' },
      { value: 13, label: 'B' },
      { value: 16, label: 'C' },
      { value: 19, label: 'D' },
    ],
    correctOption: 16,
    contents: {
      simulation: () => {
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
              Fonksiyon bir <span className="text-indigo-400 font-medium">dönüşüm makinesi</span>dir. Girdiyi alır, işler ve çıktı üretir.
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
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={"flex gap-2 " + line.color}>
                        <span className="text-slate-600 select-none">{line.prefix}</span><span>{line.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </div>
        );
      },
      socratic: () => {
        const messages = [
          { from: 'ai', text: 'f(3) değerini bulmak istiyoruz. Peki, parantez içinin 3 olması için ne yapmalıyız?' },
          { from: 'user', text: 'x - 2 = 3 yazmam lazım!' },
          { from: 'ai', text: 'Tam isabet! O zaman x = 5 çıkıyor. Şimdi bu x değerini formüle yaz: 3(5) + 1 = ?' },
          { from: 'user', text: '15 + 1 = 16 🎉' },
          { from: 'ai', text: 'Mükemmel! f(3) = 16. Mantığı kendin keşfettin.' },
        ];
        return (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={"flex " + (msg.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={"max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed " + (msg.from === 'ai' ? 'bg-white/[0.04] border border-white/[0.07] text-slate-300 rounded-tl-sm' : 'bg-violet-500/15 border border-violet-500/25 text-violet-200 rounded-tr-sm')}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        );
      },
      theory: () => {
        const steps = [
          { n: '1', title: 'İfadeleri Eşitle', desc: 'Parantez içini istenen değere eşitle: x - 2 = 3', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/5' },
          { n: '2', title: 'x Değerini Bul', desc: 'Denklemden x = 5 elde edilir', color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5' },
          { n: '3', title: 'Formüle Yaz', desc: '3(5) + 1 = 15 + 1 = 16', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
        ];
        return (
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Kural</p>
              <p className="text-slate-200 font-mono text-sm">f(<span className="text-sky-400">A</span>) = B ise, f(<span className="text-violet-400">C</span>) için:<br />→ <span className="text-sky-400">A</span> = <span className="text-violet-400">C</span> eşitle, x bul, B ye yaz</p>
            </div>
            <div className="space-y-3">
              {steps.map((s) => (
                <motion.div key={s.n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Number(s.n) * 0.1 }} className={"flex gap-4 items-start p-4 rounded-xl border " + s.border + " " + s.bg}>
                  <span className={"text-lg font-black shrink-0 " + s.color}>{s.n}</span>
                  <div><p className={"font-semibold text-sm " + s.color}>{s.title}</p><p className="text-slate-400 text-xs mt-0.5">{s.desc}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      },
      metaphor: () => {
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20">
              <p className="text-sm text-slate-300 leading-relaxed">
                Bir <strong className="text-fuchsia-400">fabrika üretim bandını</strong> hayal et. <br/><br/>
                Bu fabrikanın kapısında "x - 2" yazıyor (yani malzeme içeri girmeden önce kendinden 2 eksiliyor). Fabrikanın içinde ise "3 ile çarp ve 1 ekle" makinesi var.<br/><br/>
                Fabrikadan <span className="text-white font-bold">f(3)</span> çıktısını almak istiyorsan, kapıdaki eksilme işleminden sonra içeri giren şeyin 3 olması lazım. Yani senin fabrikaya en başta "5" numaralı hammaddeyi göndermen gerek (5 - 2 = 3).
                Makine bu 5 i alıp <span className="text-fuchsia-300">3 * 5 + 1 = 16</span> ürününe dönüştürecektir!
              </p>
            </div>
          </div>
        );
      },
      reverse_engineering: () => {
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono text-sm text-slate-300">
              <span className="text-emerald-400 font-bold">&gt;_ HACK_MODE:</span> Şıklardan geri git!
            </div>
            {[[10, "3x + 1 = 10 => 3x = 9 => x = 3 => f(3-2) = f(1). Yanlış!"],
              [16, "3x + 1 = 16 => 3x = 15 => x = 5 => f(5-2) = f(3). Doğru!"],
            ].map((hack, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-sm flex gap-3">
                <Search size={18} className={i === 1 ? "text-emerald-400" : "text-slate-500"}/>
                <span className={i === 1 ? "text-emerald-300" : "text-slate-400"}>{hack[1]}</span>
              </motion.div>
            ))}
          </div>
        );
      },
      real_life: () => {
        return (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-amber-400 text-base">Oyun Geliştirme (Game Dev)</strong><br/><br/>
                Karakterin hasar alma fonksiyonunu yazıyorsun. <code className="bg-black/30 px-1 rounded text-amber-200">damageTaken(hit - armor) = baseDamage * hit + modifier</code>
                Eğer karakterinin 3 net hasar aldığını simüle etmek istiyorsan, zırh hesaplamasından önceki "gerçek vuruş" (hit) değerini bulmalısın. Matematikteki fonksiyonlar tam olarak bu ara katman (middleware) hesaplamaları için yazılımda her gün kullanılır!
              </p>
            </div>
          </div>
        );
      }
    }
  },
  {
    id: 'tyt_logic_02',
    tags: ['TYT Olasılık', 'Zor Düzey', 'Günlük Hayat'],
    questionText: (
      <>
        Bir kafede <strong className="text-white">3 farklı kahve çekirdeği</strong> ve <strong className="text-white">4 farklı süt çeşidi</strong> bulunmaktadır. 
        Müşteri, seçeceği kahvenin yanına sadece 1 çeşit süt ekletebilir ya da süt istemeyebilir.
        Buna göre bir müşteri kaç farklı kahve siparişi verebilir?
      </>
    ),
    options: [
      { value: 12, label: 'A' },
      { value: 15, label: 'B' },
      { value: 24, label: 'C' },
      { value: 64, label: 'D' },
    ],
    correctOption: 15,
    contents: {
      simulation: () => (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Kahve kombinasyonlarını görselleştir:</p>
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map(c => (
              <div key={c} className="p-3 border border-indigo-500/30 bg-indigo-500/10 rounded-xl text-center space-y-2">
                <div className="text-indigo-400 text-xs font-bold">Çekirdek {c}</div>
                <div className="text-[10px] text-slate-400">+ 4 Süt Çeşidi</div>
                <div className="text-[10px] text-slate-400">+ Sade (Sütsüz)</div>
                <div className="pt-2 border-t border-indigo-500/20 text-indigo-300 font-bold text-lg">5 Seçenek</div>
              </div>
            ))}
          </div>
          <p className="text-center text-emerald-400 font-bold text-lg mt-4">3 x 5 = 15 Seçenek</p>
        </div>
      ),
      socratic: () => (
        <div className="space-y-3">
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.07] text-slate-300 text-sm">Bir müşteri çekirdek seçmek zorunda mı? (Evet, 3 farklı seçenek var).</div>
          <div className="bg-violet-500/15 p-3 rounded-xl border border-violet-500/25 text-violet-200 text-sm text-right ml-8">Peki süt seçimi için kaç durum var? 4 süt var, bir tane seçecek. Yani 4.</div>
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.07] text-slate-300 text-sm">Dikkat et! Soruda "süt istemeyebilir" diyor. Bu durumda süt için seçenek sayısı ne olur?</div>
          <div className="bg-violet-500/15 p-3 rounded-xl border border-violet-500/25 text-violet-200 text-sm text-right ml-8">Aaa! 4 süt + 1 sütsüz (sade) = 5 durum var. O zaman 3 x 5 = 15!</div>
        </div>
      ),
      theory: () => (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase mb-1">Çarpma Kuralı</p>
            <p className="text-sm text-slate-200">Birbirinden bağımsız gerçekleşen durumların varyasyonları çarpılır. "Yokluk" veya "Hiçbiri" durumu da bir seçenektir ve kombinasyon havuzuna dahil edilmelidir.</p>
          </div>
          <div className="flex gap-4 items-center p-4 rounded-xl border border-sky-500/30 bg-sky-500/5">
            <span className="text-sky-400 text-xl font-black">N = </span>
            <span className="text-slate-300 text-sm font-mono">(Çekirdek Seçenekleri) × (Süt Seçenekleri + Sütsüz Seçeneği) = 3 × (4 + 1) = 15</span>
          </div>
        </div>
      ),
      metaphor: () => (
        <div className="p-5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            RPG oyunlarındaki karakter oluşturma ekranını (Character Creation) düşün. <br/>
            Karakterinin sınıfını seçiyorsun: Savaşçı, Büyücü, Okçu (3 seçenek). <br/>
            Sonra şapka seçiyorsun: 4 farklı şapka var, ama istersen <strong>Şapkasız</strong> da devam edebilirsin!<br/>
            Yani şapka slotu için aslında 5 seçeneğin var. Kombinasyon sayısı 3 x 5 = 15 olur.
          </p>
        </div>
      ),
      reverse_engineering: () => (
        <div className="space-y-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-sm text-emerald-300 font-mono mb-2">&gt; HACK_MODE: En yaygın hatayı bul!</p>
          <p className="text-sm text-slate-300">
            Öğrencilerin %80 i doğrudan 3 x 4 = 12 yi (A şıkkı) işaretler. Sınav hazırlayıcılar bu tuzağı A şıkkına koyarlar. 
            Eğer çok net ve basit bir 3x4 görüyorsan ve bu bir TYT sorusuysa, kesinlikle gizli bir "+1" seçeneği (sade, sütsüz, boş vb.) vardır. 12 nin bir tık üstü olan 15 i (3x5) doğrudan fark edebilirsin.
          </p>
        </div>
      ),
      real_life: () => (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-slate-300">
            <strong>E-Ticaret Veritabanı (Ürün Varyasyonları)</strong><br/>
            Trendyol veya Amazon da bir ürün eklerken varyasyon oluşturulur (Renk x Beden). Eğer "Beden" zorunlu değilse (Örn. Standart Beden veya Bedensiz), veritabanına bu durum <code className="text-amber-300">NULL</code> veya <code className="text-amber-300">N/A</code> olarak 1 ekstra varyasyon olarak kaydedilir. Algoritmalar stok yönetimini 3x5=15 satır olarak tutar!
          </p>
        </div>
      )
    }
  },
  {
    id: 'tyt_geo_03',
    tags: ['Analitik Geometri', 'Görsel Algı', 'Yeni Nesil'],
    questionText: (
      <>
        Dik koordinat düzleminde, bir karınca <strong className="text-sky-400">A(2, 4)</strong> noktasından başlayıp her adımda 
        1 birim sağa ve 2 birim aşağıya gidiyor. <br/><br/>
        Karınca x eksenini kestiği anda hangi apsis (x) değerinde olur?
      </>
    ),
    options: [
      { value: 3, label: 'A' },
      { value: 4, label: 'B' },
      { value: 5, label: 'C' },
      { value: 6, label: 'D' },
    ],
    correctOption: 4,
    contents: {
      simulation: () => (
        <div className="space-y-4 text-center">
          <div className="h-48 border-l-2 border-b-2 border-slate-600 relative mx-auto w-48 mt-4">
            <span className="absolute -left-6 -bottom-6 text-slate-500">0,0</span>
            <motion.div initial={{ top: '10%', left: '20%' }} animate={{ top: '50%', left: '40%' }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }} className="absolute w-3 h-3 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]"/>
            <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-white/20 rounded-full" title="A(2,4)"/>
            <div className="absolute top-[30%] left-[30%] w-2 h-2 bg-white/20 rounded-full" title="(3,2)"/>
            <div className="absolute top-[50%] left-[40%] w-2 h-2 bg-white/20 rounded-full" title="(4,0)"/>
          </div>
          <p className="text-xs text-slate-400">Karınca: A(2,4) → B(3,2) → C(4,0)</p>
        </div>
      ),
      socratic: () => (
        <div className="space-y-3 text-sm">
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.07] text-slate-300 text-sm">Karıncanın başlangıç y (ordinat) değeri kaç?</div>
          <div className="bg-violet-500/15 p-3 rounded-xl border border-violet-500/25 text-violet-200 text-sm text-right ml-8">4 birim yukarıda.</div>
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.07] text-slate-300 text-sm">x eksenine ulaşması için y'nin 0 olması lazım. Her adımda 2 birim aşağı iniyorsa, kaç adım atması gerekir?</div>
          <div className="bg-violet-500/15 p-3 rounded-xl border border-violet-500/25 text-violet-200 text-sm text-right ml-8">4 / 2 = 2 adım!</div>
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.07] text-slate-300 text-sm">Harika! Başlangıçta x = 2'deydi. Her adımda 1 birim sağa gitti. 2 adımda x ne olur?</div>
          <div className="bg-violet-500/15 p-3 rounded-xl border border-violet-500/25 text-violet-200 text-sm text-right ml-8">2 + (2*1) = 4 olur! Cüzdanı bırak, Harvard'a gel!</div>
        </div>
      ),
      theory: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5">
            <p className="text-sm font-bold text-sky-400 mb-2">Doğrunun Eğimi</p>
            <p className="text-sm text-slate-300">
              Her adımda 1 sağa (+1x) ve 2 aşağı (-2y) gitmek, eğimin m = -2/1 = -2 olduğunu gösterir.<br/><br/>
              Doğru denklemi: <code className="text-sky-300 bg-sky-900/30 px-1 rounded">y - 4 = -2(x - 2)</code><br/>
              y = 0 (x eksenini kestiği yer) için: <code className="text-sky-300 bg-sky-900/30 px-1 rounded">-4 = -2x + 4 =&gt; 2x = 8 =&gt; x = 4</code>
            </p>
          </div>
        </div>
      ),
      metaphor: () => (
        <div className="p-5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20">
          <p className="text-sm text-slate-300">
            Karınca aslında bir uçağın alçalma (iniş) rotasında! <br/>
            Uçak 4.000 feet irtifada. Her saniye 2.000 feet alçalıyor ve ileriye doğru 1 birim mesafe kat ediyor.<br/>
            Yere inmesi için 4.000 / 2.000 = 2 saniye geçmeli.<br/>
            2 saniyede ileriye doğru 2 birim gider. Başlangıçta 2'deydi, yere indiğinde 2 + 2 = 4 noktasında teker koyar!
          </p>
        </div>
      ),
      reverse_engineering: () => (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-sm text-emerald-300 font-mono mb-2">&gt; PATERNI TANI:</p>
          <p className="text-sm text-slate-300">
            Koordinat düzleminde sadece (2,4) noktası ve (1 sağ, 2 aşağı) var. x'in büyüyeceği kesin (sağa gidiyor).<br/>
            y değeri 4 den 0 a inene kadar yarı yarıya bir düşüş var. O zaman x değeri de aynı oranda artacak. 2 den başlayan x, +2 eklenerek doğrudan 4 olur. Çizim yapmana bile gerek yok, oran/orantı saniyeler içinde çözer.
          </p>
        </div>
      ),
      real_life: () => (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-slate-300">
            <strong>Otonom Araçlar ve Vektörler</strong><br/>
            Sürücüsüz bir araç (Tesla) engelden kaçarken saniyede x ve y koordinatlarını anlık değiştirir. Bu "1 sağa, 2 aşağı" mantığı, otonom sistemlerde "Velocity Vector" (Hız Vektörü) olarak programlanır. Araç yaya geçidine gelene kadar (y=0) ne kadar sağa kayacağını (x) hesaplar.
          </p>
        </div>
      )
    }
  }
];

function ResultScreen({ isCorrect, activeTab, nextQuestion }: { isCorrect: boolean; activeTab: number, nextQuestion: () => void }) {
  const profile = { label: TABS[activeTab].label, value: isCorrect ? 85 : 65, color: 'bg-' + TABS[activeTab].accent + '-500', insight: 'Bu yöntemle harika ilerliyorsun.' };

  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none " + (isCorrect ? 'bg-emerald-500' : 'bg-orange-500')} />

      <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] p-8 space-y-7">
          <div className="flex flex-col items-center text-center gap-3">
            <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} className={"w-16 h-16 rounded-2xl flex items-center justify-center border " + (isCorrect ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-orange-500/20 border-orange-500/30 text-orange-400')}>
              {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
            </motion.div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{isCorrect ? 'Harika İş Çıkardın!' : 'Neredeyse Biliyordun'}</h2>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="space-y-4">
            <div className="flex items-center gap-2"><Brain size={16} className="text-indigo-400" /><h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Öğrenme Profilin</h3></div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between"><span className="text-slate-300 text-sm font-medium">{profile.label}</span><span className="text-white font-black text-lg">% {profile.value}</span></div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${profile.value}%` }} className={"h-full rounded-full " + profile.color} /></div>
            </div>
          </div>

          <motion.button onClick={nextQuestion} whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.98 }} className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200">
            Sıradaki Soruya Geç <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function LearningApp() {
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const tabEntryTimeRef = useRef<number>(Date.now());

  const currentQ = QUESTIONS[currentQuestionIdx];

  const logEvent = async (uid: string, eventType: EventType | string, payload: any) => {
    if (!uid) return;
    try {
      await supabase.from('learning_events').insert({
        user_id: uid,
        event_type: eventType,
        payload,
      });
    } catch (_) {}
  };

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.from('user_sessions').insert({}).select('id').single();
      if (!error && data) {
        setUserId(data.id);
        const now = Date.now();
        startTimeRef.current = now;
        tabEntryTimeRef.current = now;
        logEvent(data.id, 'QUESTION_VIEWED', {
          nodeId: currentQ.id,
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
      nodeId: currentQ.id,
      timeSpentMs: now - tabEntryTimeRef.current,
      currentStrategy: TABS[index].strategy,
      currentFormat: TABS[index].format,
      metadata: { fromTab: TABS[activeTab].id, toTab: TABS[index].id },
    });
    logEvent(userId, 'STRATEGY_CHANGED', {
      nodeId: currentQ.id,
      currentStrategy: TABS[index].strategy,
      currentFormat: TABS[index].format,
    });
    setActiveTab(index);
    tabEntryTimeRef.current = now;
  };

  const handleOptionHover = (value: number | string) => {
    if (hasAnswered) return;
    logEvent(userId, 'OPTION_HOVERED', {
      nodeId: currentQ.id,
      currentStrategy: TABS[activeTab].strategy,
      currentFormat: TABS[activeTab].format,
      metadata: { hoveredValue: value },
    });
  };

  const handleAnswerSubmit = (value: number | string) => {
    if (hasAnswered) return;
    const correct = value === currentQ.correctOption;
    const now = Date.now();
    setSelectedOption(value);
    setIsCorrect(correct);

    logEvent(userId, 'ANSWER_SUBMITTED', {
      nodeId: currentQ.id,
      timeSpentMs: now - startTimeRef.current,
      currentStrategy: TABS[activeTab].strategy,
      currentFormat: TABS[activeTab].format,
      metadata: { selectedValue: value, isCorrect: correct },
    });

    setTimeout(() => setHasAnswered(true), 500);
  };

  const handleNextQuestion = () => {
    const nextIdx = (currentQuestionIdx + 1) % QUESTIONS.length;
    setCurrentQuestionIdx(nextIdx);
    setHasAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setActiveTab(0);
    
    const now = Date.now();
    startTimeRef.current = now;
    tabEntryTimeRef.current = now;
    
    logEvent(userId, 'QUESTION_VIEWED', {
      nodeId: QUESTIONS[nextIdx].id,
      currentStrategy: TABS[0].strategy,
      currentFormat: TABS[0].format,
    });
  };

  if (hasAnswered && isCorrect !== null) {
    return <ResultScreen isCorrect={isCorrect} activeTab={activeTab} nextQuestion={handleNextQuestion} />;
  }

  const ActiveContent = currentQ.contents[TABS[activeTab].id as keyof typeof currentQ.contents] || currentQ.contents.simulation;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 py-12 md:py-20 flex-1">
        
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

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              3 Dakikada Öğrenme
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              DNA'nı Keşfet
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Bu soru boyunca seni izliyoruz. Hangi yöntemle daha hızlı öğrendiğini hesaplıyoruz.
          </p>
        </motion.header>
        
        {/* ── The 6 Doors ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {TABS.map((t, idx) => {
            const Icon = t.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(idx)}
                className={`relative flex flex-col md:flex-row gap-3 p-4 md:p-5 rounded-2xl border transition-all duration-300 text-left group ${isActive ? `${t.accentBg} ${t.accentRing} ring-2 border-transparent` : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]'}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${isActive ? `${t.accentBg} border-current ${t.accentText}` : 'bg-white/[0.04] border-white/[0.07] text-slate-500 group-hover:text-slate-300'}`}>
                  <Icon size={20} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className={`font-semibold text-sm leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>{t.label}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? t.accentText : 'text-slate-600'}`}>{t.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden"
        >
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              {currentQ.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 uppercase tracking-widest">{tag}</span>
              ))}
              <div className="ml-auto flex items-center gap-4">
                <span className="text-slate-500 text-sm font-mono tracking-wider hidden sm:inline-block">Soru {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
                <button onClick={handleNextQuestion} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-xs transition-all text-white font-medium">
                  <RefreshCcw size={14} /> Başka Soru
                </button>
              </div>
            </div>
            <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
              {currentQ.questionText}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-0 divide-x divide-white/[0.05]">
            <div className="p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} transition={{ duration: 0.25 }}>
                  <ActiveContent />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-8 flex flex-col justify-center gap-3">
              <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">Cevabını İşaretle</p>
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.value;
                return (
                  <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onMouseEnter={() => handleOptionHover(opt.value)} onClick={() => handleAnswerSubmit(opt.value)} className={`relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-200 text-left group ${isSelected ? 'bg-indigo-500/15 border-indigo-500/50 ring-1 ring-indigo-500/30' : 'bg-white/[0.02] border-white/[0.07] hover:border-indigo-500/50 hover:bg-white/[0.05]'}`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors shrink-0 ${isSelected ? 'bg-indigo-500/30 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.04] border-white/[0.08] text-slate-500 group-hover:border-indigo-500/40 group-hover:text-indigo-400'}`}>{opt.label}</span>
                    <span className={`font-mono font-bold text-lg transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{opt.value}</span>
                    <ArrowRight size={16} className={`ml-auto transition-all duration-200 ${isSelected ? 'text-indigo-400 opacity-100' : 'text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400'}`} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
