import { Component, OnInit } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { ProductFilterModel } from '../_model/product-filter.model';
import { ProductCardModel } from '../_model/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../_service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  filter: ProductFilterModel;
  products: ProductCardModel[] = []
  
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
          this.products = result.products as ProductCardModel[]
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }

}
