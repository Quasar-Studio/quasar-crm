import { ConnectedAccountProvider } from 'twenty-shared/types';
import { ConnectedAccountRefreshTokensService } from './connected-account-refresh-tokens.service';

const googleRefresh = jest.fn();
const decrypt = jest.fn(() => 'plaintext-refresh');
const encryptTokenPair = jest.fn(() => ({
  encryptedAccessToken: 'encrypted-new',
  encryptedRefreshToken: 'encrypted-refresh',
}));
const update = jest.fn();
const service = new ConnectedAccountRefreshTokensService(
  { refreshTokens: googleRefresh } as never,
  {} as never,
  {} as never,
  { decrypt, encryptTokenPair } as never,
  { update } as never,
);

describe('ConnectedAccountRefreshTokensService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('refreshes a missing access token despite a recent timestamp', async () => {
    googleRefresh.mockResolvedValue({
      accessToken: 'new',
      refreshToken: 'refresh',
    });
    const account = {
      id: 'account-id',
      provider: ConnectedAccountProvider.GOOGLE,
      accessToken: null,
      refreshToken: 'encrypted-refresh',
      lastCredentialsRefreshedAt: new Date(),
    };
    await expect(
      service.resolveTokens(account as never, 'workspace-id'),
    ).resolves.toEqual({
      accessToken: 'encrypted-new',
      refreshToken: 'encrypted-refresh',
    });
    expect(googleRefresh).toHaveBeenCalledWith('plaintext-refresh');
    expect(update).toHaveBeenCalledWith(
      { id: 'account-id', workspaceId: 'workspace-id' },
      expect.objectContaining({ accessToken: 'encrypted-new' }),
    );
  });

  it('keeps an existing fresh access token without refreshing', async () => {
    const account = {
      id: 'account-id',
      provider: ConnectedAccountProvider.GOOGLE,
      accessToken: 'existing',
      refreshToken: 'refresh',
      lastCredentialsRefreshedAt: new Date(),
    };
    await expect(
      service.resolveTokens(account as never, 'workspace-id'),
    ).resolves.toEqual({ accessToken: 'existing', refreshToken: 'refresh' });
    expect(googleRefresh).not.toHaveBeenCalled();
  });

  it.each([
    ConnectedAccountProvider.GOOGLE,
    ConnectedAccountProvider.MICROSOFT,
    ConnectedAccountProvider.APP,
  ])(
    'treats a missing access token as invalid for refreshable provider %s',
    async (provider) => {
      await expect(
        service.isAccessTokenStillValid({
          provider,
          accessToken: null,
          refreshToken: 'refresh',
          lastCredentialsRefreshedAt: new Date(),
        } as never),
      ).resolves.toBe(false);
    },
  );
});
