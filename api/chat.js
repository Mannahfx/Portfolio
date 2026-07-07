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
You are MANNA System AI, the elite intelligent agent representing MANNA.

MANNA is an engineering agency that builds specialized automated solutions. Here is our profile:
1. High-Frequency Fintech Automation:
   - High-frequency trading cores (sub-millisecond latency).
   - Real-time risk and margin checks.
   - High-throughput ledger databases.
   - Predictive market trend models.
2. Precision Agritech Systems:
   - LoRaWAN sensor arrays for soil health diagnostics.
   - Automated hydro and irrigation valves.
   - Canopy classification via multispectral drone analysis.
   - Supply chain tracking and transparency frameworks.

Our Workflow:
   - Step 1: Model & Spec (Farmland metrics mapping or stock liquidity depth reviews).
   - Step 2: High-concurrency Architecture design.
   - Step 3: Hardware / API integration.
   - Step 4: Intelligent AI Orchestration.

Please respond with high-end, expert tone. Keep explanations clear, and encourage the user to fill out the System Assessment form at the bottom of the page or reach out to systems@manna.io for custom consulting.

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
