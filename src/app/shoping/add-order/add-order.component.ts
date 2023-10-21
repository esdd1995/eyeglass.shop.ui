import { Component, OnInit } from '@angular/core';
import { Subscription, first } from 'rxjs';
import { BasketLocalModel, BasketModel } from '../_model/basket.model';
import { ShopingService } from '../_service/shoping.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];

  basketLocalModel: BasketLocalModel[]
  model: BasketModel[]
  totalAmount = 0;
  discount = 0;
  payableAmount = 0;
  deliveryAmount = 0;

  //
  form: FormGroup;
  user: UserModel;
  constructor(private shopingService: ShopingService,
    private fb: FormBuilder,
    private authService: AuthService) {
    this.model = []
    this.basketLocalModel = []
    this.form = this.fb.group({
      fullName: [''],
      phoneNumber: [''],
      email: [''],
      address: [''],
      postalCode: [''],
      city: [''],
      state: [''],
      imageUrl: ['']
    });

    this.user = new UserModel();
  }
  ngOnInit(): void {
    this.getBasketFromLocal()
    this.loadProducts();
    this.user = this.authService.currentUserValue;
    this.patchFormValue();
  }
  getBasketFromLocal() {
    const basketItemsJSON = localStorage.getItem("local-basket");
    if (basketItemsJSON)
      this.basketLocalModel = JSON.parse(basketItemsJSON)
  }
  private patchFormValue() {
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      fullName: this.user.fullName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      address: this.user.address,
      postalCode: this.user.postalCode,
      city: this.user.city,
      state: this.user.state,
      imageUrl: this.user.imageUrl
    });
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

  updateDeliveryAmount(amount: number) {
    this.deliveryAmount = amount;
    this.calculateAmounts()
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
    this.payableAmount += this.deliveryAmount
  }

}
