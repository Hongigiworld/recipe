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
