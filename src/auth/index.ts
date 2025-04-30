import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { ConsolaClientConfig } from '../types';

export class ConsolaAuth {
  private config: ConsolaClientConfig;

  constructor(config: ConsolaClientConfig) {
    this.config = config;
  }

  async generateRegistrationOptions(username: string) {
    return generateRegistrationOptions({
      rpName: this.config.rpName || 'Consola.Ai',
      rpID: this.config.rpId || new URL(this.config.baseUrl).hostname,
      userID: username,
      userName: username,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false,
      },
    });
  }

  async generateAuthenticationOptions(username: string) {
    return generateAuthenticationOptions({
      rpID: this.config.rpId || new URL(this.config.baseUrl).hostname,
      userVerification: 'preferred',
    });
  }

  async verifyRegistrationResponse(
    response: any,
    expectedChallenge: string,
    expectedOrigin: string
  ) {
    return verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: this.config.rpId || new URL(this.config.baseUrl).hostname,
      requireUserVerification: true,
    });
  }

  async verifyAuthenticationResponse(
    response: any,
    expectedChallenge: string,
    expectedOrigin: string,
    authenticator: any
  ) {
    return verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: this.config.rpId || new URL(this.config.baseUrl).hostname,
      authenticator,
      requireUserVerification: true,
    });
  }
}
