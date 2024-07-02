import { describe, it } from 'vitest';

import { formatMessage, getThreadMessages } from './message';

describe('message', () => {
  it('getThreadMessages', async () => {
    const messages = await getThreadMessages('omt_155b57a524ed9758');
    console.log(messages);
  });

  it.only('get and format', async () => {
    const messages = await getThreadMessages('omt_155b57a524ed9758');
    const formatted = messages.map(formatMessage);
    console.log(formatted);
  });
});
