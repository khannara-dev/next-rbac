import '@khannara/next-rbac';

declare module '@khannara/next-rbac' {
  export interface RBACTypes {
    Permission:
      | 'users.create'
      | 'users.read'
      | 'users.update'
      | 'users.delete'
      | 'products.create'
      | 'products.read'
      | 'products.update'
      | 'products.delete'
      | 'settings.read'
      | 'settings.update';

    Role: 'admin' | 'manager' | 'user';
  }
}
