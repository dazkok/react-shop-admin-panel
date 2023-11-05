export interface Category {
    id: number;
    level: number;
    title: string;
    link: string;
    image: string;
    description: string;
    order: number;
    enable: boolean;
    meta_title: string;
    meta_description: string;
    index: string;
    subcategories: Category[];
}