import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ProductComponent} from './components/product/product.component';
import {CartComponent} from './components/cart/cart.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {ThankyouComponent} from './components/thankyou/thankyou.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ProfileGuard} from './gaurd/profile.guard';
import {LoginComponent} from './components/login/login.component';
import {AboutUsComponent} from './components/about-us/about-us.component';
import {GamingAccessoriesComponent} from './components/gaming-accessories/gaming-accessories.component';
import {GamingLaptopComponent} from './components/gaming-laptop/gaming-laptop.component';
import {GamingConsoleComponent} from './components/gaming-console/gaming-console.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'thankyou', component: ThankyouComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]
  },
  {
    path: 'gaming-console', component: GamingConsoleComponent
  },
  {
    path: 'gaming-laptop', component: GamingLaptopComponent
  },
  {
    path: 'gaming-accessories', component: GamingAccessoriesComponent
  },
  {
    path: 'about-us', component: AboutUsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
