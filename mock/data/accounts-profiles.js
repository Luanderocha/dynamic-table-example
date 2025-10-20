const accountsProfilesResponse = {
  accounts: [
    {
      accountNumber: "4.785.096-7", 
      bank: 161,
      accountType: 5,
      accountModel: "Conta Investimento - PJ", 
      branchNumber: "0001"
    },
    {
      accountNumber: "4.785.096-8",
      bank: 161,
      accountType: 5,
      accountModel: "Conta Investimento - PJ",
      branchNumber: "0001"
    }
  ],
  profiles: [
    {
      profileId: 10,
      profileName: "Cobrança Online + Consultas" 
    },
    {
      profileId: 11,
      profileName: "Cobrança Completo"
    },
    {
      profileId: 12,
      profileName: "Cobrança Padrão"
    }
  ]
};

// Vamos criar um objeto para simular diferentes clientes no futuro
// Por enquanto, todos retornam o mesmo mock.
const clientsDetails = {
  '1': accountsProfilesResponse, // Detalhes para o cliente com ID 1
  '2': accountsProfilesResponse, // Cliente 2 retorna o mesmo por enquanto
  '3': accountsProfilesResponse, // Cliente 3 retorna o mesmo por enquanto
  'default': accountsProfilesResponse
}

module.exports = clientsDetails;