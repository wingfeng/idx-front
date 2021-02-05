import Oidc from "oidc-client";

export const mgr = new Oidc.UserManager({

    authority: "http://localhost:9096",

    client_id: "vue_client",

    redirect_uri: "http://localhost:9000/oidc-callback",

    response_type: "id_token token",

    scope: "openid email profile",

    automaticSilentRenew: true,

});

