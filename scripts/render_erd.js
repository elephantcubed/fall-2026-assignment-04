import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const input = process.argv[2] ?? 'docs/architecture/schema.mmd';
const output = 'docs/architecture/erd.svg';

if (!fs.existsSync(input)) {
    console.log(`SYNTAX_ERROR: input not found; ${input}`);
    process.exit(1);
}

const result = spawnSync('npx', ['mmdc', '-i', input, '-o', output], {
    encoding: 'utf8', shell: process.platform === 'win32'
});

if (result.status !== 0) {
    console.log('SYNTAX_ERROR: ', (result.stderr || result.stdout || result.error?.message || 'Unidentified Error').trim());
    process.exit(1);
}

process.stdout.write('SUCCESS\n');
process.exit(0);
