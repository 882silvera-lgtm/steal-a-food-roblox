const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const UNIVERSE_ID = "10429976350";
const PLACE_ID = "117902952563660";

const persistentScript = `
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

local restaurants = Workspace:WaitForChild("RoubeUmaComida")

local bases = {
    restaurants:FindFirstChild("Restaurante1"),
    restaurants:FindFirstChild("Restaurante2"),
    restaurants:FindFirstChild("Restaurante3"),
    restaurants:FindFirstChild("Restaurante4")
}

local occupied = {}

local function getSpawn(base)
    if not base then
        return nil
    end

    return base:FindFirstChild("SpawnBase")
end

local function teleportPlayer(player, base)
    local spawnPart = getSpawn(base)

    if not spawnPart then
        return
    end

    local character = player.Character or player.CharacterAdded:Wait()
    local root = character:WaitForChild("HumanoidRootPart")

    root.CFrame = spawnPart.CFrame + Vector3.new(0, 4, 0)
end

local function assignBase(player)
    for index, base in ipairs(bases) do
        if base and not occupied[index] then
            occupied[index] = player.UserId

            player:SetAttribute("BaseNumero", index)

            player.CharacterAdded:Connect(function()
                task.wait(0.5)
                teleportPlayer(player, base)
            end)

            if player.Character then
                task.wait(0.5)
                teleportPlayer(player, base)
            end

            return
        end
    end

    player:Kick("Todas as bases estão ocupadas. Tente novamente em alguns segundos.")
end

local function freeBase(player)
    local baseNumber = player:GetAttribute("BaseNumero")

    if baseNumber then
        occupied[baseNumber] = nil
    end
end

Players.PlayerAdded:Connect(assignBase)
Players.PlayerRemoving:Connect(freeBase)

for _, player in ipairs(Players:GetPlayers()) do
    task.spawn(function()
        assignBase(player)
    end)
end
`;

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Roube uma Comida</title>
            <style>
                body {
                    font-family: Arial;
                    background: #111;
                    color: white;
                    text-align: center;
                    padding: 40px 15px;
                }

                button {
                    display: block;
                    width: 90%;
                    max-width: 400px;
                    margin: 20px auto;
                    padding: 18px;
                    font-size: 20px;
                    border: 0;
                    border-radius: 12px;
                    background: #00c853;
                    color: white;
                    font-weight: bold;
                }

                h1 {
                    margin-bottom: 35px;
                }
            </style>
        </head>

        <body>
            <h1>🍔 Roube uma Comida</h1>

            <button onclick="instalar()">
                🚀 Instalar / Atualizar Jogo
            </button>

            <p id="status"></p>

            <script>
                async function instalar() {
                    const status = document.getElementById("status");

                    status.innerText = "Criando jogo...";

                    const resposta = await fetch("/install", {
                        method: "POST"
                    });

                    const texto = await resposta.text();

                    status.innerText = texto;
                }
            </script>
        </body>
        </html>
    `);
});

app.post("/install", async (req, res) => {
    const script = `
local Workspace = game:GetService("Workspace")
local ServerScriptService = game:GetService("ServerScriptService")

-- LIMPAR SPAWNS ANTIGOS
for _, obj in ipairs(Workspace:GetDescendants()) do
    if obj:IsA("SpawnLocation") then
        obj:Destroy()
    end
end

-- APAGAR MAPA ANTIGO
local oldMap = Workspace:FindFirstChild("RoubeUmaComida")
if oldMap then
    oldMap:Destroy()
end

-- APAGAR SCRIPT ANTIGO
local oldScript = ServerScriptService:FindFirstChild("RoubeUmaComidaServer")
if oldScript then
    oldScript:Destroy()
end

-- PASTA PRINCIPAL
local gameFolder = Instance.new("Folder")
gameFolder.Name = "RoubeUmaComida"
gameFolder.Parent = Workspace

-- CHÃO
local ground = Instance.new("Part")
ground.Name = "Chao"
ground.Size = Vector3.new(260, 2, 260)
ground.Position = Vector3.new(0, -1, 0)
ground.Anchored = true
ground.Material = Enum.Material.Grass
ground.Parent = gameFolder

local basePositions = {
    Vector3.new(-75, 1, -75),
    Vector3.new(75, 1, -75),
    Vector3.new(-75, 1, 75),
    Vector3.new(75, 1, 75)
}

