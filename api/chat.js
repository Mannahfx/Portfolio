export default async function handler(req, res) {
  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "No message provided."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

    const data = await response.json();

    console.log(data);

    if (data.error) {
      return res.status(500).json({
        reply: data.error.message
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Server error connecting to AI."
    });
  }
}
