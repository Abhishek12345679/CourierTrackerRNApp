import {applySnapshot, onSnapshot, types} from 'mobx-state-tree';

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

// central Store
const store = types
  .model('store', {
    googleCredentials: types.optional(googleCredentials, {}),
    loginCredentials: types.optional(loginCredentials, {}),
    didTryAutoLogin: types.optional(types.boolean, false),
  })
  .actions((self) => ({
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
