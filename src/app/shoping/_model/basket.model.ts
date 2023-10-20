import { ProductType } from "src/app/common/enum/product-type.enum"

  export class BasketLocalModel{
    productId: number
    productPriceId: number
    count: number
    type: ProductType
  }
  export class BasketModel{
    productId: number;
    productPriceId: number;
    titleFa: string;
    titleEn: string;
    brandName: string;
    categoryName: string;
    mainPrice: number;
    imageUrl: string;
    specialPrice: number | null;
    productColorName: string;
    count: number
  }