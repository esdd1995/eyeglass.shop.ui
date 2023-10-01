import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { VideoCaptureComponent } from './video-capture/video-capture.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { WebcamSnapshotComponent } from './webcam-snapshot/webcam-snapshot.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product-list/:params', component: ProductListComponent },
  { path: 'product-detail/glass/:productId', component: ProductDetailComponent },
  { path: 'tryAR/:productId', component: VideoCaptureComponent },
  { path: 'tryAR-beta/:productId', component: WebcamSnapshotComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
