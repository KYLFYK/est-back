import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

export async function createHash(data: string | Buffer): Promise<string> {
  return hash(data, SALT_ROUNDS);
}

export async function getRandomString(length: number): Promise<string> {
  let s = '';

  do {
    s += Math.random().toString(36).substr(2);
  }
  while (s.length < length);

  return s;
}
