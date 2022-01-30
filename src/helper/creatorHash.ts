import toBase64 from '@/helper/toBase64';

async function creatorHash(str: string): Promise<string> {
  const file = new File([str], 'nonce', { type: 'text/plain' });
  return (await toBase64(file)) as string;
}

export { creatorHash };
