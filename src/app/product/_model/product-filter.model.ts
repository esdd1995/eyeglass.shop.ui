export class ProductFilterModel {
    title: string
    pageSize: number
    pageNumber: number
    constructor() {
        this.pageNumber = 1
        this.pageSize = 100
    }
}