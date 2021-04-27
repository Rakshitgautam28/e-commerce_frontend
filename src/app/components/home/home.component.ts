import { Component, OnInit } from '@angular/core';
// @ts-ignore
import {ProductService} from '../../services/product.service';
// @ts-ignore
import {ProductModelServer, serverResponse} from '../../models/product.model';
import {Router} from '@angular/router';
// @ts-ignore
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    // @ts-ignore
    this.productService.getAllProducts(12).subscribe((prods: serverResponse ) => {
      this.products = prods.products;
    });
  }

  // tslint:disable-next-line:typedef ban-types
  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }

  // tslint:disable-next-line:typedef
  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }
}
