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
  logoURI?: string;
  claims: any;
}

export interface ClientSecretInfo {
  id: number;
  ClientId: number;
  Name: string;
  Expiration: Date;
  Value: string;
}
export interface GenSecretParam {
  client_id: string;
  name?: string;
  expiration?: Date;
}
export interface GetSecretResponse {
  Secrets: Array<ClientSecretInfo>;
}
