import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }

    const mistralKey = process.env.MISTRAL_API_KEY;
    
    if (!mistralKey) {
      const fallbackReplies = {
        en: [
          "I'm doing well, thank you for asking! How can I assist you today with Vannate's humanitarian services?",
          "Hello! I'm here to help with disaster relief, blood donations, or any other humanitarian needs. What would you like to know?",
          "Great to connect with you! I'm Vannate AI, ready to support you with everything from volunteer coordination to crisis response.",
          "I'm just doing fine, thank you! How about you? How can I help make a difference today?"
        ],
        hi: [
          "मैं अच्छा हूँ, पूछने के लिए धन्यवाद! मैं आज आपकी किस प्रकार से मानवीय सेवाओं में मदद कर सकता हूँ?",
          "नमस्ते! मैं आपदा राहत, रक्तदान या किसी अन्य मानवीय आवश्यकताओं में मदद करने के लिए यहाँ हूँ। आप क्या जानना चाहेंगे?",
          "आपसे जुड़कर बहुत अच्छा लगा! मैं वन्नाट AI हूँ, स्वयंसेवक समन्वय से लेकर संकट प्रतिक्रिया तक हर चीज़ में आपकी सहायता करने के लिए तैयार हूँ।",
          "मैं बस अच्छा कर रहा हूँ, धन्यवाद! आप कैसे हैं? आज मैं कैसे फर्क लाने में मदद कर सकता हूँ?"
        ],
        bn: [
          "আমি ভালো আছি, জিজ্ঞাসা করার জন্য ধন্যবাদ! আজকে ভ্যানেটের মানবিক সেবায় আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
          "হ্যালো! আমি দুর্যোগ ত্রাণ, রক্তদান বা অন্য কোনো মানবিক প্রয়োজনে সাহায্য করার জন্য এখানে আছি। আপনি কী জানতে চান?",
          "আপনার সাথে সংযুক্ত হয়ে খুব ভালো লেগেছে! আমি ভ্যানেট AI, স্বেচ্ছাসেবক সমন্বয় থেকে সংকট প্রতিক্রিয়া পর্যন্ত সবকিছুতে আপনাকে সহায়তা করার জন্য প্রস্তুত।",
          "আমি শুধু ভালো করছি, ধন্যবাদ! আপনি কেমন আছেন? আজকে আমি কীভাবে পার্থক্য তৈরি করতে সাহায্য করতে পারি?"
        ]
      };
      const langKey = language || 'en';
      const replies = fallbackReplies[langKey as keyof typeof fallbackReplies] || fallbackReplies.en;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return NextResponse.json({ reply: randomReply });
    }

    const langName = language === 'hi' ? 'Hindi' : language === 'bn' ? 'Bengali' : 'English';

    const systemPrompt = `You are Vannate AI, a compassionate, intelligent humanitarian operating system assistant.
Your purpose is to help with disaster relief, blood donation coordination, NGO operations, volunteer management, and crisis response.

CRITICAL RULES:
1. Always respond in ${langName} only.
2. Be empathetic, conversational, and human-like. Never sound robotic.
3. Keep responses concise (1-3 sentences).
4. If the user mentions blood, disaster, crisis, or emergency, respond with urgent but calm compassion.
5. For "hi", "hello", or "how are you", respond warmly and ask how you can help.
6. Do NOT use JSON, markdown, or code. Just plain conversational text.

Example responses:
- "Hello! I'm Vannate AI, ready to help with disaster relief or blood donation coordination. How can I assist you?"
- "I'm doing well, thank you! I'm here to help with any humanitarian needs you have. What would you like to know?"
- "I hear you, and I understand the urgency. Let's get the blood donation process started immediately."
`;

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: transcript }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Mistral API Error:", errText);
      throw new Error(`Mistral API Error: ${errText}`);
    }

    const data = await res.json();
    const reply = data.choices[0]?.message?.content?.trim() || "I'm here to help you with whatever you need.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const fallbackReplies = {
      en: [
        "I'm here to help you with whatever you need. How can I assist you today?",
        "Thank you for reaching out! I'm Vannate AI, ready to support you.",
        "I'm listening. Please tell me more about what you need help with."
      ],
      hi: [
        "मैं आपकी जो भी आवश्यकता है उसकी मदद करने के लिए यहाँ हूँ। मैं आज आपकी किस प्रकार से सहायता कर सकता हूँ?",
        "संपर्क करने के लिए धन्यवाद! मैं वन्नाट AI हूँ, आपको सहायता करने के लिए तैयार हूँ।",
        "मैं सुन रहा हूँ। कृपया मुझे और बताएँ कि आपको किस चीज़ की मदद चाहिए।"
      ],
      bn: [
        "আমি আপনার যা কিছু প্রয়োজন তা সাহায্য করার জন্য এখানে আছি। আজকে আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
        "যোগাযোগ করার জন্য ধন্যবাদ! আমি ভ্যানেট AI, আপনাকে সহায়তা করার জন্য প্রস্তুত।",
        "আমি শুনছি। আপনাকে কী সাহায্য দরকার তা আমাকে আরও বলুন।"
      ]
    };
    const langKey = (language || 'en') as keyof typeof fallbackReplies;
    const replies = fallbackReplies[langKey] || fallbackReplies.en;
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return NextResponse.json({ reply: randomReply });
  }
}
