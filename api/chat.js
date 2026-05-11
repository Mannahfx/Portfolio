export default async function handler(req, res) {
  try {

    const { message } = req.body;

    // CHECK IF MESSAGE EXISTS
    if (!message) {
      return res.status(400).json({
        reply: "No message provided."
      });
    }

    // SEND REQUEST TO GEMINI
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
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

You help users with:
- Fintech
- AI
- Trading automation
- Smart agriculture

Be professional and helpful.

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

    // CONVERT RESPONSE
    const data = await response.json();

    // LOG RESPONSE
    console.log(data);

    // HANDLE GEMINI ERRORS
    if (data.error) {
      return res.status(500).json({
        reply: data.error.message
      });
    }

    // GET AI TEXT
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    // SEND RESPONSE
    res.status(200).json({
      reply: reply || "No AI response generated."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Server error connecting to AI."
    });
  }
}
