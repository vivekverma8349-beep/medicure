// controllers/medicalChatController.js

import gemini from "../config/gemini.js";

// =======================================
// MEDICAL CHATBOT
// =======================================

export const medicalChat = async (req, res) => {
  try {

    console.log("Medical chat route hit");

  
    // GET MESSAGE
  

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

  
    // AI PROMPT
  

    const prompt = `
You are an intelligent and friendly AI Medical Assistant chatbot.

RULES:
- Give simple and human-friendly answers.
- Explain medical topics clearly.
- Help users understand symptoms, medicines, diseases, reports, and tests.
- Never claim to replace a real doctor.
- Do not give dangerous medical advice.
- If condition sounds serious, suggest consulting a doctor.
- Keep answers conversational like a chatbot.
- Keep answers medium length unless user asks detailed explanation.

USER MESSAGE:
${message}
`;

  
    // GEMINI RESPONSE
  

    const result = await gemini.generateContent(prompt);

    const reply = result.response.text();

  
    // SEND RESPONSE
  

    res.status(200).json({
      success: true,
      userMessage: message,
      reply,
    });

  } catch (error) {

    console.log("Medical Chat Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};