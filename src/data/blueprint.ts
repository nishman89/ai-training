/**
 * The official CCDV-F exam blueprint (exam guide v1.0, effective July 2026; applies to exams up to 6 December 2026),
 * skill by skill, mapped to the sections of these notes and to Anthropic Academy (Skilljar) course chapters.
 *
 * Skill names and weights are quoted from the guide; descriptions are paraphrased. The guide itself names no courses
 * and gives no per-domain references, so the Academy mapping is this site's own judgement.
 * Academy course and lesson names are copied from the public course pages (checked November 2026).
 */
export const GUIDE_V1_URL =
  'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542875/Claude+Certified+Developer+%E2%80%93+Foundations+Exam+Guide.pdf';
export const GUIDE_V11_URL =
  'https://cc.sj-cdn.net/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1794946771/Claude_Certified_Developer_-_Foundations_Exam_Guide_Updated_Dec_7.pdf';

export interface AcademyRef { course: string; url: string; section: string; lessons?: string[]; }
/** good = covered in depth here · partial = the main ideas are here, some listed items are not · light = little or nothing yet */
export type Coverage = 'good' | 'partial' | 'light';
export interface Skill {
  name: string; weight: number; covers: string;
  sections: string[];          // section numbers in these notes, e.g. "2.1"
  coverage: Coverage; gap?: string;
  academy: AcademyRef[];
}

