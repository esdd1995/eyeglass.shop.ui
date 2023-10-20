import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketLocalModel } from '../shoping/_model/basket.model';
import { AuthService } from '../auth/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../auth/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  itemCountInBasket = 0
  basketLocalModel: BasketLocalModel[]
  user$: Observable<UserModel>;
  private unsubscribe: Subscription[] = [];

  constructor(private auth: AuthService,
    private router: Router){

  }
  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.getBasketFromLocal()
  }
  logout() {
    this.auth.logout();
    document.location.reload();
  }
  goToBasket(){
    this.router.navigate(['/basket']);
  }
  getBasketFromLocal() {
    this.basketLocalModel = []
    const basketItemsJSON = localStorage.getItem("local-basket");
    if (basketItemsJSON)
      this.basketLocalModel = JSON.parse(basketItemsJSON)
    else {

    }
    this.itemCountInBasket = this.basketLocalModel.length
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
