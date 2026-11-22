/**
 * Rehype plugin: wraps long standalone code blocks (more than MAX lines) in a collapsible
 * "Show the example" bar, so long payloads don't break up the reading. Short snippets stay open.
 * Code inside a CodeSwitch (which folds itself) or inside an existing collapsible is left alone.
 */
const MAX = 15;
const SKIP = new Set(['CodeSwitch', 'PictureIt', 'Exercise']);
const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));

export default function foldLongCode() {
  const walk = (node, skip) => {
    if (!node.children) return;
    node.children = node.children.map((c) => {
      const inSkip = skip || (c.type === 'mdxJsxFlowElement' && SKIP.has(c.name)) || (c.type === 'element' && c.tagName === 'details');
      if (!inSkip && c.type === 'element' && c.tagName === 'pre') {
        const lines = text(c).replace(/\n$/, '').split('\n').length;
        if (lines > MAX) {
          const lang = c.properties?.dataLanguage || c.properties?.['data-language'] || '';
          const what = lang === 'json' ? 'JSON' : lang === 'text' || lang === 'plaintext' ? 'example' : 'example';
          return {
            type: 'element', tagName: 'details', properties: { className: ['raw-fold'] },
            children: [
              { type: 'element', tagName: 'summary', properties: { className: ['raw-fold__summary'] }, children: [{ type: 'text', value: `Show the ${what} (${lines} lines)` }] },
              c,
            ],
          };
        }
      }
      walk(c, inSkip);
      return c;
    });
  };
  return (tree) => walk(tree, false);
}
