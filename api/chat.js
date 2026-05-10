export default async function handler(req, res) {
  try {

    // GET USER MESSAGE
    const { message } = req.body;

    // SEND REQUEST TO GEMINI AI
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are MANNA AI Assistant.

You represent MANNA, a technology company focused on:
- Fintech systems
- Trading automation
- Artificial Intelligence solutions
- Smart agriculture
- Agritech innovation

Your responsibilities:
- Answer questions clearly
- Explain technical concepts simply
- Help users understand MANNA services
- Be professional, intelligent, and helpful
- Keep responses concise and practical

User Question:
${message}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    // CONVERT RESPONSE TO JSON
    const data = await response.json();

    // DEBUG LOG
    console.log("Gemini Response:", data);

    // EXTRACT AI RESPONSE
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // SEND RESPONSE BACK
    res.status(200).json({ reply });

  } catch (error) {

    // ERROR LOG
    console.error("SERVER ERROR:", error);

    // SEND ERROR MESSAGE
    res.status(500).json({
      reply: "Server error connecting to AI."
    });
  }
}
