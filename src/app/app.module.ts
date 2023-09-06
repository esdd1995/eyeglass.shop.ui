import { NgModule } from '@angular/core';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeadersInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
