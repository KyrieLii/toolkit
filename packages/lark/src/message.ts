import { systemMessages } from './constant';
import { logger } from './logger';
import type { Content, ThreadItem } from './types';
import { lark } from './utils';

/**
 * Get messages in thread
 * @param threadId
 * @returns
 */
export const getThreadMessages = async (threadId: string) => {
  const messages = [];
  for await (const item of await lark.im.message.listWithIterator({
    params: {
      container_id_type: 'thread',
      container_id: threadId,
    },
  })) {
    const { items } = item ?? {};
    if (items?.length) {
      messages.push(...items);
    }
  }

  return messages;
};

interface Message {
  senderId: string;
  senderType: string;
  content: string;
}
export const formatMessage = (item: ThreadItem): Message | undefined => {
  const { body, sender } = item;
  const { id: senderId = '', sender_type: senderType = 'user' } = sender ?? {};
  const { content } = body ?? {};

  // skip app message
  if (senderType === 'app') {
    return;
  }

  if (typeof content !== 'string') {
    logger.error('Content is not string, ', content);
    return;
  }

  let parsedContent: Content;

  try {
    // skip system messages which cannot be parsed
    if (systemMessages.includes(content)) {
      return;
    }
    parsedContent = JSON.parse(content);
  } catch (err) {
    logger.error('Parse content error', content);
    // Don't throw error here, because there are still many unknown system messages, needed skip.
    // throw new Error(`Parse content error ${err}`);
    return;
  }

  // text message
  if ('text' in parsedContent) {
    return {
      senderId,
      senderType,
      content: parsedContent.text,
    };
  }

  // rich text
  if ('title' in parsedContent) {
    const { title, content: contentList } = parsedContent;
    if (contentList && Array.isArray(contentList)) {
      // group into one line
      const lineRes = [];

      for (const line of contentList) {
        for (const block of line) {
          switch (block.tag) {
            case 'text':
              lineRes.push(block.text);
              break;
            case 'at':
              lineRes.push(`@${block.user_name}`);
              break;
            case 'emotion':
              lineRes.push(`:[${block.emoji_type}]`);
              break;
            case 'img':
              lineRes.push(`[(${block.image_key})]`);
              break;
            default:
              break;
          }
        }
      }
      return {
        senderId,
        senderType,
        content: lineRes.filter(Boolean).join(' '),
      };
    }
  }
};
