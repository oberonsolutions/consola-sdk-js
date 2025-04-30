export type AuthMode = 'webauthn' | 'bearer';

export interface ConsolaClientConfig {
  baseUrl: string;
  authMode: AuthMode;
  rpId?: string;
  rpName?: string;
  token?: string;
}

export interface Message {
  id: string;
  recipient: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credential {
  id: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  transports?: string[];
}

export interface AuthenticationResponse {
  user: User;
  credentials?: Credential[];
  token?: string;
}

export interface MessageResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface BearerAuthResponse {
  token: string;
  user: User;
}
