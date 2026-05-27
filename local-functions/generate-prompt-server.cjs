const http = require('http');

const PORT = process.env.PORT || 8787;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
};

function buildFallbackPrompt(idea, bot, length) {
  const normalized = idea
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[a-z]/, (c) => c.toUpperCase());

  const botPreambles = {
    chatgpt: `Act as an expert assistant. `,
    claude: `<task>\n`,
    gemini: `You are a creative and knowledgeable assistant. `,
    grok: `Hey, I need your help with something: `,
    perplexity: `Please research and provide a well-sourced answer to the following: `,
    copilot: `Help me with the following task in a professional and actionable way: `,
    universal: `Please help me with the following: `,
  };

  const botSuffixes = {
    chatgpt: length === 'detailed'
      ? `\n\nPlease provide:\n1. A clear explanation\n2. Step-by-step breakdown\n3. Practical examples\n4. Key takeaways`
      : `\n\nBe clear, direct, and practical.`,
    claude: length === 'detailed'
      ? `\n</task>\n\n<requirements>\n- Provide deep analysis\n- Use structured formatting\n- Include reasoning steps\n- Give actionable insights\n</requirements>`
      : `\n</task>\n\nBe concise and analytical.`,
    gemini: length === 'detailed'
      ? `\n\nExplore this creatively and thoroughly. Include multiple perspectives, examples, and practical applications.`
      : `\n\nBe creative and informative.`,
    grok: length === 'detailed'
      ? `\n\nGive me the full picture — what's real, what's hype, and what actually matters here.`
      : `\n\nKeep it real and direct.`,
    perplexity: length === 'detailed'
      ? `\n\nProvide comprehensive information with sources. Cover background context, current state, and key perspectives from multiple sources.`
      : `\n\nInclude key facts and cite your sources.`,
    copilot: length === 'detailed'
      ? `\n\nCreate a professional, well-structured response that I can use immediately. Include actionable steps and clear deliverables.`
      : `\n\nBe professional and actionable.`,
    universal: length === 'detailed'
      ? `\n\nPlease provide a thorough response with clear structure, relevant examples, and actionable insights.`
      : `\n\nBe clear and helpful.`,
  };

  const botKey = botPreambles[bot] ? bot : 'universal';
  return `${botPreambles[botKey]}${normalized}${botSuffixes[botKey]}`;
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (url !== '/functions/v1/generate-prompt') {
    res.writeHead(404, corsHeaders);
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  if (method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const { idea, bot = 'universal', length = 'detailed' } = JSON.parse(body);
    if (!idea || !idea.trim()) {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Idea is required' }));
    }

    const optimizedPrompt = buildFallbackPrompt(idea.trim(), bot, length);

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ optimizedPrompt }));
  } catch (err) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Local generate-prompt function listening on http://localhost:${PORT}/functions/v1/generate-prompt`);
});
