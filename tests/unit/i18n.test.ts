import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('Internationalization (i18n) Key Audit', () => {
  const messagesDir = path.resolve(process.cwd(), 'messages');

  it('verifies en.json, om.json, and am.json dictionaries exist', () => {
    expect(fs.existsSync(path.join(messagesDir, 'en.json'))).toBe(true);
    expect(fs.existsSync(path.join(messagesDir, 'om.json'))).toBe(true);
    expect(fs.existsSync(path.join(messagesDir, 'am.json'))).toBe(true);
  });

  it('ensures Afaan Oromoo (om.json) has 100% key parity with English (en.json)', () => {
    const en = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
    const om = JSON.parse(fs.readFileSync(path.join(messagesDir, 'om.json'), 'utf8'));

    const enKeys = getKeys(en);
    const omKeys = getKeys(om);

    const missingInOm = enKeys.filter((k) => !omKeys.includes(k));
    const extraInOm = omKeys.filter((k) => !enKeys.includes(k));

    expect(missingInOm, `Keys missing in om.json: ${missingInOm.join(', ')}`).toEqual([]);
    expect(extraInOm, `Extra keys in om.json: ${extraInOm.join(', ')}`).toEqual([]);
  });

  it('ensures Amharic (am.json) has 100% key parity with English (en.json)', () => {
    const en = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
    const am = JSON.parse(fs.readFileSync(path.join(messagesDir, 'am.json'), 'utf8'));

    const enKeys = getKeys(en);
    const amKeys = getKeys(am);

    const missingInAm = enKeys.filter((k) => !amKeys.includes(k));
    const extraInAm = amKeys.filter((k) => !enKeys.includes(k));

    expect(missingInAm, `Keys missing in am.json: ${missingInAm.join(', ')}`).toEqual([]);
    expect(extraInAm, `Extra keys in am.json: ${extraInAm.join(', ')}`).toEqual([]);
  });
});
