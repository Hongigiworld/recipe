function rFridgeTab(){
  const fridge=S.fridge||[];
  const now=Date.now();
  function getDdayVal(item){
    if(!item.addedAt||!item.expireDays) return null;
    const base=new Date(item.addedAt);
    base.setDate(base.getDate()+Number(item.expireDays));
    return Math.ceil((base-new Date())/(24*60*60*1000));
  }
  function getDdayStyle(d){
    if(d<=0) return{color:"#e53935",bg:"#FFEBEE",label:"만료"};
    if(d<=2) return{color:"#e53935",bg:"#FFEBEE",label:"D-"+d};
    if(d<=5) return{color:"#FF9800",bg:"#FFF3E0",label:"D-"+d};
    return{color:"#2e7d32",bg:"#E8F5E9",label:"D-"+d};
  }
  const sorted=[...fridge].sort((a,b)=>(getDdayVal(a)??999)-(getDdayVal(b)??999));
  const expiringSoon=sorted.filter(i=>{const d=getDdayVal(i);return d!==null&&d<=3;});
  return`<div style="padding:52px 20px 12px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div class="title" style="margin:0">❄️ 냉장고</div>
      <div style="display:flex;align-items:center;gap:10px">
        <button onclick="openAddFI()" style="background:var(--primary);border:none;color:#fff;font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px;cursor:pointer">＋ 추가</button>
        <button onclick="S.fridge=[];saveFridge();render()" style="background:none;border:none;color:#ccc;font-size:12px">전체삭제</button>
      </div>
    </div>
    <div style="font-size:12px;color:#aaa;margin-top:4px">${fridge.length}개 보관중</div>
    ${expiringSoon.length?`<div style="background:#FFEBEE;border-radius:12px;padding:10px 14px;margin-top:10px;font-size:12px;color:#e53935;font-weight:700">⚠️ 곧 만료: ${expiringSoon.map(i=>i.name).join(", ")}</div>`:""}
  </div>
  <div style="padding:0 20px 100px">
    ${fridge.length===0?`<div style="text-align:center;padding:40px;color:#aaa">
      <div style="font-size:48px;margin-bottom:12px">❄️</div>
      <div style="font-weight:700">냉장고가 비었어요!</div>
      <div style="font-size:13px;margin-top:6px">장보기 완료 후 자동으로 채워지거나<br>직접 추가할 수 있어요</div>
      <button onclick="openAddFI()" style="margin-top:14px;padding:10px 24px;background:var(--primary);color:#fff;border:none;border-radius:20px;font-size:14px;font-weight:700;cursor:pointer">＋ 재료 직접 추가</button>
    </div>`:sorted.map((item,i)=>{
      const d=getDdayVal(item);
      const ds=d!==null?getDdayStyle(d):null;
      const fi=S.fridge.indexOf(item);
      return`<div style="background:var(--card);border-radius:14px;padding:13px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow);border:1.5px solid ${ds&&d<=3?ds.color+'44':'transparent'}">
        <span style="font-size:24px">${item.icon||getIcon(item.name)}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${item.name}</div>
          <div style="font-size:11px;color:#aaa">${item.amount||""} ${item.storage?"· "+item.storage:""}</div>
        </div>
        ${ds?`<span style="background:${ds.bg};color:${ds.color};border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700">${ds.label}</span>`:""}
        <button onclick="S.fridge.splice(${fi},1);saveFridge();render()" style="background:none;border:none;color:#ddd;font-size:18px">✕</button>
      </div>`;
    }).join("")}
  </div>`;
}

