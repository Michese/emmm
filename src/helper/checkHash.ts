import { creatorHash } from '@/helper/creatorHash';

async function checkHash(str: string, hash: string): Promise<boolean> {
  const hewHash = await creatorHash(str);
  return hewHash === hash;
}

export { checkHash };
