import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ProductFilterModel } from "../../_model/product-filter.model";
let API_URL: string;

@Injectable({
    providedIn: 'root'
})
export class ProductHTTPService {

    constructor(private http: HttpClient) {
        API_URL = environment.apiUrl;
    }
    listProducts(filter: ProductFilterModel): Observable<any> {
        return this.http.post<any>(`${API_URL}Shop/Products/ListByFilter`, filter);
    }
    // getByIdProduct(id: number): Observable<ProductFormModel> {
    //     return this.http.get<ProductFormModel>(`${API_URL}Products/${id}`);
    // }
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

    // upload(fileModel: FileModel): Observable<any> {
    //     const formData: FormData = new FormData();
    //     for (let i = 0; i < fileModel.files.length; i++) {
    //       formData.append('files', fileModel.files[i], fileModel.files[i].name);
    //     }
    //     formData.append('category', fileModel.category.toString())
    //     formData.append('productId', fileModel.productId.toString())
    //     return this.http.post<any>(`${API_URL}Upload`, formData);
    // }

}
