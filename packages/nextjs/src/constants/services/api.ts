enum ApiKey {
  // auth
  login = 'login',
  logout = 'logout',
  me = 'me',
  isLogged = 'isLogged',
  refreshToken = 'refreshToken',

  // admin
  accountList = 'accountList',
  accountDetail = 'accountDetail',

  // permission
  permissionList = 'permissionList',

  // role
  roleList = 'roleList',
  roleDetail = 'roleDetail',
  roleAdminList = 'roleAdminList'
}

export { ApiKey }
