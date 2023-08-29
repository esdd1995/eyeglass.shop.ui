import { Component, OnInit } from '@angular/core';
import { ProductFilterModel } from '../product/_model/product-filter.model';
import { Subscription, first } from 'rxjs';
import { ProductService } from '../product/_service/product.service';
import { ProductCardModel } from '../product/_model/product.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  filter: ProductFilterModel;
  productListForCarousel: ProductCardModel[] = []
  constructor(private productService: ProductService, private router: Router) {
    this.filter = new ProductFilterModel()

  }
  ngOnInit(): void {
    this.listProducts();
  }
  listProducts() {
    this.hasError = false;
    const subscr = this.productService
      .listProducts(this.filter)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.productListForCarousel = result.products as ProductCardModel[]
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }
  initCarousel(){
    $(".testimonial-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      center: true,
      dots: true,
      loop: true,
      nav: false,
      rtl: true,

      responsive: {
          0: {
              items: 1
          },
          768: {
              items: 3
          }
      }
  });
  }
  tryAR() {
    this.router.navigate(['/tryAR']);
  }
  getPictureUrl(imageUrl: string) {
    const apiUrl = `${environment.apiUrl}Files`
    if (!imageUrl) {
      return "none";
    }
    return `${apiUrl}/${imageUrl}`;
  }

}
