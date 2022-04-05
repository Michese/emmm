import { creatorHash } from '@/helper/creatorHash';

async function creatorHashJSON(object: Record<string, unknown>): Promise<string> {
  const newObject = { ...object, nonce: 'nonce' },
    newObjectJSON = JSON.stringify(newObject),
    nonce = await creatorHash(newObjectJSON);

  newObject.nonce = nonce;
  return JSON.stringify(newObject);
}

export { creatorHashJSON };
