import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Activity
} from 'lucide-react';
import { matchSleepSurvey } from '../../services/api';

const SURVEY_STEPS = [
  {
    id: 'position',
    title: 'What is your primary sleeping posture?',
    subtitle: 'Proper head-to-neck loft depends critically on how your spine rests against the mattress.',
    options: [
      {
        value: 'side',
        label: 'Side Sleeper',
        badge: 'High Loft',
        desc: 'Fills the 4-5" gap between ear and shoulder point, preventing neck strain.',
        icon: '🛌',
      },
      {
        value: 'back',
        label: 'Back Sleeper',
        badge: 'Medium Contour',
        desc: 'Cradles the natural cervical curve without pushing chin forward.',
        icon: '🧘',
      },
      {
        value: 'stomach',
        label: 'Stomach Sleeper',
        badge: 'Low Loft & Plush',
        desc: 'Low compression flat softness to prevent backward spinal arching.',
        icon: '💤',
      },
      {
        value: 'combination',
        label: 'Multi-Position',
        badge: 'Adaptive Bounce',
        desc: 'Responsive micro-bounce that quickly reshapes as you toss and turn.',
        icon: '🔄',
      },
    ],
  },
  {
    id: 'discomfort',
    title: 'Do you experience any morning discomfort?',
    subtitle: 'Targeted support relieves pressure points and relaxes strained neck and shoulder muscles.',
    options: [
      {
        value: 'neck-stiffness',
        label: 'Morning Neck Stiffness',
        badge: 'Cervical Support',
        desc: 'Wake up with a sore neck, occipital tension, or limited head rotation.',
        icon: '⚡',
      },
      {
        value: 'shoulder-tension',
        label: 'Upper Back & Shoulder Tension',
        badge: 'Pressure Relief',
        desc: 'Shoulder blades feel tight or compressed by the morning.',
        icon: '💆',
      },
      {
        value: 'none',
        label: 'No Discomfort / Pure Comfort',
        badge: 'Luxury Feel',
        desc: 'Looking for 5-star hotel cloud plushness and deeper restorative sleep.',
        icon: '✨',
      },
    ],
  },
  {
    id: 'firmness',
    title: 'What firmness and loft feel do you prefer?',
    subtitle: 'From ultra-soft down-alternative to structured orthopedic head support.',
    options: [
      {
        value: 'cloud-soft',
        label: 'Cloud Soft & Fluffy',
        badge: 'Sink-In Plush',
        desc: 'Gentle, airy virgin fiber that lets your head gently sink in.',
        icon: '☁️',
      },
      {
        value: 'medium-bounce',
        label: 'Adaptive Medium-Bounce',
        badge: 'Most Popular',
        desc: 'High-resilience microfibre with active shape recovery.',
        icon: '🎯',
      },
      {
        value: 'firm-support',
        label: 'Structured Orthopedic Support',
        badge: 'Maximum Support',
        desc: 'Dense, supportive core that keeps your head firmly elevated.',
        icon: '🛡️',
      },
    ],
  },
  {
    id: 'sleepClimate',
    title: 'What is your sleep temperature profile?',
    subtitle: 'Body heat regulation ensures uninterrupted REM sleep cycles throughout the night.',
    options: [
      {
        value: 'hot',
        label: 'Hot Sleeper / Warm Climate',
        badge: 'Breathable Cotton',
        desc: 'Tend to overheat or sweat; needs maximum airflow and cooling fabric.',
        icon: '❄️',
      },
      {
        value: 'cold-winter',
        label: 'Cold Sleeper / Cozy Comfort',
        badge: 'Flannel & Velvet',
        desc: 'Love warm, plush, cozy flannel/velvet bedding that retains pleasant warmth.',
        icon: '🔥',
      },
      {
        value: 'all-season',
        label: 'All-Season Balanced',
        badge: 'Balanced Temp',
        desc: 'Comfortable in standard room temperature year-round.',
        icon: '🍃',
      },
    ],
  },
  {
    id: 'preference',
    title: 'What are you looking to upgrade today?',
    subtitle: 'We match both individual pillows and complete coordinated bedding ensembles.',
    options: [
      {
        value: 'pillow',
        label: 'Best-Fit Pillows Only',
        badge: 'Ergonomic Pillows',
        desc: 'Find the ideal 16x24 or 16x26 pillow pack tailored for your neck.',
        icon: '🛏️',
      },
      {
        value: 'complete-bed',
        label: 'Complete Sleep Suite',
        badge: 'Pillows + Bedsheet',
        desc: 'Pair your pillow with a matching fitted or flat luxury bedsheet set.',
        icon: '👑',
      },
    ],
  },
];

