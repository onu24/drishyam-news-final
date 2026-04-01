const fs = require('fs');

const routes = [
  '/',
  '/latest',
  '/category/india',
  '/category/states',
  '/category/politics',
  '/category/economy',
  '/category/technology',
  '/category/sports',
  '/category/entertainment',
  '/category/explainers',
  '/category/videos',
  '/contact',
  '/search',
  '/visual-stories',
  '/visual-stories/bollywood-highest-paid-actors-2024',
  '/visual-stories/isro-new-launch-pad-inside-look',
  '/visual-stories/5-hidden-iphone-features-guide',
  '/article/data-protection-bill-explainer',
  '/article/interim-budget-2026-explained',
  '/article/neet-pg-2026-changes',
  '/article/rural-economy-overhaul',
  '/article/ai-regulation-india',
  '/article/indian-sports-golden-age',
  '/article/coalition-politics-2029',
  '/article/stock-market-rally',
  '/article/pm-interview-tech',
  '/article/maharashtra-drought-report',
  '/article/funding-winter-ends',
  '/article/ind-vs-aus-highlights'
];

async function checkRoutes() {
  console.log(`Starting audit of ${routes.length} routes...`);
  const results = [];
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, { method: 'GET' });
      results.push({ route, status: res.status });
      console.log(`[CHECK] ${route} -> ${res.status}`);
    } catch (e) {
      results.push({ route, status: 'ERROR', error: e.message });
      console.log(`[CHECK] ${route} -> ERROR: ${e.message}`);
    }
  }
  
  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 200).length,
    failed: results.filter(r => r.status !== 200).length,
    results: results
  };

  fs.writeFileSync('audit_results.json', JSON.stringify(summary, null, 2));
  console.log('\nAudit complete. Results saved to audit_results.json');
}

checkRoutes();
