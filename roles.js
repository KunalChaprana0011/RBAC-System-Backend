const roles = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
  };
  
  const permissions = {
    ADMIN: ['*'], // Access all routes
    USER: ['/user'], // Access user-specific routes
    GUEST: ['/public'], // Access public routes
  };
  
export { roles, permissions };