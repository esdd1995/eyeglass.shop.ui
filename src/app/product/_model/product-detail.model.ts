export class ProductDetailModel {
    id: number;
    titleFa: string;
    titleEn: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    imageUrl: string;
    tags: string;
    isActive: boolean;
    isOriginal: boolean;
    properties: ProductPropertyModel[];
    reviews: ProductReviewModel[];
    prices: PriceModel[];
    galleries: ProductGalleryModel[];
 
    constructor() {
        this.properties = []
        this.reviews = []
        this.prices = []
        this.galleries = []        
    }
  }
  
  export class ProductGalleryModel {
    url: string;
    description: string;
  }
  
  export class PriceModel {
    mainPrice: number;
    specialPrice: number | null;
    stockCount: number;
    maxOrderCount: number;
    productColorName: string;
    productColorCode: string;
    productWarrantyName: string;
  }
  
  export class ProductReviewModel {
    title: string;
    cons: string;
    pros: string;
    articleTitle: string;
    articleDescription: string;
  }
  
  export class ProductPropertyModel {
    value: string;
    isSize: boolean;
    propertyName: string;
  }
  