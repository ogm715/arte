export type Category = 'carboncillo' | 'oleo-pastel';

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  technique: string;
  category: Category;
  inStock: boolean;
};

export const products: Product[] = [
  { id:'c_001', title:'Retrato I', price:190000, image:'/imgs/carboncillo/carboncillo1.jpeg', size:'A3', technique:'Carboncillo + tono', category:'carboncillo', inStock:true },
  { id:'c_002', title:'Gestos',    price:210000, image:'/imgs/carboncillo/carboncillo2.jpeg',    size:'40x50 cm', technique:'Carboncillo', category:'carboncillo', inStock:true },
  { id:'o_001', title:'Mar',       price:260000, image:'/imgs/oleo-pastel/arte1.jpg',       size:'50x70 cm', technique:'Óleo pastel', category:'oleo-pastel', inStock:true },
  { id:'o_002', title:'Atardecer', price:240000, image:'/imgs/oleo-pastel/arte2.jpg', size:'40x50 cm', technique:'Óleo pastel', category:'oleo-pastel', inStock:true },
];
