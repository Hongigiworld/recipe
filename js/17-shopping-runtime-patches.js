/* ===== shopping-sprint3a-runtime ===== */
(function(){
  function money(n){ return '₩'+Math.max(0,Math.round(n||0)).toLocaleString('ko-KR'); }
  function _numFromAmount(amount){
    const s=String(amount||'');
    const m=s.replace(/,/g,'').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m?parseFloat(m[1]):1;
  }
  function estimateIngredientCost(item){
    const name=String((item&&item.replaceName)||item.name||'');
    const amt=String((item&&item.replaceQty)||item.amount||'');
    if(item&&item.inFridge) return 0;
    const n=_numFromAmount(amt);
    let base=1200;
    if(/소고기|한우|차돌|갈비|등심|안심|채끝|부채살|살치살|립아이|티본|토마호크/i.test(name)) base=8500;
    else if(/돼지|삼겹|목살|앞다리|등갈비|돈카츠|차슈|베이컨/i.test(name)) base=5200;
    else if(/닭|치킨|닭가슴|닭다리|날개|계란|달걀/i.test(name)) base=3600;
    else if(/연어|새우|오징어|낙지|고등어|갈치|조개|홍합|해물|생선|참치|가리비|전복/i.test(name)) base=6000;
    else if(/쌀|밥|면|우동|라멘|파스타|소바|국수|빵|또르티야|떡/i.test(name)) base=2200;
    else if(/간장|고추장|된장|식초|소스|오일|기름|버터|치즈|향신료|커리|마요|설탕|소금/i.test(name)) base=1800;
    else if(/상추|배추|양파|대파|마늘|당근|오이|토마토|버섯|양배추|감자|고구마|브로콜리|채소|야채/i.test(name)) base=1400;
    if(/g|그램/i.test(amt)) return base*Math.max(.35, Math.min(3.5,n/300));
    if(/ml|리터/i.test(amt)) return base*Math.max(.25, Math.min(2.5,n/250));
    if(/개|쪽|장|컵|큰술|작은술/i.test(amt)) return base*Math.max(.25, Math.min(3,n/3));
    return base;
  }
  function categoryCost(items){return (items||[]).reduce((s,i)=>s+estimateIngredientCost(i),0);}
  function shop3ItemCard(item, idx){
    const hf=!!item.inFridge;
    const checked=!!item.checked;
    const shopInfo=!hf?getIngredientShopUrl(item.replaceName||item.name):null;
    const used=item.usedIn?('사용 메뉴 · '+item.usedIn):'식단 메뉴에 사용';
    return `<div class="shop3-card ${hf?'owned':''} ${checked?'checked':''}">
      <div class="shop3-check ${checked?'done':''}" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">${checked?'✓':''}</div>
      <div class="shop3-icon" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">${item.icon||getIcon(item.name)}</div>
      <div class="shop3-info" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">
        <div class="shop3-name">${item.replaceName||item.name}${hf?'<span class="shop3-badge">❄️ 보유</span>':''}</div>
        <div class="shop3-amount">${item.replaceQty||item.amount||''}${!hf?' · 예상 '+money(estimateIngredientCost(item)):''}</div>
        <div class="shop3-used">${used}</div>
      </div>
      ${!hf&&!checked&&shopInfo?`<a class="shop3-buy" href="${shopInfo.url}" target="_blank" onclick="event.stopPropagation()">쿠팡</a>`:''}
      <button class="shop3-edit" onclick="openEditCart(${idx})">✎</button>
    </div>`;
  }
  function renderShoppingSprint3A(kind){
    const cart=S.cart||[];
    const isBC=kind==='bc';
    if(!cart.length){
      return `<div class="shop3-empty"><div style="font-size:48px;margin-bottom:12px">🛒</div><div style="font-weight:900;font-size:18px;color:#171B2A">장보기 목록이 비어있어요</div><div style="font-size:13px;margin-top:7px">식단을 만들면 필요한 재료가 자동으로 정리돼요</div><button onclick="go('home')" class="btn-p" style="margin-top:20px">홈으로</button></div>`;
    }
    const cats=['단백질','채소','면·밥','양념','기타'];
    const catIcon={채소:'🥬',단백질:'🥩',양념:'🧄','면·밥':'🍚',기타:'🛒'};
    const done=cart.filter(i=>i.checked).length;
    const fridgeCount=cart.filter(i=>i.inFridge).length;
    const needBuy=cart.length-fridgeCount;
    const buyDone=cart.filter(i=>i.checked&&!i.inFridge).length;
    const progress=needBuy?Math.round(buyDone/needBuy*100):100;
    const totalCost=categoryCost(cart);
    let body='';
    cats.forEach(cat=>{
      let items=cart.filter(i=>(i.category||'기타')===cat);
      if(!items.length) return;
      items=items.slice().sort((a,b)=>(a.inFridge?1:0)-(b.inFridge?1:0));
      const cost=categoryCost(items);
      body+=`<div class="shop3-cat"><div class="shop3-cat-head"><div class="shop3-cat-title"><span>${catIcon[cat]}</span><span>${cat}</span><span style="color:#9AA3B2;font-size:12px">${items.length}</span></div><div class="shop3-cat-sub">예상 ${money(cost)}</div></div>`;
      items.forEach(item=>body+=shop3ItemCard(item, cart.indexOf(item)));
      body+='</div>';
    });
    const back=isBC?`<button class="back" onclick="go(S.bcMode==='b'?'b-suggest':'bc-entry')" style="margin:20px 18px 10px">←</button>`:'';
    const toolbar=`<div class="shop3-toolbar"><button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=true);render()" style="background:var(--primary-pale);color:var(--primary)">✓ 전체선택</button><button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=false);render()" style="background:#fff;color:#8A94A6">전체해제</button>${!isBC?`<button onclick="S.cart=S.cart.filter(i=>!i.checked||i.inFridge);render()" style="background:#FFF0F0;color:#e53935">선택삭제</button>`:`<button onclick="makeBCMealNow()" style="background:#E9FFF2;color:#059669">식단생성</button>`}</div>`;
    const bottom=isBC
      ? `<div class="bottom-bar"><div class="shop3-bottom-two"><button class="btn-g" onclick="${done>0?'addToFridge()':'makeBCMealNow()'}">${done>0?'❄️ 냉장고 반영':'🍽️ 바로 생성'}</button><button class="btn-p" onclick="makeBCMealNow()">식단 생성</button></div></div>`
      : `<div class="bottom-bar">${S.cartDone?`<button onclick="go('home')" class="btn-p">🏠 홈으로 돌아가기</button>`:`<button class="btn-g" ${done===0?'disabled':''} onclick="addToFridge()">❄️ 구매완료 - 냉장고에 넣기 (${done}개)</button>`}</div>`;
    return `${back}<div class="shop3-hero"><div class="shop3-hero-title">${isBC?(S.people||1)+'인분 장보기':'이번 주 장보기'}</div><div class="shop3-hero-main">구매 필요 ${needBuy}개</div><div class="shop3-hero-cost">냉장고 보유 ${fridgeCount}개</div><div class="shop3-progress"><span style="width:${progress}%"></span></div><div style="font-size:11px;margin-top:7px;opacity:.84">${buyDone}/${needBuy} 구매완료 · ${progress}%</div></div><div class="shop3-metrics"><div class="shop3-metric"><div class="label">전체</div><div class="num">${cart.length}</div></div><div class="shop3-metric"><div class="label">구매필요</div><div class="num">${needBuy}</div></div></div>${toolbar}<div class="shop3-wrap">${body}</div>${bottom}<div id="cart-modal" style="display:none" class="modal-bg"><div class="modal-card"><div style="font-weight:800;font-size:17px;margin-bottom:16px" id="cart-modal-name"></div><div class="sec" style="margin-bottom:4px">대체 재료명</div><input id="cart-rep-name" class="inp" style="width:100%;margin-bottom:10px" placeholder="그대로면 비워두세요"><div class="sec" style="margin-bottom:4px">수량 수정</div><input id="cart-rep-qty" class="inp" style="width:100%;margin-bottom:16px" placeholder="예: 500g"><button class="btn-p" onclick="confirmEditCart()">수정 완료</button><button onclick="document.getElementById('cart-modal').style.display='none'" style="width:100%;padding:12px;background:none;border:none;color:#aaa;font-size:14px;margin-top:6px">취소</button></div></div>`;
  }
  window.rBCCart=function(){return renderShoppingSprint3A('bc');};
  window.rCartTab=function(){return renderShoppingSprint3A('tab');};
})();
/* ===== /shopping-sprint3a-runtime ===== */


