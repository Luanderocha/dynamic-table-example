const express = require("express");
const cors = require("cors");

const clientsDetails = require("./data/accounts-profiles");
const generateAllClients = require("./data/clients-paginated");

const app = express();
const PORT = 3000;

const allClients = generateAllClients();

app.use(cors());

app.get('/client-management/v1/clients', (req, res) => {
  
  const requestedPage = parseInt(req.query.page || '1');
  const requestedSize = parseInt(req.query.size || '5'); 
  const actualSizePerPage = 5; 

  const totalElements = allClients.length;
  const totalPages = Math.ceil(totalElements / actualSizePerPage);

  let clientsToSend = [];
  
  if (requestedPage === 1 && requestedSize >= totalElements) {
      clientsToSend = allClients;
  } else {
      const startIndex = (requestedPage - 1) * actualSizePerPage;
      const endIndex = requestedPage * actualSizePerPage;
      clientsToSend = allClients.slice(startIndex, endIndex);
  }

  const response = {
    clients: clientsToSend,
    pagination: {
      firstPage: requestedPage === 1,
      lastPage: requestedPage === totalPages,
      number: requestedPage, 
      size: actualSizePerPage, 
      totalElements: totalElements, 
      totalPages: totalPages 
    }
  };

  console.log(`[${new Date().toLocaleTimeString()}] GET /clients?page=${requestedPage}&size=${requestedSize} - Retornando ${clientsToSend.length} de ${totalElements} clientes.`);
  
  setTimeout(() => {
    res.json(response);
  }, 500);
});


app.get("/client-management/v1/accounts", (req, res) => {
  const clientId = req.query.clientId;

  if (!clientId) {
    return res.status(400).json({ error: "clientId é obrigatório" });
  }

  console.log(
    `[${new Date().toLocaleTimeString()}] GET /client-management/v1/accounts?clientId=${clientId}`
  );

  const responseData = clientsDetails[clientId] || clientsDetails["default"];

  setTimeout(() => {
    res.json(responseData);
  }, 800);
});

app.listen(PORT, () => {
  console.log(`Servidor mock rodando em http://localhost:${PORT}`);
  console.log("Endpoints disponíveis:");
  console.log(`  GET http://localhost:${PORT}/client-management/v1/clients`);
  console.log(
    `  GET http://localhost:${PORT}/client-management/v1/accounts?clientId=1`
  );
});
