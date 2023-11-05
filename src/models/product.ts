import {Category} from "./category";
import {ProductImage} from "./product-image";

export interface Product {
    id: number;
    title: string;
    description: string;
    category_id: number;
    price: number;
    promo_price: number;
    quantity: number;
    link: string;
    order: number;
    enable: boolean;
    meta_title: string;
    meta_description: string;
    category: Category;
    image: ProductImage;
}