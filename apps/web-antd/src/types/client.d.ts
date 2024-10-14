export interface ClientInfo {
  Id: number;
  Enabled: boolean;
  ClientId: string;
  ClientName: string;
  ClientURI?: string;
  Description?: string;
  Scopes: string;
  GrantTypes: string;
  RedirectUris?: string;
  RequireConsent: boolean;
  RequirePkce: boolean;
  RequireSecret: boolean;
  LogoURI?: string;
  Claims: any;
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
