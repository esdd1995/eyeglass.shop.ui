import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, finalize, catchError } from 'rxjs/operators';
import { ShopingHTTPService } from "./_http/shoping-http.service";
import { BasketLocalModel } from "../_model/basket.model";

@Injectable({
    providedIn: 'root'
})
export class ShopingService implements OnDestroy {
    private unsubscribe: Subscription[] = [];

    // public fields
    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMessage = new BehaviorSubject<string>('');

    get errorMessage$() {
        return this._errorMessage.asObservable();
    }

    constructor(
        private shopingHttpService: ShopingHTTPService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    listBasketProducts(basket: BasketLocalModel[]): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.shopingHttpService.listBasketProducts(basket).pipe(
            map((result: any) => {
                this.isLoadingSubject.next(false);
                return result;
            }),
            catchError((err) => {
                console.error('err', err);
                return of(err);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // addProduct(model: ProductFormModel): Observable<ProductModel> {
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.addProduct(model).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }

    // updateProduct(model: ProductFormModel): Observable<ProductModel> {
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.updateProduct(model).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }

    // deleteProduct(id: number): Observable<any> {
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.deleteProduct(id).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }

    // getProductProperties(productId : number) : Observable<PropertyValueModel[]>{
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.getProductProperties(productId).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }
    // getProductGallery(productId : number) : Observable<PropertyValueModel[]>{
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.getProductGallery(productId).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }
    // updateProductProperties(model: PropertyValueUpdateModel): Observable<any> {
    //     this.isLoadingSubject.next(true);
    //     return this.productHttpService.updateProductProperties(model).pipe(
    //         map((result: any) => {
    //             this.isLoadingSubject.next(false);
    //             return result;
    //         }),
    //         catchError((err) => {
    //             console.error('err', err);
    //             return of(err);
    //         }),
    //         finalize(() => this.isLoadingSubject.next(false))
    //     );
    // }
  
}