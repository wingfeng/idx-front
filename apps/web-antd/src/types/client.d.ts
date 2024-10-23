export interface ClientInfo {
  id: number;
  enabled: boolean;
  clientId: string;
  clientName: string;
  clientURI?: string;
  description?: string;
  scopes: string;
  grantTypes: string;
  redirectUris?: string;
  requireConsent: boolean;
  requirePkce: boolean;
  requireSecret: boolean;
  allowOfflineAccess: boolean;
  alwaysIncludeUserClaimsInIdToken: boolean;
  allowRememberConsent: boolean;
  allowPlainTextPkce: boolean;
  logoURI?: string;
  claims: any;
}

export interface ClientSecretInfo {
  id: number;
  clientId: number;
  name: string;
  expiration: Date;
  value: string;
}
export interface GenSecretParam {
  client_id: string;
  name?: string;
  expiration?: Date;
}
export interface GetSecretResponse {
  Secrets: Array<ClientSecretInfo>;
}
