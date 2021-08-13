export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
};

export type NotificationInfo = {
  orderId: string;
  notificationId: number;
};

export type Order = {
  orderId: string;
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
  callReminder: boolean;
  //   totalDeliveryCharges?: string;
};

export type OrderList = {
  // [ETA: string]: Order;
  EstimatedDeliveryTime: string;
  orderItems: Order[];
};
export type AmazonOrderList = {
  // [ETA: string]: Order;
  EstimatedDeliveryTime: string;
  orderItems: AmazonOrder[];
};

export type AmazonOrder = {
  orderId: string;
  totalPrice: string;
  orderNumber: string;
  orderContent: string;
  ETA: string;
  delivery_address: string;
  invoiceLink: string;
  orderPreviewLink: string;
  callReminder: boolean;
};
