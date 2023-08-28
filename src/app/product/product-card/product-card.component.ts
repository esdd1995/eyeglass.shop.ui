import { Component, Input, OnInit } from '@angular/core';
import { ProductCardModel } from '../_model/product.model';
import { ProductService } from '../_service/product.service';
import { Subscription, first } from 'rxjs';
import { ProductFilterModel } from '../_model/product-filter.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent implements OnInit {
  @Input() model: ProductCardModel
  @Input() productId: number
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  filter: ProductFilterModel;

  constructor(private productService: ProductService) {


  }
  ngOnInit(): void {
    if (this.productId)
      this.getProductById();
  }
  getProductById() {
    this.hasError = false;
    // const subscr = this.productService
    //   .listProducts(this.filter)
    //   .pipe(first())
    //   .subscribe((result: any) => {
    //     if (result) {
    //       this.model = result.products
    //     } else {
    //       this.hasError = true;
    //     }
    //   });
    // this.unsubscribe.push(subscr);
  }
  listProducts() {
    this.hasError = false;
    const subscr = this.productService
      .listProducts(this.filter)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.model = result.products
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }
}
