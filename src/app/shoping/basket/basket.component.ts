import { Component, OnInit } from '@angular/core';
import { BasketLocalModel, BasketModel } from '../_model/basket.model';
import { ShopingService } from '../_service/shoping.service';
import { Subscription, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/app/common/enum/product-type.enum';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})

export class BasketComponent implements OnInit {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];

  basketLocalModel: BasketLocalModel[]
  model: BasketModel[]
  totalAmount = 0;
  discount = 0;
  payableAmount = 0;
  constructor(private shopingService: ShopingService) {
    this.model = []
    this.basketLocalModel = []
  }
  ngOnInit(): void {
    this.getBasketFromLocal()
    this.loadProducts();
  }

  getBasketFromLocal() {
    const basketItemsJSON = localStorage.getItem("local-basket");
    if (basketItemsJSON)
      this.basketLocalModel = JSON.parse(basketItemsJSON)
  }

  loadProducts() {
    this.hasError = false;
    const subscr = this.shopingService
      .listBasketProducts(this.basketLocalModel)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.model = result.products
          this.setCountFromLocal()
          this.calculateAmounts()
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }
  setCountFromLocal() {
    this.model.forEach(item => {
      item.count = this.basketLocalModel.filter(x => x.productId == item.productId && x.productPriceId == item.productPriceId)[0].count
    });
  }
  calculateAmounts() {

    this.payableAmount = 0
    this.totalAmount = 0
    this.discount = 0

    this.model.forEach(item => {
      this.totalAmount += item.mainPrice * item.count;
      if (item.specialPrice !== null && item.specialPrice > 0) {
        this.payableAmount += item.specialPrice * item.count;
      } else {
        this.payableAmount += item.mainPrice * item.count;
      }
    });
    this.discount = this.totalAmount - this.payableAmount
  }
  getPictureUrl(imageUrl: string) {
    const apiUrl = `${environment.apiUrl}Files`
    if (!imageUrl) {
      return "none";
    }
    return `${apiUrl}/${imageUrl}`;
  }
  incrementCount(item: BasketModel) {
    this.model.filter(x => x === item)[0].count++;
    this.calculateAmounts()
    this.updateLocalBasket()
  }

  decrementCount(item: BasketModel) {
    if (this.model.filter(x => x === item)[0].count > 1) {
      this.model.filter(x => x === item)[0].count--;
      this.calculateAmounts()
      this.updateLocalBasket()
    } else {
      this.deleteItemFromBasket(item)
    }
  }
  deleteItemFromBasket(item: BasketModel) {
    this.model = this.model.filter(x => x !== item)
    this.calculateAmounts()
    this.updateLocalBasket()
  }
  updateLocalBasket() {
    this.basketLocalModel = []
    this.model.map((x) => {
      let bl = new BasketLocalModel()
      bl.count = x.count
      bl.productId = x.productId
      bl.productPriceId = x.productPriceId
      //TODO:
      // bl.type = x.type
      this.basketLocalModel.push(bl)
    })
    localStorage.setItem("local-basket", JSON.stringify(this.basketLocalModel))
  }
}
