import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetail } from './components/cart-detail/cart-detail';
import { Checkout } from './components/checkout/checkout';
import { Login } from './components/login/login';
import { AuthGuard } from '@auth0/auth0-angular';
import { MembersPage } from './components/members-page/members-page';
import { OrderHistoryComponent } from './components/order-history/order-history';

const routes: Routes = [
  {path: 'search/:keyword', component: ProductList},
  {path: 'products/:id', component: ProductDetails},
  {path: 'category/:id/:name', component: ProductList},
  {path: 'cart-details', component: CartDetail},
  {path: 'checkout', component: Checkout},
  {path: 'category', component: ProductList},
  {path: 'products', component: ProductList},
  {path: 'members', component: MembersPage, canActivate: [AuthGuard], data: { authGuardPipe: () => Login}},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], data: { authGuardPipe: () => Login}},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
