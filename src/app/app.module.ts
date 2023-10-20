import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { VideoCaptureComponent } from './video-capture/video-capture.component';
import { HttpHeadersInterceptor } from './http-headers.interceptor';
import { ProductListComponent } from './product/product-list/product-list.component';
import { PersianNumberPipe } from './persian-number.pipe';
import { WebcamSnapshotModule } from './webcam-snapshot/webcam-snapshot.module';
import { BasketComponent } from './shoping/basket/basket.component';
import { AddOrderComponent } from './shoping/add-order/add-order.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './auth/components/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}
@NgModule({
  declarations: [

    //
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProductDetailComponent,
    ProductCardComponent,
    VideoCaptureComponent,
    ProductListComponent,
    PersianNumberPipe,
    BasketComponent,
    AddOrderComponent,
    LoginComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamSnapshotModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeadersInterceptor,
    multi: true,
  }, {
    provide: APP_INITIALIZER,
    useFactory: appInitializer,
    multi: true,
    deps: [AuthService],
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
