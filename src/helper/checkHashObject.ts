import { checkHash } from '@/helper/checkHash';

async function checkHashObject(object: Record<string, unknown>): Promise<boolean> {
  if (!('nonce' in object)) return false;

  const nonce = object.nonce as string;
  object.nonce = 'nonce';
  const objectJSON = JSON.stringify(object);

  return await checkHash(objectJSON, nonce);
}

export { checkHashObject };
