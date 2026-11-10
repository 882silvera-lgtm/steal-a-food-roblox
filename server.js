const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

app.get("/", (req, res) => {
  res.send(`
    <h1>🍔 Roube uma Comida</h1>
    <button onclick="executar()">🏠 Criar Jogo</button>

    <script>
      async function executar() {

        const script = [
          "local Players = game:GetService('Players')",
          "local Workspace = game:GetService('Workspace')",

          "-- LIMPAR MAPA PADRAO",
          "for _, objeto in ipairs(Workspace:GetChildren()) do",
          "  if objeto:IsA('BasePart') or objeto:IsA('Model') or objeto:IsA('Folder') then",
          "    objeto:Destroy()",
          "  end",
          "end",

          "-- PASTA PRINCIPAL",
          "local mapa = Instance.new('Folder')",
          "mapa.Name = 'RoubeUmaComida'",
          "mapa.Parent = Workspace",

          "-- CHAO",
          "local chao = Instance.new('Part')",
          "chao.Name = 'Chao'",
          "chao.Size = Vector3.new(300, 2, 300)",
          "chao.Position = Vector3.new(0, -1, 0)",
          "chao.Anchored = true",
          "chao.Parent = mapa",

          "-- POSICOES DOS 4 RESTAURANTES",
          "local restaurantes = {",
          "  Vector3.new(-85, 1, -85),",
          "  Vector3.new(85, 1, -85),",
          "  Vector3.new(-85, 1, 85),",
          "  Vector3.new(85, 1, 85)",
          "}",

          "-- POSICOES DE SPAWN NA FRENTE DE CADA RESTAURANTE",
          "local spawns = {",
          "  Vector3.new(-85, 4, -47),",
          "  Vector3.new(85, 4, -47),",
          "  Vector3.new(-85, 4, 47),",
          "  Vector3.new(85, 4, 47)",
          "}",

          "-- BASES DOS JOGADORES",
          "local bases = {}",

          "for numero, centro in ipairs(restaurantes) do",

          "  local restaurante = Instance.new('Model')",
          "  restaurante.Name = 'Restaurante' .. numero",
          "  restaurante.Parent = mapa",

          "  local area = Instance.new('Part')",
          "  area.Name = 'AreaRestaurante'",
          "  area.Size = Vector3.new(65, 1, 65)",
          "  area.Position = centro",
          "  area.Anchored = true",
          "  area.Parent = restaurante",

          "  -- CERCA DA BASE",
          "  local cercas = {",
          "    {Vector3.new(65, 8, 2), Vector3.new(0, 4, -31)},",
          "    {Vector3.new(65, 8, 2), Vector3.new(0, 4, 31)},",
          "    {Vector3.new(2, 8, 62), Vector3.new(-32, 4, 0)},",
          "    {Vector3.new(2, 8, 62), Vector3.new(32, 4, 0)}",
          "  }",

          "  for i, dados in ipairs(cercas) do",
          "    local cerca = Instance.new('Part')",
          "    cerca.Name = 'Cerca' .. i",
          "    cerca.Size = dados[1]",
          "    cerca.Position = centro + dados[2]",
          "    cerca.Anchored = true",
          "    cerca.Parent = restaurante",
          "  end",

          "  -- ENTRADA DA BASE",
          "  local entrada = Instance.new('Part')",
          "  entrada.Name = 'Entrada'",
          "  entrada.Size = Vector3.new(14, 8, 2)",
          "  entrada.Position = centro + Vector3.new(0, 4, -31)",
          "  entrada.Transparency = 1",
          "  entrada.CanCollide = false",
          "  entrada.Anchored = true",
          "  entrada.Parent = restaurante",

          "  -- PLACA",
          "  local placa = Instance.new('BillboardGui')",
          "  placa.Size = UDim2.new(0, 300, 0, 60)",
          "  placa.StudsOffset = Vector3.new(0, 10, 0)",
          "  placa.AlwaysOnTop = true",
          "  placa.Parent = area",

          "  local texto = Instance.new('TextLabel')",
          "  texto.Size = UDim2.fromScale(1, 1)",
          "  texto.BackgroundTransparency = 1",
          "  texto.Text = '🍽️ RESTAURANTE ' .. numero",
          "  texto.TextScaled = true",
          "  texto.TextColor3 = Color3.new(1, 1, 1)",
          "  texto.Parent = placa",

          "  -- 20 ESPACOS DE COMIDA + 20 BANCOS",
          "  for i = 1, 20 do",

          "    local linha = math.floor((i - 1) / 5)",
          "    local coluna = (i - 1) % 5",

          "    local x = (coluna - 2) * 11",
          "    local z = linha * 9 - 13",

          "    local espaco = Instance.new('Part')",
          "    espaco.Name = 'EspacoComida' .. i",
          "    espaco.Size = Vector3.new(7, 1, 7)",
          "    espaco.Position = centro + Vector3.new(x, 2, z)",
          "    espaco.Anchored = true",
          "    espaco.Parent = restaurante",

          "    local banco = Instance.new('Part')",
          "    banco.Name = 'Banco' .. i",
          "    banco.Size = Vector3.new(5, 2, 5)",
          "    banco.Position = centro + Vector3.new(x, 2, z + 4)",
          "    banco.Anchored = true",
          "    banco.Parent = restaurante",

          "  end",

          "  -- PONTO DE SPAWN",
          "  local spawn = Instance.new('Part')",
          "  spawn.Name = 'SpawnBase' .. numero",
          "  spawn.Size = Vector3.new(8, 1, 8)",
          "  spawn.Position = spawns[numero]",
          "  spawn.Transparency = 1",
          "  spawn.CanCollide = false",
          "  spawn.Anchored = true",
          "  spawn.Parent = restaurante",

          "  bases[numero] = {",
          "    restaurante = restaurante,",
          "    spawn = spawn,",
          "    dono = nil",
          "  }",

          "end",

          "-- FUNCAO PARA ESCOLHER UMA BASE LIVRE",
          "local function pegarBase(player)",
          "  for numero, dados in ipairs(bases) do",
          "    if dados.dono == nil then",
          "      dados.dono = player",
          "      player:SetAttribute('NumeroDaBase', numero)",
          "      return dados",
          "    end",
          "  end",
          "  return nil",
          "end",

          "-- TELEPORTAR PARA A PROPRIA BASE",
          "local function teleportarParaBase(player, personagem)",
          "  local numero = player:GetAttribute('NumeroDaBase')",
          "  if not numero then return end",

          "  local dados = bases[numero]",
          "  if not dados then return end",

          "  local raiz = personagem:WaitForChild('HumanoidRootPart', 10)",
          "  if raiz then",
          "    raiz.CFrame = dados.spawn.CFrame + Vector3.new(0, 4, 0)",
          "  end",
          "end",

          "-- QUANDO UM PLAYER ENTRA",
          "Players.PlayerAdded:Connect(function(player)",

          "  local dados = pegarBase(player)",

          "  if not dados then",
          "    player:Kick('Servidor cheio! Todas as 4 bases estão ocupadas.')",
          "    return",
          "  end",

          "  player.CharacterAdded:Connect(function(personagem)",
          "    task.wait(0.5)",
          "    teleportarParaBase(player, personagem)",
          "  end)",

          "end)",

          "-- LIBERAR A BASE QUANDO O PLAYER SAIR",
          "Players.PlayerRemoving:Connect(function(player)",
          "  local numero = player:GetAttribute('NumeroDaBase')",

          "  if numero and bases[numero] then",
          "    bases[numero].dono = nil",
          "  end",
          "end)",

          "print('ROUBE UMA COMIDA: MAPA E SISTEMA DE BASES CRIADOS!')"
        ].join("\\n");

        const resposta = await fetch("/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ script })
        });

        alert(await resposta.text());
      }
    </script>
  `);
});

app.post("/execute", async (req, res) => {
  try {
    const resposta = await fetch(
      "https://apis.roblox.com/cloud/v2/universes/" +
      UNIVERSE_ID +
      "/places/" +
      PLACE_ID +
      "/luau-execution-session-tasks",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script: req.body.script
        })
      }
    );

    res.status(resposta.status).send(await resposta.text());

  } catch (erro) {
    res.status(500).json({
      error: erro.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
