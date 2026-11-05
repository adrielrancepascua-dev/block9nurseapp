const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('PNLE navigation keeps its sliding indicator and accessible active state in sync',()=>{
  const source=fs.readFileSync('js/pnle-study.js','utf8');
  const start=source.indexOf('  function syncStudyNavigation(');
  assert.ok(start>=0,'navigation synchronizer exists');
  const buttons=['practice','mistakes','progress'].map(tab=>({
    getAttribute:()=>tab,
    setAttribute(key,value){this[key]=value;},
    removeAttribute(key){delete this[key];},
    classList:{toggle(_key,value){this.active=value;}}
  }));
  const style={};
  const bar={classList:{remove(){}},querySelectorAll:()=>buttons,style:{setProperty:(key,value)=>style[key]=value}};
  const ctx={studyTab:'practice',document:{getElementById:()=>bar}};
  vm.createContext(ctx);
  vm.runInContext(source.slice(start,source.indexOf('  function setStudyTab(',start)),ctx);
  for(const [index,tab]of ['practice','mistakes','progress'].entries()){
    ctx.studyTab=tab;ctx.syncStudyNavigation();
    assert.equal(style['--pnle-nav-index'],index);
    assert.equal(buttons[index]['aria-current'],'page');
    assert.equal(buttons.filter(b=>b['aria-current']==='page').length,1);
  }
});
