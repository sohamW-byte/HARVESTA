
import { NextResponse } from "next/server";
import { config } from 'dotenv';

// Explicitly load environment variables from .env file
config();

export async function POST(req: Request) {
  try {
    const { texts, targetLang } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return NextResponse.json({ error: 'Missing texts array or targetLang' }, { status: 400 });
    }
    
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      console.warn("Sarvam API key is not configured. Returning original text. Please add SARVAM_API_KEY to your .env file.");
      return NextResponse.json({ translatedTexts: texts });
    }

    const response = await fetch("https://api.sarvam.ai/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        source_language: "en", // Assuming source is always English
        target_language: targetLang,
        text_list: texts,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Translation API Error:", errorBody);
      // Return original texts on API failure to avoid breaking UI
      return NextResponse.json({ translatedTexts: texts });
    }

    const data = await response.json();
    
    const translatedTexts = data.translations?.map((t: any) => t.text) || texts;

    return NextResponse.json({ translatedTexts });

  } catch (error: any) {
    console.error("Internal API Error:", error);
     // On internal error, it's safer to return the original texts
    const { texts } = await req.json().catch(() => ({ texts: [] }));
    return NextResponse.json({ translatedTexts: texts });
  }
}
