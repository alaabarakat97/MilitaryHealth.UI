export interface JWTPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; // userId
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;           // username
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;         // role
  exp: number;
  iss: string;
  aud: string;
  [key: string]: any;
}
