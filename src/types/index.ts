export type User={id:number;name:string;email:string;role:string;phone?:string;address?:string;city?:string;pincode?:string};
export type Product={id:number;name:string;brand:string;category:string;price:number;originalPrice:number;rating:number;reviewCount:number;stock:number;imageUrl:string;description?:string;badge?:string;color?:string;sizeInfo?:string;featured:boolean};
export type CartItem={productId:number;name:string;brand:string;price:number;originalPrice:number;imageUrl:string;quantity:number;stock:number;lineTotal:number};
export type Cart={items:CartItem[];subtotal:number;shippingFee:number;total:number;itemCount:number};
export type OrderItem={productId:number;name:string;imageUrl:string;quantity:number;price:number};
export type Order={id:number;status:string;subtotal:number;shippingFee:number;total:number;paymentMethod:string;shippingName:string;shippingAddress:string;shippingCity:string;shippingPincode:string;createdAt:string;items:OrderItem[]};
