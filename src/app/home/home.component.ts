import { Component, OnInit } from '@angular/core';
import { ProductFilterModel } from '../product/_model/product-filter.model';
import { Subscription, first } from 'rxjs';
import { ProductService } from '../product/_service/product.service';
import { ProductCardModel } from '../product/_model/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  filter: ProductFilterModel;
  productListForCarousel : ProductCardModel[] = []
  constructor(private productService: ProductService){

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
          this.productListForCarousel = result.products
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }

}
