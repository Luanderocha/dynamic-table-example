// src/app/accordion-list/accordion-item.model.ts

export interface Profile {
  id: number;
  name: string;
}

export interface Account {
  accountNumber: string;
  accountType: string;
  accountModel: string;
  accessProfile?: number; // Armazenaremos o ID do perfil selecionado
}

export interface AccordionItem {
  clientIbpjId: number;
  corporateName: string;
  document: string; // CNPJ
  status: 'Configurada' | 'Pendente';
  isSelected: boolean; // Para o checkbox, que agora pode ser parte do form
  accounts: Account[];
  profiles: Profile[]; // Opções para o select de cada conta
}