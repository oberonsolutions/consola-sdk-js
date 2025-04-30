import axios, { AxiosInstance } from 'axios';
import { ConsolaAuth } from './auth';
import { 
  AuthMode, 
  AuthenticationResponse, 
  BearerAuthResponse, 
  ConsolaClientConfig, 
  Message, 
  MessageResponse, 
  User 
} from './types';

export class ConsolaClient {
  private config: ConsolaClientConfig;
  private auth: ConsolaAuth | null;
  private axiosInstance: AxiosInstance;

  constructor(config: ConsolaClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      withCredentials: config.authMode === 'webauthn',
    });

    // Initialize auth only for WebAuthn mode
    this.auth = config.authMode === 'webauthn' ? new ConsolaAuth(config) : null;

    // Set initial token if provided
    if (config.authMode === 'bearer' && config.token) {
      this.setAuthToken(config.token);
    }
  }

  // Authentication methods
  async register(username: string): Promise<AuthenticationResponse> {
    if (this.config.authMode !== 'webauthn') {
      throw new Error('Registration is only available in WebAuthn mode');
    }

    const options = await this.auth!.generateRegistrationOptions(username);
    const response = await this.axiosInstance.post('/api/auth/webauthn/register', {
      username,
      options,
    });
    return response.data;
  }

  async login(username: string): Promise<AuthenticationResponse | BearerAuthResponse> {
    if (this.config.authMode === 'webauthn') {
      const options = await this.auth!.generateAuthenticationOptions(username);
      const response = await this.axiosInstance.post('/api/auth/webauthn/authenticate', {
        username,
        options,
      });
      return response.data;
    } else {
      const response = await this.axiosInstance.post('/api/auth/token', {
        username,
      });
      const data = response.data as BearerAuthResponse;
      this.setAuthToken(data.token);
      return data;
    }
  }

  // Message methods
  async sendMessage(recipient: string, content: string): Promise<Message> {
    const response = await this.axiosInstance.post('/api/messages', {
      recipient,
      content,
    });
    return response.data;
  }

  async getMessages(recipient: string, cursor?: string): Promise<MessageResponse> {
    const response = await this.axiosInstance.get('/api/messages', {
      params: {
        recipient,
        cursor,
      },
    });
    return response.data;
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get('/api/user');
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  // Mode-specific methods
  isWebAuthnMode(): boolean {
    return this.config.authMode === 'webauthn';
  }

  isBearerMode(): boolean {
    return this.config.authMode === 'bearer';
  }
}

export default ConsolaClient;
