import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { WebcamSnapshotComponent } from './webcam-snapshot/webcam-snapshot.component';
import { BasketComponent } from './shoping/basket/basket.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AddOrderComponent } from './shoping/add-order/add-order.component';
import { AuthGuard } from './auth/services/auth.guard';
import { UserProfileComponent } from './auth/components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product-list/:params', component: ProductListComponent },
  { path: 'product-detail/glass/:productId', component: ProductDetailComponent },
  { path: 'tryAR-beta/:productId', component: WebcamSnapshotComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'regOrder', component: AddOrderComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'me', component: UserProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
