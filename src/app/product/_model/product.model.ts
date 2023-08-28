export class ProductModel{
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
export class ProductCardModel{
    id: number
    title: string
    titleFa: string
    imageUrl: string
    price: string
    colors: string[] = []
}