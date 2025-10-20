const express = require("express");
const cors = require("cors");
const clientsResponse = require("./data/clients-paginated");
const clientsDetails = require("./data/accounts-profiles");

const app = express();
const PORT = 3000;

app.use(cors());

// --- Endpoint 1: Lista de Clientes com Paginação ---
// Rota: /client-management/v1/clients
app.get("/client-management/v1/clients", (req, res) => {
  // 'req.query' nos permite ler parâmetros da URL, como ?page=1
  const page = req.query.page || 1;

  console.log(
    `[${new Date().toLocaleTimeString()}] GET /client-management/v1/clients?page=${page}`
  );

  // No futuro, podemos alterar 'clientsResponse' com base na 'page'

  setTimeout(() => {
    res.json(clientsResponse);
  }, 500); // Delay de 500ms
});

// --- Endpoint 2: Contas e Perfis de um Cliente Específico ---
// Rota: /client-management/v1/accounts?clientId=123
app.get("/client-management/v1/accounts", (req, res) => {
  const clientId = req.query.clientId;

  if (!clientId) {
    return res.status(400).json({ error: "clientId é obrigatório" });
  }

  console.log(
    `[${new Date().toLocaleTimeString()}] GET /client-management/v1/accounts?clientId=${clientId}`
  );

  // Seleciona os dados com base no ID ou usa o 'default'
  const responseData = clientsDetails[clientId] || clientsDetails["default"];

  setTimeout(() => {
    res.json(responseData);
  }, 800); // Delay maior para simular uma chamada mais complexa
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor mock rodando em http://localhost:${PORT}`);
  console.log("Endpoints disponíveis:");
  console.log(`  GET http://localhost:${PORT}/client-management/v1/clients`);
  console.log(
    `  GET http://localhost:${PORT}/client-management/v1/accounts?clientId=1`
  );
});
