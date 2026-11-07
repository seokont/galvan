export type Attribute = {name:string;values:string[]};
export type EditableProduct = {name:string;sku:string|null;description:string;brandSlug:string;silhouette:string;attributes:Attribute[];collectionKeys:string[];images:string[];visible:boolean};
export type ProductField = keyof EditableProduct;
export type AdminProduct = {id:number;slug:string;product:EditableProduct;source:EditableProduct;version:number;overriddenFields:ProductField[];importedAt:string;sourceWriteDate:string;variantCount:number};
export type AdminMetadata = {brands:{slug:string;name:string}[];collections:{key:string;name:string;brandSlug:string}[]};
export type AdminProductPage = {items:{id:number;slug:string;name:string;sku:string|null;brandName:string;brandSlug:string;images:string[];visible:boolean;overriddenFields:string[]}[];total:number;page:number;pages:number};
export const productFields:ProductField[]=['name','sku','description','brandSlug','silhouette','attributes','collectionKeys','images','visible'];
