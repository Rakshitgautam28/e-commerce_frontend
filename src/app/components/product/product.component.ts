import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ProductModelServer} from '../../models/product.model';
import {map} from 'rxjs/operators';
import {CartService} from '../../services/cart.service';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit, OnInit {

  // @ts-ignore
  id: number;
  // @ts-ignore
  product;
  thumbimages: any[] = [];


  @ViewChild('quantity') quantityInput: any;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartService) {


  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((param: ParamMap) => {
        // @ts-ignore
        return param.params.id;
      })
    ).subscribe(prodId => {
      this.id = prodId;
      // @ts-ignore
      this.productService.getSingleProduct(this.id).subscribe(prod => {
        this.product = prod;
        if (prod.images !== null) {
          this.thumbimages = prod.images.split(';');
        }

      });
    });
  }

  ngAfterViewInit(): void {

    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    // tslint:disable-next-line:prefer-const
    let zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  // tslint:disable-next-line:typedef
  addToCart(id: number) {
    this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);
  }

  // tslint:disable-next-line:typedef
  Increase() {
    // tslint:disable-next-line:radix
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity >= 1){
      value++;

      if (value > this.product.quantity) {
        // @ts-ignore
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  // tslint:disable-next-line:typedef
  Decrease() {
    // tslint:disable-next-line:radix
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0){
      value--;

      if (value <= 0) {
        // @ts-ignore
        value = 0;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }
}
