import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BasketLocalModel } from "../../_model/basket.model";
let API_URL: string;

@Injectable({
    providedIn: 'root'
})
export class ShopingHTTPService {

    constructor(private http: HttpClient) {
        API_URL = environment.apiUrl;
    }
    listBasketProducts(basket: BasketLocalModel[]): Observable<any> {
        return this.http.post<any>(`${API_URL}Shop/Products/ListBasket`, basket);
    }
  
    // addProduct(model: ProductFormModel): Observable<ProductFormModel> {
    //     var form_data = new FormData();
    //     for (var key in model) {
    //         form_data.append(key, model[key]);
    //     }
    //     return this.http.post<ProductFormModel>(`${API_URL}Products`, form_data);
    // }

    // updateProduct(model: ProductFormModel): Observable<ProductFormModel> {
    //     return this.http.put<ProductFormModel>(`${API_URL}Products`, model);
    // }

    // deleteProduct(id: number): Observable<any> {
    //     return this.http.delete<any>(`${API_URL}Products/${id}`);
    // }

    // getProductProperties(productId : number) : Observable<any>{
    //     return this.http.get<PropertyValueModel[]>(`${API_URL}Products/${productId}/Properties`);
    // }
    // getProductGallery(productId : number) : Observable<any>{
    //     return this.http.get<ProductGelleryModel[]>(`${API_URL}Products/${productId}/Gallery`);
    // }
    // updateProductProperties(model: PropertyValueUpdateModel): Observable<PropertyValueUpdateModel> {
    //     return this.http.put<PropertyValueUpdateModel>(`${API_URL}Products/Properties`, model);

    // }

   

}
