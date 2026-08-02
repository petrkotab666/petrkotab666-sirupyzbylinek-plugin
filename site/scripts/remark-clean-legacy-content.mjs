function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function nodeText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(nodeText).join(' ');
}

function containsUrl(node, pattern) {
  if (!node) return false;
  if (typeof node.url === 'string' && pattern.test(node.url)) return true;
  return Array.isArray(node.children) && node.children.some((child) => containsUrl(child, pattern));
}

const junkPatterns = [
  /prepsany clanek se seo strukturou/u,
  /xml produktovy feed/u,
  /produktovy xml feed/u,
  /affiliate doporuceni/u,
  /affiliate odkazy/u,
  /hlavni klicove slovo:/u,
  /typ clanku:/u,
  /cil: lepsi citelnost/u,
  /obsah: postup, chyby, bezpecnost/u,
  /rozsiruje puvodni kratky clanek/u,
  /do podrobnejsi a lepe propojene podoby/u,
  /dobre napsany clanek ma ctenari ukazat/u,
  /proto je tento text postaveny jako bezpecny pruvodce/u,
  /nerika, ze jedna bylina nebo jeden recept vyresi vsechno/u,
  /seo 90\+/u,
];

function isJunk(node, frontmatter) {
  const text = normalize(nodeText(node));
  if (!text) return false;

  if (text === 'reklama' || text === 'rychle shrnuti clanku:') return true;
  if (junkPatterns.some((pattern) => pattern.test(text))) return true;
  if (containsUrl(node, /ehub\.cz\/system\/scripts\/click\.php/i)) return true;

  const title = normalize(frontmatter.title || '');
  const category = normalize(frontmatter.category || '');
  if (category && text === category) return true;
  if (title && text === title) return true;

  if (node.type === 'list') {
    return /hlavni klicove slovo:|typ clanku:|produktovy xml feed:|cil: lepsi citelnost/u.test(text);
  }

  return false;
}

function cleanChildren(parent, frontmatter) {
  if (!Array.isArray(parent.children)) return;

  const cleaned = [];
  let skipSummaryList = false;

  for (const child of parent.children) {
    const text = normalize(nodeText(child));

    if (text === 'rychle shrnuti clanku:' || text === 'rychle shrnuti clanku') {
      skipSummaryList = true;
      continue;
    }

    if (skipSummaryList && child.type === 'list') {
      skipSummaryList = false;
      continue;
    }
    if (child.type !== 'list') skipSummaryList = false;

    if (isJunk(child, frontmatter)) continue;

    cleanChildren(child, frontmatter);
    if (Array.isArray(child.children) && child.children.length === 0) continue;
    cleaned.push(child);
  }

  parent.children = cleaned;
}

export default function remarkCleanLegacyContent() {
  return (tree, file) => {
    const frontmatter = file.data?.astro?.frontmatter
      || file.data?.frontmatter
      || file.data?.matter
      || {};
    cleanChildren(tree, frontmatter);
  };
}
