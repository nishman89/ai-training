/** Stable anchor ids for code examples and gotchas, shared by the components and the Summaries page. */
export const anchor = (prefix: 'code' | 'gotcha', title: string): string =>
  `${prefix}-${title.toLowerCase().replace(/`/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
