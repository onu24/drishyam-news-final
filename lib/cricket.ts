import 'server-only';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

// Cricbuzz IPL 2026 Series ID (will be dynamically resolved)
const IPL_2026_SERIES_ID_FALLBACK = '9237'; // Update if needed

const HEADERS = {
  'X-RapidAPI-Key': RAPIDAPI_KEY || '',
  'X-RapidAPI-Host': RAPIDAPI_HOST || '',
  'x-api-key': RAPIDAPI_KEY || '',
  'x-api-host': RAPIDAPI_HOST || '',
};

export async function getLiveCricketScores() {
  // Use CricAPI as primary as requested by user with the new key
  if (!CRICKET_API_KEY) return [];

  try {
    const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${CRICKET_API_KEY}`, {
       next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        // Filter ONLY IPL matches
        const iplOnly = (data.data || []).filter((m: any) => {
          const name = (m.name || '').toLowerCase();
          const series = (m.series || '').toLowerCase();
          return name.includes('ipl') || 
                 name.includes('indian premier league') || 
                 series.includes('ipl') ||
                 series.includes('indian premier league') ||
                 isIPLTeamMatch(m.teams?.[0] || '', m.teams?.[1] || '');
        });
        
        if (iplOnly.length > 0) {
          return mapCricApiData(iplOnly);
        }
      }
    }
    
    // Fallback to Cricbuzz RapidAPI if CricAPI fails or has no IPL matches
    if (RAPIDAPI_KEY) {
      return await getCricbuzzLiveScores();
    }
    
    return [];
  } catch (error: any) {
    console.error('[CricketAPI] Primary fetch failed:', error);
    if (RAPIDAPI_KEY) return await getCricbuzzLiveScores();
    return [];
  }
}

async function getCricbuzzLiveScores() {
  if (!RAPIDAPI_KEY) return [];
  try {
    const urls = [
      `https://${RAPIDAPI_HOST}/matches/v1/live`,
      `https://${RAPIDAPI_HOST}/matches/v1/upcoming`,
      `https://${RAPIDAPI_HOST}/matches/v1/recent`
    ];

    const responses = await Promise.all(
      urls.map(url => {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 10000);
        return fetch(url, { 
          headers: HEADERS, 
          next: { revalidate: 60 }, 
          signal: ctrl.signal
        })
        .then(res => { clearTimeout(tid); return res; })
        .catch(() => null);
      })
    );

    const liveData = responses[0]?.ok ? await responses[0].json().catch(() => null) : null;
    const upcomingData = responses[1]?.ok ? await responses[1].json().catch(() => null) : null;
    const recentData = responses[2]?.ok ? await responses[2].json().catch(() => null) : null;

    const allTypeMatches: any[] = [];
    if (liveData?.typeMatches) allTypeMatches.push(...liveData.typeMatches);
    if (upcomingData?.typeMatches) allTypeMatches.push(...upcomingData.typeMatches);
    if (recentData?.typeMatches) allTypeMatches.push(...recentData.typeMatches);

    return mapCricbuzzData(allTypeMatches);
  } catch (err) {
    return [];
  }
}

