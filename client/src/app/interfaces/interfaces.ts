export interface TokenResponse {
  token: string;
}

export interface UserDetails {
  _id: string;
  name: string;
  exp: number;
}

export interface Token {
  token: string;
}

export interface TokenPayload {
  name?: string;
  email: string;
  password: string;
}
