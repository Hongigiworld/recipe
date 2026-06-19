/* ===== sprint6a-flow-workspace-runtime ===== */
(function(){
  function safeArr(v){ return Array.isArray(v) ? v : []; }
  function flowDisplayName(style){ try{return typeof bcStyleDisplayName==='function'?bcStyleDisplayName(style):String(style||'').replace(/^\S+\s+/,'').trim();}catch(e){return String(style||'');} }
  function flowStepPercent(done,total){ return Math.max(0,Math.min(100,Math.round((done/Math.max(total,1))*100))); }
  function flowHeader(o){
    var tone=o.tone||'';
    var p=flowStepPercent(o.done||0,o.total||3);
    return '<div class="wm-flow-top">'
      +'<div><div class="wm-flow-kicker">'+(o.kicker||'MEAL FLOW')+'</div><div class="wm-flow-title">'+(o.title||'식단 생성')+'</div><div class="wm-flow-sub">'+(o.sub||'')+'</div></div>'
      +'<button class="wm-flow-reset" onclick="'+(o.back||'go(\'home\')')+'">'+(o.backText||'← 홈')+'</button></div>'
      +'<div class="wm-flow-hero '+tone+'"><div class="wm-flow-hero-row"><div class="wm-flow-hero-main"><b>'+(o.heroTitle||'식단 만들기')+'</b><span>'+(o.heroSub||'')+'</span></div><div class="wm-flow-hero-icon">'+(o.icon||'🍳')+'</div></div><div class="wm-flow-progress"><i style="width:'+p+'%"></i></div><div class="wm-flow-progress-label">진행률 '+p+'% · '+(o.status||'입력 중')+'</div></div>';
  }
  function stat(label,value){ return '<div class="wm-flow-stat"><span>'+label+'</span><b>'+value+'</b></div>'; }
  function section(icon,title,sub,pill,body,extraClass){ return '<div class="wm-flow-section '+(extraClass||'')+'"><div class="wm-flow-section-head"><div class="wm-flow-section-title"><div class="wm-flow-section-icon">'+icon+'</div><div><b>'+title+'</b><span>'+sub+'</span></div></div>'+pill+'</div><div class="wm-flow-body">'+body+'</div></div>'; }
  function pill(txt,cls){ return '<span class="wm-flow-pill '+(cls||'')+'">'+txt+'</span>'; }
  function chip(txt,cls,onclick){ return '<button type="button" '+(onclick?'onclick="'+onclick+'"':'')+' class="wm-flow-chip '+(cls||'')+'">'+txt+'</button>'; }
  function fridgeSummaryRows(){
    var items=[...safeArr(S.fridge)].sort(function(a,b){return getDday(a.addedAt,a.expireDays)-getDday(b.addedAt,b.expireDays);}).slice(0,5);
    if(!items.length) return '<div class="wm-flow-empty">냉장고가 비어있어요<br><span style="font-size:11.5px;color:#A8B0BD">재료를 추가하면 바로 식단을 만들 수 있어요</span></div>';
    return items.map(function(ing,idx){ var d=getDday(ing.addedAt,ing.expireDays); return '<div class="wm-flow-row"><div class="wm-flow-row-icon">'+(ing.icon||getIcon(ing.name))+'</div><div class="wm-flow-row-main"><b>'+ing.name+'</b><span>'+((ing.qty||'')+(ing.unit||''))+' · '+(d<=0?'만료':d+'일 남음')+'</span></div>'+ddayBadge(d)+'</div>'; }).join('')
      +(safeArr(S.fridge).length>5?'<div style="font-size:11px;color:#8B95A1;text-align:center;margin-top:4px">외 '+(safeArr(S.fridge).length-5)+'개 재료</div>':'');
  }
  function styleChips(selected){
    var sel=safeArr(selected);
    if(!sel.length) return '<div class="wm-flow-empty">선택된 스타일이 없어요<br><span style="font-size:11.5px;color:#A8B0BD">한식, 일식, 국가별 스타일을 선택해주세요</span></div>';
    return '<div class="wm-flow-chip-wrap">'+sel.map(function(s,i){ return chip(flowDisplayName(s)+' ✕','active','S.bcStyles.splice('+i+',1);render()'); }).join('')+'</div>';
  }
  window.rHomeA = rHomeA = function(){
    var fridgeDone=safeArr(S.fridge).length>0;
    var styleDone=safeArr(S.bcStyles).length>0;
    var mealDone=!!S.mealPlan;
    var done=(fridgeDone?1:0)+(styleDone?1:0)+(mealDone?1:0);
    var urgent=safeArr(S.fridge).filter(function(i){var d=getDday(i.addedAt,i.expireDays); return d<=3&&d>0;}).length;
    return '<div class="wm-flow-page">'
      +flowHeader({kicker:'A FLOW',title:'냉장고 재료로 짜기',sub:'보유 재료를 확인하고 취향만 더해 식단을 생성해요.',tone:'green',done:done,total:3,heroTitle:safeArr(S.fridge).length+'가지 재료 사용 가능',heroSub:(styleDone?'선택 스타일: '+safeArr(S.bcStyles).map(flowDisplayName).join(', '):'냉장고 확인 → 스타일 선택 → 식단 생성'),icon:'❄️',status:mealDone?'식단 생성 완료':styleDone?'생성 준비 완료':fridgeDone?'스타일 선택 필요':'재료 확인 필요',back:'S.mealPlan?confirmNewPlan():resetFlow()',backText:'초기화'})
      +'<div class="wm-flow-grid">'+stat('냉장고',safeArr(S.fridge).length+'개')+stat('임박',urgent+'개')+stat('인원',S.people+'인')+'</div>'
      +section('❄️','냉장고 확인',fridgeDone?safeArr(S.fridge).length+'가지 재료 입력됨':'재료를 먼저 추가해주세요',pill(fridgeDone?'완료':'필요',fridgeDone?'done':'wait'),fridgeSummaryRows()+'<button class="wm-flow-mini-btn subtle" style="width:100%;margin-top:10px" onclick="go(\'a-fridge\')">냉장고 재료 관리</button>')
      +section('🍽️','식사 스타일 선택',styleDone?safeArr(S.bcStyles).map(flowDisplayName).join(' · '):'한식/일식/중식/국가별 선택',pill(styleDone?'완료':'대기',styleDone?'done':'wait'),styleChips(S.bcStyles)+'<button class="wm-flow-mini-btn subtle" style="width:100%;margin-top:10px" onclick="go(\'a-style\')" '+(!fridgeDone?'disabled style="opacity:.45;width:100%;margin-top:10px"':'')+'>스타일 선택하기</button>')
      +section('✨','AI 식단 생성',mealDone?'식단 생성이 완료됐어요':'재료와 스타일을 기반으로 식단을 만들어요',pill(mealDone?'완료':(fridgeDone&&styleDone?'준비됨':'대기'),mealDone?'done':(fridgeDone&&styleDone?'':'wait')),'<div class="wm-flow-row"><div class="wm-flow-row-icon">📅</div><div class="wm-flow-row-main"><b>'+(mealDone?'식단표에서 확인 가능':'생성 준비 상태')+'</b><span>'+(fridgeDone&&styleDone?'선택 정보를 바탕으로 생성할 수 있어요':'냉장고와 스타일을 먼저 완료해주세요')+'</span></div>'+(mealDone?'<button class="wm-flow-mini-btn green" onclick="go(\'a-meal\')">보기</button>':'')+'</div>')
      +'</div><div class="wm-flow-cta"><button class="btn-p" '+(!(fridgeDone&&styleDone)?'disabled':'')+' onclick="'+(mealDone?'go(\'a-meal\')':'genAMeal()')+'">'+(mealDone?'📅 생성된 식단 보기':'✨ AI 식단 생성')+'</button></div>';
  };
  window.rAFridge = rAFridge = function(){
    var sorted=[...safeArr(S.fridge)].sort(function(a,b){return getDday(a.addedAt,a.expireDays)-getDday(b.addedAt,b.expireDays);});
    var urgent=sorted.filter(function(i){var d=getDday(i.addedAt,i.expireDays);return d<=3&&d>0;}).length;
    var rows=sorted.length?sorted.map(function(ing,i){var d=getDday(ing.addedAt,ing.expireDays);return '<div class="wm-flow-row"><div class="wm-flow-row-icon">'+(ing.icon||getIcon(ing.name))+'</div><div class="wm-flow-row-main"><b>'+ing.name+' '+storageBadge(ing.storage||getShelfLife(ing.name).storage)+'</b><span>'+((ing.qty||'')+(ing.unit||''))+' · '+(d<=0?'만료':d+'일 남음')+'</span></div>'+ddayBadge(d)+'<button class="wm-flow-mini-btn subtle" onclick="editFI('+i+')">수정</button><button class="wm-flow-mini-btn wm-flow-danger" onclick="S.fridge.splice('+i+',1);saveFridge();render()">삭제</button></div>';}).join(''):'<div class="wm-flow-empty">냉장고가 비어있어요<br><span style="font-size:11.5px;color:#A8B0BD">재료를 직접 추가해주세요</span></div>';
    return '<div class="wm-flow-page">'+flowHeader({kicker:'A FLOW · INPUT',title:'냉장고 재료 확인',sub:'현재 보유 재료를 확인하고 부족한 재료를 추가하세요.',tone:'green',done:1,total:3,heroTitle:sorted.length+'가지 재료',heroSub:'유통기한이 가까운 재료를 우선 반영해 식단을 만들어요.',icon:'🥬',status:'재료 확인',back:'go(\'home\')',backText:'← 홈'})+'<div class="wm-flow-grid">'+stat('전체',sorted.length+'개')+stat('임박',urgent+'개')+stat('인원',S.people+'인')+'</div>'+section('🥬','보유 재료 목록','식단에 활용할 재료입니다',pill(sorted.length?'확인됨':'비어있음',sorted.length?'done':'wait'),rows+'<button class="wm-flow-mini-btn subtle" style="width:100%;margin-top:10px" onclick="openAddFI()">+ 재료 직접 추가</button>')+'</div><div class="wm-flow-cta"><button class="btn-p" onclick="go(\'a-style\')" '+(!sorted.length?'disabled':'')+'>다음 · 식사 스타일 선택</button></div>';
  };
  window.rAStyle = rAStyle = function(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    var sel=safeArr(S.bcStyles);
    var styles=[{id:'한식',e:'🍚'},{id:'일식',e:'🍱'},{id:'중식',e:'🥢'},{id:'헬시',e:'🥗'},{id:'🇹🇭 태국',e:'🇹🇭'},{id:'🇻🇳 베트남',e:'🇻🇳'},{id:'🇮🇩 인도네시아',e:'🇮🇩'},{id:'🇲🇾 말레이시아',e:'🇲🇾'},{id:'🇸🇬 싱가포르',e:'🇸🇬'},{id:'🇵🇭 필리핀',e:'🇵🇭'},{id:'🇮🇳 인도',e:'🇮🇳'},{id:'🌙 중동',e:'🌙'},{id:'🇹🇷 터키',e:'🇹🇷'},{id:'🇬🇷 그리스',e:'🇬🇷'},{id:'🇪🇸 스페인',e:'🇪🇸'},{id:'🇫🇷 프랑스',e:'🇫🇷'},{id:'🇮🇹 이탈리아',e:'🇮🇹'},{id:'🇩🇪 독일',e:'🇩🇪'},{id:'🇵🇹 포르투갈',e:'🇵🇹'},{id:'🇲🇽 멕시코',e:'🇲🇽'},{id:'🇺🇸 미국',e:'🇺🇸'},{id:'🇧🇷 브라질',e:'🇧🇷'}];
    var grid='<div class="wm-flow-chip-wrap">'+styles.map(function(st){var on=sel.indexOf(st.id)>=0; return chip(st.e+' '+flowDisplayName(st.id)+(on?' ✓':''),on?'active':'','toggleStyle(\''+st.id+'\')');}).join('')+'</div>';
    return '<div class="wm-flow-page">'+flowHeader({kicker:'A FLOW · TASTE',title:'식사 스타일 선택',sub:'냉장고 재료를 어떤 분위기의 식단으로 만들지 선택하세요.',tone:'green',done:2,total:3,heroTitle:sel.length?sel.map(flowDisplayName).join(' + '):'스타일을 골라주세요',heroSub:'복수 선택 가능 · 선택한 스타일 안에서 메뉴를 구성해요.',icon:'🍽️',status:sel.length?'스타일 선택 완료':'스타일 선택 필요',back:'go(\'home\')',backText:'← 홈'})+'<div class="wm-flow-grid">'+stat('재료',safeArr(S.fridge).length+'개')+stat('스타일',sel.length+'개')+stat('식단',totalMeals()+'끼')+'</div>'+section('✅','선택된 스타일',sel.length?sel.map(flowDisplayName).join(' · '):'아직 선택되지 않았어요',pill(sel.length?'선택됨':'필요',sel.length?'done':'wait'),styleChips(sel))+section('🌍','스타일 추가','한식/일식/중식/국가별 선택',pill('선택 가능'),grid)+'</div><div class="wm-flow-cta"><button class="btn-p" '+(!sel.length?'disabled':'')+' onclick="genAMeal()">✨ AI 식단 생성</button></div>';
  };
  window.rBCEntry = rBCEntry = function(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    var isB=S.bcMode==='b'; var max=totalMeals();
    var POPULAR=['삼겹살구이','된장찌개','김치찌개','비빔밥','제육볶음','불고기','카레라이스','짜장면','파스타','스테이크','라멘','볶음밥','닭볶음탕','갈비찜','오야코동'];
    var styles=[{id:'한식',e:'🍚'},{id:'일식',e:'🍱'},{id:'중식',e:'🥢'},{id:'🇹🇭 태국',e:'🇹🇭'},{id:'🇻🇳 베트남',e:'🇻🇳'},{id:'🇮🇩 인도네시아',e:'🇮🇩'},{id:'🇲🇾 말레이시아',e:'🇲🇾'},{id:'🇸🇬 싱가포르',e:'🇸🇬'},{id:'🇵🇭 필리핀',e:'🇵🇭'},{id:'🇮🇳 인도',e:'🇮🇳'},{id:'🇲🇽 멕시코',e:'🇲🇽'},{id:'🇹🇷 터키',e:'🇹🇷'}];
    var done=isB?(safeArr(S.bcStyles).length?1:0):(safeArr(S.bcMenus).length?1:0);
    var title=isB?'스타일로 메뉴 추천':'먹고 싶은 메뉴로 짜기';
    var tone=isB?'orange':'pink';
    var body=isB?('<div class="wm-flow-chip-wrap">'+styles.map(function(st){var on=safeArr(S.bcStyles).indexOf(st.id)>=0;return chip(st.e+' '+flowDisplayName(st.id)+(on?' ✓':''),on?'active':'','toggleBCStyle(\''+st.id+'\')');}).join('')+'</div>'):
      ('<div style="position:relative"><div style="display:flex;gap:8px;margin-bottom:10px"><input id="c-inp" class="inp" placeholder="예: 삼겹살, 된장찌개..." style="flex:1" onkeydown="if(event.key===\'Enter\'){addCMenu();}" oninput="showAutoComplete(this.value)" autocomplete="off"><button onclick="addCMenu()" class="wm-flow-mini-btn" style="border-radius:15px;padding:0 16px">추가</button></div><div id="ac-drop" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border-radius:18px;box-shadow:0 14px 38px rgba(15,23,42,.16);z-index:100;overflow:hidden;max-height:240px;overflow-y:auto"></div></div>'+
      (safeArr(S.bcMenus).length?'<div class="wm-flow-chip-wrap" style="margin-top:8px">'+safeArr(S.bcMenus).map(function(m,i){return chip(m+' ✕','pink','S.bcMenus.splice('+i+',1);render()');}).join('')+'</div>':'<div class="wm-flow-empty">메뉴를 입력하거나 인기 메뉴에서 선택해주세요</div>')+
      '<div class="wm-flow-chip-wrap" style="margin-top:10px">'+POPULAR.map(function(m){var on=safeArr(S.bcMenus).includes(m);return chip((on?'✓ ':'')+m,on?'pink':'','toggleCMenu(\''+m+'\')');}).join('')+'</div>');
    return '<div class="wm-flow-page">'+flowHeader({kicker:isB?'B FLOW · STYLE':'C FLOW · MENU',title:title,sub:isB?'스타일을 선택하면 추천 메뉴를 구성해요.':'먹고 싶은 메뉴를 입력하면 장보기까지 이어져요.',tone:tone,done:done,total:3,heroTitle:isB?(safeArr(S.bcStyles).length?safeArr(S.bcStyles).map(flowDisplayName).join(' + '):'스타일 선택'):(safeArr(S.bcMenus).length+'개 메뉴 선택'),heroSub:isB?'추천 → 장보기 → 식단 생성':'메뉴 입력 → 재료 분석 → 식단 생성',icon:isB?'🤔':'🍖',status:done?'입력 완료':'입력 필요',back:'go(\'home\')',backText:'← 홈'})+'<div class="wm-flow-grid">'+stat('인원',S.people+'인')+stat(isB?'스타일':'메뉴',isB?safeArr(S.bcStyles).length+'개':safeArr(S.bcMenus).length+'개')+stat('식단',max+'끼')+'</div>'+section('👥','인원수','식재료 수량 계산 기준',pill(S.people+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){return chip(n+'인',S.people===n?'active':'','S.people='+n+';render()');}).join('')+'</div>')+section(isB?'🌍':'🍽️',isB?'음식 스타일 선택':'메뉴 입력',isB?'복수 선택 가능':'최대 '+max+'개 선택',pill(done?'입력됨':'필요',done?'done':'wait'),body)+'</div><div class="wm-flow-cta">'+(isB?'<button class="btn-o" '+(!safeArr(S.bcStyles).length?'disabled':'')+' onclick="genBSuggest()">🍽️ 메뉴 추천 받기</button>':'<button class="btn-p" '+(!safeArr(S.bcMenus).length?'disabled':'')+' onclick="genBCCart()">🛒 재료 분석하기</button>')+'</div>';
  };
  window.rBSuggest = rBSuggest = function(){
    var menus=safeArr(S.bcSuggested); var sel=menus.filter(function(m){return m.selected;}).length; var max=totalMeals();
    var list=menus.length?menus.map(function(m,i){var nut=calcNutrition(m.name,1);var seasonal=getSeasonalScore(m.name)>0;var on=!!m.selected;return '<div class="wm-flow-menu-card '+(on?'active':'')+'" onclick="(function(){var cur=S.bcSuggested['+i+'].selected;var cnt=S.bcSuggested.filter(function(m){return m.selected}).length;if(!cur&&cnt>='+max+')return;S.bcSuggested['+i+'].selected=!cur;render();})()"><div class="wm-flow-check '+(on?'active':'')+'">'+(on?'✓':'')+'</div><div class="wm-flow-row-icon">'+(m.type==='아침'?'🌅':m.type==='저녁'?'🌙':'☀️')+'</div><div class="wm-flow-row-main"><b>'+m.name+(seasonal?' <span style="font-size:9px;background:#10B981;color:#fff;border-radius:6px;padding:1px 5px;font-weight:900">제철</span>':'')+'</b><span>'+m.type+' · '+getCookTime(m.name)+'분'+(nut?' · '+(nut.calRange||nut.cal+'kcal'):'')+'</span>'+(m.ingredients&&m.ingredients.length?'<span>'+m.ingredients.slice(0,3).join(' · ')+'</span>':'')+'</div></div>';}).join(''):'<div class="wm-flow-empty">추천 메뉴가 없어요</div>';
    return '<div class="wm-flow-page">'+flowHeader({kicker:'B FLOW · RECOMMEND',title:'추천 메뉴 선택',sub:'마음에 드는 메뉴를 골라 장보기 목록을 만들어요.',tone:'orange',done:sel?2:1,total:3,heroTitle:sel+'개 선택됨',heroSub:'최대 '+max+'개까지 선택 가능해요.',icon:'🍽️',status:sel?'메뉴 선택 중':'메뉴 선택 필요',back:'go(\'bc-entry\')',backText:'← 이전'})+'<div class="wm-flow-grid">'+stat('추천',menus.length+'개')+stat('선택',sel+'개')+stat('최대',max+'개')+'</div>'+section('🍽️','추천 메뉴','선택한 메뉴 기준으로 장보기 목록을 만들어요',pill(sel?'선택됨':'필요',sel?'done':'wait'),'<div class="wm-flow-list">'+list+'</div>')+'</div><div class="wm-flow-cta"><div style="font-size:12px;color:#8B95A1;text-align:center;margin-bottom:8px;font-weight:750">'+(sel===0?'메뉴를 선택해주세요':(sel<max?(max-sel)+'개 더 선택 가능':'선택 완료'))+'</div><button class="btn-o" '+(!sel?'disabled':'')+' onclick="S.bcMenus=S.bcSuggested.filter(function(m){return m.selected}).map(function(m){return m.name});genBCCart()">🛒 재료 분석하기 ('+sel+'개)</button></div>';
  };
  window.WM_SPRINT6A_FLOW_WORKSPACE_UNIFICATION={applied:true,scope:'A/B/C flow screens',mode:'wizard-like step UI replaced with tab-consistent workspace UI'};
})();
/* ===== /sprint6a-flow-workspace-runtime ===== */


