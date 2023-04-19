import { ColorModel } from "./ColorModel";
import { ProductItem } from "./Product";
import { SizeModel } from "./SizeModel";

export interface ProductDetailModel {
    id?: number;
    productName?: string;
    sizeName?: string;
    colorName?: string;
    product?: ProductItem;
    color?: ColorModel;
    size?: SizeModel;
    idColor?: number;
    idCize?: number;
    image?: string;
    price?: number;
    costPrice?: number;
    salePrice?: number;
    minPrice?: number;
    maxPrice?: number;
    quantity?: number;
    sellNumber?: number;
    finalPrice?: number;
 }