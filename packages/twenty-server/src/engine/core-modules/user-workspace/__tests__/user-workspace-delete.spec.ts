import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';

describe('UserWorkspaceService.deleteUserWorkspace', () => {
  const userWorkspaceRepository = {
    delete: jest.fn(),
    softDelete: jest.fn(),
  };
  const roleTargetRepository = { delete: jest.fn() };
  const coreEntityCacheService = { invalidate: jest.fn() };
  const service = Object.assign(Object.create(UserWorkspaceService.prototype), {
    userWorkspaceRepository,
    roleTargetRepository,
    coreEntityCacheService,
  }) as UserWorkspaceService;

  it.each([false, true])(
    'invalidates the cache after deletion (softDelete: %s)',
    async (softDelete) => {
      await service.deleteUserWorkspace({
        userWorkspaceId: 'user-workspace-id',
        workspaceId: 'workspace-id',
        softDelete,
      });

      const deletion = softDelete
        ? userWorkspaceRepository.softDelete
        : userWorkspaceRepository.delete;
      expect(deletion).toHaveBeenCalledWith({ id: 'user-workspace-id' });
      expect(coreEntityCacheService.invalidate).toHaveBeenCalledWith(
        'userWorkspaceEntity',
        'user-workspace-id',
      );
      expect(deletion.mock.invocationCallOrder[0]).toBeLessThan(
        coreEntityCacheService.invalidate.mock.invocationCallOrder[0],
      );
    },
  );
});
