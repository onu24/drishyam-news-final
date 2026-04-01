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
  '/article/new-education-policy-opinion',
  '/article/union-budget-2026-middle-class-tax-relief',
  '/article/isro-nglv-test-flight-preparations',
  '/article/assembly-elections-first-phase-turnout',
  '/article/sensex-historic-milestone-tech-rally',
  '/article/india-wins-t20-series-decider',
  '/article/bollywood-sequel-breaks-box-office-records',
  '/article/ev-subsidy-scheme-expanded',
  '/article/psu-bank-recruitment-2026',
  '/article/upsc-prelims-2026-notification'
];

async function checkRoutes() {
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, { method: 'GET' });
      console.log(`[CHECK] ${route} -> ${res.status}`);
    } catch (e) {
      console.log(`[CHECK] ${route} -> ERROR: ${e.message}`);
    }
  }
}

checkRoutes();
