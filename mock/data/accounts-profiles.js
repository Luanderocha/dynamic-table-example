
const accountsProfilesResponse = {
  accounts: [
    {
      accountNumber: "4.785.096-7",
      bank: 161,
      accountType: 5,
      accountTypeLabel: "Conta Corrente",
      accountModel: "Conta Investimento - PJ",
      branchNumber: "0001"
    },
    {
      accountNumber: "4.785.096-8",
      bank: 161,
      accountType: 5,
      accountTypeLabel: "Conta Corrente",
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

const clientsDetails = {
  '1': accountsProfilesResponse,
  '2': accountsProfilesResponse,
  '3': accountsProfilesResponse,
  'default': accountsProfilesResponse
}

module.exports = clientsDetails;