/* ===== sprint6b-flow-input-restore-runtime ===== */
(function(){
  function arr(v){return Array.isArray(v)?v:[];}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function normStyle(v){try{return typeof normalizeStyleChoiceV9==='function'?normalizeStyleChoiceV9(v):(typeof normalizeStyleChoiceV8==='function'?normalizeStyleChoiceV8(v):String(v||''));}catch(e){return String(v||'');}}
  function displayStyle(v){
    var s=normStyle(v);
    if(typeof bcStyleDisplayName==='function'){try{return bcStyleDisplayName(s);}catch(e){}}
    return String(s||'').replace(/^\p{Regional_Indicator}\p{Regional_Indicator}\s*/u,'').replace(/^🌙\s*/,'').trim();
  }
  function selectedStyles(){ if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8(); return arr(S.bcStyles).map(normStyle).filter(Boolean); }
  function selectedStyleText(){var sel=selectedStyles();return sel.length?sel.map(displayStyle).join(' · '):'아직 선택되지 않았어요';}
  function head(kicker,title,sub){return '<div class="wm-flow-simple-head"><div><div class="wm-flow-simple-kicker">'+kicker+'</div><div class="wm-flow-simple-title">'+title+'</div><div class="wm-flow-simple-sub">'+sub+'</div></div><button class="wm-flow-simple-back" onclick="go(\'home\')">← 홈</button></div>';}
  function pill(txt,cls){return '<span class="wm-flow-simple-pill '+(cls||'')+'">'+txt+'</span>';}
  function card(icon,title,sub,p,body){return '<div class="wm-flow-simple-card"><div class="wm-flow-simple-card-head"><div class="wm-flow-simple-card-title"><div class="wm-flow-simple-icon">'+icon+'</div><div><b>'+title+'</b><span>'+sub+'</span></div></div>'+p+'</div><div class="wm-flow-simple-body">'+body+'</div></div>';}
  function chip(txt,cls,onclick){return '<button type="button" class="wm-flow-chip '+(cls||'')+'" '+(onclick?'onclick="'+onclick+'"':'')+'>'+txt+'</button>';}
  function styleChip(id){var n=normStyle(id);var on=selectedStyles().indexOf(n)>=0;return chip((on?'✓ ':'')+esc(displayStyle(n)),on?'active':'','toggleStyle(\''+esc(n).replace(/'/g,"\'")+'\')');}
  function selectedStyleChips(){var sel=selectedStyles();return sel.length?'<div class="wm-flow-chip-wrap">'+sel.map(function(s,i){return chip(esc(displayStyle(s))+' ✕','active','removeStyle(\''+esc(s).replace(/'/g,"\'")+'\')');}).join('')+'</div>':'<div class="wm-flow-empty">스타일을 선택하면 추천 메뉴 풀이 바뀝니다.</div>';}

  window.toggleBCStyle=function(id){ if(typeof toggleStyle==='function') return toggleStyle(id); id=normStyle(id); if(!S.bcStyles)S.bcStyles=[]; var i=S.bcStyles.indexOf(id); if(i>=0)S.bcStyles.splice(i,1); else S.bcStyles.push(id); render(); };

  var QUICK_STYLES=['한식','일식','중식','헬시','🇹🇭 태국','🇻🇳 베트남','🇮🇩 인도네시아','🇲🇾 말레이시아','🇸🇬 싱가포르','🇵🇭 필리핀','🇰🇭 캄보디아','🇲🇲 미얀마','🇹🇼 대만','🇮🇳 인도','🌙 중동','🇹🇷 터키','🇬🇷 그리스','🇪🇸 스페인','🇫🇷 프랑스','🇮🇹 이탈리아','🇩🇪 독일','🇵🇹 포르투갈','🇷🇺 러시아','🇵🇱 폴란드','🇸🇪 스웨덴','🇨🇿 체코','🇲🇽 멕시코','🇺🇸 미국','🇦🇷 아르헨티나','🇧🇷 브라질','🇵🇪 페루','🇨🇴 콜롬비아','🇯🇲 자메이카','🇲🇦 모로코','🇪🇹 에티오피아','🇳🇬 나이지리아','🇹🇳 튀니지'];
  function stylePickerBody(){
    return '<button class="wm-flow-style-open" onclick="openStyleDrop()"><span>🌍 국가/스타일 드롭다운으로 선택</span><span>›</span></button>'+
      selectedStyleChips()+
      '<div style="height:10px"></div><div style="font-size:11px;color:#98A2B3;font-weight:850;letter-spacing:1px;margin:4px 0 8px">빠른 선택</div><div class="wm-flow-chip-wrap">'+QUICK_STYLES.map(styleChip).join('')+'</div>';
  }

  window.rAStyle=function(){
    var sel=selectedStyles();
    return '<div class="wm-flow-simple-page">'+head('A FLOW · STYLE','식사 스타일 선택','냉장고 재료를 어떤 음식 스타일로 만들지 선택하세요.')+
      card('🌍','스타일 선택',selectedStyleText(),pill(sel.length?sel.length+'개 선택':'필요',sel.length?'done':'wait'),stylePickerBody())+
      '</div><div class="wm-flow-cta"><button class="btn-p" '+(!sel.length?'disabled':'')+' onclick="genAMeal()">✨ AI 식단 생성</button></div>';
  };

  window.rBCEntry=function(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    var isB=S.bcMode==='b';
    var max=(typeof totalMeals==='function'?totalMeals():14);
    if(isB){
      var sel=selectedStyles();
      return '<div class="wm-flow-simple-page">'+head('B FLOW · STYLE','음식 스타일로 추천받기','국가/스타일을 먼저 고르면 메뉴 추천으로 이어져요.')+
        card('🌍','국가/스타일 선택',selectedStyleText(),pill(sel.length?sel.length+'개 선택':'필요',sel.length?'done':'wait'),stylePickerBody())+
        card('👥','인원수','식재료 수량 계산 기준',pill((S.people||1)+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){return chip(n+'인',(S.people||1)===n?'active':'','S.people='+n+';render()');}).join('')+'</div>')+
        '</div><div class="wm-flow-cta"><button class="btn-o" '+(!sel.length?'disabled':'')+' onclick="genBSuggest()">🍽️ 메뉴 추천 받기</button></div>';
    }
    var menus=arr(S.bcMenus); var popular=['삼겹살구이','차돌된장찌개','김치찌개','비빔밥','제육볶음','불고기','카레라이스','짜장면','파스타','스테이크','라멘','볶음밥','닭볶음탕','갈비찜','오야코동'];
    var input='<div class="wm-flow-direct-input"><input id="c-inp" class="inp" placeholder="예: 차돌된장찌개" onkeydown="if(event.key===\'Enter\'){addCMenu();}" oninput="showAutoComplete(this.value)" autocomplete="off"><button onclick="addCMenu()" class="wm-flow-add-btn">추가</button><div id="ac-drop" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border-radius:18px;box-shadow:0 14px 38px rgba(15,23,42,.16);z-index:100;overflow:hidden;max-height:240px;overflow-y:auto"></div></div>'+
      (menus.length?'<div class="wm-flow-chip-wrap">'+menus.map(function(m,i){return chip(esc(m)+' ✕','pink','S.bcMenus.splice('+i+',1);render()');}).join('')+'</div>':'<div class="wm-flow-empty">메뉴를 바로 입력하세요. 단계 안내 화면 없이 바로 재료 분석으로 이어집니다.</div>')+
      '<div style="height:10px"></div><div style="font-size:11px;color:#98A2B3;font-weight:850;letter-spacing:1px;margin:4px 0 8px">인기 메뉴</div><div class="wm-flow-chip-wrap">'+popular.map(function(m){var on=menus.indexOf(m)>=0;return chip((on?'✓ ':'')+m,on?'pink':'','toggleCMenu(\''+m+'\')');}).join('')+'</div>';
    return '<div class="wm-flow-simple-page">'+head('C FLOW · MENU','먹고 싶은 메뉴가 있어요','메뉴를 입력하면 바로 재료 분석과 장보기 목록으로 이어져요.')+
      card('🍽️','메뉴 입력','최대 '+max+'개 선택',pill(menus.length?menus.length+'개 입력':'필요',menus.length?'done':'wait'),input)+
      card('👥','인원수','장보기 수량 계산 기준',pill((S.people||1)+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){return chip(n+'인',(S.people||1)===n?'active':'','S.people='+n+';render()');}).join('')+'</div>')+
      '</div><div class="wm-flow-cta"><button class="btn-p" '+(!menus.length?'disabled':'')+' onclick="genBCCart()">🛒 재료 분석 & 장보기 생성</button></div>';
  };

  window.WM_SPRINT6B_FLOW_INPUT_RESTORE={applied:true,fixes:['B flow style selection restored','full country/style dropdown restored','C flow step-start screen removed']};
})();
/* ===== /sprint6b-flow-input-restore-runtime ===== */


