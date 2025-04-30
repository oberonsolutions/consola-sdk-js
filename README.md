# Consola SDK for JavaScript

A TypeScript/JavaScript SDK for interacting with the Consola-AI platform. Supports both browser-based WebAuthn authentication and headless bearer token authentication.

## Installation

```bash
npm install consola-sdk-js
# or
yarn add consola-sdk-js
```

## Quick Start

### Browser Usage (WebAuthn)

```typescript
import ConsolaClient from 'consola-sdk-js';

// Initialize the client
const client = new ConsolaClient({
  baseUrl: 'http://localhost:3030',
  authMode: 'webauthn',
  rpId: 'localhost',
  rpName: 'Consola.Ai'
});

// Register a new user
try {
  const registrationResponse = await client.register('username');
  console.log('User registered:', registrationResponse.user);
} catch (error) {
  console.error('Registration failed:', error);
}

// Login
try {
  const authResponse = await client.login('username');
  console.log('User authenticated:', authResponse.user);
} catch (error) {
  console.error('Authentication failed:', error);
}

// Send a message
try {
  const message = await client.sendMessage('recipient', 'Hello!');
  console.log('Message sent:', message);
} catch (error) {
  console.error('Failed to send message:', error);
}

// Get messages
try {
  const { messages, hasMore } = await client.getMessages('recipient');
  console.log('Messages:', messages);
  if (hasMore) {
    console.log('More messages available');
  }
} catch (error) {
  console.error('Failed to get messages:', error);
}
```

### Headless Agent Usage (Bearer Token)

```typescript
import ConsolaClient from 'consola-sdk-js';

// Initialize the client with an existing token
const client = new ConsolaClient({
  baseUrl: 'http://localhost:3030',
  authMode: 'bearer',
  token: 'existing-token' // Optional
});

// Or get a new token through login
try {
  const { token, user } = await client.login('username');
  console.log('Authenticated user:', user);
  // Token is automatically set, but you can also set it manually:
  client.setAuthToken(token);
} catch (error) {
  console.error('Authentication failed:', error);
}

// Send a message
try {
  const message = await client.sendMessage('recipient', 'Hello from agent!');
  console.log('Message sent:', message);
} catch (error) {
  console.error('Failed to send message:', error);
}

// Get messages with pagination
try {
  const { messages, hasMore, nextCursor } = await client.getMessages('recipient');
  console.log('Messages:', messages);
  
  if (hasMore && nextCursor) {
    // Get next page
    const nextPage = await client.getMessages('recipient', nextCursor);
    console.log('Next page:', nextPage.messages);
  }
} catch (error) {
  console.error('Failed to get messages:', error);
}
```

## API Reference

### ConsolaClient

#### Constructor

```typescript
new ConsolaClient(config: ConsolaClientConfig)
```

Configuration options:
- `baseUrl`: string - The base URL of the Consola API
- `authMode`: 'webauthn' | 'bearer' - Authentication mode
- `rpId`: string (optional) - Relying Party ID for WebAuthn
- `rpName`: string (optional) - Relying Party Name for WebAuthn
- `token`: string (optional) - Initial bearer token

#### Methods

##### Authentication

- `register(username: string): Promise<AuthenticationResponse>`
  - Registers a new user (WebAuthn mode only)
  - Returns user and credential information

- `login(username: string): Promise<AuthenticationResponse | BearerAuthResponse>`
  - Authenticates a user
  - Returns user information and credentials/token based on auth mode

##### Messaging

- `sendMessage(recipient: string, content: string): Promise<Message>`
  - Sends a message to a recipient
  - Returns the sent message

- `getMessages(recipient: string, cursor?: string): Promise<MessageResponse>`
  - Retrieves messages for a recipient
  - Supports pagination with cursor
  - Returns messages and pagination info

##### User Management

- `getCurrentUser(): Promise<User>`
  - Gets the currently authenticated user

##### Token Management

- `setAuthToken(token: string): void`
  - Sets the bearer token (Bearer mode only)

- `clearAuthToken(): void`
  - Clears the current bearer token

##### Mode Utilities

- `isWebAuthnMode(): boolean`
  - Returns true if client is in WebAuthn mode

- `isBearerMode(): boolean`
  - Returns true if client is in Bearer mode

## Error Handling

The SDK throws errors for various scenarios:

```typescript
try {
  await client.login('username');
} catch (error) {
  if (error instanceof Error) {
    console.error('Authentication failed:', error.message);
  }
}
```

Common error scenarios:
- Invalid configuration
- Network errors
- Authentication failures
- Invalid operations for current auth mode
- API errors

## TypeScript Support

The SDK is written in TypeScript and includes type definitions. All methods and responses are fully typed:

```typescript
const client = new ConsolaClient({
  baseUrl: 'http://localhost:3030',
  authMode: 'webauthn'
});

// TypeScript will infer the correct return type
const response = await client.login('username');
// response is typed as AuthenticationResponse | BearerAuthResponse
```

## Browser Support

The SDK supports modern browsers with WebAuthn support. For WebAuthn mode, ensure your browser supports the Web Authentication API.

## Node.js Support

The SDK can be used in Node.js environments with bearer token authentication. WebAuthn features are not available in Node.js.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
