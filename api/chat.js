export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
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

You help users understand:
- Fintech systems
- Trading automation
- AI solutions
- Smart agriculture

Be professional and clear.

User question:
${message}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't respond.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "Server error connecting to AI."
    });
  }
}