/* ===== sprint6c-bc-input-cleanup-runtime ===== */
(function(){
  function arr(v){return Array.isArray(v)?v:[];}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function normStyle(v){try{return typeof normalizeStyleChoiceV9==='function'?normalizeStyleChoiceV9(v):(typeof normalizeStyleChoiceV8==='function'?normalizeStyleChoiceV8(v):String(v||''));}catch(e){return String(v||'');}}
  function displayStyle(v){
    var s=normStyle(v);
    if(typeof bcStyleDisplayName==='function'){try{return bcStyleDisplayName(s);}catch(e){}}
    return String(s||'').replace(/^\p{Regional_Indicator}\p{Regional_Indicator}\s*/u,'').replace(/^🌙\s*/,'').trim();
  }
  function selectedStyles(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    return arr(S.bcStyles).map(normStyle).filter(Boolean);
  }
  function selectedStyleText(){var sel=selectedStyles();return sel.length?sel.map(displayStyle).join(' · '):'아직 선택되지 않았어요';}
  function head(kicker,title,sub){return '<div class="wm-flow-simple-head"><div><div class="wm-flow-simple-kicker">'+kicker+'</div><div class="wm-flow-simple-title">'+title+'</div><div class="wm-flow-simple-sub">'+sub+'</div></div><button class="wm-flow-simple-back" onclick="go(\'home\')">← 홈</button></div>';}
  function pill(txt,cls){return '<span class="wm-flow-simple-pill '+(cls||'')+'">'+txt+'</span>';}
  function card(icon,title,sub,p,body){return '<div class="wm-flow-simple-card"><div class="wm-flow-simple-card-head"><div class="wm-flow-simple-card-title"><div class="wm-flow-simple-icon">'+icon+'</div><div><b>'+title+'</b><span>'+sub+'</span></div></div>'+p+'</div><div class="wm-flow-simple-body">'+body+'</div></div>';}
  function chip(txt,cls,onclick){return '<button type="button" class="wm-flow-chip '+(cls||'')+'" '+(onclick?'onclick="'+onclick+'"':'')+'>'+txt+'</button>';}
  function selectedStyleChips(){
    var sel=selectedStyles();
    if(!sel.length) return '<div class="wm-flow-empty">드롭다운에서 국가/스타일을 선택해주세요.</div>';
    return '<div class="wm-flow-selected-wrap"><div class="wm-flow-selected-label">선택된 스타일</div>'+sel.map(function(s){return chip(esc(displayStyle(s))+' ✕','active','removeStyle(\''+esc(s).replace(/'/g,"\'")+'\')');}).join('')+'</div>';
  }
  function stylePickerBody(){
    return '<button class="wm-flow-style-open only" onclick="openStyleDrop()"><span>🌍 국가/스타일 드롭다운으로 선택</span><span>›</span></button>'+selectedStyleChips();
  }
  function selectedMenuChips(){
    var menus=arr(S.bcMenus);
    if(!menus.length) return '<div class="wm-flow-no-popular-note">먹고 싶은 메뉴를 입력한 뒤 추가를 눌러주세요. 선택된 메뉴는 여기에 가로 칩으로 남습니다.</div>';
    return '<div class="wm-flow-selected-wrap"><div class="wm-flow-selected-label">선택된 메뉴</div>'+menus.map(function(m,i){return chip(esc(m)+' ✕','pink','S.bcMenus.splice('+i+',1);render()');}).join('')+'</div>';
  }

  window.addCMenu=function(){
    var i=document.getElementById('c-inp'); if(!i) return;
    var v=String(i.value||'').trim();
    if(v && !arr(S.bcMenus).includes(v) && arr(S.bcMenus).length < (typeof totalMeals==='function'?totalMeals():14)){
      if(!Array.isArray(S.bcMenus)) S.bcMenus=[];
      S.bcMenus.push(v);
    }
    i.value='';
    var ac=document.getElementById('ac-drop'); if(ac){ac.style.display='none';ac.innerHTML='';}
    render();
  };
  window.toggleCMenu=function(m){
    if(!Array.isArray(S.bcMenus)) S.bcMenus=[];
    var i=S.bcMenus.indexOf(m);
    if(i>=0) S.bcMenus.splice(i,1); else if(S.bcMenus.length < (typeof totalMeals==='function'?totalMeals():14)) S.bcMenus.push(m);
    var ac=document.getElementById('ac-drop'); if(ac){ac.style.display='none';ac.innerHTML='';}
    render();
  };
  window.showAutoComplete=function(){var ac=document.getElementById('ac-drop'); if(ac){ac.style.display='none';ac.innerHTML='';}};

  window.rBCEntry=function(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    var isB=S.bcMode==='b';
    var max=(typeof totalMeals==='function'?totalMeals():14);
    if(isB){
      var sel=selectedStyles();
      return '<div class="wm-flow-simple-page">'+head('B FLOW · STYLE','음식 스타일로 추천받기','드롭다운에서 국가/스타일을 선택하면 메뉴 추천으로 이어져요.')+
        card('🌍','국가/스타일 선택',selectedStyleText(),pill(sel.length?sel.length+'개 선택':'필요',sel.length?'done':'wait'),stylePickerBody())+
        card('👥','인원수','식재료 수량 계산 기준',pill((S.people||1)+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){return chip(n+'인',(S.people||1)===n?'active':'','S.people='+n+';render()');}).join('')+'</div>')+
        '</div><div class="wm-flow-cta"><button class="btn-o" '+(!sel.length?'disabled':'')+' onclick="genBSuggest()">🍽️ 메뉴 추천 받기</button></div>';
    }
    var menus=arr(S.bcMenus);
    var input='<div class="wm-flow-direct-input"><input id="c-inp" class="inp" placeholder="예: 차돌된장찌개" onkeydown="if(event.key===\'Enter\'){addCMenu();}" autocomplete="off"><button onclick="addCMenu()" class="wm-flow-add-btn">추가</button><div id="ac-drop" style="display:none"></div></div>'+selectedMenuChips();
    return '<div class="wm-flow-simple-page">'+head('C FLOW · MENU','먹고 싶은 메뉴가 있어요','메뉴를 입력하면 바로 재료 분석과 장보기 목록으로 이어져요.')+
      card('🍽️','메뉴 입력','최대 '+max+'개 선택',pill(menus.length?menus.length+'개 입력':'필요',menus.length?'done':'wait'),input)+
      card('👥','인원수','장보기 수량 계산 기준',pill((S.people||1)+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){return chip(n+'인',(S.people||1)===n?'active':'','S.people='+n+';render()');}).join('')+'</div>')+
      '</div><div class="wm-flow-cta"><button class="btn-p" '+(!menus.length?'disabled':'')+' onclick="genBCCart()">🛒 재료 분석 & 장보기 생성</button></div>';
  };
  window.WM_SPRINT6C_BC_INPUT_CLEANUP={applied:true,base:'Sprint6B',changes:['B quick chips removed; dropdown only','B selected styles remain as chips','C popular menu chips removed','C selected menus remain as horizontal chips','B/C entry stays direct without deleting legacy route screens']};
})();
/* ===== /sprint6c-bc-input-cleanup-runtime ===== */


