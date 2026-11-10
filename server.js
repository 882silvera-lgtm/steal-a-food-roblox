const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

app.get("/", (req, res) => {
  res.send(`
    <h1>🍔 Roube uma Comida</h1>
    <button onclick="testar()">Criar chão do mapa</button>

    <script>
      async function testar() {
        const resposta = await fetch("/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            script: \`
              local Workspace = game:GetService("Workspace")

              local chão = Instance.new("Part")
              chão.Name = "ChaoDoMapa"
              chão.Size = Vector3.new(200, 1, 200)
              chão.Position = Vector3.new(0, 0, 0)
              chão.Anchored = true
              chão.Parent = Workspace
            \`
          })
        });

        const resultado = await resposta.text();
        alert(resultado);
      }
    </script>
  `);
});

app.post("/execute", async (req, res) => {
  try {
    const script = req.body.script;

    if (!script) {
      return res.status(400).json({
        error: "Nenhum script Luau enviado"
      });
    }

    const resposta = await fetch(
      `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}/places/${PLACE_ID}/luau-execution-session-tasks`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script: script
        })
      }
    );

    const resultado = await resposta.text();

    res.status(resposta.status).send(resultado);
  } catch (erro) {
    res.status(500).json({
      error: erro.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