function rCartTab(){
  const cart=S.cart||[];
  if(!cart.length) return`<div style="padding:52px 20px;text-align:center">
    <div style="font-size:48px;margin-bottom:12px">🛒</div>
    <div style="font-weight:700;font-size:17px">아직 빈칸이에요</div>
    <div style="font-size:13px;color:#aaa;margin-top:6px">식단을 짜고 재료 분석을 하면 채워져요</div>
    <button onclick="go('home')" class="btn-p" style="margin-top:20px">홈으로</button>
  </div>`;
  const cats=["채소","단백질","양념","면·밥","기타"];
  const catIcon={채소:"🥬",단백질:"🥩",양념:"🧄","면·밥":"🍚",기타:"🛒"};
  const done=cart.filter(i=>i.checked).length;
  const fridgeCount=cart.filter(i=>i.inFridge).length;
  const needBuy=cart.length-fridgeCount;
  let html=`<div style="padding:52px 20px 12px">
    <div class="title" style="margin:0">🛒 장보기 목록</div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <div style="flex:1;background:#E8F5E9;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#2e7d32">냉장고✓</div>
        <div style="font-size:16px;font-weight:900;color:#2ECC71">${fridgeCount}</div>
      </div>
      <div style="flex:1;background:#FFF8EE;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#e65100">사야할것</div>
        <div style="font-size:16px;font-weight:900;color:var(--primary)">${needBuy}</div>
      </div>
      <div style="flex:1;background:#f8f8f8;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#888">완료</div>
        <div style="font-size:16px;font-weight:900;color:var(--primary)">${done}</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-top:10px">
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=true);render()" style="flex:1;padding:8px;background:var(--primary-pale);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--primary)">✓ 전체선택</button>
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=false);render()" style="flex:1;padding:8px;background:#f5f5f5;border:none;border-radius:10px;font-size:12px;font-weight:700;color:#888">✕ 전체해제</button>
      <button onclick="S.cart=S.cart.filter(i=>!i.checked||i.inFridge);render()" style="flex:1;padding:8px;background:#FFF0F0;border:none;border-radius:10px;font-size:12px;font-weight:700;color:#e53935">🗑 선택삭제</button>
    </div>
  </div>
  <div style="padding:0 20px 120px">`;
  for(const cat of cats){
    const items=cart.filter(i=>(i.category||"기타")===cat);
    if(!items.length) continue;
    html+=`<div style="margin-bottom:14px"><div class="sec">${catIcon[cat]} ${cat}</div>`;
    items.forEach(item=>{
      const idx=cart.indexOf(item);
      const hf=item.inFridge;
      const shopInfo=!hf?getIngredientShopUrl(item.replaceName||item.name):null;
      html+=`<div class="shop-item" style="background:${hf?'#F0FFF6':'#fff'};border:1.5px solid ${hf?'#A5D6A7':'transparent'}">
        <div class="chk ${item.checked?'done':''}" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">${item.checked?'✓':''}</div>
        <span style="font-size:20px">${item.icon||getIcon(item.name)}</span>
        <div style="flex:1" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">
          <div style="font-weight:600;font-size:14px;text-decoration:${item.checked?'line-through':'none'};color:${item.checked?'#bbb':'var(--text)'}">
            ${item.replaceName||item.name}
            ${hf?"<span style='font-size:10px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 6px;margin-left:4px;font-weight:700'>냉장고✓</span>":""}
          </div>
          <div style="font-size:11px;color:#aaa">${item.replaceQty||item.amount||""}</div>
        </div>
        ${!hf&&!item.checked&&shopInfo?`<a href="${shopInfo.url}" target="_blank" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;background:#E2173C;color:#fff;border-radius:10px;padding:6px 8px;text-decoration:none;flex-shrink:0">
          <span style="font-size:14px">🛒</span><span style="font-size:9px;font-weight:700">쿠팡</span>
        </a>`:""}
        <button onclick="openEditCart(${idx})" style="background:none;border:none;color:#aaa;font-size:13px">✏️</button>
      </div>`;
    });
    html+="</div>";
  }
  html+=`</div>
  <div class="bottom-bar">
    ${S.cartDone
      ?`<div style="text-align:center">
          <div style="font-size:13px;color:var(--green);font-weight:700;margin-bottom:8px">✅ 냉장고에 담겼어요!</div>
          <button onclick="go('home')" class="btn-p">🏠 홈으로 돌아가기</button>
        </div>`
      :`<button class="btn-g" ${done===0?"disabled":""} onclick="addToFridge()">❄️ 구매완료 - 냉장고에 넣기 (${done}개)</button>`
    }
  </div>`;
  return html;
}









