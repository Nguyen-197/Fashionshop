import { ProductDetailModel } from "./ProductDetailModel";

export interface ProductItem {
    id: number;
    name: string;
    code?: string;
    price: number;
    minPrice: number;
    maxPrice: number;
    minSalePrice: number;
    maxSalePrice: number;
    quantity: number;
    sellNumber: number;
    salePrice?: number;
    finalPrice?: number;
    image: string;
    description?: string;
    categoryName?: string;
    productGender?: number;
    checked?: boolean;
    idCategory?: number;
    listProductDetails?: ProductDetailModel[];
 }