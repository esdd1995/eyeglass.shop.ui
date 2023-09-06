export class ProductModel {
    id: number;
    titleFa: string;
    titleEn: string;
    soldCount: number;
    imageUrl: string;
    tags: string
    isActive: boolean
    isOriginal: boolean
    brandName: string
    categoryName: string
    stock: number
}
export class ProductCardModel {
    id: number;
    brandTitle: string;
    categoryTitle: string;
    mainPrice: number;
    specialPrice?: number | null;
    titleFa: string;
    titleEn: string;
    imageUrl: string;
    colors: string[] = []
}
export class ProductDetailModel {
    titleFa: string
    titleEn: string
    title: string
    brandName: string
    categoryName: string
    prices: ProductPriceModel[] = []
    reviews: ProductReview[] = []
    galleries: ProductGallery[] = []
    properties: ProductPropertyValues[] = []
}
export class ProductPriceModel {
    productId: number;
    mainPrice: number;
    specialPrice: number;
    stockCount: number;
    maxOrderCount: number;
    productColorCode: string;
    productColorName: string
    productWarrantyName: number;
}
export class ProductReview {
    description: string;
    cons: string;
    pros: string;
    articleTitle: string;
    articleDescription: string;
    productId: number;
}
export class ProductGallery {
    url: string;
    description: string;
    productId: number;
}
export class ProductPropertyValues {
    value: string | number;
    isSize: boolean;
    propertyName: string;
    productId: number;
}
export class TryArRawModel {
    uniqueName: string
    rawUrls: string[]

    constructor() {
        this.rawUrls = []        
    }
}
export class TryArMaskedModel {
    productId: number
    urls: string[]
    
    constructor() {
        this.urls = []        
    }
}

// interface YourModel {
//     myField: number | string; // This field can be either a number or a string
// }

// // Sample response
// const response: YourModel = {
//     myField: "a string value" // This is a string
// };

// // Parse the field, handling cases where it's not a valid number
// const parsedField: number | string = typeof response.myField === "string"
//     ? isNaN(parseFloat(response.myField)) ? response.myField : parseFloat(response.myField)
//     : response.myField;

// console.log(parsedField);