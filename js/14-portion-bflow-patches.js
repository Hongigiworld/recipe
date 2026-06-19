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
          return '<div onclick="toggleBSuggest('+i+', event)" style="background:'+(selected?'#FFF8EE':'#fff')+';border:1.5px solid '+(selected?'var(--primary)':'#f0f0f0')+';border-radius:16px;padding:10px 14px;cursor:pointer;box-shadow:'+(selected?'0 2px 12px rgba(255,152,0,0.15)':'0 1px 4px rgba(0,0,0,0.05)')+';display:flex;align-items:center;gap:12px">'
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