/* ===== sprint6d-abc-flow-entry-unification-runtime ===== */
(function(){
  function arr(v){return Array.isArray(v)?v:[];}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function normStyle(v){
    try{
      return typeof normalizeStyleChoiceV9==='function'
        ? normalizeStyleChoiceV9(v)
        : (typeof normalizeStyleChoiceV8==='function'?normalizeStyleChoiceV8(v):String(v||''));
    }catch(e){return String(v||'');}
  }
  function displayStyle(v){
    var s=normStyle(v);
    if(typeof bcStyleDisplayName==='function'){try{return bcStyleDisplayName(s);}catch(e){}}
    return String(s||'').replace(/^\p{Regional_Indicator}\p{Regional_Indicator}\s*/u,'').replace(/^🌙\s*/,'').trim();
  }
  function selectedStyles(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    return arr(S.bcStyles).map(normStyle).filter(Boolean);
  }
  function selectedStyleText(){
    var sel=selectedStyles();
    return sel.length?sel.map(displayStyle).join(' · '):'아직 선택되지 않았어요';
  }
  function head(kicker,title,sub){
    return '<div class="wm-flow-simple-head"><div><div class="wm-flow-simple-kicker">'+kicker+'</div><div class="wm-flow-simple-title">'+title+'</div><div class="wm-flow-simple-sub">'+sub+'</div></div><button class="wm-flow-simple-back" onclick="setFlow(null);go(\'home\')">← 홈</button></div>';
  }
  function pill(txt,cls){return '<span class="wm-flow-simple-pill '+(cls||'')+'">'+txt+'</span>';}
  function card(icon,title,sub,p,body){
    return '<div class="wm-flow-simple-card"><div class="wm-flow-simple-card-head"><div class="wm-flow-simple-card-title"><div class="wm-flow-simple-icon">'+icon+'</div><div><b>'+title+'</b><span>'+sub+'</span></div></div>'+p+'</div><div class="wm-flow-simple-body">'+body+'</div></div>';
  }
  function chip(txt,cls,onclick){
    return '<button type="button" class="wm-flow-chip '+(cls||'')+'" '+(onclick?'onclick="'+onclick+'"':'')+'>'+txt+'</button>';
  }
  function selectedStyleChips(){
    var sel=selectedStyles();
    if(!sel.length) return '<div class="wm-flow-empty">드롭다운에서 국가/스타일을 선택해주세요.</div>';
    return '<div class="wm-flow-selected-wrap"><div class="wm-flow-selected-label">선택된 스타일</div>'+sel.map(function(s){
      return chip(esc(displayStyle(s))+' ✕','active','removeStyle(\''+esc(s).replace(/'/g,"\'")+'\')');
    }).join('')+'</div>';
  }
  function stylePickerBody(){
    return '<button class="wm-flow-style-open only" onclick="openStyleDrop()"><span>🌍 국가/스타일 드롭다운으로 선택</span><span>›</span></button>'+selectedStyleChips();
  }
  function peopleCard(label){
    return card('👥','인원수',label||'식재료 수량 계산 기준',pill((S.people||1)+'인','done'),'<div class="wm-flow-chip-wrap">'+[1,2,3,4].map(function(n){
      return chip(n+'인',(S.people||1)===n?'active':'','S.people='+n+';render()');
    }).join('')+'</div>');
  }
  function selectedMenuChips(){
    var menus=arr(S.bcMenus);
    if(!menus.length) return '<div class="wm-flow-no-popular-note">먹고 싶은 메뉴를 입력한 뒤 추가를 눌러주세요. 선택된 메뉴는 여기에 가로 칩으로 남습니다.</div>';
    return '<div class="wm-flow-selected-wrap"><div class="wm-flow-selected-label">선택된 메뉴</div>'+menus.map(function(m,i){
      return chip(esc(m)+' ✕','pink','S.bcMenus.splice('+i+',1);render()');
    }).join('')+'</div>';
  }
  window.addCMenu=function(){
    var i=document.getElementById('c-inp'); if(!i) return;
    var v=String(i.value||'').trim();
    if(v && !arr(S.bcMenus).includes(v) && arr(S.bcMenus).length < (typeof totalMeals==='function'?totalMeals():14)){
      if(!Array.isArray(S.bcMenus)) S.bcMenus=[];
      S.bcMenus.push(v);
    }
    i.value='';
    var ac=document.getElementById('ac-drop'); if(ac){ac.style.display='none';ac.innerHTML='';}
    render();
  };
  window.showAutoComplete=function(){
    var ac=document.getElementById('ac-drop'); if(ac){ac.style.display='none';ac.innerHTML='';}
  };

  window.rBCEntry=function(){
    if(typeof normalizeBCStylesV8==='function') normalizeBCStylesV8();
    var isB=S.bcMode==='b';
    var max=(typeof totalMeals==='function'?totalMeals():14);
    if(isB){
      var sel=selectedStyles();
      return '<div class="wm-flow-simple-page">'+
        head('B FLOW · STYLE','음식 스타일로 추천받기','드롭다운에서 국가/스타일을 선택하면 메뉴 추천으로 이어져요.')+
        card('🌍','국가/스타일 선택',selectedStyleText(),pill(sel.length?sel.length+'개 선택':'필요',sel.length?'done':'wait'),stylePickerBody())+
        peopleCard('식재료 수량 계산 기준')+
        '</div><div class="wm-flow-cta"><button class="btn-o" '+(!sel.length?'disabled':'')+' onclick="genBSuggest()">🍽️ 메뉴 추천 받기</button></div>';
    }
    var menus=arr(S.bcMenus);
    var input='<div class="wm-flow-direct-input"><input id="c-inp" class="inp" placeholder="예: 차돌된장찌개" onkeydown="if(event.key===\'Enter\'){addCMenu();}" autocomplete="off"><button onclick="addCMenu()" class="wm-flow-add-btn">추가</button><div id="ac-drop" style="display:none"></div></div>'+selectedMenuChips();
    return '<div class="wm-flow-simple-page">'+
      head('C FLOW · MENU','먹고 싶은 메뉴가 있어요','메뉴를 입력하면 바로 재료 분석과 장보기 목록으로 이어져요.')+
      card('🍽️','메뉴 입력','최대 '+max+'개 선택',pill(menus.length?menus.length+'개 입력':'필요',menus.length?'done':'wait'),input)+
      peopleCard('장보기 수량 계산 기준')+
      '</div><div class="wm-flow-cta"><button class="btn-p" '+(!menus.length?'disabled':'')+' onclick="genBCCart()">🛒 재료 분석 & 장보기 생성</button></div>';
  };

  window.rHomeB=function(){
    S.bcMode='b';
    return rBCEntry();
  };
  window.rHomeC=function(){
    S.bcMode='c';
    return rBCEntry();
  };
  window.rHomeA=function(){
    var fr=arr(S.fridge);
    var sel=selectedStyles();
    var frBody='<button class="wm-flow-card-action" onclick="go(\'a-fridge\')"><span>🥕 냉장고 재료 확인/수정</span><span>›</span></button>';
    if(fr.length){
      frBody+='<div class="wm-flow-selected-wrap"><div class="wm-flow-selected-label">입력된 재료</div>'+fr.slice(0,12).map(function(it){
        var name=esc(it.name||it.ingredient||it.title||'재료');
        return '<span class="wm-flow-mini-chip green">'+(typeof getIcon==='function'?getIcon(name):'🥬')+' '+name+'</span>';
      }).join('')+(fr.length>12?'<span class="wm-flow-mini-chip">+'+(fr.length-12)+'개</span>':'')+'</div>';
    }else{
      frBody+='<div class="wm-flow-empty">냉장고 재료를 먼저 입력해주세요.</div>';
    }
    return '<div class="wm-flow-simple-page">'+
      head('A FLOW · FRIDGE','냉장고 재료로 식단 만들기','입력된 재료와 음식 스타일을 바탕으로 식단을 만들어요.')+
      card('🥕','냉장고 재료',fr.length?fr.length+'가지 재료 입력됨':'재료 입력 필요',pill(fr.length?fr.length+'개':'필요',fr.length?'done':'wait'),frBody)+
      card('🌍','국가/스타일 선택',selectedStyleText(),pill(sel.length?sel.length+'개 선택':'필요',sel.length?'done':'wait'),stylePickerBody())+
      peopleCard('식재료 수량 계산 기준')+
      '</div><div class="wm-flow-cta"><button class="btn-p" '+(!fr.length||!sel.length?'disabled':'')+' onclick="genAMeal()">✨ AI 식단 생성</button></div>';
  };

  window.WM_SPRINT6D_ABC_FLOW_ENTRY_UNIFICATION={applied:true,scope:'A/B/C activeFlow entry screens',changes:['A/B/C home flow entry now uses the same direct input workspace','legacy 1-2-3-4 step cards bypassed','B/C retain dropdown/menu input behavior','home back clears activeFlow']};
})();
/* ===== /sprint6d-abc-flow-entry-unification-runtime ===== */


/* ===== sprint7a-flow-logic-reorder-runtime ===== */
(function(){
  function a(v){return Array.isArray(v)?v:[];}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function scheduleCount(){try{return Object.values(S.schedule||{}).reduce(function(n,x){return n+(Array.isArray(x)?x.length:0)},0)}catch(e){return 0}}
  function plannedCount(){return Math.max(0,scheduleCount()*(S.planDuration||1));}
  function openCart(){go(a(S.cart).length?'bc-cart':'tab-cart')}
  window.wm7DebugState=function(){
    var issues=[];
    try{
      if(!S || typeof S!=='object') return ['S missing'];
      ['fridge','cart','bcStyles','bcMenus','bcSuggested'].forEach(function(k){if(!Array.isArray(S[k])){S[k]=[];issues.push(k+' repaired to []');}});
      if(!S.schedule || typeof S.schedule!=='object'){S.schedule={};issues.push('schedule repaired');}
      if(typeof ensureScheduleReady==='function') ensureScheduleReady();
      S.cart=S.cart.filter(function(i){return i && (i.name||i.replaceName||i.ingredient||i.title);}).map(function(i){
        if(!i.name && (i.replaceName||i.ingredient||i.title)) i.name=i.replaceName||i.ingredient||i.title;
        if(i.checked==null) i.checked=false;
        if(!i.category) i.category='기타';
        return i;
      });
      S.fridge=S.fridge.filter(function(i){return i && (i.name||i.ingredient||i.title);}).map(function(i){if(!i.name)i.name=i.ingredient||i.title; return i;});
      if(S.activeFlow && !['a','b','c'].includes(S.activeFlow)){S.activeFlow=null;localStorage.removeItem('wm_flow');issues.push('activeFlow cleared');}
    }catch(e){issues.push('debug error: '+(e.message||e));}
    if(issues.length) console.warn('[WeeklyMeal Sprint7A debug]',issues);
    return issues;
  };
  var oldRender=window.render;
  if(typeof oldRender==='function' && !oldRender.__wm7){
    var wrapped=function(){try{wm7DebugState();}catch(e){} return oldRender.apply(this,arguments);};
    wrapped.__wm7=true; window.render=wrapped;
  }
  window.startMealFlow=function(flow){
    wm7DebugState();
    setFlow(flow);
    if(flow==='a'){S.bcMode='a'; if(!Array.isArray(S.bcStyles))S.bcStyles=[]; go('home'); return;}
    if(flow==='b'){S.bcMode='b'; if(!Array.isArray(S.bcStyles))S.bcStyles=[]; if(!Array.isArray(S.bcSuggested))S.bcSuggested=[]; go('bc-entry'); return;}
    if(flow==='c'){S.bcMode='c'; if(!Array.isArray(S.bcMenus))S.bcMenus=[]; go('bc-entry'); return;}
  };
  var oldStartBC=window.startBC;
  window.startBC=function(mode){ startMealFlow(mode==='c'?'c':'b'); };
  window.wm7Step=function(num,title,sub,state,action,tag){
    return '<button class="wm7-step '+(state||'')+'" onclick="'+(action||'')+'"><div class="wm7-num">'+(state==='done'?'✓':num)+'</div><div class="wm7-main"><b>'+title+'</b><span>'+sub+'</span></div><div class="wm7-tag '+(state==='done'?'done':state==='live'?'live':state==='warn'?'warn':'')+'">'+tag+'</div></button>';
  };
  window.wm7CurrentStage=function(){
    if(!localStorage.getItem('wm_schedule_set') || scheduleCount()===0) return 1;
    if(!S.activeFlow && !S.mealPlan && !a(S.cart).length) return 2;
    if(a(S.cart).length && !S.cartDone && !S.mealPlan) return 3;
    if(a(S.cart).length && S.cartDone && !S.mealPlan) return 4;
    if(S.mealPlan) return 6;
    return 2;
  };
  window.wm7FlowLine=function(){
    var st=wm7CurrentStage();
    var cartLeft=a(S.cart).filter(function(i){return !i.checked}).length;
    var fridgeCount=a(S.fridge).length;
    return '<div class="wm7-flowline">'+
      wm7Step(1,'식사 스케줄 설정',plannedCount()+'끼 예정 · '+(S.people||1)+'인분 기준',st>1?'done':st===1?'live':'off',"go('schedule')",st>1?'완료':'설정')+
      wm7Step(2,'식단 플로우 설정','A 냉장고 · B 추천 · C 직접 선택',st>2?'done':st===2?'live':'off',"go('home')",S.activeFlow?String(S.activeFlow).toUpperCase():'선택')+
      wm7Step(3,'장바구니','이번 식단에 필요한 임시 재료 목록',st>3?'done':st===3?'live':'off','openCart()',a(S.cart).length?cartLeft+'개':'RAM')+
      wm7Step(4,'냉장고','구매/보유 재료가 저장되는 영구 공간',st>4?'done':st===4?'live':'off',"go('tab-fridge')",fridgeCount+'개')+
      wm7Step(5,'식단 생성','스케줄 + 플로우 + 장바구니 + 냉장고 반영',S.mealPlan?'done':st===5?'live':'off',S.mealPlan?"go('tab-meal')":"openCart()",S.mealPlan?'완료':'생성')+
      wm7Step(6,'식단 → 일기','생성된 식단을 실제 섭취 기록으로 남김',S.mealPlan?'live':'off',"go('tab-diary')",S.mealPlan?'기록':'로그')+
    '</div>';
  };
  window.rHome=function(){
    wm7DebugState();
    if(S.activeFlow==='a') return rHomeA();
    if(S.activeFlow==='b') return rHomeB();
    if(S.activeFlow==='c') return rHomeC();
    var hasMeal=!!S.mealPlan;
    var cart=a(S.cart), fridge=a(S.fridge);
    var cartLeft=cart.filter(function(i){return !i.checked}).length;
    return '<div class="wm7-page">'+
      '<div><div class="wm7-kicker">WEEKLY MEAL</div></div>'+
      '<div class="wm7-hero"><b>'+ (hasMeal?'이번 주 식단 준비 완료':'다음 식단 준비 상태') +'</b><strong>'+(hasMeal?'완료':plannedCount()+'끼')+'</strong><span>냉장고 '+fridge.length+'개 · 장바구니 '+cart.length+'개 · '+(S.people||1)+'인분</span></div>'+
      wm7FlowLine()+
      (!hasMeal?'<div class="wm7-section-title">2. 식단 플로우 설정</div><div class="wm7-flow-choice">'+
        '<button class="wm7-choice" onclick="startMealFlow(\'a\')"><i>🥕</i><b>냉장고<br>활용</b><span>저장된 재료로 먼저 계산</span></button>'+
        '<button class="wm7-choice" onclick="startMealFlow(\'b\')"><i>✨</i><b>추천<br>받기</b><span>스타일 기반 메뉴 추천</span></button>'+
        '<button class="wm7-choice" onclick="startMealFlow(\'c\')"><i>🍽️</i><b>직접<br>선택</b><span>먹고 싶은 메뉴 입력</span></button></div>':'')+
      (hasMeal?'<div class="wm7-duo"><button class="wm7-primary" onclick="go(\'tab-meal\')">📅 이번 주 식단 보기</button><button class="wm7-secondary" onclick="go(\'tab-diary\')">📔 식단 일기</button></div><div style="height:10px"></div><button class="wm7-secondary" onclick="confirmNewPlan()">🔄 새 식단 다시 짜기</button>':'')+
      (cart.length?'<div class="wm7-section-title">3. 장바구니 RAM</div><div class="wm7-card"><div class="wm7-row"><div><b>현재 장바구니</b><br><span>'+cartLeft+'개 남음 · 냉장고 반영 전 임시 목록</span></div><button class="wm7-secondary" style="width:auto;padding:0 16px" onclick="openCart()">열기</button></div></div>':'')+
      '<div class="wm7-section-title">저장소</div><div class="wm7-duo"><button class="wm7-secondary" onclick="go(\'schedule\')">⚙️ 스케줄</button><button class="wm7-secondary" onclick="go(\'tab-fridge\')">❄️ 냉장고 '+fridge.length+'</button></div>'+
    '</div>';
  };
  window.rHomeDone=function(){return rHome();};

  var oldGenA=window.genAMeal;
  window.genAMeal=function(){
    try{
      wm7DebugState();
      if(!a(S.bcStyles).length){alert('스타일을 먼저 선택해주세요');return;}
      if(!a(S.fridge).length){ if(typeof showInsufficientModal==='function') showInsufficientModal(0); else alert('냉장고 재료를 먼저 추가해주세요'); return; }
      var menus=[];
      if(typeof flowBuildMenu==='function'){
        menus=flowBuildMenu('fridge',S.bcStyles,[]);
        var best=menus.filter(function(n){try{return flowScoreMenuByFridge(n)>0}catch(e){return false}});
        menus=(best.length?best:menus).filter(function(n){return MENU_DB&&MENU_DB[n]}).slice(0,typeof totalMeals==='function'?totalMeals():14);
      }
      if(!menus.length){alert('냉장고/스타일로 만들 메뉴를 찾지 못했어요. 스타일을 바꾸거나 재료를 추가해주세요.');return;}
      S.bcMenus=menus;
      S.bcMode='a';
      if(typeof flowBuildCart==='function') flowBuildCart(menus);
      if(!a(S.cart).length && typeof getIngredientsFromDB==='function'){
        var result=getIngredientsFromDB(menus,S.people||1);
        S.cart=(result.list||[]).map(function(i){return Object.assign({},i,{checked:!!i.inFridge,replaceName:'',replaceQty:''});});
      }
      S.cartDone=false;S.fridgeAdded=false;localStorage.removeItem('wm_cart_done');
      go('bc-cart');
    }catch(e){console.error('genAMeal Sprint7A 오류:',e);alert('장바구니 생성 중 오류: '+(e.message||e));}
  };
  var oldMake=window.makeBCMealNow;
  window.makeBCMealNow=function(){
    try{
      wm7DebugState();
      var menus=a(S.bcMenus).length?S.bcMenus:(typeof _bcSelectedMenus==='function'?_bcSelectedMenus():[]);
      menus=[...new Set(menus)].filter(function(n){return MENU_DB&&MENU_DB[n]});
      if(!menus.length){alert('식단을 만들 메뉴가 없습니다. 먼저 플로우에서 메뉴를 선택해주세요.');return;}
      S.bcMenus=menus;
      if(typeof flowCreatePlan==='function' && flowCreatePlan(menus,'🧭 스케줄·장바구니·냉장고 흐름에 맞춰 식단을 생성했어요.')){
        if(typeof addUsage==='function') addUsage();
        go('bc-meal');
      }
    }catch(e){console.error('makeBCMealNow Sprint7A 오류:',e);alert('식단 생성 중 오류: '+(e.message||e));}
  };
  window.WM_SPRINT7A_FLOW_LOGIC_REORDER={applied:true,base:'Sprint6D ABC flow entry',changes:['Home dashboard reordered by schedule→flow→cart→fridge→meal→diary','Cart treated as RAM and fridge as persistent storage','A flow now creates cart first, then meal is generated from cart','Debug guard repairs broken arrays/schedule/cart items before render','Meal generation validates menu DB before creating plan']};
})();
/* ===== /sprint7a-flow-logic-reorder-runtime ===== */
