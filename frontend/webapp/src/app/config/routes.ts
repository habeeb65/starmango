/**
 * Application routes configuration
 */
export const RoutesConfig = {
  home: '/',
  dashboard: '/dashboard',
  auth: {
    index: '/auth/*',
    login: '/auth/login',
    signup: '/auth/signup',
    passwordReset: '/auth/password-reset',
    passwordChange: '/auth/password-change',
    confirmEmail: '/auth/confirm-email',
  },
  private: {
    index: '/*',
  },
};
