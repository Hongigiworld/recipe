
(function(){
  const _oldResolveMenu = typeof resolveMenu === 'function' ? resolveMenu : null;
  window.resolveMenu = resolveMenu = function(name){
    if(!name) return null;
    const raw=String(name).trim();
    const q=raw.replace(/\s/g,'');
    if(isRejectedMenuNameV3(raw)) return null;
    if(MENU_DB[raw]) return raw;
    const exact=Object.keys(MENU_DB).find(k=>k.replace(/\s/g,'')===q);
    if(exact) return exact;
    for(const g of Object.values(MENU_GROUP_DB_V3||{})){
      if(g.name.replace(/\s/g,'')===q) return g.variations.find(v=>MENU_DB[v])||null;
      const v=(g.variations||[]).find(x=>x.replace(/\s/g,'')===q);
      if(v&&MENU_DB[v]) return v;
    }
    const partial=Object.keys(MENU_DB).find(k=>{
      const kk=k.replace(/\s/g,'');
      return kk.includes(q)||q.includes(kk);
    });
    if(partial && !isRejectedMenuNameV3(partial)) return partial;
    return _oldResolveMenu ? _oldResolveMenu(name) : null;
  };

  window.findSimilarMenus = findSimilarMenus = function(selected,exclude=[]){
    const ex=new Set((exclude||[]).map(flowMenuDBName));
    const seed=(selected||[]).map(flowMenuDBName).filter(n=>MENU_DB[n]);
    const groups=new Set(seed.map(n=>{
      for(const [gid,g] of Object.entries(MENU_GROUP_DB_V3||{})){
        if((g.variations||[]).includes(n)) return gid;
      }
      return null;
    }).filter(Boolean));
    const wantedStyles=[...new Set(seed.flatMap(n=>MENU_DB[n].styles||[MENU_DB[n].style]))];
    const wantedIds=[...new Set(seed.flatMap(n=>MENU_DB[n].ingredientIds||[]))];
    return Object.keys(MENU_DB)
      .filter(n=>!ex.has(n)&&!isRejectedMenuNameV3(n))
      .map(n=>{
        const m=MENU_DB[n];
        let gid=null;
        for(const [id,g] of Object.entries(MENU_GROUP_DB_V3||{})){ if((g.variations||[]).includes(n)){ gid=id; break; } }
        const groupScore=gid&&groups.has(gid)?7:0;
        const styleScore=(m.styles||[m.style]).some(s=>wantedStyles.includes(s))?5:0;
        const ingScore=(m.ingredientIds||[]).filter(id=>wantedIds.includes(id)).length;
        return {n,score:groupScore+styleScore+ingScore};
      })
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score)
      .map(x=>x.n)
      .slice(0,80);
  };

  window.DB_V3_AUDIT = {
    ingredients:Object.keys(INGREDIENT_DB_V2||{}).length,
    menus:Object.keys(MENU_DB||{}).length,
    groups:Object.keys(MENU_GROUP_DB_V3||{}).length,
    variations:Object.values(MENU_GROUP_DB_V3||{}).reduce((s,g)=>s+(g.variations||[]).length,0),
    rejected:MENU_REJECT_EXACT_V3
  };
})();
/* ===== /inline-script-11 ===== */