export async function getCricketStats() {
  if (!RAPIDAPI_KEY) return { pointsTable: [], topBatters: [], topBowlers: [] };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout for stats

  try {
    // Try to find the latest IPL series ID. 
    let seriesId = "7607"; // Fallback to 2024
    
    // Attempt to get series list
    try {
      const listRes = await fetch(`https://${RAPIDAPI_HOST}/series/v1/list`, { 
        headers: HEADERS, 
        next: { revalidate: 86400 },
        signal: controller.signal 
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const iplSeries = listData?.series?.find((s: any) => 
          s.seriesName.toLowerCase().includes('indian premier league') || 
          s.seriesName.toLowerCase().includes('ipl')
        );
        if (iplSeries) seriesId = iplSeries.seriesId.toString();
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.warn("[CricbuzzAPI] Series list fetch timed out");
      } else {
        console.warn("[CricbuzzAPI] Could not fetch series list, using fallback ID");
      }
    }

    const statUrls = [
      `https://${RAPIDAPI_HOST}/series/v1/${seriesId}/points-table`,
      `https://${RAPIDAPI_HOST}/stats/v1/series/${seriesId}/most-runs`,
      `https://${RAPIDAPI_HOST}/stats/v1/series/${seriesId}/most-wickets`
    ];

    const responses = await Promise.all(
      statUrls.map(url => 
        fetch(url, { 
          headers: HEADERS, 
          next: { revalidate: 3600 }, 
          signal: controller.signal 
        }).catch(err => {
          console.warn(`[CricbuzzAPI] Stat fetch error for ${url}:`, err.name);
          return null;
        })
      )
    );

    const [pointsRes, battersRes, bowlersRes] = responses;

    const pointsData = pointsRes?.ok ? await pointsRes.json().catch(() => null) : null;
    const battersData = battersRes?.ok ? await battersRes.json().catch(() => null) : null;
    const bowlersData = bowlersRes?.ok ? await bowlersRes.json().catch(() => null) : null;

    return {
      pointsTable: mapPointsTable(pointsData),
      topBatters: mapPlayerStats(battersData, 'runs'),
      topBowlers: mapPlayerStats(bowlersData, 'wickets')
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('[CricbuzzAPI] Stats operation timed out');
    } else {
      console.error('[CricbuzzAPI] Stats fetch error:', error);
    }
    return { pointsTable: [], topBatters: [], topBowlers: [] };
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapPointsTable(data: any) {
  if (!data?.pointsTable?.[0]?.pointsTableInfo) return [];
  return data.pointsTable[0].pointsTableInfo.map((team: any, index: number) => ({
    rank: index + 1,
    team: team.teamName,
    matches: team.played,
    won: team.won,
    lost: team.lost,
    nr: team.noResult,
    pts: team.points,
    nrr: team.nrr
  }));
}

function mapPlayerStats(data: any, type: 'runs' | 'wickets') {
  if (!data?.stats) return [];
  return data.stats.slice(0, 5).map((p: any, index: number) => ({
    rank: index + 1,
    name: p.playerName,
    team: p.teamName || 'Team',
    [type]: type === 'runs' ? p.value : p.value,
    avg: p.average,
    sr: p.strikeRate
  }));
}


// Helper: detect if both teams are IPL franchises
function isIPLTeamMatch(t1: string, t2: string): boolean {
  const IPL_TEAMS = ['chennai', 'csk', 'mumbai', 'mi ', ' mi', 'rcb', 'bangalore', 'kolkata', 'kkr',
    'rajasthan royals', ' rr', 'hyderabad', 'srh', 'delhi', 'dc ', ' dc', 'lucknow', 'lsg',
    'gujarat', 'titans', 'gt ', ' gt', 'punjab', 'pbks'];
  const a = t1.toLowerCase();
  const b = t2.toLowerCase();
  return IPL_TEAMS.some(x => a.includes(x)) && IPL_TEAMS.some(x => b.includes(x));
}

function mapCricbuzzData(typeMatches: any[]) {
  const flattened: any[] = [];
  if (!Array.isArray(typeMatches)) return [];

  typeMatches.forEach((group: any) => {
    if (!group.seriesMatches) return;
    group.seriesMatches.forEach((series: any) => {
      // Be robust to different structure variations
      const matchesPool = series.seriesAdWrapper?.matches || series.matches || [];
      if (!Array.isArray(matchesPool)) return;

      matchesPool.forEach((m: any) => {
        const matchInfo = m.matchInfo;
        if (!matchInfo) return;

        const matchScore = m.matchScore;
        const state = (matchInfo.state || '').toLowerCase();
        
        const isLive = state === 'in progress' || state === 'live' || state === 'stumps' || state === 'tea' || state === 'lunch';
        const isUpcoming = state === 'upcoming' || state === 'preview' || state === 'toss';
        const isFinished = state === 'complete' || state === 'result' || state === 'abandoned';
        
        const team1 = matchInfo.team1 || { teamName: 'Team 1' };
        const team2 = matchInfo.team2 || { teamName: 'Team 2' };
        
        // Handle scores safely
        const t1Score = matchScore?.team1Score?.inngs1 || matchScore?.team1Score;
        const t2Score = matchScore?.team2Score?.inngs1 || matchScore?.team2Score;

        const seriesName = (matchInfo.seriesName || '').toLowerCase();
        const t1 = (team1.teamName || '').toLowerCase();
        const t2 = (team2.teamName || '').toLowerCase();
        
        const isIPL = seriesName.includes('ipl') ||
                      seriesName.includes('indian premier league') ||
                      seriesName.includes('tata ipl') ||
                      isIPLTeamMatch(team1.teamName || '', team2.teamName || '');

        flattened.push({
          id: matchInfo.matchId?.toString() || Math.random().toString(),
          status: isLive ? 'LIVE' : (isUpcoming ? 'UPCOMING' : 'PREVIOUS'),
          isIPL: isIPL,
          matchNo: matchInfo.matchDesc || 'Match',
          date: matchInfo.startDate ? new Date(Number(matchInfo.startDate)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBA',
          time: matchInfo.startDate ? new Date(Number(matchInfo.startDate)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST' : 'TBA',
          venue: matchInfo.venueInfo?.ground || matchInfo.venueInfo?.city || 'Stadium',
          team1: {
            name: team1.teamName,
            nameEn: team1.teamName,
            score: t1Score?.runs ? `${t1Score.runs}/${t1Score.wickets || 0}` : (matchScore?.team1Score?.inngs1?.runs ? `${matchScore.team1Score.inngs1.runs}/${matchScore.team1Score.inngs1.wickets || 0}` : '0/0'),
            overs: t1Score?.overs ? t1Score.overs.toString() : (matchScore?.team1Score?.inngs1?.overs ? matchScore.team1Score.inngs1.overs.toString() : '0'),
            color: getTeamColor(team1.teamName)
          },
          team2: {
            name: team2.teamName,
            nameEn: team2.teamName,
            score: t2Score?.runs ? `${t2Score.runs}/${t2Score.wickets || 0}` : (matchScore?.team2Score?.inngs1?.runs ? `${matchScore.team2Score.inngs1.runs}/${matchScore.team2Score.inngs1.wickets || 0}` : '0/0'),
            overs: t2Score?.overs ? t2Score.overs.toString() : (matchScore?.team2Score?.inngs1?.overs ? matchScore.team2Score.inngs1.overs.toString() : '0'),
            color: getTeamColor(team2.teamName)
          },
          result: matchInfo.status || 'Match Scheduled',
          resultEn: matchInfo.status || 'Match Scheduled'
        });
      });
    });
  });
  return sortMatches(flattened);
}

function mapCricApiData(data: any[]) {
  return sortMatches(data.map((match: any, index: number) => {
    const isLive = match.matchStarted && !match.matchEnded;
    const isUpcoming = !match.matchStarted;
    const name = (match.name || '').toLowerCase();
    const isIPL = name.includes('ipl') || name.includes('indian premier league') ||
                  isIPLTeamMatch(match.teams?.[0] || '', match.teams?.[1] || '');
    const rawDate = match.date || match.dateTimeGMT || '';
    const parsedDate = rawDate ? new Date(rawDate) : null;
    return {
      id: match.id,
      status: isLive ? 'LIVE' : (isUpcoming ? 'UPCOMING' : 'PREVIOUS'),
      isIPL,
      matchNo: match.name || `Match ${index + 1}`,
      date: parsedDate ? parsedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBA',
      time: parsedDate ? parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST' : 'TBA',
      venue: match.venue || 'Stadium',
      team1: { 
         name: match.teams?.[0] || 'Team 1', 
         nameEn: match.teams?.[0] || 'Team 1', 
         score: match.score?.[0]?.r ? `${match.score[0].r}/${match.score[0].w}` : '0/0',
         overs: match.score?.[0]?.o ? String(match.score[0].o) : '0',
         color: getTeamColor(match.teams?.[0] || '') 
      },
      team2: { 
         name: match.teams?.[1] || 'Team 2', 
         nameEn: match.teams?.[1] || 'Team 2', 
         score: match.score?.[1]?.r ? `${match.score[1].r}/${match.score[1].w}` : '0/0',
         overs: match.score?.[1]?.o ? String(match.score[1].o) : '0',
         color: getTeamColor(match.teams?.[1] || '')
      },
      result: match.status || 'Scheduled',
      resultEn: match.status || 'Scheduled'
    };
  }));
}

function sortMatches(matches: any[]) {
  if (!matches || matches.length === 0) return [];

  // STRICT: Only return IPL matches. If none, return empty (never show non-IPL).
  const iplMatches = matches.filter(m => m.isIPL);
  if (iplMatches.length === 0) return [];

  return iplMatches.sort((a: any, b: any) => {
    // Prioritize LIVE matches first
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;
    
    // Then UPCOMING matches
    if (a.status === 'UPCOMING' && b.status === 'PREVIOUS') return -1;
    if (a.status === 'PREVIOUS' && b.status === 'UPCOMING') return 1;
    
    return 0;
  }).slice(0, 15);
}

// ─── Match Scorecard Details ────────────────────────────────────────────────

export async function getMatchDetails(matchId: string) {
  if (!RAPIDAPI_KEY || !matchId) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/m-scorecard/v1/${matchId}`,
      { headers: HEADERS, next: { revalidate: 30 }, signal: controller.signal }
    );

    if (!res.ok) {
      console.warn(`[CricbuzzAPI] Scorecard fetch failed for matchId ${matchId}: ${res.status}`);
      return null;
    }

    const data = await res.json().catch(() => null);
    if (!data) return null;

    return mapScorecard(data);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn('[CricbuzzAPI] Scorecard fetch timed out');
    } else {
      console.error('[CricbuzzAPI] Scorecard fetch error:', err);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapScorecard(data: any) {
  // Scorecard root can vary; try common paths
  const innings: any[] = data?.scorecard ?? data?.scoreCard ?? [];

  // Pick the most recent innings for batting/bowling
  const latestInnings = innings[innings.length - 1] ?? {};
  const batTeamDetails = latestInnings?.batTeamDetails ?? {};
  const bowlTeamDetails = latestInnings?.bowlTeamDetails ?? {};

  // Batting
  const battingList = batTeamDetails?.batsmenData
    ? Object.values(batTeamDetails.batsmenData)
    : [];

  const batting = battingList.slice(0, 6).map((b: any) => ({
    name: b.batName || b.name || 'Batter',
    runs: b.runs ?? 0,
    balls: b.balls ?? 0,
    fours: b.fours ?? 0,
    sixes: b.sixes ?? 0,
    sr: b.strikeRate ?? (b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'),
    dismissed: b.outDesc || b.dismissal || '',
    isNotOut: b.wicketCode === 'not out' || !b.outDesc,
  })).filter((b: any) => b.balls > 0 || b.runs > 0);

  // Bowling
  const bowlingList = bowlTeamDetails?.bowlersData
    ? Object.values(bowlTeamDetails.bowlersData)
    : [];

  const bowling = bowlingList.slice(0, 6).map((b: any) => ({
    name: b.bowlName || b.name || 'Bowler',
    overs: b.overs ?? 0,
    maidens: b.maidens ?? 0,
    runs: b.runs ?? 0,
    wickets: b.wickets ?? 0,
    econ: b.economy ?? (b.overs > 0 ? (b.runs / b.overs).toFixed(2) : '0.00'),
  })).filter((b: any) => b.overs > 0);

  // Live / recent overs
  const liveScore = data?.liveScore ?? data?.miniscore ?? {};
  const recentOvers = liveScore?.recentOvSummList?.join(' ') ||
                      data?.recentOvers ||
                      null;

  const partnership = liveScore?.partnerShip?.runs ?? null;
  const lastWicket = liveScore?.lastWicket ?? null;

  return { batting, bowling, recentOvers, partnership, lastWicket };
}

function getTeamColor(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('chennai') || n.includes('csk')) return '#FFFF00';
  if (n.includes('mumbai') || n.includes('mi')) return '#004BA0';
  if (n.includes('rcb') || n.includes('bangalore')) return '#CC0000';
  if (n.includes('kolkata') || n.includes('kkr')) return '#2E0854';
  if (n.includes('rajasthan') || n.includes('rr')) return '#FF4081';
  if (n.includes('hyderabad') || n.includes('srh')) return '#FF8200';
  if (n.includes('delhi') || n.includes('dc')) return '#00008B';
  if (n.includes('lucknow') || n.includes('lsg')) return '#00E5FF';
  if (n.includes('gujarat') || n.includes('gt')) return '#1B2133';
  if (n.includes('punjab') || n.includes('pbks')) return '#ED1F27';
  return '#1a367c';
}