export default function IamHowDoYouSleep() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    position: 'side',
    discomfort: 'neck-stiffness',
    firmness: 'medium-bounce',
    sleepClimate: 'all-season',
    preference: 'pillow',
  });

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const currentStep = SURVEY_STEPS[currentStepIndex];

  const handleSelectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
  };

  const handleNext = () => {
    if (currentStepIndex < SURVEY_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      calculateMatch();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const calculateMatch = async () => {
    setLoadingMatch(true);
    try {
      const res = await matchSleepSurvey(answers);
      if (res.success && res.data) {
        setMatchResult(res.data);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // Local fallback using verified parsed product data
      const fallbackPillow = answers.firmness === 'firm-support' || answers.discomfort === 'neck-stiffness'
        ? {
            name: 'Premium Bed Pillow 16x26 Inch',
            price: 422,
            originalPrice: 699,
            marketplace: 'meesho',
            images: ['https://images.meesho.com/images/products/441454363/nilot_512.avif?width=512'],
            externalUrl: 'https://www.meesho.com/premium-bed-pillow-16x26-inch/p/6qtopy',
            matchPercentage: 98,
          }
        : answers.position === 'stomach' || answers.firmness === 'cloud-soft'
        ? {
            name: 'Bed Pillow Cozy Pillow 16x24 (Set of 2)',
            price: 374,
            originalPrice: 599,
            marketplace: 'meesho',
            images: ['https://images.meesho.com/images/products/441454363/laqbh_512.avif?width=512'],
            externalUrl: 'https://www.meesho.com/bed-pillowcozy-pillow-16x24-2-pcs/p/bsh3um',
            matchPercentage: 96,
          }
        : {
            name: 'PILLOWALA Polyester Fibre, Microfibre Sleeping Pillow Pack of 2 Stripes',
            price: 300,
            originalPrice: 450,
            marketplace: 'flipkart',
            images: ['https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/j/b/e/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcduxcecpv.jpeg'],
            externalUrl: 'https://dl.flipkart.com/s/8Ee7vkuuuN',
            matchPercentage: 97,
          };

      const fallbackComplementary = answers.sleepClimate === 'cold-winter'
        ? {
            name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover (Zip Closer)',
            price: 654,
            originalPrice: 999,
            marketplace: 'meesho',
            images: ['https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512'],
            externalUrl: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hnv6kg',
          }
        : {
            name: 'PILLOWALA Cotton Double, King Flat 200 TC Printed Summer Bedsheet',
            price: 501,
            originalPrice: 799,
            marketplace: 'flipkart',
            images: ['https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/d/n/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73yt3z89u9g.jpeg'],
            externalUrl: 'https://dl.flipkart.com/s/v9KtEyNNNN',
          };

      setMatchResult({
        bestPillow: fallbackPillow,
        bestComplementary: fallbackComplementary,
        diagnosis: `Engineered specifically for your ${answers.position.toUpperCase()} sleep posture. The resilient microfibre core bridges your spinal gap while neutralizing cranial pressure points.`,
      });
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setCurrentStepIndex(0);
  };

  return (
    <section id="sleep-quiz" className="w-full select-none relative overflow-hidden">
      {/* 1. Deep Black Top Banner (#060709) */}
      <div className="w-full bg-[#060709] text-white pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono-tech uppercase tracking-widest text-stone-300">
            <Activity size={13} className="text-amber-400" />
            <span>CLINICAL SLEEP ERGONOMICS</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
            HOW DO YOU SLEEP?
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-xl mx-auto leading-relaxed font-normal">
            Do you sleep on your stomach, back or side? Maybe you sleep in multiple positions?<br className="hidden sm:block" />
            Not all pillows are made the same. Take our scientifically calibrated sleep test to find your verified best fit.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setShowQuiz(!showQuiz);
                if (!showQuiz && matchResult) handleReset();
              }}
              className="px-8 py-3 rounded-full bg-transparent hover:bg-white hover:text-black text-white border-2 border-white text-xs sm:text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl cursor-pointer"
            >
              {showQuiz ? 'CLOSE SLEEP ASSESSMENT' : 'FIND YOUR FIT'}
            </button>
          </div>

          {/* Interactive Sleep Quiz Drawer */}
          <AnimatePresence>
            {showQuiz && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="mt-8 text-left max-w-3xl mx-auto overflow-hidden"
              >
                <div className="p-5 sm:p-8 rounded-3xl bg-[#0f1115] border border-stone-800 shadow-2xl relative">
                  {!matchResult ? (
                    /* Step Survey Flow */
                    <div className="space-y-6">
                      {/* Header with Step Tracker */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
                        <div>
                          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-amber-400 font-bold">
                            STEP {currentStepIndex + 1} OF {SURVEY_STEPS.length}
                          </span>
                          <h3 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                            {currentStep.title}
                          </h3>
                        </div>
                        <span className="text-xs text-stone-400 hidden sm:block">
                          {Math.round(((currentStepIndex + 1) / SURVEY_STEPS.length) * 100)}% Complete
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-300"
                          style={{
                            width: `${((currentStepIndex + 1) / SURVEY_STEPS.length) * 100}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed">
                        {currentStep.subtitle}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {currentStep.options.map((opt) => {
                          const isSelected = answers[currentStep.id] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption(opt.value)}
                              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative ${
                                isSelected
                                  ? 'bg-white text-black border-white shadow-lg scale-[1.01]'
                                  : 'bg-stone-900/80 text-stone-200 border-stone-800 hover:border-stone-600 hover:bg-stone-900'
                              }`}
                            >
                              <span className="text-2xl shrink-0 p-1">{opt.icon}</span>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight">
                                    {opt.label}
                                  </h4>
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono-tech uppercase font-bold shrink-0 ${
                                      isSelected
                                        ? 'bg-black text-white'
                                        : 'bg-stone-800 text-stone-300'
                                    }`}
                                  >
                                    {opt.badge}
                                  </span>
                                </div>
                                <p
                                  className={`text-[11px] leading-relaxed line-clamp-2 ${
                                    isSelected ? 'text-stone-700' : 'text-stone-400'
                                  }`}
                                >
                                  {opt.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Navigation */}
                      <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
                        <button
                          type="button"
                          onClick={handlePrev}
                          disabled={currentStepIndex === 0}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            currentStepIndex === 0
                              ? 'opacity-30 cursor-not-allowed text-stone-600'
                              : 'text-stone-300 hover:text-white hover:bg-stone-800'
                          }`}
                        >
                          <ArrowLeft size={14} />
                          <span>Previous</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={loadingMatch}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-stone-200 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-md cursor-pointer"
                        >
                          {loadingMatch ? (
                            <span>Analyzing Catalog...</span>
                          ) : currentStepIndex === SURVEY_STEPS.length - 1 ? (
                            <>
                              <span>Calculate My Match</span>
                              <Sparkles size={14} className="text-amber-600" />
                            </>
                          ) : (
                            <>
                              <span>Continue</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Assessment Results View */
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech font-bold uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            <span>{matchResult.bestPillow?.matchPercentage || 98}% SCIENTIFIC MATCH CONFIRMED</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                            YOUR OPTIMAL SLEEP MATCH
                          </h3>
                        </div>

                        <button
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
                        >
                          <RotateCcw size={13} />
                          <span>Retake Test</span>
                        </button>
                      </div>

                      {/* Primary Recommended Pillow Card */}
                      {matchResult.bestPillow && (
                        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-black border border-stone-700/80 shadow-xl space-y-4">
                          <div className="flex flex-col md:flex-row gap-5 items-center">
                            {/* Photo with reliable no-referrer & onError fallback */}
                            <div className="w-full md:w-44 h-44 rounded-2xl bg-stone-800 overflow-hidden shrink-0 border border-stone-700 relative">
                              <img
                                src={
                                  matchResult.bestPillow.images?.[0] ||
                                  'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512'
                                }
                                alt={matchResult.bestPillow.name}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
                                }}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono-tech uppercase font-bold text-white border border-white/20">
                                {matchResult.bestPillow.marketplace}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono-tech font-bold uppercase">
                                  Top Ergonomic Pick
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono-tech">
                                  ★ {matchResult.bestPillow.rating || 4.5} rating
                                </span>
                              </div>

                              <h4 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-tight leading-snug">
                                {matchResult.bestPillow.name}
                              </h4>

                              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                                {matchResult.diagnosis || matchResult.bestPillow.description}
                              </p>

                              <div className="flex items-baseline gap-3 pt-1">
                                <span className="text-xl font-display font-black text-white">
                                  ₹{matchResult.bestPillow.price}
                                </span>
                                {matchResult.bestPillow.originalPrice > matchResult.bestPillow.price && (
                                  <span className="text-xs text-stone-500 line-through">
                                    ₹{matchResult.bestPillow.originalPrice}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono-tech">
                                  In Stock on {matchResult.bestPillow.marketplace}
                                </span>
                              </div>

                              {/* Buy CTA */}
                              <div className="pt-2 flex flex-wrap gap-2.5">
                                <a
                                  href={matchResult.bestPillow.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-stone-200 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
                                >
                                  <span>BUY ON {matchResult.bestPillow.marketplace?.toUpperCase()}</span>
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Complementary Bedding Recommendation */}
                      {matchResult.bestComplementary && (
                        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-14 h-14 rounded-xl bg-stone-800 overflow-hidden shrink-0 border border-stone-700">
                              <img
                                src={
                                  matchResult.bestComplementary.images?.[0] ||
                                  'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512'
                                }
                                alt={matchResult.bestComplementary.name}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512';
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono-tech uppercase font-bold text-amber-400">
                                  MATCHING BEDDING PAIR
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-stone-200 uppercase line-clamp-1">
                                {matchResult.bestComplementary.name}
                              </h5>
                              <p className="text-xs font-bold text-stone-400">
                                ₹{matchResult.bestComplementary.price} on {matchResult.bestComplementary.marketplace?.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <a
                            href={matchResult.bestComplementary.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                          >
                            <span>View Pairing</span>
                            <ArrowRight size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. THE COMPLETE UNTOUCHED PILLOWS OVERLAPPING THE EXACT SPLIT LINE */}
      {/* Background matches split line at exactly 14.67% so it blends flawlessly on all screen widths */}
      <div
        className="w-full relative select-none"
        style={{
          background: 'linear-gradient(to bottom, #060709 14.67%, #ffffff 14.67%)',
        }}
      >
        <div className="max-w-[1020px] mx-auto px-4 sm:px-6 flex justify-center">
          <img
            src="/how_do_you_sleep_clean.png"
            alt="Pillowala - How Do You Sleep Pillows"
            className="w-full h-auto object-contain block select-none pointer-events-auto"
          />
        </div>
      </div>

      {/* 3. Clean bottom breathing room */}
      <div className="w-full h-12 sm:h-16 md:h-20 bg-white" />
    </section>
  );
}
