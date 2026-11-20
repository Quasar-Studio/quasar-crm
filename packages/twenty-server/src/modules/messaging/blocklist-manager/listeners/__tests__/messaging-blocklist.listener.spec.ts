import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { getQueueToken } from 'src/engine/core-modules/message-queue/utils/get-queue-token.util';
import { BlocklistItemDeleteMessagesJob } from 'src/modules/messaging/blocklist-manager/jobs/messaging-blocklist-item-delete-messages.job';
import { BlocklistReimportMessagesJob } from 'src/modules/messaging/blocklist-manager/jobs/messaging-blocklist-reimport-messages.job';
import { MessagingBlocklistListener } from 'src/modules/messaging/blocklist-manager/listeners/messaging-blocklist.listener';

describe('MessagingBlocklistListener', () => {
  it.each([
    ['blocklist.created', [BlocklistItemDeleteMessagesJob.name]],
    ['blocklist.deleted', [BlocklistReimportMessagesJob.name]],
    [
      'blocklist.updated',
      [BlocklistItemDeleteMessagesJob.name, BlocklistReimportMessagesJob.name],
    ],
  ])('routes %s to the correct jobs', async (event, jobs) => {
    const add = jest.fn().mockResolvedValue(undefined);
    const module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        MessagingBlocklistListener,
        {
          provide: getQueueToken(MessageQueue.messagingQueue),
          useValue: { add },
        },
      ],
    }).compile();

    await module.init();
    const payload = { workspaceId: 'workspace', events: [] };

    await module.get(EventEmitter2).emitAsync(event, payload);

    expect(add.mock.calls.map(([name]) => name)).toEqual(jobs);
    expect(add).toHaveBeenCalledWith(jobs[0], payload);
    await module.close();
  });
});
