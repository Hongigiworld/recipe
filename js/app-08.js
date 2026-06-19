/* ===== inline-script-14 ===== */
/* ===== DB/UI v9: 국기 선택 UI 전면 적용 + 국가별 메뉴 풀 보강 ===== */
(function(){
  const STYLE_ALIASES={KR:'한식',KOREA:'한식',JP:'일식',JAPAN:'일식',CN:'중식',CHINA:'중식',US:'🇺🇸 미국',USA:'🇺🇸 미국',TH:'🇹🇭 태국',VN:'🇻🇳 베트남',ID:'🇮🇩 인도네시아',MY:'🇲🇾 말레이시아',SG:'🇸🇬 싱가포르',PH:'🇵🇭 필리핀',KH:'🇰🇭 캄보디아',KHMER:'🇰🇭 캄보디아',MM:'🇲🇲 미얀마',MYANMAR:'🇲🇲 미얀마',IN:'🇮🇳 인도',MX:'🇲🇽 멕시코',TR:'🇹🇷 터키',GR:'🇬🇷 그리스',MA:'🇲🇦 모로코'};
  window.normalizeStyleChoiceV9=function(v){
    const raw=String(v||'').trim(); if(!raw)return raw;
    const upper=raw.toUpperCase(); return STYLE_ALIASES[raw]||STYLE_ALIASES[upper]||raw;
  };
  window.normalizeBCStylesV8=window.normalizeBCStylesV9=function(){
    if(window.S&&Array.isArray(S.bcStyles)) S.bcStyles=[...new Set(S.bcStyles.map(normalizeStyleChoiceV9).filter(Boolean))];
  };
  const addIng=(id,name,category,icon,amt,aliases=[])=>{ if(typeof INGREDIENT_DB_V2==='object'&&!INGREDIENT_DB_V2[id]) INGREDIENT_DB_V2[id]={id,name,category,aliases:[name,...aliases],icon,defaultAmount:amt}; };
  [
    ['galangal','갈랑가','spice','🌿','20g'],['belacan','블라찬','sauce','🧂','10g'],['tamarind_paste','타마린드페이스트','sauce','🍶','20g'],['palm_sugar','팜슈가','sauce','🍯','15g'],['kaffir_lime_leaf','카피르라임잎','spice','🌿','3g'],['thai_green_curry','그린커리페이스트','sauce','🟢','60g'],['thai_red_curry','레드커리페이스트','sauce','🔴','60g'],['bamboo_shoot','죽순','veg','🎍','100g'],['chicken_broth','치킨육수','sauce','🍶','500ml'],['dried_chili','건고추','spice','🌶️','5g'],['curry_powder','카레가루','sauce','🟡','20g'],['green_pepper','풋고추','veg','🌶️','40g'],['mohinga_paste','모힝가페이스트','sauce','🍲','40g'],['banana_stem','바나나줄기','veg','🌿','120g'],['fermented_tea_leaf','라페소','veg','🍃','80g'],['fried_garlic','마늘후레이크','sauce','🧄','10g'],['chickpea_powder','병아리콩가루','grain','🫘','30g'],['rice_vermicelli','쌀버미셀리','grain','🍜','200g'],['lemongrass','레몬그라스','spice','🌿','20g'],['fish_sauce','피시소스','sauce','🍶','25g'],['soy_sauce','간장','sauce','🍶','20g'],['oyster_sauce','굴소스','sauce','🍶','25g'],['lime','라임','fruit','🍋','30g'],['cilantro','고수','spice','🌿','10g'],['basil','바질','spice','🌿','10g'],['coconut_milk','코코넛밀크','sauce','🥥','400ml'],['water','물','sauce','💧','500ml'],['glass_noodle','당면','grain','🍜','100g'],['red_onion','적양파','veg','🧅','80g'],['celery','셀러리','veg','🥬','50g'],['cooking_oil','식용유','sauce','🫙','20g']
  ].forEach(x=>addIng(...x));

  const addMenu=(name,styles,ingredients,amounts,cookTime=30,servings=3,tags=[])=>{
    if(typeof MENU_SCHEMA_V2==='object') MENU_SCHEMA_V2[name]={name,styles,ingredients,cookTime,servings,recipeServings:servings,ingredientAmounts:amounts,tags:['v9확장',...tags]};
  };
  const menuPatches=[
    ['🇵🇭 필리핀','카레카레',['beef','peanut','eggplant','bok_choy','green_bean','fish_sauce','rice'],{beef:'450g',peanut:'80g',eggplant:'250g',bok_choy:'180g',green_bean:'120g',fish_sauce:'25g',rice:'360g'},60,4],
    ['🇵🇭 필리핀','비콜익스프레스',['pork','coconut_milk','dried_chili','garlic','onion','fish_sauce','rice'],{pork:'350g',coconut_milk:'350ml',dried_chili:'8g',garlic:'15g',onion:'120g',fish_sauce:'25g',rice:'360g'},35,3],
    ['🇵🇭 필리핀','아프리타다',['chicken','potato','carrot','bell_pepper','tomato_sauce','garlic','onion','rice'],{chicken:'450g',potato:'250g',carrot:'120g',bell_pepper:'120g',tomato_sauce:'250g',garlic:'12g',onion:'120g',rice:'360g'},45,4],
    ['🇵🇭 필리핀','롱가니사볶음밥',['sausage','rice','egg','garlic','onion','soy_sauce'],{sausage:'250g',rice:'450g',egg:'3개',garlic:'15g',onion:'120g',soy_sauce:'20g'},25,3],
    ['🇸🇬 싱가포르','호키엔미',['rice_noodle','egg','shrimp','pork','mung_sprout','garlic','soy_sauce','lime'],{rice_noodle:'260g',egg:'2개',shrimp:'180g',pork:'150g',mung_sprout:'180g',garlic:'12g',soy_sauce:'30g',lime:'30g'},30,3],
    ['🇸🇬 싱가포르','차퀘이테오싱가포르',['rice_noodle','egg','shrimp','sausage','mung_sprout','soy_sauce','garlic'],{rice_noodle:'280g',egg:'2개',shrimp:'160g',sausage:'120g',mung_sprout:'160g',soy_sauce:'35g',garlic:'12g'},25,3],
    ['🇲🇾 말레이시아','로티차나이',['flour','cooking_oil','curry_powder','chicken','potato','onion'],{flour:'300g',cooking_oil:'40g',curry_powder:'25g',chicken:'300g',potato:'200g',onion:'120g'},55,4],
    ['🇲🇾 말레이시아','아얌마삭메라',['chicken','tomato_sauce','dried_chili','onion','garlic','rice'],{chicken:'450g',tomato_sauce:'250g',dried_chili:'8g',onion:'150g',garlic:'15g',rice:'360g'},45,4],
    ['🇰🇭 캄보디아','아목트레이',['fish_fillet','coconut_milk','lemongrass','galangal','kaffir_lime_leaf','fish_sauce','rice'],{fish_fillet:'450g',coconut_milk:'350ml',lemongrass:'25g',galangal:'15g',kaffir_lime_leaf:'3g',fish_sauce:'25g',rice:'360g'},45,3],
    ['🇰🇭 캄보디아','록락',['beef','onion','lettuce','tomato','lime','soy_sauce','garlic','rice'],{beef:'400g',onion:'150g',lettuce:'120g',tomato:'180g',lime:'30g',soy_sauce:'30g',garlic:'15g',rice:'360g'},30,3],
    ['🇰🇭 캄보디아','크메르레드커리',['chicken','coconut_milk','thai_red_curry','potato','carrot','eggplant','rice'],{chicken:'400g',coconut_milk:'400ml',thai_red_curry:'60g',potato:'250g',carrot:'120g',eggplant:'180g',rice:'360g'},50,4],
    ['🇲🇲 미얀마','모힝가',['fish_fillet','rice_vermicelli','lemongrass','banana_stem','chickpea_powder','fish_sauce','water'],{fish_fillet:'350g',rice_vermicelli:'260g',lemongrass:'25g',banana_stem:'150g',chickpea_powder:'40g',fish_sauce:'30g',water:'1200ml'},60,4],
    ['🇲🇲 미얀마','라페토',['fermented_tea_leaf','cabbage','tomato','peanut','fried_garlic','lime','fish_sauce'],{fermented_tea_leaf:'100g',cabbage:'180g',tomato:'150g',peanut:'50g',fried_garlic:'15g',lime:'30g',fish_sauce:'20g'},20,3],
    ['🇲🇲 미얀마','샨누들',['rice_noodle','chicken','tomato','garlic','soy_sauce','peanut','cilantro'],{rice_noodle:'260g',chicken:'300g',tomato:'250g',garlic:'15g',soy_sauce:'30g',peanut:'40g',cilantro:'10g'},35,3]
  ];
  menuPatches.forEach(m=>addMenu(m[1],[m[0]],m[2],m[3],m[4],m[5]));
  if(typeof buildMenuDBV2==='function') buildMenuDBV2();


  window.pushStyle=function(id,skipRender){ id=normalizeStyleChoiceV9(id); if(!S.bcStyles.includes(id)) S.bcStyles.push(id); if(!skipRender&&!document.getElementById('style-modal'))render(); };
  window.removeStyle=function(id,skipRender){ const n=normalizeStyleChoiceV9(id); S.bcStyles=S.bcStyles.filter(x=>normalizeStyleChoiceV9(x)!==n); if(!skipRender&&!document.getElementById('style-modal'))render(); };
  window.toggleStyle=function(id){ id=normalizeStyleChoiceV9(id); const i=S.bcStyles.indexOf(id); if(i>=0)S.bcStyles.splice(i,1); else S.bcStyles.push(id); if(!document.getElementById('style-modal'))render(); };

  const styleGroups=[
    {group:'기본',items:[['한식','🍚','된장찌개, 제육볶음, 비빔밥'],['일식','🍱','라멘, 덮밥, 우동'],['중식','🥢','마파두부, 짜장면, 볶음밥'],['헬시','🥗','샐러드, 포케, 저당식단']]},
    {group:'동남아',items:[['🇹🇭 태국','🇹🇭','팟타이, 똠얌꿍, 카오만가이'],['🇻🇳 베트남','🇻🇳','쌀국수, 분짜, 반쎄오'],['🇮🇩 인도네시아','🇮🇩','나시고랭, 렌당, 사테'],['🇲🇾 말레이시아','🇲🇾','나시르막, 락사, 로티차나이'],['🇸🇬 싱가포르','🇸🇬','하이난치킨라이스, 바쿠테, 호키엔미'],['🇵🇭 필리핀','🇵🇭','아도보, 시니강, 카레카레'],['🇰🇭 캄보디아','🇰🇭','아목트레이, 록락'],['🇲🇲 미얀마','🇲🇲','모힝가, 라페토']]},
    {group:'글로벌',items:[['🇮🇳 인도','🇮🇳','버터치킨, 비리야니, 사모사'],['🇲🇽 멕시코','🇲🇽','타코, 부리토, 엔칠라다'],['🇹🇷 터키','🇹🇷','케밥, 메네멘, 피데'],['🇬🇷 그리스','🇬🇷','그릭샐러드, 무사카'],['🇲🇦 모로코','🇲🇦','쿠스쿠스, 타진'],['🇺🇸 미국','🇺🇸','스테이크, 샌드위치, 수프']]}];

  window.openStyleDrop=function(){
    const old=document.getElementById('style-modal'); if(old){old.remove();return;}
    const overlay=document.createElement('div'); overlay.id='style-modal'; var headerEl=document.querySelector('[style*="position:fixed"][style*="z-index:100"]');
    var headerH=headerEl?headerEl.offsetHeight:80;
    overlay.style.cssText='position:fixed;top:'+headerH+'px;left:0;right:0;bottom:0;background:rgba(26,26,46,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
    // 모달 열리는 동안 app 레이아웃 고정
    var appEl=document.getElementById('app');
    var appSnapshot=appEl?appEl.innerHTML:'';
    function restoreApp(){if(appEl&&appSnapshot)appEl.innerHTML=appSnapshot;}
    const sheet=document.createElement('div'); sheet.style.cssText='background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;max-height:82vh;display:flex;flex-direction:column;overflow:hidden';
    sheet.innerHTML='<div style="padding:16px;border-bottom:1px solid #f0f0f0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><div style="font-weight:900;font-size:17px">🌍 음식 스타일 선택</div><button id="style-done" style="background:#f0f0f0;border:none;border-radius:10px;padding:7px 14px;font-weight:700">완료</button></div><input id="style-search-modal" placeholder="국가/스타일 검색..." style="width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:14px;outline:none;box-sizing:border-box"></div><div id="style-modal-list" style="overflow-y:auto;flex:1;padding-bottom:24px"></div>';
    overlay.appendChild(sheet); document.body.appendChild(overlay);
    const list=sheet.querySelector('#style-modal-list'), search=sheet.querySelector('#style-search-modal'); sheet.querySelector('#style-done').onclick=()=>overlay.remove(); overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
    function draw(q=''){
      const l=q.toLowerCase(); list.innerHTML=''; let any=false;
      styleGroups.forEach(g=>{
        const rows=g.items.filter(([id,e,d])=>!q||id.toLowerCase().includes(l)||d.toLowerCase().includes(l)); if(!rows.length)return; any=true;
        const h=document.createElement('div'); h.style.cssText='padding:10px 16px 5px;font-size:11px;font-weight:800;color:#aaa;letter-spacing:1px'; h.textContent=g.group; list.appendChild(h);
        rows.forEach(([id,e,d])=>{ const sel=S.bcStyles.includes(id); const b=document.createElement('button'); b.style.cssText='width:100%;padding:13px 16px;border:none;background:'+(sel?'#FFF8EE':'#fff')+';display:flex;align-items:center;gap:12px;text-align:left;border-bottom:1px solid #f5f5f5;cursor:pointer'; b.innerHTML='<span style="font-size:24px;width:34px;text-align:center">'+e+'</span><span style="flex:1"><b style="font-size:15px;color:'+(sel?'var(--primary)':'var(--text)')+'">'+id.replace(/^..\s/u,'')+'</b><br><span style="font-size:11px;color:#aaa">'+d+'</span></span><span style="font-size:18px;color:var(--primary);font-weight:900">'+(sel?'✓':'')+'</span>'; b.onclick=()=>{toggleStyle(id); draw(search.value||'');}; list.appendChild(b); });
      });
      if(!any) list.innerHTML='<div style="padding:30px;text-align:center;color:#aaa">검색 결과가 없어요</div>';
    }
    search.oninput=()=>draw(search.value); draw(); setTimeout(()=>search.focus(),80);
  };

  window.rAStyle=function(){
    if(typeof normalizeBCStylesV9==='function') normalizeBCStylesV9();
    const flat=styleGroups.flatMap(g=>g.items.map(([id,e,d])=>({id,e,d,group:g.group})));
    return `<div class="pad"><button class="back" onclick="go('a-fridge')">←</button><div class="title">🍽️ 어떤 스타일로?</div><div class="sub">국가별 스타일도 선택할 수 있어요</div></div>
    <div class="px" style="padding-bottom:120px">${flat.map(s=>`<button style="width:100%;padding:16px;border-radius:18px;display:flex;align-items:center;gap:14px;text-align:left;margin-bottom:9px;border:2px solid ${S.bcStyles.includes(s.id)?'var(--primary)':'var(--border)'};background:${S.bcStyles.includes(s.id)?'var(--primary-pale)':'var(--card)'};box-shadow:var(--shadow)" onclick="toggleStyle('${s.id}')"><span style="font-size:32px;width:38px;text-align:center">${s.e}</span><div style="flex:1"><div style="font-weight:800;font-size:15px">${s.id.replace(/^..\s/u,'')}</div><div style="font-size:12px;color:var(--text-sub);margin-top:2px">${s.d}</div></div><span style="font-size:18px;color:${S.bcStyles.includes(s.id)?'var(--primary)':'var(--border)'}">${S.bcStyles.includes(s.id)?'✓':'○'}</span></button>`).join('')}</div>
    <div class="bottom-bar"><button class="btn-p" ${S.bcStyles.length===0?'disabled':''} onclick="genAMeal()">✨ ${S.bcStyles.length>0?S.bcStyles.join('+')+' 식단 짜기':'스타일을 선택해주세요'}</button></div>`;
  };
  console.info('[Homekeeper v9]', 'flags fixed in A/B selectors, SEA menu pool expanded', Object.keys(MENU_DB).length+' menus');
})();
/* ===== /inline-script-14 ===== */


/* ===== wm-schedule-flag-ui-patch-v14 ===== */
(function(){
  /* ===== v14: 식단 스케줄 생성/수정 UI 통합 + B플로우 국기 복구 ===== */
  /* hotfix: 가로폭 원복, 요일 카드 세로폭 20% 축소 */
  var MEALS=['아침','점심','저녁'];
  var MEAL_UI={
    '아침':{emoji:'🌅',label:'아침',sub:'가볍게 시작',scene:'해 뜨는 아침',fg:'#F59E0B',bg:'#FFF4D6',grad:'linear-gradient(135deg,#FFF7D6,#FFE7A3)'},
    '점심':{emoji:'☀️',label:'점심',sub:'든든한 한 끼',scene:'밝은 점심',fg:'#2563EB',bg:'#EAF2FF',grad:'linear-gradient(135deg,#EAF7FF,#DDEBFF)'},
    '저녁':{emoji:'🌙',label:'저녁',sub:'하루 마무리',scene:'편안한 저녁',fg:'#4F46E5',bg:'#EEF0FF',grad:'linear-gradient(135deg,#EEF0FF,#E9E5FF)'}
  };
  function countMeal(m){return DAYS.filter(function(d){return (S.schedule[d]||[]).indexOf(m)>=0;}).length;}
  function totalSelected(){return Object.values(S.schedule||{}).reduce(function(a,b){return a+(Array.isArray(b)?b.length:0);},0);}
  window.rMealSlotIcon=function(meal,on){
    var u=MEAL_UI[meal]||MEAL_UI['점심'];
    return '<span title="'+u.scene+'" style="width:30px;height:30px;border-radius:12px;background:'+(on?u.grad:'#F3F4F6')+';display:inline-flex;align-items:center;justify-content:center;font-size:17px;box-shadow:'+(on?'0 6px 14px rgba(15,23,42,.10)':'none')+';filter:'+(on?'none':'grayscale(.25)')+'">'+u.emoji+'</span>';
  };
  function mealMiniCard(m){
    var u=MEAL_UI[m], cnt=countMeal(m);
    return '<div style="background:'+u.bg+';border:1px solid rgba(15,23,42,.06);border-radius:15px;padding:8px 7px;display:flex;align-items:center;gap:7px;box-shadow:0 6px 16px rgba(15,23,42,.045)">'+
      rMealSlotIcon(m,true)+
      '<div style="min-width:0;text-align:left"><div style="font-size:12px;font-weight:900;color:'+u.fg+';line-height:1.1">'+m+'</div><div style="font-size:10px;color:#7C8698;margin-top:2px">'+cnt+'일 선택</div></div>'+ 
    '</div>';
  }
  function dayRow(day){
    var selected=(S.schedule[day]||[]);
    return '<div style="background:rgba(255,255,255,.92);border:1px solid rgba(15,23,42,.07);border-radius:16px;padding:8px 12px;margin-bottom:6px;box-shadow:0 6px 18px rgba(15,23,42,.04)">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'+
        '<div style="font-weight:900;font-size:15px;letter-spacing:-.3px">'+day+'요일</div>'+
        '<div style="font-size:11px;color:#7C8698;font-weight:800;background:#F5F6FA;border-radius:999px;padding:3px 8px">'+selected.length+'끼</div>'+
      '</div>'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">'+
      MEALS.map(function(m){
        var on=selected.indexOf(m)>=0, u=MEAL_UI[m];
        return '<button type="button" onclick="toggleSlot(\''+day+'\',\''+m+'\')" style="height:46px;padding:4px 4px;border-radius:13px;border:1.5px solid '+(on?u.fg:'rgba(15,23,42,.08)')+';background:'+(on?u.grad:'#F7F8FA')+';display:flex;align-items:center;justify-content:center;gap:5px;font-family:inherit;transition:all .14s ease;box-shadow:'+(on?'0 6px 14px rgba(15,23,42,.08)':'none')+';opacity:'+(on?1:.72)+'">'+
          '<span style="font-size:16px;line-height:1">'+u.emoji+'</span>'+
          '<span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.05"><b style="font-size:11px;color:'+(on?u.fg:'#8B95A1')+'">'+m+'</b><small style="font-size:8px;color:'+(on?u.fg:'#B0B7C3')+';font-weight:800">'+(on?'ON':u.sub)+'</small></span>'+
        '</button>';
      }).join('')+
      '</div></div>';
  }
  function periodCard(){
    return '<div style="background:rgba(255,255,255,.92);border:1px solid rgba(15,23,42,.07);border-radius:18px;padding:12px;margin-top:10px;box-shadow:0 8px 22px rgba(15,23,42,.045)">'+
      '<div style="font-size:11px;font-weight:900;color:#98A2B3;letter-spacing:1px;margin-bottom:8px">📅 식단 기간</div>'+
      '<div style="display:flex;gap:7px">'+
      [{v:1,label:'1주일',sub:'7일',icon:'📅'},{v:2,label:'2주일',sub:'14일',icon:'📆'},{v:4,label:'한달',sub:'30일',icon:'🗓️'}].map(function(p){
        var on=S.planDuration===p.v;
        return '<button onclick="S.planDuration='+p.v+';render()" style="flex:1;padding:9px 6px;border-radius:14px;border:1.5px solid '+(on?'var(--primary)':'rgba(15,23,42,.08)')+';background:'+(on?'var(--primary-pale)':'#fff')+';text-align:center;cursor:pointer;font-family:inherit">'+
          '<div style="font-size:18px;margin-bottom:2px">'+p.icon+'</div><div style="font-weight:900;font-size:12px;color:'+(on?'var(--primary)':'var(--text)')+'">'+p.label+'</div><div style="font-size:10px;color:#aaa">'+p.sub+'</div></button>';
      }).join('')+'</div></div>';
  }
  function peopleCard(){
    return '<div style="background:rgba(255,255,255,.92);border:1px solid rgba(15,23,42,.07);border-radius:18px;padding:12px;margin:8px 0 10px;box-shadow:0 8px 22px rgba(15,23,42,.045)">'+
      '<div style="font-size:11px;font-weight:900;color:#98A2B3;letter-spacing:1px;margin-bottom:8px">👥 몇 인 가족이에요?</div>'+
      '<div style="display:flex;gap:7px">'+[1,2,3,4].map(function(n){var on=S.people===n;return '<button onclick="S.people='+n+';render()" style="flex:1;padding:9px 0;border-radius:13px;border:1.5px solid '+(on?'var(--primary)':'rgba(15,23,42,.08)')+';background:'+(on?'var(--primary-pale)':'#fff')+';color:'+(on?'var(--primary)':'var(--text)')+';font-weight:900;font-size:13px;font-family:inherit">'+n+'인</button>';}).join('')+
      '</div></div>';
  }
  function scheduleScreen(isOnboard){
    var total=totalSelected();
    var btnText=isOnboard?(total>0?total+'끼로 시작하기 →':'끼니를 선택해주세요'):'설정 완료 →';
    var btnAction=isOnboard?'completeOnboard()':'saveSched();go(\'home\')';
    return '<div style="padding:40px 20px 10px;background:linear-gradient(180deg,#FFFFFF,#F7F7FB);position:sticky;top:0;z-index:20;border-bottom:1px solid rgba(15,23,42,.04)">'+
      (isOnboard?'':'<button class="back" onclick="go(\'home\')" style="margin-bottom:10px">←</button>')+
      '<div class="title" style="margin-bottom:3px;font-size:24px!important">식사 스케줄 설정</div>'+
      '<div style="font-size:12px;color:var(--text-sub);line-height:1.4">아침·점심·저녁을 한눈에 구분해서 선택해요.</div>'+
      '</div>'+
      '<div class="px" style="padding-bottom:'+(isOnboard?'150':'120')+'px">'+
        (isOnboard?peopleCard():'')+
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:8px 0 10px">'+MEALS.map(mealMiniCard).join('')+'</div>'+
        DAYS.map(dayRow).join('')+
        '<div style="background:#E8F5E9;border-radius:16px;padding:12px;margin-top:10px;text-align:center;border:1px solid #C8E6C9">'+
          '<div style="font-size:13px;color:#2e7d32;font-weight:900">총 '+totalMeals()+'끼 설정됨</div>'+
          '<div style="font-size:11px;color:#66A06A;margin-top:3px">선택한 끼니 기준으로 식단이 생성돼요</div>'+
        '</div>'+
        (isOnboard?periodCard():'')+
      '</div>'+
      '<div class="bottom-bar"><button onclick="'+btnAction+'" '+(total===0?'disabled':'')+' class="btn-p" style="background:'+(total>0?'var(--primary)':'#e0e0e0')+'!important;box-shadow:'+(total>0?'0 8px 24px rgba(75,63,216,0.3)':'none')+'!important">'+btnText+'</button></div>';
  }
  window.rOnboard=function(){return scheduleScreen(true);};
  window.rSchedule=function(){return scheduleScreen(false);};

  var STYLE_LABELS={
    '태국':'🇹🇭 태국','TH':'🇹🇭 태국','THAILAND':'🇹🇭 태국',
    '베트남':'🇻🇳 베트남','VN':'🇻🇳 베트남','VIETNAM':'🇻🇳 베트남',
    '인도네시아':'🇮🇩 인도네시아','ID':'🇮🇩 인도네시아','INDONESIA':'🇮🇩 인도네시아',
    '말레이시아':'🇲🇾 말레이시아','MY':'🇲🇾 말레이시아','MALAYSIA':'🇲🇾 말레이시아',
    '싱가포르':'🇸🇬 싱가포르','SG':'🇸🇬 싱가포르','SINGAPORE':'🇸🇬 싱가포르',
    '필리핀':'🇵🇭 필리핀','PH':'🇵🇭 필리핀','PHILIPPINES':'🇵🇭 필리핀',
    '대만':'🇹🇼 대만','TW':'🇹🇼 대만','TAIWAN':'🇹🇼 대만',
    '인도':'🇮🇳 인도','IN':'🇮🇳 인도','INDIA':'🇮🇳 인도',
    '미국':'🇺🇸 미국','US':'🇺🇸 미국','USA':'🇺🇸 미국',
    '멕시코':'🇲🇽 멕시코','MX':'🇲🇽 멕시코','MEXICO':'🇲🇽 멕시코',
    '터키':'🇹🇷 터키','TR':'🇹🇷 터키','TURKEY':'🇹🇷 터키',
    '그리스':'🇬🇷 그리스','GR':'🇬🇷 그리스','GREECE':'🇬🇷 그리스',
    '이탈리아':'🇮🇹 이탈리아','IT':'🇮🇹 이탈리아','ITALY':'🇮🇹 이탈리아',
    '스페인':'🇪🇸 스페인','ES':'🇪🇸 스페인','SPAIN':'🇪🇸 스페인',
    '프랑스':'🇫🇷 프랑스','FR':'🇫🇷 프랑스','FRANCE':'🇫🇷 프랑스',
    '독일':'🇩🇪 독일','DE':'🇩🇪 독일','GERMANY':'🇩🇪 독일',
    '포르투갈':'🇵🇹 포르투갈','PT':'🇵🇹 포르투갈','PORTUGAL':'🇵🇹 포르투갈',
    '러시아':'🇷🇺 러시아','RU':'🇷🇺 러시아','RUSSIA':'🇷🇺 러시아',
    '폴란드':'🇵🇱 폴란드','PL':'🇵🇱 폴란드','POLAND':'🇵🇱 폴란드',
    '스웨덴':'🇸🇪 스웨덴','SE':'🇸🇪 스웨덴','SWEDEN':'🇸🇪 스웨덴',
    '체코':'🇨🇿 체코','CZ':'🇨🇿 체코','CZECH':'🇨🇿 체코',
    '모로코':'🇲🇦 모로코','MA':'🇲🇦 모로코','MOROCCO':'🇲🇦 모로코',
    '에티오피아':'🇪🇹 에티오피아','ET':'🇪🇹 에티오피아','ETHIOPIA':'🇪🇹 에티오피아',
    '나이지리아':'🇳🇬 나이지리아','NG':'🇳🇬 나이지리아','NIGERIA':'🇳🇬 나이지리아',
    '튀니지':'🇹🇳 튀니지','TN':'🇹🇳 튀니지','TUNISIA':'🇹🇳 튀니지',
    '중동':'🌙 중동','MIDDLE EAST':'🌙 중동',
    '한식':'한식','일식':'일식','중식':'중식','헬시':'헬시'
  };
  function normalizeStyleLabel(v){
    var raw=String(v||'').trim(); if(!raw)return '';
    if(/^\p{Regional_Indicator}\p{Regional_Indicator}\s+/u.test(raw) || raw.indexOf('🌙 ')===0) return raw;
    var upper=raw.toUpperCase();
    return STYLE_LABELS[raw]||STYLE_LABELS[upper]||raw;
  }
  window.normalizeStyleChoiceV8=window.normalizeStyleChoiceV9=normalizeStyleLabel;
  window.normalizeBCStylesV8=window.normalizeBCStylesV9=function(){
    if(window.S&&Array.isArray(S.bcStyles)) S.bcStyles=[...new Set(S.bcStyles.map(normalizeStyleLabel).filter(Boolean))];
  };
  window.pushStyle=function(id, skipRender){
    id=normalizeStyleLabel(id);
    if(id && S.bcStyles.indexOf(id)<0) S.bcStyles.push(id);
    if(!skipRender && !document.getElementById('style-modal')) render();
  };
  window.removeStyle=function(id, skipRender){
    var n=normalizeStyleLabel(id);
    S.bcStyles=S.bcStyles.filter(function(x){return normalizeStyleLabel(x)!==n;});
    if(!skipRender && !document.getElementById('style-modal')) render();
  };
  window.openStyleDrop=function(){
    var existing=document.getElementById('style-modal'); if(existing){existing.remove();return;}
    var groups=[
      {group:'국내/기본',items:[['한식','🍚'],['일식','🍱'],['중식','🥢'],['헬시','🥗']]},
      {group:'동남아시아',items:[['🇹🇭 태국','🇹🇭'],['🇻🇳 베트남','🇻🇳'],['🇮🇩 인도네시아','🇮🇩'],['🇲🇾 말레이시아','🇲🇾'],['🇸🇬 싱가포르','🇸🇬'],['🇵🇭 필리핀','🇵🇭'],['🇹🇼 대만','🇹🇼']]},
      {group:'남아시아/중동',items:[['🇮🇳 인도','🇮🇳'],['🌙 중동','🌙'],['🇹🇷 터키','🇹🇷']]},
      {group:'유럽',items:[['🇬🇷 그리스','🇬🇷'],['🇪🇸 스페인','🇪🇸'],['🇫🇷 프랑스','🇫🇷'],['🇮🇹 이탈리아','🇮🇹'],['🇩🇪 독일','🇩🇪'],['🇵🇹 포르투갈','🇵🇹'],['🇷🇺 러시아','🇷🇺'],['🇵🇱 폴란드','🇵🇱'],['🇸🇪 스웨덴','🇸🇪'],['🇨🇿 체코','🇨🇿']]},
      {group:'아메리카',items:[['🇲🇽 멕시코','🇲🇽'],['🇺🇸 미국','🇺🇸'],['🇦🇷 아르헨티나','🇦🇷'],['🇧🇷 브라질','🇧🇷'],['🇵🇪 페루','🇵🇪'],['🇨🇴 콜롬비아','🇨🇴'],['🇯🇲 자메이카','🇯🇲']]},
      {group:'아프리카',items:[['🇲🇦 모로코','🇲🇦'],['🇪🇹 에티오피아','🇪🇹'],['🇳🇬 나이지리아','🇳🇬'],['🇹🇳 튀니지','🇹🇳']]}
    ];
    var overlay=document.createElement('div');
    overlay.id='style-modal';
    var headerEl=document.querySelector('[style*="position:fixed"][style*="z-index:100"]');
    var headerH=headerEl?headerEl.offsetHeight:80;
    overlay.style.cssText='position:fixed;top:'+headerH+'px;left:0;right:0;bottom:0;background:rgba(26,26,46,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
    // 모달 열리는 동안 app 레이아웃 고정
    var appEl=document.getElementById('app');
    var appSnapshot=appEl?appEl.innerHTML:'';
    function restoreApp(){if(appEl&&appSnapshot)appEl.innerHTML=appSnapshot;}
    var sheet=document.createElement('div');
    sheet.style.cssText='background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden';
    sheet.innerHTML='<div style="padding:16px;border-bottom:1px solid #f0f0f0;flex-shrink:0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><div style="font-weight:900;font-size:16px">음식 스타일 선택</div><button id="style-close" style="background:#f0f0f0;border:none;border-radius:10px;padding:6px 14px;font-size:13px;color:#666;font-weight:800;cursor:pointer">완료</button></div><input id="style-search-modal" placeholder="국가/스타일 검색..." style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:14px;outline:none;box-sizing:border-box"></div><div id="style-modal-list" style="overflow-y:auto;flex:1;padding-bottom:24px"></div>';
    overlay.appendChild(sheet); document.body.appendChild(overlay);
    function build(q){
      q=String(q||'').toLowerCase(); var list=document.getElementById('style-modal-list');
      // 이미 렌더링된 경우 선택 상태만 업데이트 (흔들림 방지)
      if(!q && list.children.length > 0){
        list.querySelectorAll('button[data-sid]').forEach(function(btn){
          var sid=btn.getAttribute('data-sid');
          var selected=(S.bcStyles||[]).map(normalizeStyleLabel).indexOf(normalizeStyleLabel(sid))>=0;
          btn.style.background=selected?'#FFF8EE':'#fff';
          var nameSpan=btn.querySelector('span');
          if(nameSpan) nameSpan.style.color=selected?'var(--primary)':'var(--text)';
          var chk=btn.querySelector('.chk-mark');
          if(selected && !chk){var c=document.createElement('span');c.className='chk-mark';c.style.cssText='color:var(--primary);font-size:18px;font-weight:900';c.textContent='✓';btn.appendChild(c);}
          else if(!selected && chk){chk.remove();}
        });
        return;
      }
      list.innerHTML=''; var found=false;
      groups.forEach(function(grp){
        var items=grp.items.filter(function(it){return !q || it[0].toLowerCase().indexOf(q)>=0 || it[0].replace(/^\p{Regional_Indicator}\p{Regional_Indicator}\s*/u,'').toLowerCase().indexOf(q)>=0;});
        if(!items.length)return; found=true;
        var h=document.createElement('div'); h.style.cssText='padding:9px 16px 5px;font-size:11px;font-weight:900;color:#aaa;letter-spacing:1px'; h.textContent=grp.group; list.appendChild(h);
        items.forEach(function(it){
          var id=normalizeStyleLabel(it[0]); var selected=(S.bcStyles||[]).map(normalizeStyleLabel).indexOf(id)>=0;
          var btn=document.createElement('button');
          btn.style.cssText='width:100%;padding:12px 16px;border:none;background:'+(selected?'#FFF8EE':'#fff')+';display:flex;align-items:center;gap:12px;text-align:left;border-bottom:1px solid #f5f5f5;cursor:pointer;font-family:inherit';
          var displayName=it[0].includes(' ')?it[0].replace(/^\S+\s+/,'').trim():it[0];
          var flagE=it[1]||'';
          var flagU=flagE?'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/'+[...flagE].map(function(c){return c.codePointAt(0).toString(16);}).join('-')+'.svg':'';
          var flagHtml=flagU?'<img src="'+flagU+'" width="22" height="22" style="width:22px;height:22px;vertical-align:middle;flex-shrink:0;min-width:22px" onerror="this.style.display=\'none\';">':'';
          btn.innerHTML=flagHtml+'<span style="font-weight:800;font-size:15px;flex:1;color:'+(selected?'var(--primary)':'var(--text)')+'">' +displayName+'</span>'+(selected?'<span style="color:var(--primary);font-size:18px;font-weight:900">✓</span>':'');
          btn.setAttribute('data-sid', it[0]);
          btn.onclick=function(){pushStyle(id, true); build(document.getElementById('style-search-modal').value||'');};
          list.appendChild(btn);
        });
      });
      if(!found){list.innerHTML='<div style="padding:24px;text-align:center;color:#aaa;font-size:14px">검색 결과가 없어요</div>';}
    }
    document.getElementById('style-close').onclick=function(){overlay.remove();appSnapshot=null;render();};
    document.getElementById('style-search-modal').oninput=function(){build(this.value);};
    overlay.onclick=function(e){if(e.target===overlay){overlay.remove();appSnapshot=null;render();}};
    build('');
    setTimeout(function(){var s=document.getElementById('style-search-modal'); if(s)s.focus();},80);
  };
})();
/* ===== /wm-schedule-flag-ui-patch-v14 ===== */


/* ===== wm-db-audit-v5-menu-nut-ingredient-serving ===== */
(function(){
  /* ===== WM DB AUDIT v5 =====
     1) MENU_DB ↔ MENU_NUT 불일치 완화: source-based nutrition patch 우선 조회
     2) MENU_DB ↔ INGREDIENT_DB 정합성: 누락 재료 자동 보강
     3) 1인분 기준 통일: nutrition serving 필드 통일
     4) 칼로리 이상치 차단: 메뉴 유형별 합리 범위 가드
     5) 비실존/오번역/생성형 메뉴 제거 또는 정규 메뉴명으로 병합
  */
  if(!window.MENU_DB) return;

  const RENAME = {
    '차퀘이테오싱가포르':'차퀘이테오',
    '새우볶음밥중식':'새우볶음밥',
    '치킨커리말레이':'말레이 치킨커리',
    '미고랭말레이':'미고랭',
    '싱가포르락사':'락사',
    '오타오타싱가포르':'오타오타',
    '완탕미싱가포르':'완탕면',
    '중식오이냉채':'오이냉채',
    '중식가지볶음':'가지볶음',
    '중식만두전골':'만두전골',
    '치킨커리말레이':'치킨커리',
    '치킨커리반미':'커리치킨반미',
    '닭육수면':'닭칼국수',
    '완탕탕':'완탕',
    '아브고레모노':'아브골레모노 수프',
    '아르니굽기':'그리스식 양고기구이',
    '판싯바하이':'판싯 비혼',
    '로미에':'로미',
    '타부크수유':'터키식 닭고기수프',
    '사르수엘라':'해산물 사르수엘라',
    '시칠리아파스타':'시칠리아식 파스타',
    '파에야':'빠에야',
    '살팀보카':'살팀보카',
    '니수아즈 샐러드':'니수아즈샐러드',
    '마싸만 커리':'마사만커리',
    '비프 렌당':'비프렌당',
    '하이난 치킨라이스':'하이난치킨라이스',
    '카르네 아사다 타코':'카르네아사다',
    '클래식 세비체':'세비체',
    '달마카니':'달마크니',
    '람 코르마':'램코르마',
    '램 코르마':'램코르마',
    '기로스 피타':'기로스',
    '코프타 케밥':'코프테',
    '소파카스텔야나':'소파 카스텔라나',
    '소파데리마':'소파 데 리마',
    '소파데피데오':'소파 데 피데오',
    '프렌치어니언수프':'양파수프',
    '뇨키토마토':'뇨키',
    '파기름파스타':'알리오올리오',
    '아보카도크림파스타':'아보카도 파스타',
    '훈제연어파스타':'연어파스타',
    '오징어먹물 파스타':'오징어먹물 파스타'
  };
  const DELETE_RE = /(갈치속젓찌개|된장고추찌개|닭한마리국물면|국물면|속젓찌개|이카먹물|볼로네제 폴란드|소금 피시 아크리|불르구르|키나웅카우|비나쿠완|망가버섯볶음|쉑쉬야락타마투|지코에|오크라밥자메|에고나치킨|할랜드소이야|크룹카코르|차조미스타드|얌싸워이|삼발레박|수코드폴로|예도로인제라|피카디요 콜롬비아|바이삿 튀니지|대만 닭껍질|피타야 치킨|자메이카 피시티|피리 피리 치킨 나이지리아|반보팻짠|비가탄면|아고우렐라이오|시피오네스앙코아|머제타이스|니스스타일피자|아만딘송어|아삼프라이드치킨|굴라이 이칸|레막캄빙|아삼이칸|아얌세리|페센베크|이칸페프리|카부르가|파파아루가다)/;
  function mergeMenu(oldName,newName){
    if(!MENU_DB[oldName] || oldName===newName) return;
    const old=MENU_DB[oldName];
    if(!MENU_DB[newName]) MENU_DB[newName]=Object.assign({}, old, {id:newName, name:newName});
    else {
      const a=MENU_DB[newName], b=old;
      a.ingredients=[...new Map([...(a.ingredients||[]),...(b.ingredients||[])].map(x=>[x.name||String(x),x])).values()].slice(0,10);
      a.styles=[...new Set([...(a.styles||[a.style]).filter(Boolean),...(b.styles||[b.style]).filter(Boolean)])];
      a.tags=[...new Set([...(a.tags||[]),...(b.tags||[])])];
    }
    delete MENU_DB[oldName];
  }
  Object.keys(MENU_DB).forEach(name=>{
    if(DELETE_RE.test(name)){ delete MENU_DB[name]; return; }
    if(RENAME[name]) mergeMenu(name, RENAME[name]);
  });

  // 조합 생성형/번역 오류성 접미어 정리
  Object.keys(MENU_DB).forEach(name=>{
    let clean=name;
    clean=clean.replace(/싱가포르$/,'').replace(/중식$/,'').replace(/말레이$/,'');
    if(clean!==name && clean.length>=2 && !DELETE_RE.test(clean)) mergeMenu(name, clean);
  });

  // 필수 실존 대체 메뉴 보강
  const ADD_MENUS = {
    '치킨커리':{style:'🇺🇸 미국',styles:['🇺🇸 미국'],ingredients:[{name:'닭고기',amount:'220g'},{name:'카레가루',amount:'30g'},{name:'양파',amount:'1/2개'},{name:'토마토소스',amount:'1/2컵'}],cookTime:30,tags:['실존','보강']},
    '말레이 치킨커리':{style:'🇲🇾 말레이시아',styles:['🇲🇾 말레이시아'],ingredients:[{name:'닭고기',amount:'250g'},{name:'코코넛밀크',amount:'150ml'},{name:'카레가루',amount:'30g'},{name:'감자',amount:'1개'}],cookTime:35,tags:['실존','보강']},
    '만두전골':{style:'한식',styles:['한식'],ingredients:[{name:'만두',amount:'6개'},{name:'배추',amount:'100g'},{name:'버섯',amount:'1팩'},{name:'멸치육수',amount:'500ml'}],cookTime:25,tags:['실존','보강']},
    '완탕':{style:'중식',styles:['중식'],ingredients:[{name:'완탕피',amount:'10장'},{name:'돼지고기',amount:'120g'},{name:'대파',amount:'1/2대'},{name:'치킨스톡',amount:'1개'}],cookTime:25,tags:['실존','보강']},
    '아브골레모노 수프':{style:'🇬🇷 그리스',styles:['🇬🇷 그리스'],ingredients:[{name:'닭고기',amount:'150g'},{name:'계란',amount:'1개'},{name:'레몬',amount:'1/2개'},{name:'쌀',amount:'80g'}],cookTime:30,tags:['실존','보강']},
    '그리스식 양고기구이':{style:'🇬🇷 그리스',styles:['🇬🇷 그리스'],ingredients:[{name:'양고기',amount:'220g'},{name:'올리브오일',amount:'1큰술'},{name:'레몬',amount:'1/2개'},{name:'오레가노',amount:'약간'}],cookTime:35,tags:['실존','보강']},
    '터키식 닭고기수프':{style:'🇹🇷 터키',styles:['🇹🇷 터키'],ingredients:[{name:'닭고기',amount:'150g'},{name:'쌀',amount:'60g'},{name:'레몬',amount:'1/2개'},{name:'치킨스톡',amount:'1개'}],cookTime:30,tags:['실존','보강']},
    '판싯 비혼':{style:'🇵🇭 필리핀',styles:['🇵🇭 필리핀'],ingredients:[{name:'쌀국수',amount:'180g'},{name:'닭고기',amount:'120g'},{name:'양배추',amount:'100g'},{name:'간장',amount:'1큰술'}],cookTime:25,tags:['실존','보강']},
    '오징어먹물 파스타':{style:'🇮🇹 이탈리아',styles:['🇮🇹 이탈리아'],ingredients:[{name:'스파게티',amount:'200g'},{name:'오징어',amount:'120g'},{name:'마늘',amount:'3쪽'},{name:'올리브오일',amount:'1큰술'}],cookTime:25,tags:['실존','보강']}
  };
  Object.entries(ADD_MENUS).forEach(([k,v])=>{ if(!MENU_DB[k]) MENU_DB[k]=Object.assign({id:k,name:k,servings:1,recipeServings:1},v); });

  // 재료 DB 정합성: MENU_DB에 연결된 재료가 DB에 없으면 기본 항목으로 보강
  const ingDB = window.INGREDIENT_DB || window.INGREDIENT_DB_V2 || {};
  function addIng(name){
    if(!name || ingDB[name]) return;
    let cat='기타', icon='🛒', unit='적당량';
    if(/(쌀|면|밥|파스타|스파게티|라면|우동|소바|국수|또띠아|빵|만두피)/.test(name)){cat='면·밥';icon='🍚';unit='200g';}
    else if(/(고기|닭|소고기|돼지|연어|생선|갈치|고등어|오징어|새우|계란|두부|치즈|양고기|만두)/.test(name)){cat='단백질';icon='🥩';unit='200g';}
    else if(/(고추장|된장|간장|소스|소금|후추|오일|식초|육수|커리|카레|향신료|스톡|마늘|생강)/.test(name)){cat='양념';icon='🧂';unit='1큰술';}
    else if(/(양파|대파|배추|무|감자|버섯|채소|토마토|상추|오이|양배추|레몬|라임|고수|바질)/.test(name)){cat='채소';icon='🥬';unit='100g';}
    ingDB[name]={name,amount:unit,unit,icon,category:cat,kcal100:0,source:'auto-align',verified:false};
  }
  Object.values(MENU_DB).forEach(m=>{
    (m.ingredients||[]).forEach(i=>addIng(i && (i.name||i.id||i)));
    if(!m.servings) m.servings=1;
    if(!m.recipeServings) m.recipeServings=1;
  });
  window.INGREDIENT_DB=ingDB;

  // 스타일 맵 재구성
  if(typeof FLOW_STYLE_MENU_MAP==='object'){
    const styleMap={};
    Object.values(MENU_DB).forEach(m=>{(m.styles||[m.style||'한식']).filter(Boolean).forEach(s=>{if(!styleMap[s])styleMap[s]=[]; styleMap[s].push(m.name||m.id);});});
    Object.keys(FLOW_STYLE_MENU_MAP).forEach(k=>delete FLOW_STYLE_MENU_MAP[k]);
    Object.assign(FLOW_STYLE_MENU_MAP,styleMap);
  }

  // 보강 영양 DB: 공공/대표 영양정보 기반 1인분 표준값 + 검증 플래그
  const NUT_V5 = {
    '김치찌개':{cal:243,carb:12,fat:15,pro:15,serving:'1인분',source:'식품영양성분DB 기준',verified:true},
    '된장찌개':{cal:138,carb:13,fat:5,pro:10,serving:'1인분',source:'식품영양성분DB 기준',verified:true},
    '순두부찌개':{cal:128,carb:4,fat:6,pro:14,serving:'1인분',source:'식품영양성분DB 기준',verified:true},
    '고추장찌개':{cal:320,carb:20,fat:14,pro:25,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '갈치찌개':{cal:260,carb:12,fat:10,pro:28,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '닭칼국수':{cal:560,carb:82,fat:12,pro:32,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '오징어먹물 파스타':{cal:620,carb:78,fat:22,pro:26,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '치킨커리':{cal:520,carb:42,fat:24,pro:32,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '말레이 치킨커리':{cal:620,carb:38,fat:34,pro:34,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '차퀘이테오':{cal:760,carb:88,fat:32,pro:28,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '락사':{cal:610,carb:65,fat:28,pro:24,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '하이난치킨라이스':{cal:620,carb:72,fat:20,pro:36,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '치킨아도보':{cal:430,carb:10,fat:22,pro:42,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '포크아도보':{cal:560,carb:8,fat:38,pro:42,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '시니강':{cal:280,carb:18,fat:10,pro:30,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '카레카레':{cal:650,carb:32,fat:42,pro:36,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '비콜익스프레스':{cal:580,carb:18,fat:42,pro:32,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '레촌카왈리':{cal:790,carb:12,fat:60,pro:44,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '판싯':{cal:470,carb:68,fat:14,pro:20,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '판싯칸톤':{cal:470,carb:68,fat:14,pro:20,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '판싯 비혼':{cal:430,carb:64,fat:12,pro:20,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '포크시시그':{cal:710,carb:12,fat:52,pro:42,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '치킨이나살':{cal:480,carb:18,fat:22,pro:42,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '불라로':{cal:540,carb:14,fat:34,pro:42,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '티놀라':{cal:320,carb:18,fat:12,pro:32,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '팟타이':{cal:620,carb:86,fat:22,pro:24,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '팟씨유':{cal:650,carb:88,fat:24,pro:26,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '카오팟':{cal:580,carb:78,fat:20,pro:24,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '카오만가이':{cal:520,carb:64,fat:16,pro:34,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '똠얌꿍':{cal:250,carb:18,fat:10,pro:24,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '똠카가이':{cal:330,carb:16,fat:22,pro:24,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '그린커리':{cal:550,carb:34,fat:34,pro:28,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '레드커리':{cal:580,carb:36,fat:36,pro:28,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '팟카파오무쌉':{cal:620,carb:72,fat:26,pro:30,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '쏨땀':{cal:180,carb:28,fat:5,pro:6,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '마사만커리':{cal:690,carb:52,fat:40,pro:34,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '쌀국수':{cal:420,carb:66,fat:8,pro:24,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '분짜':{cal:650,carb:76,fat:26,pro:30,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '반미':{cal:550,carb:62,fat:22,pro:26,serving:'1개',source:'대표 레시피 평균',verified:true},
    '분보후에':{cal:590,carb:72,fat:20,pro:32,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '껌땀':{cal:680,carb:82,fat:26,pro:34,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '고이꾸온':{cal:220,carb:30,fat:6,pro:12,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '짜조':{cal:310,carb:34,fat:14,pro:14,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '반쎄오':{cal:560,carb:56,fat:28,pro:24,serving:'1개',source:'대표 레시피 평균',verified:true},
    '나시고랭':{cal:720,carb:86,fat:30,pro:28,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '미고랭':{cal:690,carb:84,fat:28,pro:26,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '사테아얌':{cal:450,carb:22,fat:24,pro:34,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '비프렌당':{cal:760,carb:20,fat:54,pro:48,serving:'1인분',source:'대표 레시피 평균',verified:true},
    '가도가도':{cal:390,carb:34,fat:22,pro:18,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '소토아얌':{cal:350,carb:24,fat:14,pro:28,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '박소':{cal:420,carb:56,fat:12,pro:24,serving:'1그릇',source:'대표 레시피 평균',verified:true},
    '나시르막':{cal:780,carb:86,fat:36,pro:30,serving:'1접시',source:'대표 레시피 평균',verified:true},
    '로티차나이':{cal:430,carb:48,fat:22,pro:10,serving:'1장+커리',source:'대표 레시피 평균',verified:true},
    '바쿠테':{cal:430,carb:14,fat:26,pro:36,serving:'1그릇',source:'대표 레시피 평균',verified:true}
  };
  const ALIAS_V5 = {
    '하이난 치킨라이스':'하이난치킨라이스','비프 렌당':'비프렌당','마싸만 커리':'마사만커리','판싯 비혼':'판싯 비혼','치킨아도보':'치킨아도보','차퀘이테오싱가포르':'차퀘이테오','싱가포르락사':'락사','포크시시그':'포크시시그','씨씩':'포크시시그','팟카파오 무쌉':'팟카파오무쌉','쏨땀':'쏨땀','푸팟퐁커리':'__DELETE__뿌팟퐁커리'
  };
  function norm(s){return String(s||'').replace(/[\s_\-·()]/g,'').toLowerCase();}
  const nutNorm={}; Object.keys(NUT_V5).forEach(k=>nutNorm[norm(k)]=k);
  function inferRange(name){
    const n=String(name||'');
    if(/(국|탕|찌개|전골|수프|스프|스튜|시니강|똠얌|락사|바쿠테)/.test(n)) return [50,900,360];
    if(/(라멘|라면|우동|소바|냉면|국수|쌀국수|파스타|스파게티|면|미고랭|팟타이|팟씨유)/.test(n)) return [250,1000,560];
    if(/(밥|덮밥|비빔밥|볶음밥|솥밥|라이스|나시|껌땀|카오팟)/.test(n)) return [250,1000,620];
    if(/(튀김|치킨|카왈리|프라이|까스|가츠)/.test(n)) return [250,1200,650];
    if(/(구이|갈비|스테이크|렌당|아도보|시시그|이나살|사테)/.test(n)) return [200,1200,620];
    if(/(샐러드|쏨땀|세비체|고이꾸온)/.test(n)) return [80,650,280];
    return [80,1100,430];
  }
  function validRow(row){ return row && Number.isFinite(+row.cal) && +row.cal>0; }
  function fixedRow(name,row){
    const r=Object.assign({carb:0,fat:0,pro:0,serving:'1인분',source:'미검증',verified:false}, row||{});
    r.cal=Math.round(+r.cal||0); r.carb=Math.round(+r.carb||0); r.fat=Math.round(+r.fat||0); r.pro=Math.round(+r.pro||0);
    const [min,max,def]=inferRange(name);
    if(!r.cal || r.cal<min || r.cal>max){
      r.cal=def; r.source='이상치 차단 범위값'; r.verified=false;
      if(!r.carb&&!r.fat&&!r.pro){r.carb=Math.round(def*.45/4); r.fat=Math.round(def*.30/9); r.pro=Math.round(def*.25/4);}
    }
    if(!r.serving || /100g/.test(r.serving)) r.serving='1인분';
    return r;
  }
  function lookupNut(name){
    const raw=String(name||'').trim();
    const ali=ALIAS_V5[raw] || ALIAS_V5[norm(raw)];
    const key=ali || raw;
    if(NUT_V5[key]) return fixedRow(key,NUT_V5[key]);
    const nk=nutNorm[norm(key)]; if(nk && NUT_V5[nk]) return fixedRow(nk,NUT_V5[nk]);
    try{ if(typeof oldGet==='function'){ const o=oldGet(key)||oldGet(raw); if(validRow(o)) return fixedRow(key,o); } }catch(e){}
    return fixedRow(key,{});
  }
  window.WM_NUT_V5=NUT_V5;
  window.WM_DB_AUDIT_V5={
    menus:Object.keys(MENU_DB).length,
    ingredients:Object.keys(ingDB).length,
    renamed:Object.keys(RENAME).length,
    deletedPattern:String(DELETE_RE),
    nutritionRows:Object.keys(NUT_V5).length
  };
  // MENU_NUT / 고정 메뉴영양 패치는 제거됨: 재료합산 calcNutrition만 사용한다.
  console.info('[wm db audit v5]', window.WM_DB_AUDIT_V5);
})();
/* ===== /wm-db-audit-v5-menu-nut-ingredient-serving ===== */


/* ===== beef-audit-patch ===== */
(function(){
window.BEEF_AUDIT_MAP={
 "불고기":"소고기 목심",
 "소고기무국":"소고기 양지",
 "육개장":"소고기 양지",
 "규동":"우삼겹",
 "갈비탕":"소갈비",
 "갈비찜":"소갈비",
 "장조림":"홍두깨살",
 "샤브샤브":"차돌박이",
 "찹스테이크":"부채살",
 "비프카레":"척아이롤",
 "비프스튜":"척아이롤",
 "안심스테이크":"안심",
 "채끝스테이크":"채끝",
 "립아이스테이크":"립아이"
};
})();
/* ===== /beef-audit-patch ===== */


/* ===== pork-chicken-audit-patch-v1 ===== */
(function(){
  const auditVersion='PORK_CHICKEN_AUDIT_V1';
  function normName(name){ return String(name||'').replace(/\s+/g,'').trim(); }
  function ingredient(name, amount, icon, category){
    try{
      const base=(typeof window.ingObj==='function') ? window.ingObj(name) : {name:name,amount:'적당량',icon:'🥬',category:'기타'};
      return {name:name, amount:amount||base.amount||'적당량', icon:icon||base.icon||'🥬', category:category||base.category||'기타'};
    }catch(e){ return {name:name, amount:amount||'적당량', icon:icon||'🥬', category:category||'기타'}; }
  }
  function patchNutritionDB(){
    try{
      if(typeof NUTRITION_DB==='undefined') return;
      Object.assign(NUTRITION_DB,{
        '돼지앞다리살':{cal:183,pro:20,fat:11,carb:0},
        '돼지등심':{cal:155,pro:22,fat:7,carb:0},
        '돼지삼겹살':{cal:331,pro:17,fat:29,carb:0},
        '돼지오겹살':{cal:340,pro:17,fat:30,carb:0},
        '돼지목살':{cal:263,pro:17,fat:22,carb:0},
        '돼지사태':{cal:190,pro:21,fat:11,carb:0},
        '돼지갈비':{cal:280,pro:18,fat:23,carb:0},
        '돼지등뼈':{cal:230,pro:18,fat:17,carb:0},
        '닭다리살':{cal:175,pro:18,fat:11,carb:0},
        '닭볶음탕용 절단육':{cal:190,pro:18,fat:12,carb:0},
        '영계':{cal:158,pro:18,fat:9,carb:0},
        '닭안심':{cal:110,pro:23,fat:2,carb:0},
        '닭봉':{cal:203,pro:19,fat:14,carb:0},
        '닭날개':{cal:203,pro:19,fat:14,carb:0}
      });
    }catch(e){ console.warn(auditVersion,'NUTRITION_DB patch failed',e); }
  }
  const coreAmounts={
    '돼지앞다리살':'220g','돼지등심':'200g','돼지삼겹살':'220g','돼지오겹살':'240g','돼지목살':'180g','돼지사태':'220g','돼지갈비':'600g','돼지등뼈':'700g',
    '닭다리살':'260g','닭볶음탕용 절단육':'450g','영계':'1마리','닭안심':'220g','닭가슴살':'200g','닭봉':'300g','닭날개':'300g'
  };
  function coreIng(name, amount){ return ingredient(name, amount||coreAmounts[name]||'200g', /닭|영계/.test(name)?'🍗':'🥩', '단백질'); }
  function patchMenu(menuName, coreName, amount){
    try{
      if(typeof MENU_DB==='undefined' || !MENU_DB[menuName]) return false;
      const entry=MENU_DB[menuName];
      const ings=Array.isArray(entry.ingredients)?entry.ingredients.slice():[];
      const oldGeneric=/^(돼지고기|통삼겹|돼지삼겹살|돼지목살|돼지앞다리살|돼지등심|돼지안심|돼지갈비|돼지등뼈|돈카츠|닭고기|닭다리살|닭가슴살|닭다리|토종닭|닭봉|닭날개|영계|치킨)$/;
      let replaced=false;
      const next=ings.map(function(x){
        const xn=normName(x && x.name);
        if(oldGeneric.test(xn)){
          replaced=true;
          return coreIng(coreName, amount||coreAmounts[coreName]||x.amount);
        }
        return x;
      });
      if(!replaced) next.unshift(coreIng(coreName, amount||coreAmounts[coreName]));
      entry.ingredients=next;
      entry.auditCut=true;
      entry.auditCutVersion=auditVersion;
      entry.sourceHint=(entry.sourceHint?entry.sourceHint+'; ':'')+'meat cut audited';
      return true;
    }catch(e){ console.warn(auditVersion,'patchMenu failed',menuName,e); return false; }
  }
  function patchMenus(){
    const map={
      // 돼지고기
      '제육볶음':['돼지앞다리살','220g'], '간장제육볶음':['돼지앞다리살','220g'], '고추장불고기':['돼지앞다리살','220g'], '돼지불고기':['돼지앞다리살','220g'], '두루치기':['돼지앞다리살','220g'],
      '탕수육':['돼지등심','220g'], '광동식탕수육':['돼지등심','220g'], '돈카츠':['돼지등심','220g'], '카츠동':['돼지등심','200g'], '포크찹':['돼지등심','220g'],
      '보쌈':['돼지삼겹살','300g'], '수육':['돼지삼겹살','300g'], '동파육':['돼지오겹살','280g'], '백참돼지':['돼지삼겹살','240g'],
      '김치찌개':['돼지목살','180g'], '돼지국밥':['돼지사태','220g'], '돼지갈비찜':['돼지갈비','600g'], '등갈비찜':['돼지갈비','600g'], '돼지갈비구이':['돼지갈비','600g'], '족발':['돼지족발','300g'],
      '감자탕':['돼지등뼈','700g'], '뼈해장국':['돼지등뼈','700g'],
      // 닭고기
      '닭갈비':['닭다리살','280g'], '치킨스테이크':['닭다리살','260g'], '가라아게':['닭다리살','260g'], '데리야키치킨':['닭다리살','260g'], '중식라조기':['닭다리살','260g'], '깐풍기':['닭다리살','260g'],
      '닭볶음탕':['닭볶음탕용 절단육','450g'], '찜닭':['닭볶음탕용 절단육','450g'], '중식찜닭':['닭볶음탕용 절단육','400g'],
      '삼계탕':['영계','1마리'], '닭백숙':['영계','1마리'], '황기닭백숙':['영계','1마리'],
      '치킨텐더':['닭안심','220g'], '치킨샐러드랩':['닭가슴살','180g'], '닭가슴살채소볶음밥':['닭가슴살','180g'], '중식닭가슴살볶음':['닭가슴살','200g'],
      '중식닭날개조림':['닭날개','300g'], '닭날개파스타':['닭날개','300g'], '중식닭꼬치':['닭다리살','220g']
    };
    const done=[];
    Object.keys(map).forEach(function(name){ if(patchMenu(name,map[name][0],map[name][1])) done.push(name); });
    window.WM_PORK_CHICKEN_AUDIT_V1={applied:true,patchedMenus:done,menuCount:done.length, note:'돼지고기/닭고기 메뉴의 단백질 재료를 부위 단위로 정교화'};
  }
  patchNutritionDB();
  patchMenus();
  console.info('[wm pork/chicken audit v1]', window.WM_PORK_CHICKEN_AUDIT_V1);
})();
/* ===== /pork-chicken-audit-patch-v1 ===== */


/* ===== side-dish-classification-patch-v1 ===== */
/* ===== SIDE DISH CLASSIFICATION PATCH v1 =====
   반찬류는 MENU_DB에 보존하되, 메인 식단 추천/자동생성 후보에서는 제외한다.
   - 메인 후보: 국/탕/찌개/덮밥/면/구이/볶음/찜 등 한 끼 중심 메뉴
   - 사이드 후보: 나물/김치/무침/생채/장아찌/단품 반찬
*/
(function(){
  const SIDE_DISH_EXACT = new Set([
    '가지나물','가지볶음','오이소박이','깻잎무침','취나물','취나물무침',
    '시금치나물','콩나물무침','오이무침','무생채','깍두기','도라지무침',
    '고사리나물','숙주나물','미역줄기볶음','무나물','호박나물','참나물무침',
    '건새우미역무침','물김치','총각김치','파김치','열무김치','배추김치',
    '마늘종볶음','감자볶음','멸치볶음','어묵볶음','연근조림','알감자조림',
    '두부조림','계란말이','계란찜','장조림','북어무침','도토리묵무침','골뱅이무침'
  ]);
  const SIDE_DISH_NAME_RE = /(나물|소박이|김치|깍두기|무침|생채|겉절이|장아찌|피클)$/;
  const MAIN_FORCE_RE = /(비빔밥|덮밥|국밥|볶음밥|솥밥|라이스|카레|파스타|라멘|우동|국수|냉면|탕|국|찌개|전골|찜|구이|스테이크|수프|스튜|샐러드랩|랩)$/;

  function normName(v){ return String(v||'').replace(/\s+/g,'').trim(); }
  function hasTag(entry, word){ return Array.isArray(entry?.tags) && entry.tags.some(t=>String(t).includes(word)); }

  window.isSideDishMenu = function(name){
    const n = normName(name);
    const entry = (typeof MENU_DB !== 'undefined') ? MENU_DB[name] || MENU_DB[n] : null;
    if(!n) return false;
    if(SIDE_DISH_EXACT.has(n)) return true;
    if(entry && (entry.baseId === 'banchan' || entry.baseName === '반찬' || entry.mealRole === 'side' || hasTag(entry,'반찬'))) return true;
    if(MAIN_FORCE_RE.test(n)) return false;
    return SIDE_DISH_NAME_RE.test(n);
  };

  window.isMainDishMenu = function(name){ return !!(name && MENU_DB && MENU_DB[name] && !window.isSideDishMenu(name)); };
  window.filterMainDishMenus = function(list){
    return [...new Set((list||[]).filter(n => MENU_DB && MENU_DB[n] && !window.isSideDishMenu(n)))];
  };

  function classifyMenuDB(){
    if(typeof MENU_DB === 'undefined') return;
    Object.keys(MENU_DB).forEach(function(name){
      const m = MENU_DB[name];
      if(!m) return;
      if(window.isSideDishMenu(name)){
        m.mealRole = 'side';
        m.excludeFromMainPlan = true;
        m.tags = [...new Set([...(m.tags||[]), '반찬', '메인추천제외'])];
      }else{
        if(!m.mealRole) m.mealRole = 'main';
      }
    });
  }

  function rebuildStyleMapWithoutSides(){
    if(typeof FLOW_STYLE_MENU_MAP !== 'object' || typeof MENU_DB === 'undefined') return;
    Object.keys(FLOW_STYLE_MENU_MAP).forEach(function(style){
      FLOW_STYLE_MENU_MAP[style] = window.filterMainDishMenus(FLOW_STYLE_MENU_MAP[style]);
    });
  }

  classifyMenuDB();
  rebuildStyleMapWithoutSides();

  const oldFlowBuildMenu = window.flowBuildMenu;
  if(typeof oldFlowBuildMenu === 'function'){
    window.flowBuildMenu = flowBuildMenu = function(type, styles, baseMenus){
      let result = oldFlowBuildMenu.apply(this, arguments) || [];
      result = window.filterMainDishMenus(result);
      if(result.length) return result;
      const fallback = Object.keys(MENU_DB||{}).filter(n=>!window.isSideDishMenu(n)).sort(()=>Math.random()-0.5);
      return fallback.slice(0, Math.max(1, (typeof totalMeals==='function'?totalMeals():14)));
    };
  }

  const oldResolveList = window._flowResolveMenuList;
  if(typeof oldResolveList === 'function'){
    window._flowResolveMenuList = _flowResolveMenuList = function(type, styles, seed){
      let result = oldResolveList.apply(this, arguments) || [];
      result = window.filterMainDishMenus(result);
      if(result.length) return result;
      const fallback = Object.keys(MENU_DB||{}).filter(n=>!window.isSideDishMenu(n)).sort(()=>Math.random()-0.5);
      return fallback.slice(0, Math.max(1, (typeof totalMeals==='function'?totalMeals():14)));
    };
  }

  const oldFindSimilar = window.findSimilarMenus;
  if(typeof oldFindSimilar === 'function'){
    window.findSimilarMenus = findSimilarMenus = function(selected, exclude){
      return window.filterMainDishMenus(oldFindSimilar.apply(this, arguments) || []);
    };
  }

  const oldFlowCreatePlan = window.flowCreatePlan;
  if(typeof oldFlowCreatePlan === 'function'){
    window.flowCreatePlan = flowCreatePlan = function(menus, tip){
      const mainMenus = window.filterMainDishMenus((menus||[]).map(m=>typeof flowMenuDBName==='function'?flowMenuDBName(m):m));
      return oldFlowCreatePlan.call(this, mainMenus, tip);
    };
  }

  const sideCount = Object.keys(MENU_DB||{}).filter(n=>window.isSideDishMenu(n)).length;
  window.WM_SIDE_DISH_CLASSIFICATION_V1 = {
    applied:true,
    sideCount,
    examples:['가지나물','오이소박이','깻잎무침','취나물','취나물무침'],
    note:'반찬류는 DB에 유지하되 메인 식단 추천/자동생성 후보에서 제외'
  };
  console.info('[wm side dish classification v1]', window.WM_SIDE_DISH_CLASSIFICATION_V1);
})();
/* ===== /side-dish-classification-patch-v1 ===== */


/* ===== side-dish-classification-patch-v2-expanded ===== */
/* ===== SIDE DISH CLASSIFICATION PATCH v2 EXPANDED =====
   목적: 반찬으로 보이는 메뉴를 실제 side/반찬으로 이동하고 메인 식단 후보에서 제외.
   유지 원칙: MENU_DB에는 보존, 자동 추천/자동 생성에서는 제외.
*/
(function(){
  const SIDE_DISH_EXACT_V2 = new Set([
    // 나물류
    '가지나물','취나물','취나물무침','시금치나물','고사리나물','무나물','숙주나물','호박나물','참나물무침','고구마순나물','콩나물무침','미나리무침','도라지무침','시래기나물','곤드레나물','깻순나물',
    // 무침류
    '깻잎무침','오이무침','오이소박이','무생채','더덕무침','파래무침','진미채무침','북어채무침','오이지무침','도토리묵무침','골뱅이무침','건새우미역무침','브로콜리두부무침',
    // 볶음 반찬류
    '멸치볶음','잔멸치볶음','어묵볶음','감자볶음','진미채볶음','오징어채볶음','가지볶음','애호박볶음','버섯볶음','마늘종볶음','미역줄기볶음','청경채볶음','버섯굴소스볶음',
    // 조림 반찬류
    '연근조림','알감자조림','감자조림','두부조림','콩조림','우엉조림','장조림','메추리알장조림',
    // 김치/절임류
    '김치','배추김치','부추김치','깍두기','단무지','피클','오이지','깻잎장아찌','마늘장아찌','양파장아찌','장아찌','물김치','총각김치','파김치','열무김치','겉절이','배추겉절이',
    // 단품 반찬/양념류
    '계란후라이','계란말이','계란찜','상추','깻잎','쌈장','고추장','된장','참기름','간장','양배추쌈','김','구운김','묵사발'
  ]);

  const SIDE_SUFFIX_RE_V2 = /(나물|소박이|김치|깍두기|무침|생채|겉절이|장아찌|피클|오이지)$/;
  const SIDE_JORIM_EXACT_RE_V2 = /^(연근|알감자|감자|두부|콩|우엉|메추리알)조림$/;
  const SIDE_BOKKEUM_EXACT_RE_V2 = /^(멸치|잔멸치|어묵|감자|진미채|오징어채|가지|애호박|버섯|마늘종|미역줄기)볶음$/;
  const MAIN_FORCE_RE_V2 = /(비빔밥|덮밥|국밥|볶음밥|솥밥|라이스|카레|파스타|라멘|우동|국수|냉면|탕|국|찌개|전골|찜|구이|스테이크|수프|스튜|샐러드|샌드위치|버거|타코|부리또|커리|포케|랩)$/;

  function norm(v){ return String(v||'').replace(/\s+/g,'').trim(); }
  function hasTag(entry, word){ return Array.isArray(entry?.tags) && entry.tags.some(t=>String(t).includes(word)); }
  function isSideNameV2(name){
    const n=norm(name);
    if(!n) return false;
    if(SIDE_DISH_EXACT_V2.has(n)) return true;
    if(MAIN_FORCE_RE_V2.test(n)) return false;
    return SIDE_SUFFIX_RE_V2.test(n) || SIDE_JORIM_EXACT_RE_V2.test(n) || SIDE_BOKKEUM_EXACT_RE_V2.test(n);
  }

  const oldIsSideDishMenu = window.isSideDishMenu;
  window.isSideDishMenu = function(name){
    const n=norm(name);
    const entry=(typeof MENU_DB!=='undefined') ? (MENU_DB[name] || MENU_DB[n]) : null;
    if(!n) return false;
    if(isSideNameV2(n)) return true;
    if(entry && (entry.baseId==='banchan' || entry.baseName==='반찬' || entry.mealRole==='side' || hasTag(entry,'반찬'))) return true;
    return typeof oldIsSideDishMenu==='function' ? oldIsSideDishMenu(name) : false;
  };

  function applySideClassificationV2(){
    if(typeof MENU_DB==='undefined') return;
    Object.keys(MENU_DB).forEach(function(name){
      const m=MENU_DB[name];
      if(!m) return;
      if(window.isSideDishMenu(name)){
        m.mealRole='side';
        m.category='반찬';
        m.menuType='side';
        m.sideCategory='반찬';
        m.excludeFromMainPlan=true;
        m.baseId = m.baseId || 'banchan';
        m.baseName = m.baseName || '반찬';
        m.tags=[...new Set([...(m.tags||[]),'반찬','side','메인추천제외'])];
      } else {
        if(!m.mealRole) m.mealRole='main';
      }
    });
  }

  window.filterMainDishMenus = function(list){
    return [...new Set((list||[]).filter(n=>MENU_DB && MENU_DB[n] && !window.isSideDishMenu(n)))];
  };
  window.isMainDishMenu = function(name){
    return !!(name && MENU_DB && MENU_DB[name] && !window.isSideDishMenu(name));
  };

  applySideClassificationV2();

  // 스타일별 추천 맵에서 반찬 제거
  if(typeof FLOW_STYLE_MENU_MAP==='object'){
    Object.keys(FLOW_STYLE_MENU_MAP).forEach(function(style){
      FLOW_STYLE_MENU_MAP[style]=window.filterMainDishMenus(FLOW_STYLE_MENU_MAP[style]);
    });
  }

  // 그룹 DB의 반찬 그룹은 유지하되, 메인 추천 그룹으로 쓰이지 않도록 마킹
  if(typeof MENU_GROUP_DB_V3==='object' && MENU_GROUP_DB_V3.banchan){
    MENU_GROUP_DB_V3.banchan.mealRole='side';
    MENU_GROUP_DB_V3.banchan.excludeFromMainPlan=true;
  }

  // 혹시 이전 래핑 이후에도 들어오는 리스트를 한 번 더 정화
  const oldFlowBuildMenu2 = window.flowBuildMenu;
  if(typeof oldFlowBuildMenu2==='function'){
    window.flowBuildMenu = flowBuildMenu = function(type, styles, baseMenus){
      const result = window.filterMainDishMenus(oldFlowBuildMenu2.apply(this, arguments) || []);
      if(result.length) return result;
      return Object.keys(MENU_DB||{}).filter(n=>!window.isSideDishMenu(n)).sort(()=>Math.random()-0.5).slice(0, Math.max(1, typeof totalMeals==='function'?totalMeals():14));
    };
  }

  const oldResolveList2 = window._flowResolveMenuList;
  if(typeof oldResolveList2==='function'){
    window._flowResolveMenuList = _flowResolveMenuList = function(type, styles, seed){
      const result = window.filterMainDishMenus(oldResolveList2.apply(this, arguments) || []);
      if(result.length) return result;
      return Object.keys(MENU_DB||{}).filter(n=>!window.isSideDishMenu(n)).sort(()=>Math.random()-0.5).slice(0, Math.max(1, typeof totalMeals==='function'?totalMeals():14));
    };
  }

  const sideNames = Object.keys(MENU_DB||{}).filter(n=>window.isSideDishMenu(n));
  window.WM_SIDE_DISH_CLASSIFICATION_V2 = {
    applied:true,
    sideCount:sideNames.length,
    movedExamples:sideNames.slice(0,80),
    note:'반찬류를 side/반찬으로 이동하고 메인 식단 추천/자동생성 후보에서 제외'
  };
  console.info('[wm side dish classification v2]', window.WM_SIDE_DISH_CLASSIFICATION_V2);
})();
/* ===== /side-dish-classification-patch-v2-expanded ===== */


/* ===== smart-global-side-recommendation-v1 ===== */
/* ===== SMART GLOBAL SIDE RECOMMENDATION PATCH v1 =====
   목적:
   - 외국 음식에 김치/나물 fallback이 붙는 문제 제거
   - 메뉴의 style/styles/baseName/메뉴명 키워드 기반으로 국가·스타일별 사이드 추천
   - 한식은 기존 한식 반찬 추천을 유지하되, 외국 메뉴는 글로벌 fallback 사용
*/
(function(){
  const oldGetSides = typeof window.getSides === 'function' ? window.getSides : null;
  const KOREAN_SIDE_WORD_RE = /(김치|깍두기|나물|시금치나물|콩나물무침|무나물|겉절이|멸치볶음)/;
  const GENERIC_KOREAN_SIDE_SET = new Set(['김치','나물','시금치나물','콩나물무침','무나물','깍두기','겉절이','멸치볶음']);

  const CUISINE_SIDES = {
    korean:['김치','계란말이','시금치나물'],
    japanese:['미소국','단무지','오이절임'],
    chinese:['단무지','오이무침','양파절임'],
    western:['그린샐러드','마늘빵','수프'],
    italian:['루꼴라샐러드','마늘빵','올리브'],
    american:['콜슬로','피클','감자튀김'],
    french:['그린샐러드','바게트','수프'],
    spanish:['올리브','빵','샐러드'],
    greek:['그릭샐러드','피타빵','차지키'],
    thai:['쏨땀','스프링롤','라임'],
    vietnamese:['피클채소','숙주','라임'],
    indonesian:['크루폭','오이절임','삼발'],
    malaysian:['오이절임','크루폭','삼발'],
    singapore:['오이절임','칠리소스','숙주'],
    filipino:['아차라','마늘밥','오이샐러드'],
    taiwanese:['오이절임','청경채볶음','계란국'],
    indian:['난','라이타','처트니'],
    middleeast:['피타빵','후무스','타불레'],
    turkish:['피타빵','요거트소스','양파샐러드'],
    mexican:['과카몰레','살사','사워크림'],
    brazilian:['비나그레치','샐러드','파로파'],
    argentinian:['치미추리','샐러드','감자구이'],
    peruvian:['살사크리올라','라임','샐러드'],
    moroccan:['쿠스쿠스','올리브','요거트소스'],
    ethiopian:['인제라','렌틸샐러드','요거트'],
    global:['그린샐러드','피클','수프']
  };

  const MENU_KEYWORD_SIDES = [
    // 한식 명확 매칭
    {re:/(찌개|탕|국|국밥|비빔밥|제육|불고기|갈비찜|닭볶음탕|삼겹살|보쌈|수육|잡채|냉면|떡볶이|감자탕|설렁탕|육개장|삼계탕)/, cuisine:'korean'},
    // 일식
    {re:/(라멘|우동|소바|가츠|카츠|돈카츠|오야코동|규동|텐동|우나동|스시|초밥|데리야키|데리야끼|가라아게|샤부샤부)/, cuisine:'japanese'},
    // 중식
    {re:/(짜장|짬뽕|마파|탕수육|깐풍|라조기|마라|딤섬|광동|사천|중화|중식)/, cuisine:'chinese'},
    {re:/(파스타|리조또|스테이크|피자|샌드위치|버거|수프|스튜|그라탕|뇨키)/, cuisine:'western'},
    {re:/(알리오|봉골레|카르보나라|마르게리타|라자냐|브루스케타|미네스트로네|포카치아)/, cuisine:'italian'},
    {re:/(파에야|감바스|가스파초|타파스)/, cuisine:'spanish'},
    {re:/(그릭|기로스|무사카|수블라키)/, cuisine:'greek'},
    // 동남아
    {re:/(팟타이|팟씨유|똠얌|똠양|그린커리|레드커리|태국|타이)/, cuisine:'thai'},
    {re:/(쌀국수|반미|분짜|포보|포가|베트남)/, cuisine:'vietnamese'},
    {re:/(나시고렝|미고렝|사테|렌당|인도네시아)/, cuisine:'indonesian'},
    {re:/(락사|나시르막|말레이시아)/, cuisine:'malaysian'},
    {re:/(하이난|칠리크랩|싱가포르)/, cuisine:'singapore'},
    {re:/(아도보|시니강|판싯|필리핀)/, cuisine:'filipino'},
    {re:/(루러우판|우육면|대만)/, cuisine:'taiwanese'},
    // 인도/중동
    {re:/(커리|카레|탄두리|버터치킨|비리야니|달커리|마살라|인도)/, cuisine:'indian'},
    {re:/(케밥|팔라펠|후무스|쿠스쿠스|타진|샥슈카|중동|터키)/, cuisine:'middleeast'},
    // 아메리카
    {re:/(타코|부리토|엔칠라다|퀘사디야|나초|멕시코)/, cuisine:'mexican'},
    {re:/(슈하스코|페이조아다|브라질)/, cuisine:'brazilian'},
    {re:/(아사도|엠파나다|아르헨티나)/, cuisine:'argentinian'},
    {re:/(세비체|페루)/, cuisine:'peruvian'}
  ];

  const STYLE_TO_CUISINE = [
    {keys:['한식','한국','korean'], cuisine:'korean'},
    {keys:['일식','일본','japanese','japan'], cuisine:'japanese'},
    {keys:['중식','중국','chinese','china'], cuisine:'chinese'},
    
    {keys:['이탈리아','italian','italy'], cuisine:'italian'},
    {keys:['미국','american','usa'], cuisine:'american'},
    {keys:['프랑스','french','france'], cuisine:'french'},
    {keys:['스페인','spanish','spain'], cuisine:'spanish'},
    {keys:['그리스','greek','greece'], cuisine:'greek'},
    {keys:['태국','타이','thai','thailand'], cuisine:'thai'},
    {keys:['베트남','vietnam','vietnamese'], cuisine:'vietnamese'},
    {keys:['인도네시아','indonesia','indonesian'], cuisine:'indonesian'},
    {keys:['말레이시아','malaysia','malaysian'], cuisine:'malaysian'},
    {keys:['싱가포르','singapore'], cuisine:'singapore'},
    {keys:['필리핀','philippines','filipino'], cuisine:'filipino'},
    {keys:['대만','taiwan','taiwanese'], cuisine:'taiwanese'},
    {keys:['인도','indian','india'], cuisine:'indian'},
    {keys:['중동','middle','arab','터키','turkish','turkey'], cuisine:'middleeast'},
    {keys:['멕시코','mexican','mexico'], cuisine:'mexican'},
    {keys:['브라질','brazil','brazilian'], cuisine:'brazilian'},
    {keys:['아르헨티나','argentina','argentinian'], cuisine:'argentinian'},
    {keys:['페루','peru','peruvian'], cuisine:'peruvian'},
    {keys:['모로코','morocco','moroccan'], cuisine:'moroccan'},
    {keys:['에티오피아','ethiopia','ethiopian'], cuisine:'ethiopian'}
  ];

  function cleanStyleText(v){
    return String(v||'').replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]/gu,'').replace(/[^0-9A-Za-z가-힣]/g,' ').trim().toLowerCase();
  }
  function unique(arr){ return [...new Set((arr||[]).filter(Boolean))]; }
  function getEntry(name){ return (typeof MENU_DB !== 'undefined' && MENU_DB) ? MENU_DB[name] : null; }
  function styleTexts(name){
    const e=getEntry(name)||{};
    return unique([e.style, e.baseName, ...(Array.isArray(e.styles)?e.styles:[]), ...(Array.isArray(e.tags)?e.tags:[])]).map(cleanStyleText);
  }
  function detectCuisine(name){
    const n=String(name||'');
    const styles=styleTexts(n);
    for(const s of styles){
      for(const row of STYLE_TO_CUISINE){
        if(row.keys.some(k=>s.includes(cleanStyleText(k)))) return row.cuisine;
      }
    }
    for(const row of MENU_KEYWORD_SIDES){
      if(row.re.test(n)) return row.cuisine;
    }
    return 'global';
  }
  function looksKoreanCuisine(cuisine){ return cuisine === 'korean'; }
  function looksForeignCuisine(cuisine){ return cuisine && cuisine !== 'korean' && cuisine !== 'global'; }
  function sanitizeSidesForCuisine(sides, cuisine){
    let out=unique(sides||[]).filter(Boolean);
    if(looksForeignCuisine(cuisine)){
      out=out.filter(s=>!GENERIC_KOREAN_SIDE_SET.has(s) && !KOREAN_SIDE_WORD_RE.test(s));
    }
    return out.slice(0,3);
  }

  window.getSmartSides = function(name, type){
    if(type === '아침') return [];
    const cuisine = detectCuisine(name);

    // 한식은 기존 상세 매핑을 최대한 유지한다.
    if(looksKoreanCuisine(cuisine) && oldGetSides){
      const oldSides = sanitizeSidesForCuisine(oldGetSides(name,type), cuisine);
      return oldSides.length ? oldSides : CUISINE_SIDES.korean;
    }

    // 외국 음식은 기존 함수가 김치/나물을 섞어 반환하면 버리고, 국가/스타일 매핑을 우선한다.
    if(oldGetSides){
      const oldSides = sanitizeSidesForCuisine(oldGetSides(name,type), cuisine);
      if(looksForeignCuisine(cuisine) && oldSides.length >= 2 && !oldSides.some(s=>KOREAN_SIDE_WORD_RE.test(s))){
        return oldSides.slice(0,3);
      }
    }

    return (CUISINE_SIDES[cuisine] || CUISINE_SIDES.global).slice(0,3);
  };

  window.getSides = getSides = function(name, type){
    return window.getSmartSides(name, type);
  };

  // 이미 생성된 식단에 붙어있는 한식 fallback성 사이드도 화면 진입 시 교체될 수 있도록 유틸 제공
  window.refreshMealSidesByCuisine = function(){
    const patchMeal = function(meal){
      if(!meal || !meal.name) return;
      meal.sides = window.getSmartSides(meal.name, meal.type);
    };
    try{
      if(S && S.mealPlan && Array.isArray(S.mealPlan.weeklyMeal)){
        S.mealPlan.weeklyMeal.forEach(d=>(d.meals||[]).forEach(patchMeal));
        if(typeof saveMeal === 'function') saveMeal();
      }
      if(S && S.mealCalendar){
        Object.values(S.mealCalendar).forEach(list=>(list||[]).forEach(patchMeal));
        localStorage.setItem('wm_cal', JSON.stringify(S.mealCalendar));
      }
      return true;
    }catch(e){ console.warn('[smart sides] refresh failed', e); return false; }
  };

  window.WM_SMART_GLOBAL_SIDES_V1 = {
    applied:true,
    mode:'style/country based side recommendation',
    foreignKimchiNamulFallbackBlocked:true,
    cuisines:Object.keys(CUISINE_SIDES),
    examples:{
      korean:window.getSmartSides('김치찌개','점심'),
      italian:window.getSmartSides('카르보나라','점심'),
      thai:window.getSmartSides('팟타이','점심'),
      mexican:window.getSmartSides('타코','점심'),
      indian:window.getSmartSides('버터치킨','점심')
    }
  };
  console.info('[wm smart global sides v1]', window.WM_SMART_GLOBAL_SIDES_V1);
})();
/* ===== /smart-global-side-recommendation-v1 ===== */


/* ===== ingredient-only-nutrition-v2 ===== */
(function(){
  /* ===== INGREDIENT-ONLY NUTRITION v2 =====
     최종 구조: MENU_DB / MENU_SCHEMA_V2 → 재료명+중량 → NUTRITION_DB 100g 기준 합산.
     MENU_NUT, WM_NUT_PATCH, 키워드 추정값, 메뉴 고정 kcal fallback은 사용하지 않는다.
  */
  window.MENU_NUT_DISABLED = true;
  window.WM_NUT_PATCH = Object.freeze({});
  window.WM_INGREDIENT_ONLY_NUTRITION = {active:true, version:'v2', tolerance:'±5%', menuNutDisabled:true, fallback:'none'};

  function norm(v){ return String(v||'').replace(/\s+/g,'').trim(); }
  function nval(v){
    var str=String(v||'').replace(/,/g,'').trim();
    var frac=str.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if(frac) return Number(frac[1])/Math.max(1,Number(frac[2]));
    var m=str.match(/\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : 0;
  }
  function grams(amount, ingId){
    var str=String(amount||'').toLowerCase();
    var num=nval(str); if(!num) return 0;
    var g=num;
    if(/kg/.test(str)) g=num*1000;
    else if(/ml/.test(str)) g=num;
    else if(/l\b/.test(str)) g=num*1000;
    else if(/큰술|tbsp/.test(str)) g=num*12;
    else if(/작은술|tsp/.test(str)) g=num*4;
    else if(/컵|cup/.test(str)) g=num*200;
    else if(/공기/.test(str)) g=num*210;
    else if(/개|장|쪽|알|마리|줄기|포기|캔|팩|봉/.test(str)) g=num*50;
    if(/oil|기름|튀김유|식용유|olive_oil|cooking_oil/.test(String(ingId||''))) g*=0.18;
    return g;
  }
  function nutritionRow(ingId, ingName){
    var db=window.NUTRITION_DB||{};
    if(db[ingName]) return db[ingName];
    if(db[ingId]) return db[ingId];
    var compact=norm(ingName);
    var key=Object.keys(db).find(function(k){ return norm(k)===compact || compact.indexOf(norm(k))>=0 || norm(k).indexOf(compact)>=0; });
    return key ? db[key] : null;
  }
  function findMenu(name){
    var raw=String(name||'').trim();
    if(window.MENU_SCHEMA_V2 && MENU_SCHEMA_V2[raw]) return {type:'schema', key:raw, row:MENU_SCHEMA_V2[raw]};
    if(window.MENU_DB && MENU_DB[raw]) return {type:'menu', key:raw, row:MENU_DB[raw]};
    var compact=norm(raw);
    if(window.MENU_SCHEMA_V2){
      var sk=Object.keys(MENU_SCHEMA_V2).find(function(k){return norm(k)===compact;});
      if(sk) return {type:'schema', key:sk, row:MENU_SCHEMA_V2[sk]};
    }
    if(window.MENU_DB){
      var mk=Object.keys(MENU_DB).find(function(k){return norm(k)===compact;});
      if(mk) return {type:'menu', key:mk, row:MENU_DB[mk]};
    }
    return null;
  }
  function calcFromSchema(key,row){
    if(!row || !row.ingredientAmounts) return null;
    var servings=Math.max(1, Number(row.servings||row.recipeServings||1)||1);
    var total={cal:0,carb:0,fat:0,pro:0};
    var used=[], missing=[];
    Object.keys(row.ingredientAmounts).forEach(function(ingId){
      var amount=row.ingredientAmounts[ingId];
      var ingName=(window.INGREDIENT_DB_V2 && INGREDIENT_DB_V2[ingId] && INGREDIENT_DB_V2[ingId].name) ? INGREDIENT_DB_V2[ingId].name : ingId;
      var nut=nutritionRow(ingId, ingName);
      var g=grams(amount, ingId);
      if(!nut || !g){ missing.push(ingName); return; }
      var r=g/100;
      total.cal+=(Number(nut.cal)||0)*r; total.carb+=(Number(nut.carb)||0)*r; total.fat+=(Number(nut.fat)||0)*r; total.pro+=(Number(nut.pro)||0)*r;
      used.push({name:ingName, amount:amount, grams:Math.round(g)});
    });
    return finish(total, servings, used, missing, key);
  }
  function calcFromMenuDB(key,row){
    if(!row || !Array.isArray(row.ingredients)) return null;
    var servings=Math.max(1, Number(row.servings||row.recipeServings||1)||1);
    var total={cal:0,carb:0,fat:0,pro:0};
    var used=[], missing=[];
    row.ingredients.forEach(function(item){
      var ingName=typeof item==='string' ? item : (item.name||item.id||'');
      var amount=typeof item==='string' ? (item.amount||'100g') : (item.amount||item.qty||item.quantity||'100g');
      var nut=nutritionRow(ingName, ingName);
      var g=grams(amount, ingName);
      if(!nut || !g){ missing.push(ingName); return; }
      var r=g/100;
      total.cal+=(Number(nut.cal)||0)*r; total.carb+=(Number(nut.carb)||0)*r; total.fat+=(Number(nut.fat)||0)*r; total.pro+=(Number(nut.pro)||0)*r;
      used.push({name:ingName, amount:amount, grams:Math.round(g)});
    });
    return finish(total, servings, used, missing, key);
  }
  function finish(total, servings, used, missing, key){
    if(!used.length) return {cal:0,carb:0,fat:0,pro:0,calLo:0,calHi:0,calRange:'0~0kcal',serving:'1인분',source:'재료영양합산: 재료 영양DB 미매칭',verified:false,usedIngredients:[],missingIngredients:[...new Set(missing)]};
    var per={cal:total.cal/servings, carb:total.carb/servings, fat:total.fat/servings, pro:total.pro/servings};
    var cal=Math.round(per.cal), lo=Math.round(per.cal*0.95), hi=Math.round(per.cal*1.05);
    return {cal:cal, carb:Math.round(per.carb), fat:Math.round(per.fat), pro:Math.round(per.pro), calLo:lo, calHi:hi, calRange:lo+'~'+hi+'kcal', serving:'1인분', source:'재료영양합산', verified:true, usedIngredients:used, missingIngredients:[...new Set(missing)], menu:key};
  }
  function calcIngredientOnly(menuName){
    var found=findMenu(menuName);
    if(!found) return {cal:0,carb:0,fat:0,pro:0,calLo:0,calHi:0,calRange:'0~0kcal',serving:'1인분',source:'재료영양합산: 메뉴 미매칭',verified:false,usedIngredients:[],missingIngredients:[]};
    return found.type==='schema' ? calcFromSchema(found.key, found.row) : calcFromMenuDB(found.key, found.row);
  }
  window.getMenuNut=function(name){ return calcIngredientOnly(name); };
  window.calcNutrition=function(menuName, people){ return calcIngredientOnly(menuName); };
  console.info('[ingredient-only nutrition v2] MENU_NUT/WM_NUT_PATCH disabled; calcNutrition uses ingredients only.');
})();
/* ===== /ingredient-only-nutrition-v2 ===== */


/* ===== diet-tag-audit-safe-v2 ===== */
(function(){
  const DIET_RULE = window.WM_DIET_RULE = {
    maxCal: 650,
    minProtein: 25,
    maxCarb: 80,
    maxFat: 30
  };

  const SIDE_WORDS = ['반찬','나물','무침','장아찌','피클','김치','깍두기','단무지','오이지','조림반찬'];
  const COUNTRY_STYLES = ['한식','일식','중식','태국','베트남','인도네시아','말레이시아','싱가포르','필리핀','대만','인도','중동','터키','그리스','스페인','프랑스','이탈리아','독일','포르투갈','러시아','폴란드','스웨덴','체코','멕시코','미국','아르헨티나','브라질','페루','콜롬비아','자메이카','모로코','에티오피아','나이지리아','튀니지'];

  function arr(v){ return Array.isArray(v) ? v.slice() : (v ? [v] : []); }
  function uniq(a){ return [...new Set((a||[]).filter(Boolean))]; }
  function addOnce(a,v){ if(!a.includes(v)) a.push(v); return a; }
  function stripFlags(s){ return String(s||'').replace(/^[\uD800-\uDBFF][\uDC00-\uDFFF]\s*/,'').replace(/^\S+\s+/,'').trim(); }

  function isSideMenu(name,m){
    const base = String(m.baseName || m.baseId || m.category || '').toLowerCase();
    if(m.mealRole === 'side' || m.excludeFromMainPlan === true || m.category === '반찬') return true;
    if(String(m.baseName||'').includes('반찬') || String(m.baseId||'').includes('banchan')) return true;
    const n = String(name || m.name || '');
    return SIDE_WORDS.some(w => n.includes(w)) && !/(덮밥|비빔밥|볶음밥|찌개|탕|국|파스타|라멘|우동|카레|커리|스테이크|포케|샐러드|볼|랩|샌드위치|타코|부리또|쌀국수|분짜|반미)/.test(n);
  }

  function inferCountryStyle(name,m){
    const styles = uniq(arr(m.styles).concat(arr(m.style)).map(stripFlags));
    const existing = styles.find(s => COUNTRY_STYLES.includes(s));
    if(existing) return existing;
    const n = String(name || m.name || '');
    const base = String(m.baseName || '');
    if(/비빔밥|덮밥|김밥|찌개|탕|국|구이|제육|불고기|두부|김치|현미볼|양배추참치/.test(n+base)) return '한식';
    if(/라멘|우동|소바|돈부리|규동|가츠|스시|사시미|데리야키|포케/.test(n+base)) return '일식';
    if(/마파|짜장|짬뽕|우육면|탕수육|깐풍|칠리새우|딤섬|완탕/.test(n+base)) return '중식';
    if(/팟타이|똠|쏨땀|카오|태국|그린커리|레드커리/.test(n+base)) return '태국';
    if(/쌀국수|분짜|반미|월남쌈|반쎄오|고이꾸온/.test(n+base)) return '베트남';
    if(/나시고랭|미고랭|렌당|가도가도|사테/.test(n+base)) return '인도네시아';
    if(/락사|하이난|칠리크랩|바쿠테|나시르막/.test(n+base)) return '싱가포르';
    if(/아도보|시니강/.test(n+base)) return '필리핀';
    if(/비리야니|탄두리|티카|마살라|차나|달커리|팔락|커리/.test(n+base)) return '인도';
    if(/타코|부리또|퀘사디야|엔칠라다|칠리콘카르네|살사|과카몰/.test(n+base)) return '멕시코';
    if(/버거|클램차우더|팬케이크|와플|콥샐러드|BLT|클럽샌드위치/.test(n+base)) return '미국';
    return '기타';
  }

  function normNut(raw){
    raw = raw || {};
    const cal = Number(raw.cal ?? raw.kcal ?? raw.calories ?? raw.energy ?? 0);
    const pro = Number(raw.pro ?? raw.protein ?? raw.protein_g ?? 0);
    const carb = Number(raw.carb ?? raw.carbs ?? raw.carbohydrate ?? raw.carbohydrates ?? raw.carb_g ?? 0);
    const fat = Number(raw.fat ?? raw.fat_g ?? 0);
    return {cal, pro, carb, fat};
  }

  function getNutForDiet(name){
    try{
      if(typeof calcNutrition === 'function') return normNut(calcNutrition(name, 1));
    }catch(e){ console.warn('[diet audit] calcNutrition failed:', name, e); }
    return {cal:0, pro:0, carb:999, fat:999};
  }

  function isDietByRule(nut){
    return nut.cal > 0 &&
      nut.cal <= DIET_RULE.maxCal &&
      nut.pro >= DIET_RULE.minProtein &&
      nut.carb <= DIET_RULE.maxCarb &&
      nut.fat <= DIET_RULE.maxFat;
  }

  function applyDietTagAudit(){
    if(typeof MENU_DB === 'undefined') return null;
    const result = {total:0, main:0, side:0, diet:0, healthyStyle:0, recalcHealthyOnly:0, failedNut:0, rule:DIET_RULE};
    Object.keys(MENU_DB).forEach(function(name){
      const m = MENU_DB[name];
      if(!m || typeof m !== 'object') return;
      result.total++;

      m.tags = uniq(arr(m.tags));
      m.styles = uniq(arr(m.styles).concat(arr(m.style)).map(stripFlags));

      if(isSideMenu(name,m)){
        result.side++;
        m.mealRole = 'side';
        m.category = '반찬';
        m.excludeFromMainPlan = true;
        m.tags = m.tags.filter(t => t !== '다이어트');
        return;
      }
      result.main++;

      // 헬시 단독 스타일은 국가/요리권을 추가해서 국가 카테고리에도 분배한다.
      const hasCountry = m.styles.some(s => COUNTRY_STYLES.includes(s));
      if(!hasCountry || m.style === '헬시'){
        const inferred = inferCountryStyle(name,m);
        if(inferred){
          m.style = inferred;
          addOnce(m.styles, inferred);
          result.recalcHealthyOnly++;
        }
      }

      const nut = getNutForDiet(name);
      if(!nut.cal) result.failedNut++;
      const diet = isDietByRule(nut);
      m.tags = m.tags.filter(t => t !== '다이어트');
      if(diet){
        addOnce(m.tags, '다이어트');
        addOnce(m.styles, '헬시');
        result.diet++;
      }
      if(m.styles.includes('헬시')) result.healthyStyle++;
    });
    window.WM_DIET_AUDIT_RESULT = result;
    console.info('[wm diet tag audit safe v2]', result);
    return result;
  }

  window.applyDietTagAudit = applyDietTagAudit;

  const oldRender = typeof window.render === 'function' ? window.render : null;
  let applied = false;
  function once(){ if(applied) return; applied = true; applyDietTagAudit(); }
  if(oldRender){
    window.render = function(){ once(); return oldRender.apply(this, arguments); };
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', once);
  }else{
    setTimeout(once,0);
  }
})();
/* ===== /diet-tag-audit-safe-v2 ===== */


/* ===== calorie-restore-lexical-db-safe ===== */
(function(){
  /* 기존 데이터는 유지하고, 최종 계산 함수만 재료합산 기준으로 복구한다.
     핵심 수정: const MENU_SCHEMA_V2 / MENU_DB / NUTRITION_DB는 window에 안 붙을 수 있으므로
     window.xxx만 보지 않고 lexical global도 직접 참조한다. */
  function DB(name){
    try{
      if(name==='MENU_SCHEMA_V2' && typeof MENU_SCHEMA_V2!=='undefined') return MENU_SCHEMA_V2;
      if(name==='MENU_DB' && typeof MENU_DB!=='undefined') return MENU_DB;
      if(name==='NUTRITION_DB' && typeof NUTRITION_DB!=='undefined') return NUTRITION_DB;
      if(name==='INGREDIENT_DB_V2' && typeof INGREDIENT_DB_V2!=='undefined') return INGREDIENT_DB_V2;
    }catch(e){}
    return window[name] || null;
  }
  function norm(v){return String(v||'').replace(/[\s_\-·・]/g,'').trim().toLowerCase();}
  function nval(v){
    var s=String(v||'').replace(/,/g,'').trim();
    var f=s.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if(f) return Number(f[1])/Math.max(1,Number(f[2]));
    var m=s.match(/\d+(?:\.\d+)?/); return m?Number(m[0]):0;
  }
  function grams(amount, ingId){
    var s=String(amount||'100g').toLowerCase();
    var num=nval(s); if(!num) return 0;
    var g=num;
    if(/kg/.test(s)) g=num*1000;
    else if(/ml/.test(s)) g=num;
    else if(/\bl\b|리터/.test(s)) g=num*1000;
    else if(/큰술|tbsp/.test(s)) g=num*12;
    else if(/작은술|tsp/.test(s)) g=num*4;
    else if(/컵|cup/.test(s)) g=num*200;
    else if(/공기/.test(s)) g=num*210;
    else if(/모/.test(s)) g=num*300;
    else if(/개|장|쪽|알|마리|줄기|포기|캔|팩|봉/.test(s)) g=num*50;
    else if(/g/.test(s)) g=num;
    else g=num;
    if(/oil|기름|튀김유|식용유|olive_oil|cooking_oil/.test(String(ingId||''))) g*=0.18;
    return g;
  }
  function getIngredientName(id){
    var ingDB=DB('INGREDIENT_DB_V2')||{};
    var row=ingDB[id];
    return row ? (row.name || row.ko || row.label || id) : id;
  }
  function nutritionRow(id,name){
    var nutDB=DB('NUTRITION_DB')||{};
    var candidates=[id,name,getIngredientName(id)].filter(Boolean);
    for(var i=0;i<candidates.length;i++) if(nutDB[candidates[i]]) return nutDB[candidates[i]];
    var cn=candidates.map(norm).filter(Boolean);
    var keys=Object.keys(nutDB);
    for(var k=0;k<keys.length;k++){
      var nk=norm(keys[k]);
      if(cn.some(function(c){return c===nk || c.indexOf(nk)>=0 || nk.indexOf(c)>=0;})) return nutDB[keys[k]];
    }
    return null;
  }
  function findMenu(name){
    var raw=String(name||'').trim(), c=norm(raw);
    var schema=DB('MENU_SCHEMA_V2')||{};
    var menu=DB('MENU_DB')||{};
    if(schema[raw]) return {type:'schema',key:raw,row:schema[raw]};
    if(menu[raw]) return {type:'menu',key:raw,row:menu[raw]};
    var sk=Object.keys(schema).find(function(k){return norm(k)===c;});
    if(sk) return {type:'schema',key:sk,row:schema[sk]};
    var mk=Object.keys(menu).find(function(k){return norm(k)===c;});
    if(mk) return {type:'menu',key:mk,row:menu[mk]};
    return null;
  }
  function finish(total, servings, used, missing, key){
    servings=Math.max(1,Number(servings)||1);
    var per={cal:total.cal/servings, carb:total.carb/servings, fat:total.fat/servings, pro:total.pro/servings};
    var cal=Math.round(per.cal), lo=Math.round(per.cal*0.95), hi=Math.round(per.cal*1.05);
    return {cal:cal,carb:Math.round(per.carb),fat:Math.round(per.fat),pro:Math.round(per.pro),calLo:lo,calHi:hi,calRange:lo+'~'+hi+'kcal',serving:'1인분',source:'재료영양합산',verified:used.length>0,usedIngredients:used,missingIngredients:[...new Set(missing)],menu:key};
  }
  function calcFromSchema(key,row){
    if(!row || !row.ingredientAmounts) return null;
    var total={cal:0,carb:0,fat:0,pro:0}, used=[], missing=[];
    Object.keys(row.ingredientAmounts).forEach(function(id){
      var amount=row.ingredientAmounts[id], name=getIngredientName(id), nut=nutritionRow(id,name), g=grams(amount,id);
      if(!nut || !g){missing.push(name||id); return;}
      var r=g/100;
      total.cal+=(Number(nut.cal)||0)*r; total.carb+=(Number(nut.carb)||0)*r; total.fat+=(Number(nut.fat)||0)*r; total.pro+=(Number(nut.pro)||0)*r;
      used.push({name:name,amount:amount,grams:Math.round(g)});
    });
    return finish(total,row.servings||row.recipeServings||1,used,missing,key);
  }
  function calcFromMenu(key,row){
    if(!row || !Array.isArray(row.ingredients)) return null;
    var total={cal:0,carb:0,fat:0,pro:0}, used=[], missing=[];
    row.ingredients.forEach(function(item){
      var name='', id='', amount='100g';
      if(typeof item==='string'){ name=item; id=item; amount='100g'; }
      else { name=item.name||item.ko||item.id||''; id=item.id||name; amount=item.amount||item.qty||item.quantity||'100g'; }
      var nut=nutritionRow(id,name), g=grams(amount,id||name);
      if(!nut || !g){missing.push(name||id); return;}
      var r=g/100;
      total.cal+=(Number(nut.cal)||0)*r; total.carb+=(Number(nut.carb)||0)*r; total.fat+=(Number(nut.fat)||0)*r; total.pro+=(Number(nut.pro)||0)*r;
      used.push({name:name,amount:amount,grams:Math.round(g)});
    });
    return finish(total,row.servings||row.recipeServings||1,used,missing,key);
  }
  function calc(menuName){
    var f=findMenu(menuName);
    if(!f) return {cal:0,carb:0,fat:0,pro:0,calLo:0,calHi:0,calRange:'0~0kcal',serving:'1인분',source:'메뉴 미매칭',verified:false,usedIngredients:[],missingIngredients:[]};
    var r=f.type==='schema'?calcFromSchema(f.key,f.row):calcFromMenu(f.key,f.row);
    return r || {cal:0,carb:0,fat:0,pro:0,calLo:0,calHi:0,calRange:'0~0kcal',serving:'1인분',source:'재료 없음',verified:false,usedIngredients:[],missingIngredients:[]};
  }
  window.calcNutrition=function(menuName,people){return calc(menuName);};
  window.getMenuNut=function(menuName){return calc(menuName);};
  window.WM_CALORIE_RESTORED=true;
  console.info('[calorie restore] calcNutrition/getMenuNut restored with lexical DB access');
})();


/* ===== SCHEDULE STRICT PATCH: 선택한 끼니 수만 식단 생성 =====
   목적: 사용자가 8끼를 선택하면 정확히 8끼만 생성.
   기존 일부 flowCreatePlan/flowCreateCalendar 내부의 ['점심','저녁'] fallback이
   미선택 요일에도 2끼를 강제로 만들어 14끼가 되는 문제를 차단한다. */
(function(){
  function _wmSelectedSlots(day){
    if(!window.S || !S.schedule || !Array.isArray(S.schedule[day])) return [];
    return S.schedule[day].filter(function(m){ return ['아침','점심','저녁'].includes(m); });
  }
  function _wmScheduleMealCount(){
    if(!window.S || !S.schedule || !Array.isArray(window.DAYS)) return 0;
    return DAYS.reduce(function(sum, day){ return sum + _wmSelectedSlots(day).length; }, 0);
  }
  window.ensureScheduleReady = ensureScheduleReady = function(){
    if(!window.S) return;
    if(!S.schedule || typeof S.schedule !== 'object') S.schedule = {};
    if(Array.isArray(window.DAYS)){
      DAYS.forEach(function(day){ if(!Array.isArray(S.schedule[day])) S.schedule[day] = []; });
    }
    // 여기서 더 이상 미선택 요일에 ['점심','저녁']을 자동 주입하지 않는다.
    // 스케줄 선택은 사용자의 명시 선택값만 신뢰한다.
  };
  window.totalMeals = totalMeals = function(){
    ensureScheduleReady();
    var daily = _wmScheduleMealCount();
    return daily * (S.planDuration || 1);
  };
  window.flowCreatePlan = flowCreatePlan = function(menus, tip){
    ensureScheduleReady();
    var selectedCount = _wmScheduleMealCount();
    if(selectedCount <= 0){
      alert('식단 스케줄에서 생성할 끼니를 먼저 선택해주세요.');
      return false;
    }
    menus = [...new Set((menus || []).map(function(m){ return flowMenuDBName(m); }).filter(function(n){ return MENU_DB && MENU_DB[n]; }))];
    if(!menus.length){
      menus = Object.keys(MENU_DB || {}).filter(function(n){ return !(typeof isSideDishMenu === 'function' && isSideDishMenu(n)); }).sort(function(){ return Math.random() - 0.5; }).slice(0, selectedCount);
    }
    if(!menus.length){ alert('식단을 만들 메뉴가 없습니다. 메뉴를 다시 선택해주세요.'); return false; }

    var weeklyMeal = [], idx = 0;
    DAYS.forEach(function(day){
      var slots = _wmSelectedSlots(day);
      // 미선택 요일은 meals:[]로 보존하되, 끼니를 자동 생성하지 않는다.
      var meals = slots.map(function(type){ return flowMealObj(type, menus[idx++ % menus.length]); });
      weeklyMeal.push({day:day, meals:meals});
    });
    S.mealPlan = {weeklyMeal: weeklyMeal, tip: tip || ''};
    S.mealStartDate = getThisMonday();
    flowCreateCalendar(menus);
    saveMeal();
    localStorage.setItem('wm_cal', JSON.stringify(S.mealCalendar || {}));
    console.info('[schedule strict] generated meals:', idx, 'expected:', selectedCount);
    return true;
  };
  window.flowCreateCalendar = flowCreateCalendar = function(menus){
    ensureScheduleReady();
    menus = [...new Set((menus || []).map(function(m){ return flowMenuDBName(m); }).filter(function(n){ return MENU_DB && MENU_DB[n]; }))];
    var cal = {}, idx = 0;
    var start = new Date(); start.setDate(start.getDate() + 1);
    var days = typeof totalDays === 'function' ? totalDays() : 7 * (S.planDuration || 1);
    for(var i=0; i<days; i++){
      var d = new Date(start); d.setDate(start.getDate() + i);
      var key = dateKey(d);
      var day = DAYS[(d.getDay() + 6) % 7];
      var slots = _wmSelectedSlots(day);
      cal[key] = slots.map(function(type){ return flowMealObj(type, menus[idx++ % menus.length]); });
    }
    S.mealCalendar = cal;
    localStorage.setItem('wm_cal', JSON.stringify(cal));
    console.info('[schedule strict] calendar meals:', idx, 'expected:', totalMeals());
  };
  window.WM_SCHEDULE_STRICT_PATCH = true;
})();
/* ===== /calorie-restore-lexical-db-safe ===== */


/* ===== portion-audit-fix-v1 ===== */
/* ===== PORTION AUDIT FIX v1: 과고칼로리 메뉴 1인분 재료량 보정 ===== */
(function(){
  const PORTION_FIX = {
  "바쿠테": {
    "pork_rib": "180g",
    "garlic": "6g",
    "pepper": "1g",
    "soy_sauce": "12g",
    "star_anise": "1g",
    "cinnamon": "1g",
    "clove": "0.5g",
    "fish_sauce": "5g",
    "lime": "10g",
    "sugar": "3g"
  },
  "부리또": {
    "tortilla": "60g",
    "rice": "90g",
    "bean": "60g",
    "beef": "90g",
    "cheese": "20g",
    "cumin": "2g",
    "chili_powder": "2g",
    "lettuce": "40g",
    "tomato": "60g",
    "yogurt": "30g",
    "lime": "10g",
    "cilantro": "3g"
  },
  "반쎄오": {
    "rice": "70g",
    "shrimp": "60g",
    "pork": "50g",
    "mung_sprout": "80g",
    "coconut_milk": "60ml",
    "turmeric": "2g",
    "fish_sauce": "8g",
    "lettuce": "50g",
    "mint": "3g",
    "garlic": "5g",
    "lime": "10g",
    "sugar": "4g"
  },
  "나시르막": {
    "rice": "120g",
    "coconut_milk": "60ml",
    "anchovy": "10g",
    "peanut": "15g",
    "egg": "50g",
    "sambal": "15g",
    "cucumber": "60g",
    "garlic": "5g",
    "fish_sauce": "5g",
    "lime": "10g",
    "sugar": "3g"
  },
  "해산물리조또": {
    "rice": "90g",
    "shrimp": "70g",
    "squid": "60g",
    "tomato": "80g",
    "parmesan": "10g",
    "white_wine": "40ml",
    "vegetable_broth": "300ml",
    "garlic": "5g",
    "olive_oil": "8g",
    "pepper": "1g",
    "parsley": "3g",
    "salt": "1g"
  },
  "리조또": {
    "rice": "90g",
    "mushroom": "80g",
    "parmesan": "10g",
    "butter": "8g",
    "onion": "50g",
    "white_wine": "40ml",
    "vegetable_broth": "300ml",
    "garlic": "5g",
    "olive_oil": "6g",
    "pepper": "1g",
    "parsley": "3g",
    "salt": "1g"
  },
  "버섯리조또": {
    "rice": "90g",
    "mushroom": "100g",
    "parmesan": "10g",
    "butter": "8g",
    "onion": "50g",
    "white_wine": "40ml",
    "vegetable_broth": "300ml",
    "garlic": "5g",
    "olive_oil": "6g",
    "pepper": "1g",
    "parsley": "3g",
    "salt": "1g"
  },
  "돈코츠라멘": {
    "ramen": "110g",
    "pork": "0g",
    "egg": "50g",
    "green_onion": "15g",
    "garlic": "5g",
    "ramen_tare": "10g",
    "chashu": "50g",
    "menma": "30g",
    "gim": "3g",
    "sesame": "3g",
    "soy_sauce": "12g",
    "mirin": "8g",
    "dashi": "400ml"
  },
  "미소라멘": {
    "ramen": "110g",
    "miso": "25g",
    "egg": "50g",
    "green_onion": "15g",
    "corn": "40g",
    "ramen_tare": "8g",
    "chashu": "50g",
    "butter": "5g",
    "bean_sprout": "80g",
    "garlic": "5g",
    "soy_sauce": "10g",
    "mirin": "8g",
    "dashi": "400ml"
  },
  "쇼유라멘": {
    "ramen": "110g",
    "soy_sauce": "15g",
    "egg": "50g",
    "green_onion": "15g",
    "pork": "0g",
    "ramen_tare": "8g",
    "chashu": "50g",
    "menma": "30g",
    "gim": "3g",
    "dashi": "400ml",
    "garlic": "5g",
    "mirin": "8g"
  },
  "츠케멘": {
    "ramen": "120g",
    "dashi": "250ml",
    "soy_sauce": "15g",
    "green_onion": "20g",
    "egg": "50g",
    "ramen_tare": "8g",
    "chashu": "50g",
    "menma": "30g",
    "gim": "3g",
    "vinegar": "8g",
    "mirin": "8g"
  },
  "마제소바": {
    "noodle": "170g",
    "pork": "80g",
    "green_onion": "20g",
    "egg": "50g",
    "soy_sauce": "15g",
    "mirin": "8g",
    "dashi": "20ml"
  },
  "크림파스타": {
    "spaghetti": "90g",
    "cream": "80ml",
    "bacon": "35g",
    "onion": "50g",
    "parmesan": "10g",
    "garlic": "6g",
    "salt": "1g",
    "pepper": "1g",
    "parsley": "3g",
    "white_wine": "30ml",
    "olive_oil": "6g"
  },
  "가츠동": {
    "rice": "150g",
    "pork": "100g",
    "egg": "50g",
    "onion": "50g",
    "panko": "25g",
    "dashi": "80ml",
    "mirin": "8g",
    "sugar": "5g",
    "green_onion": "15g",
    "cooking_oil": "5g",
    "soy_sauce": "12g"
  },
  "짜장밥": {
    "rice": "150g",
    "chunjang": "25g",
    "pork": "80g",
    "onion": "80g",
    "zucchini": "60g",
    "salt": "1g",
    "pepper": "1g",
    "sesame": "3g",
    "water": "100ml"
  },
  "짜장면": {
    "noodle": "160g",
    "chunjang": "25g",
    "pork": "80g",
    "onion": "70g",
    "zucchini": "60g",
    "tianmianjiang": "5g",
    "cabbage": "60g",
    "sugar": "5g",
    "oyster_sauce": "8g",
    "starch": "5g",
    "cooking_oil": "6g",
    "water": "100ml",
    "garlic": "5g",
    "ginger": "2g",
    "green_onion": "15g",
    "soy_sauce": "10g",
    "pepper": "1g"
  },
  "텐동": {
    "rice": "150g",
    "shrimp": "80g",
    "eggplant": "60g",
    "pumpkin": "60g",
    "soy_sauce": "12g",
    "flour": "40g",
    "dashi": "80ml",
    "mirin": "8g",
    "sugar": "4g",
    "cooking_oil": "8g"
  },
  "사테아얌": {
    "chicken": "160g",
    "peanut": "20g",
    "soy_sauce": "12g",
    "garlic": "5g",
    "coconut_milk": "60ml",
    "turmeric": "2g",
    "cumin": "2g",
    "lime": "10g",
    "palm_sugar": "5g",
    "fish_sauce": "6g",
    "sugar": "3g"
  },
  "콥샐러드": {
    "lettuce": "100g",
    "egg": "50g",
    "chicken": "120g",
    "bacon": "20g",
    "avocado": "50g",
    "cheese": "20g",
    "olive_oil": "8g",
    "vinegar": "10g",
    "pepper": "1g",
    "salt": "1g",
    "garlic": "3g"
  },
  "장조림버터비빔밥": {
    "rice": "150g",
    "beef": "80g",
    "butter": "8g",
    "egg": "50g",
    "soy_sauce": "15g",
    "garlic": "5g",
    "sugar": "5g",
    "green_onion": "15g"
  },
  "제육볶음": {
    "rice": "150g",
    "pork": "120g",
    "onion": "60g",
    "gochujang": "20g",
    "gochugaru": "5g",
    "soy_sauce": "12g",
    "sugar": "5g",
    "garlic": "6g",
    "sesame_oil": "5g",
    "cooking_oil": "6g"
  },
  "야키소바": {
    "noodle": "160g",
    "pork": "80g",
    "cabbage": "80g",
    "onion": "50g",
    "carrot": "40g",
    "yakisoba_sauce": "10g",
    "ginger": "3g",
    "katsuobushi": "5g",
    "japanese_mayo": "5g",
    "cooking_oil": "6g",
    "soy_sauce": "10g",
    "mirin": "8g",
    "dashi": "20ml"
  },
  "사케동": {
    "rice": "150g",
    "salmon": "100g",
    "wasabi": "5g",
    "gim": "3g",
    "soy_sauce": "10g",
    "avocado": "50g",
    "sesame": "3g",
    "green_onion": "15g",
    "lemon": "10g",
    "mirin": "5g",
    "dashi": "20ml"
  },
  "잡채볶음밥": {
    "rice": "150g",
    "glass_noodle": "25g",
    "pork": "60g",
    "spinach": "50g",
    "carrot": "40g",
    "soy_sauce": "12g",
    "sesame_oil": "5g",
    "garlic": "5g",
    "cooking_oil": "6g"
  },
  "마파두부덮밥": {
    "rice": "150g",
    "tofu": "150g",
    "pork": "70g",
    "doubanjiang": "12g",
    "green_onion": "15g",
    "garlic": "5g",
    "soy_sauce": "10g",
    "sugar": "4g"
  },
  "라프무": {
    "pork": "120g",
    "mint": "3g",
    "lime": "10g",
    "fish_sauce": "8g",
    "red_onion": "40g",
    "rice": "120g",
    "red_pepper": "5g",
    "cilantro": "5g",
    "garlic": "5g",
    "sugar": "3g"
  },
  "쌈밥": {
    "rice": "150g",
    "lettuce": "100g",
    "ssamjang": "15g",
    "pork": "120g",
    "salt": "1g",
    "pepper": "1g",
    "sesame": "3g",
    "water": "0ml"
  },
  "그라탕": {
    "potato": "120g",
    "cream": "80ml",
    "cheese": "25g",
    "butter": "6g",
    "milk": "80ml",
    "flour": "15g",
    "nutmeg": "1g",
    "pepper": "1g",
    "salt": "1g"
  },
  "크림수프": {
    "cream": "80ml",
    "milk": "150ml",
    "butter": "6g",
    "onion": "40g",
    "broth": "200ml",
    "flour": "12g",
    "nutmeg": "1g",
    "salt": "1g",
    "pepper": "1g"
  },
  "양송이수프": {
    "mushroom": "100g",
    "cream": "80ml",
    "milk": "120ml",
    "butter": "6g",
    "onion": "40g",
    "broth": "200ml",
    "flour": "10g",
    "salt": "1g",
    "pepper": "1g",
    "parsley": "3g"
  },
  "치킨그라탕": {
    "chicken": "120g",
    "cream": "80ml",
    "cheese": "25g",
    "potato": "100g",
    "onion": "50g",
    "milk": "80ml",
    "flour": "10g",
    "salt": "1g",
    "pepper": "1g"
  },
  "참치마요덮밥": {
    "rice": "150g",
    "tuna": "80g",
    "mayo": "15g",
    "egg": "50g",
    "gim": "3g",
    "salt": "1g",
    "pepper": "1g"
  },
  "오야코동": {
    "rice": "150g",
    "chicken": "100g",
    "egg": "50g",
    "onion": "50g",
    "soy_sauce": "12g",
    "dashi": "80ml",
    "mirin": "8g",
    "sugar": "4g",
    "green_onion": "15g"
  },
  "양저우볶음밥": {
    "rice": "150g",
    "shrimp": "70g",
    "egg": "50g",
    "ham": "40g",
    "peas": "40g",
    "garlic": "5g",
    "ginger": "2g",
    "green_onion": "15g",
    "cooking_oil": "6g",
    "soy_sauce": "10g",
    "oyster_sauce": "8g",
    "pepper": "1g"
  },
  "삼선볶음밥": {
    "rice": "150g",
    "shrimp": "70g",
    "squid": "70g",
    "egg": "50g",
    "green_onion": "15g",
    "garlic": "5g",
    "ginger": "2g",
    "cooking_oil": "6g",
    "soy_sauce": "10g",
    "oyster_sauce": "8g",
    "pepper": "1g"
  },
  "부타동": {
    "rice": "150g",
    "pork": "100g",
    "onion": "50g",
    "soy_sauce": "12g",
    "mirin": "8g",
    "dashi": "80ml",
    "sugar": "4g",
    "sake": "5g",
    "ginger": "3g",
    "green_onion": "15g"
  },
  "규동": {
    "rice": "150g",
    "beef": "100g",
    "onion": "50g",
    "soy_sauce": "12g",
    "mirin": "8g",
    "dashi": "80ml",
    "sugar": "4g",
    "sake": "5g",
    "ginger": "3g",
    "green_onion": "15g"
  },
  "똠카가이": {
    "chicken": "120g",
    "coconut_milk": "100ml",
    "lemongrass": "6g",
    "mushroom": "80g",
    "lime": "10g",
    "galangal": "3g",
    "kaffir_lime_leaf": "1g",
    "fish_sauce": "8g",
    "palm_sugar": "5g",
    "cilantro": "5g",
    "garlic": "5g",
    "sugar": "3g"
  },
  "참치김치볶음밥": {
    "rice": "150g",
    "kimchi": "120g",
    "tuna": "70g",
    "egg": "50g",
    "green_onion": "15g",
    "garlic": "5g",
    "soy_sauce": "10g",
    "sugar": "4g",
    "gochugaru": "5g",
    "cooking_oil": "6g"
  },
  "비콜익스프레스": {
    "pork": "120g",
    "coconut_milk": "100ml",
    "shrimp_paste": "8g",
    "garlic": "5g",
    "onion": "50g",
    "red_pepper": "8g",
    "fish_sauce": "6g",
    "rice": "120g"
  },
  "칼국수": {
    "noodle": "120g",
    "zucchini": "60g",
    "potato": "60g",
    "green_onion": "15g",
    "broth": "500ml",
    "garlic": "5g",
    "water": "0ml"
  },
  "바지락칼국수": {
    "clam": "120g",
    "noodle": "120g",
    "zucchini": "60g",
    "green_onion": "15g",
    "garlic": "5g",
    "water": "500ml",
    "salt": "1g",
    "pepper": "1g",
    "sesame": "3g"
  },
  "장칼국수": {
    "noodle": "120g",
    "gochujang": "15g",
    "potato": "60g",
    "zucchini": "60g",
    "green_onion": "15g",
    "garlic": "5g",
    "water": "500ml"
  },
  "막국수": {
    "soba": "120g",
    "cucumber": "80g",
    "egg": "50g",
    "gochujang": "15g",
    "vinegar": "10g",
    "garlic": "5g",
    "sesame_oil": "5g",
    "sesame": "3g",
    "sugar": "4g",
    "green_onion": "15g"
  },
  "콩국수": {
    "somen": "120g",
    "bean": "100g",
    "cucumber": "80g",
    "salt": "1g",
    "garlic": "5g",
    "green_onion": "15g",
    "water": "500ml"
  },
  "갈비탕": {
    "beef_rib": "220g",
    "radish": "80g",
    "green_onion": "15g",
    "garlic": "5g",
    "glass_noodle": "25g",
    "pepper": "1g",
    "salt": "1g",
    "water": "500ml",
    "beef_broth": "500ml",
    "soup_soy_sauce": "6g",
    "egg": "25g"
  },
  "쌀국수": {
    "rice_noodle": "120g",
    "beef": "80g",
    "onion": "50g",
    "green_onion": "15g",
    "cilantro": "5g",
    "broth": "500ml",
    "star_anise": "1g",
    "cinnamon": "1g",
    "clove": "0.5g",
    "ginger": "3g",
    "fish_sauce": "8g",
    "lime": "10g",
    "mung_sprout": "80g",
    "garlic": "5g",
    "sugar": "3g"
  },
  "부대찌개": {
    "kimchi": "80g",
    "ham": "40g",
    "sausage": "50g",
    "tofu": "80g",
    "ramen": "40g",
    "rice_cake": "30g",
    "baked_bean": "30g",
    "green_onion": "15g",
    "onion": "50g",
    "gochujang": "15g",
    "gochugaru": "5g",
    "soy_sauce": "8g",
    "garlic": "5g",
    "sugar": "3g",
    "broth": "500ml"
  },
  "감자탕": {
    "pork_backbone": "220g",
    "potato": "80g",
    "cabbage": "80g",
    "green_onion": "15g",
    "perilla_leaf": "10g",
    "doenjang": "20g",
    "gochugaru": "5g",
    "garlic": "6g",
    "ginger": "3g",
    "perilla_seed_powder": "10g",
    "soy_sauce": "8g",
    "pepper": "1g",
    "water": "500ml",
    "napa": "80g"
  },
  "치킨수프": {
    "chicken": "100g",
    "potato": "60g",
    "carrot": "40g",
    "onion": "40g",
    "celery": "30g",
    "chicken_broth": "350ml",
    "garlic": "5g",
    "butter": "5g",
    "salt": "1g",
    "pepper": "1g"
  }
};
  function addTag(row, tag){ if(!row) return; row.tags = Array.isArray(row.tags) ? row.tags : []; if(!row.tags.includes(tag)) row.tags.push(tag); }
  function getIngName(id){
    try{
      if(typeof INGREDIENT_DB==='object' && INGREDIENT_DB[id]) return INGREDIENT_DB[id].name || id;
      if(typeof INGREDIENT_DB==='object'){
        const hit=Object.values(INGREDIENT_DB).find(x=>x && (x.id===id || (Array.isArray(x.aliases)&&x.aliases.includes(id))));
        if(hit) return hit.name || id;
      }
    }catch(e){}
    return id;
  }
  function getIngCategory(id){
    try{
      if(typeof INGREDIENT_DB==='object' && INGREDIENT_DB[id]) return INGREDIENT_DB[id].category || '기타';
    }catch(e){}
    return '기타';
  }
  function syncMenuDb(name,row){
    try{
      if(typeof MENU_DB!=='object' || !MENU_DB[name] || !row || !row.ingredientAmounts) return;
      const m=MENU_DB[name];
      m.servings=1; m.recipeServings=1; m.portionAudit='1인분 기준 재료량 보정';
      addTag(m,'포션Audit'); addTag(m,'1인분수정');
      if(Array.isArray(row.ingredients)){
        m.ingredients=row.ingredients.map(function(id){
          return {name:getIngName(id), amount:row.ingredientAmounts[id]||'0g', category:getIngCategory(id)};
        });
      }
    }catch(e){ console.warn('MENU_DB sync failed', name, e); }
  }
  let fixed=0, missing=[];
  Object.keys(PORTION_FIX).forEach(function(name){
    let row = (typeof MENU_SCHEMA_V2==='object') ? MENU_SCHEMA_V2[name] : null;
    if(row){
      row.servings=1; row.recipeServings=1;
      row.ingredientAmounts = Object.assign({}, row.ingredientAmounts||{}, PORTION_FIX[name]);
      row.ingredients = Object.keys(row.ingredientAmounts);
      row.portionAudit='1인분 기준 재료량 보정';
      addTag(row,'포션Audit'); addTag(row,'1인분수정');
      syncMenuDb(name,row);
      fixed++;
    }else{
      try{
        if(typeof MENU_DB==='object' && MENU_DB[name]){
          const m=MENU_DB[name];
          m.servings=1; m.recipeServings=1; m.portionAudit='1인분 기준 재료량 보정';
          addTag(m,'포션Audit'); addTag(m,'1인분수정');
          if(Array.isArray(m.ingredients)){
            m.ingredients.forEach(function(it){
              const key=(it.id||it.ingredientId||it.key||it.name||'');
              if(PORTION_FIX[name][key]) it.amount=PORTION_FIX[name][key];
            });
          }
          fixed++;
        }else missing.push(name);
      }catch(e){ missing.push(name); }
    }
  });
  console.log('[portion audit fix v1]', {fixed, missing, rule:'과고칼로리 메뉴의 재료 amount를 1인분 포션으로 보정'});
})();
/* ===== /portion-audit-fix-v1 ===== */


/* ===== bflow-click-audit-fix-v1 ===== */
(function(){
  function safeArr(v){ return Array.isArray(v) ? v : []; }
  function targetMealCount(){
    try{
      var n = (typeof totalMeals === 'function') ? Number(totalMeals()) : 0;
      if(Number.isFinite(n) && n > 0) return n;
    }catch(e){}
    try{
      if(window.S && S.schedule && Array.isArray(window.DAYS)){
        var c = DAYS.reduce(function(sum, day){ return sum + (Array.isArray(S.schedule[day]) ? S.schedule[day].length : 0); }, 0);
        if(c > 0) return c * (S.planDuration || 1);
      }
    }catch(e){}
    return 7;
  }
  function uniqueValid(names){
    var out = [], seen = Object.create(null);
    safeArr(names).forEach(function(n){
      try{ n = (typeof flowMenuDBName === 'function') ? flowMenuDBName(n) : n; }catch(e){}
      if(!n || seen[n]) return;
      if(typeof MENU_DB === 'object' && MENU_DB && !MENU_DB[n]) return;
      if(typeof isSideDishMenu === 'function' && isSideDishMenu(n)) return;
      seen[n] = true; out.push(n);
    });
    return out;
  }
  function kcalText(name){
    try{
      var nut = (typeof calcNutrition === 'function') ? calcNutrition(name, 1) : null;
      if(!nut) return '';
      return nut.calRange || ((nut.cal || nut.kcal || 0) + 'kcal');
    }catch(e){ return ''; }
  }
  function cookTimeText(name){
    try{ return (typeof getCookTime === 'function' ? getCookTime(name) : 20) + '분'; }catch(e){ return '20분'; }
  }
  function seasonBadge(name){
    try{ return (typeof getSeasonalScore === 'function' && getSeasonalScore(name)>0); }catch(e){ return false; }
  }
  function mainIngredientNames(name){
    try{
      var list = (MENU_DB && MENU_DB[name] && Array.isArray(MENU_DB[name].ingredients)) ? MENU_DB[name].ingredients : [];
      return list.slice(0,3).map(function(x){ return x.name || x.id || x; }).filter(Boolean);
    }catch(e){ return []; }
  }

  window.toggleBSuggest = function(i, ev){
    if(ev && ev.stopPropagation) ev.stopPropagation();
    if(!window.S) return;
    if(!Array.isArray(S.bcSuggested)) S.bcSuggested = [];
    var item = S.bcSuggested[i];
    if(!item) return;
    var max = targetMealCount();
    var selectedCount = S.bcSuggested.filter(function(m){ return !!m.selected; }).length;
    if(!item.selected && max > 0 && selectedCount >= max){
      alert('선택한 식단 스케줄 기준 최대 ' + max + '개까지 선택할 수 있어요.');
      return;
    }
    item.selected = !item.selected;
    if(typeof render === 'function') render();
  };

  window.removeBSuggest = function(i, ev){
    if(ev && ev.stopPropagation) ev.stopPropagation();
    if(!window.S || !Array.isArray(S.bcSuggested)) return;
    S.bcSuggested.splice(i,1);
    if(typeof render === 'function') render();
  };

  window.genBSuggest = genBSuggest = function(){
    if(!window.S) return;
    if(!S.bcStyles || !S.bcStyles.length){ alert('스타일을 선택해주세요'); return; }
    var max = targetMealCount();
    var pool = [];
    try{
      pool = (typeof flowMenuPool === 'function') ? flowMenuPool(S.bcStyles) : [];
    }catch(e){ pool = []; }
    if(!pool.length){
      try{ pool = (typeof flowBuildMenu === 'function') ? flowBuildMenu('style', S.bcStyles, []) : []; }catch(e){ pool = []; }
    }
    pool = uniqueValid(pool).sort(function(){ return Math.random() - 0.5; });
    if(!pool.length && typeof MENU_DB === 'object'){
      pool = uniqueValid(Object.keys(MENU_DB)).sort(function(){ return Math.random() - 0.5; });
    }
    var take = Math.max(max + 8, 20);
    var typeOrder = ['아침','점심','저녁'];
    S.bcMode = 'b';
    S.bcMenus = [];
    S.bcSuggested = pool.slice(0, take).map(function(name, i){
      return {
        name: name,
        selected: false,
        type: typeOrder[i % 3],
        ingredients: mainIngredientNames(name),
        sharedWith: []
      };
    });
    if(typeof go === 'function') go('b-suggest');
    else if(typeof render === 'function') render();
  };

  window._bcSelectedMenus = _bcSelectedMenus = function(){
    var max = targetMealCount();
    var seed = [];
    if(window.S && S.bcMode === 'b') seed = safeArr(S.bcSuggested).filter(function(m){ return !!m.selected; }).map(function(m){ return m.name; });
    else seed = safeArr(S.bcMenus);
    var menus = uniqueValid(seed);
    return menus.slice(0, max);
  };

  window.genBCCart = genBCCart = function(){
    try{
      if(!window.S) return;
      var isB = S.bcMode === 'b';
      var menus = isB ? _bcSelectedMenus() : uniqueValid(S.bcMenus);
      var max = targetMealCount();
      if(!menus.length){ alert(isB ? '추천 메뉴를 먼저 선택해주세요' : '메뉴를 먼저 입력해주세요'); return; }
      menus = menus.slice(0, max);
      S.bcMenus = menus;
      var result = (typeof getIngredientsFromDB === 'function') ? getIngredientsFromDB(menus, S.people || 1) : {list:[]};
      var list = result && result.list ? result.list : [];
      S.cart = list.map(function(i){ return Object.assign({}, i, {checked: !!i.inFridge, replaceName: '', replaceQty: ''}); });
      S.fridgeAdded = false;
      S.cartDone = false;
      try{ localStorage.removeItem('wm_cart_done'); }catch(e){}
      if(typeof go === 'function') go('bc-cart');
      else if(typeof render === 'function') render();
    }catch(e){
      console.error('genBCCart bflow audit fix 오류:', e);
      alert('재료 분석 중 오류: ' + (e.message || e));
    }
  };

  window.rBSuggest = rBSuggest = function(){
    var menus = safeArr(window.S && S.bcSuggested);
    var sel = menus.filter(function(m){ return !!m.selected; }).length;
    var max = targetMealCount();
    var tIcon = {'아침':'🌅','점심':'☀️','저녁':'🌙'};
    var body = menus.length === 0
      ? '<div style="text-align:center;padding:40px;color:#aaa">추천 메뉴가 없어요</div>'
      : menus.map(function(m,i){
          var selected = !!m.selected;
          var kcal = kcalText(m.name);
          var ing = safeArr(m.ingredients).length ? safeArr(m.ingredients).slice(0,3) : mainIngredientNames(m.name);
          return '<div onclick="toggleBSuggest('+i+', event)" style="background:'+(selected?'#FFF8EE':'#fff')+';border:1.5px solid '+(selected?'var(--primary)':'#f0f0f0')+';border-radius:16px;padding:14px 14px;cursor:pointer;box-shadow:'+(selected?'0 2px 12px rgba(255,152,0,0.15)':'0 1px 4px rgba(0,0,0,0.05)')+';display:flex;align-items:center;gap:12px">'
            + '<div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;background:'+(selected?'var(--primary)':'#f5f5f5')+';border:2px solid '+(selected?'var(--primary)':'#e0e0e0')+';display:flex;align-items:center;justify-content:center">'+(selected?'<span style="color:#fff;font-size:13px;font-weight:900">✓</span>':'')+'</div>'
            + '<div style="flex:1;min-width:0">'
            +   '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;min-width:0">'
            +     '<span style="font-weight:800;font-size:15px;color:'+(selected?'var(--primary)':'var(--text)')+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+m.name+'</span>'
            +     (seasonBadge(m.name)?'<span style="font-size:9px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 5px;font-weight:700;flex-shrink:0">제철</span>':'')
            +   '</div>'
            +   '<div style="font-size:11px;color:#aaa;display:flex;gap:8px;flex-wrap:wrap">'
            +     '<span>'+(tIcon[m.type]||'')+' '+(m.type||'추천')+'</span>'
            +     '<span>⏱ '+cookTimeText(m.name)+'</span>'
            +     (kcal?'<span style="color:#E65100">🔥 '+kcal+'</span>':'')
            +   '</div>'
            +   (ing.length?'<div style="font-size:11px;color:#bbb;margin-top:3px">'+ing.join(' · ')+'</div>':'')
            + '</div>'
            + '<button onclick="removeBSuggest('+i+', event)" style="width:30px;height:30px;border-radius:10px;border:none;background:#f5f5f5;color:#aaa;font-size:16px;font-weight:900;flex-shrink:0">×</button>'
            + '</div>';
        }).join('');
    return '<div style="padding:52px 20px 12px;background:linear-gradient(160deg,#FFF8EE,#fff)">'
      + '<button class="back" onclick="go(\'bc-entry\')">←</button>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">'
      + '<div><div class="title" style="margin:0">🍽️ 메뉴 추천</div><div style="font-size:12px;color:#aaa;margin-top:2px">'+sel+'개 선택 / 최대 '+max+'개</div></div>'
      + (sel>0?'<div style="background:var(--primary);color:#fff;border-radius:20px;padding:4px 14px;font-size:13px;font-weight:700">'+sel+'개</div>':'')
      + '</div></div>'
      + '<div style="padding:8px 16px 140px;display:flex;flex-direction:column;gap:8px">'+body+'</div>'
      + '<div class="bottom-bar">'
      + '<div style="font-size:12px;color:#aaa;text-align:center;margin-bottom:8px">'+(sel===0?'메뉴를 선택해주세요':(sel<max?(max-sel)+'개 더 선택 가능해요':sel+'개 선택 완료! 🎉'))+'</div>'
      + '<button class="btn-o" '+(sel===0?'disabled':'')+' onclick="genBCCart()">🛒 재료 분석하기 ('+sel+'개)</button>'
      + '</div>';
  };

  console.info('[bflow audit fix v1] B플로우 추천 메뉴 클릭/삭제/선택값 유지 복구 완료');
})();
/* ===== /bflow-click-audit-fix-v1 ===== */


/* ===== bflow-recommend-visible-fix-v2 ===== */
(function(){
  try{ if(typeof S !== 'undefined') window.S = S; }catch(e){}
  function arr(v){ return Array.isArray(v) ? v : []; }
  function mealTarget(){
    try{
      if(typeof S !== 'undefined' && S.schedule && Array.isArray(DAYS)){
        var c = DAYS.reduce(function(sum, day){ return sum + (Array.isArray(S.schedule[day]) ? S.schedule[day].length : 0); }, 0);
        if(c > 0) return c * (S.planDuration || 1);
      }
    }catch(e){}
    try{
      var n = (typeof totalMeals === 'function') ? Number(totalMeals()) : 0;
      if(Number.isFinite(n) && n > 0) return n;
    }catch(e){}
    return 7;
  }
  function cleanMenuName(n){
    try{ n = (typeof flowMenuDBName === 'function') ? flowMenuDBName(n) : n; }catch(e){}
    return n;
  }
  function isMainMenu(n){
    if(!n || !MENU_DB || !MENU_DB[n]) return false;
    try{ if(typeof isSideDishMenu === 'function' && isSideDishMenu(n)) return false; }catch(e){}
    var m = MENU_DB[n] || {};
    if(m.excludeFromMainPlan === true) return false;
    if(m.mealRole === 'side' || m.category === '반찬') return false;
    return true;
  }
  function uniqMenus(list){
    var seen = Object.create(null), out = [];
    arr(list).forEach(function(x){
      var n = cleanMenuName(x);
      if(!isMainMenu(n) || seen[n]) return;
      seen[n] = true;
      out.push(n);
    });
    return out;
  }
  function menuPoolByStyles(styles){
    var pool = [];
    try{ pool = (typeof flowMenuPool === 'function') ? flowMenuPool(styles) : []; }catch(e){ pool = []; }
    pool = uniqMenus(pool);
    if(pool.length) return pool;
    try{ pool = (typeof flowBuildMenu === 'function') ? flowBuildMenu('style', styles && styles.length ? styles : ['한식'], []) : []; }catch(e){ pool = []; }
    pool = uniqMenus(pool);
    if(pool.length) return pool;
    try{
      arr(styles && styles.length ? styles : ['한식']).forEach(function(st){
        var canonical = st;
        try{ canonical = (typeof normalizeStyleChoiceV9 === 'function') ? normalizeStyleChoiceV9(st) : st; }catch(e){}
        pool = pool.concat((FLOW_STYLE_MENU_MAP && FLOW_STYLE_MENU_MAP[canonical]) || []);
      });
    }catch(e){}
    pool = uniqMenus(pool);
    if(pool.length) return pool;
    return uniqMenus(Object.keys(MENU_DB || {}));
  }
  function mainIngs(name){
    try{ return arr(MENU_DB[name] && MENU_DB[name].ingredients).slice(0,3).map(function(x){ return x.name || x.id || x; }).filter(Boolean); }catch(e){ return []; }
  }
  window.genBSuggest = genBSuggest = function(){
    try{ if(typeof S !== 'undefined') window.S = S; }catch(e){}
    if(typeof S === 'undefined') return;
    if(!Array.isArray(S.bcStyles) || !S.bcStyles.length){ alert('스타일을 선택해주세요'); return; }
    var max = mealTarget();
    var pool = menuPoolByStyles(S.bcStyles).sort(function(){ return Math.random() - 0.5; });
    var take = Math.max(max + 8, 20);
    var typeOrder = ['아침','점심','저녁'];
    S.bcMode = 'b';
    S.bcMenus = [];
    S.bcSuggested = pool.slice(0, take).map(function(name, i){
      return {name:name, selected:i < Math.min(max, pool.length), type:typeOrder[i%3], ingredients:mainIngs(name), sharedWith:[]};
    });
    if(!S.bcSuggested.length){ alert('추천 가능한 메인 메뉴가 없습니다. 다른 국가/스타일을 선택해주세요.'); return; }
    if(typeof go === 'function') go('b-suggest');
    else if(typeof render === 'function') render();
  };
  console.info('[bflow recommend visible fix v2] window.S alias + 추천 메뉴 pool 복구 완료');
})();
/* ===== /bflow-recommend-visible-fix-v2 ===== */


/* ===== wm-schedule-bflow-final-hotfix-v3 ===== */
(function(){
  function getDays(){
    try{ if(typeof DAYS !== 'undefined' && Array.isArray(DAYS)) return DAYS; }catch(e){}
    return ['월','화','수','목','금','토','일'];
  }
  function getState(){
    try{ if(typeof S !== 'undefined'){ window.S = S; return S; } }catch(e){}
    return window.S || null;
  }
  function validSlots(day){
    var s=getState();
    if(!s) return [];
    if(!s.schedule || typeof s.schedule !== 'object') s.schedule = {};
    if(!Array.isArray(s.schedule[day])) s.schedule[day] = [];
    s.schedule[day] = s.schedule[day].filter(function(m){ return ['아침','점심','저녁'].indexOf(m) >= 0; });
    return s.schedule[day];
  }
  function selectedCount(){
    var s=getState();
    if(!s) return 0;
    return getDays().reduce(function(sum, day){ return sum + validSlots(day).length; }, 0);
  }
  function persistSchedule(){
    var s=getState();
    if(!s) return;
    try{ localStorage.setItem('wm_schedule', JSON.stringify(s.schedule || {})); }catch(e){}
  }

  window.ensureScheduleReady = ensureScheduleReady = function(){
    var s=getState();
    if(!s) return;
    if(!s.schedule || typeof s.schedule !== 'object') s.schedule = {};
    getDays().forEach(function(day){ validSlots(day); });
  };

  window.totalMeals = totalMeals = function(){
    var s=getState();
    ensureScheduleReady();
    return selectedCount() * ((s && s.planDuration) || 1);
  };

  window.toggleSlot = toggleSlot = function(day, meal){
    var s=getState();
    if(!s) return;
    ensureScheduleReady();
    var arr = validSlots(day);
    var i = arr.indexOf(meal);
    if(i >= 0) arr.splice(i,1);
    else arr.push(meal);
    arr.sort(function(a,b){ return ['아침','점심','저녁'].indexOf(a) - ['아침','점심','저녁'].indexOf(b); });
    persistSchedule();
    if(typeof render === 'function') render();
  };

  window.saveSched = saveSched = function(){
    var s=getState();
    if(!s) return;
    ensureScheduleReady();
    persistSchedule();
    if(selectedCount() > 0){
      try{ localStorage.setItem('wm_schedule_set','1'); }catch(e){}
    }else{
      try{ localStorage.removeItem('wm_schedule_set'); }catch(e){}
    }
  };

  window.completeOnboard = completeOnboard = function(){
    ensureScheduleReady();
    if(selectedCount() <= 0){ alert('식단을 생성할 끼니를 먼저 선택해주세요.'); return; }
    saveSched();
    if(typeof go === 'function') go('home');
  };

  function normalizeMenuName(n){
    try{ return (typeof flowMenuDBName === 'function') ? flowMenuDBName(n) : n; }catch(e){ return n; }
  }
  function isMainMenu(n){
    if(!n || !MENU_DB || !MENU_DB[n]) return false;
    try{ if(typeof isSideDishMenu === 'function' && isSideDishMenu(n)) return false; }catch(e){}
    var m = MENU_DB[n] || {};
    if(m.excludeFromMainPlan === true) return false;
    if(m.mealRole === 'side' || m.category === '반찬') return false;
    return true;
  }
  function uniqMain(list){
    var seen = Object.create(null), out = [];
    (Array.isArray(list)?list:[]).forEach(function(x){
      var n = normalizeMenuName(x);
      if(!isMainMenu(n) || seen[n]) return;
      seen[n] = true; out.push(n);
    });
    return out;
  }
  function menuPoolByStyles(styles){
    var pool=[];
    try{ pool = (typeof flowMenuPool === 'function') ? flowMenuPool(styles) : []; }catch(e){ pool=[]; }
    pool = uniqMain(pool); if(pool.length) return pool;
    try{ pool = (typeof flowBuildMenu === 'function') ? flowBuildMenu('style', styles && styles.length ? styles : ['한식'], []) : []; }catch(e){ pool=[]; }
    pool = uniqMain(pool); if(pool.length) return pool;
    try{
      (Array.isArray(styles)&&styles.length?styles:['한식']).forEach(function(st){
        var canonical=st;
        try{ canonical = (typeof normalizeStyleChoiceV9 === 'function') ? normalizeStyleChoiceV9(st) : st; }catch(e){}
        if(typeof FLOW_STYLE_MENU_MAP === 'object' && FLOW_STYLE_MENU_MAP) pool = pool.concat(FLOW_STYLE_MENU_MAP[canonical] || []);
      });
    }catch(e){}
    pool = uniqMain(pool); if(pool.length) return pool;
    try{ return uniqMain(Object.keys(MENU_DB || {})); }catch(e){ return []; }
  }
  function mainIngs(name){
    try{ return ((MENU_DB[name] && Array.isArray(MENU_DB[name].ingredients)) ? MENU_DB[name].ingredients : []).slice(0,3).map(function(x){ return x.name || x.id || x; }).filter(Boolean); }catch(e){ return []; }
  }

  window.genBSuggest = genBSuggest = function(){
    var s=getState();
    if(!s) return;
    ensureScheduleReady();
    if(selectedCount() <= 0){ alert('식단 스케줄에서 생성할 끼니를 먼저 선택해주세요.'); return; }
    if(!Array.isArray(s.bcStyles) || !s.bcStyles.length){ alert('스타일을 선택해주세요'); return; }
    var max = totalMeals();
    var pool = menuPoolByStyles(s.bcStyles).sort(function(){ return Math.random() - 0.5; });
    if(!pool.length){ alert('추천 가능한 메인 메뉴가 없습니다. 다른 국가/스타일을 선택해주세요.'); return; }
    var take = Math.max(max + 8, 20);
    var typeOrder = ['아침','점심','저녁'];
    s.bcMode = 'b';
    s.bcMenus = [];
    s.bcSuggested = pool.slice(0, take).map(function(name, i){
      return {name:name, selected:false, type:typeOrder[i%3], ingredients:mainIngs(name), sharedWith:[]};
    });
    if(typeof go === 'function') go('b-suggest');
    else if(typeof render === 'function') render();
  };

  window._bcSelectedMenus = _bcSelectedMenus = function(){
    var s=getState();
    var seed = (s && s.bcMode === 'b') ? (Array.isArray(s.bcSuggested)?s.bcSuggested:[]).filter(function(m){ return !!m.selected; }).map(function(m){ return m.name; }) : ((s && Array.isArray(s.bcMenus)) ? s.bcMenus : []);
    return uniqMain(seed).slice(0, totalMeals());
  };

  window.genBCCart = genBCCart = function(){
    try{
      var s=getState();
      if(!s) return;
      ensureScheduleReady();
      if(selectedCount() <= 0){ alert('식단 스케줄에서 생성할 끼니를 먼저 선택해주세요.'); return; }
      var isB = s.bcMode === 'b';
      var menus = isB ? _bcSelectedMenus() : uniqMain(s.bcMenus).slice(0,totalMeals());
      if(!menus.length){ alert(isB ? '추천 메뉴를 먼저 선택해주세요' : '메뉴를 먼저 입력해주세요'); return; }
      s.bcMenus = menus;
      var result = (typeof getIngredientsFromDB === 'function') ? getIngredientsFromDB(menus, s.people || 1) : {list:[]};
      s.cart = ((result && result.list) || []).map(function(i){ return Object.assign({}, i, {checked: !!i.inFridge, replaceName:'', replaceQty:''}); });
      s.fridgeAdded=false; s.cartDone=false;
      try{ localStorage.removeItem('wm_cart_done'); }catch(e){}
      if(typeof go === 'function') go('bc-cart');
      else if(typeof render === 'function') render();
    }catch(e){ console.error('genBCCart final hotfix 오류:', e); alert('재료 분석 중 오류: ' + (e.message || e)); }
  };

  window.makeBCMealNow = makeBCMealNow = function(){
    try{
      var s=getState();
      if(!s) return;
      ensureScheduleReady();
      if(selectedCount() <= 0){ alert('식단 스케줄에서 생성할 끼니를 먼저 선택해주세요.'); return; }
      var menus = (Array.isArray(s.bcMenus) && s.bcMenus.length) ? uniqMain(s.bcMenus) : _bcSelectedMenus();
      if(!menus.length){ alert('먼저 메뉴 선택 또는 재료 분석을 해주세요.'); return; }
      s.bcMenus = menus.slice(0,totalMeals());
      if(typeof flowCreatePlan === 'function' && flowCreatePlan(s.bcMenus, '🍽️ 선택한 메뉴 기준으로 식단을 생성했어요.')){
        try{ if(typeof addUsage === 'function') addUsage(); }catch(e){}
        if(typeof go === 'function') go('bc-meal');
      }
    }catch(e){ console.error('makeBCMealNow final hotfix 오류:', e); alert('식단 생성 중 오류: ' + (e.message || e)); }
  };

  window.flowCreatePlan = flowCreatePlan = function(menus, tip){
    var s=getState();
    ensureScheduleReady();
    if(selectedCount() <= 0){ alert('식단 스케줄에서 생성할 끼니를 먼저 선택해주세요.'); return false; }
    menus = uniqMain(menus);
    if(!menus.length){ alert('식단을 만들 메뉴가 없습니다. 메뉴를 다시 선택해주세요.'); return false; }
    var weeklyMeal=[], idx=0;
    getDays().forEach(function(day){
      var slots = validSlots(day);
      var meals = slots.map(function(type){ return flowMealObj(type, menus[idx++ % menus.length]); });
      weeklyMeal.push({day:day, meals:meals});
    });
    s.mealPlan = {weeklyMeal:weeklyMeal, tip:tip||''};
    try{ s.mealStartDate = getThisMonday(); }catch(e){}
    if(typeof flowCreateCalendar === 'function') flowCreateCalendar(menus);
    try{ if(typeof saveMeal === 'function') saveMeal(); }catch(e){}
    try{ localStorage.setItem('wm_cal', JSON.stringify(s.mealCalendar || {})); }catch(e){}
    return true;
  };

  window.flowCreateCalendar = flowCreateCalendar = function(menus){
    var s=getState();
    ensureScheduleReady();
    menus = uniqMain(menus);
    var cal={}, idx=0;
    var start = new Date(); start.setDate(start.getDate()+1);
    var days = 7;
    try{ days = (typeof totalDays === 'function') ? totalDays() : 7; }catch(e){}
    for(var i=0;i<days;i++){
      var d = new Date(start); d.setDate(start.getDate()+i);
      var key = (typeof dateKey === 'function') ? dateKey(d) : d.toISOString().slice(0,10);
      var day = getDays()[(d.getDay()+6)%7];
      var slots = validSlots(day);
      cal[key] = slots.map(function(type){ return flowMealObj(type, menus[idx++ % menus.length]); });
    }
    s.mealCalendar = cal;
    try{ localStorage.setItem('wm_cal', JSON.stringify(cal)); }catch(e){}
  };

  console.info('[final hotfix v3] schedule count + B/C flow no preselect fixed');
})();
/* ===== /wm-schedule-bflow-final-hotfix-v3 ===== */


/* ===== portion-audit-low-calorie-anomaly-fix-v1 ===== */
(function(){
  /* 저칼로리/고칼로리 이상치 보정
     - 시오라멘 122kcal 원인: MENU_SCHEMA_V2에 정량 레시피가 없어서 CLEAN_MENUS의 문자열 재료가 일부만 영양DB에 매칭됨.
     - 반미 750kcal+ 원인: 1인분 채소/피클/할라피뇨/설탕 포션 과다 + 바게트/돼지고기 상단값.
     calcNutrition 로직은 건드리지 않고 MENU_SCHEMA_V2 정량만 보정한다. */
  try{
    if(typeof NUTRITION_DB !== 'undefined'){
      Object.assign(NUTRITION_DB,{
        '차슈': {cal:250, carb:3, fat:16, pro:23},
        '라멘면': {cal:350, carb:68, fat:3, pro:10},
        '닭육수': {cal:8, carb:0, fat:0.2, pro:1},
        '죽순': {cal:27, carb:5, fat:0.3, pro:2.6},
        '김': {cal:35, carb:5, fat:0.3, pro:5.8},
        '할라피뇨': {cal:29, carb:6.5, fat:0.4, pro:0.9}
      });
    }
    if(typeof INGREDIENT_DB_V2 !== 'undefined'){
      Object.assign(INGREDIENT_DB_V2,{
        ramen_noodle:{id:'ramen_noodle',name:'라멘면',category:'grain',aliases:['라멘','라멘면','생라멘'],icon:'🍜',defaultAmount:'120g'},
        nori:{id:'nori',name:'김',category:'veg',aliases:['김','김가루','노리'],icon:'⬛',defaultAmount:'3g'},
        chicken_broth_plain:{id:'chicken_broth_plain',name:'닭육수',category:'sauce',aliases:['닭육수','치킨육수'],icon:'🍲',defaultAmount:'450ml'},
        jalapeno:{id:'jalapeno',name:'할라피뇨',category:'veg',aliases:['할라피뇨','할라피뇨고추'],icon:'🌶️',defaultAmount:'10g'}
      });
    }
    function mergeTags(row,tags){
      row.tags=[...new Set([...(row.tags||[]),...(tags||[])])];
      return row;
    }
    if(typeof MENU_SCHEMA_V2 !== 'undefined'){
      MENU_SCHEMA_V2['시오라멘']=mergeTags({
        name:'시오라멘',styles:['일식'],ingredients:['ramen_noodle','chashu','egg','green_onion','chicken_broth_plain','bamboo_shoot','nori','ginger','salt'],
        cookTime:30,tags:['대표메뉴','포션Audit','저칼로리오류수정'],id:'m_shio_ramen_audit_v1',baseId:'ramen',baseName:'라멘',isVariation:true,servings:1,recipeServings:1,
        ingredientAmounts:{ramen_noodle:'120g',chashu:'50g',egg:'50g',green_onion:'15g',chicken_broth_plain:'450ml',bamboo_shoot:'30g',nori:'3g',ginger:'3g',salt:'2g'}
      },[]);
      MENU_SCHEMA_V2['토리파이탄']=mergeTags({
        name:'토리파이탄',styles:['일식'],ingredients:['ramen_noodle','chicken','egg','green_onion','chicken_broth_plain','garlic','ginger','chashu','bamboo_shoot','nori'],
        cookTime:35,tags:['대표메뉴','포션Audit','저칼로리오류수정'],id:'m_tori_paitan_audit_v1',baseId:'ramen',baseName:'라멘',isVariation:true,servings:1,recipeServings:1,
        ingredientAmounts:{ramen_noodle:'120g',chicken:'70g',egg:'50g',green_onion:'15g',chicken_broth_plain:'450ml',garlic:'5g',ginger:'3g',chashu:'40g',bamboo_shoot:'30g',nori:'3g'}
      },[]);
      if(MENU_SCHEMA_V2['반미']){
        var b=MENU_SCHEMA_V2['반미'];
        b.servings=1; b.recipeServings=1;
        b.ingredients=['baguette','pork','cucumber','carrot','cilantro','pickled_radish','mayo','jalapeno','fish_sauce','garlic','lime','sugar'];
        b.ingredientAmounts={baguette:'85g',pork:'80g',cucumber:'45g',carrot:'35g',cilantro:'5g',pickled_radish:'35g',mayo:'10g',jalapeno:'10g',fish_sauce:'8g',garlic:'3g',lime:'10g',sugar:'4g'};
        b.tags=[...new Set([...(b.tags||[]),'포션Audit','고칼로리보정'])];
      }else{
        MENU_SCHEMA_V2['반미']={name:'반미',styles:['🇻🇳 베트남'],ingredients:['baguette','pork','cucumber','carrot','cilantro','pickled_radish','mayo','jalapeno','fish_sauce','garlic','lime','sugar'],cookTime:20,tags:['대표메뉴','포션Audit','고칼로리보정'],id:'m_banhmi_audit_v1',baseId:'vietnamese',baseName:'베트남식',isVariation:true,servings:1,recipeServings:1,ingredientAmounts:{baguette:'85g',pork:'80g',cucumber:'45g',carrot:'35g',cilantro:'5g',pickled_radish:'35g',mayo:'10g',jalapeno:'10g',fish_sauce:'8g',garlic:'3g',lime:'10g',sugar:'4g'}};
      }
    }
    console.info('[portion audit v1] fixed low-calorie ramen anomaly and banh mi 1-serving portion.');
  }catch(e){ console.warn('[portion audit v1] failed',e); }
})();
/* ===== /portion-audit-low-calorie-anomaly-fix-v1 ===== */


/* ===== review-fixes-banhmi-units-v1 ===== */
(function(){
  /* ===== REVIEW FIXES v1 =====
     1) 반미 계열: 일반 바게트 → 쌀바게트 90g 기준
     2) 연포탕/낙지연포탕/쟁반국수/너비아니 1인분 포션 재보정
     3) 장바구니 병합 안정화: ingredientAmounts 단위를 g 기준으로 정규화하고 getIngredientsFromDB를 id+g 합산 방식으로 교체
  */
  const VERSION='review-fixes-banhmi-units-v1';
  function DB(name){try{return (typeof window[name] !== 'undefined' && window[name]) || eval(name);}catch(e){return window[name]||null;}}
  const schema=DB('MENU_SCHEMA_V2')||{};
  const menuDB=DB('MENU_DB')||{};
  const ingDB=DB('INGREDIENT_DB_V2')||{};
  const nutDB=DB('NUTRITION_DB')||{};

  function ensureArr(v){ return Array.isArray(v)?v:[]; }
  function uniq(arr){ return [...new Set((arr||[]).filter(Boolean))]; }
  function mergeTags(row,tags){ row.tags=uniq([...(row.tags||[]),...(tags||[])]); return row; }
  function ingredientName(id){ return ingDB[id]?.name || id; }
  function ingredientCategory(id){
    const c=ingDB[id]?.category||'기타';
    if(c==='veg') return '채소'; if(c==='protein') return '단백질'; if(c==='grain') return '면·밥'; if(c==='dairy') return '유제품'; if(['sauce','spice','oil'].includes(c)) return '양념';
    return c==='기타'?'기타':c;
  }
  function iconOf(id){ return ingDB[id]?.icon || (typeof getIcon==='function'?getIcon(ingredientName(id)):'🛒'); }

  // 쌀바게트 등록: 베트남 반미 전용 기준 재료
  if(ingDB && !ingDB.rice_baguette){
    ingDB.rice_baguette={id:'rice_baguette',name:'쌀바게트',category:'grain',aliases:['쌀바게트','반미빵','베트남바게트','banh mi bread'],icon:'🥖',defaultAmount:'90g'};
  }
  if(nutDB && !nutDB['쌀바게트']){
    nutDB['쌀바게트']={cal:255,carb:51,fat:2.5,pro:7};
  }

  function nval(v){
    const s=String(v||'').replace(/,/g,'').trim();
    const f=s.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if(f) return Number(f[1])/Math.max(1,Number(f[2]));
    const m=s.match(/\d+(?:\.\d+)?/); return m?Number(m[0]):0;
  }
  const perUnit={
    garlic:5, ginger:5, egg:50, tortilla:40, bread:30, rice_paper:8, mandu_skin:12,
    tofu:300, soft_tofu:350, fried_tofu:20, tuna:100, crab:150, squid:220, octopus:150,
    cucumber:120, zucchini:300, onion:150, carrot:100, potato:150, sweet_potato:150, tomato:150,
    bell_pepper:120, green_onion:20, chive:100, napa:800, cabbage:600, lettuce:150,
    ramen:110, ramen_noodle:130, udon:200, somyeon:100, rice_noodle:120, soba:180,
    lasagna:25, cheese:20, sausage:80, ham:100, chicken:250, chicken_breast:180,
    pork:200, beef:180, salmon:180, mackerel:250, hairtail:250, pollack:250
  };
  function amountToG(amount,id){
    const s=String(amount||'').trim().toLowerCase();
    let num=nval(s); if(!num) return null;
    let g=num;
    if(/kg/.test(s)) g=num*1000;
    else if(/g\b|그램/.test(s)) g=num;
    else if(/ml|㎖/.test(s)) g=num;
    else if(/\bl\b|리터/.test(s)) g=num*1000;
    else if(/큰술|tbsp|tbs/.test(s)) g=num*12;
    else if(/작은술|tsp/.test(s)) g=num*4;
    else if(/컵|cup/.test(s)) g=num*200;
    else if(/공기/.test(s)) g=num*210;
    else if(/모|팩|캔|마리|개|장|쪽|알|줄기|포기|봉|스틱|줌/.test(s)) g=num*(perUnit[id]||50);
    else g=num;
    return Math.max(0, Math.round(g));
  }
  function fmtG(g){ return Math.round(Number(g)||0)+'g'; }
  function normalizedAmounts(obj){
    const out={};
    Object.keys(obj||{}).forEach(id=>{
      const g=amountToG(obj[id], id);
      out[id]=g?fmtG(g):obj[id];
    });
    return out;
  }
  function upsertMenu(name,row){
    schema[name]=row;
    // MENU_DB도 화면/장바구니용으로 즉시 동기화
    if(menuDB){
      const ingredients=(row.ingredients||[]).map(id=>({id,name:ingredientName(id),amount:row.ingredientAmounts?.[id]||ingDB[id]?.defaultAmount||'100g',icon:iconOf(id),category:ingredientCategory(id)}));
      menuDB[name]=Object.assign(menuDB[name]||{}, {name, style:(row.styles||[])[0]||row.style||'', styles:row.styles||[row.style].filter(Boolean), tags:row.tags||[], cookTime:row.cookTime||20, ingredientIds:row.ingredients||[], ingredients, baseId:row.baseId, baseName:row.baseName, servings:row.servings||1, recipeServings:row.recipeServings||1});
    }
  }
  function patchRow(name, spec){
    const prev=schema[name]||menuDB[name]||{};
    const row=Object.assign({}, prev, spec, {name});
    row.styles=spec.styles || prev.styles || (prev.style?[prev.style]:[]);
    row.tags=uniq([...(prev.tags||[]),...(spec.tags||[])]);
    row.ingredients=spec.ingredients || prev.ingredients || [];
    row.ingredientAmounts=normalizedAmounts(spec.ingredientAmounts || prev.ingredientAmounts || {});
    row.servings=spec.servings || 1;
    row.recipeServings=spec.recipeServings || row.servings;
    upsertMenu(name,row);
    return row;
  }

  // 1) 반미 계열 추출 및 쌀바게트 90g 기준 보정
  const banhMiNames=uniq([...Object.keys(schema),...Object.keys(menuDB)].filter(n=>/반미/i.test(n)));
  if(!banhMiNames.includes('반미')) banhMiNames.push('반미');
  banhMiNames.forEach(name=>{
    const isChicken=/치킨|닭|chicken/i.test(name);
    const protein=isChicken?'chicken':'pork';
    patchRow(name,{
      styles:['🇻🇳 베트남'], baseId:'vietnamese', baseName:'베트남식', isVariation:true, cookTime:20,
      tags:['대표메뉴','반미Audit','쌀바게트90g','포션정상화'], servings:1, recipeServings:1,
      ingredients:['rice_baguette',protein,'cucumber','carrot','cilantro','pickled_radish','mayo','jalapeno','fish_sauce','garlic','lime','sugar'].concat(isChicken?['curry_powder']:[]),
      ingredientAmounts:Object.assign({rice_baguette:'90g'}, isChicken?{chicken:'80g'}:{pork:'70g'}, {cucumber:'40g',carrot:'30g',cilantro:'5g',pickled_radish:'25g',mayo:'8g',jalapeno:'8g',fish_sauce:'5g',garlic:'3g',lime:'10g',sugar:'3g'}, isChicken?{curry_powder:'5g'}:{})
    });
  });

  // 2) 지적 메뉴 포션 재보정
  patchRow('낙지연포탕',{
    styles:['한식'], baseId:'jjigae_tang', baseName:'찌개/탕', cookTime:25, tags:['국물','포션Audit','1인분보정'], servings:1, recipeServings:1,
    ingredients:['octopus','radish','green_onion','garlic','soup_soy_sauce','sesame_oil','water','salt','cheongyang_pepper'],
    ingredientAmounts:{octopus:'120g',radish:'60g',green_onion:'15g',garlic:'5g',soup_soy_sauce:'8g',sesame_oil:'3g',water:'450g',salt:'1g',cheongyang_pepper:'5g'}
  });
  patchRow('연포탕',{
    styles:['한식'], baseId:'jjigae_tang', baseName:'찌개/탕', cookTime:25, tags:['국물','포션Audit','1인분보정'], servings:1, recipeServings:1,
    ingredients:['octopus','radish','green_onion','garlic','soup_soy_sauce','water','salt','cheongyang_pepper'],
    ingredientAmounts:{octopus:'120g',radish:'60g',green_onion:'15g',garlic:'5g',soup_soy_sauce:'8g',water:'450g',salt:'1g',cheongyang_pepper:'5g'}
  });
  patchRow('쟁반국수',{
    styles:['한식'], baseId:'guksu_naengmyeon', baseName:'국수/냉면', cookTime:20, tags:['면','포션Audit','1인분보정'], servings:1, recipeServings:1,
    ingredients:['somyeon','cucumber','cabbage','carrot','egg','gochujang','vinegar','sugar','sesame_oil','sesame','garlic'],
    ingredientAmounts:{somyeon:'100g',cucumber:'40g',cabbage:'50g',carrot:'25g',egg:'50g',gochujang:'22g',vinegar:'15g',sugar:'8g',sesame_oil:'5g',sesame:'3g',garlic:'4g'}
  });
  patchRow('너비아니',{
    styles:['한식'], baseId:'bulgogi_jeyuk', baseName:'불고기/제육', cookTime:25, tags:['구이','포션Audit','1인분보정'], servings:1, recipeServings:1,
    ingredients:['beef','soy_sauce','sugar','garlic','green_onion','sesame_oil','sesame','pear'],
    ingredientAmounts:{beef:'130g',soy_sauce:'12g',sugar:'5g',garlic:'5g',green_onion:'10g',sesame_oil:'5g',sesame:'2g',pear:'25g'}
  });

  // 3) 전체 MENU_SCHEMA_V2 ingredientAmounts 단위 정규화(g 기준)
  Object.keys(schema).forEach(name=>{
    const row=schema[name];
    if(!row || !row.ingredientAmounts) return;
    row.ingredientAmounts=normalizedAmounts(row.ingredientAmounts);
    if(menuDB[name]){
      const m=menuDB[name];
      m.ingredientIds=row.ingredients||m.ingredientIds||[];
      m.ingredients=(row.ingredients||m.ingredientIds||[]).map(id=>({id,name:ingredientName(id),amount:row.ingredientAmounts[id]||ingDB[id]?.defaultAmount||'100g',icon:iconOf(id),category:ingredientCategory(id)}));
    }
  });

  // 4) 장바구니 생성 로직: 같은 id 재료는 g 합산해서 1줄로 표시
  window.getIngredientsFromDB = function(menus, people){
    const merged={};
    const s=(typeof S==='object'&&S)?S:{fridge:[]};
    const fridgeNames=(s.fridge||[]).map(f=>(f.name||'').trim());
    const fridgeIds=(typeof fridgeIngredientIdsV2==='function')?fridgeIngredientIdsV2():[];
    let allFound=true;
    const ppl=Math.max(1,Number(people||1));
    (menus||[]).forEach(menu=>{
      const name=(typeof flowMenuDBName==='function'?flowMenuDBName(menu):menu);
      const row=schema[name]||menuDB[name];
      if(!row){ allFound=false; return; }
      const ids=row.ingredientAmounts ? Object.keys(row.ingredientAmounts) : (row.ingredientIds||[]);
      ids.forEach(id=>{
        const ingName=ingredientName(id);
        if(!ingName) return;
        const amount=row.ingredientAmounts?.[id] || (row.ingredients||[]).find(x=>x.id===id)?.amount || ingDB[id]?.defaultAmount || '100g';
        const g=(amountToG(amount,id)||0)*ppl;
        const key=id||ingName;
        const inFridge=fridgeIds.includes(id)||fridgeNames.some(f=>f.includes(ingName)||ingName.includes(f));
        if(!merged[key]) merged[key]={name:ingName,id:key,_grams:0,amount:'0g',icon:iconOf(id),category:ingredientCategory(id),inFridge,usedIn:name};
        merged[key]._grams += g;
        merged[key].amount=fmtG(merged[key]._grams);
        merged[key].inFridge=merged[key].inFridge||inFridge;
        if(!String(merged[key].usedIn||'').includes(name)) merged[key].usedIn=(merged[key].usedIn?merged[key].usedIn+', ':'')+name;
      });
    });
    return {list:Object.values(merged).map(x=>{delete x._grams; return x;}), allFound};
  };

  window.WM_REVIEW_FIX_AUDIT={version:VERSION,banhMiMenus:banhMiNames,banhMiCount:banhMiNames.length,unitNormalized:true,patchedMenus:['연포탕','낙지연포탕','쟁반국수','너비아니',...banhMiNames]};
  console.info('[Homekeeper]',VERSION,window.WM_REVIEW_FIX_AUDIT);
})();
/* ===== /review-fixes-banhmi-units-v1 ===== */


/* ===== nakji-yeonpo-calorie-fix-v2 ===== */
(function(){
  /* 낙지연포탕 120kcal 보정
     원인: 기존 1인분 패치가 낙지를 120g으로 낮게 잡았고, 대파/마늘 등 일부 한글 영양키가 누락될 수 있어
     주재료가 거의 낙지 120g + 참기름 소량만 계산되는 상태였다.
     수정: 낙지 250g 기준 1인분으로 재정의하고, 관련 재료 영양키를 보강한다. */
  try{
    var schema=(typeof MENU_SCHEMA_V2!=='undefined')?MENU_SCHEMA_V2:(window.MENU_SCHEMA_V2||{});
    var menuDB=(typeof MENU_DB!=='undefined')?MENU_DB:(window.MENU_DB||{});
    var ingDB=(typeof INGREDIENT_DB_V2!=='undefined')?INGREDIENT_DB_V2:(window.INGREDIENT_DB_V2||{});
    if(typeof NUTRITION_DB!=='undefined'){
      Object.assign(NUTRITION_DB,{
        '낙지':{cal:73,pro:15,fat:1,carb:1},
        '무':{cal:18,pro:1,fat:0,carb:4},
        '대파':{cal:32,pro:1.8,fat:0.2,carb:7},
        '마늘':{cal:149,pro:6.4,fat:0.5,carb:33},
        '국간장':{cal:35,pro:4,fat:0,carb:5},
        '참기름':{cal:884,pro:0,fat:100,carb:0},
        '청양고추':{cal:27,pro:1,fat:0,carb:6},
        '물':{cal:0,pro:0,fat:0,carb:0},
        '소금':{cal:0,pro:0,fat:0,carb:0}
      });
    }
    if(ingDB){
      Object.assign(ingDB,{
        octopus:Object.assign({id:'octopus',name:'낙지',category:'protein',aliases:['낙지','산낙지'],icon:'🐙',defaultAmount:'250g'}, ingDB.octopus||{}),
        green_onion:Object.assign({id:'green_onion',name:'대파',category:'veg',aliases:['대파','파'],icon:'🧅',defaultAmount:'20g'}, ingDB.green_onion||{}),
        garlic:Object.assign({id:'garlic',name:'마늘',category:'sauce',aliases:['마늘','다진마늘'],icon:'🧄',defaultAmount:'6g'}, ingDB.garlic||{}),
        radish:Object.assign({id:'radish',name:'무',category:'veg',aliases:['무','무우'],icon:'🥬',defaultAmount:'80g'}, ingDB.radish||{})
      });
    }
    function uniq(a){return Array.from(new Set((a||[]).filter(Boolean)));}
    function ingName(id){return (ingDB&&ingDB[id]&&ingDB[id].name)||id;}
    function iconOf(id){return (ingDB&&ingDB[id]&&ingDB[id].icon)||'🛒';}
    function catOf(id){var c=(ingDB&&ingDB[id]&&ingDB[id].category)||'기타'; return {veg:'채소',protein:'단백질',sauce:'양념',grain:'면·밥',dairy:'기타'}[c]||'기타';}
    function upsert(name, spec){
      var prev=(schema&&schema[name])||(menuDB&&menuDB[name])||{};
      var row=Object.assign({},prev,spec,{name:name});
      row.tags=uniq([...(prev.tags||[]),...(spec.tags||[])]);
      row.servings=1; row.recipeServings=1;
      if(schema) schema[name]=row;
      if(menuDB){
        menuDB[name]=Object.assign(menuDB[name]||{}, row, {
          style:(row.styles||[])[0]||'한식',
          ingredientIds:row.ingredients||[],
          ingredients:(row.ingredients||[]).map(function(id){return {id:id,name:ingName(id),amount:(row.ingredientAmounts||{})[id]||'100g',icon:iconOf(id),category:catOf(id)};})
        });
      }
    }
    var common={
      styles:['한식'], baseId:'jjigae_tang', baseName:'찌개/탕', cookTime:25,
      tags:['국물','낙지연포탕보정','주재료보강','1인분포션'],
      ingredients:['octopus','radish','green_onion','garlic','soup_soy_sauce','sesame_oil','water','salt','cheongyang_pepper'],
      ingredientAmounts:{octopus:'250g',radish:'80g',green_onion:'20g',garlic:'6g',soup_soy_sauce:'8g',sesame_oil:'5g',water:'450g',salt:'1g',cheongyang_pepper:'5g'}
    };
    upsert('낙지연포탕', common);
    upsert('연포탕', Object.assign({}, common, {tags:['국물','연포탕보정','주재료보강','1인분포션']}));
    window.WM_NAKJI_YEONPO_FIX={version:'nakji-yeonpo-calorie-fix-v2',octopusAmount:'250g',expectedKcalRange:'250~300kcal'};
    console.info('[Homekeeper] 낙지연포탕 보정 완료', window.WM_NAKJI_YEONPO_FIX);
  }catch(e){console.warn('nakji yeonpo fix failed',e);}
})();
/* ===== /nakji-yeonpo-calorie-fix-v2 ===== */


/* ===== commercial-nutrition-foundation-v1 ===== */
(function(){
  /* 상업용 출시 기준 영양/장보기 신뢰도 패치
     핵심 원칙: 메뉴 kcal은 메뉴별 1인분 포션 + 재료별 100g 영양 DB 합산으로만 산출한다.
     - 제철 노출 제거
     - 재료 단위 g/ml 정규화
     - 장바구니 동일 재료 g/ml 합산
     - 내부 Audit 리포트 함수 제공 */
  try{
    function DB(name){
      try{ if(name==='MENU_SCHEMA_V2' && typeof MENU_SCHEMA_V2!=='undefined') return MENU_SCHEMA_V2; }catch(e){}
      try{ if(name==='MENU_DB' && typeof MENU_DB!=='undefined') return MENU_DB; }catch(e){}
      try{ if(name==='INGREDIENT_DB_V2' && typeof INGREDIENT_DB_V2!=='undefined') return INGREDIENT_DB_V2; }catch(e){}
      try{ if(name==='NUTRITION_DB' && typeof NUTRITION_DB!=='undefined') return NUTRITION_DB; }catch(e){}
      return window[name]||{};
    }
    var schema=DB('MENU_SCHEMA_V2'), menuDB=DB('MENU_DB'), ingDB=DB('INGREDIENT_DB_V2'), nutDB=DB('NUTRITION_DB');

    // 1) 제철 표시는 상업용 MVP에서 제거: 추천 점수/배지/문구 모두 무효화
    window.getSeasonalIngs=function(){return [];};
    window.getSeasonalScore=function(){return 0;};
    window.seasonBadge=function(){return '';};
    window.WM_SEASONAL_DISABLED=true;

    // 2) 재료별 단위 환산표. 같은 재료는 같은 id + g/ml 기준으로 통합한다.
    var UNIT_G={
      garlic:{'쪽':5,'개':5,'알':5}, egg:{'개':50,'알':50}, onion:{'개':150}, green_onion:{'대':25,'개':25},
      scallion:{'대':20}, leek:{'대':80}, cheongyang_pepper:{'개':10}, red_pepper:{'개':12}, chili:{'개':10},
      ginger:{'쪽':5,'개':5}, cucumber:{'개':150}, carrot:{'개':120}, potato:{'개':150}, sweet_potato:{'개':180},
      tomato:{'개':150}, lemon:{'개':100}, lime:{'개':60}, apple:{'개':250}, banana:{'개':120}, avocado:{'개':150},
      tofu:{'모':300,'팩':300}, soft_tofu:{'팩':350}, kimchi:{'포기':1200}, napa:{'포기':1200}, cabbage:{'통':900},
      squid:{'마리':250}, mackerel:{'마리':250}, hairtail:{'마리':250}, pollack:{'마리':300}, crab:{'마리':200}, octopus:{'마리':250},
      bread:{'장':35}, baguette:{'개':90}, rice_baguette:{'개':90}, tortilla:{'장':45}, rice_paper:{'장':10}, mandu_skin:{'장':8},
      ramen:{'개':130,'봉':130}, ramen_noodle:{'개':130}, udon:{'개':200}, soba:{'인분':100}, somen:{'인분':100}, noodle:{'인분':100},
      tuna:{'캔':150}, natto:{'팩':50}, yogurt:{'컵':150}, milk:{'컵':200}, cream:{'컵':200}
    };
    var GENERIC_G={'큰술':12,'작은술':4,'스푼':12,'T':12,'t':4,'컵':200,'장':10,'개':50,'쪽':5,'알':50,'대':25,'마리':200,'팩':150,'캔':150,'모':300,'봉':130,'인분':100};
    var ML_IDS=/water|broth|stock|milk|cream|soy_sauce|soup_soy_sauce|fish_sauce|vinegar|mirin|cheongju|wine|sake|lime|lemon|sauce/i;
    var ZERO_IDS=/water|broth|stock|salt|pepper/i;

    function parseAmount(ingId, raw){
      var s=String(raw==null?'':raw).trim();
      if(!s) return {value:0,unit:'g',display:'0g',raw:s};
      var n=parseFloat(s.replace(/,/g,'').match(/[0-9]+(?:\.[0-9]+)?/)?.[0]||'0');
      if(!n) return {value:0,unit:'g',display:s,raw:s};
      if(/kg/i.test(s)) return {value:n*1000,unit:'g',display:Math.round(n*1000)+'g',raw:s};
      if(/ml|㎖/i.test(s)) return {value:n,unit:'ml',display:Math.round(n)+'ml',raw:s};
      if(/g|그램/i.test(s)) return {value:n,unit:'g',display:round1(n)+'g',raw:s};
      var unitMatch=s.match(/(큰술|작은술|스푼|쪽|개|알|대|마리|장|컵|팩|캔|모|봉|인분|T|t)/);
      var unit=unitMatch?unitMatch[1]:'';
      var table=UNIT_G[ingId]||{};
      var gram=table[unit]||GENERIC_G[unit]||1;
      var metricUnit=ML_IDS.test(ingId)?'ml':'g';
      var val=n*gram;
      return {value:val,unit:metricUnit,display:round1(val)+(metricUnit==='ml'?'ml':'g'),raw:s,sourceUnit:unit};
    }
    function round1(x){return Math.round(x*10)/10;}
    function catOf(id){var c=(ingDB&&ingDB[id]&&ingDB[id].category)||'기타'; return {veg:'채소',protein:'단백질',grain:'면·밥',sauce:'양념',dairy:'기타',fruit:'채소'}[c]||'기타';}
    function nameOf(id){return (ingDB&&ingDB[id]&&ingDB[id].name)||id;}
    function iconOf(id){return (ingDB&&ingDB[id]&&ingDB[id].icon)||'🛒';}

    // 3) 전체 메뉴 포션을 g/ml 문자열로 정규화하고 MENU_DB 표시용 재료도 동기화
    function normalizeAllMenuAmounts(){
      Object.keys(schema||{}).forEach(function(menuName){
        var row=schema[menuName]; if(!row||!row.ingredientAmounts) return;
        Object.keys(row.ingredientAmounts).forEach(function(id){
          var p=parseAmount(id,row.ingredientAmounts[id]);
          if(p.value>0) row.ingredientAmounts[id]=p.display;
        });
        if(menuDB&&menuDB[menuName]){
          menuDB[menuName].ingredientIds=row.ingredients||menuDB[menuName].ingredientIds||[];
          menuDB[menuName].ingredients=(row.ingredients||[]).map(function(id){
            return {id:id,name:nameOf(id),amount:(row.ingredientAmounts||{})[id]||'0g',icon:iconOf(id),category:catOf(id)};
          });
        }
      });
    }

    // 4) calcNutrition 보강: MENU_SCHEMA_V2의 g/ml 포션과 NUTRITION_DB 100g 값을 기준으로 계산
    var prevCalc=window.calcNutrition;
    window.calcNutrition=function(menuName, people){
      people=Math.max(1,people||1);
      var row=(schema&&schema[menuName])||null;
      if(!row||!row.ingredientAmounts) return prevCalc?prevCalc(menuName,people):{cal:0,pro:0,fat:0,carb:0,calRange:'0~0kcal'};
      var servings=Math.max(1,row.recipeServings||row.servings||1);
      var totals={cal:0,pro:0,fat:0,carb:0};
      Object.keys(row.ingredientAmounts).forEach(function(id){
        var p=parseAmount(id,row.ingredientAmounts[id]);
        var grams=p.value;
        if(/cooking_oil|olive_oil|sesame_oil|oil/i.test(id)) grams*=0.18; // 조리유 흡수율
        var ingName=nameOf(id);
        var nut=nutDB[ingName]||nutDB[id];
        if(!nut) return;
        var r=grams/100;
        totals.cal+=(nut.cal||0)*r; totals.pro+=(nut.pro||0)*r; totals.fat+=(nut.fat||0)*r; totals.carb+=(nut.carb||0)*r;
      });
      var scale=people/servings;
      var cal=Math.round(totals.cal*scale);
      return {cal:cal,calLo:Math.round(cal*.95),calHi:Math.round(cal*1.05),calRange:Math.round(cal*.95)+'~'+Math.round(cal*1.05)+'kcal',pro:Math.round(totals.pro*scale),fat:Math.round(totals.fat*scale),carb:Math.round(totals.carb*scale)};
    };
    window.getMenuNut=function(name){return window.calcNutrition(name,1);};

    // 5) 장바구니 생성 보강: 같은 id 재료는 g/ml로 합산. 마늘 50g + 마늘 5쪽 같은 중복 방지.
    var prevGetIngredients=window.getIngredientsFromDB;
    window.getIngredientsFromDB=function(menus, people){
      people=Math.max(1,people||1);
      var merged={}, allFound=true;
      var fridgeNames=(window.S&&S.fridge?S.fridge:[]).map(function(f){return (f.name||'').trim();});
      var fridgeIds=(typeof fridgeIngredientIdsV2==='function')?fridgeIngredientIdsV2():[];
      (menus||[]).forEach(function(menu){
        var name=(typeof flowMenuDBName==='function'?flowMenuDBName(menu):menu);
        var row=(schema&&schema[name])||null;
        var ids=row?(row.ingredients||Object.keys(row.ingredientAmounts||{})):((menuDB[name]&&menuDB[name].ingredientIds)||[]);
        if(!ids.length){allFound=false; return;}
        var servings=Math.max(1,(row&&(row.recipeServings||row.servings))||1);
        var scale=people/servings;
        ids.forEach(function(id){
          var raw=(row&&row.ingredientAmounts&&row.ingredientAmounts[id])||(menuDB[name]&&menuDB[name].ingredients||[]).find(function(x){return x.id===id;})?.amount||'0g';
          var p=parseAmount(id,raw); var val=p.value*scale; var unit=p.unit;
          var key=id;
          var ingName=nameOf(id); if(!ingName) return;
          var inFridge=fridgeIds.includes(id)||fridgeNames.some(function(f){return f&&((f.includes(ingName))||(ingName.includes(f)));});
          if(!merged[key]) merged[key]={id:id,name:ingName,amountValue:0,amountUnit:unit,icon:iconOf(id),category:catOf(id),inFridge:inFridge,usedIn:name};
          merged[key].amountValue+=val;
          merged[key].inFridge=merged[key].inFridge||inFridge;
          if(!String(merged[key].usedIn||'').includes(name)) merged[key].usedIn+=(merged[key].usedIn?', ':'')+name;
        });
      });
      var list=Object.values(merged).map(function(x){
        x.amount=round1(x.amountValue)+(x.amountUnit==='ml'?'ml':'g');
        return x;
      });
      return {list:list,allFound:allFound};
    };

    // 6) 내부 품질 Audit 함수. 콘솔에서 WM_AUDIT_REPORT() 호출하면 이상값/누락값 확인 가능.
    window.WM_AUDIT_REPORT=function(){
      var report={totalMenus:0,nonMetricAmounts:[],missingNutrition:[],suspiciousCalories:[],missingAmounts:[]};
      Object.keys(schema||{}).forEach(function(menuName){
        var row=schema[menuName]; if(!row) return; report.totalMenus++;
        (row.ingredients||Object.keys(row.ingredientAmounts||{})).forEach(function(id){
          var raw=row.ingredientAmounts&&row.ingredientAmounts[id];
          if(!raw) report.missingAmounts.push({menu:menuName,id:id});
          if(raw&&!/(g|ml)$/i.test(String(raw))) report.nonMetricAmounts.push({menu:menuName,id:id,amount:raw});
          var nm=nameOf(id); if(!nutDB[nm]&&!ZERO_IDS.test(id)) report.missingNutrition.push({menu:menuName,id:id,name:nm});
        });
        var n=window.calcNutrition(menuName,1);
        var base=row.baseName||'';
        var low=/라멘|면|국수|덮밥|볶음밥|파스타|리조또|포케|스테이크|튀김|커리/.test(menuName+base) ? 250 : 80;
        var high=/라멘|츠케멘|튀김|덮밥|커리|파스타|리조또/.test(menuName+base) ? 1200 : 950;
        if(n.cal<low || n.cal>high) report.suspiciousCalories.push({menu:menuName,kcal:n.cal,baseName:base});
      });
      report.nonMetricAmounts=report.nonMetricAmounts.slice(0,200);
      report.missingNutrition=report.missingNutrition.slice(0,200);
      report.suspiciousCalories=report.suspiciousCalories.slice(0,200);
      return report;
    };

    normalizeAllMenuAmounts();
    window.WM_COMMERCIAL_NUTRITION_FOUNDATION={version:'v1',principle:'menu kcal = ingredient nutrition per 100g × explicit 1-serving portions',seasonalRemoved:true,metricUnits:true,cartAggregation:'by ingredient id with g/ml sum'};
    console.info('[Homekeeper] commercial nutrition foundation applied', window.WM_COMMERCIAL_NUTRITION_FOUNDATION);
  }catch(e){console.warn('commercial nutrition foundation patch failed',e);}
})();
/* ===== /commercial-nutrition-foundation-v1 ===== */


/* ===== commercial-nutrition-actual-corrections-v2 ===== */
(function(){
  try{
    var schema=(typeof MENU_SCHEMA_V2!=='undefined')?MENU_SCHEMA_V2:(window.MENU_SCHEMA_V2||{});
    var nut=(typeof NUTRITION_DB!=='undefined')?NUTRITION_DB:(window.NUTRITION_DB||{});
    var ingDB=(typeof INGREDIENT_DB_V2!=='undefined')?INGREDIENT_DB_V2:(window.INGREDIENT_DB_V2||{});
    if(!schema || !nut) return;
    function addNut(k,v){ nut[k]=Object.assign({pro:0,fat:0,carb:0},v); }
    Object.assign(nut,{
      '밥':{cal:150,pro:3,fat:0.3,carb:33},
      '쌀밥':{cal:150,pro:3,fat:0.3,carb:33},
      '라멘면':{cal:285,pro:9,fat:2,carb:57},
      '중화면':{cal:210,pro:7,fat:1,carb:43},
      '야키소바면':{cal:198,pro:6,fat:1,carb:41},
      '소바면':{cal:150,pro:5,fat:1,carb:30},
      '우동면':{cal:135,pro:4,fat:1,carb:28},
      '돈카츠':{cal:295,pro:18,fat:16,carb:20},
      '코로케':{cal:220,pro:5,fat:10,carb:28},
      '고로케':{cal:220,pro:5,fat:10,carb:28},
      '새우튀김':{cal:260,pro:13,fat:14,carb:20},
      '누룽지':{cal:393,pro:7,fat:1,carb:88},
      '꽃빵':{cal:240,pro:7,fat:2,carb:48},
      '춘권피':{cal:310,pro:8,fat:4,carb:62},
      '식용유흡수':{cal:884,pro:0,fat:100,carb:0},
      '소스':{cal:80,pro:1,fat:1,carb:16},
      '라멘육수':{cal:25,pro:2,fat:1,carb:1},
      '닭백탕육수':{cal:45,pro:4,fat:2,carb:1},
      '차슈':{cal:250,pro:18,fat:18,carb:2},
      '멘마':{cal:20,pro:1,fat:0,carb:4},
      '김가루':{cal:35,pro:6,fat:1,carb:4},
      '가쓰오육수':{cal:8,pro:1,fat:0,carb:1},
      '오차즈케육수':{cal:5,pro:0,fat:0,carb:1},
      '하이라이스소스':{cal:105,pro:2,fat:4,carb:15},
      '탄탄면소스':{cal:260,pro:8,fat:20,carb:12},
      '참깨소스':{cal:520,pro:15,fat:45,carb:15},
      '야키소바소스':{cal:95,pro:3,fat:0,carb:21},
      '케첩':{cal:100,pro:1,fat:0,carb:24},
      '토마토케첩':{cal:100,pro:1,fat:0,carb:24},
      '비엔나소시지':{cal:300,pro:12,fat:25,carb:5},
      '피망':{cal:20,pro:1,fat:0,carb:5},
      '숙주':{cal:30,pro:3,fat:0,carb:6},
      '양배추':{cal:25,pro:1,fat:0,carb:6},
      '양파':{cal:40,pro:1,fat:0,carb:9},
      '당근':{cal:41,pro:1,fat:0,carb:10},
      '대파':{cal:32,pro:2,fat:0,carb:7},
      '마늘':{cal:149,pro:6,fat:1,carb:33},
      '간장':{cal:53,pro:8,fat:0,carb:5},
      '미림':{cal:230,pro:0,fat:0,carb:45},
      '설탕':{cal:387,pro:0,fat:0,carb:100},
      '소금':{cal:0,pro:0,fat:0,carb:0},
      '후추':{cal:250,pro:10,fat:3,carb:64},
      '감자':{cal:77,pro:2,fat:0,carb:17},
      '돼지고기':{cal:242,pro:20,fat:17,carb:0},
      '돼지고기등심':{cal:155,pro:22,fat:7,carb:0},
      '닭다리살':{cal:175,pro:18,fat:11,carb:0},
      '닭고기':{cal:158,pro:18,fat:9,carb:0},
      '새우':{cal:85,pro:18,fat:1,carb:1},
      '오징어':{cal:88,pro:18,fat:1,carb:2},
      '조개':{cal:74,pro:13,fat:1,carb:3},
      '연어':{cal:208,pro:20,fat:13,carb:0},
      '참치':{cal:144,pro:23,fat:5,carb:0},
      '흰살생선':{cal:90,pro:18,fat:2,carb:0},
      '계란':{cal:155,pro:13,fat:11,carb:1},
      '숙주나물':{cal:30,pro:3,fat:0,carb:6},
      '표고버섯':{cal:34,pro:2,fat:0,carb:7},
      '죽순':{cal:27,pro:3,fat:0,carb:5},
      '청경채':{cal:13,pro:2,fat:0,carb:2},
      '전분':{cal:381,pro:0,fat:0,carb:91},
      '튀김가루':{cal:360,pro:8,fat:2,carb:76},
      '빵가루':{cal:395,pro:13,fat:5,carb:75},
      '식빵':{cal:260,pro:8,fat:3,carb:48},
      '밀가루':{cal:364,pro:10,fat:1,carb:76},
      '마요네즈':{cal:680,pro:1,fat:75,carb:2},
      '우스터소스':{cal:78,pro:1,fat:0,carb:19},
      '가쓰오부시':{cal:350,pro:75,fat:5,carb:0},
      '김':{cal:35,pro:6,fat:1,carb:4}
    });
    function row(name, styles, ingredients, amounts, tags){
      schema[name]={name:name,styles:styles||['일식'],ingredients:ingredients,cookTime:25,tags:['상업용포션Audit','실제칼로리보정'].concat(tags||[]),servings:1,recipeServings:1,ingredientAmounts:amounts};
      if(window.MENU_DB && window.MENU_DB[name]){
        window.MENU_DB[name].styles=styles||window.MENU_DB[name].styles||[window.MENU_DB[name].style||'일식'];
        window.MENU_DB[name].ingredientIds=ingredients;
        window.MENU_DB[name].ingredientAmounts=amounts;
        window.MENU_DB[name].tags=[...(window.MENU_DB[name].tags||[]),'상업용포션Audit'];
      }
    }
    // 저평가 메뉴 상향: 누락된 핵심 재료/튀김 흡수유/면·빵·누룽지를 명시
    row('고추잡채',['중식'],['돼지고기등심','피망','양파','죽순','표고버섯','간장','굴소스','전분','식용유흡수','꽃빵'],{돼지고기등심:'110g',피망:'80g',양파:'50g',죽순:'40g',표고버섯:'30g',간장:'12g',굴소스:'15g',전분:'8g',식용유흡수:'12g',꽃빵:'80g'},['중식']);
    row('해물누룽지탕',['중식'],['누룽지','새우','오징어','조개','청경채','표고버섯','죽순','전분','식용유흡수','소스'],{누룽지:'80g',새우:'70g',오징어:'60g',조개:'50g',청경채:'60g',표고버섯:'30g',죽순:'30g',전분:'12g',식용유흡수:'8g',소스:'40g'},['중식']);
    row('크림새우',['중식'],['새우','튀김가루','전분','식용유흡수','마요네즈','생크림','설탕'],{새우:'150g',튀김가루:'55g',전분:'15g',식용유흡수:'18g',마요네즈:'35g',생크림:'20g',설탕:'8g'},['중식','튀김']);
    row('멘보샤',['중식'],['식빵','새우','전분','계란','식용유흡수','마요네즈'],{식빵:'80g',새우:'120g',전분:'20g',계란:'25g',식용유흡수:'20g',마요네즈:'15g'},['중식','튀김']);
    row('오향장육',['중식'],['돼지고기','간장','설탕','마늘','대파','소스'],{돼지고기:'180g',간장:'20g',설탕:'8g',마늘:'8g',대파:'20g',소스:'30g'},['중식']);
    row('총유병',['중식'],['밀가루','대파','식용유흡수','참기름','소금'],{밀가루:'70g',대파:'25g',식용유흡수:'12g',참기름:'4g',소금:'1g'},['중식']);
    row('나베',['일식'],['닭고기','두부','배추','버섯','대파','가쓰오육수','간장','미림'],{닭고기:'100g',두부:'100g',배추:'120g',버섯:'70g',대파:'30g',가쓰오육수:'450ml',간장:'15g',미림:'10g'},['일식']);
    row('가라아게',['일식'],['닭다리살','전분','튀김가루','식용유흡수','간장','마늘','생강'],{닭다리살:'160g',전분:'25g',튀김가루:'20g',식용유흡수:'18g',간장:'15g',마늘:'5g',생강:'3g'},['일식','튀김']);
    row('데리야키치킨',['일식'],['닭다리살','간장','미림','설탕','마늘','식용유흡수','밥'],{닭다리살:'160g',간장:'20g',미림:'15g',설탕:'8g',마늘:'5g',식용유흡수:'6g',밥:'120g'},['일식']);
    row('나폴리탄',['일식'],['스파게티','비엔나소시지','양파','피망','케첩','버터','식용유흡수','파마산치즈'],{스파게티:'230g',비엔나소시지:'70g',양파:'60g',피망:'40g',케첩:'55g',버터:'10g',식용유흡수:'5g',파마산치즈:'8g'},['일식']);
    // 고평가 메뉴 하향: 밥/면을 조리 후 1인분 기준으로 조정, 2~3인분 재료 제거
    row('코로케',['일식'],['감자','돼지고기','양파','밀가루','계란','빵가루','식용유흡수'],{감자:'100g',돼지고기:'25g',양파:'20g',밀가루:'10g',계란:'10g',빵가루:'18g',식용유흡수:'8g'},['일식']);
    row('고로케',['일식'],['감자','돼지고기','양파','밀가루','계란','빵가루','식용유흡수'],{감자:'100g',돼지고기:'25g',양파:'20g',밀가루:'10g',계란:'10g',빵가루:'18g',식용유흡수:'8g'},['일식']);
    row('야키소바',['일식'],['야키소바면','돼지고기','양배추','당근','양파','야키소바소스','식용유흡수'],{야키소바면:'170g',돼지고기:'60g',양배추:'80g',당근:'25g',양파:'40g',야키소바소스:'35g',식용유흡수:'8g'},['일식']);
    row('츠케멘',['일식'],['라멘면','차슈','계란','멘마','대파','라멘육수','간장','식용유흡수'],{라멘면:'220g',차슈:'60g',계란:'50g',멘마:'30g',대파:'15g',라멘육수:'250ml',간장:'15g',식용유흡수:'8g'},['일식','라멘']);
    row('가츠동',['일식'],['밥','돈카츠','계란','양파','간장','미림','설탕'],{밥:'190g',돈카츠:'120g',계란:'50g',양파:'60g',간장:'18g',미림:'15g',설탕:'6g'},['일식','덮밥']);
    row('오야코동',['일식'],['밥','닭다리살','계란','양파','간장','미림','설탕'],{밥:'180g',닭다리살:'110g',계란:'60g',양파:'70g',간장:'18g',미림:'15g',설탕:'5g'},['일식','덮밥']);
    row('쇼유라멘',['일식'],['라멘면','차슈','계란','멘마','대파','라멘육수','간장'],{라멘면:'140g',차슈:'45g',계란:'50g',멘마:'25g',대파:'15g',라멘육수:'350ml',간장:'18g'},['일식','라멘']);
    row('오차즈케',['일식'],['밥','연어','김','가쓰오부시','오차즈케육수','간장'],{밥:'160g',연어:'35g',김:'3g',가쓰오부시:'3g',오차즈케육수:'250ml',간장:'8g'},['일식']);
    row('카케소바',['일식'],['소바면','가쓰오육수','간장','미림','대파','김'],{소바면:'220g',가쓰오육수:'350ml',간장:'15g',미림:'10g',대파:'15g',김:'2g'},['일식','소바']);
    row('카케소',['일식'],['소바면','가쓰오육수','간장','미림','대파','김'],{소바면:'220g',가쓰오육수:'350ml',간장:'15g',미림:'10g',대파:'15g',김:'2g'},['일식','소바']);
    row('야키오니기리',['일식'],['밥','간장','미림','김','식용유흡수'],{밥:'140g',간장:'10g',미림:'5g',김:'2g',식용유흡수:'2g'},['일식']);
    row('에비텐',['일식'],['새우','튀김가루','계란','식용유흡수','간장'],{새우:'90g',튀김가루:'35g',계란:'15g',식용유흡수:'12g',간장:'8g'},['일식','튀김']);
    row('부타동',['일식'],['밥','돼지고기','양파','간장','미림','설탕','식용유흡수'],{밥:'190g',돼지고기:'130g',양파:'60g',간장:'18g',미림:'15g',설탕:'6g',식용유흡수:'4g'},['일식','덮밥']);
    row('탄탄면',['일식'],['라멘면','돼지고기','탄탄면소스','숙주','대파','라멘육수','식용유흡수'],{라멘면:'140g',돼지고기:'80g',탄탄면소스:'45g',숙주:'50g',대파:'20g',라멘육수:'300ml',식용유흡수:'5g'},['일식','라멘']);
    row('하이라이스',['일식'],['밥','소고기불고기용','양파','당근','하이라이스소스','식용유흡수'],{밥:'200g',소고기불고기용:'90g',양파:'80g',당근:'40g',하이라이스소스:'120g',식용유흡수:'5g'},['일식','덮밥']);
    row('가이센동',['일식'],['밥','연어','참치','새우','오징어','김','간장','와사비'],{밥:'180g',연어:'50g',참치:'50g',새우:'40g',오징어:'35g',김:'2g',간장:'10g',와사비:'2g'},['일식','덮밥']);
    row('오니기리',['일식'],['밥','김','참치','마요네즈'],{밥:'115g',김:'2g',참치:'20g',마요네즈:'4g'},['일식']);
    row('토리파이탄',['일식'],['라멘면','닭다리살','계란','멘마','대파','닭백탕육수','식용유흡수'],{라멘면:'140g',닭다리살:'90g',계란:'50g',멘마:'25g',대파:'15g',닭백탕육수:'350ml',식용유흡수:'6g'},['일식','라멘']);
    // 제철 표시/문구는 상업 출시 UX에서 제외
    window.getSeasonalIngredients=function(){return [];};
    window.getSeasonalMenus=function(){return [];};
    window.renderSeasonalBadge=function(){return '';};
    window.WM_CALORIE_REAUDIT_ACTUAL_V2={applied:true,menus:Object.keys(schema).filter(function(n){return /고추잡채|해물누룽지탕|크림새우|멘보샤|오향장육|총유병|나베|가라아게|데리야키치킨|나폴리탄|코로케|고로케|야키소바|츠케멘|가츠동|오야코동|쇼유라멘|오차즈케|카케소바|카케소|야키오니기리|에비텐|부타동|탄탄면|하이라이스|가이센동|오니기리|토리파이탄/.test(n);}),note:'실제 MENU_SCHEMA_V2 포션을 교체하여 calcNutrition 결과가 바뀌도록 적용'};
    console.info('[Homekeeper] calorie reaudit actual v2 applied', window.WM_CALORIE_REAUDIT_ACTUAL_V2);
  }catch(e){ console.warn('calorie reaudit actual v2 failed', e); }
})();
/* ===== /commercial-nutrition-actual-corrections-v2 ===== */


/* ===== wm-duplicate-menu-cleanup-v6 ===== */
(function(){
  try{
    if(!window.MENU_DB) return;
    const beforeCount = Object.keys(MENU_DB).length;
    const DUP_ALIAS = {
      // 사용자가 지정한 삭제/통합 목록
      '홍샤오러우':'홍소육',
      '훔무스':'후무스',
      '팟카파오 무쌉':'팟끄라파오무쌉',
      '팟카파오무쌉':'팟끄라파오무쌉',
      '탄탄면':'탄탄면',
      '퀘사디야':'퀘사디야',
      '케사디야':'퀘사디야',
      '카르네 아사다 타코':'카르네아사다',
      '차퀘이테오싱가포르':'차퀘이테오',
      '차퀘이티아오':'차퀘이테오',
      '완탕미싱가포르':'완탕면',
      '오탁오탁':'오타오타',
      '오타오타싱가포르':'오타오타',
      '소고기무국':'소고기뭇국',
      '뿌팟퐁가리':'__DELETE__뿌팟퐁커리',
      '껌승':'껌스엉',

      // 전체 중복 메뉴 표기 정리
      '__DELETE__로건조쉬':'로간조쉬',
      '__DELETE__로건조시':'로간조쉬',
      '마사만커리':'마싸만 커리',
      '달마카니':'달마크니',
      '라르브무':'라브무',
      '라프무':'라브무',
      '록락':'보룩락',
      '로티자나이':'로티차나이',
      '고로케':'코로케',
      '카르보나라':'까르보나라',
      '감바스알아히요':'감바스',
      '쏨땀':'쏨땀',
      '푸팟퐁커리':'__DELETE__뿌팟퐁커리',
      '__DELETE__치라시즈시':'치라시스시',
      '__DELETE__히야시츄카':'히야시추카',
      '__DELETE__코브샐러드':'콥샐러드',
      '쯔케멘':'츠케멘',
      '파에야':'빠에야',
      '__DELETE__포졸레':'포솔레',
      '호켄미':'호키엔미',
      '찐호키엔미':'호키엔미',
      '미고랭말레이':'미고랭',
      '하이난 치킨라이스':'하이난치킨라이스',
      '비프 렌당':'비프렌당',
      '일본식 카레라이스':'일본식카레라이스',
      '오징어먹물 파스타':'오징어먹물파스타',
      '클래식 세비체':'세비체',
      '기로스 피타':'기로스',
      '카케소':'카케소바',
      '탄탄면':'탄탄면'
    };
    const EXACT_DELETE = new Set(['케밥']);

    function norm(s){return String(s||'').replace(/[\s_\-·()]/g,'').toLowerCase();}
    const normAlias={};
    Object.keys(DUP_ALIAS).forEach(k=>{ normAlias[norm(k)] = DUP_ALIAS[k]; });

    function mergeArray(a,b){ return [...new Set([...(a||[]),...(b||[])].filter(Boolean))]; }
    function mergeIngredients(a,b){
      const result=[]; const seen=new Set();
      [...(a||[]),...(b||[])].forEach(x=>{
        const key=(x&&typeof x==='object') ? (x.id||x.name||JSON.stringify(x)) : String(x);
        if(seen.has(key)) return;
        seen.add(key); result.push(x);
      });
      return result;
    }
    function mergeMenu(oldName, newName){
      if(!oldName || !newName || oldName===newName) return false;
      const oldMenu = MENU_DB[oldName];
      if(!oldMenu) return false;
      if(!MENU_DB[newName]){
        MENU_DB[newName] = Object.assign({}, oldMenu, {id:newName, name:newName});
      }else{
        const a=MENU_DB[newName], b=oldMenu;
        a.ingredients = mergeIngredients(a.ingredients, b.ingredients).slice(0,14);
        a.ingredientIds = mergeArray(a.ingredientIds, b.ingredientIds);
        a.styles = mergeArray(a.styles || [a.style], b.styles || [b.style]);
        a.tags = mergeArray(a.tags, b.tags);
        a.style = a.style || b.style || (a.styles&&a.styles[0]);
        a.cookTime = a.cookTime || b.cookTime;
        a.mealRole = a.mealRole || b.mealRole;
        a.category = a.category || b.category;
      }
      delete MENU_DB[oldName];

      if(window.MENU_SCHEMA_V2 && MENU_SCHEMA_V2[oldName]){
        if(!MENU_SCHEMA_V2[newName]) MENU_SCHEMA_V2[newName]=Object.assign({}, MENU_SCHEMA_V2[oldName], {name:newName});
        else{
          const a=MENU_SCHEMA_V2[newName], b=MENU_SCHEMA_V2[oldName];
          a.ingredients = mergeArray(a.ingredients, b.ingredients);
          a.styles = mergeArray(a.styles, b.styles);
          a.tags = mergeArray(a.tags, b.tags);
          a.ingredientAmounts = Object.assign({}, b.ingredientAmounts||{}, a.ingredientAmounts||{});
        }
        delete MENU_SCHEMA_V2[oldName];
      }
      if(window.WM_NUT_V5 && WM_NUT_V5[oldName]){
        if(!WM_NUT_V5[newName]) WM_NUT_V5[newName]=WM_NUT_V5[oldName];
        delete WM_NUT_V5[oldName];
      }
      return true;
    }

    // 1) 명시 삭제
    EXACT_DELETE.forEach(n=>{ if(MENU_DB[n]) delete MENU_DB[n]; if(window.MENU_SCHEMA_V2) delete MENU_SCHEMA_V2[n]; if(window.WM_NUT_V5) delete WM_NUT_V5[n]; });

    // 2) 명시 중복 병합
    Object.keys(DUP_ALIAS).forEach(oldName=>mergeMenu(oldName, DUP_ALIAS[oldName]));

    // 3) 공백/기호만 다른 완전 중복 자동 병합
    const canonicalByNorm={};
    Object.keys(MENU_DB).forEach(name=>{
      const n=norm(name);
      if(!canonicalByNorm[n]) canonicalByNorm[n]=name;
      else mergeMenu(name, canonicalByNorm[n]);
    });

    // 4) 메뉴 그룹/스타일 맵 내 삭제명 참조 정리
    function mapMenuName(x){
      if(!x) return x;
      const raw=String(x);
      const ali=DUP_ALIAS[raw] || normAlias[norm(raw)];
      return ali || raw;
    }
    if(window.MENU_GROUP_DB_V3){
      Object.values(MENU_GROUP_DB_V3).forEach(g=>{
        if(Array.isArray(g.variations)) g.variations=[...new Set(g.variations.map(mapMenuName).filter(n=>MENU_DB[n]))];
      });
    }
    if(window.FLOW_STYLE_MENU_MAP){
      Object.keys(FLOW_STYLE_MENU_MAP).forEach(k=>{
        if(Array.isArray(FLOW_STYLE_MENU_MAP[k])) FLOW_STYLE_MENU_MAP[k]=[...new Set(FLOW_STYLE_MENU_MAP[k].map(mapMenuName).filter(n=>MENU_DB[n]))];
      });
    }

    // 5) 예전 이름으로 들어온 입력/저장값은 canonical으로 해석
    const oldResolve = window.resolveMenu;
    window.resolveMenu = function(name){
      const raw=String(name||'').trim();
      if(!raw) return null;
      const ali = DUP_ALIAS[raw] || normAlias[norm(raw)];
      if(ali && MENU_DB[ali]) return ali;
      if(MENU_DB[raw]) return raw;
      return (typeof oldResolve==='function') ? oldResolve(raw) : null;
    };
    window.flowMenuDBName = function(name){ return window.resolveMenu(name) || name; };

    window.WM_DUPLICATE_MENU_CLEANUP_V6={
      applied:true,
      before:beforeCount,
      after:Object.keys(MENU_DB).length,
      removed:beforeCount-Object.keys(MENU_DB).length,
      aliases:Object.keys(DUP_ALIAS).length,
      deleted:[...EXACT_DELETE]
    };
    console.info('[Homekeeper] duplicate menu cleanup v6', window.WM_DUPLICATE_MENU_CLEANUP_V6);
  }catch(e){ console.warn('duplicate menu cleanup v6 failed', e); }
})();
/* ===== /wm-duplicate-menu-cleanup-v6 ===== */


/* ===== menu-name-i18n-rename-patch-v1 ===== */
(function(){
  try{
    const NAME_MAP = {"가이팟메드마무앙":"까이 팟 맷 마무앙","간고등어구이":"고등어구이","감바스알아히요":"감바스 알 아히요","고아피시커리":"고안 피시 커리","과카몰레":"과카몰리","굴라이 이칸":"굴라이이칸","기로스 피타":"기로스피타","꾸어이티어우":"꾸아이티아오","나시머냑":"나시 미냑","나시짬빌":"나시 참푸르","넴느엉꾸온":"넴느엉 꾸온","넴루이":"넴 루이","논야커리":"뇨냐 커리","니라가":"닐라가","니수아즈 샐러드":"니스와즈 샐러드","니스스타일피자":"니스 스타일 피자","달마카니":"달 마카니","달마크니":"달 마카니","달채소카레":"달 채소 카레","달커리":"달 커리","달타르카":"달 타르카","또르티야에스파뇰라":"토르티야 에스파뇰라","라르브무":"라브 무","라브가이":"라브 가이","라프무":"라브 무","레막캄빙":"르막 캄빙","레바논타울룩":"치킨 타욱","로간조쉬":"로간 조쉬","로모살타도":"로모 살타도","로티자나이":"로티 차나이","로티차나이":"로티 차나이","록락":"보 룩락","리가토니알라보드카":"리가토니 알라 보드카","립아이스테이크":"립아이 스테이크","마삭메라":"마삭 메라","마카니달":"달 마카니","말라이코프타":"말라이 코프타","망고스티키라이스":"망고 스티키 라이스","머제타이스":"무자다라","메르지메크수프":"메르지메크 초르바","멕시코식타말":"타말레","멕시코콩스튜":"멕시코 콩 스튜","명란오니기리":"명란 오니기리","무케카":"모케카","미고랭말레이":"미고랭 말레이","미고렝마막":"미고렝 마막","미네스트로네":"미네스트로네 수프","미폭국수":"미폭","바바가누쉬":"바바 가누쉬","바쿠소":"박소","반보팻짠":"반 보 팟 찬","반팃느엉":"반 팃 느엉","버섯벨루테":"버섯 벨루테","버터세이지뇨키":"버터 세이지 뇨키","병아리콩샐러드":"병아리콩 샐러드","보룩락":"보 룩락","비가탄면":"비가 탄면","비나고나안":"비나고옹안","비프 렌당":"비프렌당","__DELETE__뿌팟퐁커리":"뿌팟퐁 커리","사유르로데":"사유르 로데","사유르아삼":"사유르 아셈","사케미소즈케":"사케 미소즈케","사테아얌":"사테 아얌","사히파니르":"샤히 파니르","살치살스테이크":"살치살 스테이크","삼발우당":"삼발 우당","삼발켄팅":"삼발 켄팅","삼발텀페":"삼발 템페","샨누들":"샨 누들","소토아얌":"소토 아얌","소파데리마":"소파 데 리마","소파데피데오":"소파 데 피데오","소파카스텔야나":"소파 카스텔라나","솔뮈니에르":"솔 뫼니에르","솔얀카":"솔랸카","쉬쉬타북":"쉬쉬 타욱","스페인식오믈렛":"스페인식 오믈렛","슬로피 조":"슬로피조","시오미":"시오라멘","시피오네스앙코아":"치피로네스 엔 수 틴타","쏨땀":"쏨땀","씨씩":"시식","아게다시두부":"아게다시 두부","아고우렐라이오":"앙구렐라이오","아다나케밥":"아다나 케밥","아도봉캉콩":"아도봉 캉콩","아라비아타파스타":"아라비아타 파스타","아루나달":"아루나 달","아르니굽기":"아르니 구브치","아만딘송어":"송어 아망딘","아보카도연어토스트":"아보카도 연어 토스트","아보카도크림파스타":"아보카도 크림 파스타","아브고레모노":"아브골레모노","아삼락사":"아쌈 락사","아삼이칸":"이칸 아삼","아삼프라이드치킨":"아쌈 프라이드 치킨","아얌고랭베렘팍":"아얌 고렝 베렘파","아얌고렝":"아얌 고렝","아얌리카리카":"아얌 리카리카","아얌마삭르막":"아얌 마삭 르막","아얌마삭메라":"아얌 마삭 메라","아얌바카르":"아얌 바카르","아얌페냑":"아얌 페녓","아지후라이":"아지 후라이","아호블랑코":"아호 블랑코","아히데갈리나":"아히 데 가이나","알루고비":"알루 고비","알루파라타":"알루 파라타","알봉디가스":"알본디가스","암리차리컬차":"암리차리 쿨차","암팔라야볶음":"암팔라야 볶음","야채볶음밥":"채소볶음밥","야채죽":"채소죽","야채춘권":"채소춘권","야키오니기리":"야키 오니기리","야키토리덮밥":"야키토리 덮밥","얌마무앙":"얌 마무앙","양저우볶음밥":"양저우 볶음밥","에비후라이":"에비 후라이","오덴":"오뎅","오징어먹물 파스타":"오징어먹물파스타","이맘바이으르디":"이맘 바일드","일본식 카레라이스":"일본식카레라이스","자작크":"자지키","쯔케멘":"츠케멘","찐호키엔미":"호키엔미","차까":"짜까","차이토우콰이":"차이 타우 궤","총유병":"총유빙","카마로네스알라디아블라":"카마로네스 아 라 디아블라","카부르가":"카불리 팔라우","카오니아우마무앙":"카오니아오 마무앙","카오닌무삥":"카오니아오 무삥","카오팟크라파오":"카오팟 끄라파오","카이지아우무쌉":"카이 지아우 무쌉","카인까우아":"깐 까 우아","카케소바":"가케소바","카프타그릴":"카프타 그릴","칸톰카이":"똠 카 카이","케랍아얌":"케랍 아얌","케이마마터":"키마 마타르","코지두 아 포르투게사":"코지두 아 포르투게자","쿠스쿠스로얄":"쿠스쿠스 로얄","크리스피파타":"크리스피 파타","클래식 세비체":"세비체","키쉬로렌":"키슈 로렌","타부크수유":"타북 수유","타쉬쾨프테":"타쉬 쾨프테","터키식필라프":"터키식 필라프","텐푸라우동":"텐푸라 우동","토르탕탈롱":"토르탕 탈롱","토실로그":"토시로그","파낭커리":"파낭 커리","파니르티카":"파니르 티카","파타타스브라바스":"파타타스 브라바스","파파아루가다":"파파스 아루가다스","판싯바하이":"판싯 비혼","팔라크아루":"팔락 알루","팔락파니르":"팔락 파니르","팟끄라파오무쌉":"팟 끄라파오 무쌉","팟팍붕파이댕":"팟 팍붕 파이댕","팟팟카나":"팟 카나","팬니르도피아자":"파니르 도 피아자","포솔레":"포졸레","푸팟퐁커리":"뿌팟퐁 커리","풀포갈레가":"풀포 아 라 가예가","프라이드피타":"프라이드 피타","프렌치어니언수프":"프렌치 어니언 수프","프로방살토마토":"토마토 프로방살","프론미":"프론 미","피나클렛":"피나크벳","피미엔토파드론":"피미엔토 데 파드론","피시볼국":"피시볼 국","피시앤칩스":"피시 앤 칩스","하몬크로케타":"하몬 크로케타","하이난 치킨라이스":"하이난치킨라이스","호켄미":"호키엔미","홍소육":"홍샤오러우","회과육":"후이궈러우","BLT샌드위치":"BLT 샌드위치"};
    const EN_OLD = {"가도가도":"Gado-Gado","가라아게":"Karaage","가스파초":"Gazpacho","가이센동":"Kaisendon","가이팟메드마무앙":"Gai Pad Med Mamuang (Cashew Chicken)","가지나물":"Sautéed Eggplant","가지볶음":"Stir-fried Eggplant","가츠동":"Katsudon","가츠산도":"Katsu Sando","가케우동":"Kake Udon","간고등어구이":"Grilled Salted Mackerel","간장게장":"Soy Sauce Marinated Crab","간장닭날개튀김":"Soy Sauce Fried Chicken Wings","간장비빔소면":"Soy Sauce Bibim Somyeon","간장새우장":"Soy Sauce Marinated Shrimp","간장제육볶음":"Soy Sauce Spicy Pork Stir-fry","간장치킨":"Soy Sauce Chicken","갈비찜":"Braised Short Ribs","갈비탕":"Short Rib Soup","갈치구이":"Grilled Hairtail Fish","갈치조림":"Braised Hairtail Fish","감바스":"Gambas","감바스알아히요":"Gambas al Ajillo","감자국":"Potato Soup","감자그라탕":"Potato Gratin","감자볶음":"Stir-fried Potatoes","감자샐러드":"Potato Salad","감자수제비":"Potato Sujebi (Hand-torn Noodle Soup)","감자전":"Potato Pancake","감자조림":"Braised Potatoes","감자탕":"Pork Bone and Potato Soup","감자튀김":"French Fries","건새우미역무침":"Dried Shrimp and Seaweed Salad","게살볶음밥":"Crab Meat Fried Rice","계란국":"Egg Soup","계란덮밥":"Egg Rice Bowl","계란말이":"Rolled Egg Omelette","계란밥":"Egg Rice","계란볶음밥":"Egg Fried Rice","계란아보카도토스트":"Egg Avocado Toast","계란찜":"Steamed Egg","고등어구이":"Grilled Mackerel","고등어미소조림":"Miso-braised Mackerel","고등어조림":"Braised Mackerel","고등어케밥":"Mackerel Kebab","고로케":"Korokke (Croquette)","고르곤졸라피자":"Gorgonzola Pizza","고사리나물":"Seasoned Bracken Fern","고아피시커리":"Goan Fish Curry","고이가":"Goi Ga (Vietnamese Chicken Salad)","고이꾸온":"Goi Cuon (Fresh Spring Rolls)","고추잡채":"Pepper Japchae","고추장불고기":"Gochujang Bulgogi","고추장삼겹살":"Gochujang Pork Belly","고추장찌개":"Gochujang Stew","골뱅이무침":"Spicy Whelk Salad","곱창볶음":"Stir-fried Beef Intestines","과카몰레":"Guacamole","광동볶음면":"Cantonese Stir-fried Noodles","광동식볶음밥":"Cantonese Fried Rice","광동식탕수육":"Cantonese Sweet and Sour Pork","교자":"Gyoza","군만두":"Pan-fried Dumplings","굴라이 이칸":"Gulai Ikan (Fish Curry)","궁중떡볶이":"Royal Tteokbokki","귀벡":"Güveç (Turkish Casserole)","규나베":"Gyunabe (Beef Hot Pot)","규동":"Gyudon (Beef Rice Bowl)","규카츠":"Gyukatsu (Beef Cutlet)","그라탕":"Gratin","그릭샐러드":"Greek Salad","그릭요거트볼":"Greek Yogurt Bowl","그린커리":"Green Curry","그릴드연어":"Grilled Salmon","기나탕마노크":"Nilagang Manok (Filipino Chicken Soup)","기로스":"Gyros","기로스 피타":"Gyros Pita","김밥":"Gimbap","김치말이국수":"Kimchi Wrapped Noodles","김치볶음밥":"Kimchi Fried Rice","김치수제비":"Kimchi Hand-torn Noodle Soup","김치전":"Kimchi Pancake","김치찌개":"Kimchi Stew","김치찜":"Braised Kimchi","김치찜닭":"Kimchi Braised Chicken","김치콩나물국":"Kimchi Bean Sprout Soup","까르보나라":"Carbonara","깍두기볶음밥":"Kkakdugi Fried Rice","깐쇼새우":"Gan Shao Shrimp","깐풍기":"Gan Pung Chicken","깐풍새우":"Gan Pung Shrimp","깻잎무침":"Seasoned Perilla Leaves","깻잎장아찌":"Pickled Perilla Leaves","껌가":"Cơm gà","껌땀":"Cơm tấm","껌스엉":"Cơm sườn","껌찌엔":"Cơm Chiên","꼬리곰탕":"Oxtail Soup","꽁치김치찌개":"Saury and Kimchi Stew","꽁치조림":"Braised Saury","꽃게탕":"Blue Crab Soup","꽃빵고추잡채":"Flower Bun with Pepper Japchae","꾸어이티어우":"Kuay Teow (Thai Noodle Soup)","꿔바로우":"Guo Bao Rou (Sweet and Sour Pork)","나베":"Nabe (Japanese Hot Pot)","나베야키우동":"Nabeyaki Udon","나시고랭":"Nasi Goreng","나시르막":"Nasi Lemak","나시머냑":"Nasi Minyak (Fragrant Butter Rice)","나시빠당":"Nasi Padang","나시우둑":"Nasi Uduk","나시짬빌":"Nasi Jambal","나초":"Nachos","나폴리탄":"Napolitan (Ketchup Spaghetti)","낙지덮밥":"Spicy Octopus Rice Bowl","낙지볶음":"Stir-fried Spicy Octopus","낙지연포탕":"Octopus Hot Pot","난자완스":"Nanjing Meatballs","냉이된장국":"Shepherd's Purse Doenjang Soup","냉이무침":"Seasoned Shepherd's Purse","너비아니":"Neobiani (Marinated Beef)","넴느엉꾸온":"Nem Nuong Cuon","넴루이":"Nem Lui (Vietnamese Lemongrass Pork Skewers)","녹두전":"Mung Bean Pancake","논야커리":"Nonya Curry","뇨키":"Gnocchi","뇨키토마토":"Gnocchi with Tomato Sauce","느타리버섯볶음":"Stir-fried Oyster Mushrooms","니라가":"Nilaga (Filipino Boiled Beef)","니수아즈 샐러드":"Niçoise Salad","니스스타일피자":"Nice-style Pizza (Pissaladière)","니쿠우동":"Niku Udon (Beef Udon)","니쿠자가":"Nikujaga (Meat and Potato Stew)","다코라이스":"Taco Rice","단호박수프":"Butternut Squash Soup","달마카니":"Dal Makhani","달마크니":"Dal Makhni","달채소카레":"Lentil Vegetable Curry","달커리":"Dal Curry","달타르카":"Dal Tadka","닭가슴살랩":"Chicken Breast Wrap","닭가슴살샐러드":"Chicken Breast Salad","닭가슴살요거트볼":"Chicken Breast Yogurt Bowl","닭가슴살채소볶음":"Chicken Breast and Vegetable Stir-fry","닭가슴살채소볶음밥":"Chicken Breast Vegetable Fried Rice","닭가슴살카레":"Chicken Breast Curry","닭가슴살현미볼":"Chicken Breast Brown Rice Bowl","닭갈비":"Dakgalbi (Spicy Stir-fried Chicken)","닭강정":"Sweet Crispy Fried Chicken","닭개장":"Spicy Chicken Soup","닭고기구이":"Grilled Chicken","닭고기캐슈넛볶음":"Chicken and Cashew Nut Stir-fry","닭곰탕":"Chicken Broth Soup","닭볶음":"Stir-fried Chicken","닭볶음탕":"Braised Spicy Chicken","닭비빔막국수":"Chicken Bibim Makguksu","닭육수면":"Chicken Broth Noodles","닭죽":"Chicken Porridge","닭한마리":"Whole Chicken Hot Pot","대패삼겹살구이":"Thinly Sliced Grilled Pork Belly","더덕구이":"Grilled Deodeok Root","데리야키치킨":"Teriyaki Chicken","도라지무침":"Seasoned Bellflower Root","도사":"Dosa","도토리묵무침":"Seasoned Acorn Jelly","돈지루":"Tonjiru (Pork Miso Soup)","돈카츠":"Tonkatsu (Pork Cutlet)","돈코츠라멘":"Tonkotsu Ramen","돌마데스":"Dolmades","돌솥비빔밥":"Stone Pot Bibimbap","동그랑땡":"Pan-fried Meat and Tofu Patties","동태전":"Pollock Pancake","동태찌개":"Pollock Stew","동파육":"Dongpo Pork (Braised Pork Belly)","돼지갈비찜":"Braised Pork Ribs","돼지고기김치찌개":"Pork and Kimchi Stew","돼지고기깻잎볶음":"Stir-fried Pork with Perilla Leaves","돼지국밥":"Pork Rice Soup","돼지불고기":"Pork Bulgogi","된장비빔밥":"Doenjang Bibimbap","된장삼겹살":"Doenjang Pork Belly","된장찌개":"Doenjang Stew (Fermented Soybean Paste Stew)","두루치기":"Duruchigi (Stir-fried Pork)","두부김치":"Tofu with Kimchi","두부미역국":"Tofu and Seaweed Soup","두부버섯솥밥":"Tofu and Mushroom Pot Rice","두부부침":"Pan-fried Tofu","두부샐러드":"Tofu Salad","두부스크램블에그":"Tofu Scrambled Eggs","두부스테이크":"Tofu Steak","두부스테이크테리야키":"Tofu Steak Teriyaki","두부조림":"Braised Tofu","두부채소볶음":"Tofu and Vegetable Stir-fry","두부포케":"Tofu Poke Bowl","두부현미볼":"Tofu Brown Rice Bowl","들기름막국수":"Perilla Oil Makguksu","들깨미역국":"Perilla Seed and Seaweed Soup","들깨순두부찌개":"Perilla Seed Soft Tofu Stew","들깨칼국수":"Perilla Seed Knife-cut Noodle Soup","등갈비김치찜":"Braised Back Ribs with Kimchi","등갈비찜":"Braised Pork Back Ribs","딤섬":"Dim Sum","떡갈비":"Tteokgalbi (Grilled Meat Patties)","떡국":"Tteokguk (Rice Cake Soup)","떡만두국":"Rice Cake and Dumpling Soup","떡볶이":"Tteokbokki (Spicy Rice Cakes)","또르티야에스파뇰라":"Tortilla Española (Spanish Omelette)","똠얌꿍":"Tom Yum Kung","똠카가이":"Tom Kha Gai","뚝배기불고기":"Ttukbaegi Bulgogi (Hot Pot Bulgogi)","라따뚜이":"Ratatouille","라르브무":"Larb Moo (Thai Spicy Pork Salad)","라볶이":"Rabokki (Ramen and Tteokbokki)","라브가이":"Larb Gai (Thai Spicy Chicken Salad)","라이타":"Raita","라자냐":"Lasagna","라조기":"Laziji (Sichuan Spicy Chicken)","라지마":"Rajma (Red Kidney Bean Curry)","라페토":"Laphet Thoke (Fermented Tea Leaf Salad)","라프무":"Larb Moo","라흐마준":"Lahmacun (Turkish Pizza)","락사":"Laksa","램 코르마":"Lamb Korma","레드커리":"Red Curry","레막캄빙":"Lemak Kambing (Goat Coconut Curry)","레바논타울룩":"Lebanese Tawook","레촌카왈리":"Lechon Kawali (Filipino Crispy Pork)","렌당":"Rendang","렌틸수프":"Lentil Soup","렌틸콩샐러드":"Lentil Salad","로간조쉬":"Rogan Josh","로모살타도":"Lomo Saltado","로미에":"Lomi (Filipino Noodle Soup)","로스트치킨":"Roast Chicken","로제파스타":"Rose Pasta (Creamy Tomato Pasta)","로티자나이":"Roti Janai","로티차나이":"Roti Canai","록락":"Lok Lak (Cambodian Beef)","롱가니사볶음밥":"Longganisa Fried Rice","롱통":"Lontong","룸피아":"Lumpia (Filipino Spring Rolls)","리가토니알라보드카":"Rigatoni alla Vodka","리볼리타":"Ribollita","리조또":"Risotto","립아이스테이크":"Ribeye Steak","마늘새우볶음":"Garlic Shrimp Stir-fry","마늘종볶음":"Stir-fried Garlic Scapes","마라두부":"Mala Tofu","마라라면":"Mala Ramen","마라샹궈":"Mala Xiangguo (Mala Dry Pot)","마라탕":"Mala Tang (Spicy Hot Pot)","마르게리타피자":"Margherita Pizza","마삭메라":"Masak Merah (Red Cooked Chicken)","마싸만 커리":"Massaman Curry","마제소바":"Mazesoba (Mixed Noodles)","마카니달":"Makhani Dal","마카로니샐러드":"Macaroni Salad","마크부스":"Machboos (Spiced Meat and Rice)","마클루베":"Maqluba (Upside-down Rice)","마파가지":"Mapo Eggplant","마파두부":"Mapo Tofu","마파두부덮밥":"Mapo Tofu Rice Bowl","막국수":"Makguksu (Buckwheat Noodles)","만사프":"Mansaf (Jordanian Lamb and Rice)","만트":"Manti (Central Asian Dumplings)","말라이코프타":"Malai Kofta","망고스티키라이스":"Mango Sticky Rice","매시드포테이토":"Mashed Potatoes","매운탕":"Spicy Fish Stew","머제타이스":"Mezedes (Greek Appetizers)","메네멘":"Menemen (Turkish Egg and Tomato)","메르지메크수프":"Mercimek Çorbası (Turkish Lentil Soup)","메밀소바샐러드":"Soba Noodle Salad","메추리알장조림":"Braised Quail Eggs","멕시칸라이스":"Mexican Rice","멕시코식타말":"Tamales","멕시코콩스튜":"Mexican Bean Stew","멘보샤":"Menbosha (Shrimp Toast)","멘치카츠":"Menchi Katsu (Ground Meat Cutlet)","멸치볶음":"Stir-fried Dried Anchovies","명란오니기리":"Mentaiko Onigiri","모야시라멘":"Moyashi Ramen (Bean Sprout Ramen)","모힝가":"Mohinga (Myanmar Fish Noodle Soup)","목살구이":"Grilled Pork Neck","무나물":"Seasoned Radish","무사카":"Moussaka","무생채":"Spicy Radish Salad","무이판":"Mui Fan (Cantonese Sauce Rice)","무자다라":"Mujaddara (Lentil and Rice)","무조림":"Braised Radish","무채국":"Shredded Radish Soup","무케카":"Moqueca (Brazilian Fish Stew)","묵사발":"Muk Sabal (Jelly in Broth)","묵은지등갈비찜":"Braised Back Ribs with Aged Kimchi","묵은지삼겹살":"Aged Kimchi Pork Belly","물냉면":"Mul Naengmyeon (Cold Noodles in Broth)","물만두":"Boiled Dumplings","미고랭":"Mi Goreng","미고랭말레이":"Mee Goreng Mamak","미고렝마막":"Mee Goreng Mamak","미꽝":"Mi Quang (Vietnamese Turmeric Noodles)","미네스트로네":"Minestrone","미소국":"Miso Soup","미소라멘":"Miso Ramen","미소버터라멘":"Miso Butter Ramen","미소시루":"Miso Shiru","미시암":"Mee Siam","미싸오":"Mee Sao (Crispy Noodles)","미역국":"Seaweed Soup","미역냉국":"Cold Seaweed Soup","미역줄기볶음":"Stir-fried Seaweed Stems","미트볼":"Meatballs","미트볼스파게티":"Meatball Spaghetti","미트볼파스타":"Meatball Pasta","미폭국수":"Mi Pok Noodles (Singapore Dry Noodles)","바바가누쉬":"Baba Ganoush","바스틸라":"Bastilla (Moroccan Pigeon Pie)","바오즈":"Baozi (Steamed Buns)","바지락칼국수":"Clam Knife-cut Noodle Soup","바지락탕":"Clam Soup","바질페스토파스타":"Basil Pesto Pasta","바쿠소":"Bak Kut So (Vegetarian Bak Kut Teh)","바쿠테":"Bak Kut Teh (Pork Rib Soup)","박소":"Bak So","반꾸온":"Banh Cuon (Vietnamese Steamed Rice Rolls)","반미":"Banh Mi","반보팻짠":"Banh Bo Phong Chien (Vietnamese Honeycomb Cake)","반쎄오":"Banh Xeo (Vietnamese Sizzling Crepe)","반팃느엉":"Banh Thit Nuong (Vietnamese Grilled Pork Sandwich)","배추된장국":"Napa Cabbage Doenjang Soup","배추전":"Napa Cabbage Pancake","버섯굴소스볶음":"Mushroom and Oyster Sauce Stir-fry","버섯리조또":"Mushroom Risotto","버섯벨루테":"Mushroom Velouté","버섯볶음":"Stir-fried Mushrooms","버섯솥밥":"Mushroom Pot Rice","버섯전":"Mushroom Pancake","버섯크림리조또":"Mushroom Cream Risotto","버터세이지뇨키":"Butter Sage Gnocchi","버터치킨":"Butter Chicken","버터치킨커리":"Butter Chicken Curry","베이징덕":"Peking Duck","베이컨에그스크램블":"Bacon and Egg Scramble","병아리콩샐러드":"Chickpea Salad","보렉":"Börek (Turkish Pastry)","보룩락":"Bò Lúc Lắc (Vietnamese Shaking Beef)","보비아":"Bo Bia (Vietnamese Rice Paper Rolls)","보쌈":"Bossam (Steamed Pork Wraps)","보코":"Boko","볶음짬뽕":"Stir-fried Jjamppong","볼로네제파스타":"Bolognese Pasta","봉골레파스타":"Vongole Pasta (Clam Pasta)","뵈프엔다우브":"Boeuf en Daube (French Beef Stew)","부대찌개":"Budae Jjigae (Army Stew)","부리또":"Burrito","부야베스":"Bouillabaisse","부채살스테이크":"Flat Iron Steak","부추계란볶음":"Chive and Egg Stir-fry","부추김치":"Chive Kimchi","부추전":"Chive Pancake","부타네기야키":"Buta Negi Yaki (Pork and Green Onion Grill)","부타네기폰즈":"Buta Negi Ponzu","부타동":"Butadon (Pork Rice Bowl)","부타카쿠니":"Buta Kakuni (Braised Pork Belly)","부타킴치":"Buta Kimchi (Pork and Kimchi Stir-fry)","북어국":"Dried Pollack Soup","북어무침":"Seasoned Dried Pollack","북어해장국":"Dried Pollack Hangover Soup","분보후에":"Bun Bo Hue (Spicy Beef Noodle Soup)","분짜":"Bun Cha (Vietnamese Grilled Pork Noodles)","분팃느엉":"Bun Thit Nuong (Grilled Pork Noodle Bowl)","불고기덮밥":"Bulgogi Rice Bowl","불고기전골":"Bulgogi Hot Pot","불라로":"Bulalo (Filipino Bone Marrow Soup)","브로콜리두부무침":"Broccoli and Tofu Salad","브로콜리치즈수프":"Broccoli Cheese Soup","브루스케타":"Bruschetta","브리암":"Briam (Greek Roasted Vegetables)","블랙페퍼크랩":"Black Pepper Crab","비가탄면":"Binatog (Filipino Corn Snack)","비나고나안":"Binagooonaan (Filipino Pork in Shrimp Paste)","비리야니":"Biryani","비빔국수":"Bibim Guksu (Spicy Mixed Noodles)","비빔냉면":"Bibim Naengmyeon (Spicy Cold Noodles)","비빔밥":"Bibimbap","비지찌개":"Biji Jjigae (Soybean Pulp Stew)","비콜익스프레스":"Bicol Express","비트샐러드":"Beet Salad","비프 렌당":"Beef Rendang","비프부르기뇽":"Boeuf Bourguignon","비프스튜":"Beef Stew","비프웰링턴":"Beef Wellington","비프타코":"Beef Taco","빈달루":"Vindaloo","빈대떡":"Bindaetteok (Mung Bean Pancake)","빠에야":"Paella","__DELETE__뿌팟퐁커리":"Poo Pad Pong Curry","사르수엘라":"Zarzuela (Spanish Seafood Stew)","사모사":"Samosa","사바미소니":"Saba Misoni (Mackerel Simmered in Miso)","사유르로데":"Sayur Lodeh (Vegetable Coconut Milk Soup)","사유르아삼":"Sayur Asam (Tamarind Vegetable Soup)","사케동":"Sake Don (Salmon Rice Bowl)","사케미소즈케":"Sake Miso Zuke (Miso-marinated Salmon)","사테아얌":"Satay Ayam (Chicken Satay)","사히파니르":"Saag Paneer","산채비빔밥":"Wild Greens Bibimbap","살모레호":"Salmorejo","살사소스":"Salsa Sauce","살치살스테이크":"Skirt Steak","살팀보카":"Saltimbocca","삼겹살구이":"Grilled Pork Belly (Samgyeopsal)","삼겹살김치찜":"Braised Pork Belly with Kimchi","삼계탕":"Samgyetang (Ginseng Chicken Soup)","삼발새우":"Sambal Shrimp","삼발우당":"Sambal Udang","삼발켄팅":"Sambal Kentang (Potato Sambal)","삼발텀페":"Sambal Tempeh","삼선볶음밥":"Three Delicacies Fried Rice","삼치구이":"Grilled Spanish Mackerel","삼치조림":"Braised Spanish Mackerel","새우마살라":"Prawn Masala","새우볶음밥":"Shrimp Fried Rice","새우완탕":"Shrimp Wonton","새우완탕면":"Shrimp Wonton Noodles","샌드위치":"Sandwich","생선국수":"Fish Noodle Soup","샤브샤브":"Shabu-Shabu","샤오롱바오":"Xiaolongbao (Soup Dumplings)","샤와르마":"Shawarma","샥슈카":"Shakshuka","샨누들":"Shan Noodles (Myanmar)","설렁탕":"Seolleongtang (Ox Bone Soup)","세비체":"Ceviche","소갈비구이":"Grilled Beef Short Ribs","소고기덮밥":"Beef Rice Bowl","소고기뭇국":"Beef and Radish Soup","소고기미역국":"Beef Seaweed Soup","소고기볶음":"Stir-fried Beef","소고기브로콜리볶음":"Beef and Broccoli Stir-fry","소고기장조림":"Soy-braised Beef","소고기죽":"Beef Porridge","소불고기":"Beef Bulgogi","소토아얌":"Soto Ayam (Indonesian Chicken Soup)","소파데리마":"Sopa de Lima (Mexican Lime Soup)","소파데피데오":"Sopa de Fideo (Mexican Noodle Soup)","소파카스텔야나":"Sopa Castellana (Spanish Garlic Soup)","솔뮈니에르":"Sole Meunière","솔얀카":"Solyanka (Russian Sour Soup)","쏨땀":"Som Tam (Green Papaya Salad)","쇼유라멘":"Shoyu Ramen","수블라키":"Souvlaki","수육":"Suyuk (Boiled Pork Slices)","수제비":"Sujebi (Hand-torn Noodle Soup)","수프카레":"Soup Curry","숙주나물":"Seasoned Bean Sprouts","순대국밥":"Sundae Gukbap (Blood Sausage Rice Soup)","순대볶음":"Stir-fried Sundae","순댓국":"Sundaeguk (Blood Sausage Soup)","순두부찌개":"Sundubu Jjigae (Soft Tofu Stew)","쉬쉬타북":"Shish Taouk (Lebanese Chicken Skewers)","슈마이":"Shumai","스코르달리아":"Skordalia (Greek Garlic Sauce)","스크램블에그":"Scrambled Eggs","스키야키":"Sukiyaki","스테이크":"Steak","스티파도":"Stifado (Greek Beef Stew)","스팀보트":"Steamboat (Hot Pot)","스파나코리조":"Spanakorizo (Greek Spinach Rice)","스파나코피타":"Spanakopita (Greek Spinach Pie)","스팸마요덮밥":"Spam Mayo Rice Bowl","스페인식오믈렛":"Spanish Omelette","슬로피 조":"Sloppy Joe","시금치나물":"Seasoned Spinach","시금치된장국":"Spinach Doenjang Soup","시니강":"Sinigang (Filipino Sour Soup)","시래기국":"Dried Radish Greens Soup","시오라멘":"Shio Ramen (Salt Ramen)","시오미":"Shiomi (Salt-flavored)","시저랩":"Caesar Wrap","시저샐러드":"Caesar Salad","시칠리아파스타":"Sicilian Pasta","시피오네스앙코아":"Chipirones en su Tinta (Squid in Ink)","싱가포르락사":"Singapore Laksa","싱가포르사테":"Singapore Satay","싱가포르죽":"Singapore Porridge","쌀국수":"Pho (Vietnamese Rice Noodle Soup)","쌀국수볶음":"Stir-fried Rice Noodles","쌈밥":"Ssambap (Wrap Rice)","쏨땀":"Som Tam (Green Papaya Salad)","쑥된장국":"Mugwort Doenjang Soup","씨씩":"Sic Sic (Uighur Lamb Dish)","아게다시두부":"Agedashi Tofu","아고우렐라이오":"Agourélado (Greek Olive Oil Dish)","아귀찜":"Braised Monkfish","아다나케밥":"Adana Kebab","아도봉캉콩":"Adobong Kangkong (Filipino Water Spinach)","아라비아타파스타":"Arrabbiata Pasta","아루나달":"Aruna Dal","아르니굽기":"Arni Psito (Greek Roast Lamb)","아마트리치아나":"Amatriciana","아만딘송어":"Trout Almondine","아목트레이":"Amok Trei (Cambodian Fish Curry)","아보카도샐러드":"Avocado Salad","아보카도연어토스트":"Avocado Salmon Toast","아보카도크림파스타":"Avocado Cream Pasta","아보카도토스트":"Avocado Toast","아브고레모노":"Avgolemono (Greek Egg-Lemon Soup)","아삼락사":"Asam Laksa","아삼이칸":"Asam Ikan (Tamarind Fish)","아삼프라이드치킨":"Asam Fried Chicken","아얌고랭베렘팍":"Ayam Goreng Berempah (Spiced Fried Chicken)","아얌고렝":"Ayam Goreng (Malaysian Fried Chicken)","아얌리카리카":"Ayam Rica-Rica (Spicy Chicken)","아얌마삭르막":"Ayam Masak Lemak (Chicken in Coconut Milk)","아얌마삭메라":"Ayam Masak Merah (Red Cooked Chicken)","아얌바카르":"Ayam Bakar (Grilled Chicken)","아얌세리":"Ayam Seri","아얌페냑":"Ayam Penyet (Smashed Fried Chicken)","아욱국":"Mallow Soup","아이리시스튜":"Irish Stew","아지후라이":"Aji Furai (Fried Horse Mackerel)","아쿠아파차":"Acqua Pazza (Italian Poached Fish)","아프리타다":"Afritada (Filipino Chicken Stew)","아호블랑코":"Ajo Blanco (Spanish White Gazpacho)","아히데갈리나":"Aji de Gallina (Peruvian Creamy Chicken)","안심스테이크":"Tenderloin Steak","알루고비":"Aloo Gobi (Potato and Cauliflower)","알루파라타":"Aloo Paratha","알리오올리오":"Aglio e Olio","알봉디가스":"Albondigas (Spanish Meatballs)","알탕":"Spicy Pollock Roe Soup","암리차리컬차":"Amritsari Kulcha","암팔라야볶음":"Ampalaya Stir-fry (Bitter Melon)","애호박볶음":"Stir-fried Zucchini","야채볶음밥":"Vegetable Fried Rice","야채죽":"Vegetable Porridge","야채춘권":"Vegetable Spring Rolls","야키소바":"Yakisoba","야키오니기리":"Yaki Onigiri (Grilled Rice Ball)","야키우동":"Yaki Udon (Stir-fried Udon)","야키토리":"Yakitori","야키토리덮밥":"Yakitori Rice Bowl","약밥":"Yakbap (Sweet Rice)","얌느아":"Yam Nua (Thai Beef Salad)","얌마무앙":"Yam Mamuang (Mango Salad)","얌운센":"Yam Woon Sen (Glass Noodle Salad)","얌탈레":"Yam Talay (Thai Seafood Salad)","양념치킨":"Yangnyeom Chicken (Korean Spicy Fried Chicken)","양배추쌈":"Cabbage Wrap","양배추참치덮밥":"Cabbage and Tuna Rice Bowl","양송이수프":"Cream of Mushroom Soup","양장피":"Yangjangpi (Jellyfish and Vegetable Salad)","양저우볶음밥":"Yangzhou Fried Rice","양파수프":"Onion Soup","어묵국":"Fish Cake Soup","어묵볶음":"Stir-fried Fish Cakes","어묵탕":"Fish Cake Hot Pot","어향가지":"Yuxiang Eggplant","어향육사":"Yuxiang Shredded Pork","에그베네딕트":"Eggs Benedict","에그샌드위치":"Egg Sandwich","에그토스트":"Egg Toast","에비마요":"Ebi Mayo (Shrimp Mayonnaise)","에비텐동":"Ebi Tendon (Shrimp Tempura Rice Bowl)","에비후라이":"Ebi Furai (Fried Shrimp)","에스카베체":"Escabeche (Pickled Fish)","엔칠라다":"Enchilada","엠파나다":"Empanada","연근조림":"Braised Lotus Root","연어구이":"Grilled Salmon","연어데리야키":"Salmon Teriyaki","연어샐러드":"Salmon Salad","연어스테이크":"Salmon Steak","연어아보카도볼":"Salmon Avocado Bowl","연어아보카도포케":"Salmon Avocado Poke Bowl","연어초밥":"Salmon Sushi","연어포케":"Salmon Poke Bowl","연포탕":"Yeonpo Tang (Soft Octopus Soup)","열무국수":"Young Radish Noodles","열무냉면":"Young Radish Cold Noodles","열무비빔밥":"Young Radish Bibimbap","영양솥밥":"Nutritious Pot Rice","오니기리":"Onigiri (Rice Ball)","오덴":"Oden","오리주물럭":"Spicy Duck Stir-fry","오므라이스":"Omurice (Omelette Rice)","오믈렛":"Omelette","오버나이트오트밀":"Overnight Oatmeal","오삼불고기":"Spicy Pork and Squid Stir-fry","오소부코":"Osso Buco","오야코동":"Oyakodon (Chicken and Egg Rice Bowl)","오야코우동":"Oyako Udon","오이냉국":"Cold Cucumber Soup","오이무침":"Seasoned Cucumber","오이소박이":"Cucumber Kimchi","오이지무침":"Seasoned Pickled Cucumber","오징어덮밥":"Squid Rice Bowl","오징어먹물 파스타":"Squid Ink Pasta","오징어무국":"Squid and Radish Soup","오징어볶음":"Stir-fried Spicy Squid","오징어채볶음":"Stir-fried Dried Squid Strips","오차즈케":"Ochazuke (Tea Rice)","오코노미야키":"Okonomiyaki (Japanese Savory Pancake)","오타오타":"Otak-Otak (Grilled Fish Cake)","오트밀":"Oatmeal","오포르아얌":"Opor Ayam (Chicken in Coconut Milk)","오향장육":"Five-spice Braised Pork","와플":"Waffle","완탕면":"Wonton Noodles","완탕탕":"Wonton Soup","우거지갈비찜":"Braised Ribs with Dried Cabbage","우거지해장국":"Dried Cabbage Hangover Soup","우렁된장찌개":"Freshwater Snail Doenjang Stew","우엉조림":"Braised Burdock Root","우육면":"Beef Noodle Soup","월남쌈":"Vietnamese Spring Rolls","유도후":"Yudofu (Simmered Tofu)","유린기":"Yuringi (Chinese-style Fried Chicken)","유부우동":"Kitsune Udon (Tofu Pouch Udon)","유부초밥":"Inari Sushi","유산슬":"Yusanseul (Seafood and Vegetable Stir-fry)","육개장":"Yukgaejang (Spicy Beef Soup)","육전":"Yukjeon (Pan-fried Beef)","육회비빔밥":"Yukhoe Bibimbap (Raw Beef Bibimbap)","이나리초밥":"Inari Sushi","이나살":"Inasal (Filipino Grilled Chicken)","이맘바이으르디":"İmam Bayıldı (Stuffed Eggplant)","이스켄데르케밥":"İskender Kebab","이시카리나베":"Ishikari Nabe (Salmon Hot Pot)","이즈미르쾨프테":"İzmir Köfte","이칸고랭":"Ikan Goreng (Fried Fish)","이칸마살라":"Ikan Masala (Fish Masala)","이칸바카르":"Ikan Bakar (Grilled Fish)","이칸아삼":"Ikan Asam (Tamarind Fish)","이칸페프리":"Ikan Peperi (Peppered Fish)","일본식 카레라이스":"Japanese Curry Rice","일본식계란말이":"Japanese Rolled Egg (Tamagoyaki)","자루소바":"Zaru Soba (Cold Soba Noodles)","자작크":"Zazak","잔치국수":"Janchi Guksu (Festive Noodle Soup)","잠발라야":"Jambalaya","잡곡밥":"Multigrain Rice","잡채":"Japchae (Glass Noodles with Vegetables)","잡채밥":"Japchae Rice Bowl","잡채볶음밥":"Japchae Fried Rice","장어구이":"Grilled Eel","장조림":"Soy-braised Beef","장조림버터비빔밥":"Soy-braised Beef Butter Bibimbap","장칼국수":"Doenjang Knife-cut Noodle Soup","장터국수":"Market-style Noodle Soup","쟁반국수":"Tray Noodles","전복미역국":"Abalone and Seaweed Soup","전복죽":"Abalone Porridge","제육볶음":"Jeyuk Bokkeum (Spicy Pork Stir-fry)","조개탕":"Clam Soup","조기구이":"Grilled Yellow Corvina","족발냉채":"Cold Pig's Trotters","주꾸미볶음":"Stir-fried Baby Octopus","주먹밥":"Jumeokbap (Rice Ball)","중식만두전골":"Chinese-style Dumpling Hot Pot","중식오이냉채":"Chinese-style Cold Cucumber","지삼선":"Di San Xian (Potato","진미채무침":"Seasoned Dried Squid Strips","짜장면":"Jjajangmyeon (Black Bean Noodles)","짜장밥":"Jjajang Rice","짜조":"Cha Gio (Vietnamese Fried Spring Rolls)","짬뽕":"Jjamppong (Spicy Seafood Noodle Soup)","쫄면":"Jjolmyeon (Chewy Spicy Noodles)","쭈꾸미볶음밥":"Spicy Baby Octopus Fried Rice","쭈꾸미삼겹살":"Baby Octopus and Pork Belly","쯔케멘":"Tsukemen (Dipping Ramen)","찐호키엔미":"Zha Hokkien Mee","찜닭":"Jjimdak (Braised Chicken)","차까":"Chaaka","차나마살라":"Chana Masala","차돌된장찌개":"Beef Brisket Doenjang Stew","차돌박이숙주볶음":"Beef Brisket and Bean Sprout Stir-fry","차슈":"Chashu (Braised Pork)","차오멘":"Chow Mein","차완무시":"Chawanmushi (Japanese Steamed Egg Custard)","차우파":"Chaufa (Peruvian Fried Rice)","차이토우콰이":"Chai Tow Kway (Radish Cake)","차조":"Chamjo (Millet and Porridge)","차지키":"Tzatziki","차퀘이테오":"Char Kway Teow","참나물무침":"Seasoned Chammnamul (Wild Parsley)","참치김밥":"Tuna Gimbap","참치김치볶음밥":"Tuna and Kimchi Fried Rice","참치김치찌개":"Tuna and Kimchi Stew","참치마요덮밥":"Tuna Mayo Rice Bowl","참치마요오니기리":"Tuna Mayo Onigiri","참치채소샐러드":"Tuna and Vegetable Salad","참치포케":"Tuna Poke Bowl","참치회비빔밥":"Fresh Tuna Bibimbap","찹스테이크":"Chop Steak","채끝스테이크":"Sirloin Steak","채소달걀국":"Vegetable and Egg Soup","채소커리":"Vegetable Curry","청경채굴소스볶음":"Bok Choy with Oyster Sauce","청경채두부볶음":"Bok Choy and Tofu Stir-fry","청경채볶음":"Stir-fried Bok Choy","청국장찌개":"Cheonggukjang Jjigae (Fermented Soybean Stew)","체가이볶음면":"Che Kai Stir-fried Noodles","초리소와인조림":"Chorizo Wine Braise","총유병":"Cong You Bing (Scallion Pancake)","추어탕":"Chueo Tang (Loach Soup)","충무김밥":"Chungmu Gimbap","취나물":"Seasoned Chwi Namul","취나물무침":"Seasoned Chwi Namul","츠케멘":"Tsukemen (Dipping Ramen)","__DELETE__치라시즈시":"Chirashi Sushi","치미창가":"Chimichanga","치즈닭갈비":"Cheese Dakgalbi","치즈버거":"Cheeseburger","치킨그라탕":"Chicken Gratin","치킨난반":"Chicken Nanban","치킨누들수프":"Chicken Noodle Soup","치킨두피아자":"Chicken Do Pyaza","치킨몰레":"Chicken Mole","치킨발티":"Chicken Balti","치킨버거":"Chicken Burger","치킨부리토":"Chicken Burrito","치킨빈달루":"Chicken Vindaloo","치킨샐러드":"Chicken Salad","치킨샤와르마랩":"Chicken Shawarma Wrap","치킨수프":"Chicken Soup","치킨스테이크":"Chicken Steak","치킨스튜":"Chicken Stew","치킨시저랩":"Chicken Caesar Wrap","치킨아도보":"Chicken Adobo","치킨이나살":"Chicken Inasal","치킨카츠":"Chicken Katsu","치킨카치아토라":"Chicken Cacciatore","치킨커리말레이":"Malaysian Chicken Curry","치킨케밥":"Chicken Kebab","치킨코르마":"Chicken Korma","치킨콥샐러드":"Chicken Cobb Salad","치킨타진":"Chicken Tagine","치킨타코":"Chicken Taco","치킨티카마살라":"Chicken Tikka Masala","치킨파히타":"Chicken Fajita","치킨팟파이":"Chicken Pot Pie","칠레레예노":"Chile Relleno","칠레아도보":"Chile Adobo","칠레콘카르네":"Chili con Carne","칠리새우":"Chili Shrimp","칠리콘카르네":"Chili con Carne","칠리크랩":"Chilli Crab","칡냉면":"Arrowroot Cold Noodles","카니돈부리":"Kani Donburi (Crab Rice Bowl)","카레라이스":"Curry Rice","카레우동":"Curry Udon","카레카레":"Kare-Kare (Filipino Peanut Stew)","카르네아사다":"Carne Asada","카르니야르크":"Karnıyarık (Stuffed Eggplant)","카르보나라":"Carbonara","카마로네스알라디아블라":"Camarones a la Diabla","카부르가":"Kaburga (Turkish Lamb Ribs)","카술레":"Cassoulet","카야토스트":"Kaya Toast","카오니아오":"Khao Niao (Sticky Rice)","카오니아우마무앙":"Khao Niao Mamuang (Mango Sticky Rice)","카오닌무삥":"Khao Niao Mu Ping (Grilled Pork with Sticky Rice)","카오만가이":"Khao Man Gai (Thai Chicken Rice)","카오무댕":"Khao Mu Daeng (Red Pork Rice)","카오소이":"Khao Soi","카오카무":"Khao Kha Mu (Thai Braised Pork Leg Rice)","카오팟":"Khao Pad (Thai Fried Rice)","카오팟꿍":"Khao Pad Kung (Shrimp Fried Rice)","카오팟크라파오":"Khao Pad Krapao","카이지아우무쌉":"Khai Jiao Mu Sap (Thai Minced Pork Omelette)","카인까우아":"Canh Chua (Vietnamese Sour Soup)","카케소바":"Kake Soba","카키아게":"Kakiage (Mixed Tempura)","카포나타":"Caponata","카프레제샐러드":"Caprese Salad","카프타그릴":"Kafta Grill (Lebanese Meatball Skewer)","칸톰카이":"Khanom Khai (Thai Steamed Egg)","칼국수":"Kalguksu (Knife-cut Noodle Soup)","칼데레타":"Caldereta (Filipino Beef Stew)","칼데이라다":"Caldeirada (Portuguese Fish Stew)","캅카이":"Khap Kai","캐롯케이크":"Carrot Cake","커리치킨반미":"Curry Chicken Banh Mi","케랄라새우커리":"Kerala Prawn Curry","케랍아얌":"Kerabu Ayam (Malaysian Chicken Salad)","케이마마터":"Keema Matar (Minced Meat and Peas)","케프타 타진":"Kefta Tagine","코다리조림":"Braised Semi-dried Pollock","코로케":"Korokke (Croquette)","코시도":"Cocido (Spanish Chickpea Stew)","코울슬로":"Coleslaw","코지두 아 포르투게사":"Cozido à Portuguesa","코코뱅":"Coq au Vin","코프타 케밥":"Kofta Kebab","코프테":"Köfte (Turkish Meatballs)","콘치즈":"Corn Cheese","콥샐러드":"Cobb Salad","콩국수":"Kong Guksu (Cold Soy Milk Noodles)","콩나물국":"Bean Sprout Soup","콩나물국밥":"Bean Sprout Rice Soup","콩나물냉국수":"Cold Bean Sprout Noodles","콩나물무침":"Seasoned Bean Sprouts","콩나물밥":"Bean Sprout Rice","콩나물해장국":"Bean Sprout Hangover Soup","콩비지찌개":"Soybean Pulp Stew","쾨프테":"Köfte","쿠르제트수프":"Courgette Soup (Zucchini Soup)","쿠스쿠스":"Couscous","쿠스쿠스로얄":"Couscous Royal","쿵파오치킨":"Kung Pao Chicken","퀘사디야":"Quesadilla","퀴노아채소볼":"Quinoa Vegetable Bowl","크레프":"Crêpe","크로크무슈":"Croque Monsieur","크리스피파타":"Crispy Pata (Filipino Crispy Pork Knuckle)","크림브로콜리수프":"Cream of Broccoli Soup","크림새우":"Creamy Shrimp","크림소스연어":"Salmon in Cream Sauce","크림수프":"Cream Soup","크림파스타":"Cream Pasta","크메르레드커리":"Khmer Red Curry","클래식 세비체":"Classic Ceviche","클램차우더":"Clam Chowder","클럽샌드위치":"Club Sandwich","클레프티코":"Kleftiko (Greek Slow-roasted Lamb)","키마커리":"Keema Curry","키베":"Kibbeh","키쉬로렌":"Quiche Lorraine","키츠네우동":"Kitsune Udon (Fox Udon)","킬라윈":"Kinilaw (Filipino Ceviche)","타마고산도":"Tamago Sando (Egg Sandwich)","타말레":"Tamale","타부크수유":"Tabbouleh","타불레":"Tabbouleh","타쉬쾨프테":"Taş Köfte","타코":"Taco","타코야키":"Takoyaki (Octopus Balls)","탄두리연어":"Tandoori Salmon","탄두리치킨":"Tandoori Chicken","탄탄면":"Dan Dan Noodles","탕수육":"Tangsuyuk (Sweet and Sour Pork)","터키식필라프":"Turkish Pilaf","텐동":"Tendon (Tempura Rice Bowl)","텐푸라우동":"Tempura Udon","템페고랭":"Tempe Goreng (Fried Tempeh)","토르탕탈롱":"Tortang Talong (Filipino Eggplant Omelette)","토르티야수프":"Tortilla Soup","토리파이탄":"Tori Paitan (Chicken Broth Ramen)","토마토계란볶음":"Tomato and Egg Stir-fry","토마토달걀볶음":"Tomato and Egg Stir-fry","토마토달걀수프":"Tomato and Egg Soup","토마토브루스케타":"Tomato Bruschetta","토마토수프":"Tomato Soup","토마토파스타":"Tomato Pasta","토마호크스테이크":"Tomahawk Steak","토스타다":"Tostada","토실로그":"Tosilog (Filipino Tocino","튜나샌드위치":"Tuna Sandwich","티놀라":"Tinola (Filipino Chicken Soup)","티로피타":"Tiropita (Greek Cheese Pie)","티본스테이크":"T-bone Steak","파기름파스타":"Scallion Oil Pasta","파낭커리":"Panang Curry","파니르티카":"Paneer Tikka","파르망티에":"Parmentier (French Shepherd's Pie)","파소울라다":"Fasolada (Greek Bean Soup)","파스티치오":"Pastitsio (Greek Baked Pasta)","파에야":"Paella","파인애플볶음밥":"Pineapple Fried Rice","파전":"Pajeon (Scallion Pancake)","파코라":"Pakora","파타타스브라바스":"Patatas Bravas","파투쉬":"Fattoush","파파아루가다":"Papa a la Huancaína (Peruvian Potato)","판싯":"Pancit (Filipino Noodles)","판싯바하이":"Pancit Bihay","판싯칸톤":"Pancit Canton","팔라크아루":"Palak Aloo (Spinach and Potato)","팔라펠":"Falafel","팔락파니르":"Palak Paneer","팔보채":"Palbochae (Eight Treasure Stir-fry)","팟끄라파오무쌉":"Pad Krapao Mu Sap (Thai Basil Minced Pork)","팟나":"Pad Na (Thai Sauce Noodles)","팟씨유":"Pad See Ew","팟타이":"Pad Thai","팟팍붕파이댕":"Pad Pak Bung Fai Daeng (Stir-fried Morning Glory)","팟팟카나":"Pad Pak Khana (Stir-fried Chinese Broccoli)","팟프리킹":"Pad Prik King (Dry Red Curry Stir-fry)","팥죽":"Patjuk (Red Bean Porridge)","팬니르도피아자":"Paneer Do Pyaza","팬케이크":"Pancake","팽이버섯볶음":"Stir-fried Enoki Mushrooms","팽이버섯전골":"Enoki Mushroom Hot Pot","퍼가":"Pho Ga (Vietnamese Chicken Noodle Soup)","퍼싸오":"Pho Xao (Stir-fried Pho Noodles)","페센베크":"Fesenjān (Persian Walnut and Pomegranate Stew)","페스토파스타":"Pesto Pasta","페퍼로니피자":"Pepperoni Pizza","평양냉면":"Pyongyang Naengmyeon (Cold Noodles)","포솔레":"Pozole","__DELETE__포졸레":"Pozole","포카치아":"Focaccia","포케":"Poke Bowl","포크시시그":"Pork Sisig","포크아도보":"Pork Adobo","포터하우스스테이크":"Porterhouse Steak","폴렌타":"Polenta","폴포살라다":"Polpo Salada (Octopus Salad)","푸팟퐁커리":"Poo Pad Pong Curry","풀드포크":"Pulled Pork","풀포갈레가":"Pulpo a la Gallega (Galician Octopus)","프라이드피타":"Fried Pita","프렌치어니언수프":"French Onion Soup","프렌치토스트":"French Toast","프로방살토마토":"Provençal Tomatoes","프론미":"Prawn Mee (Shrimp Noodle Soup)","프리타타":"Frittata","피나클렛":"Pinakbet (Filipino Vegetable Stew)","피단두부무침":"Century Egg and Tofu","피데":"Pide (Turkish Flatbread Pizza)","피미엔토파드론":"Pimientos de Padrón","피시볼국":"Fish Ball Soup","피시앤칩스":"Fish and Chips","피시타코":"Fish Taco","피시헤드커리":"Fish Head Curry","하리라":"Harira (Moroccan Lamb Soup)","하몬크로케타":"Jamón Croqueta (Ham Croquette)","하이난 치킨라이스":"Hainanese Chicken Rice","하이라이스":"Hayashi Rice","할루미구이":"Grilled Halloumi","함박스테이크":"Hambak Steak (Japanese-style Hamburger Steak)","함흥냉면":"Hamheung Naengmyeon (Cold Noodles)","해물누룽지탕":"Seafood Scorched Rice Soup","해물순두부찌개":"Seafood Soft Tofu Stew","해물잡채":"Seafood Japchae","해물전골":"Seafood Hot Pot","해물파전":"Seafood Scallion Pancake","해산물리조또":"Seafood Risotto","해산물파스타":"Seafood Pasta","해파리냉채":"Cold Jellyfish Salad","햄버거":"Hamburger","현미채소덮밥":"Brown Rice Vegetable Bowl","현미채소볶음밥":"Brown Rice Vegetable Fried Rice","호르타":"Horta (Greek Boiled Greens)","호박나물":"Seasoned Zucchini","호박전":"Zucchini Pancake","호박죽":"Pumpkin Porridge","호켄미":"Hokkien Mee","호키엔미":"Hokkien Mee","홍소육":"Red-braised Pork","홍합탕":"Mussel Soup","황기닭백숙":"Astragalus Chicken Soup","황태구이":"Grilled Dried Pollack","황태국":"Dried Pollack Soup","황태해장국":"Dried Pollack Hangover Soup","회과육":"Twice-cooked Pork (Huiguorou)","회냉면":"Raw Fish Cold Noodles","후무스":"Hummus","훈제연어파스타":"Smoked Salmon Pasta","훈제오리볶음":"Stir-fried Smoked Duck","훈제오리샐러드":"Smoked Duck Salad","훠궈":"Huoguo (Hot Pot)","히레카츠":"Hire Katsu (Pork Fillet Cutlet)","히야시추카":"Hiyashi Chuka (Cold Chinese Noodles)","BLT샌드위치":"BLT Sandwich"};
    const EN_NEW = {"가도가도":"Gado-Gado","가라아게":"Karaage","가스파초":"Gazpacho","가이센동":"Kaisendon","까이 팟 맷 마무앙":"Gai Pad Med Mamuang (Cashew Chicken)","가지나물":"Sautéed Eggplant","가지볶음":"Stir-fried Eggplant","가츠동":"Katsudon","가츠산도":"Katsu Sando","가케우동":"Kake Udon","고등어구이":"Grilled Mackerel","간장게장":"Soy Sauce Marinated Crab","간장닭날개튀김":"Soy Sauce Fried Chicken Wings","간장비빔소면":"Soy Sauce Bibim Somyeon","간장새우장":"Soy Sauce Marinated Shrimp","간장제육볶음":"Soy Sauce Spicy Pork Stir-fry","간장치킨":"Soy Sauce Chicken","갈비찜":"Braised Short Ribs","갈비탕":"Short Rib Soup","갈치구이":"Grilled Hairtail Fish","갈치조림":"Braised Hairtail Fish","감바스":"Gambas","감바스 알 아히요":"Gambas al Ajillo","감자국":"Potato Soup","감자그라탕":"Potato Gratin","감자볶음":"Stir-fried Potatoes","감자샐러드":"Potato Salad","감자수제비":"Potato Sujebi (Hand-torn Noodle Soup)","감자전":"Potato Pancake","감자조림":"Braised Potatoes","감자탕":"Pork Bone and Potato Soup","감자튀김":"French Fries","건새우미역무침":"Dried Shrimp and Seaweed Salad","게살볶음밥":"Crab Meat Fried Rice","계란국":"Egg Soup","계란덮밥":"Egg Rice Bowl","계란말이":"Rolled Egg Omelette","계란밥":"Egg Rice","계란볶음밥":"Egg Fried Rice","계란아보카도토스트":"Egg Avocado Toast","계란찜":"Steamed Egg","고등어미소조림":"Miso-braised Mackerel","고등어조림":"Braised Mackerel","고등어케밥":"Mackerel Kebab","고로케":"Korokke (Croquette)","고르곤졸라피자":"Gorgonzola Pizza","고사리나물":"Seasoned Bracken Fern","고안 피시 커리":"Goan Fish Curry","고이가":"Goi Ga (Vietnamese Chicken Salad)","고이꾸온":"Goi Cuon (Fresh Spring Rolls)","고추잡채":"Pepper Japchae","고추장불고기":"Gochujang Bulgogi","고추장삼겹살":"Gochujang Pork Belly","고추장찌개":"Gochujang Stew","골뱅이무침":"Spicy Whelk Salad","곱창볶음":"Stir-fried Beef Intestines","과카몰리":"Guacamole","광동볶음면":"Cantonese Stir-fried Noodles","광동식볶음밥":"Cantonese Fried Rice","광동식탕수육":"Cantonese Sweet and Sour Pork","교자":"Gyoza","군만두":"Pan-fried Dumplings","굴라이이칸":"Gulai Ikan (Fish Curry)","궁중떡볶이":"Royal Tteokbokki","귀벡":"Güveç (Turkish Casserole)","규나베":"Gyunabe (Beef Hot Pot)","규동":"Gyudon (Beef Rice Bowl)","규카츠":"Gyukatsu (Beef Cutlet)","그라탕":"Gratin","그릭샐러드":"Greek Salad","그릭요거트볼":"Greek Yogurt Bowl","그린커리":"Green Curry","그릴드연어":"Grilled Salmon","기나탕마노크":"Nilagang Manok (Filipino Chicken Soup)","기로스":"Gyros","기로스피타":"Gyros Pita","김밥":"Gimbap","김치말이국수":"Kimchi Wrapped Noodles","김치볶음밥":"Kimchi Fried Rice","김치수제비":"Kimchi Hand-torn Noodle Soup","김치전":"Kimchi Pancake","김치찌개":"Kimchi Stew","김치찜":"Braised Kimchi","김치찜닭":"Kimchi Braised Chicken","김치콩나물국":"Kimchi Bean Sprout Soup","까르보나라":"Carbonara","깍두기볶음밥":"Kkakdugi Fried Rice","깐쇼새우":"Gan Shao Shrimp","깐풍기":"Gan Pung Chicken","깐풍새우":"Gan Pung Shrimp","깻잎무침":"Seasoned Perilla Leaves","깻잎장아찌":"Pickled Perilla Leaves","껌가":"Cơm gà","껌땀":"Cơm tấm","껌스엉":"Cơm sườn","껌찌엔":"Cơm Chiên","꼬리곰탕":"Oxtail Soup","꽁치김치찌개":"Saury and Kimchi Stew","꽁치조림":"Braised Saury","꽃게탕":"Blue Crab Soup","꽃빵고추잡채":"Flower Bun with Pepper Japchae","꾸아이티아오":"Kuay Teow (Thai Noodle Soup)","꿔바로우":"Guo Bao Rou (Sweet and Sour Pork)","나베":"Nabe (Japanese Hot Pot)","나베야키우동":"Nabeyaki Udon","나시고랭":"Nasi Goreng","나시르막":"Nasi Lemak","나시 미냑":"Nasi Minyak (Fragrant Butter Rice)","나시빠당":"Nasi Padang","나시우둑":"Nasi Uduk","나시 참푸르":"Nasi Jambal","나초":"Nachos","나폴리탄":"Napolitan (Ketchup Spaghetti)","낙지덮밥":"Spicy Octopus Rice Bowl","낙지볶음":"Stir-fried Spicy Octopus","낙지연포탕":"Octopus Hot Pot","난자완스":"Nanjing Meatballs","냉이된장국":"Shepherd's Purse Doenjang Soup","냉이무침":"Seasoned Shepherd's Purse","너비아니":"Neobiani (Marinated Beef)","넴느엉 꾸온":"Nem Nuong Cuon","넴 루이":"Nem Lui (Vietnamese Lemongrass Pork Skewers)","녹두전":"Mung Bean Pancake","뇨냐 커리":"Nonya Curry","뇨키":"Gnocchi","뇨키토마토":"Gnocchi with Tomato Sauce","느타리버섯볶음":"Stir-fried Oyster Mushrooms","닐라가":"Nilaga (Filipino Boiled Beef)","니스와즈 샐러드":"Niçoise Salad","니스 스타일 피자":"Nice-style Pizza (Pissaladière)","니쿠우동":"Niku Udon (Beef Udon)","니쿠자가":"Nikujaga (Meat and Potato Stew)","다코라이스":"Taco Rice","단호박수프":"Butternut Squash Soup","달 마카니":"Makhani Dal","달 채소 카레":"Lentil Vegetable Curry","달 커리":"Dal Curry","달 타르카":"Dal Tadka","닭가슴살랩":"Chicken Breast Wrap","닭가슴살샐러드":"Chicken Breast Salad","닭가슴살요거트볼":"Chicken Breast Yogurt Bowl","닭가슴살채소볶음":"Chicken Breast and Vegetable Stir-fry","닭가슴살채소볶음밥":"Chicken Breast Vegetable Fried Rice","닭가슴살카레":"Chicken Breast Curry","닭가슴살현미볼":"Chicken Breast Brown Rice Bowl","닭갈비":"Dakgalbi (Spicy Stir-fried Chicken)","닭강정":"Sweet Crispy Fried Chicken","닭개장":"Spicy Chicken Soup","닭고기구이":"Grilled Chicken","닭고기캐슈넛볶음":"Chicken and Cashew Nut Stir-fry","닭곰탕":"Chicken Broth Soup","닭볶음":"Stir-fried Chicken","닭볶음탕":"Braised Spicy Chicken","닭비빔막국수":"Chicken Bibim Makguksu","닭육수면":"Chicken Broth Noodles","닭죽":"Chicken Porridge","닭한마리":"Whole Chicken Hot Pot","대패삼겹살구이":"Thinly Sliced Grilled Pork Belly","더덕구이":"Grilled Deodeok Root","데리야키치킨":"Teriyaki Chicken","도라지무침":"Seasoned Bellflower Root","도사":"Dosa","도토리묵무침":"Seasoned Acorn Jelly","돈지루":"Tonjiru (Pork Miso Soup)","돈카츠":"Tonkatsu (Pork Cutlet)","돈코츠라멘":"Tonkotsu Ramen","돌마데스":"Dolmades","돌솥비빔밥":"Stone Pot Bibimbap","동그랑땡":"Pan-fried Meat and Tofu Patties","동태전":"Pollock Pancake","동태찌개":"Pollock Stew","동파육":"Dongpo Pork (Braised Pork Belly)","돼지갈비찜":"Braised Pork Ribs","돼지고기김치찌개":"Pork and Kimchi Stew","돼지고기깻잎볶음":"Stir-fried Pork with Perilla Leaves","돼지국밥":"Pork Rice Soup","돼지불고기":"Pork Bulgogi","된장비빔밥":"Doenjang Bibimbap","된장삼겹살":"Doenjang Pork Belly","된장찌개":"Doenjang Stew (Fermented Soybean Paste Stew)","두루치기":"Duruchigi (Stir-fried Pork)","두부김치":"Tofu with Kimchi","두부미역국":"Tofu and Seaweed Soup","두부버섯솥밥":"Tofu and Mushroom Pot Rice","두부부침":"Pan-fried Tofu","두부샐러드":"Tofu Salad","두부스크램블에그":"Tofu Scrambled Eggs","두부스테이크":"Tofu Steak","두부스테이크테리야키":"Tofu Steak Teriyaki","두부조림":"Braised Tofu","두부채소볶음":"Tofu and Vegetable Stir-fry","두부포케":"Tofu Poke Bowl","두부현미볼":"Tofu Brown Rice Bowl","들기름막국수":"Perilla Oil Makguksu","들깨미역국":"Perilla Seed and Seaweed Soup","들깨순두부찌개":"Perilla Seed Soft Tofu Stew","들깨칼국수":"Perilla Seed Knife-cut Noodle Soup","등갈비김치찜":"Braised Back Ribs with Kimchi","등갈비찜":"Braised Pork Back Ribs","딤섬":"Dim Sum","떡갈비":"Tteokgalbi (Grilled Meat Patties)","떡국":"Tteokguk (Rice Cake Soup)","떡만두국":"Rice Cake and Dumpling Soup","떡볶이":"Tteokbokki (Spicy Rice Cakes)","토르티야 에스파뇰라":"Tortilla Española (Spanish Omelette)","똠얌꿍":"Tom Yum Kung","똠카가이":"Tom Kha Gai","뚝배기불고기":"Ttukbaegi Bulgogi (Hot Pot Bulgogi)","라따뚜이":"Ratatouille","라브 무":"Larb Moo","라볶이":"Rabokki (Ramen and Tteokbokki)","라브 가이":"Larb Gai (Thai Spicy Chicken Salad)","라이타":"Raita","라자냐":"Lasagna","라조기":"Laziji (Sichuan Spicy Chicken)","라지마":"Rajma (Red Kidney Bean Curry)","라페토":"Laphet Thoke (Fermented Tea Leaf Salad)","라흐마준":"Lahmacun (Turkish Pizza)","락사":"Laksa","램 코르마":"Lamb Korma","레드커리":"Red Curry","르막 캄빙":"Lemak Kambing (Goat Coconut Curry)","치킨 타욱":"Lebanese Tawook","레촌카왈리":"Lechon Kawali (Filipino Crispy Pork)","렌당":"Rendang","렌틸수프":"Lentil Soup","렌틸콩샐러드":"Lentil Salad","로간 조쉬":"Rogan Josh","로모 살타도":"Lomo Saltado","로미에":"Lomi (Filipino Noodle Soup)","로스트치킨":"Roast Chicken","로제파스타":"Rose Pasta (Creamy Tomato Pasta)","로티 차나이":"Roti Canai","보 룩락":"Bò Lúc Lắc (Vietnamese Shaking Beef)","롱가니사볶음밥":"Longganisa Fried Rice","롱통":"Lontong","룸피아":"Lumpia (Filipino Spring Rolls)","리가토니 알라 보드카":"Rigatoni alla Vodka","리볼리타":"Ribollita","리조또":"Risotto","립아이 스테이크":"Ribeye Steak","마늘새우볶음":"Garlic Shrimp Stir-fry","마늘종볶음":"Stir-fried Garlic Scapes","마라두부":"Mala Tofu","마라라면":"Mala Ramen","마라샹궈":"Mala Xiangguo (Mala Dry Pot)","마라탕":"Mala Tang (Spicy Hot Pot)","마르게리타피자":"Margherita Pizza","마삭 메라":"Masak Merah (Red Cooked Chicken)","마싸만 커리":"Massaman Curry","마제소바":"Mazesoba (Mixed Noodles)","마카로니샐러드":"Macaroni Salad","마크부스":"Machboos (Spiced Meat and Rice)","마클루베":"Maqluba (Upside-down Rice)","마파가지":"Mapo Eggplant","마파두부":"Mapo Tofu","마파두부덮밥":"Mapo Tofu Rice Bowl","막국수":"Makguksu (Buckwheat Noodles)","만사프":"Mansaf (Jordanian Lamb and Rice)","만트":"Manti (Central Asian Dumplings)","말라이 코프타":"Malai Kofta","망고 스티키 라이스":"Mango Sticky Rice","매시드포테이토":"Mashed Potatoes","매운탕":"Spicy Fish Stew","무자다라":"Mujaddara (Lentil and Rice)","메네멘":"Menemen (Turkish Egg and Tomato)","메르지메크 초르바":"Mercimek Çorbası (Turkish Lentil Soup)","메밀소바샐러드":"Soba Noodle Salad","메추리알장조림":"Braised Quail Eggs","멕시칸라이스":"Mexican Rice","타말레":"Tamale","멕시코 콩 스튜":"Mexican Bean Stew","멘보샤":"Menbosha (Shrimp Toast)","멘치카츠":"Menchi Katsu (Ground Meat Cutlet)","멸치볶음":"Stir-fried Dried Anchovies","명란 오니기리":"Mentaiko Onigiri","모야시라멘":"Moyashi Ramen (Bean Sprout Ramen)","모힝가":"Mohinga (Myanmar Fish Noodle Soup)","목살구이":"Grilled Pork Neck","무나물":"Seasoned Radish","무사카":"Moussaka","무생채":"Spicy Radish Salad","무이판":"Mui Fan (Cantonese Sauce Rice)","무조림":"Braised Radish","무채국":"Shredded Radish Soup","모케카":"Moqueca (Brazilian Fish Stew)","묵사발":"Muk Sabal (Jelly in Broth)","묵은지등갈비찜":"Braised Back Ribs with Aged Kimchi","묵은지삼겹살":"Aged Kimchi Pork Belly","물냉면":"Mul Naengmyeon (Cold Noodles in Broth)","물만두":"Boiled Dumplings","미고랭":"Mi Goreng","미고랭 말레이":"Mee Goreng Mamak","미고렝 마막":"Mee Goreng Mamak","미꽝":"Mi Quang (Vietnamese Turmeric Noodles)","미네스트로네 수프":"Minestrone","미소국":"Miso Soup","미소라멘":"Miso Ramen","미소버터라멘":"Miso Butter Ramen","미소시루":"Miso Shiru","미시암":"Mee Siam","미싸오":"Mee Sao (Crispy Noodles)","미역국":"Seaweed Soup","미역냉국":"Cold Seaweed Soup","미역줄기볶음":"Stir-fried Seaweed Stems","미트볼":"Meatballs","미트볼스파게티":"Meatball Spaghetti","미트볼파스타":"Meatball Pasta","미폭":"Mi Pok Noodles (Singapore Dry Noodles)","바바 가누쉬":"Baba Ganoush","바스틸라":"Bastilla (Moroccan Pigeon Pie)","바오즈":"Baozi (Steamed Buns)","바지락칼국수":"Clam Knife-cut Noodle Soup","바지락탕":"Clam Soup","바질페스토파스타":"Basil Pesto Pasta","박소":"Bak So","바쿠테":"Bak Kut Teh (Pork Rib Soup)","반꾸온":"Banh Cuon (Vietnamese Steamed Rice Rolls)","반미":"Banh Mi","반 보 팟 찬":"Banh Bo Phong Chien (Vietnamese Honeycomb Cake)","반쎄오":"Banh Xeo (Vietnamese Sizzling Crepe)","반 팃 느엉":"Banh Thit Nuong (Vietnamese Grilled Pork Sandwich)","배추된장국":"Napa Cabbage Doenjang Soup","배추전":"Napa Cabbage Pancake","버섯굴소스볶음":"Mushroom and Oyster Sauce Stir-fry","버섯리조또":"Mushroom Risotto","버섯 벨루테":"Mushroom Velouté","버섯볶음":"Stir-fried Mushrooms","버섯솥밥":"Mushroom Pot Rice","버섯전":"Mushroom Pancake","버섯크림리조또":"Mushroom Cream Risotto","버터 세이지 뇨키":"Butter Sage Gnocchi","버터치킨":"Butter Chicken","버터치킨커리":"Butter Chicken Curry","베이징덕":"Peking Duck","베이컨에그스크램블":"Bacon and Egg Scramble","병아리콩 샐러드":"Chickpea Salad","보렉":"Börek (Turkish Pastry)","보비아":"Bo Bia (Vietnamese Rice Paper Rolls)","보쌈":"Bossam (Steamed Pork Wraps)","보코":"Boko","볶음짬뽕":"Stir-fried Jjamppong","볼로네제파스타":"Bolognese Pasta","봉골레파스타":"Vongole Pasta (Clam Pasta)","뵈프엔다우브":"Boeuf en Daube (French Beef Stew)","부대찌개":"Budae Jjigae (Army Stew)","부리또":"Burrito","부야베스":"Bouillabaisse","부채살스테이크":"Flat Iron Steak","부추계란볶음":"Chive and Egg Stir-fry","부추김치":"Chive Kimchi","부추전":"Chive Pancake","부타네기야키":"Buta Negi Yaki (Pork and Green Onion Grill)","부타네기폰즈":"Buta Negi Ponzu","부타동":"Butadon (Pork Rice Bowl)","부타카쿠니":"Buta Kakuni (Braised Pork Belly)","부타킴치":"Buta Kimchi (Pork and Kimchi Stir-fry)","북어국":"Dried Pollack Soup","북어무침":"Seasoned Dried Pollack","북어해장국":"Dried Pollack Hangover Soup","분보후에":"Bun Bo Hue (Spicy Beef Noodle Soup)","분짜":"Bun Cha (Vietnamese Grilled Pork Noodles)","분팃느엉":"Bun Thit Nuong (Grilled Pork Noodle Bowl)","불고기덮밥":"Bulgogi Rice Bowl","불고기전골":"Bulgogi Hot Pot","불라로":"Bulalo (Filipino Bone Marrow Soup)","브로콜리두부무침":"Broccoli and Tofu Salad","브로콜리치즈수프":"Broccoli Cheese Soup","브루스케타":"Bruschetta","브리암":"Briam (Greek Roasted Vegetables)","블랙페퍼크랩":"Black Pepper Crab","비가 탄면":"Binatog (Filipino Corn Snack)","비나고옹안":"Binagooonaan (Filipino Pork in Shrimp Paste)","비리야니":"Biryani","비빔국수":"Bibim Guksu (Spicy Mixed Noodles)","비빔냉면":"Bibim Naengmyeon (Spicy Cold Noodles)","비빔밥":"Bibimbap","비지찌개":"Biji Jjigae (Soybean Pulp Stew)","비콜익스프레스":"Bicol Express","비트샐러드":"Beet Salad","비프렌당":"Beef Rendang","비프부르기뇽":"Boeuf Bourguignon","비프스튜":"Beef Stew","비프웰링턴":"Beef Wellington","비프타코":"Beef Taco","빈달루":"Vindaloo","빈대떡":"Bindaetteok (Mung Bean Pancake)","빠에야":"Paella","뿌팟퐁 커리":"Poo Pad Pong Curry","사르수엘라":"Zarzuela (Spanish Seafood Stew)","사모사":"Samosa","사바미소니":"Saba Misoni (Mackerel Simmered in Miso)","사유르 로데":"Sayur Lodeh (Vegetable Coconut Milk Soup)","사유르 아셈":"Sayur Asam (Tamarind Vegetable Soup)","사케동":"Sake Don (Salmon Rice Bowl)","사케 미소즈케":"Sake Miso Zuke (Miso-marinated Salmon)","사테 아얌":"Satay Ayam (Chicken Satay)","샤히 파니르":"Saag Paneer","산채비빔밥":"Wild Greens Bibimbap","살모레호":"Salmorejo","살사소스":"Salsa Sauce","살치살 스테이크":"Skirt Steak","살팀보카":"Saltimbocca","삼겹살구이":"Grilled Pork Belly (Samgyeopsal)","삼겹살김치찜":"Braised Pork Belly with Kimchi","삼계탕":"Samgyetang (Ginseng Chicken Soup)","삼발새우":"Sambal Shrimp","삼발 우당":"Sambal Udang","삼발 켄팅":"Sambal Kentang (Potato Sambal)","삼발 템페":"Sambal Tempeh","삼선볶음밥":"Three Delicacies Fried Rice","삼치구이":"Grilled Spanish Mackerel","삼치조림":"Braised Spanish Mackerel","새우마살라":"Prawn Masala","새우볶음밥":"Shrimp Fried Rice","새우완탕":"Shrimp Wonton","새우완탕면":"Shrimp Wonton Noodles","샌드위치":"Sandwich","생선국수":"Fish Noodle Soup","샤브샤브":"Shabu-Shabu","샤오롱바오":"Xiaolongbao (Soup Dumplings)","샤와르마":"Shawarma","샥슈카":"Shakshuka","샨 누들":"Shan Noodles (Myanmar)","설렁탕":"Seolleongtang (Ox Bone Soup)","세비체":"Classic Ceviche","소갈비구이":"Grilled Beef Short Ribs","소고기덮밥":"Beef Rice Bowl","소고기뭇국":"Beef and Radish Soup","소고기미역국":"Beef Seaweed Soup","소고기볶음":"Stir-fried Beef","소고기브로콜리볶음":"Beef and Broccoli Stir-fry","소고기장조림":"Soy-braised Beef","소고기죽":"Beef Porridge","소불고기":"Beef Bulgogi","소토 아얌":"Soto Ayam (Indonesian Chicken Soup)","소파 데 리마":"Sopa de Lima (Mexican Lime Soup)","소파 데 피데오":"Sopa de Fideo (Mexican Noodle Soup)","소파 카스텔라나":"Sopa Castellana (Spanish Garlic Soup)","솔 뫼니에르":"Sole Meunière","솔랸카":"Solyanka (Russian Sour Soup)","쏨땀":"Som Tam (Green Papaya Salad)","쇼유라멘":"Shoyu Ramen","수블라키":"Souvlaki","수육":"Suyuk (Boiled Pork Slices)","수제비":"Sujebi (Hand-torn Noodle Soup)","수프카레":"Soup Curry","숙주나물":"Seasoned Bean Sprouts","순대국밥":"Sundae Gukbap (Blood Sausage Rice Soup)","순대볶음":"Stir-fried Sundae","순댓국":"Sundaeguk (Blood Sausage Soup)","순두부찌개":"Sundubu Jjigae (Soft Tofu Stew)","쉬쉬 타욱":"Shish Taouk (Lebanese Chicken Skewers)","슈마이":"Shumai","스코르달리아":"Skordalia (Greek Garlic Sauce)","스크램블에그":"Scrambled Eggs","스키야키":"Sukiyaki","스테이크":"Steak","스티파도":"Stifado (Greek Beef Stew)","스팀보트":"Steamboat (Hot Pot)","스파나코리조":"Spanakorizo (Greek Spinach Rice)","스파나코피타":"Spanakopita (Greek Spinach Pie)","스팸마요덮밥":"Spam Mayo Rice Bowl","스페인식 오믈렛":"Spanish Omelette","슬로피조":"Sloppy Joe","시금치나물":"Seasoned Spinach","시금치된장국":"Spinach Doenjang Soup","시니강":"Sinigang (Filipino Sour Soup)","시래기국":"Dried Radish Greens Soup","시오라멘":"Shiomi (Salt-flavored)","시저랩":"Caesar Wrap","시저샐러드":"Caesar Salad","시칠리아파스타":"Sicilian Pasta","치피로네스 엔 수 틴타":"Chipirones en su Tinta (Squid in Ink)","싱가포르락사":"Singapore Laksa","싱가포르사테":"Singapore Satay","싱가포르죽":"Singapore Porridge","쌀국수":"Pho (Vietnamese Rice Noodle Soup)","쌀국수볶음":"Stir-fried Rice Noodles","쌈밥":"Ssambap (Wrap Rice)","쑥된장국":"Mugwort Doenjang Soup","시식":"Sic Sic (Uighur Lamb Dish)","아게다시 두부":"Agedashi Tofu","앙구렐라이오":"Agourélado (Greek Olive Oil Dish)","아귀찜":"Braised Monkfish","아다나 케밥":"Adana Kebab","아도봉 캉콩":"Adobong Kangkong (Filipino Water Spinach)","아라비아타 파스타":"Arrabbiata Pasta","아루나 달":"Aruna Dal","아르니 구브치":"Arni Psito (Greek Roast Lamb)","아마트리치아나":"Amatriciana","송어 아망딘":"Trout Almondine","아목트레이":"Amok Trei (Cambodian Fish Curry)","아보카도샐러드":"Avocado Salad","아보카도 연어 토스트":"Avocado Salmon Toast","아보카도 크림 파스타":"Avocado Cream Pasta","아보카도토스트":"Avocado Toast","아브골레모노":"Avgolemono (Greek Egg-Lemon Soup)","아쌈 락사":"Asam Laksa","이칸 아삼":"Asam Ikan (Tamarind Fish)","아쌈 프라이드 치킨":"Asam Fried Chicken","아얌 고렝 베렘파":"Ayam Goreng Berempah (Spiced Fried Chicken)","아얌 고렝":"Ayam Goreng (Malaysian Fried Chicken)","아얌 리카리카":"Ayam Rica-Rica (Spicy Chicken)","아얌 마삭 르막":"Ayam Masak Lemak (Chicken in Coconut Milk)","아얌 마삭 메라":"Ayam Masak Merah (Red Cooked Chicken)","아얌 바카르":"Ayam Bakar (Grilled Chicken)","아얌세리":"Ayam Seri","아얌 페녓":"Ayam Penyet (Smashed Fried Chicken)","아욱국":"Mallow Soup","아이리시스튜":"Irish Stew","아지 후라이":"Aji Furai (Fried Horse Mackerel)","아쿠아파차":"Acqua Pazza (Italian Poached Fish)","아프리타다":"Afritada (Filipino Chicken Stew)","아호 블랑코":"Ajo Blanco (Spanish White Gazpacho)","아히 데 가이나":"Aji de Gallina (Peruvian Creamy Chicken)","안심스테이크":"Tenderloin Steak","알루 고비":"Aloo Gobi (Potato and Cauliflower)","알루 파라타":"Aloo Paratha","알리오올리오":"Aglio e Olio","알본디가스":"Albondigas (Spanish Meatballs)","알탕":"Spicy Pollock Roe Soup","암리차리 쿨차":"Amritsari Kulcha","암팔라야 볶음":"Ampalaya Stir-fry (Bitter Melon)","애호박볶음":"Stir-fried Zucchini","채소볶음밥":"Vegetable Fried Rice","채소죽":"Vegetable Porridge","채소춘권":"Vegetable Spring Rolls","야키소바":"Yakisoba","야키 오니기리":"Yaki Onigiri (Grilled Rice Ball)","야키우동":"Yaki Udon (Stir-fried Udon)","야키토리":"Yakitori","야키토리 덮밥":"Yakitori Rice Bowl","약밥":"Yakbap (Sweet Rice)","얌느아":"Yam Nua (Thai Beef Salad)","얌 마무앙":"Yam Mamuang (Mango Salad)","얌운센":"Yam Woon Sen (Glass Noodle Salad)","얌탈레":"Yam Talay (Thai Seafood Salad)","양념치킨":"Yangnyeom Chicken (Korean Spicy Fried Chicken)","양배추쌈":"Cabbage Wrap","양배추참치덮밥":"Cabbage and Tuna Rice Bowl","양송이수프":"Cream of Mushroom Soup","양장피":"Yangjangpi (Jellyfish and Vegetable Salad)","양저우 볶음밥":"Yangzhou Fried Rice","양파수프":"Onion Soup","어묵국":"Fish Cake Soup","어묵볶음":"Stir-fried Fish Cakes","어묵탕":"Fish Cake Hot Pot","어향가지":"Yuxiang Eggplant","어향육사":"Yuxiang Shredded Pork","에그베네딕트":"Eggs Benedict","에그샌드위치":"Egg Sandwich","에그토스트":"Egg Toast","에비마요":"Ebi Mayo (Shrimp Mayonnaise)","에비텐동":"Ebi Tendon (Shrimp Tempura Rice Bowl)","에비 후라이":"Ebi Furai (Fried Shrimp)","에스카베체":"Escabeche (Pickled Fish)","엔칠라다":"Enchilada","엠파나다":"Empanada","연근조림":"Braised Lotus Root","연어구이":"Grilled Salmon","연어데리야키":"Salmon Teriyaki","연어샐러드":"Salmon Salad","연어스테이크":"Salmon Steak","연어아보카도볼":"Salmon Avocado Bowl","연어아보카도포케":"Salmon Avocado Poke Bowl","연어초밥":"Salmon Sushi","연어포케":"Salmon Poke Bowl","연포탕":"Yeonpo Tang (Soft Octopus Soup)","열무국수":"Young Radish Noodles","열무냉면":"Young Radish Cold Noodles","열무비빔밥":"Young Radish Bibimbap","영양솥밥":"Nutritious Pot Rice","오니기리":"Onigiri (Rice Ball)","오뎅":"Oden","오리주물럭":"Spicy Duck Stir-fry","오므라이스":"Omurice (Omelette Rice)","오믈렛":"Omelette","오버나이트오트밀":"Overnight Oatmeal","오삼불고기":"Spicy Pork and Squid Stir-fry","오소부코":"Osso Buco","오야코동":"Oyakodon (Chicken and Egg Rice Bowl)","오야코우동":"Oyako Udon","오이냉국":"Cold Cucumber Soup","오이무침":"Seasoned Cucumber","오이소박이":"Cucumber Kimchi","오이지무침":"Seasoned Pickled Cucumber","오징어덮밥":"Squid Rice Bowl","오징어먹물파스타":"Squid Ink Pasta","오징어무국":"Squid and Radish Soup","오징어볶음":"Stir-fried Spicy Squid","오징어채볶음":"Stir-fried Dried Squid Strips","오차즈케":"Ochazuke (Tea Rice)","오코노미야키":"Okonomiyaki (Japanese Savory Pancake)","오타오타":"Otak-Otak (Grilled Fish Cake)","오트밀":"Oatmeal","오포르아얌":"Opor Ayam (Chicken in Coconut Milk)","오향장육":"Five-spice Braised Pork","와플":"Waffle","완탕면":"Wonton Noodles","완탕탕":"Wonton Soup","우거지갈비찜":"Braised Ribs with Dried Cabbage","우거지해장국":"Dried Cabbage Hangover Soup","우렁된장찌개":"Freshwater Snail Doenjang Stew","우엉조림":"Braised Burdock Root","우육면":"Beef Noodle Soup","월남쌈":"Vietnamese Spring Rolls","유도후":"Yudofu (Simmered Tofu)","유린기":"Yuringi (Chinese-style Fried Chicken)","유부우동":"Kitsune Udon (Tofu Pouch Udon)","유부초밥":"Inari Sushi","유산슬":"Yusanseul (Seafood and Vegetable Stir-fry)","육개장":"Yukgaejang (Spicy Beef Soup)","육전":"Yukjeon (Pan-fried Beef)","육회비빔밥":"Yukhoe Bibimbap (Raw Beef Bibimbap)","이나리초밥":"Inari Sushi","이나살":"Inasal (Filipino Grilled Chicken)","이맘 바일드":"İmam Bayıldı (Stuffed Eggplant)","이스켄데르케밥":"İskender Kebab","이시카리나베":"Ishikari Nabe (Salmon Hot Pot)","이즈미르쾨프테":"İzmir Köfte","이칸고랭":"Ikan Goreng (Fried Fish)","이칸마살라":"Ikan Masala (Fish Masala)","이칸바카르":"Ikan Bakar (Grilled Fish)","이칸아삼":"Ikan Asam (Tamarind Fish)","이칸페프리":"Ikan Peperi (Peppered Fish)","일본식카레라이스":"Japanese Curry Rice","일본식계란말이":"Japanese Rolled Egg (Tamagoyaki)","자루소바":"Zaru Soba (Cold Soba Noodles)","자지키":"Zazak","잔치국수":"Janchi Guksu (Festive Noodle Soup)","잠발라야":"Jambalaya","잡곡밥":"Multigrain Rice","잡채":"Japchae (Glass Noodles with Vegetables)","잡채밥":"Japchae Rice Bowl","잡채볶음밥":"Japchae Fried Rice","장어구이":"Grilled Eel","장조림":"Soy-braised Beef","장조림버터비빔밥":"Soy-braised Beef Butter Bibimbap","장칼국수":"Doenjang Knife-cut Noodle Soup","장터국수":"Market-style Noodle Soup","쟁반국수":"Tray Noodles","전복미역국":"Abalone and Seaweed Soup","전복죽":"Abalone Porridge","제육볶음":"Jeyuk Bokkeum (Spicy Pork Stir-fry)","조개탕":"Clam Soup","조기구이":"Grilled Yellow Corvina","족발냉채":"Cold Pig's Trotters","주꾸미볶음":"Stir-fried Baby Octopus","주먹밥":"Jumeokbap (Rice Ball)","중식만두전골":"Chinese-style Dumpling Hot Pot","중식오이냉채":"Chinese-style Cold Cucumber","지삼선":"Di San Xian (Potato","진미채무침":"Seasoned Dried Squid Strips","짜장면":"Jjajangmyeon (Black Bean Noodles)","짜장밥":"Jjajang Rice","짜조":"Cha Gio (Vietnamese Fried Spring Rolls)","짬뽕":"Jjamppong (Spicy Seafood Noodle Soup)","쫄면":"Jjolmyeon (Chewy Spicy Noodles)","쭈꾸미볶음밥":"Spicy Baby Octopus Fried Rice","쭈꾸미삼겹살":"Baby Octopus and Pork Belly","츠케멘":"Tsukemen (Dipping Ramen)","호키엔미":"Hokkien Mee","찜닭":"Jjimdak (Braised Chicken)","짜까":"Chaaka","차나마살라":"Chana Masala","차돌된장찌개":"Beef Brisket Doenjang Stew","차돌박이숙주볶음":"Beef Brisket and Bean Sprout Stir-fry","차슈":"Chashu (Braised Pork)","차오멘":"Chow Mein","차완무시":"Chawanmushi (Japanese Steamed Egg Custard)","차우파":"Chaufa (Peruvian Fried Rice)","차이 타우 궤":"Chai Tow Kway (Radish Cake)","차조":"Chamjo (Millet and Porridge)","차지키":"Tzatziki","차퀘이테오":"Char Kway Teow","참나물무침":"Seasoned Chammnamul (Wild Parsley)","참치김밥":"Tuna Gimbap","참치김치볶음밥":"Tuna and Kimchi Fried Rice","참치김치찌개":"Tuna and Kimchi Stew","참치마요덮밥":"Tuna Mayo Rice Bowl","참치마요오니기리":"Tuna Mayo Onigiri","참치채소샐러드":"Tuna and Vegetable Salad","참치포케":"Tuna Poke Bowl","참치회비빔밥":"Fresh Tuna Bibimbap","찹스테이크":"Chop Steak","채끝스테이크":"Sirloin Steak","채소달걀국":"Vegetable and Egg Soup","채소커리":"Vegetable Curry","청경채굴소스볶음":"Bok Choy with Oyster Sauce","청경채두부볶음":"Bok Choy and Tofu Stir-fry","청경채볶음":"Stir-fried Bok Choy","청국장찌개":"Cheonggukjang Jjigae (Fermented Soybean Stew)","체가이볶음면":"Che Kai Stir-fried Noodles","초리소와인조림":"Chorizo Wine Braise","총유빙":"Cong You Bing (Scallion Pancake)","추어탕":"Chueo Tang (Loach Soup)","충무김밥":"Chungmu Gimbap","취나물":"Seasoned Chwi Namul","취나물무침":"Seasoned Chwi Namul","__DELETE__치라시즈시":"Chirashi Sushi","치미창가":"Chimichanga","치즈닭갈비":"Cheese Dakgalbi","치즈버거":"Cheeseburger","치킨그라탕":"Chicken Gratin","치킨난반":"Chicken Nanban","치킨누들수프":"Chicken Noodle Soup","치킨두피아자":"Chicken Do Pyaza","치킨몰레":"Chicken Mole","치킨발티":"Chicken Balti","치킨버거":"Chicken Burger","치킨부리토":"Chicken Burrito","치킨빈달루":"Chicken Vindaloo","치킨샐러드":"Chicken Salad","치킨샤와르마랩":"Chicken Shawarma Wrap","치킨수프":"Chicken Soup","치킨스테이크":"Chicken Steak","치킨스튜":"Chicken Stew","치킨시저랩":"Chicken Caesar Wrap","치킨아도보":"Chicken Adobo","치킨이나살":"Chicken Inasal","치킨카츠":"Chicken Katsu","치킨카치아토라":"Chicken Cacciatore","치킨커리말레이":"Malaysian Chicken Curry","치킨케밥":"Chicken Kebab","치킨코르마":"Chicken Korma","치킨콥샐러드":"Chicken Cobb Salad","치킨타진":"Chicken Tagine","치킨타코":"Chicken Taco","치킨티카마살라":"Chicken Tikka Masala","치킨파히타":"Chicken Fajita","치킨팟파이":"Chicken Pot Pie","칠레레예노":"Chile Relleno","칠레아도보":"Chile Adobo","칠레콘카르네":"Chili con Carne","칠리새우":"Chili Shrimp","칠리콘카르네":"Chili con Carne","칠리크랩":"Chilli Crab","칡냉면":"Arrowroot Cold Noodles","카니돈부리":"Kani Donburi (Crab Rice Bowl)","카레라이스":"Curry Rice","카레우동":"Curry Udon","카레카레":"Kare-Kare (Filipino Peanut Stew)","카르네아사다":"Carne Asada","카르니야르크":"Karnıyarık (Stuffed Eggplant)","카르보나라":"Carbonara","카마로네스 아 라 디아블라":"Camarones a la Diabla","카불리 팔라우":"Kaburga (Turkish Lamb Ribs)","카술레":"Cassoulet","카야토스트":"Kaya Toast","카오니아오":"Khao Niao (Sticky Rice)","카오니아오 마무앙":"Khao Niao Mamuang (Mango Sticky Rice)","카오니아오 무삥":"Khao Niao Mu Ping (Grilled Pork with Sticky Rice)","카오만가이":"Khao Man Gai (Thai Chicken Rice)","카오무댕":"Khao Mu Daeng (Red Pork Rice)","카오소이":"Khao Soi","카오카무":"Khao Kha Mu (Thai Braised Pork Leg Rice)","카오팟":"Khao Pad (Thai Fried Rice)","카오팟꿍":"Khao Pad Kung (Shrimp Fried Rice)","카오팟 끄라파오":"Khao Pad Krapao","카이 지아우 무쌉":"Khai Jiao Mu Sap (Thai Minced Pork Omelette)","깐 까 우아":"Canh Chua (Vietnamese Sour Soup)","가케소바":"Kake Soba","카키아게":"Kakiage (Mixed Tempura)","카포나타":"Caponata","카프레제샐러드":"Caprese Salad","카프타 그릴":"Kafta Grill (Lebanese Meatball Skewer)","똠 카 카이":"Khanom Khai (Thai Steamed Egg)","칼국수":"Kalguksu (Knife-cut Noodle Soup)","칼데레타":"Caldereta (Filipino Beef Stew)","칼데이라다":"Caldeirada (Portuguese Fish Stew)","캅카이":"Khap Kai","캐롯케이크":"Carrot Cake","커리치킨반미":"Curry Chicken Banh Mi","케랄라새우커리":"Kerala Prawn Curry","케랍 아얌":"Kerabu Ayam (Malaysian Chicken Salad)","키마 마타르":"Keema Matar (Minced Meat and Peas)","케프타 타진":"Kefta Tagine","코다리조림":"Braised Semi-dried Pollock","코로케":"Korokke (Croquette)","코시도":"Cocido (Spanish Chickpea Stew)","코울슬로":"Coleslaw","코지두 아 포르투게자":"Cozido à Portuguesa","코코뱅":"Coq au Vin","코프타 케밥":"Kofta Kebab","코프테":"Köfte (Turkish Meatballs)","콘치즈":"Corn Cheese","콥샐러드":"Cobb Salad","콩국수":"Kong Guksu (Cold Soy Milk Noodles)","콩나물국":"Bean Sprout Soup","콩나물국밥":"Bean Sprout Rice Soup","콩나물냉국수":"Cold Bean Sprout Noodles","콩나물무침":"Seasoned Bean Sprouts","콩나물밥":"Bean Sprout Rice","콩나물해장국":"Bean Sprout Hangover Soup","콩비지찌개":"Soybean Pulp Stew","쾨프테":"Köfte","쿠르제트수프":"Courgette Soup (Zucchini Soup)","쿠스쿠스":"Couscous","쿠스쿠스 로얄":"Couscous Royal","쿵파오치킨":"Kung Pao Chicken","퀘사디야":"Quesadilla","퀴노아채소볼":"Quinoa Vegetable Bowl","크레프":"Crêpe","크로크무슈":"Croque Monsieur","크리스피 파타":"Crispy Pata (Filipino Crispy Pork Knuckle)","크림브로콜리수프":"Cream of Broccoli Soup","크림새우":"Creamy Shrimp","크림소스연어":"Salmon in Cream Sauce","크림수프":"Cream Soup","크림파스타":"Cream Pasta","크메르레드커리":"Khmer Red Curry","클램차우더":"Clam Chowder","클럽샌드위치":"Club Sandwich","클레프티코":"Kleftiko (Greek Slow-roasted Lamb)","키마커리":"Keema Curry","키베":"Kibbeh","키슈 로렌":"Quiche Lorraine","키츠네우동":"Kitsune Udon (Fox Udon)","킬라윈":"Kinilaw (Filipino Ceviche)","타마고산도":"Tamago Sando (Egg Sandwich)","타북 수유":"Tabbouleh","타불레":"Tabbouleh","타쉬 쾨프테":"Taş Köfte","타코":"Taco","타코야키":"Takoyaki (Octopus Balls)","탄두리연어":"Tandoori Salmon","탄두리치킨":"Tandoori Chicken","탄탄면":"Dan Dan Noodles","탕수육":"Tangsuyuk (Sweet and Sour Pork)","터키식 필라프":"Turkish Pilaf","텐동":"Tendon (Tempura Rice Bowl)","텐푸라 우동":"Tempura Udon","템페고랭":"Tempe Goreng (Fried Tempeh)","토르탕 탈롱":"Tortang Talong (Filipino Eggplant Omelette)","토르티야수프":"Tortilla Soup","토리파이탄":"Tori Paitan (Chicken Broth Ramen)","토마토계란볶음":"Tomato and Egg Stir-fry","토마토달걀볶음":"Tomato and Egg Stir-fry","토마토달걀수프":"Tomato and Egg Soup","토마토브루스케타":"Tomato Bruschetta","토마토수프":"Tomato Soup","토마토파스타":"Tomato Pasta","토마호크스테이크":"Tomahawk Steak","토스타다":"Tostada","토시로그":"Tosilog (Filipino Tocino","튜나샌드위치":"Tuna Sandwich","티놀라":"Tinola (Filipino Chicken Soup)","티로피타":"Tiropita (Greek Cheese Pie)","티본스테이크":"T-bone Steak","파기름파스타":"Scallion Oil Pasta","파낭 커리":"Panang Curry","파니르 티카":"Paneer Tikka","파르망티에":"Parmentier (French Shepherd's Pie)","파소울라다":"Fasolada (Greek Bean Soup)","파스티치오":"Pastitsio (Greek Baked Pasta)","파에야":"Paella","파인애플볶음밥":"Pineapple Fried Rice","파전":"Pajeon (Scallion Pancake)","파코라":"Pakora","파타타스 브라바스":"Patatas Bravas","파투쉬":"Fattoush","파파스 아루가다스":"Papa a la Huancaína (Peruvian Potato)","판싯":"Pancit (Filipino Noodles)","판싯 비혼":"Pancit Bihay","판싯칸톤":"Pancit Canton","팔락 알루":"Palak Aloo (Spinach and Potato)","팔라펠":"Falafel","팔락 파니르":"Palak Paneer","팔보채":"Palbochae (Eight Treasure Stir-fry)","팟 끄라파오 무쌉":"Pad Krapao Mu Sap (Thai Basil Minced Pork)","팟나":"Pad Na (Thai Sauce Noodles)","팟씨유":"Pad See Ew","팟타이":"Pad Thai","팟 팍붕 파이댕":"Pad Pak Bung Fai Daeng (Stir-fried Morning Glory)","팟 카나":"Pad Pak Khana (Stir-fried Chinese Broccoli)","팟프리킹":"Pad Prik King (Dry Red Curry Stir-fry)","팥죽":"Patjuk (Red Bean Porridge)","파니르 도 피아자":"Paneer Do Pyaza","팬케이크":"Pancake","팽이버섯볶음":"Stir-fried Enoki Mushrooms","팽이버섯전골":"Enoki Mushroom Hot Pot","퍼가":"Pho Ga (Vietnamese Chicken Noodle Soup)","퍼싸오":"Pho Xao (Stir-fried Pho Noodles)","페센베크":"Fesenjān (Persian Walnut and Pomegranate Stew)","페스토파스타":"Pesto Pasta","페퍼로니피자":"Pepperoni Pizza","평양냉면":"Pyongyang Naengmyeon (Cold Noodles)","__DELETE__포졸레":"Pozole","포카치아":"Focaccia","포케":"Poke Bowl","포크시시그":"Pork Sisig","포크아도보":"Pork Adobo","포터하우스스테이크":"Porterhouse Steak","폴렌타":"Polenta","폴포살라다":"Polpo Salada (Octopus Salad)","풀드포크":"Pulled Pork","풀포 아 라 가예가":"Pulpo a la Gallega (Galician Octopus)","프라이드 피타":"Fried Pita","프렌치 어니언 수프":"French Onion Soup","프렌치토스트":"French Toast","토마토 프로방살":"Provençal Tomatoes","프론 미":"Prawn Mee (Shrimp Noodle Soup)","프리타타":"Frittata","피나크벳":"Pinakbet (Filipino Vegetable Stew)","피단두부무침":"Century Egg and Tofu","피데":"Pide (Turkish Flatbread Pizza)","피미엔토 데 파드론":"Pimientos de Padrón","피시볼 국":"Fish Ball Soup","피시 앤 칩스":"Fish and Chips","피시타코":"Fish Taco","피시헤드커리":"Fish Head Curry","하리라":"Harira (Moroccan Lamb Soup)","하몬 크로케타":"Jamón Croqueta (Ham Croquette)","하이난치킨라이스":"Hainanese Chicken Rice","하이라이스":"Hayashi Rice","할루미구이":"Grilled Halloumi","함박스테이크":"Hambak Steak (Japanese-style Hamburger Steak)","함흥냉면":"Hamheung Naengmyeon (Cold Noodles)","해물누룽지탕":"Seafood Scorched Rice Soup","해물순두부찌개":"Seafood Soft Tofu Stew","해물잡채":"Seafood Japchae","해물전골":"Seafood Hot Pot","해물파전":"Seafood Scallion Pancake","해산물리조또":"Seafood Risotto","해산물파스타":"Seafood Pasta","해파리냉채":"Cold Jellyfish Salad","햄버거":"Hamburger","현미채소덮밥":"Brown Rice Vegetable Bowl","현미채소볶음밥":"Brown Rice Vegetable Fried Rice","호르타":"Horta (Greek Boiled Greens)","호박나물":"Seasoned Zucchini","호박전":"Zucchini Pancake","호박죽":"Pumpkin Porridge","홍샤오러우":"Red-braised Pork","홍합탕":"Mussel Soup","황기닭백숙":"Astragalus Chicken Soup","황태구이":"Grilled Dried Pollack","황태국":"Dried Pollack Soup","황태해장국":"Dried Pollack Hangover Soup","후이궈러우":"Twice-cooked Pork (Huiguorou)","회냉면":"Raw Fish Cold Noodles","후무스":"Hummus","훈제연어파스타":"Smoked Salmon Pasta","훈제오리볶음":"Stir-fried Smoked Duck","훈제오리샐러드":"Smoked Duck Salad","훠궈":"Huoguo (Hot Pot)","히레카츠":"Hire Katsu (Pork Fillet Cutlet)","히야시추카":"Hiyashi Chuka (Cold Chinese Noodles)","BLT 샌드위치":"BLT Sandwich"};
    const DELETE_NAMES = new Set(["홍샤오러우","훔무스","팟카파오 무쌉","팟카파오무쌉","탄탄면","퀘사디야","케사디야","카르네 아사다 타코","케밥","차퀘이테오싱가포르","차퀘이티아오","완탕미싱가포르","오탁오탁","오타오타싱가포르","소고기무국","뿌팟퐁가리","껌승"]);
    const before = (typeof MENU_DB==='object') ? Object.keys(MENU_DB).length : 0;
    function uniq(arr){ return [...new Set((arr||[]).filter(Boolean))]; }
    function mergeObj(target, src, newName){
      if(!target || !src) return target || src;
      const out = target;
      out.name = newName || out.name || src.name;
      out.displayName = out.name;
      out.enName = out.enName || src.enName;
      out.styles = uniq([...(out.styles||[]), ...(src.styles||[]), src.style, out.style]);
      if(!out.style && src.style) out.style = src.style;
      out.ingredients = uniq([...(out.ingredients||[]), ...(src.ingredients||[])]);
      out.tags = uniq([...(out.tags||[]), ...(src.tags||[])]);
      out.ingredientAmounts = Object.assign({}, src.ingredientAmounts||{}, out.ingredientAmounts||{});
      out.cookTime = out.cookTime || src.cookTime;
      out.servings = out.servings || src.servings;
      out.recipeServings = out.recipeServings || src.recipeServings;
      out.baseId = out.baseId || src.baseId;
      out.baseName = out.baseName || src.baseName;
      return out;
    }
    function applyMeta(obj, key){
      if(!obj) return;
      const en = EN_NEW[key] || EN_OLD[key];
      obj.name = key;
      obj.displayName = key;
      if(en) obj.enName = en;
    }
    function renameInDict(dict, oldName, newName){
      if(!dict || !dict[oldName]) return false;
      const src = dict[oldName];
      const en = EN_OLD[oldName] || EN_NEW[newName];
      src.name = newName;
      src.displayName = newName;
      if(en) src.enName = en;
      if(dict[newName] && dict[newName] !== src){
        dict[newName] = mergeObj(dict[newName], src, newName);
      }else{
        dict[newName] = src;
      }
      delete dict[oldName];
      return true;
    }
    function deleteFromDict(dict, name){
      if(dict && Object.prototype.hasOwnProperty.call(dict,name)) delete dict[name];
    }
    function mapName(name){
      if(!name) return name;
      const raw = String(name).trim();
      if(DELETE_NAMES.has(raw)) return null;
      return NAME_MAP[raw] || raw;
    }
    // 1) Explicit delete first
    DELETE_NAMES.forEach(function(n){
      deleteFromDict(typeof MENU_DB!=='undefined' ? MENU_DB : null, n);
      deleteFromDict(typeof MENU_SCHEMA_V2!=='undefined' ? MENU_SCHEMA_V2 : null, n);
      deleteFromDict(typeof WM_NUT_V5!=='undefined' ? WM_NUT_V5 : null, n);
      deleteFromDict(typeof MENU_NUT!=='undefined' ? MENU_NUT : null, n);
    });
    // 2) Rename keys in all menu/nutrition dictionaries
    Object.keys(NAME_MAP).forEach(function(oldName){
      const newName = NAME_MAP[oldName];
      if(!newName || oldName===newName || DELETE_NAMES.has(oldName) || DELETE_NAMES.has(newName)) return;
      renameInDict(typeof MENU_DB!=='undefined' ? MENU_DB : null, oldName, newName);
      renameInDict(typeof MENU_SCHEMA_V2!=='undefined' ? MENU_SCHEMA_V2 : null, oldName, newName);
      renameInDict(typeof WM_NUT_V5!=='undefined' ? WM_NUT_V5 : null, oldName, newName);
      renameInDict(typeof MENU_NUT!=='undefined' ? MENU_NUT : null, oldName, newName);
    });
    // 3) Attach enName metadata to current canonical names
    if(typeof MENU_DB==='object') Object.keys(MENU_DB).forEach(function(k){ applyMeta(MENU_DB[k], k); });
    if(typeof MENU_SCHEMA_V2==='object') Object.keys(MENU_SCHEMA_V2).forEach(function(k){ applyMeta(MENU_SCHEMA_V2[k], k); });
    // 4) CLEAN_MENUS array cleanup/metadata
    if(typeof CLEAN_MENUS!=='undefined' && Array.isArray(CLEAN_MENUS)){
      for(let i=CLEAN_MENUS.length-1;i>=0;i--){
        const m=CLEAN_MENUS[i];
        const newName=mapName(m && m.name);
        if(!newName){ CLEAN_MENUS.splice(i,1); continue; }
        m.name=newName; m.displayName=newName;
        const en=EN_NEW[newName] || EN_OLD[newName];
        if(en) m.enName=en;
      }
    }
    // 5) Update style/group maps and any visible menu list arrays
    function remapArray(arr){ return uniq((arr||[]).map(mapName).filter(function(n){ return n && (typeof MENU_DB==='undefined' || MENU_DB[n]); })); }
    if(typeof FLOW_STYLE_MENU_MAP==='object') Object.keys(FLOW_STYLE_MENU_MAP).forEach(function(k){ if(Array.isArray(FLOW_STYLE_MENU_MAP[k])) FLOW_STYLE_MENU_MAP[k]=remapArray(FLOW_STYLE_MENU_MAP[k]); });
    if(typeof MENU_GROUP_DB_V3==='object') Object.values(MENU_GROUP_DB_V3).forEach(function(g){ if(Array.isArray(g.variations)) g.variations=remapArray(g.variations); });
    // 6) Alias resolver: old typed/saved names resolve to canonical renamed menu.
    const oldResolveMenu = window.resolveMenu;
    window.resolveMenu = function(name){
      const raw = String(name||'').trim();
      if(!raw) return null;
      if(DELETE_NAMES.has(raw)) return null;
      const mapped = NAME_MAP[raw] || raw;
      if(typeof MENU_DB!=='undefined' && MENU_DB[mapped]) return mapped;
      if(typeof oldResolveMenu==='function') return oldResolveMenu(raw);
      return null;
    };
    window.flowMenuDBName = function(name){ return window.resolveMenu(name) || name; };
    window.getMenuDisplayName = function(name){ const n=window.resolveMenu(name)||name; return n; };
    window.getMenuEnglishName = function(name){
      const n=window.resolveMenu(name)||name;
      const obj=(typeof MENU_DB!=='undefined' && MENU_DB[n]) || (typeof MENU_SCHEMA_V2!=='undefined' && MENU_SCHEMA_V2[n]);
      return (obj&&obj.enName) || EN_NEW[n] || EN_OLD[n] || '';
    };
    window.WM_MENU_NAME_I18N_PATCH_V1={
      applied:true,
      before:before,
      after:(typeof MENU_DB==='object') ? Object.keys(MENU_DB).length : 0,
      renameCount:Object.keys(NAME_MAP).length,
      enNameCount:Object.keys(EN_NEW).length,
      deleted:[...DELETE_NAMES]
    };
    console.info('[Homekeeper] menu name/i18n patch v1', window.WM_MENU_NAME_I18N_PATCH_V1);
  }catch(e){ console.warn('menu name/i18n patch v1 failed', e); }
})();
/* ===== /menu-name-i18n-rename-patch-v1 ===== */


/* ===== gambas-duplicate-cleanup-v1 ===== */
(function(){
  try{
    const OLD_NAMES = ['감바스','감바스알아히요'];
    const CANON = '감바스 알 아히요';
    const EN = 'Gambas al Ajillo';
    function uniq(arr){ return [...new Set((arr||[]).filter(Boolean))]; }
    function mergeObj(target, src){
      if(!src) return target;
      if(!target) target = {};
      target.name = CANON;
      target.displayName = CANON;
      target.enName = EN;
      target.style = target.style || src.style;
      target.styles = uniq([...(target.styles||[]), ...(src.styles||[]), target.style, src.style]);
      target.ingredients = uniq([...(target.ingredients||[]), ...(src.ingredients||[])]);
      target.tags = uniq([...(target.tags||[]), ...(src.tags||[])]);
      target.ingredientAmounts = Object.assign({}, src.ingredientAmounts||{}, target.ingredientAmounts||{});
      target.cookTime = target.cookTime || src.cookTime;
      target.servings = target.servings || src.servings;
      target.recipeServings = target.recipeServings || src.recipeServings;
      target.baseId = target.baseId || src.baseId;
      target.baseName = target.baseName || src.baseName || CANON;
      return target;
    }
    function normalizeDict(dict){
      if(!dict) return;
      let canon = dict[CANON] || null;
      OLD_NAMES.forEach(function(n){
        if(dict[n]){
          canon = mergeObj(canon || {}, dict[n]);
          delete dict[n];
        }
      });
      if(canon){
        canon.name = CANON;
        canon.displayName = CANON;
        canon.enName = EN;
        dict[CANON] = canon;
      }
    }
    normalizeDict(typeof MENU_DB!=='undefined' ? MENU_DB : null);
    normalizeDict(typeof MENU_SCHEMA_V2!=='undefined' ? MENU_SCHEMA_V2 : null);
    normalizeDict(typeof WM_NUT_V5!=='undefined' ? WM_NUT_V5 : null);
    normalizeDict(typeof MENU_NUT!=='undefined' ? MENU_NUT : null);

    if(typeof CLEAN_MENUS!=='undefined' && Array.isArray(CLEAN_MENUS)){
      let canon = null;
      for(let i=CLEAN_MENUS.length-1;i>=0;i--){
        const m=CLEAN_MENUS[i];
        if(!m || !OLD_NAMES.includes(m.name)) continue;
        if(!canon) canon = Object.assign({}, m, {name:CANON, displayName:CANON, enName:EN});
        CLEAN_MENUS.splice(i,1);
      }
      const exists = CLEAN_MENUS.some(m=>m && m.name===CANON);
      if(canon && !exists) CLEAN_MENUS.push(canon);
      CLEAN_MENUS.forEach(function(m){ if(m && m.name===CANON){ m.displayName=CANON; m.enName=EN; }});
    }

    function remapName(n){ return OLD_NAMES.includes(n) ? CANON : n; }
    function remapArray(arr){ return uniq((arr||[]).map(remapName).filter(function(n){ return !OLD_NAMES.includes(n); })); }
    if(typeof FLOW_STYLE_MENU_MAP==='object') Object.keys(FLOW_STYLE_MENU_MAP).forEach(function(k){ if(Array.isArray(FLOW_STYLE_MENU_MAP[k])) FLOW_STYLE_MENU_MAP[k]=remapArray(FLOW_STYLE_MENU_MAP[k]); });
    if(typeof MENU_GROUP_DB_V3==='object') Object.values(MENU_GROUP_DB_V3).forEach(function(g){ if(Array.isArray(g.variations)) g.variations=remapArray(g.variations); });
    if(typeof SIDE_MAP==='object'){
      OLD_NAMES.forEach(function(n){ if(SIDE_MAP[n] && !SIDE_MAP[CANON]) SIDE_MAP[CANON]=SIDE_MAP[n]; delete SIDE_MAP[n]; });
    }

    const prevResolve = window.resolveMenu;
    window.resolveMenu = function(name){
      const raw = String(name||'').trim();
      if(OLD_NAMES.includes(raw)) return CANON;
      if(typeof MENU_DB!=='undefined' && MENU_DB[raw]) return raw;
      return (typeof prevResolve==='function') ? prevResolve(raw) : null;
    };
    window.flowMenuDBName = function(name){ return window.resolveMenu(name) || name; };
    const prevEn = window.getMenuEnglishName;
    window.getMenuEnglishName = function(name){
      const resolved = window.resolveMenu(name) || name;
      if(resolved===CANON) return EN;
      return (typeof prevEn==='function') ? prevEn(name) : '';
    };
    window.WM_GAMBAS_DUPLICATE_CLEANUP_V1={applied:true, removed:'감바스', kept:CANON, enName:EN};
    console.info('[Homekeeper] gambas duplicate cleanup v1', window.WM_GAMBAS_DUPLICATE_CLEANUP_V1);
  }catch(e){ console.warn('gambas duplicate cleanup v1 failed', e); }
})();
/* ===== /gambas-duplicate-cleanup-v1 ===== */


/* ===== siomi-somtam-menu-cleanup-patch ===== */
(function(){
  function safeRun(fn){ try{ fn(); }catch(e){ console.warn('siomi/somtam cleanup patch:', e); } }
  function mergeMenuRecord(target, src, newName){
    if(!src) return target;
    if(!target) target = {};
    Object.keys(src).forEach(function(k){
      if(target[k] === undefined || target[k] === null || target[k] === '') target[k] = src[k];
    });
    target.name = newName;
    target.displayName = newName;
    if(Array.isArray(target.tags)) target.tags = Array.from(new Set(target.tags));
    if(Array.isArray(target.styles)) target.styles = Array.from(new Set(target.styles));
    return target;
  }
  function renameKey(obj, oldName, newName){
    if(!obj || typeof obj !== 'object' || oldName === newName) return;
    if(Object.prototype.hasOwnProperty.call(obj, oldName)){
      if(Object.prototype.hasOwnProperty.call(obj, newName)) obj[newName] = mergeMenuRecord(obj[newName], obj[oldName], newName);
      else obj[newName] = obj[oldName];
      if(obj[newName] && typeof obj[newName] === 'object'){
        obj[newName].name = newName;
        obj[newName].displayName = newName;
      }
      delete obj[oldName];
    }
  }
  function deleteKey(obj, name){
    if(obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, name)) delete obj[name];
  }
  function mutateMenuArray(arr){
    if(!Array.isArray(arr)) return;
    for(let i=arr.length-1;i>=0;i--){
      const m=arr[i];
      if(!m) continue;
      const n=(typeof m==='string')?m:m.name;
      if(n==='시오미') { arr.splice(i,1); continue; }
      if(n==='쏨땀' || n==='쏨땀'){
        if(typeof m==='string') arr[i]='쏨땀';
        else { m.name='쏨땀'; m.displayName='쏨땀'; m.enName=m.enName||'Som Tam (Green Papaya Salad)'; }
      }
    }
    // remove duplicate 쏨땀 entries while preserving first object
    const seen=new Set();
    for(let i=arr.length-1;i>=0;i--){
      const n=(typeof arr[i]==='string')?arr[i]:arr[i]?.name;
      if(n==='쏨땀'){
        if(seen.has('쏨땀')) arr.splice(i,1);
        else seen.add('쏨땀');
      }
    }
  }
  function cleanup(){
    safeRun(function(){ if(typeof MENU_DB!=='undefined'){ renameKey(MENU_DB,'쏨땀','쏨땀'); deleteKey(MENU_DB,'시오미'); if(MENU_DB['쏨땀']){ MENU_DB['쏨땀'].name='쏨땀'; MENU_DB['쏨땀'].displayName='쏨땀'; MENU_DB['쏨땀'].enName=MENU_DB['쏨땀'].enName||'Som Tam (Green Papaya Salad)'; } } });
    safeRun(function(){ if(typeof MENU_SCHEMA_V2!=='undefined'){ renameKey(MENU_SCHEMA_V2,'쏨땀','쏨땀'); deleteKey(MENU_SCHEMA_V2,'시오미'); } });
    safeRun(function(){ if(typeof MENU_GROUP_DB_V3!=='undefined'){ renameKey(MENU_GROUP_DB_V3,'쏨땀','쏨땀'); deleteKey(MENU_GROUP_DB_V3,'시오미'); } });
    safeRun(function(){ if(typeof NUT_V5!=='undefined'){ renameKey(NUT_V5,'쏨땀','쏨땀'); deleteKey(NUT_V5,'시오미'); } });
    safeRun(function(){ if(typeof EN!=='undefined'){ renameKey(EN,'쏨땀','쏨땀'); deleteKey(EN,'시오미'); EN['쏨땀']=EN['쏨땀']||'Som Tam (Green Papaya Salad)'; } });
    safeRun(function(){ if(typeof EN_NEW!=='undefined'){ renameKey(EN_NEW,'쏨땀','쏨땀'); deleteKey(EN_NEW,'시오미'); EN_NEW['쏨땀']=EN_NEW['쏨땀']||'Som Tam (Green Papaya Salad)'; } });
    safeRun(function(){ if(typeof CLEAN_MENUS!=='undefined') mutateMenuArray(CLEAN_MENUS); });
    safeRun(function(){ if(typeof ADD_MENUS!=='undefined') mutateMenuArray(ADD_MENUS); });
    safeRun(function(){ if(typeof FLOW_STYLE_MENU_MAP!=='undefined') Object.keys(FLOW_STYLE_MENU_MAP).forEach(k=>mutateMenuArray(FLOW_STYLE_MENU_MAP[k])); });
    safeRun(function(){ if(typeof MENU_KEYWORD_SIDES!=='undefined') deleteKey(MENU_KEYWORD_SIDES,'시오미'); });
    safeRun(function(){
      if(typeof ALIAS_V5!=='undefined'){
        ALIAS_V5['쏨땀']='쏨땀'; ALIAS_V5['쏨땀']='쏨땀'; ALIAS_V5['시오미']='시오라멘';
      }
      if(typeof DUP_ALIAS!=='undefined'){
        DUP_ALIAS['쏨땀']='쏨땀'; DUP_ALIAS['쏨땀']='쏨땀'; DUP_ALIAS['시오미']='시오라멘';
      }
    });
    window.WM_MENU_CLEANUP_SIOMI_SOMTAM = true;
  }
  cleanup();
  document.addEventListener('DOMContentLoaded', cleanup);
  setTimeout(cleanup, 0);
})();
/* ===== /siomi-somtam-menu-cleanup-patch ===== */


/* ===== menu-nutrition-db-logic-v1 ===== */
(function(){
  const WM_MENU_NUTRITION_DB = Object.freeze({"가도가도":{"kcal":315,"carb":28,"pro":12,"fat":16,"portionG":236,"enName":"Gado-Gado"},"가라아게":{"kcal":400,"carb":10,"pro":32,"fat":26,"portionG":150,"enName":"Karaage"},"가스파초":{"kcal":80,"carb":9,"pro":1.5,"fat":3.5,"portionG":240,"enName":"Gazpacho"},"가이센동":{"kcal":600,"carb":62,"pro":41,"fat":20,"portionG":400,"enName":"Kaisen don"},"까이 팟 맷 마무앙":{"kcal":794,"carb":28,"pro":21,"fat":20,"portionG":420,"enName":"Gai Pad Med Mamuang (Cashew Chicken)"},"가지나물":{"kcal":51,"carb":7,"pro":2,"fat":2,"portionG":50,"enName":"Sautéed Eggplant"},"가지볶음":{"kcal":58,"carb":10,"pro":2,"fat":2,"portionG":50,"enName":"Stir-fried Eggplant"},"가츠동":{"kcal":808,"carb":106,"pro":36,"fat":25,"portionG":450,"enName":"Katsudon"},"가츠산도":{"kcal":443,"carb":44,"pro":25,"fat":17,"portionG":150,"enName":"Katsu Sando"},"가케우동":{"kcal":359,"carb":65,"pro":18,"fat":3,"portionG":400,"enName":"Kake Udon"},"고등어구이":{"kcal":290,"carb":0.2,"pro":27,"fat":20,"portionG":150,"enName":"Grilled Mackerel"},"간장게장":{"kcal":320,"carb":8,"pro":33,"fat":7,"portionG":250,"enName":"Soy Sauce Marinated Crab"},"간장닭날개튀김":{"kcal":540,"carb":18,"pro":32,"fat":38,"portionG":200,"enName":"Soy Sauce Fried Chicken Wings"},"간장비빔소면":{"kcal":520,"carb":95,"pro":13,"fat":10,"portionG":400,"enName":"Soy Sauce Bibim Somyeon"},"간장새우장":{"kcal":145,"carb":8,"pro":22,"fat":3,"portionG":150,"enName":"Soy Sauce Marinated Shrimp"},"간장제육볶음":{"kcal":380,"carb":12,"pro":28,"fat":24,"portionG":200,"enName":"Soy Sauce Spicy Pork Stir-fry"},"간장치킨":{"kcal":680,"carb":25,"pro":42,"fat":46,"portionG":250,"enName":"Soy Sauce Chicken"},"갈비찜":{"kcal":450,"carb":15,"pro":32,"fat":28,"portionG":250,"enName":"Braised Short Ribs"},"갈비탕":{"kcal":420,"carb":10,"pro":35,"fat":26,"portionG":600,"enName":"Short Rib Soup"},"갈치구이":{"kcal":220,"carb":0.5,"pro":28,"fat":11,"portionG":150,"enName":"Grilled Hairtail Fish"},"갈치조림":{"kcal":310,"carb":14,"pro":32,"fat":13,"portionG":300,"enName":"Braised Hairtail Fish"},"감바스 알 아히요":{"kcal":410,"carb":6,"pro":18,"fat":36,"portionG":200,"enName":"Gambas al Ajillo"},"감자국":{"kcal":110,"carb":18,"pro":4,"fat":2,"portionG":400,"enName":"Potato Soup"},"감자그라탕":{"kcal":340,"carb":32,"pro":10,"fat":19,"portionG":250,"enName":"Potato Gratin"},"감자볶음":{"kcal":130,"carb":16,"pro":2,"fat":6,"portionG":120,"enName":"Stir-fried Potatoes"},"감자샐러드":{"kcal":190,"carb":22,"pro":3,"fat":10,"portionG":150,"enName":"Potato Salad"},"감자수제비":{"kcal":440,"carb":88,"pro":12,"fat":4,"portionG":500,"enName":"Potato Sujebi (Hand-torn Noodle Soup)"},"감자전":{"kcal":230,"carb":34,"pro":3,"fat":9,"portionG":150,"enName":"Potato Pancake"},"감자조림":{"kcal":95,"carb":18,"pro":2,"fat":1.5,"portionG":100,"enName":"Braised Potatoes"},"감자탕":{"kcal":510,"carb":22,"pro":45,"fat":27,"portionG":800,"enName":"Pork Bone and Potato Soup"},"감자튀김":{"kcal":310,"carb":38,"pro":4,"fat":15,"portionG":100,"enName":"French Fries"},"건새우미역무침":{"kcal":55,"carb":5,"pro":4,"fat":2,"portionG":50,"enName":"Dried Shrimp and Seaweed Salad"},"게살볶음밥":{"kcal":440,"carb":68,"pro":17,"fat":11,"portionG":300,"enName":"Crab Meat Fried Rice"},"계란국":{"kcal":65,"carb":3,"pro":5,"fat":4,"portionG":300,"enName":"Egg Soup"},"계란덮밥":{"kcal":430,"carb":68,"pro":14,"fat":11,"portionG":350,"enName":"Egg Rice Bowl"},"계란말이":{"kcal":210,"carb":3,"pro":14,"fat":16,"portionG":120,"enName":"Rolled Egg Omelette"},"계란밥":{"kcal":385,"carb":65,"pro":11,"fat":9,"portionG":260,"enName":"Egg Rice"},"계란볶음밥":{"kcal":410,"carb":66,"pro":12,"fat":10,"portionG":300,"enName":"Egg Fried Rice"},"계란아보카도토스트":{"kcal":360,"carb":28,"pro":12,"fat":22,"portionG":180,"enName":"Egg Avocado Toast"},"계란찜":{"kcal":90,"carb":2,"pro":8,"fat":6,"portionG":150,"enName":"Steamed Egg"},"고등어미소조림":{"kcal":320,"carb":8,"pro":26,"fat":20,"portionG":200,"enName":"Miso-braised Mackerel"},"고등어조림":{"kcal":310,"carb":10,"pro":28,"fat":17,"portionG":250,"enName":"Braised Mackerel"},"고등어케밥":{"kcal":380,"carb":32,"pro":24,"fat":17,"portionG":200,"enName":"Mackerel Kebab"},"고로케":{"kcal":260,"carb":28,"pro":4,"fat":15,"portionG":120,"enName":"Korokke (Croquette)"},"고르곤졸라피자":{"kcal":420,"carb":42,"pro":16,"fat":21,"portionG":150,"enName":"Gorgonzola Pizza"},"고사리나물":{"kcal":45,"carb":4,"pro":2,"fat":2.5,"portionG":60,"enName":"Seasoned Bracken Fern"},"고안 피시 커리":{"kcal":340,"carb":12,"pro":24,"fat":22,"portionG":300,"enName":"Goan Fish Curry"},"고이가":{"kcal":180,"carb":8,"pro":22,"fat":7,"portionG":200,"enName":"Goi Ga (Vietnamese Chicken Salad)"},"고이꾸온":{"kcal":190,"carb":26,"pro":12,"fat":4,"portionG":160,"enName":"Goi Cuon (Fresh Spring Rolls)"},"고추잡채":{"kcal":230,"carb":12,"pro":15,"fat":14,"portionG":200,"enName":"Pepper Japchae"},"고추장불고기":{"kcal":360,"carb":14,"pro":26,"fat":22,"portionG":200,"enName":"Gochujang Bulgogi"},"고추장삼겹살":{"kcal":580,"carb":10,"pro":24,"fat":51,"portionG":200,"enName":"Gochujang Pork Belly"},"고추장찌개":{"kcal":220,"carb":14,"pro":14,"fat":12,"portionG":400,"enName":"Gochujang Stew"},"골뱅이무침":{"kcal":190,"carb":18,"pro":21,"fat":4,"portionG":250,"enName":"Spicy Whelk Salad"},"곱창볶음":{"kcal":430,"carb":12,"pro":20,"fat":34,"portionG":200,"enName":"Stir-fried Beef Intestines"},"과카몰리":{"kcal":160,"carb":9,"pro":2,"fat":15,"portionG":100,"enName":"Guacamole"},"광동볶음면":{"kcal":480,"carb":72,"pro":14,"fat":15,"portionG":350,"enName":"Cantonese Stir-fried Noodles"},"광동식볶음밥":{"kcal":430,"carb":68,"pro":13,"fat":12,"portionG":300,"enName":"Cantonese Fried Rice"},"광동식탕수육":{"kcal":460,"carb":38,"pro":18,"fat":26,"portionG":200,"enName":"Cantonese Sweet and Sour Pork"},"교자":{"kcal":220,"carb":24,"pro":9,"fat":10,"portionG":120,"enName":"Gyoza"},"군만두":{"kcal":250,"carb":25,"pro":9,"fat":13,"portionG":120,"enName":"Pan-fried Dumplings"},"굴라이이칸":{"kcal":320,"carb":10,"pro":24,"fat":20,"portionG":300,"enName":"Gulai Ikan (Fish Curry)"},"궁중떡볶이":{"kcal":380,"carb":65,"pro":11,"fat":8,"portionG":250,"enName":"Royal Tteokbokki"},"귀벡":{"kcal":290,"carb":12,"pro":26,"fat":15,"portionG":350,"enName":"Güveç (Turkish Casserole)"},"규나베":{"kcal":390,"carb":14,"pro":28,"fat":25,"portionG":400,"enName":"Gyunabe (Beef Hot Pot)"},"규동":{"kcal":560,"carb":78,"pro":24,"fat":17,"portionG":400,"enName":"Gyudon (Beef Rice Bowl)"},"규카츠":{"kcal":380,"carb":18,"pro":26,"fat":23,"portionG":150,"enName":"Gyukatsu (Beef Cutlet)"},"그라탕":{"kcal":350,"carb":30,"pro":12,"fat":20,"portionG":250,"enName":"Gratin"},"그릭샐러드":{"kcal":160,"carb":9,"pro":5,"fat":13,"portionG":200,"enName":"Greek Salad"},"그릭요거트볼":{"kcal":210,"carb":18,"pro":12,"fat":10,"portionG":180,"enName":"Greek Yogurt Bowl"},"그린커리":{"kcal":360,"carb":14,"pro":20,"fat":25,"portionG":300,"enName":"Green Curry"},"그릴드연어":{"kcal":250,"carb":0.1,"pro":30,"fat":14,"portionG":150,"enName":"Grilled Salmon"},"기나탕마노크":{"kcal":260,"carb":10,"pro":28,"fat":12,"portionG":400,"enName":"Nilagang Manok (Filipino Chicken Soup)"},"기로스":{"kcal":390,"carb":6,"pro":28,"fat":28,"portionG":200,"enName":"Gyros"},"기로스피타":{"kcal":580,"carb":48,"pro":34,"fat":28,"portionG":300,"enName":"Gyros Pita"},"김밥":{"kcal":420,"carb":72,"pro":12,"fat":9,"portionG":300,"enName":"Gimbap"},"김치말이국수":{"kcal":410,"carb":82,"pro":11,"fat":4,"portionG":500,"enName":"Kimchi Wrapped Noodles"},"김치볶음밥":{"kcal":430,"carb":72,"pro":12,"fat":11,"portionG":300,"enName":"Kimchi Fried Rice"},"김치수제비":{"kcal":420,"carb":85,"pro":11,"fat":4,"portionG":500,"enName":"Kimchi Hand-torn Noodle Soup"},"김치전":{"kcal":240,"carb":32,"pro":5,"fat":10,"portionG":150,"enName":"Kimchi Pancake"},"김치찌개":{"kcal":210,"carb":8,"pro":18,"fat":12,"portionG":400,"enName":"Kimchi Stew"},"김치찜":{"kcal":250,"carb":12,"pro":19,"fat":14,"portionG":300,"enName":"Braised Kimchi"},"김치찜닭":{"kcal":380,"carb":18,"pro":32,"fat":20,"portionG":400,"enName":"Kimchi Braised Chicken"},"김치콩나물국":{"kcal":55,"carb":6,"pro":4,"fat":2,"portionG":350,"enName":"Kimchi Bean Sprout Soup"},"까르보나라":{"kcal":590,"carb":65,"pro":22,"fat":27,"portionG":350,"enName":"Carbonara"},"깍두기볶음밥":{"kcal":420,"carb":74,"pro":10,"fat":10,"portionG":300,"enName":"Kkakdugi Fried Rice"},"깐쇼새우":{"kcal":340,"carb":28,"pro":16,"fat":18,"portionG":200,"enName":"Gan Shao Shrimp"},"깐풍기":{"kcal":440,"carb":26,"pro":22,"fat":28,"portionG":200,"enName":"Gan Pung Chicken"},"깐풍새우":{"kcal":350,"carb":26,"pro":15,"fat":21,"portionG":200,"enName":"Gan Pung Shrimp"},"깻잎무침":{"kcal":25,"carb":3,"pro":1.5,"fat":0.8,"portionG":30,"enName":"Seasoned Perilla Leaves"},"깻잎장아찌":{"kcal":30,"carb":5,"pro":1,"fat":0.5,"portionG":30,"enName":"Pickled Perilla Leaves"},"껌가":{"kcal":510,"carb":70,"pro":28,"fat":13,"portionG":350,"enName":"Cơm gà"},"껌땀":{"kcal":590,"carb":75,"pro":32,"fat":18,"portionG":400,"enName":"Cơm tấm"},"껌스엉":{"kcal":570,"carb":72,"pro":30,"fat":18,"portionG":380,"enName":"Cơm sườn"},"껌찌엔":{"kcal":440,"carb":68,"pro":14,"fat":12,"portionG":300,"enName":"Cơm Chiên"},"꼬리곰탕":{"kcal":320,"carb":4,"pro":34,"fat":19,"portionG":500,"enName":"Oxtail Soup"},"꽁치김치찌개":{"kcal":290,"carb":9,"pro":24,"fat":17,"portionG":400,"enName":"Saury and Kimchi Stew"},"꽁치조림":{"kcal":280,"carb":10,"pro":22,"fat":16,"portionG":250,"enName":"Braised Saury"},"꽃게탕":{"kcal":210,"carb":12,"pro":24,"fat":7,"portionG":500,"enName":"Blue Crab Soup"},"꽃빵고추잡채":{"kcal":360,"carb":45,"pro":18,"fat":12,"portionG":250,"enName":"Flower Bun with Pepper Japchae"},"꾸아이티아오":{"kcal":420,"carb":78,"pro":16,"fat":5,"portionG":500,"enName":"Kuay Teow (Thai Noodle Soup)"},"꿔바로우":{"kcal":480,"carb":42,"pro":16,"fat":28,"portionG":200,"enName":"Guo Bao Rou (Sweet and Sour Pork)"},"나베":{"kcal":310,"carb":10,"pro":28,"fat":17,"portionG":400,"enName":"Nabe (Japanese Hot Pot)"},"나베야키우동":{"kcal":460,"carb":82,"pro":16,"fat":7,"portionG":500,"enName":"Nabeyaki Udon"},"나시고랭":{"kcal":460,"carb":68,"pro":15,"fat":14,"portionG":300,"enName":"Nasi Goreng"},"나시르막":{"kcal":580,"carb":75,"pro":16,"fat":24,"portionG":350,"enName":"Nasi Lemak"},"나시 미냑":{"kcal":490,"carb":70,"pro":10,"fat":19,"portionG":300,"enName":"Nasi Minyak (Fragrant Butter Rice)"},"나시빠당":{"kcal":620,"carb":72,"pro":26,"fat":25,"portionG":400,"enName":"Nasi Padang"},"나시우둑":{"kcal":440,"carb":68,"pro":9,"fat":14,"portionG":300,"enName":"Nasi Uduk"},"나시 참푸르":{"kcal":530,"carb":70,"pro":24,"fat":17,"portionG":350,"enName":"Nasi Jambal"},"나초":{"kcal":250,"carb":32,"pro":4,"fat":12,"portionG":50,"enName":"Nachos"},"나폴리탄":{"kcal":520,"carb":75,"pro":14,"fat":18,"portionG":350,"enName":"Napolitan (Ketchup Spaghetti)"},"낙지덮밥":{"kcal":490,"carb":82,"pro":22,"fat":8,"portionG":400,"enName":"Spicy Octopus Rice Bowl"},"낙지볶음":{"kcal":190,"carb":14,"pro":20,"fat":6,"portionG":200,"enName":"Stir-fried Spicy Octopus"},"낙지연포탕":{"kcal":130,"carb":8,"pro":18,"fat":3,"portionG":500,"enName":"Octopus Hot Pot"},"난자완스":{"kcal":340,"carb":14,"pro":22,"fat":22,"portionG":200,"enName":"Nanjing Meatballs"},"냉이된장국":{"kcal":60,"carb":6,"pro":4,"fat":2,"portionG":300,"enName":"Shepherd's Purse Doenjang Soup"},"냉이무침":{"kcal":40,"carb":4,"pro":2,"fat":1.8,"portionG":50,"enName":"Seasoned Shepherd's Purse"},"너비아니":{"kcal":320,"carb":10,"pro":24,"fat":20,"portionG":150,"enName":"Neobiani (Marinated Beef)"},"넴느엉 꾸온":{"kcal":240,"carb":28,"pro":16,"fat":7,"portionG":180,"enName":"Nem Nuong Cuon"},"넴 루이":{"kcal":290,"carb":8,"pro":20,"fat":20,"portionG":150,"enName":"Nem Lui (Vietnamese Lemongrass Pork Skewers)"},"녹두전":{"kcal":280,"carb":32,"pro":10,"fat":12,"portionG":150,"enName":"Mung Bean Pancake"},"뇨냐 커리":{"kcal":390,"carb":16,"pro":22,"fat":27,"portionG":300,"enName":"Nonya Curry"},"뇨키":{"kcal":320,"carb":52,"pro":7,"fat":10,"portionG":200,"enName":"Gnocchi"},"뇨키토마토":{"kcal":380,"carb":56,"pro":9,"fat":13,"portionG":300,"enName":"Gnocchi with Tomato Sauce"},"느타리버섯볶음":{"kcal":60,"carb":5,"pro":2,"fat":3.8,"portionG":80,"enName":"Stir-fried Oyster Mushrooms"},"닐라가":{"kcal":280,"carb":12,"pro":26,"fat":14,"portionG":400,"enName":"Nilaga (Filipino Boiled Beef)"},"니스와즈 샐러드":{"kcal":220,"carb":10,"pro":14,"fat":14,"portionG":250,"enName":"Niçoise Salad"},"니스 스타일 피자":{"kcal":390,"carb":40,"pro":14,"fat":19,"portionG":150,"enName":"Nice-style Pizza (Pissaladière)"},"니쿠우동":{"kcal":490,"carb":80,"pro":22,"fat":9,"portionG":500,"enName":"Niku Udon (Beef Udon)"},"니쿠자가":{"kcal":260,"carb":24,"pro":14,"fat":12,"portionG":250,"enName":"Nikujaga (Meat and Potato Stew)"},"다코라이스":{"kcal":510,"carb":70,"pro":22,"fat":15,"portionG":350,"enName":"Taco Rice"},"단호박수프":{"kcal":160,"carb":26,"pro":3,"fat":5,"portionG":250,"enName":"Butternut Squash Soup"},"달 마카니":{"kcal":280,"carb":28,"pro":10,"fat":14,"portionG":250,"enName":"Makhani Dal"},"달 채소 카레":{"kcal":210,"carb":26,"pro":8,"fat":8,"portionG":250,"enName":"Lentil Vegetable Curry"},"달 커리":{"kcal":190,"carb":24,"pro":9,"fat":6,"portionG":250,"enName":"Dal Curry"},"달 타르카":{"kcal":220,"carb":25,"pro":10,"fat":9,"portionG":250,"enName":"Dal Tadka"},"닭가슴살랩":{"kcal":320,"carb":26,"pro":26,"fat":12,"portionG":200,"enName":"Chicken Breast Wrap"},"닭가슴살샐러드":{"kcal":185,"carb":8,"pro":24,"fat":6,"portionG":250,"enName":"Chicken Breast Salad"},"닭가슴살요거트볼":{"kcal":240,"carb":22,"pro":20,"fat":7,"portionG":250,"enName":"Chicken Breast Yogurt Bowl"},"닭가슴살채소볶음":{"kcal":210,"carb":10,"pro":26,"fat":7,"portionG":200,"enName":"Chicken Breast and Vegetable Stir-fry"},"닭가슴살채소볶음밥":{"kcal":410,"carb":65,"pro":24,"fat":6,"portionG":300,"enName":"Chicken Breast Vegetable Fried Rice"},"닭가슴살카레":{"kcal":340,"carb":42,"pro":25,"fat":8,"portionG":300,"enName":"Chicken Breast Curry"},"닭가슴살현미볼":{"kcal":290,"carb":38,"pro":22,"fat":5,"portionG":200,"enName":"Chicken Breast Brown Rice Bowl"},"닭갈비":{"kcal":390,"carb":16,"pro":32,"fat":22,"portionG":250,"enName":"Dakgalbi (Spicy Stir-fried Chicken)"},"닭강정":{"kcal":540,"carb":45,"pro":24,"fat":30,"portionG":200,"enName":"Sweet Crispy Fried Chicken"},"닭개장":{"kcal":260,"carb":10,"pro":28,"fat":12,"portionG":500,"enName":"Spicy Chicken Soup"},"닭고기구이":{"kcal":240,"carb":1,"pro":28,"fat":14,"portionG":150,"enName":"Grilled Chicken"},"닭고기캐슈넛볶음":{"kcal":380,"carb":16,"pro":24,"fat":24,"portionG":200,"enName":"Chicken and Cashew Nut Stir-fry"},"닭곰탕":{"kcal":190,"carb":4,"pro":28,"fat":7,"portionG":500,"enName":"Chicken Broth Soup"},"닭볶음":{"kcal":280,"carb":10,"pro":26,"fat":15,"portionG":200,"enName":"Stir-fried Chicken"},"닭볶음탕":{"kcal":370,"carb":16,"pro":34,"fat":19,"portionG":350,"enName":"Braised Spicy Chicken"},"닭비빔막국수":{"kcal":540,"carb":84,"pro":24,"fat":12,"portionG":450,"enName":"Chicken Bibim Makguksu"},"닭육수면":{"kcal":430,"carb":75,"pro":20,"fat":5,"portionG":500,"enName":"Chicken Broth Noodles"},"닭죽":{"kcal":280,"carb":44,"pro":15,"fat":5,"portionG":350,"enName":"Chicken Porridge"},"닭한마리":{"kcal":340,"carb":12,"pro":38,"fat":15,"portionG":500,"enName":"Whole Chicken Hot Pot"},"대패삼겹살구이":{"kcal":490,"carb":1,"pro":22,"fat":45,"portionG":150,"enName":"Thinly Sliced Grilled Pork Belly"},"더덕구이":{"kcal":110,"carb":18,"pro":2,"fat":3.5,"portionG":100,"enName":"Grilled Deodeok Root"},"데리야키치킨":{"kcal":310,"carb":12,"pro":28,"fat":16,"portionG":180,"enName":"Teriyaki Chicken"},"도라지무침":{"kcal":65,"carb":12,"pro":1.5,"fat":1,"portionG":80,"enName":"Seasoned Bellflower Root"},"도사":{"kcal":290,"carb":48,"pro":6,"fat":8,"portionG":150,"enName":"Dosa"},"도토리묵무침":{"kcal":120,"carb":14,"pro":2,"fat":6,"portionG":200,"enName":"Seasoned Acorn Jelly"},"돈지루":{"kcal":180,"carb":8,"pro":12,"fat":11,"portionG":300,"enName":"Tonjiru (Pork Miso Soup)"},"돈카츠":{"kcal":410,"carb":18,"pro":24,"fat":28,"portionG":150,"enName":"Tonkatsu (Pork Cutlet)"},"돈코츠라멘":{"kcal":620,"carb":76,"pro":26,"fat":24,"portionG":600,"enName":"Tonkotsu Ramen"},"돌마데스":{"kcal":180,"carb":18,"pro":6,"fat":9,"portionG":150,"enName":"Dolmades"},"돌솥비빔밥":{"kcal":560,"carb":85,"pro":18,"fat":16,"portionG":450,"enName":"Stone Pot Bibimbap"},"동그랑땡":{"kcal":230,"carb":8,"pro":14,"fat":16,"portionG":120,"enName":"Pan-fried Meat and Tofu Patties"},"동태전":{"kcal":210,"carb":7,"pro":16,"fat":13,"portionG":120,"enName":"Pollock Pancake"},"동태찌개":{"kcal":160,"carb":8,"pro":20,"fat":5,"portionG":400,"enName":"Pollock Stew"},"동파육":{"kcal":510,"carb":8,"pro":22,"fat":44,"portionG":200,"enName":"Dongpo Pork (Braised Pork Belly)"},"돼지갈비찜":{"kcal":430,"carb":14,"pro":28,"fat":29,"portionG":250,"enName":"Braised Pork Ribs"},"돼지고기김치찌개":{"kcal":240,"carb":7,"pro":18,"fat":15,"portionG":400,"enName":"Pork and Kimchi Stew"},"돼지고기깻잎볶음":{"kcal":340,"carb":10,"pro":25,"fat":22,"portionG":200,"enName":"Stir-fried Pork with Perilla Leaves"},"돼지국밥":{"kcal":450,"carb":45,"pro":28,"fat":18,"portionG":600,"enName":"Pork Rice Soup"},"돼지불고기":{"kcal":320,"carb":12,"pro":24,"fat":19,"portionG":200,"enName":"Pork Bulgogi"},"된장비빔밥":{"kcal":460,"carb":76,"pro":15,"fat":10,"portionG":400,"enName":"Doenjang Bibimbap"},"된장삼겹살":{"kcal":480,"carb":4,"pro":22,"fat":42,"portionG":150,"enName":"Doenjang Pork Belly"},"된장찌개":{"kcal":130,"carb":9,"pro":9,"fat":6,"portionG":300,"enName":"Doenjang Stew (Fermented Soybean Paste Stew)"},"두루치기":{"kcal":350,"carb":11,"pro":24,"fat":23,"portionG":200,"enName":"Duruchigi (Stir-fried Pork)"},"두부김치":{"kcal":220,"carb":10,"pro":16,"fat":13,"portionG":250,"enName":"Tofu with Kimchi"},"두부미역국":{"kcal":75,"carb":4,"pro":6,"fat":4,"portionG":300,"enName":"Tofu and Seaweed Soup"},"두부버섯솥밥":{"kcal":410,"carb":72,"pro":14,"fat":7,"portionG":350,"enName":"Tofu and Mushroom Pot Rice"},"두부부침":{"kcal":140,"carb":3,"pro":10,"fat":10,"portionG":120,"enName":"Pan-fried Tofu"},"두부샐러드":{"kcal":130,"carb":8,"pro":9,"fat":7,"portionG":200,"enName":"Tofu Salad"},"두부스크램블에그":{"kcal":145,"carb":3,"pro":11,"fat":10,"portionG":150,"enName":"Tofu Scrambled Eggs"},"두부스테이크":{"kcal":180,"carb":10,"pro":12,"fat":10,"portionG":150,"enName":"Tofu Steak"},"두부스테이크테리야키":{"kcal":215,"carb":16,"pro":13,"fat":11,"portionG":180,"enName":"Tofu Steak Teriyaki"},"두부조림":{"kcal":150,"carb":7,"pro":11,"fat":8,"portionG":150,"enName":"Braised Tofu"},"두부채소볶음":{"kcal":140,"carb":8,"pro":10,"fat":8,"portionG":200,"enName":"Tofu and Vegetable Stir-fry"},"두부포케":{"kcal":390,"carb":54,"pro":15,"fat":12,"portionG":350,"enName":"Tofu Poke Bowl"},"두부현미볼":{"kcal":280,"carb":42,"pro":12,"fat":7,"portionG":200,"enName":"Tofu Brown Rice Bowl"},"들기름막국수":{"kcal":460,"carb":75,"pro":11,"fat":13,"portionG":350,"enName":"Perilla Oil Makguksu"},"들깨미역국":{"kcal":95,"carb":5,"pro":4,"fat":7,"portionG":300,"enName":"Perilla Seed and Seaweed Soup"},"들깨순두부찌개":{"kcal":180,"carb":8,"pro":12,"fat":11,"portionG":350,"enName":"Perilla Seed Soft Tofu Stew"},"들깨칼국수":{"kcal":480,"carb":78,"pro":13,"fat":12,"portionG":500,"enName":"Perilla Seed Knife-cut Noodle Soup"},"등갈비김치찜":{"kcal":420,"carb":11,"pro":32,"fat":27,"portionG":350,"enName":"Braised Back Ribs with Kimchi"},"등갈비찜":{"kcal":410,"carb":12,"pro":30,"fat":26,"portionG":300,"enName":"Braised Pork Back Ribs"},"딤섬":{"kcal":160,"carb":18,"pro":8,"fat":6,"portionG":90,"enName":"Dim Sum"},"떡갈비":{"kcal":320,"carb":14,"pro":22,"fat":20,"portionG":150,"enName":"Tteokgalbi (Grilled Meat Patties)"},"떡국":{"kcal":430,"carb":78,"pro":16,"fat":6,"portionG":500,"enName":"Tteokguk (Rice Cake Soup)"},"떡만두국":{"kcal":490,"carb":82,"pro":19,"fat":10,"portionG":550,"enName":"Rice Cake and Dumpling Soup"},"떡볶이":{"kcal":360,"carb":70,"pro":7,"fat":5,"portionG":250,"enName":"Tteokbokki (Spicy Rice Cakes)"},"토르티야 에스파뇰라":{"kcal":280,"carb":16,"pro":12,"fat":18,"portionG":200,"enName":"Tortilla Española (Spanish Omelette)"},"똠얌꿍":{"kcal":180,"carb":10,"pro":18,"fat":8,"portionG":400,"enName":"Tom Yum Kung"},"똠카가이":{"kcal":290,"carb":12,"pro":20,"fat":18,"portionG":400,"enName":"Tom Kha Gai"},"뚝배기불고기":{"kcal":390,"carb":22,"pro":28,"fat":21,"portionG":450,"enName":"Ttukbaegi Bulgogi (Hot Pot Bulgogi)"},"라따뚜이":{"kcal":130,"carb":14,"pro":3,"fat":7,"portionG":200,"enName":"Ratatouille"},"라브 무":{"kcal":240,"carb":6,"pro":22,"fat":14,"portionG":150,"enName":"Larb Moo"},"라볶이":{"kcal":450,"carb":85,"pro":10,"fat":7,"portionG":300,"enName":"Rabokki (Ramen and Tteokbokki)"},"라브 가이":{"kcal":210,"carb":5,"pro":24,"fat":10,"portionG":150,"enName":"Larb Gai (Thai Spicy Chicken Salad)"},"라이타":{"kcal":80,"carb":6,"pro":4,"fat":4,"portionG":120,"enName":"Raita"},"라자냐":{"kcal":480,"carb":36,"pro":26,"fat":25,"portionG":300,"enName":"Lasagna"},"라조기":{"kcal":420,"carb":24,"pro":22,"fat":26,"portionG":200,"enName":"Laziji (Sichuan Spicy Chicken)"},"라지마":{"kcal":230,"carb":32,"pro":11,"fat":6,"portionG":250,"enName":"Rajma (Red Kidney Bean Curry)"},"라페토":{"kcal":190,"carb":8,"pro":16,"fat":11,"portionG":150,"enName":"Laphet Thoke (Fermented Tea Leaf Salad)"},"라흐마준":{"kcal":380,"carb":42,"pro":18,"fat":15,"portionG":200,"enName":"Lahmacun (Turkish Pizza)"},"락사":{"kcal":520,"carb":68,"pro":22,"fat":18,"portionG":500,"enName":"Laksa"},"램 코르마":{"kcal":460,"carb":14,"pro":28,"fat":32,"portionG":300,"enName":"Lamb Korma"},"레드커리":{"kcal":380,"carb":15,"pro":18,"fat":26,"portionG":300,"enName":"Red Curry"},"르막 캄빙":{"kcal":490,"carb":12,"pro":26,"fat":37,"portionG":300,"enName":"Lemak Kambing (Goat Coconut Curry)"},"치킨 타욱":{"kcal":290,"carb":6,"pro":28,"fat":12,"portionG":180,"enName":"Lebanese Tawook"},"레촌카왈리":{"kcal":510,"carb":1,"pro":20,"fat":48,"portionG":150,"enName":"Lechon Kawali (Filipino Crispy Pork)"},"렌당":{"kcal":430,"carb":10,"pro":28,"fat":30,"portionG":250,"enName":"Rendang"},"렌틸수프":{"kcal":160,"carb":24,"pro":9,"fat":3,"portionG":250,"enName":"Lentil Soup"},"렌틸콩샐러드":{"kcal":180,"carb":22,"pro":8,"fat":6,"portionG":200,"enName":"Lentil Salad"},"로간 조쉬":{"kcal":420,"carb":12,"pro":28,"fat":28,"portionG":300,"enName":"Rogan Josh"},"로모 살타도":{"kcal":410,"carb":34,"pro":26,"fat":16,"portionG":300,"enName":"Lomo Saltado"},"로미에":{"kcal":390,"carb":65,"pro":16,"fat":7,"portionG":450,"enName":"Lomi (Filipino Noodle Soup)"},"로스트치킨":{"kcal":320,"carb":0,"pro":34,"fat":16,"portionG":200,"enName":"Roast Chicken"},"로제파스타":{"kcal":540,"carb":70,"pro":15,"fat":22,"portionG":350,"enName":"Rose Pasta (Creamy Tomato Pasta)"},"로티 차나이":{"kcal":310,"carb":36,"pro":6,"fat":15,"portionG":150,"enName":"Roti Canai"},"보 룩락":{"kcal":380,"carb":14,"pro":28,"fat":22,"portionG":250,"enName":"Bò Lúc Lắc (Vietnamese Shaking Beef)"},"롱가니사볶음밥":{"kcal":480,"carb":66,"pro":15,"fat":17,"portionG":300,"enName":"Longganisa Fried Rice"},"롱통":{"kcal":340,"carb":48,"pro":10,"fat":12,"portionG":350,"enName":"Lontong"},"룸피아":{"kcal":240,"carb":22,"pro":10,"fat":12,"portionG":120,"enName":"Lumpia (Filipino Spring Rolls)"},"리가토니 알라 보드카":{"kcal":510,"carb":68,"pro":14,"fat":19,"portionG":350,"enName":"Rigatoni alla Vodka"},"리볼리타":{"kcal":210,"carb":28,"pro":8,"fat":7,"portionG":350,"enName":"Ribollita"},"리조또":{"kcal":410,"carb":62,"pro":11,"fat":13,"portionG":300,"enName":"Risotto"},"립아이 스테이크":{"kcal":460,"carb":0,"pro":38,"fat":34,"portionG":200,"enName":"Ribeye Steak"},"마늘새우볶음":{"kcal":230,"carb":6,"pro":18,"fat":15,"portionG":150,"enName":"Garlic Shrimp Stir-fry"},"마늘종볶음":{"kcal":50,"carb":6,"pro":1,"fat":2.5,"portionG":60,"enName":"Stir-fried Garlic Scapes"},"마라두부":{"kcal":280,"carb":12,"pro":14,"fat":20,"portionG":250,"enName":"Mala Tofu"},"마라라면":{"kcal":540,"carb":78,"pro":11,"fat":20,"portionG":500,"enName":"Mala Ramen"},"마라샹궈":{"kcal":480,"carb":18,"pro":24,"fat":36,"portionG":300,"enName":"Mala Xiangguo (Mala Dry Pot)"},"마라탕":{"kcal":420,"carb":25,"pro":22,"fat":26,"portionG":500,"enName":"Mala Tang (Spicy Hot Pot)"},"마르게리타피자":{"kcal":430,"carb":48,"pro":16,"fat":19,"portionG":180,"enName":"Margherita Pizza"},"마삭 메라":{"kcal":390,"carb":14,"pro":26,"fat":25,"portionG":250,"enName":"Masak Merah (Red Cooked Chicken)"},"마싸만 커리":{"kcal":420,"carb":18,"pro":20,"fat":30,"portionG":300,"enName":"Massaman Curry"},"마제소바":{"kcal":580,"carb":82,"pro":21,"fat":18,"portionG":400,"enName":"Mazesoba (Mixed Noodles)"},"마카로니샐러드":{"kcal":220,"carb":18,"pro":3,"fat":15,"portionG":100,"enName":"Macaroni Salad"},"마크부스":{"kcal":520,"carb":72,"pro":26,"fat":14,"portionG":350,"enName":"Machboos (Spiced Meat and Rice)"},"마클루베":{"kcal":540,"carb":75,"pro":24,"fat":16,"portionG":350,"enName":"Maqluba (Upside-down Rice)"},"마파가지":{"kcal":190,"carb":14,"pro":4,"fat":14,"portionG":200,"enName":"Mapo Eggplant"},"마파두부":{"kcal":240,"carb":10,"pro":14,"fat":16,"portionG":250,"enName":"Mapo Tofu"},"마파두부덮밥":{"kcal":490,"carb":75,"pro":19,"fat":18,"portionG":400,"enName":"Mapo Tofu Rice Bowl"},"막국수":{"kcal":460,"carb":85,"pro":12,"fat":6,"portionG":450,"enName":"Makguksu (Buckwheat Noodles)"},"만사프":{"kcal":640,"carb":78,"pro":34,"fat":22,"portionG":400,"enName":"Mansaf (Jordanian Lamb and Rice)"},"만트":{"kcal":290,"carb":36,"pro":12,"fat":10,"portionG":150,"enName":"Manti (Central Asian Dumplings)"},"말라이 코프타":{"kcal":320,"carb":24,"pro":8,"fat":21,"portionG":250,"enName":"Malai Kofta"},"망고 스티키 라이스":{"kcal":360,"carb":72,"pro":4,"fat":6,"portionG":200,"enName":"Mango Sticky Rice"},"매시드포테이토":{"kcal":160,"carb":18,"pro":2,"fat":9,"portionG":150,"enName":"Mashed Potatoes"},"매운탕":{"kcal":210,"carb":10,"pro":26,"fat":7,"portionG":500,"enName":"Spicy Fish Stew"},"무자다라":{"kcal":380,"carb":68,"pro":11,"fat":7,"portionG":300,"enName":"Mujaddara (Lentil and Rice)"},"메네멘":{"kcal":210,"carb":8,"pro":12,"fat":14,"portionG":200,"enName":"Menemen (Turkish Egg and Tomato)"},"메르지메크 초르바":{"kcal":140,"carb":20,"pro":8,"fat":3,"portionG":250,"enName":"Mercimek Çorbası (Turkish Lentil Soup)"},"메밀소바샐러드":{"kcal":290,"carb":54,"pro":9,"fat":4,"portionG":300,"enName":"Soba Noodle Salad"},"메추리알장조림":{"kcal":95,"carb":5,"pro":9,"fat":4.5,"portionG":80,"enName":"Braised Quail Eggs"},"멕시칸라이스":{"kcal":420,"carb":72,"pro":9,"fat":10,"portionG":300,"enName":"Mexican Rice"},"타말레":{"kcal":280,"carb":28,"pro":9,"fat":15,"portionG":180,"enName":"Tamale"},"멕시코 콩 스튜":{"kcal":220,"carb":34,"pro":11,"fat":4,"portionG":300,"enName":"Mexican Bean Stew"},"멘보샤":{"kcal":340,"carb":20,"pro":8,"fat":25,"portionG":100,"enName":"Menbosha (Shrimp Toast)"},"멘치카츠":{"kcal":390,"carb":22,"pro":16,"fat":26,"portionG":150,"enName":"Menchi Katsu (Ground Meat Cutlet)"},"멸치볶음":{"kcal":70,"carb":4,"pro":5,"fat":3.5,"portionG":30,"enName":"Stir-fried Dried Anchovies"},"명란 오니기리":{"kcal":260,"carb":48,"pro":7,"fat":4,"portionG":150,"enName":"Mentaiko Onigiri"},"모야시라멘":{"kcal":440,"carb":72,"pro":14,"fat":10,"portionG":500,"enName":"Moyashi Ramen (Bean Sprout Ramen)"},"모힝가":{"kcal":360,"carb":58,"pro":18,"fat":6,"portionG":450,"enName":"Mohinga (Myanmar Fish Noodle Soup)"},"목살구이":{"kcal":290,"carb":0,"pro":28,"fat":19,"portionG":150,"enName":"Grilled Pork Neck"},"무나물":{"kcal":35,"carb":4,"pro":0.8,"fat":1.8,"portionG":60,"enName":"Seasoned Radish"},"무사카":{"kcal":380,"carb":22,"pro":20,"fat":24,"portionG":300,"enName":"Moussaka"},"무생채":{"kcal":25,"carb":4,"pro":0.5,"fat":0.2,"portionG":60,"enName":"Spicy Radish Salad"},"무이판":{"kcal":460,"carb":70,"pro":14,"fat":13,"portionG":300,"enName":"Mui Fan (Cantonese Sauce Rice)"},"무조림":{"kcal":60,"carb":9,"pro":1,"fat":2.2,"portionG":100,"enName":"Braised Radish"},"무채국":{"kcal":450,"carb":4,"pro":3,"fat":2,"portionG":300,"enName":"Shredded Radish Soup"},"모케카":{"kcal":360,"carb":12,"pro":24,"fat":24,"portionG":350,"enName":"Moqueca (Brazilian Fish Stew)"},"묵사발":{"kcal":140,"carb":24,"pro":4,"fat":3,"portionG":400,"enName":"Muk Sabal (Jelly in Broth)"},"묵은지등갈비찜":{"kcal":440,"carb":12,"pro":32,"fat":29,"portionG":350,"enName":"Braised Back Ribs with Aged Kimchi"},"묵은지삼겹살":{"kcal":540,"carb":6,"pro":22,"fat":48,"portionG":250,"enName":"Aged Kimchi Pork Belly"},"물냉면":{"kcal":380,"carb":82,"pro":11,"fat":2,"portionG":550,"enName":"Mul Naengmyeon (Cold Noodles in Broth)"},"물만두":{"kcal":210,"carb":22,"pro":9,"fat":9,"portionG":120,"enName":"Boiled Dumplings"},"미고랭":{"kcal":480,"carb":72,"pro":11,"fat":16,"portionG":300,"enName":"Mi Goreng"},"미고랭 말레이":{"kcal":490,"carb":70,"pro":13,"fat":17,"portionG":300,"enName":"Mee Goreng Mamak"},"미고렝 마막":{"kcal":510,"carb":68,"pro":15,"fat":20,"portionG":300,"enName":"Mee Goreng Mamak"},"미꽝":{"kcal":420,"carb":65,"pro":18,"fat":10,"portionG":450,"enName":"Mi Quang (Vietnamese Turmeric Noodles)"},"미네스트로네 수프":{"kcal":120,"carb":18,"pro":4,"fat":3.5,"portionG":250,"enName":"Minestrone"},"미소국":{"kcal":40,"carb":4,"pro":3,"fat":1,"portionG":200,"enName":"Miso Soup"},"미소라멘":{"kcal":520,"carb":75,"pro":18,"fat":16,"portionG":500,"enName":"Miso Ramen"},"미소버터라멘":{"kcal":590,"carb":76,"pro":19,"fat":23,"portionG":520,"enName":"Miso Butter Ramen"},"미소시루":{"kcal":40,"carb":4,"pro":3,"fat":1,"portionG":200,"enName":"Miso Shiru"},"미시암":{"kcal":430,"carb":68,"pro":15,"fat":11,"portionG":350,"enName":"Mee Siam"},"미싸오":{"kcal":460,"carb":65,"pro":14,"fat":16,"portionG":300,"enName":"Mee Sao (Crispy Noodles)"},"미역국":{"kcal":65,"carb":3,"pro":4,"fat":4.5,"portionG":300,"enName":"Seaweed Soup"},"미역냉국":{"kcal":35,"carb":6,"pro":1,"fat":0.5,"portionG":300,"enName":"Cold Seaweed Soup"},"미역줄기볶음":{"kcal":45,"carb":4,"pro":1.2,"fat":2.8,"portionG":60,"enName":"Stir-fried Seaweed Stems"},"미트볼":{"kcal":290,"carb":10,"pro":18,"fat":20,"portionG":150,"enName":"Meatballs"},"미트볼스파게티":{"kcal":580,"carb":75,"pro":24,"fat":20,"portionG":400,"enName":"Meatball Spaghetti"},"미트볼파스타":{"kcal":580,"carb":75,"pro":24,"fat":20,"portionG":400,"enName":"Meatball Pasta"},"미폭":{"kcal":410,"carb":62,"pro":16,"fat":11,"portionG":450,"enName":"Mi Pok Noodles (Singapore Dry Noodles)"},"바바 가누쉬":{"kcal":140,"carb":8,"pro":2,"fat":11,"portionG":100,"enName":"Baba Ganoush"},"바스틸라":{"kcal":420,"carb":45,"pro":18,"fat":18,"portionG":200,"enName":"Bastilla (Moroccan Pigeon Pie)"},"바오즈":{"kcal":340,"carb":48,"pro":12,"fat":11,"portionG":160,"enName":"Baozi (Steamed Buns)"},"바지락칼국수":{"kcal":460,"carb":82,"pro":15,"fat":4,"portionG":500,"enName":"Clam Knife-cut Noodle Soup"},"바지락탕":{"kcal":70,"carb":3,"pro":10,"fat":1.5,"portionG":400,"enName":"Clam Soup"},"바질페스토파스타":{"kcal":490,"carb":65,"pro":11,"fat":21,"portionG":320,"enName":"Basil Pesto Pasta"},"바쿠테":{"kcal":390,"carb":6,"pro":34,"fat":26,"portionG":450,"enName":"Bak Kut Teh (Pork Rib Soup)"},"박소":{"kcal":360,"carb":42,"pro":18,"fat":13,"portionG":400,"enName":"Bak So"},"반꾸온":{"kcal":280,"carb":42,"pro":10,"fat":8,"portionG":200,"enName":"Banh Cuon (Vietnamese Steamed Rice Rolls)"},"반미":{"kcal":430,"carb":54,"pro":16,"fat":16,"portionG":200,"enName":"Banh Mi"},"반 보 팟 찬":{"kcal":420,"carb":65,"pro":22,"fat":8,"portionG":350,"enName":"Banh Bo Phong Chien (Vietnamese Honeycomb Cake)"},"반쎄오":{"kcal":390,"carb":44,"pro":14,"fat":17,"portionG":250,"enName":"Banh Xeo (Vietnamese Sizzling Crepe)"},"반 팃 느엉":{"kcal":490,"carb":68,"pro":22,"fat":14,"portionG":380,"enName":"Banh Thit Nuong (Vietnamese Grilled Pork Sandwich)"},"배추된장국":{"kcal":55,"carb":7,"pro":3.5,"fat":1.5,"portionG":300,"enName":"Napa Cabbage Doenjang Soup"},"배추전":{"kcal":190,"carb":24,"pro":3,"fat":9,"portionG":150,"enName":"Napa Cabbage Pancake"},"버섯굴소스볶음":{"kcal":85,"carb":8,"pro":3,"fat":4.5,"portionG":120,"enName":"Mushroom and Oyster Sauce Stir-fry"},"버섯리조또":{"kcal":390,"carb":58,"pro":10,"fat":13,"portionG":300,"enName":"Mushroom Risotto"},"버섯 벨루테":{"kcal":160,"carb":14,"pro":4,"fat":10,"portionG":250,"enName":"Mushroom Velouté"},"버섯볶음":{"kcal":55,"carb":4,"pro":2,"fat":3.5,"portionG":80,"enName":"Stir-fried Mushrooms"},"버섯솥밥":{"kcal":390,"carb":74,"pro":9,"fat":6,"portionG":350,"enName":"Mushroom Pot Rice"},"버섯전":{"kcal":170,"carb":16,"pro":4,"fat":10,"portionG":120,"enName":"Mushroom Pancake"},"버섯크림리조또":{"kcal":450,"carb":58,"pro":11,"fat":19,"portionG":320,"enName":"Mushroom Cream Risotto"},"버터 세이지 뇨키":{"kcal":380,"carb":48,"pro":6,"fat":18,"portionG":220,"enName":"Butter Sage Gnocchi"},"버터치킨":{"kcal":390,"carb":12,"pro":24,"fat":27,"portionG":250,"enName":"Butter Chicken"},"버터치킨커리":{"kcal":390,"carb":12,"pro":24,"fat":27,"portionG":250,"enName":"Butter Chicken Curry"},"베이징덕":{"kcal":410,"carb":2,"pro":26,"fat":34,"portionG":150,"enName":"Peking Duck"},"베이컨에그스크램블":{"kcal":280,"carb":2,"pro":16,"fat":23,"portionG":150,"enName":"Bacon and Egg Scramble"},"병아리콩 샐러드":{"kcal":190,"carb":22,"pro":8,"fat":8,"portionG":200,"enName":"Chickpea Salad"},"보렉":{"kcal":340,"carb":38,"pro":10,"fat":16,"portionG":150,"enName":"Börek (Turkish Pastry)"},"보비아":{"kcal":210,"carb":26,"pro":8,"fat":8,"portionG":150,"enName":"Bo Bia (Vietnamese Rice Paper Rolls)"},"보쌈":{"kcal":520,"carb":2,"pro":28,"fat":45,"portionG":250,"enName":"Bossam (Steamed Pork Wraps)"},"보코":{"kcal":390,"carb":16,"pro":28,"fat":24,"portionG":350,"enName":"Boko"},"볶음짬뽕":{"kcal":580,"carb":84,"pro":24,"fat":16,"portionG":450,"enName":"Stir-fried Jjamppong"},"볼로네제파스타":{"kcal":540,"carb":70,"pro":22,"fat":19,"portionG":380,"enName":"Bolognese Pasta"},"봉골레파스타":{"kcal":470,"carb":66,"pro":16,"fat":15,"portionG":350,"enName":"Vongole Pasta (Clam Pasta)"},"뵈프엔다우브":{"kcal":360,"carb":12,"pro":28,"fat":22,"portionG":300,"enName":"Boeuf en Daube (French Beef Stew)"},"부대찌개":{"kcal":340,"carb":12,"pro":20,"fat":24,"portionG":450,"enName":"Budae Jjigae (Army Stew)"},"부리또":{"kcal":540,"carb":58,"pro":24,"fat":23,"portionG":300,"enName":"Burrito"},"부야베스":{"kcal":260,"carb":14,"pro":28,"fat":10,"portionG":450,"enName":"Bouillabaisse"},"부채살스테이크":{"kcal":390,"carb":0,"pro":38,"fat":26,"portionG":200,"enName":"Flat Iron Steak"},"부추계란볶음":{"kcal":165,"carb":4,"pro":10,"fat":12,"portionG":150,"enName":"Chive and Egg Stir-fry"},"부추김치":{"kcal":25,"carb":4,"pro":1,"fat":0.2,"portionG":50,"enName":"Chive Kimchi"},"부추전":{"kcal":220,"carb":32,"pro":4,"fat":8.5,"portionG":150,"enName":"Chive Pancake"},"부타네기야키":{"kcal":320,"carb":6,"pro":22,"fat":23,"portionG":180,"enName":"Buta Negi Yaki (Pork and Green Onion Grill)"},"부타네기폰즈":{"kcal":290,"carb":5,"pro":22,"fat":20,"portionG":180,"enName":"Buta Negi Ponzu"},"부타동":{"kcal":580,"carb":76,"pro":24,"fat":20,"portionG":400,"enName":"Butadon (Pork Rice Bowl)"},"부타카쿠니":{"kcal":460,"carb":10,"pro":22,"fat":38,"portionG":200,"enName":"Buta Kakuni (Braised Pork Belly)"},"부타킴치":{"kcal":320,"carb":8,"pro":21,"fat":22,"portionG":200,"enName":"Buta Kimchi (Pork and Kimchi Stir-fry)"},"북어국":{"kcal":90,"carb":2,"pro":12,"fat":3.8,"portionG":300,"enName":"Dried Pollack Soup"},"북어무침":{"kcal":85,"carb":8,"pro":11,"fat":1,"portionG":60,"enName":"Seasoned Dried Pollack"},"북어해장국":{"kcal":110,"carb":3,"pro":14,"fat":4.2,"portionG":350,"enName":"Dried Pollack Hangover Soup"},"분보후에":{"kcal":480,"carb":68,"pro":24,"fat":12,"portionG":500,"enName":"Bun Bo Hue (Spicy Beef Noodle Soup)"},"분짜":{"kcal":520,"carb":72,"pro":24,"fat":15,"portionG":400,"enName":"Bun Cha (Vietnamese Grilled Pork Noodles)"},"분팃느엉":{"kcal":490,"carb":68,"pro":22,"fat":14,"portionG":380,"enName":"Bun Thit Nuong (Grilled Pork Noodle Bowl)"},"불고기덮밥":{"kcal":540,"carb":78,"pro":25,"fat":14,"portionG":400,"enName":"Bulgogi Rice Bowl"},"불고기전골":{"kcal":290,"carb":16,"pro":24,"fat":14,"portionG":350,"enName":"Bulgogi Hot Pot"},"불라로":{"kcal":380,"carb":8,"pro":36,"fat":22,"portionG":500,"enName":"Bulalo (Filipino Bone Marrow Soup)"},"브로콜리두부무침":{"kcal":85,"carb":5,"pro":6,"fat":4.5,"portionG":100,"enName":"Broccoli and Tofu Salad"},"브로콜리치즈수프":{"kcal":190,"carb":14,"pro":6,"fat":12,"portionG":250,"enName":"Broccoli Cheese Soup"},"브루스케타":{"kcal":210,"carb":24,"pro":5,"fat":10,"portionG":120,"enName":"Bruschetta"},"브리암":{"kcal":150,"carb":16,"pro":3,"fat":8,"portionG":250,"enName":"Briam (Greek Roasted Vegetables)"},"블랙페퍼크랩":{"kcal":320,"carb":18,"pro":26,"fat":16,"portionG":300,"enName":"Black Pepper Crab"},"비가 탄면":{"kcal":560,"carb":75,"pro":18,"fat":21,"portionG":450,"enName":"Binatog (Filipino Corn Snack)"},"비나고옹안":{"kcal":340,"carb":14,"pro":24,"fat":21,"portionG":300,"enName":"Binagooonaan (Filipino Pork in Shrimp Paste)"},"비리야니":{"kcal":510,"carb":72,"pro":22,"fat":15,"portionG":350,"enName":"Biryani"},"비빔국수":{"kcal":490,"carb":84,"pro":11,"fat":11,"portionG":400,"enName":"Bibim Guksu (Spicy Mixed Noodles)"},"비빔냉면":{"kcal":480,"carb":88,"pro":12,"fat":8,"portionG":500,"enName":"Bibim Naengmyeon (Spicy Cold Noodles)"},"비빔밥":{"kcal":530,"carb":84,"pro":17,"fat":14,"portionG":450,"enName":"Bibimbap"},"비지찌개":{"kcal":210,"carb":10,"pro":14,"fat":12,"portionG":350,"enName":"Biji Jjigae (Soybean Pulp Stew)"},"비콜익스프레스":{"kcal":420,"carb":8,"pro":20,"fat":35,"portionG":250,"enName":"Bicol Express"},"비트샐러드":{"kcal":110,"carb":12,"pro":2,"fat":6,"portionG":180,"enName":"Beet Salad"},"비프렌당":{"kcal":430,"carb":10,"pro":28,"fat":30,"portionG":250,"enName":"Beef Rendang"},"비프부르기뇽":{"kcal":380,"carb":12,"pro":28,"fat":24,"portionG":300,"enName":"Boeuf Bourguignon"},"비프스튜":{"kcal":310,"carb":14,"pro":24,"fat":17,"portionG":300,"enName":"Beef Stew"},"비프웰링턴":{"kcal":490,"carb":22,"pro":26,"fat":33,"portionG":200,"enName":"Beef Wellington"},"비프타코":{"kcal":380,"carb":32,"pro":20,"fat":19,"portionG":200,"enName":"Beef Taco"},"빈달루":{"kcal":360,"carb":14,"pro":22,"fat":24,"portionG":250,"enName":"Vindaloo"},"빈대떡":{"kcal":290,"carb":30,"pro":10,"fat":14,"portionG":150,"enName":"Bindaetteok (Mung Bean Pancake)"},"빠에야":{"kcal":520,"carb":70,"pro":24,"fat":16,"portionG":350,"enName":"Paella"},"뿌팟퐁 커리":{"kcal":430,"carb":22,"pro":18,"fat":30,"portionG":300,"enName":"Poo Pad Pong Curry"},"사르수엘라":{"kcal":290,"carb":15,"pro":26,"fat":14,"portionG":450,"enName":"Zarzuela (Spanish Seafood Stew)"},"사모사":{"kcal":280,"carb":34,"pro":5,"fat":14,"portionG":120,"enName":"Samosa"},"사바미소니":{"kcal":320,"carb":8,"pro":24,"fat":21,"portionG":200,"enName":"Saba Misoni (Mackerel Simmered in Miso)"},"사유르 로데":{"kcal":240,"carb":16,"pro":5,"fat":17,"portionG":300,"enName":"Sayur Lodeh (Vegetable Coconut Milk Soup)"},"사유르 아셈":{"kcal":130,"carb":18,"pro":4,"fat":4.5,"portionG":350,"enName":"Sayur Asam (Tamarind Vegetable Soup)"},"사케동":{"kcal":520,"carb":68,"pro":28,"fat":12,"portionG":350,"enName":"Sake Don (Salmon Rice Bowl)"},"사케 미소즈케":{"kcal":260,"carb":4,"pro":26,"fat":15,"portionG":150,"enName":"Sake Miso Zuke (Miso-marinated Salmon)"},"사테 아얌":{"kcal":280,"carb":8,"pro":24,"fat":16,"portionG":150,"enName":"Satay Ayam (Chicken Satay)"},"샤히 파니르":{"kcal":340,"carb":14,"pro":12,"fat":26,"portionG":250,"enName":"Saag Paneer"},"산채비빔밥":{"kcal":480,"carb":82,"pro":14,"fat":9,"portionG":450,"enName":"Wild Greens Bibimbap"},"살모레호":{"kcal":190,"carb":18,"pro":4,"fat":11,"portionG":250,"enName":"Salmorejo"},"살사소스":{"kcal":40,"carb":8,"pro":1,"fat":0.2,"portionG":100,"enName":"Salsa Sauce"},"살치살 스테이크":{"kcal":440,"carb":0,"pro":34,"fat":32,"portionG":200,"enName":"Skirt Steak"},"살팀보카":{"kcal":360,"carb":4,"pro":28,"fat":25,"portionG":180,"enName":"Saltimbocca"},"삼겹살구이":{"kcal":470,"carb":0,"pro":22,"fat":42,"portionG":150,"enName":"Grilled Pork Belly (Samgyeopsal)"},"삼겹살김치찜":{"kcal":490,"carb":11,"pro":24,"fat":38,"portionG":350,"enName":"Braised Pork Belly with Kimchi"},"삼계탕":{"kcal":680,"carb":15,"pro":65,"fat":38,"portionG":800,"enName":"Samgyetang (Ginseng Chicken Soup)"},"삼발새우":{"kcal":260,"carb":12,"pro":22,"fat":13,"portionG":200,"enName":"Sambal Shrimp"},"삼발 우당":{"kcal":260,"carb":12,"pro":22,"fat":13,"portionG":200,"enName":"Sambal Udang"},"삼발 켄팅":{"kcal":210,"carb":24,"pro":4,"fat":11,"portionG":180,"enName":"Sambal Kentang (Potato Sambal)"},"삼발 템페":{"kcal":290,"carb":18,"pro":14,"fat":18,"portionG":150,"enName":"Sambal Tempeh"},"삼선볶음밥":{"kcal":460,"carb":68,"pro":18,"fat":12,"portionG":300,"enName":"Three Delicacies Fried Rice"},"삼치구이":{"kcal":260,"carb":0.2,"pro":29,"fat":15,"portionG":150,"enName":"Grilled Spanish Mackerel"},"삼치조림":{"kcal":290,"carb":10,"pro":30,"fat":13,"portionG":250,"enName":"Braised Spanish Mackerel"},"새우마살라":{"kcal":280,"carb":14,"pro":18,"fat":16,"portionG":250,"enName":"Prawn Masala"},"새우볶음밥":{"kcal":430,"carb":66,"pro":16,"fat":11,"portionG":300,"enName":"Shrimp Fried Rice"},"새우완탕":{"kcal":180,"carb":16,"pro":14,"fat":6,"portionG":350,"enName":"Shrimp Wonton"},"새우완탕면":{"kcal":410,"carb":68,"pro":20,"fat":8,"portionG":500,"enName":"Shrimp Wonton Noodles"},"샌드위치":{"kcal":360,"carb":34,"pro":14,"fat":18,"portionG":180,"enName":"Sandwich"},"생선국수":{"kcal":380,"carb":64,"pro":22,"fat":4,"portionG":500,"enName":"Fish Noodle Soup"},"샤브샤브":{"kcal":340,"carb":12,"pro":32,"fat":16,"portionG":400,"enName":"Shabu-Shabu"},"샤오롱바오":{"kcal":290,"carb":32,"pro":13,"fat":12,"portionG":150,"enName":"Xiaolongbao (Soup Dumplings)"},"샤와르마":{"kcal":490,"carb":42,"pro":28,"fat":22,"portionG":250,"enName":"Shawarma"},"샥슈카":{"kcal":230,"carb":14,"pro":11,"fat":14,"portionG":250,"enName":"Shakshuka"},"샨 누들":{"kcal":420,"carb":62,"pro":18,"fat":10,"portionG":400,"enName":"Shan Noodles (Myanmar)"},"설렁탕":{"kcal":240,"carb":4,"pro":28,"fat":12,"portionG":550,"enName":"Seolleongtang (Ox Bone Soup)"},"세비체":{"kcal":140,"carb":7,"pro":19,"fat":3,"portionG":200,"enName":"Classic Ceviche"},"소갈비구이":{"kcal":460,"carb":6,"pro":26,"fat":36,"portionG":200,"enName":"Grilled Beef Short Ribs"},"소고기덮밥":{"kcal":560,"carb":76,"pro":24,"fat":17,"portionG":400,"enName":"Beef Rice Bowl"},"소고기뭇국":{"kcal":110,"carb":4,"pro":12,"fat":5,"portionG":300,"enName":"Beef and Radish Soup"},"소고기미역국":{"kcal":130,"carb":3,"pro":14,"fat":7,"portionG":300,"enName":"Beef Seaweed Soup"},"소고기볶음":{"kcal":320,"carb":10,"pro":26,"fat":19,"portionG":200,"enName":"Stir-fried Beef"},"소고기브로콜리볶음":{"kcal":280,"carb":11,"pro":24,"fat":15,"portionG":220,"enName":"Beef and Broccoli Stir-fry"},"소고기장조림":{"kcal":110,"carb":4,"pro":14,"fat":4,"portionG":80,"enName":"Soy-braised Beef"},"소고기죽":{"kcal":240,"carb":38,"pro":12,"fat":4.5,"portionG":350,"enName":"Beef Porridge"},"소불고기":{"kcal":290,"carb":14,"pro":24,"fat":15,"portionG":200,"enName":"Beef Bulgogi"},"소토 아얌":{"kcal":260,"carb":12,"pro":22,"fat":13,"portionG":400,"enName":"Soto Ayam (Indonesian Chicken Soup)"},"소파 데 리마":{"kcal":210,"carb":16,"pro":14,"fat":9,"portionG":350,"enName":"Sopa de Lima (Mexican Lime Soup)"},"소파 데 피데오":{"kcal":240,"carb":34,"pro":8,"fat":8,"portionG":350,"enName":"Sopa de Fideo (Mexican Noodle Soup)"},"소파 카스텔라나":{"kcal":260,"carb":24,"pro":10,"fat":14,"portionG":300,"enName":"Sopa Castellana (Spanish Garlic Soup)"},"솔 뫼니에르":{"kcal":270,"carb":12,"pro":22,"fat":14,"portionG":180,"enName":"Sole Meunière"},"솔랸카":{"kcal":280,"carb":10,"pro":18,"fat":18,"portionG":400,"enName":"Solyanka (Russian Sour Soup)"},"쏨땀":{"kcal":110,"carb":16,"pro":3,"fat":4,"portionG":200,"enName":"Som Tam (Green Papaya Salad)"},"쇼유라멘":{"kcal":430,"carb":70,"pro":16,"fat":9,"portionG":500,"enName":"Shoyu Ramen"},"수블라키":{"kcal":260,"carb":4,"pro":26,"fat":15,"portionG":160,"enName":"Souvlaki"},"수육":{"kcal":340,"carb":0,"pro":26,"fat":25,"portionG":150,"enName":"Suyuk (Boiled Pork Slices)"},"수제비":{"kcal":410,"carb":82,"pro":11,"fat":4,"portionG":500,"enName":"Sujebi (Hand-torn Noodle Soup)"},"수프카레":{"kcal":290,"carb":16,"pro":18,"fat":16,"portionG":350,"enName":"Soup Curry"},"숙주나물":{"kcal":30,"carb":3,"pro":1.5,"fat":1.2,"portionG":60,"enName":"Seasoned Bean Sprouts"},"순대국밥":{"kcal":480,"carb":52,"pro":26,"fat":18,"portionG":600,"enName":"Sundae Gukbap (Blood Sausage Rice Soup)"},"순대볶음":{"kcal":390,"carb":42,"pro":14,"fat":18,"portionG":250,"enName":"Stir-fried Sundae"},"순댓국":{"kcal":340,"carb":8,"pro":24,"fat":23,"portionG":500,"enName":"Sundaeguk (Blood Sausage Soup)"},"순두부찌개":{"kcal":160,"carb":6,"pro":12,"fat":10,"portionG":350,"enName":"Sundubu Jjigae (Soft Tofu Stew)"},"쉬쉬 타욱":{"kcal":240,"carb":4,"pro":26,"fat":13,"portionG":160,"enName":"Shish Taouk (Lebanese Chicken Skewers)"},"슈마이":{"kcal":210,"carb":22,"pro":10,"fat":9,"portionG":125,"enName":"Shumai"},"스코르달리아":{"kcal":180,"carb":18,"pro":2,"fat":11,"portionG":100,"enName":"Skordalia (Greek Garlic Sauce)"},"스크램블에그":{"kcal":180,"carb":1.5,"pro":12,"fat":14,"portionG":120,"enName":"Scrambled Eggs"},"스키야키":{"kcal":380,"carb":18,"pro":24,"fat":22,"portionG":350,"enName":"Sukiyaki"},"스테이크":{"kcal":420,"carb":0,"pro":32,"fat":31,"portionG":200,"enName":"Steak"},"스티파도":{"kcal":360,"carb":14,"pro":24,"fat":21,"portionG":300,"enName":"Stifado (Greek Beef Stew)"},"스팀보트":{"kcal":290,"carb":12,"pro":26,"fat":14,"portionG":400,"enName":"Steamboat (Hot Pot)"},"스파나코리조":{"kcal":280,"carb":44,"pro":6,"fat":8,"portionG":300,"enName":"Spanakorizo (Greek Spinach Rice)"},"스파나코피타":{"kcal":340,"carb":28,"pro":8,"fat":21,"portionG":150,"enName":"Spanakopita (Greek Spinach Pie)"},"스팸마요덮밥":{"kcal":540,"carb":70,"pro":15,"fat":21,"portionG":350,"enName":"Spam Mayo Rice Bowl"},"스페인식 오믈렛":{"kcal":280,"carb":16,"pro":12,"fat":18,"portionG":200,"enName":"Spanish Omelette"},"슬로피조":{"kcal":390,"carb":32,"pro":21,"fat":17,"portionG":250,"enName":"Sloppy Joe"},"시금치나물":{"kcal":35,"carb":3,"pro":2,"fat":1.8,"portionG":60,"enName":"Seasoned Spinach"},"시금치된장국":{"kcal":55,"carb":6,"pro":3.5,"fat":1.5,"portionG":300,"enName":"Spinach Doenjang Soup"},"시니강":{"kcal":210,"carb":12,"pro":20,"fat":8,"portionG":400,"enName":"Sinigang (Filipino Sour Soup)"},"시래기국":{"kcal":65,"carb":7,"pro":3,"fat":2.5,"portionG":300,"enName":"Dried Radish Greens Soup"},"시오라멘":{"kcal":410,"carb":72,"pro":15,"fat":7,"portionG":500,"enName":"Shio Ramen (Salt Ramen)"},"시저랩":{"kcal":420,"carb":28,"pro":18,"fat":25,"portionG":200,"enName":"Caesar Wrap"},"시저샐러드":{"kcal":210,"carb":8,"pro":6,"fat":17,"portionG":180,"enName":"Caesar Salad"},"시칠리아파스타":{"kcal":480,"carb":68,"pro":12,"fat":16,"portionG":350,"enName":"Sicilian Pasta"},"치피로네스 엔 수 틴타":{"kcal":240,"carb":10,"pro":22,"fat":12,"portionG":250,"enName":"Chipirones en su Tinta (Squid in Ink)"},"싱가포르락사":{"kcal":540,"carb":68,"pro":22,"fat":20,"portionG":500,"enName":"Singapore Laksa"},"싱가포르사테":{"kcal":290,"carb":8,"pro":24,"fat":17,"portionG":150,"enName":"Singapore Satay"},"싱가포르죽":{"kcal":220,"carb":38,"pro":10,"fat":3,"portionG":350,"enName":"Singapore Porridge"},"쌀국수":{"kcal":390,"carb":75,"pro":14,"fat":3.5,"portionG":500,"enName":"Pho (Vietnamese Rice Noodle Soup)"},"쌀국수볶음":{"kcal":490,"carb":74,"pro":15,"fat":14,"portionG":350,"enName":"Stir-fried Rice Noodles"},"쌈밥":{"kcal":360,"carb":62,"pro":11,"fat":7,"portionG":300,"enName":"Ssambap (Wrap Rice)"},"솜땀":{"kcal":110,"carb":16,"pro":3,"fat":4,"portionG":200,"enName":"Som Tam (Green Papaya Salad)"},"쑥된장국":{"kcal":60,"carb":7,"pro":4,"fat":1.5,"portionG":300,"enName":"Mugwort Doenjang Soup"},"시식":{"kcal":410,"carb":4,"pro":22,"fat":34,"portionG":150,"enName":"Sic Sic (Uighur Lamb Dish)"},"아게다시 두부":{"kcal":180,"carb":12,"pro":9,"fat":10,"portionG":150,"enName":"Agedashi Tofu"},"앙구렐라이오":{"kcal":290,"carb":6,"pro":24,"fat":18,"portionG":200,"enName":"Agourélado (Greek Olive Oil Dish)"},"아귀찜":{"kcal":210,"carb":12,"pro":26,"fat":5,"portionG":300,"enName":"Braised Monkfish"},"아다나 케밥":{"kcal":360,"carb":6,"pro":26,"fat":26,"portionG":180,"enName":"Adana Kebab"},"아도봉 캉콩":{"kcal":120,"carb":8,"pro":3,"fat":8,"portionG":180,"enName":"Adobong Kangkong (Filipino Water Spinach)"},"아라비아타 파스타":{"kcal":440,"carb":68,"pro":12,"fat":12,"portionG":350,"enName":"Arrabbiata Pasta"},"아루나 달":{"kcal":190,"carb":24,"pro":9,"fat":6,"portionG":250,"enName":"Aruna Dal"},"아르니 구브치":{"kcal":410,"carb":10,"pro":28,"fat":28,"portionG":250,"enName":"Arni Psito (Greek Roast Lamb)"},"아마트리치아나":{"kcal":460,"carb":66,"pro":14,"fat":15,"portionG":350,"enName":"Amatriciana"},"송어 아망딘":{"kcal":310,"carb":8,"pro":24,"fat":19,"portionG":180,"enName":"Trout Almondine"},"아목트레이":{"kcal":280,"carb":10,"pro":22,"fat":16,"portionG":250,"enName":"Amok Trei (Cambodian Fish Curry)"},"아보카도샐러드":{"kcal":140,"carb":8,"pro":2,"fat":12,"portionG":180,"enName":"Avocado Salad"},"아보카도 연어 토스트":{"kcal":390,"carb":26,"pro":16,"fat":25,"portionG":200,"enName":"Avocado Salmon Toast"},"아보카도 크림 파스타":{"kcal":560,"carb":68,"pro":12,"fat":28,"portionG":350,"enName":"Avocado Cream Pasta"},"아보카도토스트":{"kcal":290,"carb":26,"pro":6,"fat":18,"portionG":150,"enName":"Avocado Toast"},"아브골레모노":{"kcal":210,"carb":18,"pro":14,"fat":9,"portionG":350,"enName":"Avgolemono (Greek Egg-Lemon Soup)"},"아쌈 락사":{"kcal":430,"carb":64,"pro":18,"fat":12,"portionG":500,"enName":"Asam Laksa"},"이칸 아삼":{"kcal":260,"carb":8,"pro":22,"fat":16,"portionG":250,"enName":"Asam Ikan (Tamarind Fish)"},"아쌈 프라이드 치킨":{"kcal":510,"carb":16,"pro":26,"fat":38,"portionG":200,"enName":"Asam Fried Chicken"},"아얌 고렝 베렘파":{"kcal":420,"carb":8,"pro":24,"fat":32,"portionG":180,"enName":"Ayam Goreng Berempah (Spiced Fried Chicken)"},"아얌 고렝":{"kcal":390,"carb":6,"pro":26,"fat":30,"portionG":180,"enName":"Ayam Goreng (Malaysian Fried Chicken)"},"아얌 리카리카":{"kcal":340,"carb":8,"pro":25,"fat":23,"portionG":200,"enName":"Ayam Rica-Rica (Spicy Chicken)"},"아얌 마삭 르막":{"kcal":410,"carb":10,"pro":24,"fat":30,"portionG":250,"enName":"Ayam Masak Lemak (Chicken in Coconut Milk)"},"아얌 마삭 메라":{"kcal":380,"carb":12,"pro":24,"fat":26,"portionG":250,"enName":"Ayam Masak Merah (Red Cooked Chicken)"},"아얌 바카르":{"kcal":310,"carb":6,"pro":26,"fat":20,"portionG":180,"enName":"Ayam Bakar (Grilled Chicken)"},"아얌세리":{"kcal":330,"carb":8,"pro":24,"fat":22,"portionG":200,"enName":"Ayam Seri"},"아얌 페녓":{"kcal":430,"carb":8,"pro":25,"fat":33,"portionG":200,"enName":"Ayam Penyet (Smashed Fried Chicken)"},"아욱국":{"kcal":65,"carb":7,"pro":3,"fat":2.5,"portionG":300,"enName":"Mallow Soup"},"아이리시스튜":{"kcal":320,"carb":18,"pro":24,"fat":17,"portionG":350,"enName":"Irish Stew"},"아지 후라이":{"kcal":290,"carb":16,"pro":18,"fat":18,"portionG":120,"enName":"Aji Furai (Fried Horse Mackerel)"},"아쿠아파차":{"kcal":220,"carb":6,"pro":24,"fat":11,"portionG":350,"enName":"Acqua Pazza (Italian Poached Fish)"},"아프리타다":{"kcal":290,"carb":12,"pro":22,"fat":17,"portionG":300,"enName":"Afritada (Filipino Chicken Stew)"},"아호 블랑코":{"kcal":240,"carb":14,"pro":4,"fat":19,"portionG":200,"enName":"Ajo Blanco (Spanish White Gazpacho)"},"아히 데 가이나":{"kcal":410,"carb":28,"pro":24,"fat":23,"portionG":300,"enName":"Aji de Gallina (Peruvian Creamy Chicken)"},"안심스테이크":{"kcal":340,"carb":0,"pro":40,"fat":20,"portionG":200,"enName":"Tenderloin Steak"},"알루 고비":{"kcal":180,"carb":22,"pro":4,"fat":9,"portionG":250,"enName":"Aloo Gobi (Potato and Cauliflower)"},"알루 파라타":{"kcal":290,"carb":42,"pro":5,"fat":11,"portionG":150,"enName":"Aloo Paratha"},"알리오올리오":{"kcal":460,"carb":62,"pro":9,"fat":20,"portionG":300,"enName":"Aglio e Olio"},"알본디가스":{"kcal":280,"carb":12,"pro":18,"fat":18,"portionG":200,"enName":"Albondigas (Spanish Meatballs)"},"알탕":{"kcal":230,"carb":6,"pro":28,"fat":10,"portionG":400,"enName":"Spicy Pollock Roe Soup"},"암리차리 쿨차":{"kcal":320,"carb":48,"pro":7,"fat":11,"portionG":150,"enName":"Amritsari Kulcha"},"암팔라야 볶음":{"kcal":140,"carb":8,"pro":8,"fat":9,"portionG":180,"enName":"Ampalaya Stir-fry (Bitter Melon)"},"애호박볶음":{"kcal":50,"carb":5,"pro":1.2,"fat":3,"portionG":80,"enName":"Stir-fried Zucchini"},"채소볶음밥":{"kcal":410,"carb":68,"pro":9,"fat":11,"portionG":300,"enName":"Vegetable Fried Rice"},"채소죽":{"kcal":180,"carb":36,"pro":4,"fat":2,"portionG":350,"enName":"Vegetable Porridge"},"채소춘권":{"kcal":220,"carb":24,"pro":4,"fat":12,"portionG":100,"enName":"Vegetable Spring Rolls"},"야키소바":{"kcal":480,"carb":68,"pro":12,"fat":18,"portionG":320,"enName":"Yakisoba"},"야키 오니기리":{"kcal":280,"carb":56,"pro":6,"fat":3,"portionG":160,"enName":"Yaki Onigiri (Grilled Rice Ball)"},"야키우동":{"kcal":440,"carb":72,"pro":11,"fat":12,"portionG":350,"enName":"Yaki Udon (Stir-fried Udon)"},"야키토리":{"kcal":210,"carb":4,"pro":22,"fat":12,"portionG":120,"enName":"Yakitori"},"야키토리 덮밥":{"kcal":540,"carb":74,"pro":25,"fat":16,"portionG":400,"enName":"Yakitori Rice Bowl"},"약밥":{"kcal":310,"carb":68,"pro":4,"fat":2.5,"portionG":100,"enName":"Yakbap (Sweet Rice)"},"얌느아":{"kcal":190,"carb":10,"pro":20,"fat":8,"portionG":200,"enName":"Yam Nua (Thai Beef Salad)"},"얌 마무앙":{"kcal":130,"carb":22,"pro":2,"fat":4,"portionG":180,"enName":"Yam Mamuang (Mango Salad)"},"얌운센":{"kcal":240,"carb":34,"pro":12,"fat":6,"portionG":250,"enName":"Yam Woon Sen (Glass Noodle Salad)"},"얌탈레":{"kcal":220,"carb":18,"pro":16,"fat":9,"portionG":250,"enName":"Yam Talay (Thai Seafood Salad)"},"양념치킨":{"kcal":690,"carb":38,"pro":36,"fat":44,"portionG":250,"enName":"Yangnyeom Chicken (Korean Spicy Fried Chicken)"},"양배추쌈":{"kcal":45,"carb":9,"pro":2,"fat":0.3,"portionG":150,"enName":"Cabbage Wrap"},"양배추참치덮밥":{"kcal":420,"carb":68,"pro":18,"fat":8,"portionG":350,"enName":"Cabbage and Tuna Rice Bowl"},"양송이수프":{"kcal":150,"carb":14,"pro":4,"fat":9,"portionG":250,"enName":"Cream of Mushroom Soup"},"양장피":{"kcal":290,"carb":24,"pro":16,"fat":15,"portionG":300,"enName":"Yangjangpi (Jellyfish and Vegetable Salad)"},"양저우 볶음밥":{"kcal":460,"carb":66,"pro":15,"fat":15,"portionG":300,"enName":"Yangzhou Fried Rice"},"양파수프":{"kcal":140,"carb":16,"pro":4,"fat":7,"portionG":250,"enName":"Onion Soup"},"어묵국":{"kcal":90,"carb":8,"pro":7,"fat":3.5,"portionG":300,"enName":"Fish Cake Soup"},"어묵볶음":{"kcal":120,"carb":10,"pro":6,"fat":6,"portionG":80,"enName":"Stir-fried Fish Cakes"},"어묵탕":{"kcal":180,"carb":14,"pro":12,"fat":8,"portionG":400,"enName":"Fish Cake Hot Pot"},"어향가지":{"kcal":180,"carb":14,"pro":3,"fat":13,"portionG":200,"enName":"Yuxiang Eggplant"},"어향육사":{"kcal":290,"carb":12,"pro":18,"fat":19,"portionG":200,"enName":"Yuxiang Shredded Pork"},"에그베네딕트":{"kcal":440,"carb":24,"pro":18,"fat":31,"portionG":200,"enName":"Eggs Benedict"},"에그샌드위치":{"kcal":390,"carb":32,"pro":13,"fat":23,"portionG":180,"enName":"Egg Sandwich"},"에그토스트":{"kcal":320,"carb":28,"pro":10,"fat":18,"portionG":150,"enName":"Egg Toast"},"에비마요":{"kcal":380,"carb":22,"pro":14,"fat":26,"portionG":180,"enName":"Ebi Mayo (Shrimp Mayonnaise)"},"에비텐동":{"kcal":620,"carb":82,"pro":18,"fat":24,"portionG":400,"enName":"Ebi Tendon (Shrimp Tempura Rice Bowl)"},"에비 후라이":{"kcal":280,"carb":18,"pro":13,"fat":17,"portionG":100,"enName":"Ebi Furai (Fried Shrimp)"},"에스카베체":{"kcal":240,"carb":10,"pro":18,"fat":14,"portionG":200,"enName":"Escabeche (Pickled Fish)"},"엔칠라다":{"kcal":460,"carb":44,"pro":22,"fat":21,"portionG":300,"enName":"Enchilada"},"엠파나다":{"kcal":380,"carb":36,"pro":12,"fat":21,"portionG":150,"enName":"Empanada"},"연근조림":{"kcal":75,"carb":16,"pro":2,"fat":0.5,"portionG":80,"enName":"Braised Lotus Root"},"연어구이":{"kcal":250,"carb":0.1,"pro":30,"fat":14,"portionG":150,"enName":"Grilled Salmon"},"연어데리야키":{"kcal":320,"carb":10,"pro":28,"fat":18,"portionG":180,"enName":"Salmon Teriyaki"},"연어샐러드":{"kcal":190,"carb":8,"pro":18,"fat":10,"portionG":220,"enName":"Salmon Salad"},"연어스테이크":{"kcal":310,"carb":0.2,"pro":36,"fat":18,"portionG":200,"enName":"Salmon Steak"},"연어아보카도볼":{"kcal":490,"carb":48,"pro":24,"fat":22,"portionG":350,"enName":"Salmon Avocado Bowl"},"연어아보카도포케":{"kcal":530,"carb":54,"pro":25,"fat":24,"portionG":380,"enName":"Salmon Avocado Poke Bowl"},"연어초밥":{"kcal":480,"carb":68,"pro":22,"fat":13,"portionG":300,"enName":"Salmon Sushi"},"연어포케":{"kcal":430,"carb":52,"pro":24,"fat":14,"portionG":350,"enName":"Salmon Poke Bowl"},"연포탕":{"kcal":120,"carb":6,"pro":18,"fat":2.5,"portionG":450,"enName":"Yeonpo Tang (Soft Octopus Soup)"},"열무국수":{"kcal":390,"carb":78,"pro":10,"fat":4,"portionG":450,"enName":"Young Radish Noodles"},"열무냉면":{"kcal":410,"carb":82,"pro":11,"fat":4,"portionG":500,"enName":"Young Radish Cold Noodles"},"열무비빔밥":{"kcal":490,"carb":84,"pro":12,"fat":11,"portionG":450,"enName":"Young Radish Bibimbap"},"영양솥밥":{"kcal":420,"carb":82,"pro":10,"fat":5,"portionG":350,"enName":"Nutritious Pot Rice"},"오니기리":{"kcal":270,"carb":56,"pro":5,"fat":2,"portionG":160,"enName":"Onigiri (Rice Ball)"},"오뎅":{"kcal":140,"carb":12,"pro":10,"fat":5.5,"portionG":200,"enName":"Oden"},"오리주물럭":{"kcal":380,"carb":10,"pro":24,"fat":27,"portionG":200,"enName":"Spicy Duck Stir-fry"},"오므라이스":{"kcal":580,"carb":78,"pro":15,"fat":23,"portionG":400,"enName":"Omurice (Omelette Rice)"},"오믈렛":{"kcal":190,"carb":2,"pro":12,"fat":15,"portionG":150,"enName":"Omelette"},"오버나이트오트밀":{"kcal":260,"carb":42,"pro":9,"fat":6,"portionG":250,"enName":"Overnight Oatmeal"},"오삼불고기":{"kcal":340,"carb":11,"pro":24,"fat":22,"portionG":200,"enName":"Spicy Pork and Squid Stir-fry"},"오소부코":{"kcal":390,"carb":12,"pro":32,"fat":24,"portionG":300,"enName":"Osso Buco"},"오야코동":{"kcal":560,"carb":74,"pro":25,"fat":19,"portionG":400,"enName":"Oyakodon (Chicken and Egg Rice Bowl)"},"오야코우동":{"kcal":480,"carb":76,"pro":22,"fat":10,"portionG":500,"enName":"Oyako Udon"},"오이냉국":{"kcal":30,"carb":6,"pro":1,"fat":0.2,"portionG":300,"enName":"Cold Cucumber Soup"},"오이무침":{"kcal":35,"carb":5,"pro":1,"fat":1.2,"portionG":80,"enName":"Seasoned Cucumber"},"오이소박이":{"kcal":30,"carb":5,"pro":1.2,"fat":0.3,"portionG":80,"enName":"Cucumber Kimchi"},"오이지무침":{"kcal":25,"carb":4,"pro":0.8,"fat":0.6,"portionG":50,"enName":"Seasoned Pickled Cucumber"},"오징어덮밥":{"kcal":510,"carb":82,"pro":22,"fat":10,"portionG":400,"enName":"Squid Rice Bowl"},"오징어먹물파스타":{"kcal":490,"carb":68,"pro":16,"fat":16,"portionG":350,"enName":"Squid Ink Pasta"},"오징어무국":{"kcal":110,"carb":6,"pro":14,"fat":3,"portionG":350,"enName":"Squid and Radish Soup"},"오징어볶음":{"kcal":190,"carb":11,"pro":20,"fat":7,"portionG":200,"enName":"Stir-fried Spicy Squid"},"오징어채볶음":{"kcal":145,"carb":16,"pro":12,"fat":3.5,"portionG":50,"enName":"Stir-fried Dried Squid Strips"},"오차즈케":{"kcal":290,"carb":54,"pro":9,"fat":4,"portionG":350,"enName":"Ochazuke (Tea Rice)"},"오코노미야키":{"kcal":360,"carb":34,"pro":14,"fat":19,"portionG":250,"enName":"Okonomiyaki (Japanese Savory Pancake)"},"오타오타":{"kcal":160,"carb":6,"pro":14,"fat":9,"portionG":100,"enName":"Otak-Otak (Grilled Fish Cake)"},"오트밀":{"kcal":150,"carb":27,"pro":5,"fat":3,"portionG":250,"enName":"Oatmeal"},"오포르아얌":{"kcal":320,"carb":12,"pro":22,"fat":21,"portionG":250,"enName":"Opor Ayam (Chicken in Coconut Milk)"},"오향장육":{"kcal":280,"carb":4,"pro":26,"fat":18,"portionG":150,"enName":"Five-spice Braised Pork"},"와플":{"kcal":230,"carb":31,"pro":5,"fat":10,"portionG":80,"enName":"Waffle"},"완탕면":{"kcal":420,"carb":62,"pro":18,"fat":11,"portionG":500,"enName":"Wonton Noodles"},"완탕탕":{"kcal":180,"carb":14,"pro":12,"fat":8,"portionG":350,"enName":"Wonton Soup"},"우거지갈비찜":{"kcal":340,"carb":12,"pro":24,"fat":22,"portionG":250,"enName":"Braised Ribs with Dried Cabbage"},"우거지해장국":{"kcal":190,"carb":18,"pro":13,"fat":7,"portionG":500,"enName":"Dried Cabbage Hangover Soup"},"우렁된장찌개":{"kcal":140,"carb":13,"pro":11,"fat":5,"portionG":250,"enName":"Freshwater Snail Doenjang Stew"},"우엉조림":{"kcal":55,"carb":11,"pro":1,"fat":1,"portionG":40,"enName":"Braised Burdock Root"},"우육면":{"kcal":540,"carb":75,"pro":28,"fat":14,"portionG":550,"enName":"Beef Noodle Soup"},"월남쌈":{"kcal":280,"carb":42,"pro":14,"fat":6,"portionG":250,"enName":"Vietnamese Spring Rolls"},"유도후":{"kcal":110,"carb":4,"pro":11,"fat":6,"portionG":200,"enName":"Yudofu (Simmered Tofu)"},"유린기":{"kcal":410,"carb":28,"pro":20,"fat":24,"portionG":200,"enName":"Yuringi (Chinese-style Fried Chicken)"},"유부우동":{"kcal":430,"carb":72,"pro":14,"fat":9,"portionG":500,"enName":"Kitsune Udon (Tofu Pouch Udon)"},"유부초밥":{"kcal":320,"carb":54,"pro":9,"fat":7,"portionG":160,"enName":"Inari Sushi"},"유산슬":{"kcal":210,"carb":12,"pro":18,"fat":10,"portionG":200,"enName":"Yusanseul (Seafood and Vegetable Stir-fry)"},"육개장":{"kcal":240,"carb":14,"pro":19,"fat":12,"portionG":500,"enName":"Yukgaejang (Spicy Beef Soup)"},"육전":{"kcal":260,"carb":6,"pro":21,"fat":17,"portionG":120,"enName":"Yukjeon (Pan-fried Beef)"},"육회비빔밥":{"kcal":580,"carb":82,"pro":27,"fat":16,"portionG":450,"enName":"Yukhoe Bibimbap (Raw Beef Bibimbap)"},"이나리초밥":{"kcal":320,"carb":54,"pro":9,"fat":7,"portionG":160,"enName":"Inari Sushi"},"이나살":{"kcal":360,"carb":3,"pro":32,"fat":24,"portionG":180,"enName":"Inasal (Filipino Grilled Chicken)"},"이맘 바일드":{"kcal":180,"carb":16,"pro":3,"fat":12,"portionG":200,"enName":"İmam Bayıldı (Stuffed Eggplant)"},"이스켄데르케밥":{"kcal":580,"carb":43,"pro":31,"fat":32,"portionG":350,"enName":"İskender Kebab"},"이시카리나베":{"kcal":290,"carb":11,"pro":28,"fat":15,"portionG":400,"enName":"Ishikari Nabe (Salmon Hot Pot)"},"이즈미르쾨프테":{"kcal":340,"carb":18,"pro":22,"fat":20,"portionG":250,"enName":"İzmir Köfte"},"이칸고랭":{"kcal":280,"carb":8,"pro":24,"fat":17,"portionG":150,"enName":"Ikan Goreng (Fried Fish)"},"이칸마살라":{"kcal":260,"carb":14,"pro":22,"fat":13,"portionG":250,"enName":"Ikan Masala (Fish Masala)"},"이칸바카르":{"kcal":210,"carb":4,"pro":26,"fat":10,"portionG":150,"enName":"Ikan Bakar (Grilled Fish)"},"이칸아삼":{"kcal":190,"carb":9,"pro":22,"fat":7,"portionG":300,"enName":"Ikan Asam (Tamarind Fish)"},"이칸페프리":{"kcal":170,"carb":3,"pro":24,"fat":7,"portionG":150,"enName":"Ikan Peperi (Peppered Fish)"},"일본식카레라이스":{"kcal":620,"carb":102,"pro":16,"fat":16,"portionG":500,"enName":"Japanese Curry Rice"},"일본식계란말이":{"kcal":150,"carb":8,"pro":10,"fat":9,"portionG":100,"enName":"Japanese Rolled Egg (Tamagoyaki)"},"자루소바":{"kcal":340,"carb":68,"pro":12,"fat":2,"portionG":300,"enName":"Zaru Soba (Cold Soba Noodles)"},"자지키":{"kcal":90,"carb":5,"pro":5,"fat":6,"portionG":100,"enName":"Zazak"},"잔치국수":{"kcal":380,"carb":74,"pro":12,"fat":4,"portionG":500,"enName":"Janchi Guksu (Festive Noodle Soup)"},"잠발라야":{"kcal":460,"carb":56,"pro":22,"fat":16,"portionG":350,"enName":"Jambalaya"},"잡곡밥":{"kcal":310,"carb":66,"pro":7,"fat":2,"portionG":210,"enName":"Multigrain Rice"},"잡채":{"kcal":140,"carb":22,"pro":2,"fat":5,"portionG":90,"enName":"Japchae (Glass Noodles with Vegetables)"},"잡채밥":{"kcal":680,"carb":105,"pro":12,"fat":24,"portionG":450,"enName":"Japchae Rice Bowl"},"잡채볶음밥":{"kcal":730,"carb":102,"pro":14,"fat":30,"portionG":450,"enName":"Japchae Fried Rice"},"장어구이":{"kcal":320,"carb":11,"pro":27,"fat":19,"portionG":150,"enName":"Grilled Eel"},"장조림":{"kcal":75,"carb":2,"pro":12,"fat":2,"portionG":50,"enName":"Soy-braised Beef"},"장조림버터비빔밥":{"kcal":610,"carb":82,"pro":18,"fat":23,"portionG":400,"enName":"Soy-braised Beef Butter Bibimbap"},"장칼국수":{"kcal":440,"carb":84,"pro":14,"fat":5,"portionG":550,"enName":"Doenjang Knife-cut Noodle Soup"},"장터국수":{"kcal":370,"carb":72,"pro":11,"fat":4,"portionG":500,"enName":"Market-style Noodle Soup"},"쟁반국수":{"kcal":490,"carb":88,"pro":15,"fat":9,"portionG":400,"enName":"Tray Noodles"},"전복미역국":{"kcal":90,"carb":5,"pro":10,"fat":4,"portionG":350,"enName":"Abalone and Seaweed Soup"},"전복죽":{"kcal":270,"carb":51,"pro":8,"fat":4,"portionG":400,"enName":"Abalone Porridge"},"제육볶음":{"kcal":310,"carb":10,"pro":22,"fat":20,"portionG":150,"enName":"Jeyuk Bokkeum (Spicy Pork Stir-fry)"},"조개탕":{"kcal":60,"carb":4,"pro":8,"fat":1,"portionG":350,"enName":"Clam Soup"},"조기구이":{"kcal":140,"carb":0,"pro":19,"fat":7,"portionG":100,"enName":"Grilled Yellow Corvina"},"족발냉채":{"kcal":360,"carb":14,"pro":28,"fat":21,"portionG":250,"enName":"Cold Pig's Trotters"},"주꾸미볶음":{"kcal":220,"carb":14,"pro":22,"fat":8,"portionG":200,"enName":"Stir-fried Baby Octopus"},"주먹밥":{"kcal":360,"carb":62,"pro":9,"fat":8,"portionG":200,"enName":"Jumeokbap (Rice Ball)"},"중식만두전골":{"kcal":380,"carb":34,"pro":19,"fat":19,"portionG":450,"enName":"Chinese-style Dumpling Hot Pot"},"중식오이냉채":{"kcal":65,"carb":7,"pro":2,"fat":3,"portionG":120,"enName":"Chinese-style Cold Cucumber"},"지삼선":{"kcal":240,"carb":22,"pro":4,"fat":15,"portionG":200,"enName":"Di San Xian (Potato"},"진미채무침":{"kcal":120,"carb":15,"pro":11,"fat":2,"portionG":40,"enName":"Seasoned Dried Squid Strips"},"짜장면":{"kcal":680,"carb":110,"pro":18,"fat":19,"portionG":600,"enName":"Jjajangmyeon (Black Bean Noodles)"},"짜장밥":{"kcal":720,"carb":115,"pro":16,"fat":21,"portionG":500,"enName":"Jjajang Rice"},"짜조":{"kcal":270,"carb":24,"pro":9,"fat":15,"portionG":120,"enName":"Cha Gio (Vietnamese Fried Spring Rolls)"},"짬뽕":{"kcal":560,"carb":84,"pro":23,"fat":15,"portionG":650,"enName":"Jjamppong (Spicy Seafood Noodle Soup)"},"쫄면":{"kcal":520,"carb":102,"pro":13,"fat":7,"portionG":450,"enName":"Jjolmyeon (Chewy Spicy Noodles)"},"쭈꾸미볶음밥":{"kcal":630,"carb":96,"pro":20,"fat":18,"portionG":450,"enName":"Spicy Baby Octopus Fried Rice"},"쭈꾸미삼겹살":{"kcal":440,"carb":12,"pro":26,"fat":32,"portionG":250,"enName":"Baby Octopus and Pork Belly"},"츠케멘":{"kcal":610,"carb":88,"pro":24,"fat":18,"portionG":500,"enName":"Tsukemen (Dipping Ramen)"},"호키엔미":{"kcal":490,"carb":64,"pro":19,"fat":17,"portionG":350,"enName":"Hokkien Mee"},"찜닭":{"kcal":380,"carb":24,"pro":32,"fat":17,"portionG":300,"enName":"Jjimdak (Braised Chicken)"},"짜까":{"kcal":310,"carb":8,"pro":26,"fat":19,"portionG":200,"enName":"Chaaka"},"차나마살라":{"kcal":240,"carb":32,"pro":9,"fat":8,"portionG":250,"enName":"Chana Masala"},"차돌된장찌개":{"kcal":210,"carb":9,"pro":14,"fat":13,"portionG":250,"enName":"Beef Brisket Doenjang Stew"},"차돌박이숙주볶음":{"kcal":320,"carb":7,"pro":18,"fat":25,"portionG":200,"enName":"Beef Brisket and Bean Sprout Stir-fry"},"차슈":{"kcal":270,"carb":5,"pro":16,"fat":21,"portionG":100,"enName":"Chashu (Braised Pork)"},"차오멘":{"kcal":510,"carb":68,"pro":14,"fat":20,"portionG":350,"enName":"Chow Mein"},"차완무시":{"kcal":90,"carb":3,"pro":8,"fat":5,"portionG":120,"enName":"Chawanmushi (Japanese Steamed Egg Custard)"},"차우파":{"kcal":640,"carb":88,"pro":18,"fat":24,"portionG":400,"enName":"Chaufa (Peruvian Fried Rice)"},"차이 타우 궤":{"kcal":390,"carb":48,"pro":10,"fat":18,"portionG":250,"enName":"Chai Tow Kway (Radish Cake)"},"차조":{"kcal":270,"carb":24,"pro":9,"fat":15,"portionG":120,"enName":"Chamjo (Millet and Porridge)"},"차지키":{"kcal":90,"carb":5,"pro":5,"fat":6,"portionG":100,"enName":"Tzatziki"},"차퀘이테오":{"kcal":580,"carb":72,"pro":18,"fat":24,"portionG":350,"enName":"Char Kway Teow"},"참나물무침":{"kcal":35,"carb":4,"pro":1,"fat":2,"portionG":50,"enName":"Seasoned Chammnamul (Wild Parsley)"},"참치김밥":{"kcal":480,"carb":68,"pro":17,"fat":15,"portionG":300,"enName":"Tuna Gimbap"},"참치김치볶음밥":{"kcal":660,"carb":94,"pro":19,"fat":23,"portionG":450,"enName":"Tuna and Kimchi Fried Rice"},"참치김치찌개":{"kcal":170,"carb":8,"pro":15,"fat":9,"portionG":300,"enName":"Tuna and Kimchi Stew"},"참치마요덮밥":{"kcal":620,"carb":85,"pro":16,"fat":24,"portionG":400,"enName":"Tuna Mayo Rice Bowl"},"참치마요오니기리":{"kcal":210,"carb":36,"pro":5,"fat":5,"portionG":110,"enName":"Tuna Mayo Onigiri"},"참치채소샐러드":{"kcal":140,"carb":8,"pro":18,"fat":4,"portionG":200,"enName":"Tuna and Vegetable Salad"},"참치포케":{"kcal":490,"carb":62,"pro":24,"fat":16,"portionG":400,"enName":"Tuna Poke Bowl"},"참치회비빔밥":{"kcal":530,"carb":82,"pro":26,"fat":11,"portionG":450,"enName":"Fresh Tuna Bibimbap"},"찹스테이크":{"kcal":310,"carb":12,"pro":24,"fat":18,"portionG":200,"enName":"Chop Steak"},"채끝스테이크":{"kcal":340,"carb":0,"pro":33,"fat":22,"portionG":150,"enName":"Sirloin Steak"},"채소달걀국":{"kcal":70,"carb":3,"pro":6,"fat":4,"portionG":300,"enName":"Vegetable and Egg Soup"},"채소커리":{"kcal":180,"carb":26,"pro":5,"fat":6,"portionG":250,"enName":"Vegetable Curry"},"청경채굴소스볶음":{"kcal":75,"carb":6,"pro":2,"fat":5,"portionG":120,"enName":"Bok Choy with Oyster Sauce"},"청경채두부볶음":{"kcal":130,"carb":8,"pro":9,"fat":7,"portionG":180,"enName":"Bok Choy and Tofu Stir-fry"},"청경채볶음":{"kcal":50,"carb":4,"pro":1,"fat":3,"portionG":100,"enName":"Stir-fried Bok Choy"},"청국장찌개":{"kcal":180,"carb":14,"pro":14,"fat":8,"portionG":250,"enName":"Cheonggukjang Jjigae (Fermented Soybean Stew)"},"체가이볶음면":{"kcal":460,"carb":72,"pro":11,"fat":14,"portionG":350,"enName":"Che Kai Stir-fried Noodles"},"초리소와인조림":{"kcal":320,"carb":6,"pro":18,"fat":25,"portionG":150,"enName":"Chorizo Wine Braise"},"총유빙":{"kcal":340,"carb":42,"pro":6,"fat":16,"portionG":120,"enName":"Cong You Bing (Scallion Pancake)"},"추어탕":{"kcal":210,"carb":12,"pro":18,"fat":10,"portionG":500,"enName":"Chueo Tang (Loach Soup)"},"충무김밥":{"kcal":410,"carb":78,"pro":11,"fat":6,"portionG":250,"enName":"Chungmu Gimbap"},"취나물":{"kcal":35,"carb":4,"pro":1,"fat":2,"portionG":50,"enName":"Seasoned Chwi Namul"},"치라시스시":{"kcal":540,"carb":92,"pro":21,"fat":9,"portionG":400,"enName":"Chirashi Sushi"},"치미창가":{"kcal":580,"carb":54,"pro":26,"fat":28,"portionG":300,"enName":"Chimichanga"},"치즈닭갈비":{"kcal":460,"carb":16,"pro":36,"fat":28,"portionG":300,"enName":"Cheese Dakgalbi"},"치즈버거":{"kcal":480,"carb":38,"pro":24,"fat":26,"portionG":200,"enName":"Cheeseburger"},"치킨그라탕":{"kcal":490,"carb":32,"pro":28,"fat":27,"portionG":350,"enName":"Chicken Gratin"},"치킨난반":{"kcal":520,"carb":24,"pro":26,"fat":36,"portionG":250,"enName":"Chicken Nanban"},"치킨누들수프":{"kcal":180,"carb":15,"pro":16,"fat":6,"portionG":400,"enName":"Chicken Noodle Soup"},"치킨두피아자":{"kcal":380,"carb":14,"pro":28,"fat":24,"portionG":300,"enName":"Chicken Do Pyaza"},"치킨몰레":{"kcal":420,"carb":18,"pro":32,"fat":25,"portionG":300,"enName":"Chicken Mole"},"치킨발티":{"kcal":390,"carb":12,"pro":31,"fat":24,"portionG":300,"enName":"Chicken Balti"},"치킨버거":{"kcal":510,"carb":46,"pro":22,"fat":27,"portionG":220,"enName":"Chicken Burger"},"치킨부리토":{"kcal":620,"carb":68,"pro":32,"fat":24,"portionG":350,"enName":"Chicken Burrito"},"치킨빈달루":{"kcal":410,"carb":11,"pro":32,"fat":26,"portionG":300,"enName":"Chicken Vindaloo"},"치킨샐러드":{"kcal":280,"carb":12,"pro":22,"fat":16,"portionG":250,"enName":"Chicken Salad"},"치킨샤와르마랩":{"kcal":490,"carb":44,"pro":28,"fat":22,"portionG":280,"enName":"Chicken Shawarma Wrap"},"치킨수프":{"kcal":160,"carb":12,"pro":15,"fat":6,"portionG":400,"enName":"Chicken Soup"},"치킨스테이크":{"kcal":320,"carb":2,"pro":34,"fat":20,"portionG":200,"enName":"Chicken Steak"},"치킨스튜":{"kcal":290,"carb":16,"pro":24,"fat":14,"portionG":350,"enName":"Chicken Stew"},"치킨시저랩":{"kcal":530,"carb":36,"pro":26,"fat":31,"portionG":250,"enName":"Chicken Caesar Wrap"},"치킨아도보":{"kcal":360,"carb":6,"pro":32,"fat":24,"portionG":250,"enName":"Chicken Adobo"},"치킨이나살":{"kcal":360,"carb":3,"pro":32,"fat":24,"portionG":180,"enName":"Chicken Inasal"},"치킨카츠":{"kcal":380,"carb":18,"pro":24,"fat":24,"portionG":150,"enName":"Chicken Katsu"},"치킨카치아토라":{"kcal":310,"carb":14,"pro":28,"fat":15,"portionG":350,"enName":"Chicken Cacciatore"},"치킨커리말레이":{"kcal":390,"carb":15,"pro":28,"fat":24,"portionG":300,"enName":"Malaysian Chicken Curry"},"치킨케밥":{"kcal":420,"carb":32,"pro":26,"fat":21,"portionG":250,"enName":"Chicken Kebab"},"치킨코르마":{"kcal":430,"carb":16,"pro":26,"fat":29,"portionG":300,"enName":"Chicken Korma"},"치킨콥샐러드":{"kcal":380,"carb":10,"pro":28,"fat":26,"portionG":300,"enName":"Chicken Cobb Salad"},"치킨타진":{"kcal":340,"carb":18,"pro":27,"fat":18,"portionG":350,"enName":"Chicken Tagine"},"치킨타코":{"kcal":340,"carb":28,"pro":18,"fat":16,"portionG":180,"enName":"Chicken Taco"},"치킨티카마살라":{"kcal":420,"carb":14,"pro":28,"fat":28,"portionG":300,"enName":"Chicken Tikka Masala"},"치킨파히타":{"kcal":390,"carb":24,"pro":26,"fat":21,"portionG":250,"enName":"Chicken Fajita"},"치킨팟파이":{"kcal":540,"carb":41,"pro":19,"fat":34,"portionG":300,"enName":"Chicken Pot Pie"},"칠레레예노":{"kcal":380,"carb":18,"pro":14,"fat":28,"portionG":250,"enName":"Chile Relleno"},"칠레아도보":{"kcal":390,"carb":7,"pro":31,"fat":26,"portionG":250,"enName":"Chile Adobo"},"칠레콘카르네":{"kcal":360,"carb":24,"pro":22,"fat":20,"portionG":300,"enName":"Chili con Carne"},"칠리새우":{"kcal":320,"carb":26,"pro":16,"fat":16,"portionG":200,"enName":"Chili Shrimp"},"칠리콘카르네":{"kcal":360,"carb":24,"pro":22,"fat":20,"portionG":300,"enName":"Chili con Carne"},"칠리크랩":{"kcal":420,"carb":28,"pro":32,"fat":20,"portionG":400,"enName":"Chilli Crab"},"칡냉면":{"kcal":460,"carb":94,"pro":11,"fat":4,"portionG":550,"enName":"Arrowroot Cold Noodles"},"카니돈부리":{"kcal":530,"carb":84,"pro":22,"fat":12,"portionG":400,"enName":"Kani Donburi (Crab Rice Bowl)"},"카레라이스":{"kcal":620,"carb":102,"pro":16,"fat":16,"portionG":500,"enName":"Curry Rice"},"카레우동":{"kcal":490,"carb":78,"pro":14,"fat":13,"portionG":500,"enName":"Curry Udon"},"카레카레":{"kcal":440,"carb":14,"pro":28,"fat":31,"portionG":350,"enName":"Kare-Kare (Filipino Peanut Stew)"},"카르네아사다":{"kcal":340,"carb":2,"pro":32,"fat":23,"portionG":200,"enName":"Carne Asada"},"카르니야르크":{"kcal":240,"carb":12,"pro":14,"fat":16,"portionG":250,"enName":"Karnıyarık (Stuffed Eggplant)"},"카르보나라":{"kcal":650,"carb":64,"pro":22,"fat":34,"portionG":350,"enName":"Carbonara"},"카마로네스 아 라 디아블라":{"kcal":280,"carb":10,"pro":24,"fat":16,"portionG":250,"enName":"Camarones a la Diabla"},"카불리 팔라우":{"kcal":590,"carb":84,"pro":21,"fat":19,"portionG":400,"enName":"Kaburga (Turkish Lamb Ribs)"},"카술레":{"kcal":480,"carb":32,"pro":28,"fat":26,"portionG":350,"enName":"Cassoulet"},"카야토스트":{"kcal":360,"carb":48,"pro":7,"fat":16,"portionG":120,"enName":"Kaya Toast"},"카오니아오":{"kcal":350,"carb":76,"pro":6,"fat":1,"portionG":150,"enName":"Khao Niao (Sticky Rice)"},"카오니아오 마무앙":{"kcal":480,"carb":88,"pro":5,"fat":12,"portionG":250,"enName":"Khao Niao Mamuang (Mango Sticky Rice)"},"카오니아오 무삥":{"kcal":520,"carb":42,"pro":26,"fat":28,"portionG":250,"enName":"Khao Niao Mu Ping (Grilled Pork with Sticky Rice)"},"카오만가이":{"kcal":590,"carb":72,"pro":28,"fat":21,"portionG":450,"enName":"Khao Man Gai (Thai Chicken Rice)"},"카오무댕":{"kcal":560,"carb":74,"pro":26,"fat":18,"portionG":400,"enName":"Khao Mu Daeng (Red Pork Rice)"},"카오소이":{"kcal":540,"carb":58,"pro":22,"fat":25,"portionG":450,"enName":"Khao Soi"},"카오카무":{"kcal":610,"carb":72,"pro":27,"fat":24,"portionG":450,"enName":"Khao Kha Mu (Thai Braised Pork Leg Rice)"},"카오팟":{"kcal":580,"carb":78,"pro":18,"fat":22,"portionG":400,"enName":"Khao Pad (Thai Fried Rice)"},"카오팟꿍":{"kcal":560,"carb":76,"pro":19,"fat":20,"portionG":400,"enName":"Khao Pad Kung (Shrimp Fried Rice)"},"카오팟 끄라파오":{"kcal":620,"carb":75,"pro":24,"fat":25,"portionG":400,"enName":"Khao Pad Krapao"},"카이 지아우 무쌉":{"kcal":340,"carb":6,"pro":16,"fat":28,"portionG":180,"enName":"Khai Jiao Mu Sap (Thai Minced Pork Omelette)"},"깐 까 우아":{"kcal":410,"carb":14,"pro":28,"fat":27,"portionG":300,"enName":"Canh Chua (Vietnamese Sour Soup)"},"가케소바":{"kcal":320,"carb":64,"pro":11,"fat":2,"portionG":400,"enName":"Kake Soba"},"카키아게":{"kcal":280,"carb":22,"pro":3,"fat":20,"portionG":100,"enName":"Kakiage (Mixed Tempura)"},"카포나타":{"kcal":140,"carb":14,"pro":2,"fat":9,"portionG":150,"enName":"Caponata"},"카프레제샐러드":{"kcal":260,"carb":6,"pro":12,"fat":21,"portionG":200,"enName":"Caprese Salad"},"카프타 그릴":{"kcal":380,"carb":4,"pro":26,"fat":30,"portionG":200,"enName":"Kafta Grill (Lebanese Meatball Skewer)"},"똠 카 카이":{"kcal":290,"carb":11,"pro":16,"fat":21,"portionG":350,"enName":"Khanom Khai (Thai Steamed Egg)"},"칼국수":{"kcal":410,"carb":82,"pro":12,"fat":4,"portionG":500,"enName":"Kalguksu (Knife-cut Noodle Soup)"},"칼데레타":{"kcal":420,"carb":14,"pro":28,"fat":28,"portionG":300,"enName":"Caldereta (Filipino Beef Stew)"},"칼데이라다":{"kcal":310,"carb":16,"pro":26,"fat":15,"portionG":400,"enName":"Caldeirada (Portuguese Fish Stew)"},"캅카이":{"kcal":240,"carb":18,"pro":14,"fat":14,"portionG":300,"enName":"Khap Kai"},"캐롯케이크":{"kcal":410,"carb":52,"pro":4,"fat":21,"portionG":120,"enName":"Carrot Cake"},"커리치킨반미":{"kcal":490,"carb":58,"pro":21,"fat":19,"portionG":250,"enName":"Curry Chicken Banh Mi"},"케랄라새우커리":{"kcal":320,"carb":12,"pro":22,"fat":21,"portionG":300,"enName":"Kerala Prawn Curry"},"케랍 아얌":{"kcal":260,"carb":8,"pro":24,"fat":15,"portionG":200,"enName":"Kerabu Ayam (Malaysian Chicken Salad)"},"키마 마타르":{"kcal":340,"carb":16,"pro":22,"fat":21,"portionG":250,"enName":"Keema Matar (Minced Meat and Peas)"},"케프타 타진":{"kcal":390,"carb":12,"pro":24,"fat":28,"portionG":300,"enName":"Kefta Tagine"},"코다리조림":{"kcal":220,"carb":12,"pro":26,"fat":6,"portionG":200,"enName":"Braised Semi-dried Pollock"},"코로케":{"kcal":310,"carb":32,"pro":5,"fat":18,"portionG":120,"enName":"Korokke (Croquette)"},"코시도":{"kcal":430,"carb":28,"pro":26,"fat":24,"portionG":400,"enName":"Cocido (Spanish Chickpea Stew)"},"코울슬로":{"kcal":120,"carb":14,"pro":1,"fat":7,"portionG":100,"enName":"Coleslaw"},"코지두 아 포르투게자":{"kcal":490,"carb":24,"pro":34,"fat":29,"portionG":450,"enName":"Cozido à Portuguesa"},"코코뱅":{"kcal":380,"carb":12,"pro":32,"fat":16,"portionG":350,"enName":"Coq au Vin"},"코프타 케밥":{"kcal":390,"carb":5,"pro":24,"fat":31,"portionG":200,"enName":"Kofta Kebab"},"코프테":{"kcal":320,"carb":4,"pro":21,"fat":25,"portionG":150,"enName":"Köfte (Turkish Meatballs)"},"콘치즈":{"kcal":340,"carb":24,"pro":6,"fat":24,"portionG":150,"enName":"Corn Cheese"},"콥샐러드":{"kcal":360,"carb":9,"pro":22,"fat":26,"portionG":300,"enName":"Cobb Salad"},"콩국수":{"kcal":510,"carb":74,"pro":22,"fat":14,"portionG":550,"enName":"Kong Guksu (Cold Soy Milk Noodles)"},"콩나물국":{"kcal":40,"carb":4,"pro":3,"fat":2,"portionG":300,"enName":"Bean Sprout Soup"},"콩나물국밥":{"kcal":320,"carb":62,"pro":11,"fat":3,"portionG":500,"enName":"Bean Sprout Rice Soup"},"콩나물냉국수":{"kcal":360,"carb":72,"pro":9,"fat":3,"portionG":500,"enName":"Cold Bean Sprout Noodles"},"콩나물무침":{"kcal":30,"carb":3,"pro":2,"fat":1,"portionG":50,"enName":"Seasoned Bean Sprouts"},"콩나물밥":{"kcal":380,"carb":76,"pro":9,"fat":4,"portionG":400,"enName":"Bean Sprout Rice"},"콩나물해장국":{"kcal":310,"carb":58,"pro":12,"fat":3,"portionG":500,"enName":"Bean Sprout Hangover Soup"},"콩비지찌개":{"kcal":190,"carb":10,"pro":14,"fat":11,"portionG":300,"enName":"Soybean Pulp Stew"},"쾨프테":{"kcal":320,"carb":4,"pro":21,"fat":25,"portionG":150,"enName":"Köfte"},"쿠르제트수프":{"kcal":130,"carb":11,"pro":3,"fat":9,"portionG":350,"enName":"Courgette Soup (Zucchini Soup)"},"쿠스쿠스":{"kcal":170,"carb":36,"pro":6,"fat":0,"portionG":150,"enName":"Couscous"},"쿠스쿠스 로얄":{"kcal":560,"carb":54,"pro":32,"fat":24,"portionG":450,"enName":"Couscous Royal"},"쿵파오치킨":{"kcal":380,"carb":16,"pro":24,"fat":24,"portionG":250,"enName":"Kung Pao Chicken"},"퀘사디야":{"kcal":540,"carb":42,"pro":24,"fat":31,"portionG":250,"enName":"Quesadilla"},"퀴노아채소볼":{"kcal":240,"carb":34,"pro":7,"fat":9,"portionG":200,"enName":"Quinoa Vegetable Bowl"},"크레프":{"kcal":190,"carb":26,"pro":5,"fat":7,"portionG":100,"enName":"Crêpe"},"크로크무슈":{"kcal":430,"carb":34,"pro":18,"fat":25,"portionG":180,"enName":"Croque Monsieur"},"크리스피 파타":{"kcal":820,"carb":2,"pro":64,"fat":62,"portionG":350,"enName":"Crispy Pata (Filipino Crispy Pork Knuckle)"},"크림브로콜리수프":{"kcal":210,"carb":16,"pro":5,"fat":15,"portionG":300,"enName":"Cream of Broccoli Soup"},"크림새우":{"kcal":410,"carb":34,"pro":14,"fat":24,"portionG":200,"enName":"Creamy Shrimp"},"크림소스연어":{"kcal":420,"carb":6,"pro":31,"fat":30,"portionG":250,"enName":"Salmon in Cream Sauce"},"크림수프":{"kcal":180,"carb":18,"pro":4,"fat":11,"portionG":300,"enName":"Cream Soup"},"크림파스타":{"kcal":620,"carb":68,"pro":18,"fat":32,"portionG":350,"enName":"Cream Pasta"},"크메르레드커리":{"kcal":390,"carb":16,"pro":24,"fat":26,"portionG":350,"enName":"Khmer Red Curry"},"클램차우더":{"kcal":240,"carb":22,"pro":9,"fat":13,"portionG":300,"enName":"Clam Chowder"},"클럽샌드위치":{"kcal":480,"carb":38,"pro":24,"fat":26,"portionG":250,"enName":"Club Sandwich"},"클레프티코":{"kcal":540,"carb":8,"pro":34,"fat":42,"portionG":350,"enName":"Kleftiko (Greek Slow-roasted Lamb)"},"키마커리":{"kcal":360,"carb":14,"pro":21,"fat":24,"portionG":250,"enName":"Keema Curry"},"키베":{"kcal":340,"carb":22,"pro":18,"fat":20,"portionG":150,"enName":"Kibbeh"},"키슈 로렌":{"kcal":420,"carb":24,"pro":12,"fat":31,"portionG":150,"enName":"Quiche Lorraine"},"키츠네우동":{"kcal":410,"carb":68,"pro":13,"fat":9,"portionG":500,"enName":"Kitsune Udon (Fox Udon)"},"킬라윈":{"kcal":180,"carb":6,"pro":22,"fat":8,"portionG":200,"enName":"Kinilaw (Filipino Ceviche)"},"타마고산도":{"kcal":390,"carb":38,"pro":11,"fat":22,"portionG":180,"enName":"Tamago Sando (Egg Sandwich)"},"타북 수유":{"kcal":310,"carb":11,"pro":24,"fat":19,"portionG":250,"enName":"Tabbouleh"},"타불레":{"kcal":160,"carb":21,"pro":4,"fat":7,"portionG":150,"enName":"Tabbouleh"},"타쉬 쾨프테":{"kcal":360,"carb":12,"pro":22,"fat":24,"portionG":250,"enName":"Taş Köfte"},"타코":{"kcal":290,"carb":24,"pro":15,"fat":15,"portionG":150,"enName":"Taco"},"타코야키":{"kcal":260,"carb":34,"pro":7,"fat":11,"portionG":150,"enName":"Takoyaki (Octopus Balls)"},"탄두리연어":{"kcal":270,"carb":3,"pro":28,"fat":16,"portionG":180,"enName":"Tandoori Salmon"},"탄두리치킨":{"kcal":290,"carb":4,"pro":34,"fat":15,"portionG":200,"enName":"Tandoori Chicken"},"탄탄면":{"kcal":620,"carb":78,"pro":21,"fat":25,"portionG":550,"enName":"Dan Dan Noodles"},"탕수육":{"kcal":460,"carb":44,"pro":16,"fat":24,"portionG":200,"enName":"Tangsuyuk (Sweet and Sour Pork)"},"터키식 필라프":{"kcal":380,"carb":54,"pro":7,"fat":15,"portionG":250,"enName":"Turkish Pilaf"},"텐동":{"kcal":750,"carb":98,"pro":18,"fat":32,"portionG":450,"enName":"Tendon (Tempura Rice Bowl)"},"텐푸라 우동":{"kcal":490,"carb":78,"pro":15,"fat":13,"portionG":550,"enName":"Tempura Udon"},"템페고랭":{"kcal":310,"carb":14,"pro":16,"fat":22,"portionG":150,"enName":"Tempe Goreng (Fried Tempeh)"},"토르탕 탈롱":{"kcal":240,"carb":8,"pro":11,"fat":18,"portionG":200,"enName":"Tortang Talong (Filipino Eggplant Omelette)"},"토르티야수프":{"kcal":210,"carb":22,"pro":11,"fat":9,"portionG":350,"enName":"Tortilla Soup"},"토리파이탄":{"kcal":580,"carb":68,"pro":28,"fat":22,"portionG":550,"enName":"Tori Paitan (Chicken Broth Ramen)"},"토마토계란볶음":{"kcal":210,"carb":8,"pro":9,"fat":16,"portionG":200,"enName":"Tomato and Egg Stir-fry"},"토마토달걀볶음":{"kcal":210,"carb":8,"pro":9,"fat":16,"portionG":200,"enName":"Tomato and Egg Stir-fry"},"토마토달걀수프":{"kcal":110,"carb":7,"pro":5,"fat":7,"portionG":350,"enName":"Tomato and Egg Soup"},"토마토브루스케타":{"kcal":180,"carb":24,"pro":4,"fat":8,"portionG":120,"enName":"Tomato Bruschetta"},"토마토수프":{"kcal":120,"carb":16,"pro":3,"fat":5,"portionG":300,"enName":"Tomato Soup"},"토마토파스타":{"kcal":420,"carb":68,"pro":12,"fat":11,"portionG":350,"enName":"Tomato Pasta"},"토마호크스테이크":{"kcal":780,"carb":0,"pro":68,"fat":56,"portionG":350,"enName":"Tomahawk Steak"},"토스타다":{"kcal":340,"carb":28,"pro":16,"fat":18,"portionG":200,"enName":"Tostada"},"토시로그":{"kcal":580,"carb":52,"pro":28,"fat":26,"portionG":350,"enName":"Tosilog (Filipino Tocino"},"튜나샌드위치":{"kcal":390,"carb":34,"pro":19,"fat":19,"portionG":200,"enName":"Tuna Sandwich"},"티놀라":{"kcal":210,"carb":8,"pro":24,"fat":9,"portionG":400,"enName":"Tinola (Filipino Chicken Soup)"},"티로피타":{"kcal":360,"carb":24,"pro":9,"fat":26,"portionG":120,"enName":"Tiropita (Greek Cheese Pie)"},"티본스테이크":{"kcal":640,"carb":0,"pro":58,"fat":46,"portionG":300,"enName":"T-bone Steak"},"파기름파스타":{"kcal":440,"carb":64,"pro":9,"fat":16,"portionG":300,"enName":"Scallion Oil Pasta"},"파낭 커리":{"kcal":420,"carb":15,"pro":26,"fat":29,"portionG":300,"enName":"Panang Curry"},"파니르 티카":{"kcal":290,"carb":8,"pro":16,"fat":22,"portionG":200,"enName":"Paneer Tikka"},"파르망티에":{"kcal":410,"carb":32,"pro":22,"fat":21,"portionG":300,"enName":"Parmentier (French Shepherd's Pie)"},"파소울라다":{"kcal":260,"carb":34,"pro":11,"fat":9,"portionG":350,"enName":"Fasolada (Greek Bean Soup)"},"파스티치오":{"kcal":540,"carb":46,"pro":26,"fat":28,"portionG":350,"enName":"Pastitsio (Greek Baked Pasta)"},"파에야":{"kcal":520,"carb":74,"pro":24,"fat":14,"portionG":400,"enName":"Paella"},"파인애플볶음밥":{"kcal":590,"carb":88,"pro":14,"fat":20,"portionG":400,"enName":"Pineapple Fried Rice"},"파전":{"kcal":290,"carb":34,"pro":7,"fat":14,"portionG":150,"enName":"Pajeon (Scallion Pancake)"},"파코라":{"kcal":260,"carb":24,"pro":6,"fat":15,"portionG":120,"enName":"Pakora"},"파타타스 브라바스":{"kcal":280,"carb":36,"pro":4,"fat":14,"portionG":200,"enName":"Patatas Bravas"},"파투쉬":{"kcal":140,"carb":16,"pro":3,"fat":7,"portionG":180,"enName":"Fattoush"},"파파스 아루가다스":{"kcal":130,"carb":26,"pro":3,"fat":2,"portionG":150,"enName":"Papa a la Huancaína (Peruvian Potato)"},"판싯":{"kcal":420,"carb":58,"pro":16,"fat":14,"portionG":300,"enName":"Pancit (Filipino Noodles)"},"판싯 비혼":{"kcal":390,"carb":56,"pro":15,"fat":12,"portionG":300,"enName":"Pancit Bihay"},"판싯칸톤":{"kcal":440,"carb":62,"pro":16,"fat":15,"portionG":300,"enName":"Pancit Canton"},"팔락 알루":{"kcal":190,"carb":18,"pro":4,"fat":12,"portionG":250,"enName":"Palak Aloo (Spinach and Potato)"},"팔라펠":{"kcal":330,"carb":32,"pro":11,"fat":18,"portionG":150,"enName":"Falafel"},"팔락 파니르":{"kcal":260,"carb":11,"pro":12,"fat":20,"portionG":250,"enName":"Palak Paneer"},"팔보채":{"kcal":240,"carb":14,"pro":22,"fat":12,"portionG":250,"enName":"Palbochae (Eight Treasure Stir-fry)"},"팟 끄라파오 무쌉":{"kcal":340,"carb":8,"pro":22,"fat":24,"portionG":200,"enName":"Pad Krapao Mu Sap (Thai Basil Minced Pork)"},"팟나":{"kcal":460,"carb":58,"pro":18,"fat":17,"portionG":350,"enName":"Pad Na (Thai Sauce Noodles)"},"팟씨유":{"kcal":520,"carb":64,"pro":19,"fat":21,"portionG":350,"enName":"Pad See Ew"},"팟타이":{"kcal":560,"carb":72,"pro":21,"fat":21,"portionG":350,"enName":"Pad Thai"},"팟 팍붕 파이댕":{"kcal":90,"carb":6,"pro":3,"fat":6,"portionG":150,"enName":"Pad Pak Bung Fai Daeng (Stir-fried Morning Glory)"},"팟 카나":{"kcal":95,"carb":7,"pro":4,"fat":6,"portionG":150,"enName":"Pad Pak Khana (Stir-fried Chinese Broccoli)"},"팟프리킹":{"kcal":360,"carb":11,"pro":24,"fat":24,"portionG":250,"enName":"Pad Prik King (Dry Red Curry Stir-fry)"},"팥죽":{"kcal":320,"carb":66,"pro":9,"fat":2,"portionG":350,"enName":"Patjuk (Red Bean Porridge)"},"파니르 도 피아자":{"kcal":340,"carb":12,"pro":14,"fat":26,"portionG":250,"enName":"Paneer Do Pyaza"},"팬케이크":{"kcal":330,"carb":52,"pro":7,"fat":10,"portionG":150,"enName":"Pancake"},"팽이버섯볶음":{"kcal":65,"carb":5,"pro":2,"fat":4,"portionG":100,"enName":"Stir-fried Enoki Mushrooms"},"팽이버섯전골":{"kcal":160,"carb":14,"pro":8,"fat":8,"portionG":400,"enName":"Enoki Mushroom Hot Pot"},"퍼가":{"kcal":380,"carb":64,"pro":24,"fat":3,"portionG":550,"enName":"Pho Ga (Vietnamese Chicken Noodle Soup)"},"퍼싸오":{"kcal":510,"carb":68,"pro":18,"fat":19,"portionG":350,"enName":"Pho Xao (Stir-fried Pho Noodles)"},"페센베크":{"kcal":440,"carb":24,"pro":26,"fat":28,"portionG":300,"enName":"Fesenjān (Persian Walnut and Pomegranate Stew)"},"페스토파스타":{"kcal":520,"carb":58,"pro":11,"fat":28,"portionG":320,"enName":"Pesto Pasta"},"페퍼로니피자":{"kcal":540,"carb":52,"pro":22,"fat":27,"portionG":200,"enName":"Pepperoni Pizza"},"평양냉면":{"kcal":380,"carb":78,"pro":14,"fat":2,"portionG":600,"enName":"Pyongyang Naengmyeon (Cold Noodles)"},"포졸레":{"kcal":290,"carb":21,"pro":22,"fat":13,"portionG":400,"enName":"Pozole"},"포카치아":{"kcal":250,"carb":44,"pro":7,"fat":5,"portionG":100,"enName":"Focaccia"},"포케":{"kcal":490,"carb":62,"pro":24,"fat":16,"portionG":400,"enName":"Poke Bowl"},"포크시시그":{"kcal":420,"carb":4,"pro":28,"fat":32,"portionG":200,"enName":"Pork Sisig"},"포크아도보":{"kcal":390,"carb":7,"pro":31,"fat":26,"portionG":250,"enName":"Pork Adobo"},"포터하우스스테이크":{"kcal":740,"carb":0,"pro":66,"fat":52,"portionG":350,"enName":"Porterhouse Steak"},"폴렌타":{"kcal":150,"carb":28,"pro":4,"fat":2,"portionG":200,"enName":"Polenta"},"폴포살라다":{"kcal":180,"carb":12,"pro":16,"fat":8,"portionG":200,"enName":"Polpo Salada (Octopus Salad)"},"푸팟퐁커리":{"kcal":440,"carb":22,"pro":19,"fat":31,"portionG":300,"enName":"Poo Pad Pong Curry"},"풀드포크":{"kcal":320,"carb":14,"pro":24,"fat":18,"portionG":150,"enName":"Pulled Pork"},"풀포 아 라 가예가":{"kcal":220,"carb":6,"pro":22,"fat":12,"portionG":200,"enName":"Pulpo a la Gallega (Galician Octopus)"},"프라이드 피타":{"kcal":220,"carb":32,"pro":4,"fat":8,"portionG":80,"enName":"Fried Pita"},"프렌치 어니언 수프":{"kcal":190,"carb":18,"pro":8,"fat":9,"portionG":300,"enName":"French Onion Soup"},"프렌치토스트":{"kcal":340,"carb":42,"pro":10,"fat":14,"portionG":150,"enName":"French Toast"},"토마토 프로방살":{"kcal":110,"carb":12,"pro":2,"fat":6,"portionG":150,"enName":"Provençal Tomatoes"},"프론 미":{"kcal":420,"carb":64,"pro":24,"fat":8,"portionG":500,"enName":"Prawn Mee (Shrimp Noodle Soup)"},"프리타타":{"kcal":240,"carb":6,"pro":16,"fat":17,"portionG":180,"enName":"Frittata"},"피나크벳":{"kcal":160,"carb":14,"pro":8,"fat":8,"portionG":250,"enName":"Pinakbet (Filipino Vegetable Stew)"},"피단두부무침":{"kcal":180,"carb":8,"pro":14,"fat":10,"portionG":200,"enName":"Century Egg and Tofu"},"피데":{"kcal":540,"carb":62,"pro":21,"fat":22,"portionG":250,"enName":"Pide (Turkish Flatbread Pizza)"},"피미엔토 데 파드론":{"kcal":120,"carb":8,"pro":2,"fat":9,"portionG":100,"enName":"Pimientos de Padrón"},"피시볼 국":{"kcal":210,"carb":18,"pro":16,"fat":8,"portionG":400,"enName":"Fish Ball Soup"},"피시 앤 칩스":{"kcal":580,"carb":48,"pro":24,"fat":32,"portionG":300,"enName":"Fish and Chips"},"피시타코":{"kcal":360,"carb":32,"pro":18,"fat":16,"portionG":200,"enName":"Fish Taco"},"피시헤드커리":{"kcal":380,"carb":18,"pro":32,"fat":20,"portionG":400,"enName":"Fish Head Curry"},"하리라":{"kcal":240,"carb":32,"pro":12,"fat":6,"portionG":350,"enName":"Harira (Moroccan Lamb Soup)"},"하몬 크로케타":{"kcal":320,"carb":26,"pro":8,"fat":20,"portionG":120,"enName":"Jamón Croqueta (Ham Croquette)"},"하이난치킨라이스":{"kcal":610,"carb":74,"pro":32,"fat":19,"portionG":450,"enName":"Hainanese Chicken Rice"},"하이라이스":{"kcal":580,"carb":94,"pro":14,"fat":16,"portionG":450,"enName":"Hayashi Rice"},"할루미구이":{"kcal":320,"carb":2,"pro":21,"fat":26,"portionG":100,"enName":"Grilled Halloumi"},"함박스테이크":{"kcal":410,"carb":14,"pro":24,"fat":28,"portionG":200,"enName":"Hambak Steak (Japanese-style Hamburger Steak)"},"함흥냉면":{"kcal":430,"carb":91,"pro":11,"fat":3,"portionG":550,"enName":"Hamheung Naengmyeon (Cold Noodles)"},"해물누룽지탕":{"kcal":310,"carb":38,"pro":19,"fat":9,"portionG":400,"enName":"Seafood Scorched Rice Soup"},"해물순두부찌개":{"kcal":160,"carb":8,"pro":14,"fat":8,"portionG":300,"enName":"Seafood Soft Tofu Stew"},"해물잡채":{"kcal":230,"carb":32,"pro":7,"fat":8,"portionG":150,"enName":"Seafood Japchae"},"해물전골":{"kcal":260,"carb":14,"pro":28,"fat":10,"portionG":450,"enName":"Seafood Hot Pot"},"해물파전":{"kcal":380,"carb":44,"pro":12,"fat":16,"portionG":200,"enName":"Seafood Scallion Pancake"},"해산물리조또":{"kcal":520,"carb":72,"pro":22,"fat":14,"portionG":400,"enName":"Seafood Risotto"},"해산물파스타":{"kcal":480,"carb":68,"pro":21,"fat":12,"portionG":350,"enName":"Seafood Pasta"},"해파리냉채":{"kcal":110,"carb":12,"pro":6,"fat":4,"portionG":150,"enName":"Cold Jellyfish Salad"},"햄버거":{"kcal":480,"carb":38,"pro":24,"fat":26,"portionG":200,"enName":"Hamburger"},"현미채소덮밥":{"kcal":410,"carb":78,"pro":9,"fat":6,"portionG":400,"enName":"Brown Rice Vegetable Bowl"},"현미채소볶음밥":{"kcal":460,"carb":74,"pro":9,"fat":12,"portionG":350,"enName":"Brown Rice Vegetable Fried Rice"},"호르타":{"kcal":90,"carb":6,"pro":2,"fat":7,"portionG":150,"enName":"Horta (Greek Boiled Greens)"},"호박나물":{"kcal":30,"carb":4,"pro":1,"fat":1,"portionG":50,"enName":"Seasoned Zucchini"},"호박전":{"kcal":120,"carb":14,"pro":3,"fat":6,"portionG":100,"enName":"Zucchini Pancake"},"호박죽":{"kcal":210,"carb":48,"pro":3,"fat":1,"portionG":300,"enName":"Pumpkin Porridge"},"홍샤오러우":{"kcal":540,"carb":12,"pro":18,"fat":48,"portionG":200,"enName":"Red-braised Pork"},"홍합탕":{"kcal":90,"carb":6,"pro":12,"fat":2,"portionG":400,"enName":"Mussel Soup"},"황기닭백숙":{"kcal":340,"carb":4,"pro":38,"fat":18,"portionG":450,"enName":"Astragalus Chicken Soup"},"황태구이":{"kcal":180,"carb":8,"pro":24,"fat":5,"portionG":120,"enName":"Grilled Dried Pollack"},"황태국":{"kcal":80,"carb":2,"pro":12,"fat":3,"portionG":300,"enName":"Dried Pollack Soup"},"황태해장국":{"kcal":90,"carb":3,"pro":13,"fat":3,"portionG":350,"enName":"Dried Pollack Hangover Soup"},"후이궈러우":{"kcal":480,"carb":11,"pro":22,"fat":39,"portionG":250,"enName":"Twice-cooked Pork (Huiguorou)"},"회냉면":{"kcal":470,"carb":92,"pro":18,"fat":4,"portionG":550,"enName":"Raw Fish Cold Noodles"},"후무스":{"kcal":170,"carb":14,"pro":5,"fat":10,"portionG":100,"enName":"Hummus"},"훈제연어파스타":{"kcal":560,"carb":66,"pro":24,"fat":21,"portionG":350,"enName":"Smoked Salmon Pasta"},"훈제오리볶음":{"kcal":390,"carb":4,"pro":21,"fat":33,"portionG":150,"enName":"Stir-fried Smoked Duck"},"훈제오리샐러드":{"kcal":280,"carb":11,"pro":15,"fat":19,"portionG":250,"enName":"Smoked Duck Salad"},"훠궈":{"kcal":520,"carb":18,"pro":32,"fat":36,"portionG":450,"enName":"Huoguo (Hot Pot)"},"히레카츠":{"kcal":390,"carb":16,"pro":27,"fat":23,"portionG":150,"enName":"Hire Katsu (Pork Fillet Cutlet)"},"히야시추카":{"kcal":460,"carb":76,"pro":14,"fat":10,"portionG":450,"enName":"Hiyashi Chuka (Cold Chinese Noodles)"},"BLT 샌드위치":{"kcal":450,"carb":36,"pro":16,"fat":26,"portionG":220,"enName":"BLT Sandwich"}});
  window.WM_MENU_NUTRITION_DB = WM_MENU_NUTRITION_DB;
  function _wmRound(x){ return Math.round((Number(x)||0)); }
  function _wmResolveMenuName(name){
    if(!name) return null;
    const raw = String(name).trim();
    if(WM_MENU_NUTRITION_DB[raw]) return raw;
    try{
      if(typeof NAME_MAP === 'object' && NAME_MAP[raw] && WM_MENU_NUTRITION_DB[NAME_MAP[raw]]) return NAME_MAP[raw];
    }catch(e){}
    try{
      if(typeof flowMenuDBName === 'function'){
        const mapped = flowMenuDBName(raw);
        if(mapped && WM_MENU_NUTRITION_DB[mapped]) return mapped;
      }
    }catch(e){}
    const compact = raw.replace(/\s+/g,'');
    if(WM_MENU_NUTRITION_DB[compact]) return compact;
    const found = Object.keys(WM_MENU_NUTRITION_DB).find(k => k.replace(/\s+/g,'') === compact);
    return found || null;
  }
  const __wmOldCalcNutrition = (typeof window.calcNutrition === 'function') ? window.calcNutrition : null;
  const __wmOldGetMenuNut = (typeof window.getMenuNut === 'function') ? window.getMenuNut : null;

  function _wmNutritionFromDB(menuName, people){
    const key = _wmResolveMenuName(menuName);
    if(!key) return null;
    const n = WM_MENU_NUTRITION_DB[key];
    const p = Math.max(1, Number(people)||1);
    const cal = _wmRound(n.kcal * p);
    const lo = _wmRound(cal * 0.95);
    const hi = _wmRound(cal * 1.05);
    return {
      cal: cal,
      calLo: lo,
      calHi: hi,
      calRange: lo + '~' + hi + 'kcal',
      carb: _wmRound((n.carb||0) * p),
      pro: _wmRound((n.pro||0) * p),
      fat: _wmRound((n.fat||0) * p),
      portionG: n.portionG || null,
      enName: n.enName || '',
      verified: true,
      source: '메뉴별 검증 영양DB',
      menuName: key
    };
  }

  window.getMenuNut = getMenuNut = function(name){
    const dbNut = _wmNutritionFromDB(name, 1);
    if(dbNut) return dbNut;
    if(__wmOldGetMenuNut) return __wmOldGetMenuNut(name);
    return {cal:0, carb:0, fat:0, pro:0, verified:false, source:'미등록'};
  };

  window.calcNutrition = calcNutrition = function(menuName, people){
    const dbNut = _wmNutritionFromDB(menuName, people || 1);
    if(dbNut) return dbNut;
    if(__wmOldCalcNutrition) return __wmOldCalcNutrition(menuName, people || 1);
    return null;
  };

  // MENU_DB / MENU_SCHEMA_V2에 영문명과 검증 영양값 메타데이터를 덧붙임
  function _wmAttachMeta(dict){
    if(!dict || typeof dict !== 'object') return;
    Object.keys(dict).forEach(function(k){
      const key = _wmResolveMenuName(k);
      if(!key) return;
      const n = WM_MENU_NUTRITION_DB[key];
      const obj = dict[k];
      if(obj && typeof obj === 'object'){
        obj.kcal = n.kcal;
        obj.carb = n.carb;
        obj.pro = n.pro;
        obj.fat = n.fat;
        obj.portionG = n.portionG || obj.portionG;
        obj.nutritionSource = '메뉴별 검증 영양DB';
        obj.nutritionVerified = true;
        if(n.enName) obj.enName = n.enName;
      }
    });
  }
  _wmAttachMeta(typeof MENU_DB !== 'undefined' ? MENU_DB : null);
  _wmAttachMeta(typeof MENU_SCHEMA_V2 !== 'undefined' ? MENU_SCHEMA_V2 : null);

  window.WM_NUTRITION_DB_MODE = 'menu_first_verified_db';
  window.WM_NUTRITION_DB_COUNT = Object.keys(WM_MENU_NUTRITION_DB).length;
})();
/* ===== /menu-nutrition-db-logic-v1 ===== */


/* ===== nutrition-display-one-serving-fix ===== */
(function(){
  // 메뉴 카드/추천/식단표의 kcal 표시는 항상 1인분 기준으로 고정한다.
  // S.people은 장보기 수량 계산에만 사용한다.
  window.WM_NUTRITION_DISPLAY_MODE = 'one_serving_menu_kcal';
  if (typeof window.kcalText === 'function') {
    window.kcalText = kcalText = function(name){
      try{
        var nut = (typeof calcNutrition === 'function') ? calcNutrition(name, 1) : null;
        if(!nut) return '';
        return nut.calRange || ((nut.cal || nut.kcal || 0) + 'kcal');
      }catch(e){ return ''; }
    };
  }
})();
/* ===== /nutrition-display-one-serving-fix ===== */


/* ===== diary-date-guard-fix-v1 ===== */
(function(){
  function _wmPadDateKey(key){
    if(!key) return '';
    var p=String(key).split('-').map(function(x){return parseInt(x,10);});
    if(p.length<3 || p.some(function(n){return isNaN(n);})){ return String(key); }
    return p[0]+'-'+String(p[1]).padStart(2,'0')+'-'+String(p[2]).padStart(2,'0');
  }
  function _wmTodayKey(){
    if(typeof todayKey==='function') return todayKey();
    var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  function _wmDateAdd(key,days){
    if(!key) return '';
    var p=String(key).split('-').map(function(x){return parseInt(x,10);});
    if(p.length<3 || p.some(function(n){return isNaN(n);})){ return ''; }
    var d=new Date(p[0],p[1]-1,p[2]);
    d.setDate(d.getDate()+days);
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }
  function _wmIsFuture(key){
    if(!key) return false;
    return _wmPadDateKey(key) > _wmPadDateKey(_wmTodayKey());
  }
  function _wmDiaryPopup(msg){
    try{
      var overlay=document.createElement('div');
      overlay.style.cssText='position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px)';
      var box=document.createElement('div');
      box.style.cssText='background:#fff;border-radius:22px;padding:24px;max-width:320px;width:100%;text-align:center;box-shadow:0 24px 70px rgba(15,23,42,.22)';
      box.innerHTML='<div style="font-size:34px;margin-bottom:10px">⏳</div><div style="font-weight:900;font-size:17px;margin-bottom:8px;color:#111827">'+msg+'</div><div style="font-size:12px;color:#8B95A1;line-height:1.5;margin-bottom:18px">해당 날짜가 된 후 식단 일기에 추가할 수 있어요.</div><button style="width:100%;padding:13px;border:0;border-radius:14px;background:var(--primary);color:#fff;font-weight:800;font-size:14px;cursor:pointer">확인</button>';
      box.querySelector('button').onclick=function(){overlay.remove();};
      overlay.onclick=function(e){if(e.target===overlay) overlay.remove();};
      overlay.appendChild(box); document.body.appendChild(overlay);
    }catch(e){ alert(msg); }
  }
  function _wmMealDateFromWeekly(dayIdx){
    var start=S && S.mealStartDate ? S.mealStartDate : null;
    if(!start) return '';
    return _wmDateAdd(start, dayIdx||0);
  }

  var _oldSetCalMeal = window.setCalMeal;
  window.setCalMeal = setCalMeal = function(dateKeyArg, mealIdx){
    if(typeof _oldSetCalMeal==='function'){
      _oldSetCalMeal.apply(this, arguments);
      if(S && S.currentMeal){
        S.currentMealDate = dateKeyArg;
        S.currentMeal._dateKey = dateKeyArg;
      }
    }
  };

  var _oldSetMealFromMonthly = window.setMealFromMonthly;
  window.setMealFromMonthly = setMealFromMonthly = function(dateKeyArg, mealIdx){
    if(typeof _oldSetMealFromMonthly==='function'){
      _oldSetMealFromMonthly.apply(this, arguments);
      if(S && S.currentMeal){
        S.currentMealDate = dateKeyArg;
        S.currentMeal._dateKey = dateKeyArg;
      }
    }
  };

  var _oldSetMeal = window.setMeal;
  window.setMeal = setMeal = function(dayIdx, mealIdx, backScreen){
    if(typeof _oldSetMeal==='function'){
      _oldSetMeal.apply(this, arguments);
      if(S && S.currentMeal){
        var k=_wmMealDateFromWeekly(dayIdx);
        if(k){ S.currentMealDate=k; S.currentMeal._dateKey=k; }
      }
    }
  };

  window.addToDiary = addToDiary = function(menuName, dateKeyOverride){
    var targetKey = dateKeyOverride || null;
    if(!targetKey && S && S.screen==='recipe'){
      targetKey = (S.currentMeal && S.currentMeal._dateKey) || S.currentMealDate || null;
    }
    if(!targetKey) targetKey = _wmTodayKey();

    if(_wmIsFuture(targetKey)){
      _wmDiaryPopup('아직 일정이 오지 않았어요');
      return false;
    }

    if(!S.mealDiary) S.mealDiary={};
    if(!S.mealDiary[targetKey]) S.mealDiary[targetKey]=[];
    var nut=(typeof calcNutrition==='function') ? calcNutrition(menuName,1) : null;
    S.mealDiary[targetKey].push({
      name:menuName,
      dateKey:targetKey,
      time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),
      cal:nut?(nut.cal||nut.kcal||0):0,
      pro:nut?(nut.pro||0):0,
      fat:nut?(nut.fat||0):0,
      carb:nut?(nut.carb||0):0
    });
    if(typeof saveMealDiary==='function') saveMealDiary();
    alert(menuName+' 식단 일기에 추가됐어요!');
    return true;
  };

  window.WM_DIARY_DATE_GUARD_MODE='meal_date_linked_no_future_add';
})();
/* ===== /diary-date-guard-fix-v1 ===== */


/* ===== meat-ingredient-audit-refine-v1 ===== */
(function(){
  function hasAny(s, arr){ s=String(s||''); return arr.some(function(w){return s.indexOf(w)>=0;}); }
  function clone(o){ try{return JSON.parse(JSON.stringify(o));}catch(e){return o;} }
  function catMap(cat){ return {protein:'단백질',dairy:'단백질',grain:'면·밥',veg:'채소',vegetable:'채소',seafood:'단백질',sauce:'양념',spice:'양념',condiment:'양념',nut:'기타',other:'기타'}[cat]||'기타'; }
  function addIng(id,name,amount,aliases,icon){
    if(typeof INGREDIENT_DB_V2==='object' && !INGREDIENT_DB_V2[id]){
      INGREDIENT_DB_V2[id]={id:id,name:name,category:'protein',aliases:aliases||[name],icon:icon||'🥩',defaultAmount:amount||'200g'};
    }
    if(typeof NUTRITION_DB==='object' && !NUTRITION_DB[name]){
      // kcal/pro/fat/carb per 100g-ish; 영양 표시 로직은 메뉴별 영양DB 우선이라 장보기/보조용으로만 사용
      var n={cal:200,pro:20,fat:12,carb:0};
      if(/닭/.test(name)) n={cal:165,pro:22,fat:8,carb:0};
      if(/가슴/.test(name)) n={cal:120,pro:24,fat:2,carb:0};
      if(/양지|불고기|홍두깨|다짐/.test(name)) n={cal:190,pro:20,fat:11,carb:0};
      if(/삼겹|목살|앞다리/.test(name)) n={cal:250,pro:17,fat:20,carb:0};
      NUTRITION_DB[name]=n;
    }
  }
  addIng('pork_shoulder','돼지앞다리살','220g',['돼지앞다리살','앞다리살','돼지불고기용'],'🥩');
  addIng('pork_neck','돼지목살','220g',['돼지목살','목살'],'🥩');
  addIng('pork_loin','돼지등심','200g',['돼지등심','등심','돈카츠용등심'],'🥩');
  addIng('pork_tenderloin','돼지안심','200g',['돼지안심','안심'],'🥩');
  addIng('ground_pork','돼지다짐육','200g',['돼지다짐육','다진돼지고기','돼지고기다짐육'],'🥩');
  addIng('beef_slices','소고기불고기용','200g',['소고기불고기용','불고기용소고기','얇은소고기'],'🥩');
  addIng('beef_brisket','소고기양지','220g',['소고기양지','양지','국거리용소고기'],'🥩');
  addIng('ground_beef','소고기다짐육','200g',['소고기다짐육','다진소고기'],'🥩');
  addIng('beef_round','소고기홍두깨살','200g',['소고기홍두깨살','홍두깨살','장조림용소고기'],'🥩');
  addIng('chicken_thigh','닭다리살','220g',['닭다리살','닭정육','순살닭다리살'],'🍗');
  addIng('whole_chicken','생닭','900g',['생닭','백숙용닭','삼계탕용닭'],'🍗');
  addIng('ground_chicken','닭다짐육','200g',['닭다짐육','다진닭고기'],'🍗');

  function choosePork(menu){
    if(hasAny(menu,['삼겹','묵은지삼겹','고추장삼겹'])) return 'pork_belly';
    if(hasAny(menu,['보쌈','수육','동파육','부타카쿠니','홍소육','오향장육','레촌카왈리','크리스피파타','포크아도보','포크시시그','바쿠테'])) return 'pork_belly';
    if(hasAny(menu,['돈카츠','돈까스','히레카츠','가츠','카츠산도','탕수육','꿔바로우'])) return 'pork_loin';
    if(hasAny(menu,['만두','완탕','딤섬','슈마이','멘치','난자완스','마파','라브','라르브','라프','라프무'])) return 'ground_pork';
    if(hasAny(menu,['갈비','등갈비'])) return 'pork_rib';
    if(hasAny(menu,['목살'])) return 'pork_neck';
    if(hasAny(menu,['제육','불고기','두루치기','김치찌개','찌개','잡채','볶음','야키소바','오코노미야키','고추잡채','꽃빵','카레','우동','라멘','반미','분짜','분팃느엉','짜조','룸피아','판싯','포솔레'])) return 'pork_shoulder';
    return 'pork_shoulder';
  }
  function chooseBeef(menu){
    if(hasAny(menu,['갈비','갈비탕','갈비찜','소갈비'])) return 'beef_rib';
    if(hasAny(menu,['장조림'])) return 'beef_round';
    if(hasAny(menu,['미역국','무국','뭇국','육개장','설렁탕','곰탕','국','탕','우육면','분보후에','쌀국수'])) return 'beef_brisket';
    if(hasAny(menu,['볼로네제','라자냐','미트볼','함박','타코','칠리','칠레콘카르네','부리또','케밥','코프타','코프테','쾨프테','키마','무사카','피데','라흐마준','만트','만두'])) return 'ground_beef';
    if(hasAny(menu,['불고기','규동','덮밥','볶음','비빔밥','잡채','샤브샤브','스키야키','니쿠자가','하이라이스','카레','차돌','마라탕','마라샹궈','훠궈','록락','로모','스테이크'])) return 'beef_slices';
    return 'beef_slices';
  }
  function chooseChicken(menu){
    if(hasAny(menu,['삼계탕','백숙','닭한마리','닭곰탕'])) return 'whole_chicken';
    if(hasAny(menu,['닭가슴살','치킨샐러드','시저랩','요거트볼','현미볼','닭가슴살랩','닭가슴살카레','닭가슴살채소'])) return 'chicken_breast';
    if(hasAny(menu,['날개','윙','봉'])) return 'chicken_wing';
    if(hasAny(menu,['완탕','만두','미트볼'])) return 'ground_chicken';
    if(hasAny(menu,['치킨카츠','가라아게','치킨난반','데리야키','닭갈비','닭볶음','닭볶음탕','찜닭','아도보','이나살','티카','탄두리','샤와르마','카레','커리','코르마','빈달루','파히타','타코','부리토','엔칠라다','팟파이','스튜','수프','나베','꼬치','구이'])) return 'chicken_thigh';
    return 'chicken_thigh';
  }
  function specificId(oldId, menu){
    var id=String(oldId||'');
    if(id==='pork') return choosePork(menu);
    if(id==='beef') return chooseBeef(menu);
    if(id==='chicken') return chooseChicken(menu);
    return id;
  }
  function specificName(oldName, menu){
    var n=String(oldName||'');
    if(n==='돼지고기') return ingredientNameOf ? ingredientNameOf(choosePork(menu)) : '돼지앞다리살';
    if(n==='소고기') return ingredientNameOf ? ingredientNameOf(chooseBeef(menu)) : '소고기불고기용';
    if(n==='닭고기') return ingredientNameOf ? ingredientNameOf(chooseChicken(menu)) : '닭다리살';
    return n;
  }
  function patchMenuDbEntry(menuName, db){
    if(!db || !Array.isArray(db.ingredients)) return;
    db.ingredients=db.ingredients.map(function(x){
      if(typeof x==='string') return specificName(x,menuName);
      var y=Object.assign({}, x);
      if(y.id) y.id=specificId(y.id,menuName);
      y.name=specificName(y.name || (y.id && typeof ingredientNameOf==='function'?ingredientNameOf(y.id):''), menuName);
      if(y.id && typeof ingredientObjOf==='function'){
        var obj=ingredientObjOf(y.id); y.name=obj.name; y.icon=y.icon||obj.icon; y.category=y.category||obj.category;
      }
      return y;
    });
    if(Array.isArray(db.ingredientIds)) db.ingredientIds=db.ingredientIds.map(function(id){return specificId(id,menuName);});
  }
  function patchSchemaEntry(menuName,row){
    if(!row || !Array.isArray(row.ingredients)) return;
    var oldAmounts=row.ingredientAmounts||{};
    var newAmounts={};
    row.ingredients=row.ingredients.map(function(id){
      var nid=specificId(id,menuName);
      if(oldAmounts[id]!==undefined && newAmounts[nid]===undefined) newAmounts[nid]=oldAmounts[id];
      return nid;
    });
    Object.keys(oldAmounts).forEach(function(k){ if(newAmounts[k]===undefined && !['pork','beef','chicken'].includes(k)) newAmounts[k]=oldAmounts[k]; });
    row.ingredientAmounts=newAmounts;
  }
  function patchCleanMenuRow(row){
    if(!row || !Array.isArray(row.ingredients)) return;
    row.ingredients=row.ingredients.map(function(x){return specificName(x,row.name||'');});
  }
  try{ if(typeof CLEAN_MENUS!=='undefined' && Array.isArray(CLEAN_MENUS)) CLEAN_MENUS.forEach(patchCleanMenuRow); }catch(e){}
  try{ if(typeof MENU_SCHEMA_V2==='object') Object.keys(MENU_SCHEMA_V2).forEach(function(n){patchSchemaEntry(n,MENU_SCHEMA_V2[n]);}); }catch(e){}
  try{ if(typeof MENU_DB==='object') Object.keys(MENU_DB).forEach(function(n){patchMenuDbEntry(n,MENU_DB[n]);}); }catch(e){}

  window.refineIngredient = function(name, menu){ return specificName(name, menu); };
  window.WM_MEAT_INGREDIENT_AUDIT = {
    version:'v1',
    genericNamesRemovedFromRuntimeMenuDB:['돼지고기','소고기','닭고기'],
    replacements:['돼지앞다리살','돼지목살','돼지등심','돼지안심','돼지다짐육','삼겹살','소고기불고기용','소고기양지','소고기다짐육','소고기홍두깨살','닭다리살','닭가슴살','생닭','닭다짐육']
  };
  try{ if(typeof render==='function') setTimeout(render,0); }catch(e){}
})();
/* ===== /meat-ingredient-audit-refine-v1 ===== */


/* ===== country-side-menu-nutrition-patch-v1 ===== */
/* ===== COUNTRY SIDE MENU + NUTRITION PATCH v1 =====
   목적:
   - 외국 메뉴에 한식 반찬이 추천되는 fallback 차단
   - 국가/스타일별 사이드 메뉴 2개씩 고정 추천
   - 사이드 메뉴도 1인분 kcal/탄수화물/단백질/지방 DB로 계산
*/
(function(){
  const SIDE_POOL = {
    korean:['김치','계란말이'],
    japanese:['미소시루','오이절임'],
    chinese:['중식오이냉채','청경채볶음'],
    western:['그린샐러드','크림수프'],
    italian:['카프레제샐러드','브루스케타'],
    american:['코울슬로','피클'],
    french:['프렌치 어니언 수프','바게트'],
    spanish:['파타타스 브라바스','피미엔토 데 파드론'],
    greek:['차지키','호르타'],
    thai:['쏨땀','얌운센'],
    vietnamese:['고이꾸온','도추아'],
    indonesian:['가도가도','삼발'],
    malaysian:['아차르','삼발 우당'],
    singapore:['차이 타우 궤','오타오타'],
    filipino:['아차라','엔살라당 탈롱'],
    taiwanese:['피단두부무침','대만식 오이무침'],
    indian:['라이타','파코라'],
    middleeast:['후무스','타불레'],
    turkish:['차지키','보렉'],
    mexican:['과카몰리','살사소스'],
    brazilian:['비나그레치','파로파'],
    argentinian:['치미추리','엠파나다'],
    peruvian:['살사 크리올라','카우사'],
    moroccan:['자알룩','모로칸 당근 샐러드'],
    ethiopian:['인제라','렌틸샐러드'],
    global:['그린샐러드','피클']
  };

  const SIDE_NUTRITION = {
    '김치':{kcal:25,carb:4,pro:1.5,fat:0.5,portionG:50,enName:'Kimchi'},
    '계란말이':{kcal:210,carb:3,pro:14,fat:16,portionG:120,enName:'Rolled Egg Omelette'},
    '미소시루':{kcal:45,carb:5,pro:3,fat:1.5,portionG:200,enName:'Miso Soup'},
    '오이절임':{kcal:25,carb:5,pro:1,fat:0.2,portionG:60,enName:'Pickled Cucumber'},
    '중식오이냉채':{kcal:60,carb:7,pro:2,fat:3,portionG:100,enName:'Chinese Cucumber Salad'},
    '청경채볶음':{kcal:80,carb:7,pro:3,fat:5,portionG:120,enName:'Stir-fried Bok Choy'},
    '그린샐러드':{kcal:80,carb:8,pro:2, fat:5,portionG:120,enName:'Green Salad'},
    '크림수프':{kcal:180,carb:16,pro:5,fat:11,portionG:200,enName:'Cream Soup'},
    '카프레제샐러드':{kcal:180,carb:5,pro:10,fat:13,portionG:150,enName:'Caprese Salad'},
    '브루스케타':{kcal:160,carb:22,pro:5,fat:6,portionG:100,enName:'Bruschetta'},
    '코울슬로':{kcal:150,carb:12,pro:2,fat:11,portionG:120,enName:'Coleslaw'},
    '피클':{kcal:18,carb:4,pro:0.5,fat:0.1,portionG:50,enName:'Pickles'},
    '프렌치 어니언 수프':{kcal:190,carb:18,pro:8,fat:9,portionG:300,enName:'French Onion Soup'},
    '바게트':{kcal:190,carb:38,pro:6,fat:1.5,portionG:70,enName:'Baguette'},
    '파타타스 브라바스':{kcal:280,carb:36,pro:4,fat:14,portionG:200,enName:'Patatas Bravas'},
    '피미엔토 데 파드론':{kcal:120,carb:8,pro:2,fat:9,portionG:100,enName:'Pimientos de Padrón'},
    '차지키':{kcal:70,carb:5,pro:4,fat:4,portionG:80,enName:'Tzatziki'},
    '호르타':{kcal:90,carb:6,pro:2,fat:7,portionG:150,enName:'Horta'},
    '쏨땀':{kcal:120,carb:24,pro:4,fat:2,portionG:180,enName:'Som Tam'},
    '얌운센':{kcal:220,carb:32,pro:12,fat:5,portionG:200,enName:'Yam Woon Sen'},
    '고이꾸온':{kcal:190,carb:26,pro:12,fat:4,portionG:160,enName:'Goi Cuon'},
    '도추아':{kcal:35,carb:8,pro:1,fat:0.1,portionG:70,enName:'Do Chua'},
    '가도가도':{kcal:315,carb:28,pro:12,fat:16,portionG:236,enName:'Gado-Gado'},
    '삼발':{kcal:45,carb:6,pro:1,fat:2,portionG:30,enName:'Sambal'},
    '아차르':{kcal:50,carb:10,pro:1,fat:1,portionG:80,enName:'Acar'},
    '삼발 우당':{kcal:220,carb:9,pro:20,fat:12,portionG:150,enName:'Sambal Udang'},
    '차이 타우 궤':{kcal:240,carb:32,pro:7,fat:9,portionG:180,enName:'Chai Tow Kway'},
    '오타오타':{kcal:160,carb:10,pro:13,fat:8,portionG:120,enName:'Otak-Otak'},
    '아차라':{kcal:40,carb:9,pro:1,fat:0.2,portionG:80,enName:'Atchara'},
    '엔살라당 탈롱':{kcal:95,carb:8,pro:3,fat:6,portionG:120,enName:'Ensaladang Talong'},
    '피단두부무침':{kcal:180,carb:8,pro:14,fat:10,portionG:200,enName:'Century Egg and Tofu'},
    '대만식 오이무침':{kcal:55,carb:6,pro:1.5,fat:3,portionG:100,enName:'Taiwanese Cucumber Salad'},
    '라이타':{kcal:90,carb:8,pro:5,fat:4,portionG:120,enName:'Raita'},
    '파코라':{kcal:260,carb:24,pro:6,fat:15,portionG:120,enName:'Pakora'},
    '후무스':{kcal:170,carb:14,pro:5,fat:10,portionG:100,enName:'Hummus'},
    '타불레':{kcal:140,carb:22,pro:4,fat:5,portionG:150,enName:'Tabbouleh'},
    '보렉':{kcal:280,carb:28,pro:8,fat:15,portionG:120,enName:'Börek'},
    '과카몰리':{kcal:160,carb:9,pro:2,fat:15,portionG:100,enName:'Guacamole'},
    '살사소스':{kcal:35,carb:7,pro:1, fat:0.3,portionG:80,enName:'Salsa'},
    '비나그레치':{kcal:60,carb:8,pro:1, fat:3,portionG:100,enName:'Vinagrete'},
    '파로파':{kcal:180,carb:30,pro:2, fat:6,portionG:80,enName:'Farofa'},
    '치미추리':{kcal:90,carb:2,pro:1, fat:9,portionG:30,enName:'Chimichurri'},
    '엠파나다':{kcal:260,carb:28,pro:9, fat:13,portionG:120,enName:'Empanada'},
    '살사 크리올라':{kcal:45,carb:7,pro:1, fat:2,portionG:80,enName:'Salsa Criolla'},
    '카우사':{kcal:240,carb:28,pro:8, fat:10,portionG:180,enName:'Causa'},
    '자알룩':{kcal:110,carb:10,pro:2, fat:7,portionG:120,enName:'Zaalouk'},
    '모로칸 당근 샐러드':{kcal:95,carb:14,pro:2, fat:4,portionG:120,enName:'Moroccan Carrot Salad'},
    '인제라':{kcal:160,carb:32,pro:5, fat:1,portionG:100,enName:'Injera'},
    '렌틸샐러드':{kcal:210,carb:28,pro:12, fat:6,portionG:180,enName:'Lentil Salad'}
  };

  const STYLE_TO_CUISINE = [
    {keys:['한식','한국','korean'], cuisine:'korean'},
    {keys:['일식','일본','japanese','japan'], cuisine:'japanese'},
    {keys:['중식','중국','chinese','china'], cuisine:'chinese'},
    
    {keys:['이탈리아','italian','italy'], cuisine:'italian'},
    {keys:['미국','american','usa'], cuisine:'american'},
    {keys:['프랑스','french','france'], cuisine:'french'},
    {keys:['스페인','spanish','spain'], cuisine:'spanish'},
    {keys:['그리스','greek','greece'], cuisine:'greek'},
    {keys:['태국','타이','thai','thailand'], cuisine:'thai'},
    {keys:['베트남','vietnam','vietnamese'], cuisine:'vietnamese'},
    {keys:['인도네시아','indonesia','indonesian'], cuisine:'indonesian'},
    {keys:['말레이시아','malaysia','malaysian'], cuisine:'malaysian'},
    {keys:['싱가포르','singapore'], cuisine:'singapore'},
    {keys:['필리핀','philippines','filipino'], cuisine:'filipino'},
    {keys:['대만','taiwan','taiwanese'], cuisine:'taiwanese'},
    {keys:['인도','indian','india'], cuisine:'indian'},
    {keys:['중동','middle','arab'], cuisine:'middleeast'},
    {keys:['터키','turkish','turkey'], cuisine:'turkish'},
    {keys:['멕시코','mexican','mexico'], cuisine:'mexican'},
    {keys:['브라질','brazil','brazilian'], cuisine:'brazilian'},
    {keys:['아르헨티나','argentina','argentinian'], cuisine:'argentinian'},
    {keys:['페루','peru','peruvian'], cuisine:'peruvian'},
    {keys:['모로코','morocco','moroccan'], cuisine:'moroccan'},
    {keys:['에티오피아','ethiopia','ethiopian'], cuisine:'ethiopian'}
  ];
  const KEYWORD_TO_CUISINE = [
    {re:/(찌개|탕|국|국밥|비빔밥|제육|불고기|갈비찜|닭볶음탕|삼겹살|보쌈|수육|잡채|냉면|떡볶이|감자탕|설렁탕|육개장|삼계탕|김밥)/, cuisine:'korean'},
    {re:/(라멘|우동|소바|가츠|카츠|돈카츠|오야코동|규동|텐동|스시|초밥|데리야키|가라아게|샤브샤브|나베|오코노미야키)/, cuisine:'japanese'},
    {re:/(짜장|짬뽕|마파|탕수육|깐풍|라조기|마라|딤섬|광동|사천|중식|우육면|완탕|멘보샤)/, cuisine:'chinese'},
    {re:/(파스타|리조또|스테이크|피자|샌드위치|버거|수프|스튜|그라탕|뇨키)/, cuisine:'western'},
    {re:/(알리오|봉골레|카르보나라|마르게리타|라자냐|브루스케타|미네스트로네|포카치아|카프레제)/, cuisine:'italian'},
    {re:/(파에야|감바스|가스파초|타파스|오믈렛|파타타스)/, cuisine:'spanish'},
    {re:/(그릭|기로스|무사카|수블라키|차지키|호르타)/, cuisine:'greek'},
    {re:/(팟타이|팟씨유|똠얌|똠카|그린커리|레드커리|카오|쏨땀|라브|태국|타이)/, cuisine:'thai'},
    {re:/(쌀국수|반미|분짜|분보|고이꾸온|껌|베트남)/, cuisine:'vietnamese'},
    {re:/(나시고랭|미고랭|사테|렌당|가도가도|인도네시아)/, cuisine:'indonesian'},
    {re:/(락사|나시르막|바쿠테|말레이시아)/, cuisine:'malaysian'},
    {re:/(하이난|칠리크랩|싱가포르|오타오타|차이 타우)/, cuisine:'singapore'},
    {re:/(아도보|시니강|판싯|이나살|필리핀)/, cuisine:'filipino'},
    {re:/(우육면|피단|대만)/, cuisine:'taiwanese'},
    {re:/(커리|카레|탄두리|버터치킨|비리야니|달 |마살라|팔락|파니르|인도)/, cuisine:'indian'},
    {re:/(케밥|팔라펠|후무스|쿠스쿠스|타진|샥슈카|중동)/, cuisine:'middleeast'},
    {re:/(보렉|쾨프테|이스켄데르|터키)/, cuisine:'turkish'},
    {re:/(타코|부리토|엔칠라다|퀘사디야|나초|멕시코)/, cuisine:'mexican'},
    {re:/(브라질|무케카|코시냐)/, cuisine:'brazilian'},
    {re:/(아사도|엠파나다|아르헨티나)/, cuisine:'argentinian'},
    {re:/(세비체|로모|페루)/, cuisine:'peruvian'},
    {re:/(모로코|타진|자알룩)/, cuisine:'moroccan'},
    {re:/(에티오피아|인제라)/, cuisine:'ethiopian'}
  ];
  const KOREAN_SIDE_RE = /(김치|깍두기|나물|시금치나물|콩나물무침|무나물|겉절이|멸치볶음|오이소박이|장아찌)/;
  function cleanStyleText(v){ return String(v||'').replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]/gu,'').replace(/[^0-9A-Za-z가-힣]/g,' ').trim().toLowerCase(); }
  function unique(arr){ return [...new Set((arr||[]).filter(Boolean))]; }
  function getEntry(name){ return (typeof MENU_DB !== 'undefined' && MENU_DB) ? MENU_DB[name] : null; }
  function detectCuisine(name){
    const e=getEntry(name)||{};
    const texts=unique([e.style, e.baseName, ...(Array.isArray(e.styles)?e.styles:[]), ...(Array.isArray(e.tags)?e.tags:[])]).map(cleanStyleText);
    for(const s of texts){ for(const row of STYLE_TO_CUISINE){ if(row.keys.some(k=>s.includes(cleanStyleText(k)))) return row.cuisine; } }
    const n=String(name||'');
    for(const row of KEYWORD_TO_CUISINE){ if(row.re.test(n)) return row.cuisine; }
    return 'global';
  }
  function sideNamesFor(name,type){
    if(type==='아침') return [];
    const cuisine=detectCuisine(name);
    let sides=(SIDE_POOL[cuisine]||SIDE_POOL.global).slice(0,2);
    if(cuisine!=='korean' && cuisine!=='global') sides=sides.filter(s=>!KOREAN_SIDE_RE.test(s));
    return sides;
  }

  // MENU_DB에 사이드 메뉴 최소 엔트리 추가: 추천/검색/레시피 클릭 시 side로 인식
  try{
    if(typeof MENU_DB !== 'undefined'){
      Object.entries(SIDE_NUTRITION).forEach(([name,nut])=>{
        if(!MENU_DB[name]){
          MENU_DB[name]={name,styles:['사이드'],tags:['side','반찬','메인추천제외'],mealRole:'side',menuType:'side',category:'사이드',cookTime:10,ingredients:[],ingredientIds:[],ingredientAmounts:{},enName:nut.enName};
        }else{
          MENU_DB[name].mealRole = MENU_DB[name].mealRole || 'side';
          MENU_DB[name].menuType = MENU_DB[name].menuType || 'side';
          MENU_DB[name].category = MENU_DB[name].category || '사이드';
          MENU_DB[name].tags = [...new Set([...(MENU_DB[name].tags||[]),'side','반찬','메인추천제외'])];
          MENU_DB[name].enName = MENU_DB[name].enName || nut.enName;
        }
      });
    }
  }catch(e){ console.warn('[country sides] MENU_DB side patch failed',e); }

  // 레시피 팝업이 비지 않도록 최소 레시피 추가
  try{
    if(typeof SIDES_RECIPE !== 'undefined'){
      Object.entries(SIDE_NUTRITION).forEach(([name,nut])=>{
        if(!SIDES_RECIPE[name]){
          SIDES_RECIPE[name]={
            desc:(nut.enName||name)+' 사이드 메뉴',
            ingredients:['주재료 1인분','소금 약간','향신료 또는 소스 약간'],
            steps:['재료를 손질한다','소스 또는 양념을 더해 가볍게 조리하거나 버무린다','메인 메뉴와 함께 곁들인다'],
            cookTime:10,
            tip:'국가별 메인 요리와 어울리도록 추천되는 사이드예요.'
          };
        }
      });
    }
  }catch(e){ console.warn('[country sides] recipe patch failed',e); }

  const prevCalc = typeof window.calcNutrition === 'function' ? window.calcNutrition : (typeof calcNutrition === 'function' ? calcNutrition : null);
  window.calcNutrition = calcNutrition = function(name, servings){
    const key=String(name||'').trim();
    const nut=SIDE_NUTRITION[key];
    if(nut){
      const mult=Math.max(1, Number(servings)||1);
      return {
        cal:Math.round(nut.kcal*mult),
        kcal:Math.round(nut.kcal*mult),
        carb:Math.round(nut.carb*mult*10)/10,
        pro:Math.round(nut.pro*mult*10)/10,
        protein:Math.round(nut.pro*mult*10)/10,
        fat:Math.round(nut.fat*mult*10)/10,
        portionG:nut.portionG,
        enName:nut.enName,
        source:'country-side-nutrition-db'
      };
    }
    return prevCalc ? prevCalc(name, servings) : {cal:0,kcal:0,carb:0,pro:0,protein:0,fat:0};
  };

  window.getCountrySideCuisine = detectCuisine;
  window.getCountrySides = function(name,type){ return sideNamesFor(name,type); };
  window.getSmartSides = function(name,type){ return sideNamesFor(name,type); };
  window.getSides = getSides = function(name,type){ return sideNamesFor(name,type); };
  window.refreshMealSidesByCuisine = function(){
    const patchMeal = function(meal){ if(meal && meal.name) meal.sides = sideNamesFor(meal.name, meal.type); };
    try{
      if(window.S && S.mealPlan && Array.isArray(S.mealPlan.weeklyMeal)){
        S.mealPlan.weeklyMeal.forEach(d=>(d.meals||[]).forEach(patchMeal));
        if(typeof saveMeal==='function') saveMeal();
      }
      if(window.S && S.mealCalendar){
        Object.values(S.mealCalendar).forEach(list=>(list||[]).forEach(patchMeal));
        localStorage.setItem('wm_cal', JSON.stringify(S.mealCalendar));
      }
      return true;
    }catch(e){ console.warn('[country sides] refresh failed',e); return false; }
  };
  try{ window.refreshMealSidesByCuisine(); }catch(e){}
  window.WM_COUNTRY_SIDE_PATCH_V1={applied:true,cuisineCount:Object.keys(SIDE_POOL).length,sideNutritionCount:Object.keys(SIDE_NUTRITION).length,mode:'2 sides per cuisine; foreign Korean-side fallback blocked'};
  console.info('[wm country side patch v1]', window.WM_COUNTRY_SIDE_PATCH_V1);
})();
/* ===== /country-side-menu-nutrition-patch-v1 ===== */


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


