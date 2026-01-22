import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  businessName: string;
  category: string;
  rating: number;
  selectedTags: string[];
  language?: "en" | "de";
}

// English templates
const englishTemplates = {
  openings: {
    5: [
      (name: string) => `I had an absolutely wonderful experience at ${name}!`,
      (name: string) => `${name} exceeded all my expectations!`,
      (name: string) => `I can't say enough good things about ${name}!`,
      (name: string) => `${name} is truly exceptional!`,
    ],
    4: [
      (name: string) => `I had a great experience at ${name}.`,
      (name: string) => `Really enjoyed working with ${name}.`,
      (name: string) => `${name} delivered a very good experience.`,
      (name: string) => `I'm very pleased with ${name}.`,
    ],
    3: [
      (name: string) => `${name} was a decent experience overall.`,
      (name: string) => `My experience with ${name} was satisfactory.`,
      (name: string) => `${name} met my basic expectations.`,
    ],
    2: [
      (name: string) => `My experience with ${name} was below average.`,
      (name: string) => `${name} has room for improvement.`,
      (name: string) => `I expected more from ${name}.`,
    ],
    1: [
      (name: string) => `Unfortunately, ${name} didn't meet my expectations.`,
      (name: string) => `I was disappointed with my experience at ${name}.`,
    ],
  },
  tagIntros: [
    "What stood out to me was",
    "I particularly appreciated",
    "The highlights were",
    "I was impressed by",
    "Notable aspects included",
  ],
  closings: {
    5: ["Highly recommend!", "Will definitely hire again!", "A must-hire!", "Five stars well deserved!"],
    4: ["Would recommend.", "Looking forward to working together again.", "A solid choice.", "Happy to recommend."],
    3: ["Worth considering.", "Decent option.", "Not bad overall."],
    2: ["Might give another chance.", "Hope they improve.", "There are better options."],
    1: ["Would not recommend at this time.", "Hope they can improve."],
  },
};

// German templates
const germanTemplates = {
  openings: {
    5: [
      (name: string) => `Ich hatte eine absolut großartige Erfahrung mit ${name}!`,
      (name: string) => `${name} hat alle meine Erwartungen übertroffen!`,
      (name: string) => `Ich kann nur Gutes über ${name} sagen!`,
      (name: string) => `${name} ist wirklich außergewöhnlich!`,
    ],
    4: [
      (name: string) => `Ich hatte eine tolle Erfahrung mit ${name}.`,
      (name: string) => `Die Zusammenarbeit mit ${name} war sehr gut.`,
      (name: string) => `${name} hat sehr gute Arbeit geliefert.`,
      (name: string) => `Ich bin sehr zufrieden mit ${name}.`,
    ],
    3: [
      (name: string) => `${name} war insgesamt eine ordentliche Erfahrung.`,
      (name: string) => `Meine Erfahrung mit ${name} war zufriedenstellend.`,
      (name: string) => `${name} hat meine grundlegenden Erwartungen erfüllt.`,
    ],
    2: [
      (name: string) => `Meine Erfahrung mit ${name} war unterdurchschnittlich.`,
      (name: string) => `Bei ${name} gibt es Verbesserungspotenzial.`,
      (name: string) => `Ich hatte mehr von ${name} erwartet.`,
    ],
    1: [
      (name: string) => `Leider hat ${name} meine Erwartungen nicht erfüllt.`,
      (name: string) => `Ich war enttäuscht von meiner Erfahrung mit ${name}.`,
    ],
  },
  tagIntros: [
    "Besonders hervorheben möchte ich",
    "Ich habe besonders geschätzt",
    "Die Highlights waren",
    "Beeindruckt hat mich",
    "Positiv aufgefallen ist mir",
  ],
  closings: {
    5: ["Sehr empfehlenswert!", "Werde definitiv wieder beauftragen!", "Ein absoluter Top-Betrieb!", "Fünf Sterne verdient!"],
    4: ["Kann ich empfehlen.", "Gerne wieder.", "Eine gute Wahl.", "Empfehle ich weiter."],
    3: ["Kann man in Betracht ziehen.", "Insgesamt okay.", "Nicht schlecht."],
    2: ["Vielleicht eine zweite Chance.", "Hoffe auf Verbesserung.", "Es gibt bessere Alternativen."],
    1: ["Würde ich derzeit nicht empfehlen.", "Hoffe auf Verbesserung."],
  },
};

function generateReview(data: GenerateRequest): string {
  const { businessName, rating, selectedTags, language = "en" } = data;
  const templates = language === "de" ? germanTemplates : englishTemplates;

  const openingFns = templates.openings[rating as keyof typeof templates.openings];
  const opening = openingFns[Math.floor(Math.random() * openingFns.length)](businessName);

  const closingOptions = templates.closings[rating as keyof typeof templates.closings];
  const closing = closingOptions[Math.floor(Math.random() * closingOptions.length)];

  let middle = "";
  if (selectedTags.length > 0) {
    const tagIntro = templates.tagIntros[Math.floor(Math.random() * templates.tagIntros.length)];
    const connector = language === "de" ? " und " : " and ";
    const article = language === "de" ? "" : "the ";

    if (selectedTags.length === 1) {
      middle = ` ${tagIntro} ${article}${selectedTags[0].toLowerCase()}.`;
    } else if (selectedTags.length === 2) {
      middle = ` ${tagIntro} ${article}${selectedTags[0].toLowerCase()}${connector}${selectedTags[1].toLowerCase()}.`;
    } else {
      const lastTag = selectedTags[selectedTags.length - 1];
      const otherTags = selectedTags.slice(0, -1);
      middle = ` ${tagIntro} ${article}${otherTags.map((t) => t.toLowerCase()).join(", ")}${connector}${lastTag.toLowerCase()}.`;
    }
  }

  return `${opening}${middle} ${closing}`;
}

async function generateWithAI(data: GenerateRequest): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  const language = data.language || "en";
  const langInstruction = language === "de" ? "Write in German." : "Write in English.";

  if (!apiKey) {
    return generateReview(data);
  }

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
              content: `Write a natural, authentic Google review for "${data.businessName}" (a ${data.category} company).
Rating: ${data.rating}/5 stars
Positive aspects mentioned by customer: ${data.selectedTags.join(", ")}

Requirements:
- ${langInstruction}
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

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `Write a natural Google review for "${data.businessName}" (${data.category}).
Rating: ${data.rating}/5, Positive aspects: ${data.selectedTags.join(", ")}
${langInstruction} Keep it to 2-3 sentences, sound like a real customer.`,
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
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await generateWithAI(data);

    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
}
