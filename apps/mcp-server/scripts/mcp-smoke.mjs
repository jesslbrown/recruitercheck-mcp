import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js'],
  cwd: process.cwd(),
});

const client = new Client({ name: 'smoke-client', version: '0.1.0' });

await client.connect(transport);

const tools = await client.listTools();
console.log('TOOLS', tools.tools.map((t) => t.name));

const bad = await client.callTool({
  name: 'check_recruiter_email',
  arguments: { apiKey: 'badbadbadbadbadbad', recruiterEmail: 'bad-email' },
});
console.log('BAD', bad.content?.[0]?.text ?? JSON.stringify(bad));

const good = await client.callTool({
  name: 'check_recruiter_email',
  arguments: { apiKey: 'badbadbadbadbadbad', recruiterEmail: 'person@example.com', observedSignals: [{ signalId: 'email.generic_free_email' }] },
});
console.log('GOOD', good.content?.[0]?.text ?? JSON.stringify(good));

await client.close();
