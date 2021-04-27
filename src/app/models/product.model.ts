export interface ProductModelServer {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  images: string;
}


// tslint:disable-next-line:class-name
export interface serverResponse  {
  count: number;
  products: ProductModelServer[];
}
