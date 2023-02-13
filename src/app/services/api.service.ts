import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private httpClient: HttpClient) {}

  postProduct(data: any) {
    return this.httpClient.post<any>(
      'http://localhost:3000/productList/',
      data
    );
  }

  getProduct() {
    return this.httpClient.get<any>('http://localhost:3000/productList/');
  }
}
