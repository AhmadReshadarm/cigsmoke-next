export interface PayloadCategory {
  name: string;
  desc: string;
  url: string;
  image: string;
  parent?: string;
  id?: string | string[] | undefined;
  children?: string[];
}