const API = { course: 'Building with the Claude API', url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api' };
const CC = { course: 'Claude Code in Action', url: 'https://anthropic.skilljar.com/claude-code-in-action' };
const MCP = { course: 'Introduction to Model Context Protocol', url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol' };

export const BLUEPRINT: Record<number, Skill[]> = {
  1: [
    { name: 'Agent Architecture', weight: 4.5, covers: 'When to use a workflow instead of an agent; manager/supervisor hierarchies; the role of subagents.',
      sections: ['1.1', '1.2', '1.5'], coverage: 'good',
      academy: [{ ...API, section: 'Agents and workflows', lessons: ['Workflows vs agents', 'Parallelization workflows', 'Chaining workflows', 'Routing workflows'] }] },
    { name: 'Agent Construction with Claude', weight: 5.3, covers: 'Building agents with the Claude Agent SDK or a custom loop/harness; self-hosted vs Anthropic-hosted; hooks.',
      sections: ['1.3', '1.4'], coverage: 'good',
      academy: [{ ...API, section: 'Agents and workflows', lessons: ['Agents and tools', 'Environment inspection'] }, { ...CC, section: 'Configure Claude', lessons: ['Hooks'] }] },
    { name: 'Agent Patterns and Frameworks', weight: 4.9, covers: 'Tool-use loops, subagents, memory, context-window management; frameworks such as Strands, LangGraph and PydanticAI.',
      sections: ['1.3', '1.4', '1.5', '6.5'], coverage: 'good',
      academy: [{ ...API, section: 'Tool use with Claude', lessons: ['Multi-turn conversations with tools', 'Implementing multiple turns'] }] },
  ],
  2: [
    { name: 'Understanding Requirements', weight: 3.4, covers: 'Turning business needs and architecture into functional and infrastructure requirements.',
      sections: ['2.5', '2.4', '4.1'], coverage: 'good', academy: [] },
    { name: 'Systems Life Cycle', weight: 2.8, covers: 'Developing, implementing, operating and maintaining systems.',
      sections: ['2.5'], coverage: 'good', academy: [] },
    { name: 'Claude API Mechanics', weight: 6.8, covers: 'Messages, tools, streaming, vision, extended thinking, caching, third-party (cloud) access, data-access patterns, batch vs real-time.',
      sections: ['2.1', '2.2', '2.3', '5.3', '5.4', '6.4', '6.6', '8.1'], coverage: 'good',
      academy: [{ ...API, section: 'Accessing Claude with the API', lessons: ['Making a request', 'Multi-Turn conversations', 'System prompts', 'Response streaming', 'Structured data'] },
                { ...API, section: 'Features of Claude', lessons: ['Extended thinking', 'Image support', 'PDF support', 'Prompt caching'] }] },
    { name: 'Software Engineering Foundations', weight: 7.4, covers: 'REST, JSON, async programming, version control, SDLC integration, code review, refactoring.',
      sections: ['2.1', '2.4', '3.4', '2.5'], coverage: 'good',
      academy: [{ ...API, section: 'Accessing Claude with the API', lessons: ['Accessing the API', 'Making a request'] }, { ...API, section: 'Anthropic apps - Claude Code and computer use', lessons: ['Automated debugging'] }] },
    { name: 'Claude Application Design', weight: 8.6, covers: 'How Claude interprets instructions across interfaces (API, SDKs, Claude Code, apps); content boundaries; schema design; session hygiene; plugin management.',
      sections: ['6.2', '6.3', '7.4', '3.4'], coverage: 'good',
      academy: [{ ...API, section: 'Accessing Claude with the API', lessons: ['System prompts', 'Controlling model output', 'Structured data'] }] },
    { name: 'Configuration Management', weight: 4.1, covers: 'CLAUDE.md, settings.json, model version pinning, prompt versioning, plugin dependencies.',
      sections: ['2.5', '3.2', '3.3', '3.4'], coverage: 'good',
      academy: [{ ...CC, section: 'Configure Claude', lessons: ['A CLAUDE.md That Follows', 'Permission Modes'] }, { ...CC, section: 'Verify and Share', lessons: ['Plugins'] }] },
  ],
  3: [
    { name: 'Claude Code Operation', weight: 3.1, covers: 'Core components (Rules, Skills, Commands, Agents, Agent Memory); sessions; slash commands; headless, streaming and auto modes; the CLAUDE.md hierarchy; repo setup; settings.json.',
      sections: ['3.1', '3.2', '3.3', '3.4'], coverage: 'good',
      academy: [{ ...CC, section: 'Steer the Work', lessons: ['Steering Long Sessions'] }, { ...CC, section: 'Configure Claude', lessons: ['A CLAUDE.md That Follows', 'Verification Skills', 'Permission Modes', 'Hooks'] },
                { ...CC, section: 'Automate Repeat Work', lessons: ['Routines and Headless', 'GitHub Actions and Code Review'] }, { ...CC, section: 'Verify and Share', lessons: ['Plugins'] }] },
  ],
  4: [
    { name: 'Debugging and Error Handling', weight: 2.6, covers: 'Identifying error types, choosing recovery strategies, trace analysis, isolating whether a problem is in the integration layer or the model output.',
      sections: ['2.4', '4.4', '4.1'], coverage: 'good',
      academy: [{ ...API, section: 'Prompt evaluation', lessons: ['A typical eval workflow', 'Model based grading', 'Code based grading'] }, { ...API, section: 'Anthropic apps - Claude Code and computer use', lessons: ['Automated debugging'] }] },
  ],
  5: [
    { name: 'LLM Fundamentals', weight: 5.2, covers: 'Tokens, context windows, sampling, non-determinism; model options (fast mode, extended and adaptive thinking, effort levels); zero-, one- and multi-shot prompting.',
      sections: ['5.1', '2.2', '5.2', '5.5', '6.2'], coverage: 'good',
      academy: [{ ...API, section: 'Introduction', lessons: ['Overview of Claude models'] }, { ...API, section: 'Accessing Claude with the API', lessons: ['Temperature'] }, { ...API, section: 'Features of Claude', lessons: ['Extended thinking'] }] },
    { name: 'Technical Fundamentals', weight: 6.1, covers: 'Integrating SDKs that wrap REST APIs, and websockets.',
      sections: ['2.1', '2.3', '2.4', '8.4'], coverage: 'good',
      academy: [{ ...API, section: 'Accessing Claude with the API', lessons: ['Accessing the API', 'Getting an API key', 'Making a request', 'Response streaming'] }] },
    { name: 'Model Selection and Tradeoffs', weight: 2.7, covers: 'Opus, Sonnet and Haiku use cases; quality/latency/cost trade-offs; breaking changes across releases.',
      sections: ['5.1', '2.5'], coverage: 'good',
      academy: [{ ...API, section: 'Introduction', lessons: ['Overview of Claude models'] }] },
    { name: 'Cost and Token Management', weight: 2.8, covers: 'Token budgeting, usage tracking, cost modelling, prompt caching and cache checkpointing.',
      sections: ['2.2', '5.3', '5.4', '5.5'], coverage: 'good',
      academy: [{ ...API, section: 'Features of Claude', lessons: ['Prompt caching', 'Rules of prompt caching', 'Prompt caching in action'] }] },
  ],
  6: [
    { name: 'Context Engineering', weight: 3.8, covers: 'Context-window management, preventing drift and bloat, tool-output pruning, compaction, isolation via subagents.',
      sections: ['6.5', '1.5'], coverage: 'good',
      academy: [{ ...CC, section: 'Steer the Work', lessons: ['Steering Long Sessions'] }] },
    { name: 'Prompt Engineering', weight: 4.6, covers: 'Instruction clarity, few-shot examples, system vs user placement, output constraints, iteration, input sanitisation.',
      sections: ['6.1', '6.2'], coverage: 'good',
      academy: [{ ...API, section: 'Prompt engineering techniques', lessons: ['Being clear and direct', 'Being specific', 'Structure with XML tags', 'Providing examples'] }] },
    { name: 'Output Handling', weight: 2.6, covers: 'Structured output, response validation, defensive parsing, scepticism toward confident output.',
      sections: ['6.3'], coverage: 'good',
      academy: [{ ...API, section: 'Accessing Claude with the API', lessons: ['Structured data'] }, { ...API, section: 'Tool use with Claude', lessons: ['Tools for structured data'] }] },
  ],
  7: [
    { name: 'AI Application Security', weight: 3.2, covers: 'Privacy, prompt injection, jailbreak defence, untrusted input, data leakage, PII handling.',
      sections: ['7.1', '7.2', '7.4'], coverage: 'good', academy: [] },
    { name: 'Guardrails and Safe Deployment', weight: 2.3, covers: 'Content policy, guardrail layering, least privilege, secure-by-design.',
      sections: ['7.2', '7.4'], coverage: 'good', academy: [] },
    { name: 'Claude Hooks', weight: 1.0, covers: 'Using hooks to prevent destructive actions.',
      sections: ['3.3', '7.2'], coverage: 'good', academy: [{ ...CC, section: 'Configure Claude', lessons: ['Hooks'] }] },
    { name: 'Identity, Secrets, and Key Management', weight: 1.6, covers: 'Managing secrets and API keys, identity validation, access approval, access monitoring.',
      sections: ['7.3', '8.5'], coverage: 'good', academy: [] },
  ],
  8: [
    { name: 'Tool Implementation', weight: 4.4, covers: 'Function calling, tool descriptions, error handling, client vs server tools, approval patterns, tool-set design.',
      sections: ['8.1', '8.2', '8.3'], coverage: 'good',
      academy: [{ ...API, section: 'Tool use with Claude', lessons: ['Tool functions', 'Tool schemas', 'Handling message blocks', 'Sending tool results', 'Using multiple tools', 'The web search tool'] }] },
    { name: 'MCP Server Development', weight: 2.1, covers: 'Authoring, deploying and integrating MCP servers: resources, tools, prompts; stdio or socket communication.',
      sections: ['8.4', '8.5'], coverage: 'good',
      academy: [{ ...API, section: 'Model Context Protocol', lessons: ['Introducing MCP', 'Defining tools with MCP', 'Defining resources', 'Defining prompts'] }, { ...MCP, section: 'Whole course' }] },
    { name: 'Agentic Customization', weight: 4.1, covers: 'Choosing among built-in tools, custom tools, Skills and MCP servers.',
      sections: ['8.3', '3.4'], coverage: 'good',
      academy: [{ ...API, section: 'Tool use with Claude', lessons: ['The text edit tool', 'The web search tool'] }, { ...API, section: 'Model Context Protocol', lessons: ['MCP review'] }] },
  ],
};
