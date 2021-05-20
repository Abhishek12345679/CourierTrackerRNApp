export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
};

export type Order = {
  orderNumber: string;
  productName: string;
  productImage: string;
  sellerName?: string;
  deliveryCharges?: string;
  ETA: string;
  quantity: string;
  deliveryDiscount?: string;
  productPrice: string;
  productLink?: string;
  totalPrice: string;
  from: string;
  //   totalDeliveryCharges?: string;
};

export type OrderList = {
  // [ETA: string]: Order;
  EstimatedDeliveryTime: string;
  orderItems: Order[];
};

export type AmazonOrder = {
  totalPrice: string;
  orderNumber: string;
  ETA: string;
  delivery_address: string;
  invoiceLink: string;
  orderPreviewLink: string;
};
