
function generateAllClients() {
  const allClients = [];
  for (let i = 1; i <= 15; i++) { 
    let id = i;
    let name = 'Empresa ' + String.fromCharCode(64 + i);
    let doc = `00.000.000/000${i < 10 ? '0' : ''}${i}-${i < 10 ? i : i % 10}`;
    
    allClients.push({
      clientIbpjId: id,
      corporateName: `${name} LTDA`,
      document: doc,
      currentClient: (i === 1)
    });
  }
  return allClients;
}

module.exports = generateAllClients;