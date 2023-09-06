export class ProductFilterModel {
    title?: string;
    searchTerm?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    colorId?: number | null;
    properties?: string[] | null;
    pageSize: number
    pageNumber: number
    constructor() {
        this.pageNumber = 1
        this.pageSize = 100
    }
}