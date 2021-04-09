import {applySnapshot, types} from 'mobx-state-tree';

export type Credentials = {
  access_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
};

// TODO: Add firebase to store refresh_token for future logins (if uninstalled)
const googleCredentials = types.model('googleCredentials', {
  access_token: types.optional(types.string, ''),
  scope: types.optional(types.string, ''),
  token_type: types.optional(types.string, ''),
  expiry_date: types.optional(types.number, 0),
});

// central Store
const store = types
  .model('store', {
    googleCredentials: types.optional(googleCredentials, {}),
  })
  .actions((self) => ({
    setCredentials(credentials: Credentials) {
      self.googleCredentials = credentials;
    },
    resetCredentials() {
      applySnapshot(self.googleCredentials, {});
    },
  }));

export default store;
