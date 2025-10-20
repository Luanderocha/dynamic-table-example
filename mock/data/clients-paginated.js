const clientsResponse = {
  clients: [
    {
      clientIbpjId: 1,
      corporateName: "Empresa Alpha LTDA",
      document: "00.000.000/0001-00",
      currentClient: true,
    },
    {
      clientIbpjId: 2,
      corporateName: "Empresa Beta S/A",
      document: "00.000.000/0001-01",
      currentClient: false,
    },
    {
      clientIbpjId: 3,
      corporateName: "Empresa Gama Corp",
      document: "00.000.000/0001-02",
      currentClient: false,
    },
  ],
  pagination: {
    firstPage: true,
    lastPage: false,
    number: 1,
    size: 20,
    totalElements: 45, // Exemplo: 45 clientes no total
    totalPages: 3, // Exemplo: 3 páginas no total
  },
};

module.exports = clientsResponse;