/* ===== shopping-sprint3b-runtime ===== */
(function(){
  function money(n){return '₩'+Math.max(0,Math.round(n||0)).toLocaleString('ko-KR');}
  function numFromAmount(amount){const m=String(amount||'').replace(/,/g,'').match(/([0-9]+(?:\.[0-9]+)?)/);return m?parseFloat(m[1]):1;}
  function estimateIngredientCost(item){
    const name=String((item&&item.replaceName)||item.name||''); const amt=String((item&&item.replaceQty)||item.amount||'');
    if(item&&item.inFridge) return 0; const n=numFromAmount(amt); let base=1200;
    if(/소고기|한우|차돌|갈비|등심|안심|채끝|부채살|살치살|립아이|티본|토마호크/i.test(name)) base=8500;
    else if(/돼지|삼겹|목살|앞다리|등갈비|돈카츠|차슈|베이컨/i.test(name)) base=5200;
    else if(/닭|치킨|닭가슴|닭다리|날개|계란|달걀/i.test(name)) base=3600;
    else if(/연어|새우|오징어|낙지|고등어|갈치|조개|홍합|해물|생선|참치|가리비|전복/i.test(name)) base=6000;
    else if(/쌀|밥|면|우동|라멘|파스타|소바|국수|빵|또르티야|떡/i.test(name)) base=2200;
    else if(/간장|고추장|된장|식초|소스|오일|기름|버터|치즈|향신료|커리|마요|설탕|소금/i.test(name)) base=1800;
    else if(/상추|배추|양파|대파|마늘|당근|오이|토마토|버섯|양배추|감자|고구마|브로콜리|채소|야채/i.test(name)) base=1400;
    if(/g|그램/i.test(amt)) return base*Math.max(.35,Math.min(3.5,n/300));
    if(/ml|리터/i.test(amt)) return base*Math.max(.25,Math.min(2.5,n/250));
    if(/개|쪽|장|컵|큰술|작은술/i.test(amt)) return base*Math.max(.25,Math.min(3,n/3));
    return base;
  }
  function categoryCost(items){return (items||[]).reduce((s,i)=>s+estimateIngredientCost(i),0);}
  function toggleCart(idx){S.cart[idx].checked=!S.cart[idx].checked;render();}
  window.shop3BToggle=toggleCart;
  window.shop3BMarkNeedBuyDone=function(){(S.cart||[]).forEach((i,idx)=>{if(!i.inFridge)S.cart[idx].checked=true;});render();};
  window.shop3BUncheckNeedBuy=function(){(S.cart||[]).forEach((i,idx)=>{if(!i.inFridge)S.cart[idx].checked=false;});render();};
  function itemCard(item,idx){
    const hf=!!item.inFridge, checked=!!item.checked, bought=checked&&!hf;
    const shopInfo=!hf?getIngredientShopUrl(item.replaceName||item.name):null;
    const used=item.usedIn?('사용 메뉴 · '+item.usedIn):'식단 메뉴에 사용';
    return `<div class="shop3-card ${hf?'owned':''} ${bought?'done-buy':''}">
      <div class="shop3-check ${checked?'done':''}" onclick="shop3BToggle(${idx})">${checked?'✓':''}</div>
      <div class="shop3-icon" onclick="shop3BToggle(${idx})">${item.icon||getIcon(item.name)}</div>
      <div class="shop3-info" onclick="shop3BToggle(${idx})">
        <div class="shop3-name">${item.replaceName||item.name}${hf?'<span class="shop3-badge">❄️ 보유</span>':bought?'<span class="shop3-badge" style="background:#F2F4F7;color:#667085">구매완료</span>':''}</div>
        <div class="shop3-amount">${item.replaceQty||item.amount||''}''</div>
        <div class="shop3-used">${used}</div>
      </div>
      ${!hf&&!checked&&shopInfo?`<a class="shop3-buy" href="${shopInfo.url}" target="_blank" onclick="event.stopPropagation()">쿠팡</a>`:''}
      <button class="shop3-edit" onclick="openEditCart(${idx})">✎</button>
    </div>`;
  }
  function renderShoppingSprint3B(kind){
    const cart=S.cart||[]; const isBC=kind==='bc';
    if(!cart.length){return `<div class="shop3-empty"><div style="font-size:48px;margin-bottom:12px">🛒</div><div style="font-weight:900;font-size:18px;color:#171B2A">장보기 목록이 비어있어요</div><div style="font-size:13px;margin-top:7px">식단을 만들면 필요한 재료가 자동으로 정리돼요</div><button onclick="go('home')" class="btn-p" style="margin-top:20px">홈으로</button></div>`;}
    const cats=['단백질','채소','면·밥','양념','기타']; const catIcon={채소:'🥬',단백질:'🥩',양념:'🧄','면·밥':'🍚',기타:'🛒'};
    const total=cart.length, fridgeCount=cart.filter(i=>i.inFridge).length, needBuy=cart.filter(i=>!i.inFridge).length;
    const buyDone=cart.filter(i=>i.checked&&!i.inFridge).length, remain=Math.max(0,needBuy-buyDone);
    const progress=needBuy?Math.round(buyDone/needBuy*100):100, totalCost=categoryCost(cart);
    let body='';
    cats.forEach(cat=>{
      const raw=cart.filter(i=>(i.category||'기타')===cat); if(!raw.length)return;
      const active=raw.filter(i=>!i.inFridge).sort((a,b)=>(a.checked?1:0)-(b.checked?1:0));
      const owned=raw.filter(i=>i.inFridge);
      const activeDone=active.filter(i=>i.checked).length;
      body+=`<div class="shop3-cat"><div class="shop3-cat-head"><div class="shop3-cat-title"><span>${catIcon[cat]}</span><span>${cat}</span><span style="color:#9AA3B2;font-size:12px">${activeDone}/${active.length}</span></div></div>`;
      active.forEach(item=>body+=itemCard(item,cart.indexOf(item)));
      if(owned.length){body+=`<div class="shop3b-cat-owned"><div class="shop3b-owned-title"><span>❄️ 냉장고 보유</span><span>${owned.length}개</span></div>`; owned.forEach(item=>body+=itemCard(item,cart.indexOf(item))); body+='</div>';}
      body+='</div>';
    });
    const back=isBC?`<button class="back" onclick="go(S.bcMode==='b'?'b-suggest':'bc-entry')" style="margin:20px 18px 10px">←</button>`:'';
    const toolbar=`<div class="shop3-toolbar"><button onclick="shop3BMarkNeedBuyDone()" style="background:var(--primary-pale);color:var(--primary)">✓ 전체 담기</button><button onclick="shop3BUncheckNeedBuy()" style="background:#fff;color:#8A94A6;border:1px solid #E8E8F0">전체 해제</button></div>`;
    const complete=progress>=100?`<div class="shop3b-complete"><strong>장보기 체크 완료</strong><span>구매한 재료를 냉장고에 반영하거나 바로 식단을 생성하세요.</span></div>`:'';
    const fridgeReady=buyDone>0;
    const mealReady=S.fridgeAdded===true;
    const stepHint=!fridgeReady
      ?'① 재료를 체크하고 냉장고에 반영하세요'
      :!mealReady
        ?'② 냉장고 반영 완료! 이제 식단을 생성하세요 →'
        :'✓ 준비 완료!';
    const bottom=`<div class="bottom-bar">
      <div style="padding:0 4px 8px">
        <div style="display:flex;gap:0;flex:1;background:#F0F0F8;border-radius:12px;padding:6px 10px;align-items:center;margin-bottom:10px">
          <span style="font-size:11px;font-weight:800;color:${fridgeReady?'#10B981':'#6D5DF6'}">① 담기</span>
          <span style="font-size:10px;color:#D1D5DB;margin:0 5px">›</span>
          <span style="font-size:11px;font-weight:800;color:${fridgeReady&&!mealReady?'#6D5DF6':mealReady?'#10B981':'#9CA3AF'}">② 냉장고 반영</span>
          <span style="font-size:10px;color:#D1D5DB;margin:0 5px">›</span>
          <span style="font-size:11px;font-weight:800;color:${mealReady?'#6D5DF6':'#9CA3AF'}">③ 식단 생성</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
          <button class="btn-g" onclick="addToFridge()"
            style="background:${!fridgeReady?'linear-gradient(135deg,#9CA3AF,#6B7280)!important':''};opacity:${mealReady?'.55':'1'}"
            ${!fridgeReady?'disabled':''}>
            ❄️ 냉장고 반영
          </button>
          <button class="btn-p" onclick="makeBCMealNow()"
            style="background:${!mealReady?'linear-gradient(135deg,#9CA3AF,#6B7280)!important':''}"
            ${!mealReady?'disabled':''}>
            🍽️ 식단 생성
          </button>
        </div>
        <div style="text-align:center;font-size:11px;color:${mealReady?'#6D5DF6':fridgeReady?'#10B981':'#9CA3AF'};font-weight:700;margin-top:8px">${stepHint}</div>
      </div>
    </div>`;
    return `${back}<div class="shop3-hero"><div class="shop3b-hero-row"><div><div class="shop3-hero-title">${isBC?(S.people||1)+'인분 장보기':'이번 주 장보기'}</div><div class="shop3-hero-main">${remain>0?'남은 구매 '+remain+'개':'구매 체크 완료'}</div></div><div class="shop3b-ring" style="--p:${progress}%"><span>${progress}%</span></div></div><div class="shop3b-status"><span class="shop3b-pill">전체 ${total}</span><span class="shop3b-pill">구매 ${buyDone}/${needBuy}</span><span class="shop3b-pill">보유 ${fridgeCount}</span></div><div class="shop3-progress"><span style="width:${progress}%"></span></div></div><div class="shop3-metrics"><div class="shop3-metric"><div class="label">남은구매</div><div class="num">${remain}</div></div><div class="shop3-metric"><div class="label">완료율</div><div class="num">${progress}%</div></div></div>${toolbar}${complete}<div class="shop3-wrap">${body}</div>${bottom}<div id="cart-modal" style="display:none" class="modal-bg"><div class="modal-card"><div style="font-weight:800;font-size:17px;margin-bottom:16px" id="cart-modal-name"></div><div class="sec" style="margin-bottom:4px">대체 재료명</div><input id="cart-rep-name" class="inp" style="width:100%;margin-bottom:10px" placeholder="그대로면 비워두세요"><div class="sec" style="margin-bottom:4px">수량 수정</div><input id="cart-rep-qty" class="inp" style="width:100%;margin-bottom:16px" placeholder="예: 500g"><button class="btn-p" onclick="confirmEditCart()">수정 완료</button><button onclick="document.getElementById('cart-modal').style.display='none'" style="width:100%;padding:12px;background:none;border:none;color:#aaa;font-size:14px;margin-top:6px">취소</button></div></div>`;
  }
  window.rBCCart=function(){return renderShoppingSprint3B('bc');};
  window.rCartTab=function(){return renderShoppingSprint3B('tab');};
})();
/* ===== /shopping-sprint3b-runtime ===== */
