import { ParameterProductsDTO } from 'swagger/services';

export interface PayloadProduct {
  name: string;
  price: number;
  oldPrice: number;
  available: boolean;
  colors: string[] | [];
  category: string;
  brand: string;
  parameterProducts: ParameterProductsDTO[];
  url: string;
  desc?: string;
  shortDesc?: string;
  keywords?: string;
  images?: string;
  tags?: string[];
  sizes?: string[];
  id?: string | undefined;
}
