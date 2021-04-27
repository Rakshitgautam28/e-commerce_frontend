import {Injectable} from '@angular/core';
import {ProductService} from './product.service';
import {BehaviorSubject} from 'rxjs';
import {CartModelPublic, CartModelServer} from '../models/cart.model';
import {ProductModelServer} from '../models/product.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NavigationExtras, Router} from '@angular/router';
import {OrderService} from './order.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';

// tslint:disable-next-line:prefer-const
let product: any;

@Injectable({
  providedIn: 'root'
})


export class CartService {

  private ServerURL = environment.SERVER_URL;
// This will be sent to the backend Server as post data
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      id: 0,
      incart: 0
    }],
  };
  // Cart Data variable to store the cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      product,
      numInCart: 0
    }],
  };

  // tslint:disable-next-line:ban-types
  cartTotal$ = new BehaviorSubject<number>(0);
  // Data variable to store the cart information on the client's local storage
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private productService: ProductService,
              private orderService: OrderService,
              private http: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart') as string);

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClient = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              product: actualProductInfo,
              numInCart: p.incart
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        });
      });
    }
  }

  // tslint:disable-next-line:typedef
  AddProductToCart(id: number, quantity?: number) {

    this.productService.getSingleProduct(id).subscribe(prod => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart.`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }  // END of IF
      // Cart is not empty
      else {
        const index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);
        // 1. If chosen product is already in cart array
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            // tslint:disable-next-line:max-line-length
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            // tslint:disable-next-line:max-line-length no-unused-expression
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.info(`${prod.name} quantity updated in the cart.`, 'Product Updated', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            id: prod.id,
            incart: 1
          });
          this.toast.success(`${prod.name} added to the cart.`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  }

  // tslint:disable-next-line:typedef
  UpdateCartItems(index: number, increase: boolean) {
    const data = this.cartDataServer.data[index];
    if (increase) {
      // tslint:disable-next-line:no-unused-expression
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.numInCart--;

      // @ts-ignore
      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  // tslint:disable-next-line:typedef
  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {total: 0, prodData: [{id: 0, incart: 0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [{
            numInCart: 0,
            product
          }],

        };
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }

  // tslint:disable-next-line:typedef
  CheckoutFromCart(userId: number){
    // @ts-ignore
    this.http.post<boolean>(`${this.ServerURL}orders/payment`, null).subscribe((res: { success: boolean }) => {
      if (res.success) {
        console.log(res);
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
          })
        };
        this.resetServerData();
        // @ts-ignore
        // tslint:disable-next-line:max-line-length
        this.http.post<object>(`${this.ServerURL}orders/new`, {userId, products: this.cartDataClient.prodData}).subscribe((data: OrderResponse) => {
          console.log(data.order_id);
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });
        });
      } else {
        console.log('not success');
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }           // not working properly

  // tslint:disable-next-line:typedef
  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  // tslint:disable-next-line:typedef
  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        product,
        numInCart: 0
      }]
    };
    this.cartData$.next({... this.cartDataServer});
  }

  CalculateSubTotal(index: number): number{
    let subTotal = 0;
    const p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal;
  }

}

// tslint:disable-next-line:class-name
interface OrderResponse {
  message: string;
  success: boolean;
  order_id: number;
  products: [{
    id: string,
    numInCart: string
  }];
}



