import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Observable} from "rxjs";
import {CartModelServer} from "../../models/cart.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // @ts-ignore
  cartData: CartModelServer;
  // @ts-ignore
  cartTotal: number;
  // @ts-ignore
  subTotal: number;

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  // tslint:disable-next-line:typedef
  ChangeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.UpdateCartItems(id, increaseQuantity);
  }

}
