const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

app.get("/", (req, res) => {
  res.send(`
    <h1>🍔 Roube uma Comida</h1>
    <button onclick="executar('bases')">🏠 Criar Bases</button>
    <button onclick="executar('teste')">🧪 Testar Roblox</button>

    <script>
      async function executar(tipo) {
        const scripts = {
          teste: "print('Roube uma Comida: conexão funcionando!')",

          bases: \`
            local Workspace = game:GetService("Workspace")

            local antigo = Workspace:FindFirstChild("BasesRoubeUmaComida")
            if antigo then
              antigo:Destroy()
            end

            local pasta = Instance.new("Folder")
            pasta.Name = "BasesRoubeUmaComida"
            pasta.Parent = Workspace

            local posicoes = {
              Vector3.new(-60, 1, -60),
              Vector3.new(60, 1, -60),
              Vector3.new(-60, 1, 60),
              Vector3.new(60, 1, 60)
            }

            for i, posicao in ipairs(posicoes) do
              local base = Instance.new("Part")
              base.Name = "Base" .. i
              base.Size = Vector3.new(45, 2, 45)
              base.Position = posicao
              base.Anchored = true
              base.Parent = pasta

              local nome = Instance.new("BillboardGui")
              nome.Size = UDim2.new(0, 200, 0, 50)
              nome.StudsOffset = Vector3.new(0, 5, 0)
              nome.AlwaysOnTop = true
              nome.Parent = base

              local texto = Instance.new("TextLabel")
              texto.Size = UDim2.fromScale(1, 1)
              texto.BackgroundTransparency = 1
              texto.Text = "BASE " .. i
              texto.TextScaled = true
              texto.TextColor3 = Color3.new(1, 1, 1)
              texto.Parent = nome
            end
          \`
        };

        const resposta = await fetch("/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            script: scripts[tipo]
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
      return res.status(400).json({ error: "Nenhum script Luau enviado" });
    }

    const resposta = await fetch(
      `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}/places/${PLACE_ID}/luau-execution-session-tasks`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ script })
      }
    );

    const resultado = await resposta.text();
    res.status(resposta.status).send(resultado);

  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
