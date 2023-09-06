import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, finalize, catchError } from 'rxjs/operators';
import { ProductDetailModel, ProductModel } from "../_model/product.model";
import { ProductHTTPService } from "./_http/product-http.service";
import { ProductFilterModel } from "../_model/product-filter.model";
import { FileModel } from "../_model/file.model";

@Injectable({
    providedIn: 'root'
})
export class ProductService implements OnDestroy {
    private unsubscribe: Subscription[] = [];

    // public fields
    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMessage = new BehaviorSubject<string>('');

    get errorMessage$() {
        return this._errorMessage.asObservable();
    }

    constructor(
        private productHttpService: ProductHTTPService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    listProducts(filter: ProductFilterModel): Observable<ProductModel[]> {
        this.isLoadingSubject.next(true);
        return this.productHttpService.listProducts(filter).pipe(
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

    getDetailById(id: number): Observable<ProductDetailModel> {
        this.isLoadingSubject.next(true);
        return this.productHttpService.getDetailById(id).pipe(
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
    upload(files : FileModel): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.productHttpService.upload(files).pipe(
            map((result: any) => {
                this.isLoadingSubject.next(false);
                return result;
            }),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }
}