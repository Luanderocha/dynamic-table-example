

// --- Modelos para /clients ---
export interface Client {
  clientIbpjId: number;
  corporateName: string;
  document: string;
  currentClient: boolean;
}

export interface Pagination {
  firstPage: boolean;
  lastPage: boolean;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ClientResponse {
  clients: Client[];
  pagination: Pagination;
}

// --- Modelos para /accounts ---
export interface Account {
  accountNumber: string;
  bank: number;
  accountType: number;
  accountTypeLabel: string; 
  accountModel: string;
  branchNumber: string;
}

export interface Profile {
  profileId: number;
  profileName: string;
}

export interface AccountDetailsResponse {
  accounts: Account[];
  profiles: Profile[];
}