import { FileCategory } from "src/app/common/enum/file-category.enum";

export class FileModel {
    files : File[];
    uniqueName: string
    category : FileCategory
    productId: number
    rawUrls: string [] = []
}
