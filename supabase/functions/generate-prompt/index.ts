import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type BotId = "chatgpt" | "claude" | "gemini" | "grok" | "perplexity" | "copilot" | "universal";

function buildSystemPrompt(bot: BotId, length: "short" | "detailed"): string {
  const lengthInstruction = length === "short"
    ? "Keep the optimized prompt concise — 2 to 4 sentences max. Be direct and dense."
    : "Create a comprehensive, detailed prompt — use structure, context, and clear instructions. Aim for 100–250 words.";

  const botStyles: Record<BotId, string> = {
    chatgpt: `You are an expert AI prompt engineer specializing in ChatGPT optimization.
ChatGPT performs best with:
- A clear role assignment at the start ("Act as a...")
- Explicit step-by-step instructions
- Requested output format specified
- Context and constraints clearly stated
- Conversational but structured tone`,

    claude: `You are an expert AI prompt engineer specializing in Claude (Anthropic) optimization.
Claude performs best with:
- Long-context, nuanced reasoning requests
- XML-style tags for structure when helpful (<task>, <context>, <output_format>)
- Explicit analytical frameworks
- Clear expectations for depth of reasoning
- Requesting structured, well-organized outputs`,

    gemini: `You are an expert AI prompt engineer specializing in Google Gemini optimization.
Gemini performs best with:
- Rich contextual descriptions
- Creative and multimodal-friendly framing
- Combining text and visual thinking cues
- Clear subject matter with creative latitude
- Encouraging exploration of multiple angles`,

    grok: `You are an expert AI prompt engineer specializing in xAI Grok optimization.
Grok performs best with:
- Casual, direct, internet-aware tone
- Real-time / current events framing when relevant
- Wit and conversational energy
- Fewer formal constraints
- Encouraging bold or contrarian takes`,

    perplexity: `You are an expert AI prompt engineer specializing in Perplexity AI optimization.
Perplexity performs best with:
- Research-oriented framing
- Requests for cited, verifiable information
- Specific questions that benefit from web search
- Asking for multiple sources or perspectives
- Clear research scope and depth`,

    copilot: `You are an expert AI prompt engineer specializing in Microsoft Copilot optimization.
Copilot performs best with:
- Productivity and task-oriented framing
- Integration with Microsoft 365 workflows when relevant
- Clear deliverables (documents, summaries, emails)
- Professional tone with actionable outputs
- Web-grounded factual requests`,

    universal: `You are an expert AI prompt engineer creating model-agnostic prompts.
Universal prompts should:
- Be clear and unambiguous for any AI model
- Follow best practices: role, task, context, format, constraints
- Avoid model-specific syntax
- Work equally well on ChatGPT, Claude, Gemini, Grok, and others
- Use clean, professional language`,
  };

  return `${botStyles[bot]}

Your job: Transform the user's rough, possibly broken, or incomplete idea into a polished, professional AI prompt.

Rules:
1. Fix all grammar and spelling errors
2. Expand vague ideas with reasonable context
3. Add clarity, structure, and purpose
4. Format specifically for the target AI model's strengths
5. Output ONLY the optimized prompt — no explanations, no preamble, no meta-commentary
6. Do NOT wrap in quotes
7. ${lengthInstruction}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { idea, bot, length, sessionId } = await req.json() as {
      idea: string;
      bot: BotId;
      length: "short" | "detailed";
      sessionId: string;
    };

    if (!idea?.trim()) {
      return new Response(
        JSON.stringify({ error: "Idea is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validBots: BotId[] = ["chatgpt", "claude", "gemini", "grok", "perplexity", "copilot", "universal"];
    const targetBot: BotId = validBots.includes(bot) ? bot : "universal";

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    let optimizedPrompt: string;

    if (geminiApiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: buildSystemPrompt(targetBot, length ?? "detailed") }],
            },
            contents: [
              {
                parts: [{ text: idea.trim() }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: length === "short" ? 200 : 600,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        throw new Error(`Gemini API error: ${geminiRes.status}`);
      }

      const geminiData = await geminiRes.json();
      optimizedPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    } else {
      // Fallback: rule-based prompt enhancement
      optimizedPrompt = buildFallbackPrompt(idea.trim(), targetBot, length ?? "detailed");
    }

    if (!optimizedPrompt) {
      throw new Error("Failed to generate prompt content");
    }

    // Save to database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseClient.from("prompt_history").insert({
      session_id: sessionId ?? "",
      raw_idea: idea.trim(),
      target_bot: targetBot,
      optimized_prompt: optimizedPrompt,
      prompt_length: length ?? "detailed",
    });

    return new Response(
      JSON.stringify({ optimizedPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-prompt error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildFallbackPrompt(idea: string, bot: BotId, length: "short" | "detailed"): string {
  const normalized = idea
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[a-z]/, (c) => c.toUpperCase());

  const botPreambles: Record<BotId, string> = {
    chatgpt: `Act as an expert assistant. `,
    claude: `<task>\n`,
    gemini: `You are a creative and knowledgeable assistant. `,
    grok: `Hey, I need your help with something: `,
    perplexity: `Please research and provide a well-sourced answer to the following: `,
    copilot: `Help me with the following task in a professional and actionable way: `,
    universal: `Please help me with the following: `,
  };

  const botSuffixes: Record<BotId, string> = {
    chatgpt: length === "detailed"
      ? `\n\nPlease provide:\n1. A clear explanation\n2. Step-by-step breakdown\n3. Practical examples\n4. Key takeaways`
      : `\n\nBe clear, direct, and practical.`,
    claude: length === "detailed"
      ? `\n</task>\n\n<requirements>\n- Provide deep analysis\n- Use structured formatting\n- Include reasoning steps\n- Give actionable insights\n</requirements>`
      : `\n</task>\n\nBe concise and analytical.`,
    gemini: length === "detailed"
      ? `\n\nExplore this creatively and thoroughly. Include multiple perspectives, examples, and practical applications.`
      : `\n\nBe creative and informative.`,
    grok: length === "detailed"
      ? `\n\nGive me the full picture — what's real, what's hype, and what actually matters here.`
      : `\n\nKeep it real and direct.`,
    perplexity: length === "detailed"
      ? `\n\nProvide comprehensive information with sources. Cover background context, current state, and key perspectives from multiple sources.`
      : `\n\nInclude key facts and cite your sources.`,
    copilot: length === "detailed"
      ? `\n\nCreate a professional, well-structured response that I can use immediately. Include actionable steps and clear deliverables.`
      : `\n\nBe professional and actionable.`,
    universal: length === "detailed"
      ? `\n\nPlease provide a thorough response with clear structure, relevant examples, and actionable insights.`
      : `\n\nBe clear and helpful.`,
  };

  return `${botPreambles[bot]}${normalized}${botSuffixes[bot]}`;
}
