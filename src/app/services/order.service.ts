import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  products: ProductResponseModel[] = [];
  ServerURL = environment.SERVER_URL;

  constructor(private http: HttpClient) {
  }


  // tslint:disable-next-line:typedef
  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel[]>(this.ServerURL + 'orders/' + orderId).toPromise();
  }
}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
