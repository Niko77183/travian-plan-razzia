const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const context = {};
vm.createContext(context);
vm.runInContext(code.replace('load();\nsnapsLoad();\nbind();\nrender();',
  'globalThis.parse = parseFarmList; globalThis.key = targetKey; globalThis.difference = ecart;'), context);
const parse = (text, troops = true, col = -1) => context.parse(text, troops, col);
const distances = [3.2,3.6,5,5.4,5.8,6.1,6.1,7.1,7.6,7.8,8.2,9.2,9.5,10,10.6,11,11.2,11.4,11.7,12.1,12.2,12.6,12.8,13.2,13.6,13.9,14.3,14.9,16.3,16.3];
const rows = distances.map((distance, i) => {
  const name = i === 5 ? 'Natars 25|-62' : i === 15 ? 'Natars 8|-63' : 'Village ' + (i + 1);
  return '\t\t' + name + '\t' + (i + 10) + '\t' + distance + '\t\n' + (i === 29 ? 2 : 1)
    + (i < 20 ? '\n16:22:04\n\u202d42\u202c\n\u202d1\u202f652\u202c' : '');
});
const text = 'Privacy settings\n6472\nHéros\nHeure du serveur: 16:28:54\n02 - Liste\n23/30 en cours de pillage\nDébut (30)\nDernier pillage\n'
  + rows.join('\n') + '\nAjouter une cible 30/100\nAucune cible n\'est sélectionnée\nOasis 14*14\n0/2 en cours de pillage\nDébut (2)\nDernier pillage\nAjouter une cible 2/100\nCapitale\n999\n\u202d(\u202d19\u202c|\u202d−\u202d63\u202c\u202c)\u202c\nQuête - Vue générale\n© 2004 - 2026 Travian Games GmbH';
const result = parse(text);
assert.equal(result.items.length, 30);
assert.equal(new Set(result.releve.map(r => r.key)).size, 30);
assert.deepEqual(Array.from(result.items, t => t.dist), distances);
assert.equal(result.items[0].name, 'Village 1');
assert.equal(result.items[0].x, null);
assert.equal(result.items[5].x, 25);
assert.equal(result.items[5].y, -62);
assert.equal(result.items[29].wave, 2);
assert.equal(result.releve[0].cumul, 1652);
assert.equal(result.releve.filter(r => r.cumul !== null).length, 20);
assert(!result.items.some(t => t.x === 19 && t.y === -63));
for (const name of ['A','123','村庄','Village 42','4kHfZz`s village','Noice/sostinė','Village . # $ [ ] /']) {
  const t = parse(name + '\t27\t3.2\n1').items[0];
  assert.equal(t.name, name);
  assert.equal(t.dist, 3.2);
  assert.equal(t.wave, 1);
  const c = parse(name + ' (17|−62)\t0\t2.2\t1').items[0];
  assert.equal(c.name, name);
  assert.equal(c.dist, 2.2);
  assert.equal(c.x, 17);
  assert(!/[.#$\[\]/]/.test(context.key(t)), 'Firebase key must not contain forbidden characters');
}
assert.equal(parse('Oasis inoccupée\n(17|−62)\n0\n2.2\n1').items.length, 1);
assert.equal(parse('(17|−62)\t0\t2.2\t1').items.length, 1);
assert.equal(parse('Village\t27\t3.2\n1\nDésactivée\nAutre\t15\t4.8\n1').items.length, 1);
assert.equal(parse('Village\t27\t3.2\t1\tInactive\nAutre\t15\t4.8\n1').items[0].name, 'Autre');
assert.equal(parse('Inactive\t27\t3.2\n1').items.length, 1, 'A village name is not a status');
assert.equal(parse('A\t27\t3.2\n1\nA\t27\t3.2\n1').items.length, 1);
assert.equal(parse('A\t27\t3.2\n1\nA\t27\t4.2\n1').items.length, 2);
assert.equal(parse('A\t27\t3.2\n1', true, 0).items[0].dist, 27);
assert.equal(context.key(result.items[0]), result.releve[0].key);
assert.equal(parse('Heure du serveur: 16:28:54\n© 2004 - 2026 Travian Games GmbH').items.length, 0);
const before = {t:1, f:{}}, after = {t:2, f:{}};
result.releve.forEach(r => { before.f[r.key] = {c:100}; after.f[r.key] = {c:142}; });
assert.equal(context.difference(before, after).total, 30 * 42);
console.log('PASS: 30 mixed villages, distances, loot, identities, inactive labels, coordinate formats and page noise.');
