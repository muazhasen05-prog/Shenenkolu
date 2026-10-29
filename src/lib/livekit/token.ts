import { AccessToken } from 'livekit-server-sdk';

export interface GenerateTokenParams {
  roomId: string;
  identity: string;
  displayName: string;
  isHost?: boolean;
}

export interface TokenResult {
  token: string | null;
  serverUrl: string | null;
  error?: string;
  isConfigured: boolean;
}

/**
 * Server-only utility to generate secure LiveKit access tokens
 */
export async function createMeetingToken(params: GenerateTokenParams): Promise<TokenResult> {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return {
      token: null,
      serverUrl: null,
      isConfigured: false,
      error:
        'LiveKit server credentials (LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET) are not configured on the server.',
    };
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: params.identity,
      name: params.displayName,
      ttl: '3h', // 3 hours session
    });

    at.addGrant({
      room: params.roomId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: !!params.isHost,
    });

    const jwtToken = await at.toJwt();

    return {
      token: jwtToken,
      serverUrl,
      isConfigured: true,
    };
  } catch (err: any) {
    console.error('Failed to sign LiveKit token:', err);
    return {
      token: null,
      serverUrl: null,
      isConfigured: true,
      error: `Failed to sign meeting token: ${err.message || 'Token generation failure'}`,
    };
  }
}
