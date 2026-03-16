export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol, type } = req.query;
  if (!symbol) return res.status(400).json({ error: 'No symbol' });

  const suffixes = ['.NS', '.BO'];

  // Fetch fundamentals/quote summary
  if (type === 'summary') {
    for (const suffix of suffixes) {
      try {
        const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}${suffix}?modules=summaryDetail,defaultKeyStatistics,financialData,incomeStatementHistory`;
        const r = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Referer': 'https://finance.yahoo.com'
          }
        });
        const data = await r.json();
        if (data?.quoteSummary?.result?.[0]) {
          return res.status(200).json(data);
        }
      } catch (e) { continue; }
    }
    return res.status(404).json({ error: 'Not found' });
  }

  // Fetch chart data (default)
  for (const suffix of suffixes) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}${suffix}?range=1y&interval=1d`;
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com'
        }
      });
      const data = await r.json();
      if (data?.chart?.result?.[0]) {
        return res.status(200).json(data);
      }
    } catch (e) { continue; }
  }
  return res.status(404).json({ error: 'Not found' });
}
