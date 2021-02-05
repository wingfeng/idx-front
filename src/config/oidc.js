// export const oidcSettings = {
//     authority: 'http://localhost:9096',
//     clientId: 'vue_client',
//     redirectUri: 'http://localhost:9000/oidc-callback',
//     responseType: 'id_token token',
//     scope: 'openid profile'
//   }

export const oidcSettings = JSON.parse(process.env.VUE_APP_OIDC_CONFIG)