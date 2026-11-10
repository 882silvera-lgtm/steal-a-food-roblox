const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

app.get("/", (req, res) => {
  res.send("Servidor do Roube uma Comida está online 🍔");
});

app.post("/execute", async (req, res) => {
  try {
    const script = req.body.script;

    if (!script) {
      return res.status(400).json({
        error: "Envie um script Luau"
      });
    }

    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}/places/${PLACE_ID}/luau-execution-session-tasks`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script
        })
      }
    );

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
