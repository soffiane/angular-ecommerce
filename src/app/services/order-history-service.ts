import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { OrderHistory } from '../model/order-history';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService{

  private orderUrl = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) { }
  getOrderHistory(email: string) : Observable<GetResponseOrderHistory> {
    const searchUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(searchUrl);
  }
  
}
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}