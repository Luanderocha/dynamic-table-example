// src/app/services/client-management.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDetailsResponse, ClientResponse } from './client-management.models';

@Injectable({
  providedIn: 'root'
})
export class ClientManagementService {

  private readonly BASE_URL = 'http://localhost:3000/client-management/v1';

  constructor(private http: HttpClient) { }

  getClients(page: number = 1, size: number = 5): Observable<ClientResponse> {
    const url = `${this.BASE_URL}/clients`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ClientResponse>(url, { params });
  }

  getAccountDetails(clientId: number): Observable<AccountDetailsResponse> {
    const url = `${this.BASE_URL}/accounts`;
    const params = new HttpParams().set('clientId', clientId.toString());
    
    return this.http.get<AccountDetailsResponse>(url, { params });
  }
}