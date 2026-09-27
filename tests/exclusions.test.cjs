const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {parseHTML}=require('linkedom');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8').replace(/\r\n/g,'\n');
const {document}=parseHTML(html);
const storage=new Map();
const context={document,localStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)},window:{addEventListener(){}}};
vm.createContext(context);
let code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const expose=`globalThis.test={clipboardFarmStates,parseFarmList,parseInput,bindRichPaste,computeAll,minInterval,render,bind,blank,load};
globalThis.setTargets=function(v){targets=v.map(blank);cfg={};for(var k in DEF)cfg[k]=DEF[k];};`;
vm.runInContext(code.replace('load();\nsnapsLoad();\nbind();\nrender();',expose),context);
const api=context.test;
function row(name, attrs='', nameAttrs='',extra='') {return '<tr '+attrs+'><td><input type="checkbox"></td><td '+nameAttrs+'>'+name+'</td><td>27</td><td>3.2</td><td>1</td>'+extra+'</tr>';}
const table=x=>'<table>'+x+'</table>';
assert.equal(api.clipboardFarmStates(table(row('Active')+row('Inactive','class="disabled"'))).filter(s=>s.inactive).length,1);
assert.equal(api.clipboardFarmStates(table(row('Active','','','<td><button disabled>Menu</button></td>')))[0].inactive,false);
assert.equal(api.clipboardFarmStates(table(row('A','','style="color: rgb(153, 153, 153)"')+row('B','','style="color: rgb(0, 0, 0)"'))).filter(s=>s.inactive).length,1);
assert.equal(api.clipboardFarmStates(table(row('A','','style="color: rgb(153, 153, 153)"')))[0].inactive,false);
assert.equal(api.clipboardFarmStates(table(row('A','class="slotInactive"')))[0].inactive,true);
assert.equal(api.clipboardFarmStates(table(row('A','','style="opacity: 0.5"')))[0].inactive,true);
assert.equal(api.clipboardFarmStates(table(row('A','','aria-disabled="true"')))[0].inactive,true);
context.setTargets([]);
api.bindRichPaste('paste');
function paste(text,html){
 const ev=new document.defaultView.Event('paste',{cancelable:true});
 ev.clipboardData={getData:type=>type==='text/html'?html:text};document.getElementById('paste').dispatchEvent(ev);
}
paste('Active\t27\t3.2\n1\n16:20:00\n42\n100\nInactive\t27\t3.2\n1\n16:20:00\n66\n336',table(row('Active')+row('Inactive','class="disabled"')));
let res=api.parseInput('paste',true,-1);
assert.equal(res.items.length,1);assert.equal(res.excluded.length,1);assert.equal(res.releve.length,1);
assert.equal(res.excluded[0].name,'Inactive');
context.setTargets(res.items.concat(res.excluded));
let totals=api.computeAll();assert(totals[0].total>0);assert.equal(totals[1].total,null);
const feasible=api.minInterval(10);
api.render();
assert.equal(document.querySelectorAll('#tbody tr').length,1);
assert.equal(document.querySelectorAll('#excludedList li').length,1);
assert(!document.getElementById('chartbox').innerHTML.includes('Inactive'));
assert(!document.getElementById('excludedFarms').hasAttribute('hidden'));
api.load();assert.equal(api.computeAll()[1].total,null);assert.equal(api.minInterval(10),feasible);
// Text-only subsequent import must not restore an excluded target.
paste('Active\t27\t3.2\n1\nInactive\t27\t3.2\n1','');
res=api.parseInput('paste',true,-1);assert.equal(res.excluded.length,1);
// Editing a paste invalidates stale rich metadata.
context.setTargets([]);
paste('Inactive\t27\t3.2\n1',table(row('Inactive','class="disabled"')));
document.getElementById('paste').dispatchEvent(new document.defaultView.Event('input'));
assert.equal(api.parseInput('paste',true,-1).items.length,1);
// All excluded: zero troops/departures and no rows accidentally charged.
context.setTargets([{name:'Excluded',dist:3.2,active:false,excludedBy:'source'}]);api.render();
assert.equal(document.getElementById('tTroops').textContent,'0');assert.equal(document.getElementById('tDep').textContent,'0');
assert.equal(api.minInterval(10),null);
console.log('PASS: rich paste, inactive class/color/opacity, unchecked boxes, old loot, stale metadata, persistence, totals, schedule, all-excluded.');
// Integration of the buttons, including filtered table indices and batch exclusion.
for (const el of document.querySelectorAll('select')) Object.defineProperty(el,'value',{value:'',writable:true,configurable:true});
context.setTargets([{name:'First',dist:3.2},{name:'Second',dist:4.2},{name:'Third',dist:5.2}]);
api.bind();
document.getElementById('pDistCol').value='-1';document.getElementById('pTroops').value='1';
api.render();
const click=el=>el.dispatchEvent(new document.defaultView.Event('click',{bubbles:true}));
click(document.querySelector('[data-exclude="0"]'));
assert.equal(document.querySelector('#tbody tr').dataset.i,'1');
assert.equal(api.computeAll()[0].total,null);
click(document.querySelector('[data-del="1"]'));
assert.equal(api.computeAll().length,2);assert.equal(api.computeAll()[1].t.name,'Third');
click(document.querySelector('[data-restore="0"]'));
assert(api.computeAll()[0].total>0);
document.getElementById('excludePaste').value='Third\t27\t5.2\n1';click(document.getElementById('excludeBatch'));
assert.equal(api.computeAll()[1].total,null);
paste('First\t27\t3.2\n1\nThird\t27\t5.2\n1','');click(document.getElementById('parseReplace'));
assert.equal(api.computeAll().length,2);assert.equal(api.computeAll()[1].total,null);
paste('First\t27\t3.2\n1',table(row('First','class="disabled"')));click(document.getElementById('parseAdd'));
assert.equal(document.getElementById('tTroops').textContent,'0');
assert.equal(document.querySelectorAll('#excludedList li').length,2);
console.log('PASS: exclude/restore buttons, correct row deletion, batch exclusion, replace and add preserving exclusions.');
