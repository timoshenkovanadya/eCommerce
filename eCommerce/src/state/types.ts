import { Customer } from '@commercetools/platform-sdk';
import { AuthResponse } from '../modules/login/types';

export type StateValue = {
  [index: string]: unknown;
};

export type Callback = {
  (): void;
};

export type Subscribers = {
  [index: string]: Callback[];
};

export type StateKey = string;
export enum AuthState {
  notLogged = 'notlogged',
  logged = 'logged',
  anonymous = 'anonymous',
}

type Routes = {
  readonly products: string;
};

export interface State {
  readonly routes: Routes;
  readonly rootCategory: string;
  authState: AuthState;
  access_token: AuthResponse | Record<string, never>;
  customer: Customer | Record<string, never>;
  readonly limits: string[];
  [index: string]: unknown;
}
