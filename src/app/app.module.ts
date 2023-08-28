import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    
    //
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProductDetailComponent,
    ProductCardComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
