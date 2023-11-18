export interface Page {
    id: number;
    level: number;
    title: string;
    image: string;
    description: string;
    link: string;
    position: string;
    type: string;
    enable: boolean;
    order: number;
    meta_title: string;
    meta_description: string;
    index: string;
    subpages: Page[];
}