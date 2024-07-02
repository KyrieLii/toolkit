import { Client } from '@larksuiteoapi/node-sdk';

export const getLarkInstance = (
  appId = process.env.LARK_APP_ID,
  appSecret = process.env.LARK_APP_SECRET,
) => {
  if (appId === undefined || appSecret === undefined) {
    throw new Error('appId or appSecret is undefined');
  }
  return new Client({
    appId,
    appSecret,
    disableTokenCache: false,
  });
};

export const lark = getLarkInstance();
