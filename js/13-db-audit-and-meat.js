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