/* =========================================================
   FINAL FLOW FIX v3 - B/C 식단 생성 미작동 수정
   - 마지막에 선언해서 기존 중복 함수들을 확실히 override
   - B: 스타일 -> 추천 -> 장보기 -> 냉장고 -> 식단 생성
   - C: 먹고싶은 메뉴 -> 장보기 -> 냉장고 -> 식단 생성
   ========================================================= */
function _safeTotalMeals(){
  const n = typeof totalMeals === 'function' ? totalMeals() : 0;
  return n > 0 ? n : 7;
}
function _flowResolveMenuList(type, styles, seed){
  const max = _safeTotalMeals();
  let menus = [];

  if(type === 'style'){
    menus = flowBuildMenu('style', styles && styles.length ? styles : ['한식'], []);
  }else if(type === 'wishlist'){
    const resolved = [...new Set((seed||[]).map(m => flowMenuDBName(m)).filter(n => MENU_DB[n]))];
    menus = [...resolved];
    if(menus.length < max){
      menus = [...menus, ...findSimilarMenus(menus, menus)];
    }
    if(menus.length < max){
      const extra = Object.keys(MENU_DB).filter(k => !menus.includes(k)).sort(()=>Math.random()-0.5);
      menus = [...menus, ...extra];
    }
  }else{
    menus = flowBuildMenu('fridge', styles && styles.length ? styles : ['한식'], []);
  }

  menus = [...new Set(menus.filter(n => MENU_DB[n]))];
  if(!menus.length) menus = Object.keys(MENU_DB).sort(()=>Math.random()-0.5);
  while(menus.length < max) menus = menus.concat(menus);
  return menus.slice(0, max);
}

function genBSuggest(){
  if(!S.bcStyles || !S.bcStyles.length){alert('스타일을 선택해주세요');return;}
  const max = _safeTotalMeals();
  // 스타일별 전체 풀을 셔플해서 다양성 확보
  const fullPool = flowMenuPool(S.bcStyles).sort(()=>Math.random()-0.5);
  const pool = fullPool.slice(0, Math.max(max + 8, 20));
  const typeOrder = ['아침','점심','저녁'];
  S.bcMode = 'b';
  S.bcSuggested = pool.map((name,i)=>({
    name,
    selected: false,
    type: typeOrder[i % 3],
    ingredients: (MENU_DB[name]?.ingredients||[]).slice(0,3).map(x=>x.name),
    sharedWith: []
  }));
  go('b-suggest');
}

function genBCCart(){
  try{
    const max = _safeTotalMeals();
    const isB = S.bcMode === 'b';
    const seed = isB
      ? (S.bcSuggested||[]).filter(m=>m.selected).map(m=>m.name)
      : (S.bcMenus||[]);

    if(!seed.length){alert(isB ? '추천 메뉴를 먼저 선택해주세요' : '메뉴를 먼저 입력해주세요');return;}

    const type = isB ? 'style' : 'wishlist';
    const menus = _flowResolveMenuList(type, S.bcStyles, seed).slice(0, max);
    S.bcMenus = menus;

    const result = getIngredientsFromDB(menus, S.people || 1);
    const list = result && result.list ? result.list : [];
    S.cart = list.map(i => ({
      ...i,
      checked: !!i.inFridge,
      replaceName: '',
      replaceQty: ''
    }));
    S.fridgeAdded = false;
    S.cartDone = false;
    localStorage.removeItem('wm_cart_done');
    go('bc-cart');
  }catch(e){
    console.error('genBCCart final 오류:', e);
    alert('재료 분석 중 오류: ' + (e.message || e));
  }
}



function makeBCMealNow(){
  if(!S.bcMenus || !S.bcMenus.length){alert('먼저 장보기 재료 분석을 해주세요');return;}
  flowCreatePlan(S.bcMenus, `🍽️ 선택한 메뉴 기준으로 ${planDurationLabel()} 식단을 생성했어요.`);
  addUsage();
  go('bc-meal');
}



