import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  
  private orderUrl = 'http://Shoponaws-env.eba-xgqguzsp.us-east-2.elasticbeanstalk.com/api/orders';
  
  constructor(private HttpClient:HttpClient) { }
  
  getOrderHistory(theEmail:string):Observable<GetResponseOrderHistory>{
    
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    
    return this.HttpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded:{
    orders: OrderHistory[];
  }
}
