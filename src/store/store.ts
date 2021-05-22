import {applySnapshot, onSnapshot, types} from 'mobx-state-tree';
import {OrderList} from '../../constants/Types/OrderTypes';

export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
};

export type loginCredentialsType = {
  email: string;
  uid: string;
  token: string;
};

// TODO: Add firebase to store refresh_token for future logins (if uninstalled)
const googleCredentials = types.model('googleCredentials', {
  access_token: types.optional(types.string, ''),
  refresh_token: types.optional(types.string, ''),
  scope: types.optional(types.string, ''),
  token_type: types.optional(types.string, ''),
  expiry_date: types.optional(types.number, 0),
});

const loginCredentials = types.model('loginCredentials', {
  email: types.optional(types.string, ''),
  uid: types.optional(types.string, ''),
  token: types.optional(types.string, ''),
});

const order = types.model('Order', {
  orderId: types.optional(types.string, ''),
  orderNumber: types.optional(types.string, ''),
  productName: types.optional(types.string, ''),
  productImage: types.optional(types.string, ''),
  sellerName: types.optional(types.string, ''),
  deliveryCharges: types.optional(types.string, ''),
  ETA: types.optional(types.string, ''),
  quantity: types.optional(types.string, ''),
  deliveryDiscount: types.optional(types.string, ''),
  productPrice: types.optional(types.string, ''),
  productLink: types.optional(types.string, ''),
  totalPrice: types.optional(types.string, ''),
  from: types.optional(types.string, ''),
  calendarEventId: types.optional(types.string, ''),
});

const orderList = types.model('OrderList', {
  EstimatedDeliveryTime: types.optional(types.string, ''),
  orderItems: types.optional(types.array(order), []),
});

// central Store
const store = types
  .model('store', {
    orders: types.optional(types.array(orderList), []),
    googleCredentials: types.optional(googleCredentials, {}),
    loginCredentials: types.optional(loginCredentials, {}),
    didTryAutoLogin: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    saveOrders(orderList: OrderList[]) {
      (self as any).orders = orderList;
    },
    setCalendarEventId(id: string, orderId: string, eta: string) {
      console.log({id, orderId, eta});
      self.orders.map((order, index) => {
        if (order.EstimatedDeliveryTime === eta) {
          order.orderItems.map((item, index) => {
            if (item.orderId === orderId) {
              item.calendarEventId = id;
              console.log('added: ' + id);
            }
          });
        }
      });
    },
    setLoginCredentials(credentials: loginCredentialsType) {
      self.loginCredentials = credentials;
    },
    resetLoginCredentials() {
      applySnapshot(self.loginCredentials, {});
      console.log(self.loginCredentials);
    },
    setCredentials(credentials: Credentials) {
      self.googleCredentials = credentials;
    },
    resetCredentials() {
      applySnapshot(self.googleCredentials, {});
      console.log(self.googleCredentials);
    },
    setTryAutoLogin() {
      self.didTryAutoLogin = true;
    },
    afterCreate() {
      onSnapshot(self.loginCredentials, () => {
        console.log('State change in Credentials!');
        if (!!self.loginCredentials) {
          console.log('auth success: ', self.loginCredentials);
        }
      });
    },
  }))
  .create({});

export default store;
