import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://seu-identity-server-url',
  clientId: 'megasimone.identity.admin',
  dummyClientSecret: '',
  responseType: 'code',
  redirectUri: window.location.origin + '/auth/callback',
  postLogoutRedirectUri: window.location.origin + '/auth/login',
  scope: 'openid profile megasimone.api megasimone.identity',
  showDebugInformation: false,
  sessionChecksEnabled: true,
};