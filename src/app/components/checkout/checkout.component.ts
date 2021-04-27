import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartModelServer} from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // @ts-ignore
  cartTotal: number;
  // @ts-ignore
  cartData: CartModelServer;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  // tslint:disable-next-line:typedef
  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(2);
    });
  }

}
