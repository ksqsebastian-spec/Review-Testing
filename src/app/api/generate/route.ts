import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  businessName: string;
  category: string;
  rating: number;
  selectedTags: string[];
}

// Smart template-based review generator
// Can be replaced with AI API (Claude/OpenAI) for more natural results
function generateReview(data: GenerateRequest): string {
  const { businessName, category, rating, selectedTags } = data;

  // Opening phrases based on rating
  const openings: Record<number, string[]> = {
    5: [
      `I had an absolutely wonderful experience at ${businessName}!`,
      `${businessName} exceeded all my expectations!`,
      `I can't say enough good things about ${businessName}!`,
      `${businessName} is truly exceptional!`,
    ],
    4: [
      `I had a great experience at ${businessName}.`,
      `Really enjoyed my visit to ${businessName}.`,
      `${businessName} delivered a very good experience.`,
      `I'm very pleased with ${businessName}.`,
    ],
    3: [
      `${businessName} was a decent experience overall.`,
      `My visit to ${businessName} was satisfactory.`,
      `${businessName} met my basic expectations.`,
    ],
    2: [
      `My experience at ${businessName} was below average.`,
      `${businessName} has room for improvement.`,
      `I expected more from ${businessName}.`,
    ],
    1: [
      `Unfortunately, ${businessName} didn't meet my expectations.`,
      `I was disappointed with my experience at ${businessName}.`,
    ],
  };

  // Tag connectors
  const tagIntros = [
    "What stood out to me was",
    "I particularly appreciated",
    "The highlights were",
    "I was impressed by",
    "Notable aspects included",
  ];

  // Closing phrases based on rating
  const closings: Record<number, string[]> = {
    5: [
      "Highly recommend to everyone!",
      "Will definitely be coming back!",
      "A must-visit!",
      "Five stars well deserved!",
    ],
    4: [
      "Would recommend.",
      "Looking forward to my next visit.",
      "A solid choice.",
      "Happy to recommend.",
    ],
    3: [
      "It's worth a try.",
      "Decent option in the area.",
      "Not bad, not great.",
    ],
    2: [
      "Might give it another chance.",
      "Hope they improve.",
      "There are better options.",
    ],
    1: [
      "Would not recommend at this time.",
      "Hope they can improve.",
    ],
  };

  // Build the review
  const opening = openings[rating][Math.floor(Math.random() * openings[rating].length)];
  const closing = closings[rating][Math.floor(Math.random() * closings[rating].length)];

  let middle = "";
  if (selectedTags.length > 0) {
    const tagIntro = tagIntros[Math.floor(Math.random() * tagIntros.length)];
    if (selectedTags.length === 1) {
      middle = ` ${tagIntro} the ${selectedTags[0].toLowerCase()}.`;
    } else if (selectedTags.length === 2) {
      middle = ` ${tagIntro} the ${selectedTags[0].toLowerCase()} and ${selectedTags[1].toLowerCase()}.`;
    } else {
      const lastTag = selectedTags[selectedTags.length - 1];
      const otherTags = selectedTags.slice(0, -1);
      middle = ` ${tagIntro} the ${otherTags.map(t => t.toLowerCase()).join(", ")}, and ${lastTag.toLowerCase()}.`;
    }
  }

  return `${opening}${middle} ${closing}`;
}

// AI-powered generation (uncomment and configure when ready)
async function generateWithAI(data: GenerateRequest): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fall back to template-based generation
    return generateReview(data);
  }

  // Claude API implementation
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `Write a natural, authentic Google review for "${data.businessName}" (a ${data.category}).
Rating: ${data.rating}/5 stars
Positive aspects mentioned by customer: ${data.selectedTags.join(", ")}

Requirements:
- Keep it concise (2-3 sentences)
- Sound like a real customer, not overly formal
- Mention the specific positive aspects naturally
- Match the tone to the star rating
- Don't use hashtags or emojis
- Don't include the star rating number in text`,
            },
          ],
        }),
      });

      const result = await response.json();
      return result.content[0].text;
    } catch {
      return generateReview(data);
    }
  }

  // OpenAI API implementation
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `Write a natural, authentic Google review for "${data.businessName}" (a ${data.category}).
Rating: ${data.rating}/5 stars
Positive aspects: ${data.selectedTags.join(", ")}
Keep it to 2-3 sentences, sound like a real customer, mention the positive aspects naturally.`,
            },
          ],
        }),
      });

      const result = await response.json();
      return result.choices[0].message.content;
    } catch {
      return generateReview(data);
    }
  }

  return generateReview(data);
}

export async function POST(request: NextRequest) {
  try {
    const data: GenerateRequest = await request.json();

    if (!data.businessName || !data.rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const review = await generateWithAI(data);

    return NextResponse.json({ review });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}
