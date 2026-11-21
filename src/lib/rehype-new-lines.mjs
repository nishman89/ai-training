/**
 * Rehype plugin: highlights code lines that end with a "← new" comment (running examples),
 * so readers can see exactly what a step added. Runs after syntax highlighting.
 */
const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const classes = (n) => [].concat(n.properties?.className || [], String(n.properties?.class || '').split(' '));
const isLine = (n) => n.type === 'element' && n.tagName === 'span' && classes(n).includes('line');

export default function newLines() {
  const walk = (node) => {
    if (!node.children) return;
    for (const c of node.children) {
      if (isLine(c) && text(c).includes('← new')) {
        if (c.properties.class) c.properties.class += ' line--new';
        else c.properties.className = [].concat(c.properties.className || [], 'line--new');
      } else walk(c);
    }
  };
  return (tree) => walk(tree);
}
