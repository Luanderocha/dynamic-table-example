// src/app/services/client-management.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AccountDetailsResponse,
  ClientResponse,
} from './client-management.models';

@Injectable({
  providedIn: 'root', // Disponível em toda a aplicação
})
export class ClientManagementService {
  // URL base do nosso servidor mock
  private readonly BASE_URL = 'http://localhost:3000/client-management/v1';

  constructor(private http: HttpClient) {}

  /**
   * Busca a lista paginada de clientes.
   * Por enquanto, ignora a paginação e busca a primeira página.
   */
  getClients(): Observable<ClientResponse> {
    const url = `${this.BASE_URL}/clients`;
    // No futuro, poderíamos passar 'page' e 'size' aqui
    // const params = new HttpParams().set('page', '1').set('size', '20');
    // return this.http.get<ClientResponse>(url, { params });
    return this.http.get<ClientResponse>(url);
  }

  /**
   * Busca os detalhes de contas e perfis de um cliente específico.
   * @param clientId O ID do cliente
   */
  getAccountDetails(clientId: number): Observable<AccountDetailsResponse> {
    const url = `${this.BASE_URL}/accounts`;
    const params = new HttpParams().set('clientId', clientId.toString());

    return this.http.get<AccountDetailsResponse>(url, { params });
  }
}
