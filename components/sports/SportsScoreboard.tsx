'use client';

import { ChevronLeft, ChevronRight, Trophy, X, MapPin, Clock, Info, Radio, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { refreshCricketScoresAction, getMatchDetailsAction } from '@/lib/actions/sports-actions';
import { PointsTableEntry, PlayerStatsEntry } from '@/lib/types';

export function SportsScoreboard({ initialMatches = [] }: { initialMatches?: any[] }) {
  const { language, t } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>(initialMatches);
  const [dynamicStats, setDynamicStats] = useState<any>({
    pointsTable: [],
    topBatters: [],
    topBowlers: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<'LIVE' | 'UPCOMING' | 'PREVIOUS' | 'POINTS'>(() => {
    if (initialMatches.some(m => m.status === 'LIVE')) return 'LIVE';
    if (initialMatches.some(m => m.status === 'UPCOMING')) return 'UPCOMING';
    if (initialMatches.some(m => m.status === 'PREVIOUS')) return 'PREVIOUS';
    return 'LIVE';
  });

  const refreshScores = useCallback(async (isAuto = false) => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const result = await refreshCricketScoresAction();
      if (result.success && result.data) {
        // Handle new nested data structure
        const matchData = Array.isArray(result.data) ? result.data : result.data.matches;
        const statsData = result.data.stats;
        
        if (matchData) {
          setMatches(matchData);
          // Auto-switch to a tab that has data
          setActiveTab(prev => {
            const hasData = (tab: string) => matchData.some((m: any) => m.status === tab);
            if (hasData('LIVE')) return 'LIVE';
            if (hasData('UPCOMING')) return 'UPCOMING';
            if (hasData('PREVIOUS')) return 'PREVIOUS';
            return prev;
          });
        }
        if (statsData) setDynamicStats(statsData);
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to refresh scores:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => refreshScores(true), 120000);
    return () => clearInterval(interval);
  }, [refreshScores]);

  // Sync selectedMatch with updated matches to ensure modal stays live
  useEffect(() => {
    if (selectedMatch) {
      const updated = matches.find(m => m.id === selectedMatch.id);
      if (updated) setSelectedMatch((prev: any) => ({ ...prev, ...updated }));
    }
  }, [matches, selectedMatch?.id]);

  const handleMatchClick = useCallback(async (match: any) => {
    // Show the modal immediately with basic info
    setSelectedMatch(match);
    setModalLoading(true);
    try {
      const result = await getMatchDetailsAction(match.id);
      if (result.success && result.data) {
        setSelectedMatch((prev: any) => ({
          ...prev,
          batting: result.data!.batting,
          bowling: result.data!.bowling,
          recentOvers: result.data!.recentOvers,
          partnership: result.data!.partnership,
          lastWicket: result.data!.lastWicket,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch match details:', err);
    } finally {
      setModalLoading(false);
    }
  }, []);
  
  const pointsTableData = dynamicStats.pointsTable;
  const topBattersData = dynamicStats.topBatters;
  const topBowlersData = dynamicStats.topBowlers;

  // Use only live API matches
  const filteredMatches = matches
    .filter(m => m.status === activeTab)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    .slice(0, 10);
  
  const hasLive = matches.some(m => m.status === 'LIVE');
  const hasUpcoming = matches.some(m => m.status === 'UPCOMING');

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950/20 border-b border-border py-10 mb-12 selection:bg-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 overflow-hidden">
           <div className="flex flex-col gap-1">
             <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.3em] text-primary">
                <span className="w-6 h-px bg-primary/30" />
                {language === 'hi' ? 'ताज़ा स्कोर' : 'LATEST SCORES'}
             </h3>
             <div className="flex items-center gap-3 ml-8">
               <p className={`text-[10px] text-muted-foreground font-bold tracking-widest uppercase ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'hi' ? 'विशेष क्रिकेट कवरेज' : 'EXCLUSIVE CRICKET COVERAGE'}
               </p>
               <div className="h-1 w-1 rounded-full bg-zinc-300" />
               <span 
                 suppressHydrationWarning
                 className="text-[9px] font-black text-zinc-400 tracking-tighter uppercase tabular-nums"
               >
                  Updated: {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
               </span>
             </div>
           </div>

           {/* Premium Tab Switcher & Refresh */}
           <div className="flex items-center gap-3">
              <div className="flex bg-white dark:bg-zinc-900 p-1 border border-border shadow-sm rounded-sm">
                 {[
                   { id: 'LIVE', label: language === 'hi' ? 'लाइव' : 'LIVE' },
                   { id: 'UPCOMING', label: language === 'hi' ? 'आगामी' : 'UPCOMING' },
                   { id: 'PREVIOUS', label: language === 'hi' ? 'पूरा हुआ' : 'RECENT' },
                   { id: 'POINTS', label: language === 'hi' ? 'पॉइंट्स टेबल' : 'POINTS TABLE' }
                 ].map((tab) => (
                <button
                  key={tab.id}
                  suppressHydrationWarning
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                    activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary shadow-lg shadow-primary/20"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            <button
               onClick={() => refreshScores()}
               disabled={isRefreshing}
               suppressHydrationWarning
               className={`h-9 px-4 flex items-center gap-2 bg-white dark:bg-zinc-900 border border-border shadow-sm rounded-sm text-[9px] font-black uppercase tracking-widest transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 ${isRefreshing ? 'text-primary' : 'text-muted-foreground'}`}
            >
               {isRefreshing ? (
                 <Loader2 className="h-3 w-3 animate-spin" />
               ) : (
                 <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
               )}
               {isRefreshing ? (language === 'hi' ? 'अपडेट हो रहा है' : 'REFRESHING') : (language === 'hi' ? 'रिफ्रेश' : 'REFRESH')}
            </button>
           </div>
           
           <div className="hidden md:flex gap-3">
              <button 
                suppressHydrationWarning
                className="h-10 w-10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-border bg-white dark:bg-zinc-900 rounded-full shadow-sm group"
              >
                <ChevronLeft className="h-5 w-5 group-active:-translate-x-1 transition-transform" />
              </button>
              <button 
                suppressHydrationWarning
                className="h-10 w-10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-border bg-white dark:bg-zinc-900 rounded-full shadow-sm group"
              >
                <ChevronRight className="h-5 w-5 group-active:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory min-h-[100px]">
          {activeTab === 'POINTS' ? (
            <div className="w-full flex flex-col">
              <div className="bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-sm overflow-hidden overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                     <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-border">
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Pos</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Team</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">P</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">W</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">L</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">PTS</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">NRR</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pointsTableData.map((item: PointsTableEntry) => (
                      <tr key={item.rank} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-black text-zinc-400">{item.rank}</td>
                        <td className="px-6 py-4 text-xs font-bold text-foreground">{item.team}</td>
                        <td className="px-6 py-4 text-xs font-bold text-center text-zinc-500">{item.matches}</td>
                        <td className="px-6 py-4 text-xs font-bold text-center text-emerald-600">{item.won}</td>
                        <td className="px-6 py-4 text-xs font-bold text-center text-red-600">{item.lost}</td>
                        <td className="px-6 py-4 text-xs font-black text-center text-primary">{item.pts}</td>
                        <td className="px-6 py-4 text-[10px] font-mono font-bold text-center text-zinc-400">{item.nrr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
                 {/* Orange Cap */}
                 <div className="bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-sm overflow-hidden">
                    <div className="bg-orange-500 px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest">
                       Orange Cap (Most Runs)
                    </div>
                    <table className="w-full text-left">
                       <tbody className="divide-y divide-border">
                          {topBattersData.map((p: PlayerStatsEntry) => (
                             <tr key={p.name} className="text-xs">
                                <td className="px-4 py-3 font-black text-zinc-400 w-8">{p.rank}</td>
                                <td className="px-4 py-3 font-bold">{p.name} ({p.team})</td>
                                <td className="px-4 py-3 font-black text-right text-orange-600">{p.runs}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 {/* Purple Cap */}
                 <div className="bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-sm overflow-hidden">
                    <div className="bg-purple-600 px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest">
                       Purple Cap (Most Wickets)
                    </div>
                    <table className="w-full text-left">
                       <tbody className="divide-y divide-border">
                          {topBowlersData.map((p: PlayerStatsEntry) => (
                             <tr key={p.name} className="text-xs">
                                <td className="px-4 py-3 font-black text-zinc-400 w-8">{p.rank}</td>
                                <td className="px-4 py-3 font-bold">{p.name} ({p.team})</td>
                                <td className="px-4 py-3 font-black text-right text-purple-600">{p.wickets}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          ) : (
          filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <motion.div 
                key={match.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => handleMatchClick(match)}
                className="min-w-[320px] sm:min-w-[400px] bg-white dark:bg-zinc-900 border border-border/60 shadow-xl shadow-black/5 rounded-sm overflow-hidden snap-start flex-shrink-0 group cursor-pointer"
              >
               {/* Header */}
               <div className={`${match.status === 'UPCOMING' ? 'bg-[#0a0a0a]' : (match.status === 'LIVE' ? 'bg-red-900/90' : 'bg-[#1a367c]')} px-5 py-3 flex justify-between items-center text-white text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-1/2" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${match.status === 'UPCOMING' ? 'bg-zinc-500 animate-pulse' : 'bg-white animate-pulse'}`} />
                    {match.status}
                  </span>
                  <button 
                    suppressHydrationWarning
                    className="relative z-10 flex items-center gap-1 hover:text-primary-foreground/80 transition-colors"
                  >
                    SCORECARD <ChevronRight className="h-3 w-3" />
                  </button>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-sm border border-border/40">
                    <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">
                      {language === 'hi' ? `मैच ${match.matchNo}` : `MATCH ${match.matchNo}`}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {match.date}
                    </p>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div 
                            className="w-1.5 h-10 rounded-full" 
                            style={{ backgroundColor: match.team1.color || '#1a367c' }}
                          />
                          <div className="flex flex-col">
                            <span className={`font-black text-xl tracking-tight text-foreground transition-colors group-hover:text-primary ${language === 'hi' ? 'font-hindi-serif' : 'font-serif'}`}>
                              {language === 'hi' && match.team1.nameHi ? match.team1.nameHi : match.team1.nameEn}
                            </span>
                            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest -mt-1">
                              {match.status === 'UPCOMING' ? 'NOT STARTED' : 'INNINGS 1'}
                            </span>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          {match.status === 'UPCOMING' ? (
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PENDING</span>
                          ) : (
                            <>
                              <span className="font-black text-2xl tracking-tighter tabular-nums">{match.team1.score}</span>
                              <span className="text-[10px] text-muted-foreground font-bold tracking-tighter">({match.team1.overs} ov)</span>
                            </>
                          )}
                       </div>
                    </div>

                    <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/50 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white dark:bg-zinc-900 text-[8px] font-black text-zinc-300 dark:text-zinc-700 tracking-[0.5em]">VS</div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div 
                            className="w-1.5 h-10 rounded-full" 
                            style={{ backgroundColor: match.team2.color || '#6b7280' }}
                          />
                          <div className="flex flex-col">
                            <span className={`font-black text-xl tracking-tight text-foreground transition-colors group-hover:text-primary ${language === 'hi' && match.team2.nameHi ? match.team2.nameHi : match.team2.nameEn}`}>
                              {language === 'hi' && match.team2.nameHi ? match.team2.nameHi : match.team2.nameEn}
                            </span>
                            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest -mt-1">
                              {match.status === 'UPCOMING' ? 'NOT STARTED' : 'INNINGS 2'}
                            </span>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          {match.status === 'UPCOMING' ? (
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PENDING</span>
                          ) : (
                            <>
                              <span className="font-black text-2xl tracking-tighter tabular-nums">{match.team2.score}</span>
                              <span className="text-[10px] text-muted-foreground font-bold tracking-tighter">({match.team2.overs} ov)</span>
                            </>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className={`mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-bold leading-relaxed text-center group-hover:text-foreground transition-colors ${language === 'hi' ? 'font-hindi text-zinc-500' : 'italic font-serif text-zinc-400'}`}>
                    {match.status === 'UPCOMING' ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-primary">{match.time}</span>
                          <span className="text-[9px] text-zinc-400 uppercase tracking-widest">{match.venue}</span>
                        </div>
                    ) : (
                      language === 'hi' ? (match.resultHi || match.result) : (match.resultEn || match.result)
                    )}
                  </div>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 border border-dashed border-border/60 rounded-sm bg-white/50 dark:bg-zinc-900/50 gap-3">
             <Trophy className="h-8 w-8 text-primary/20 mb-1" />
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {language === 'hi' ? 'कोई IPL मैच नहीं मिला' : `NO IPL ${activeTab} MATCHES`}
             </p>
             <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">
               {language === 'hi' ? 'बाद में दोबारा जांचें' : 'Check back later or refresh'}
             </p>
          </div>
          )
        )}
        </div>
      </div>

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMatch(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-sm overflow-hidden shadow-2xl border border-white/10"
            >
              {/* Modal Header */}
              <div className={`${selectedMatch.status === 'UPCOMING' ? 'bg-[#0a0a0a]' : (selectedMatch.status === 'LIVE' ? 'bg-red-900/90' : 'bg-[#1a367c]')} p-6 text-white flex justify-between items-start`}>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <Trophy className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          {selectedMatch.isIPL ? 'INDIAN PREMIER LEAGUE' : 'INTERNATIONAL MATCH'}
                       </span>
                    </div>
                    <h2 className={`text-2xl font-black tracking-tighter ${language === 'hi' ? 'font-hindi-serif' : 'font-serif italic'}`}>
                        {selectedMatch.matchNo}
                    </h2>
                 </div>
                 <button 
                   onClick={() => setSelectedMatch(null)}
                   className="p-2 hover:bg-white/10 rounded-full transition-colors"
                 >
                    <X className="h-6 w-6" />
                 </button>
              </div>

               <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Head to Head Scoring */}
                  <div className="space-y-4">
                     {/* Team 1 Large */}
                     <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-border/40">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-12 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: selectedMatch.team1.color || '#1a367c' }} />
                           <div className="flex flex-col">
                              <span className={`text-2xl font-black tracking-tighter ${language === 'hi' && selectedMatch.team1.nameHi ? 'font-hindi-serif' : 'font-serif italic'}`}>
                                 {language === 'hi' && selectedMatch.team1.nameHi ? selectedMatch.team1.nameHi : selectedMatch.team1.nameEn}
                              </span>
                              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">INNINGS 1</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           {selectedMatch.status === 'UPCOMING' ? (
                              <span className="text-sm font-black text-muted-foreground/40 tracking-widest uppercase">TBA</span>
                           ) : (
                              <>
                                 <span className="text-3xl font-black tracking-tighter tabular-nums">{selectedMatch.team1.score}</span>
                                 <span className="text-[10px] font-bold text-muted-foreground">({selectedMatch.team1.overs} ov)</span>
                              </>
                           )}
                        </div>
                     </div>

                     {/* Team 2 Large */}
                     <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-border/40">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-12 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: selectedMatch.team2.color || '#6b7280' }} />
                           <div className="flex flex-col">
                              <span className={`text-2xl font-black tracking-tighter ${language === 'hi' && selectedMatch.team2.nameHi ? 'font-hindi-serif' : 'font-serif italic'}`}>
                                 {language === 'hi' && selectedMatch.team2.nameHi ? selectedMatch.team2.nameHi : selectedMatch.team2.nameEn}
                              </span>
                              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">INNINGS 2</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           {selectedMatch.status === 'UPCOMING' ? (
                              <span className="text-sm font-black text-muted-foreground/40 tracking-widest uppercase">TBA</span>
                           ) : (
                              <>
                                 <span className="text-3xl font-black tracking-tighter tabular-nums">{selectedMatch.team2.score}</span>
                                 <span className="text-[10px] font-bold text-muted-foreground">({selectedMatch.team2.overs} ov)</span>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Match Info Summary */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-md border border-border/30">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Venue</span>
                        <span className="text-xs font-bold text-foreground">{selectedMatch.venue}</span>
                     </div>
                     <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-md border border-border/30">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                        <span className="text-xs font-bold text-primary">{selectedMatch.status === 'LIVE' ? 'LIVE NOW' : (selectedMatch.status === 'PREVIOUS' ? 'MATCH COMPLETED' : 'UPCOMING')}</span>
                     </div>
                  </div>

                  {/* Detailed Stats Section (Cricbuzz Style) */}
                   {modalLoading ? (
                     <div className="flex flex-col items-center justify-center py-12 gap-3">
                       <Loader2 className="h-7 w-7 animate-spin text-primary" />
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Loading Scorecard...</p>
                     </div>
                   ) : (selectedMatch.batting || selectedMatch.bowling) ? (
                     <div className="space-y-6">
                      {/* Batting Table */}
                      {selectedMatch.batting && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-primary rounded-full" /> BATTING STATS
                          </h4>
                          <div className="border border-border/60 rounded-sm overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                            <table className="w-full text-[11px] text-left">
                              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/60">
                                <tr>
                                  <th className="py-2 px-4">Batter</th>
                                  <th className="py-2 px-2 text-center">R</th>
                                  <th className="py-2 px-2 text-center">B</th>
                                  <th className="py-2 px-2 text-center">4s</th>
                                  <th className="py-2 px-2 text-center">6s</th>
                                  <th className="py-2 px-2 text-center">SR</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                {selectedMatch.batting.map((b: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="py-2.5 px-4 font-bold text-foreground">{b.name}*</td>
                                    <td className="py-2.5 px-2 text-center font-black">{b.runs}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.balls}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.fours}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.sixes}</td>
                                    <td className="py-2.5 px-2 text-center font-bold text-primary">{b.sr}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Bowling Table */}
                      {selectedMatch.bowling && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> BOWLING STATS
                          </h4>
                          <div className="border border-border/60 rounded-sm overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                            <table className="w-full text-[11px] text-left">
                              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/60">
                                <tr>
                                  <th className="py-2 px-4">Bowler</th>
                                  <th className="py-2 px-2 text-center">O</th>
                                  <th className="py-2 px-2 text-center">M</th>
                                  <th className="py-2 px-2 text-center">R</th>
                                  <th className="py-2 px-2 text-center">W</th>
                                  <th className="py-2 px-2 text-center">Eco</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                {selectedMatch.bowling.map((b: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="py-2.5 px-4 font-bold text-foreground">{b.name}</td>
                                    <td className="py-2.5 px-2 text-center font-black">{b.overs}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.maidens}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.runs}</td>
                                    <td className="py-2.5 px-2 text-center font-black text-emerald-600">{b.wickets}</td>
                                    <td className="py-2.5 px-2 text-center text-zinc-500">{b.econ}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Live Indicators */}
                      {selectedMatch.status === 'LIVE' && selectedMatch.recentOvers && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                           <div className="p-4 bg-zinc-900 text-white rounded-lg border border-zinc-800 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                 <Radio size={40} />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-2">RECENT OVERS</span>
                              <div className="text-sm font-black tracking-widest flex items-center gap-3">
                                 {selectedMatch.recentOvers.split(' ').map((ball: string, i: number) => (
                                    <span key={i} className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] ${ball.includes('w') || ball.includes('wd') ? 'bg-zinc-800 text-zinc-400' : (ball === '4' || ball === '6' ? 'bg-primary text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-700 text-zinc-300')}`}>
                                       {ball}
                                    </span>
                                 ))}
                              </div>
                           </div>
                           <div className="p-4 bg-emerald-950/20 text-emerald-900 dark:text-emerald-400 rounded-lg border border-emerald-900/20">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700/60 block mb-2">PARTNERSHIP</span>
                              <p className="text-xl font-black tracking-tighter tabular-nums">{selectedMatch.partnership} <span className="text-[10px] font-bold text-emerald-600/60 uppercase">runs</span></p>
                              {selectedMatch.lastWicket && (
                                <p className="text-[9px] font-medium text-emerald-800/40 mt-1 uppercase tracking-tight">Last Wkt: {selectedMatch.lastWicket}</p>
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-10 text-center gap-2 border border-dashed border-border/40 rounded-sm">
                       <Info className="h-5 w-5 text-muted-foreground/30" />
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                         {selectedMatch.status === 'UPCOMING' ? 'Match has not started yet' : 'Scorecard unavailable'}
                       </p>
                     </div>
                   )}

                  {/* Match Result Footer Callout */}
                  <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800 flex items-center justify-center gap-4 text-center shadow-2xl">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary animate-pulse">
                        <Info className="h-5 w-5" />
                     </div>
                     <p className={`text-lg font-black leading-snug text-white tracking-tight ${language === 'hi' ? 'font-hindi' : 'italic font-serif'}`}>
                        {language === 'hi' ? (selectedMatch.resultHi || selectedMatch.result) : (selectedMatch.resultEn || selectedMatch.result)}
                     </p>
                  </div>
               </div>

              {/* Action Bar */}
              <div className="px-8 py-5 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-border flex justify-between items-center">
                 <span className="text-[10px] font-black text-muted-foreground tracking-widest">DATA SOURCE: CRICBUZZ</span>
                 <button 
                  onClick={() => setSelectedMatch(null)}
                  className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
                 >
                   CLOSE DETAILS
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
