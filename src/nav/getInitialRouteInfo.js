/* @flow strict-local */

import type { ScreenParams } from '@react-navigation/native';

import type { Account } from '../types';

export default (args: {|
  hasAuth: boolean,
  accounts: Account[],
|}): {| initialRouteName: string, initialRouteParams?: ScreenParams |} => {
  const { hasAuth, accounts } = args;

  // If the active account is not logged in, bring the user as close
  // as we can to AuthScreen, the place where they can log in.
  if (!hasAuth) {
    if (accounts.length > 1) {
      // We can't guess which account, of multiple, the user wants
      // to use. Let them pick one.
      return { initialRouteName: 'account-pick' };
    } else if (accounts.length === 1) {
      // We already know the realm, so give that to the realm
      // screen. If that screen finds that the realm is valid, it'll
      // send the user along to AuthScreen for that realm right
      // away. If this means you're on the AuthScreen when you don't
      // want to be (i.e., you want to choose a different realm),
      // you can always go back to RealmInputScreen.
      return {
        initialRouteName: 'realm-input',
        initialRouteParams: { initial: true, realm: accounts[0].realm },
      };
    } else {
      // Just go to the realm screen and have the user type out the
      // realm.
      return {
        initialRouteName: 'realm-input',
        initialRouteParams: { initial: true, realm: undefined },
      };
    }
  }

  // Show the main UI screen.
  //
  // If we don't have server data yet, that screen will show a loading
  // indicator until the data is loaded. Crucially, `sessionReducer`
  // will have set `needsInitialFetch`, too, so we really will be
  // loading.
  return { initialRouteName: 'main-tabs' };
};