/* ===== FLOW FIX PATCH v3: B/C 장보기 이후 식단 생성 + 스케줄 선택 가시성 ===== */

function flowCreatePlan(menus,tip){
  ensureScheduleReady();
  menus=[...new Set((menus||[]).map(m=>flowMenuDBName(m)).filter(n=>MENU_DB[n]))];
  if(!menus.length){ menus=Object.keys(MENU_DB).sort(()=>Math.random()-0.5).slice(0,totalMeals()); }
  if(!menus.length){ alert('식단을 만들 메뉴가 없습니다. 메뉴를 다시 선택해주세요.'); return false; }
  const weeklyMeal=[]; let idx=0;
  for(const day of DAYS){
    const slots=(S.schedule[day]&&S.schedule[day].length)?S.schedule[day]:['점심','저녁'];
    const meals=slots.map(type=>flowMealObj(type,menus[idx++%menus.length]));
    weeklyMeal.push({day,meals});
  }
  S.mealPlan={weeklyMeal,tip:tip||''};
  S.mealStartDate=getThisMonday();
  flowCreateCalendar(menus);
  saveMeal();
  localStorage.setItem('wm_cal',JSON.stringify(S.mealCalendar||{}));
  return true;
}
function flowCreateCalendar(menus){
  ensureScheduleReady();
  menus=[...new Set((menus||[]).map(m=>flowMenuDBName(m)).filter(n=>MENU_DB[n]))];
  const cal={}; let idx=0;
  const start=new Date(); start.setDate(start.getDate()+1);
  const days=totalDays();
  for(let i=0;i<days;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    const key=dateKey(d); const day=DAYS[(d.getDay()+6)%7];
    const slots=(S.schedule[day]&&S.schedule[day].length)?S.schedule[day]:['점심','저녁'];
    cal[key]=slots.map(type=>flowMealObj(type,menus[idx++%menus.length]));
  }
  S.mealCalendar=cal;
  localStorage.setItem('wm_cal',JSON.stringify(cal));
}
function _bcSelectedMenus(){
  const isB=S.bcMode==='b';
  const seed=isB?(S.bcSuggested||[]).filter(m=>m.selected).map(m=>m.name):(S.bcMenus||[]);
  const type=isB?'style':'wishlist';
  let menus=_flowResolveMenuList(type,S.bcStyles,seed);
  if(!menus.length) menus=flowBuildMenu('style',S.bcStyles&&S.bcStyles.length?S.bcStyles:['한식'],[]);
  return menus.slice(0,totalMeals());
}
function genBCCart(){
  try{
    ensureScheduleReady();
    const isB=S.bcMode==='b';
    const seed=isB?(S.bcSuggested||[]).filter(m=>m.selected).map(m=>m.name):(S.bcMenus||[]);
    if(!seed.length){ alert(isB?'추천 메뉴를 먼저 선택해주세요':'메뉴를 먼저 입력해주세요'); return; }
    const menus=_bcSelectedMenus();
    if(!menus.length){ alert('메뉴DB에서 매칭되는 메뉴가 없습니다. 다른 메뉴로 다시 입력해주세요.'); return; }
    S.bcMenus=menus;
    const result=getIngredientsFromDB(menus,S.people||1);
    S.cart=(result.list||[]).map(i=>({...i,checked:!!i.inFridge,replaceName:'',replaceQty:''}));
    S.fridgeAdded=false; S.cartDone=false;
    localStorage.removeItem('wm_cart_done');
    go('bc-cart');
  }catch(e){ console.error('genBCCart patched 오류:',e); alert('재료 분석 중 오류: '+(e.message||e)); }
}
function addToFridge(){
  try{
    ensureScheduleReady();
    const checked=(S.cart||[]).filter(i=>i.checked);
    const bought=checked.filter(i=>!i.inFridge);
    for(const item of bought){
      const amountText=item.replaceQty||item.amount||item.qty||'적당량';
      const num=parseFloat(String(amountText).replace(/,/g,''));
      const unit=String(amountText).replace(/[0-9.,\s]/g,'').trim();
      S.fridge.push({
        name:item.replaceName||item.name,
        qty:Number.isFinite(num)?num:'', unit, amount:amountText,
        icon:item.icon||getIcon(item.name), addedAt:new Date().toISOString().slice(0,10), expireDays:(_safeShelfLife(item.replaceName||item.name||'').days||7), storage:(_safeShelfLife(item.replaceName||item.name||'').storage||'냉장')
      });
    }
    saveFridge();
    S.cart=(S.cart||[]).map(i=>({...i,checked:true,inFridge:true}));
    S.fridgeAdded=true; S.cartDone=true; localStorage.setItem('wm_cart_done','1');
    render();
  }catch(e){ console.error('addToFridge patched 오류:',e); alert('냉장고 반영/식단 생성 중 오류: '+(e.message||e)); }
}
function makeBCMealNow(){
  try{
    ensureScheduleReady();
    let menus=(S.bcMenus&&S.bcMenus.length)?S.bcMenus:_bcSelectedMenus();
    S.bcMenus=menus;
    if(!menus.length){ alert('먼저 메뉴 선택 또는 재료 분석을 해주세요.'); return; }
    if(flowCreatePlan(menus,`🍽️ 선택한 메뉴 기준으로 ${planDurationLabel()} 식단을 생성했어요.`)){
      addUsage(); go('bc-meal');
    }
  }catch(e){ console.error('makeBCMealNow patched 오류:',e); alert('식단 생성 중 오류: '+(e.message||e)); }
}
function rBCCart(){
  const cats=['채소','단백질','양념','면·밥','기타'];
  const catIcon={채소:'🥬',단백질:'🥩',양념:'🧄','면·밥':'🍚',기타:'🛒'};
  const done=(S.cart||[]).filter(i=>i.checked).length;
  const fridgeCount=(S.cart||[]).filter(i=>i.inFridge).length;
  const needBuy=(S.cart||[]).length-fridgeCount;
  let cartHTML='';
  for(const cat of cats){
    const items=(S.cart||[]).filter(i=>(i.category||'기타')===cat);
    if(!items.length) continue;
    cartHTML+=`<div style="margin-bottom:14px"><div class="sec">${catIcon[cat]} ${cat}</div>`;
    for(const item of items){
      const idx=S.cart.indexOf(item); const hf=item.inFridge; const shopInfo=!hf?getIngredientShopUrl(item.replaceName||item.name):null;
      cartHTML+=`<div class="shop-item" style="background:${hf?'#F0FFF6':'#fff'};border:1.5px solid ${hf?'#A5D6A7':'transparent'}">
        <div class="chk ${item.checked?'done':''}" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">${item.checked?'✓':''}</div>
        <span style="font-size:20px">${item.icon||getIcon(item.name)}</span>
        <div style="flex:1" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"><span style="font-weight:600;font-size:14px;text-decoration:${item.checked?'line-through':'none'};color:${item.checked?'#bbb':'var(--text)'}">${item.replaceName||item.name}</span>${hf?"<span style='font-size:10px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 6px;font-weight:700'>냉장고✓</span>":''}</div>
          <div style="font-size:11px;color:#aaa">${item.replaceQty||item.amount}${item.usedIn?' · '+item.usedIn:''}</div>
        </div>
        ${!hf&&!item.checked&&shopInfo?`<a href="${shopInfo.url}" target="_blank" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;background:#E2173C;color:#fff;border-radius:10px;padding:6px 8px;text-decoration:none;flex-shrink:0;gap:1px"><span style="font-size:14px">🛒</span><span style="font-size:9px;font-weight:700">쿠팡</span></a>`:''}
        <button onclick="openEditCart(${idx})" style="background:none;border:none;color:#aaa;font-size:13px;flex-shrink:0">✏️</button>
      </div>`;
    }
    cartHTML+='</div>';
  }
  return`<div style="padding:80px 20px 14px;background:linear-gradient(160deg,#FCE4EC,#fff)">
    <button class="back" onclick="go(S.bcMode==='b'?'b-suggest':'bc-entry')">←</button>
    <div class="title">🛒 ${S.people}인분 장보기</div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <div style="flex:1;background:#E8F5E9;border-radius:10px;padding:8px;text-align:center"><div style="font-size:11px;font-weight:700;color:#2e7d32">냉장고✓</div><div style="font-size:16px;font-weight:900;color:#2ECC71">${fridgeCount}개</div></div>
      <div style="flex:1;background:#FFF8EE;border-radius:10px;padding:8px;text-align:center"><div style="font-size:11px;font-weight:700;color:#e65100">사야할것</div><div style="font-size:16px;font-weight:900;color:var(--primary)">${needBuy}개</div></div>
      <div style="flex:1;background:#f8f8f8;border-radius:10px;padding:8px;text-align:center"><div style="font-size:11px;font-weight:700;color:#888">완료</div><div style="font-size:16px;font-weight:900;color:var(--primary)">${done}개</div></div>
    </div>
    <div style="display:flex;gap:6px;margin-top:10px">
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=true);render()" style="flex:1;padding:8px;background:var(--primary-pale);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--primary)">✓ 전체선택</button>
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=false);render()" style="flex:1;padding:8px;background:#f5f5f5;border:none;border-radius:10px;font-size:12px;font-weight:700;color:#888">✕ 전체해제</button>
      <button onclick="makeBCMealNow()" style="flex:1;padding:8px;background:#E8F5E9;border:none;border-radius:10px;font-size:12px;font-weight:800;color:#2e7d32">식단생성</button>
    </div>
  </div>
  <div class="px" style="padding-top:8px;padding-bottom:150px">${cartHTML||'<div style="text-align:center;color:#aaa;padding:40px 0">장보기 목록이 비어있어요</div>'}</div>
  <div class="bottom-bar">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
      <button class="btn-g" onclick="addToFridge()" ${done===0?'disabled':''} style="${done===0?'opacity:.45':''}">❄️ 냉장고 반영</button>
      <button class="btn-p" onclick="makeBCMealNow()">🍽️ 식단 생성</button>
    </div>
  </div>
  <div id="cart-modal" style="display:none" class="modal-bg"><div class="modal-card">
    <div style="font-weight:800;font-size:17px;margin-bottom:16px" id="cart-modal-name"></div>
    <div class="sec" style="margin-bottom:4px">대체 재료명</div><input id="cart-rep-name" class="inp" style="width:100%;margin-bottom:10px" placeholder="그대로면 비워두세요">
    <div class="sec" style="margin-bottom:4px">수량 수정</div><input id="cart-rep-qty" class="inp" style="width:100%;margin-bottom:16px" placeholder="예: 500g">
    <button class="btn-p" onclick="confirmEditCart()">수정 완료</button><button onclick="document.getElementById('cart-modal').style.display='none'" style="width:100%;padding:12px;background:none;border:none;color:#aaa;font-size:14px;margin-top:6px">취소</button>
  </div></div>`;
}
function rMealSlotIcon(meal,on){
  const cfg={아침:['#FFB020','#FFE7B8'],점심:['#4B3FD8','#E9E7FF'],저녁:['#425466','#E8EDF5']}[meal]||['#4B3FD8','#E9E7FF'];
  return `<span style="width:30px;height:30px;border-radius:12px;background:${on?cfg[0]:cfg[1]};display:inline-flex;align-items:center;justify-content:center;position:relative;box-shadow:${on?'0 5px 12px rgba(0,0,0,.12)':'none'}">
    <span style="width:14px;height:14px;border-radius:50%;background:${on?'#fff':cfg[0]};display:block"></span>
    <span style="position:absolute;right:5px;bottom:5px;width:7px;height:7px;border-radius:50%;background:${on?cfg[1]:'#fff'}"></span>
  </span>`;
}



/* =========================================================
   DB ENGINE V2 UPGRADE
   - INGREDIENT_DB: 표준 재료 ID + alias
   - MENU_SCHEMA: 메뉴가 ingredientId를 참조
   - MENU_DB 호환 변환: 기존 화면/장보기/식단 함수 유지
   ========================================================= */
