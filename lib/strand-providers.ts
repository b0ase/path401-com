// Strand provider configuration
// Each provider defines its OAuth flow + profile extraction

export interface ProviderConfig {
  id: string;
  label: string;
  authUrl: string;
  tokenEndpoint: string;
  userEndpoint: string;
  scope: string;
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
  usePKCE: boolean;
  extractProfile: (data: Record<string, unknown>) => ProviderProfile;
}

export interface ProviderProfile {
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  metadata: Record<string, unknown>;
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  github: {
    id: 'github',
    label: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userEndpoint: 'https://api.github.com/user',
    scope: 'read:user',
    clientIdEnvVar: 'GITHUB_CLIENT_ID',
    clientSecretEnvVar: 'GITHUB_CLIENT_SECRET',
    usePKCE: false,
    extractProfile: (data) => ({
      userId: String(data.id),
      handle: data.login as string,
      displayName: (data.name as string) || (data.login as string),
      avatarUrl: (data.avatar_url as string) || null,
      metadata: {
        bio: data.bio,
        followers: data.followers,
        following: data.following,
        public_repos: data.public_repos,
        created_at: data.created_at,
        html_url: data.html_url,
      },
    }),
  },

  twitter: {
    id: 'twitter',
    label: 'Twitter',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
    userEndpoint: 'https://api.twitter.com/2/users/me?user.fields=profile_image_url,description,public_metrics',
    scope: 'users.read tweet.read',
    clientIdEnvVar: 'TWITTER_CLIENT_ID',
    clientSecretEnvVar: 'TWITTER_CLIENT_SECRET',
    usePKCE: true,
    extractProfile: (data) => {
      const user = (data.data as Record<string, unknown>) || data;
      const metrics = (user.public_metrics as Record<string, number>) || {};
      return {
        userId: user.id as string,
        handle: user.username as string,
        displayName: (user.name as string) || (user.username as string),
        avatarUrl: (user.profile_image_url as string) || null,
        metadata: {
          description: user.description,
          followers_count: metrics.followers_count,
          following_count: metrics.following_count,
          tweet_count: metrics.tweet_count,
        },
      };
    },
  },

  google: {
    id: 'google',
    label: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientIdEnvVar: 'GOOGLE_CLIENT_ID',
    clientSecretEnvVar: 'GOOGLE_CLIENT_SECRET',
    usePKCE: false,
    extractProfile: (data) => ({
      userId: data.id as string,
      handle: (data.email as string) || (data.id as string),
      displayName: (data.name as string) || (data.email as string),
      avatarUrl: (data.picture as string) || null,
      metadata: {
        email: data.email,
        verified_email: data.verified_email,
        locale: data.locale,
      },
    }),
  },
};

export function getProvider(providerId: string): ProviderConfig | null {
  return PROVIDERS[providerId] || null;
}

export function getProviderCredentials(provider: ProviderConfig): {
  clientId: string | null;
  clientSecret: string | null;
} {
  return {
    clientId: process.env[provider.clientIdEnvVar]?.trim() || null,
    clientSecret: process.env[provider.clientSecretEnvVar]?.trim() || null,
  };
}

export function isProviderConfigured(providerId: string): boolean {
  const provider = getProvider(providerId);
  if (!provider) return false;
  const creds = getProviderCredentials(provider);
  return !!creds.clientId && !!creds.clientSecret;
}

export function getConfiguredProviders(): string[] {
  return Object.keys(PROVIDERS).filter(isProviderConfigured);
}