for i, position in ipairs(basePositions) do

    local restaurant = Instance.new("Model")
    restaurant.Name = "Restaurante" .. i
    restaurant.Parent = gameFolder

    -- PLATAFORMA DA BASE
    local platform = Instance.new("Part")
    platform.Name = "MesaRestaurante"
    platform.Size = Vector3.new(55, 2, 42)
    platform.Position = position
    platform.Anchored = true
    platform.Material = Enum.Material.WoodPlanks
    platform.Parent = restaurant

    -- PAREDES
    local wallBack = Instance.new("Part")
    wallBack.Size = Vector3.new(55, 8, 1)
    wallBack.Position = position + Vector3.new(0, 5, 20)
    wallBack.Anchored = true
    wallBack.Parent = restaurant

    local wallLeft = Instance.new("Part")
    wallLeft.Size = Vector3.new(1, 8, 42)
    wallLeft.Position = position + Vector3.new(-27, 5, 0)
    wallLeft.Anchored = true
    wallLeft.Parent = restaurant

    local wallRight = Instance.new("Part")
    wallRight.Size = Vector3.new(1, 8, 42)
    wallRight.Position = position + Vector3.new(27, 5, 0)
    wallRight.Anchored = true
    wallRight.Parent = restaurant

    -- SPAWN DA BASE
    local spawnPart = Instance.new("Part")
    spawnPart.Name = "SpawnBase"
    spawnPart.Size = Vector3.new(8, 1, 8)
    spawnPart.Position = position + Vector3.new(0, 2, -28)
    spawnPart.Anchored = true
    spawnPart.Transparency = 0.5
    spawnPart.CanCollide = false
    spawnPart.Parent = restaurant

    -- SLOTS DE COMIDA
    local slotsFolder = Instance.new("Folder")
    slotsFolder.Name = "FoodSlots"
    slotsFolder.Parent = restaurant

    for slot = 1, 20 do
        local foodSlot = Instance.new("Part")
        foodSlot.Name = "FoodSlot" .. slot
        foodSlot.Size = Vector3.new(4, 1, 4)
        foodSlot.Anchored = true

        local row = math.floor((slot - 1) / 10)
        local column = (slot - 1) % 10

        foodSlot.Position =
            position +
            Vector3.new(-22 + column * 4.8, 2, -12 + row * 6)

        foodSlot.Material = Enum.Material.Neon
        foodSlot.Transparency = 0.7
        foodSlot.Parent = slotsFolder
    end

    -- BANCOS
    local benchesFolder = Instance.new("Folder")
    benchesFolder.Name = "Benches"
    benchesFolder.Parent = restaurant

    for bench = 1, 20 do
        local seat = Instance.new("Seat")
        seat.Name = "Banco" .. bench
        seat.Size = Vector3.new(3, 1, 3)
        seat.Anchored = true

        local row = math.floor((bench - 1) / 10)
        local column = (bench - 1) % 10

        seat.Position =
            position +
            Vector3.new(-22 + column * 4.8, 2, 5 + row * 5)

        seat.Parent = benchesFolder
    end

    -- LETREIRO
    local sign = Instance.new("Part")
    sign.Name = "Letreiro"
    sign.Size = Vector3.new(20, 5, 1)
    sign.Position = position + Vector3.new(0, 7, 20)
    sign.Anchored = true
    sign.Parent = restaurant

    local gui = Instance.new("SurfaceGui")
    gui.Face = Enum.NormalId.Front
    gui.Parent = sign

    local text = Instance.new("TextLabel")
    text.Size = UDim2.fromScale(1, 1)
    text.BackgroundTransparency = 1
    text.Text = "🍔 RESTAURANTE " .. i
    text.TextScaled = true
    text.TextColor3 = Color3.fromRGB(255, 255, 255)
    text.Parent = gui
end

-- CRIAR SCRIPT PERMANENTE
local serverScript = Instance.new("Script")
serverScript.Name = "RoubeUmaComidaServer"
serverScript.Disabled = false
serverScript.Source = ${JSON.stringify(persistentScript)}
serverScript.Parent = ServerScriptService

task.wait(2)

-- SALVAR O PLACE
local sucesso, erro = pcall(function()
    game:SavePlaceAsync()
end)

if sucesso then
    return "SUCESSO: jogo instalado e salvo! Entre novamente no jogo para testar o spawn."
else
    return "MAPA CRIADO, mas erro ao salvar: " .. tostring(erro)
end
`;

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
    console.log("Servidor rodando na porta " + PORT);
});
