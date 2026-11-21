/**
 * Running examples: one scenario built up step by step across sections.
 * Each step names the CodeSwitch title that shows it, so the strip can link straight to the code.
 * In the code, lines added at this step end with a "← new" comment and are highlighted.
 */
export interface RunningStep { chapter: number; sec: string; title: string; label: string; }
export interface RunningThread { name: string; story: string; steps: RunningStep[]; }

export const RUNNING: Record<string, RunningThread> = {
  call: {
    name: 'Acme support assistant',
    story: 'A customer asks Acme a question and Claude answers. Each step adds one thing to the same call.',
    steps: [
      { chapter: 2, sec: '2.1', title: 'Acme assistant, step 1: make the call', label: 'Make the call' },
      { chapter: 2, sec: '2.3', title: 'Acme assistant, step 2: stream the reply', label: 'Stream it' },
      { chapter: 2, sec: '2.4', title: 'Acme assistant, step 3: survive busy moments', label: 'Retries and timeouts' },
      { chapter: 5, sec: '5.3', title: 'Acme assistant, step 4: cache the policy document', label: 'Cache the prompt' },
      { chapter: 6, sec: '6.3', title: 'Acme assistant, step 5: get a fixed shape back', label: 'Structured output' },
    ],
  },
  tool: {
    name: 'The order-status tool',
    story: 'Claude answers "Where is my order?" by asking your code to look it up. Each step adds one thing to the same tool.',
    steps: [
      { chapter: 8, sec: '8.1', title: 'Order tool, step 1: your method and its description', label: 'Method + description' },
      { chapter: 8, sec: '8.1', title: 'Order tool, step 2: the round trip', label: 'The round trip' },
      { chapter: 8, sec: '8.2', title: 'Order tool, step 3: when your method fails', label: 'Report failures' },
      { chapter: 8, sec: '8.2', title: "Order tool, step 4: check Claude's input", label: 'Validate input' },
      { chapter: 8, sec: '8.4', title: 'Order tool, step 5: share it as an MCP server', label: 'MCP server' },
      { chapter: 1, sec: '1.3', title: 'Order tool, step 6: put it in a loop', label: 'Agent loop' },
    ],
  },
};
