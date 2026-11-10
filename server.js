const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

app.get("/", (req, res) => {
  res.send(`
    <h1>🍔 Roube uma Comida</h1>

    <button onclick="executar('mapa')">
      🗺️ Criar Mapa
    </button>

    <button onclick="executar('bases')">
      🏠 Criar Bases
    </button>

    <script>
      async function executar(tipo) {

        const scripts = {

          mapa: \`
            local Workspace = game:GetService("Workspace")

            local antigo = Workspace:FindFirstChild("MapaRoubeUmaComida")
            if antigo then
              antigo:Destroy()
            end

            local pasta = Instance.new("Folder")
            pasta.Name = "MapaRoubeUmaComida"
            pasta.Parent = Workspace

            -- CHÃO PRINCIPAL
            local chao = Instance.new("Part")
            chao.Name = "ChaoPrincipal"
            chao.Size = Vector3.new(200, 1, 200)
            chao.Position = Vector3.new(0, 0, 0)
            chao.Anchored = true
            chao.Parent = pasta

            -- PRAÇA CENTRAL
            local praca = Instance.new("Part")
            praca.Name = "PracaCentral"
            praca.Size = Vector3.new(70, 1, 70)
            praca.Position = Vector3.new(0, 1, 0)
            praca.Anchored = true
            praca.Parent = pasta

            -- ÁREA DE COMIDAS
            local areaComidas = Instance.new("Part")
            areaComidas.Name = "AreaDasComidas"
            areaComidas.Size = Vector3.new(45, 1, 45)
            areaComidas.Position = Vector3.new(0, 2, 0)
            areaComidas.Anchored = true
            areaComidas.Parent = pasta

            -- PLACA DA ÁREA DE COMIDAS
            local placa = Instance.new("BillboardGui")
            placa.Size = UDim2.new(0, 300, 0, 70)
            placa.StudsOffset = Vector3.new(0, 6, 0)
            placa.AlwaysOnTop = true
            placa.Parent = areaComidas

            local texto = Instance.new("TextLabel")
            texto.Size = UDim2.fromScale(1, 1)
            texto.BackgroundTransparency = 1
            texto.Text = "🍔 ÁREA DAS COMIDAS 🍕"
            texto.TextScaled = true
            texto.TextColor3 = Color3.new(1, 1, 1)
            texto.Parent = placa

            -- CAMINHOS PARA AS BASES
            local caminhos = {
              Vector3.new(0, 1.5, -55),
              Vector3.new(0, 1.5, 55),
              Vector3.new(-55, 1.5, 0),
              Vector3.new(55, 1.5, 0)
            }

            local tamanhos = {
              Vector3.new(12, 0.5, 60),
              Vector3.new(12, 0.5, 60),
              Vector3.new(60, 0.5, 12),
              Vector3.new(60, 0.5, 12)
            }

            for i, posicao in ipairs(caminhos) do
              local caminho = Instance.new("Part")
              caminho.Name = "Caminho" .. i
              caminho.Size = tamanhos[i]
              caminho.Position = posicao
              caminho.Anchored = true
              caminho.Parent = pasta
            end

            print("Mapa criado com sucesso!")
          \`,

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
      return res.status(400).json({
        error: "Nenhum script Luau enviado"
      });
    }

    const resposta = await fetch(
      \`https://apis.roblox.com/cloud/v2/universes/\${UNIVERSE_ID}/places/\${PLACE_ID}/luau-execution-session-tasks\`,
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
    res.status(500).json({
      error: erro.message
    });
  }
});

app.listen(PORT, () => {
  console.log(\`Servidor rodando na porta \${PORT}\`);
});
