/* ===== DB V3 CURATION OVERRIDES: 대표메뉴/Variation 검색 + 기계조합 메뉴 차단 ===== */
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


/* ===== inline-script-12 ===== */
console.info('[Homekeeper Recipe Grade Audit] 핵심 한식 메뉴 재료/양념 보강 완료');
/* ===== MENU EXPANSION V6 SUMMARY =====
Added 26 reference-checked menus: 소고기미역국, 황태해장국, 닭개장, 소고기뭇국, 우렁된장찌개, 꽁치김치찌개, 고추장삼겹살, 가지볶음, 소고기장조림, 텐푸라우동, 야키토리덮밥, 규카츠, 미트볼스파게티, 코브샐러드, 케사디야, 파인애플볶음밥, 라브가이, 얌운센, 껌승, 소토아얌, 카레카레, 판싯, 룸피아, 알루고비, 라지마, 치킨빈달루.
Workflow: reference candidate -> existing DB duplicate check -> base/variation grouping -> ingredient DB check -> per-menu amounts/servings.
===== END MENU EXPANSION V6 SUMMARY ===== */

/* ===== MENU EXPANSION V7 SUMMARY =====
Added 32 additional reference-screened menus. Total menus: 425. Ingredients: 271.
Added menus: 등갈비김치찜, 차돌박이숙주볶음, 스팸마요덮밥, 콩비지찌개, 육전, 오차즈케, 하이라이스, 야키오니기리, 치라시스시, 치킨스테이크, 치킨수프, 감바스알아히요, 토마토브루스케타, 시저랩, 바바가누쉬, 파투쉬, 팟끄라파오무쌉, 카오소이, 망고스티키라이스, 차조, 비콜익스프레스, 아프리타다, 토르탕탈롱, 나시우둑, 박소, 차퀘이티아오, 사모사, 파코라, 로건조쉬, 메네멘, 코프테, 라흐마준.
Also corrected weak ingredient links: 꽁치김치찌개 uses saury, 우렁된장찌개 uses wooreong.
===== END MENU EXPANSION V7 SUMMARY ===== */
/* ===== /inline-script-12 ===== */


/* ===== inline-script-13 ===== */
/* ===== DB v8: 스타일 국기 통일 + 글로벌 메뉴 확장 ===== */
(function(){
  const STYLE_FLAG_LABELS_V8={KR:'한식',KOREA:'한식',JP:'일식',JAPAN:'일식',CN:'중식',CHINA:'중식',US:'🇺🇸 미국',USA:'🇺🇸 미국',IT:'🇮🇹 이탈리아',ITALY:'🇮🇹 이탈리아',ES:'🇪🇸 스페인',SPAIN:'🇪🇸 스페인',FR:'🇫🇷 프랑스',FRANCE:'🇫🇷 프랑스',DE:'🇩🇪 독일',GERMANY:'🇩🇪 독일',TH:'🇹🇭 태국',THAILAND:'🇹🇭 태국',VN:'🇻🇳 베트남',VIETNAM:'🇻🇳 베트남',ID:'🇮🇩 인도네시아',INDONESIA:'🇮🇩 인도네시아',MY:'🇲🇾 말레이시아',MALAYSIA:'🇲🇾 말레이시아',SG:'🇸🇬 싱가포르',SINGAPORE:'🇸🇬 싱가포르',PH:'🇵🇭 필리핀',PHILIPPINES:'🇵🇭 필리핀',IN:'🇮🇳 인도',INDIA:'🇮🇳 인도',MX:'🇲🇽 멕시코',MEXICO:'🇲🇽 멕시코',TR:'🇹🇷 터키',TURKEY:'🇹🇷 터키',GR:'🇬🇷 그리스',GREECE:'🇬🇷 그리스',MA:'🇲🇦 모로코',MOROCCO:'🇲🇦 모로코'};
  window.normalizeStyleChoiceV8=function(v){
    const raw=String(v||'').trim();
    if(!raw) return raw;
    if(STYLE_FLAG_LABELS_V8[raw]) return STYLE_FLAG_LABELS_V8[raw];
    const upper=raw.toUpperCase();
    if(STYLE_FLAG_LABELS_V8[upper]) return STYLE_FLAG_LABELS_V8[upper];
    return raw;
  };
  window.normalizeBCStylesV8=function(){
    if(window.S&&Array.isArray(S.bcStyles)) S.bcStyles=[...new Set(S.bcStyles.map(normalizeStyleChoiceV8).filter(Boolean))];
  };
  const oldPush=window.pushStyle;
  window.pushStyle=function(id){
    id=normalizeStyleChoiceV8(id);
    if(!S.bcStyles.includes(id)) S.bcStyles.push(id);
    render();
  };
  window.removeStyle=function(id){
    const n=normalizeStyleChoiceV8(id);
    S.bcStyles=S.bcStyles.filter(x=>normalizeStyleChoiceV8(x)!==n);
    render();
  };
  const patch={"ingredients":{"long_bean":{"id":"long_bean","name":"줄콩","category":"veg","aliases":["줄콩","롱빈","long bean"],"icon":"🫘","defaultAmount":"100g"},"green_bean":{"id":"green_bean","name":"그린빈","category":"veg","aliases":["그린빈","껍질콩"],"icon":"🫘","defaultAmount":"100g"},"okra":{"id":"okra","name":"오크라","category":"veg","aliases":["오크라"],"icon":"🌶️","defaultAmount":"80g"},"pandan":{"id":"pandan","name":"판단잎","category":"spice","aliases":["판단잎","판단","pandan"],"icon":"🌿","defaultAmount":"2장"},"kaya_jam":{"id":"kaya_jam","name":"카야잼","category":"sauce","aliases":["카야잼","카야"],"icon":"🍯","defaultAmount":"30g"},"tofu_puff":{"id":"tofu_puff","name":"유부튀김","category":"protein","aliases":["유부튀김","두부튀김","토푸퍼프"],"icon":"🟨","defaultAmount":"100g"},"fish_ball":{"id":"fish_ball","name":"피시볼","category":"protein","aliases":["피시볼","어묵볼"],"icon":"🍡","defaultAmount":"120g"},"meatball":{"id":"meatball","name":"미트볼","category":"protein","aliases":["미트볼","고기완자"],"icon":"🥩","defaultAmount":"150g"},"banana_leaf":{"id":"banana_leaf","name":"바나나잎","category":"other","aliases":["바나나잎"],"icon":"🍃","defaultAmount":"1장"},"calamansi":{"id":"calamansi","name":"깔라만시","category":"fruit","aliases":["깔라만시","칼라만시"],"icon":"🍋","defaultAmount":"20g"},"mustard_green":{"id":"mustard_green","name":"갓잎","category":"veg","aliases":["갓잎","겨자잎","mustard greens"],"icon":"🥬","defaultAmount":"120g"},"beef_tripe":{"id":"beef_tripe","name":"소양","category":"protein","aliases":["소양","양지양","트라이프"],"icon":"🥩","defaultAmount":"150g"},"fish_fillet":{"id":"fish_fillet","name":"흰살생선","category":"protein","aliases":["흰살생선","생선살","생선필레"],"icon":"🐟","defaultAmount":"200g"},"tapioca_starch":{"id":"tapioca_starch","name":"타피오카전분","category":"grain","aliases":["타피오카전분"],"icon":"🌾","defaultAmount":"30g"},"semolina":{"id":"semolina","name":"세몰리나","category":"grain","aliases":["세몰리나"],"icon":"🌾","defaultAmount":"80g"},"couscous":{"id":"couscous","name":"쿠스쿠스","category":"grain","aliases":["쿠스쿠스"],"icon":"🌾","defaultAmount":"200g"},"harissa":{"id":"harissa","name":"하리사","category":"sauce","aliases":["하리사"],"icon":"🌶️","defaultAmount":"20g"},"rose_water":{"id":"rose_water","name":"로즈워터","category":"other","aliases":["로즈워터"],"icon":"🌹","defaultAmount":"5ml"},"dill":{"id":"dill","name":"딜","category":"spice","aliases":["딜"],"icon":"🌿","defaultAmount":"5g"},"allspice":{"id":"allspice","name":"올스파이스","category":"spice","aliases":["올스파이스"],"icon":"🧂","defaultAmount":"2g"}},"nutrition":{"줄콩":{"cal":47,"pro":3,"fat":0,"carb":8},"그린빈":{"cal":31,"pro":2,"fat":0,"carb":7},"오크라":{"cal":33,"pro":2,"fat":0,"carb":7},"판단잎":{"cal":0,"pro":0,"fat":0,"carb":0},"카야잼":{"cal":280,"pro":3,"fat":8,"carb":50},"유부튀김":{"cal":170,"pro":10,"fat":10,"carb":8},"피시볼":{"cal":130,"pro":12,"fat":4,"carb":12},"미트볼":{"cal":250,"pro":15,"fat":18,"carb":8},"바나나잎":{"cal":0,"pro":0,"fat":0,"carb":0},"깔라만시":{"cal":30,"pro":1,"fat":0,"carb":7},"갓잎":{"cal":27,"pro":3,"fat":0,"carb":5},"소양":{"cal":94,"pro":12,"fat":4,"carb":2},"흰살생선":{"cal":105,"pro":22,"fat":2,"carb":0},"타피오카전분":{"cal":358,"pro":0,"fat":0,"carb":88},"세몰리나":{"cal":360,"pro":12,"fat":1,"carb":73},"쿠스쿠스":{"cal":112,"pro":4,"fat":0,"carb":23},"하리사":{"cal":80,"pro":2,"fat":4,"carb":10},"로즈워터":{"cal":0,"pro":0,"fat":0,"carb":0},"딜":{"cal":43,"pro":3,"fat":1,"carb":7},"올스파이스":{"cal":263,"pro":6,"fat":9,"carb":72}},"menus":[{"name":"그린커리","styles":["🇹🇭 태국"],"ingredients":["chicken","thai_green_curry","coconut_milk","eggplant","bamboo_shoot","fish_sauce","palm_sugar","kaffir_lime_leaf","basil","rice"],"ingredientAmounts":{"chicken":"300g","thai_green_curry":"60g","coconut_milk":"400ml","eggplant":"150g","bamboo_shoot":"100g","fish_sauce":"25g","palm_sugar":"15g","kaffir_lime_leaf":"3g","basil":"10g","rice":"360g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"태국"},{"name":"레드커리","styles":["🇹🇭 태국"],"ingredients":["chicken","thai_red_curry","coconut_milk","bell_pepper","bamboo_shoot","fish_sauce","palm_sugar","kaffir_lime_leaf","basil","rice"],"ingredientAmounts":{"chicken":"300g","thai_red_curry":"60g","coconut_milk":"400ml","bell_pepper":"120g","bamboo_shoot":"100g","fish_sauce":"25g","palm_sugar":"15g","kaffir_lime_leaf":"3g","basil":"10g","rice":"360g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"태국"},{"name":"마사만커리","styles":["🇹🇭 태국"],"ingredients":["chicken","coconut_milk","potato","onion","peanut","cinnamon","cardamom","fish_sauce","palm_sugar","tamarind_paste","rice"],"ingredientAmounts":{"chicken":"350g","coconut_milk":"400ml","potato":"250g","onion":"150g","peanut":"50g","cinnamon":"3g","cardamom":"2g","fish_sauce":"25g","palm_sugar":"20g","tamarind_paste":"20g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"태국"},{"name":"팟카파오무쌉","styles":["🇹🇭 태국"],"ingredients":["pork","basil","garlic","dried_chili","fish_sauce","oyster_sauce","soy_sauce","sugar","egg","rice"],"ingredientAmounts":{"pork":"300g","basil":"20g","garlic":"15g","dried_chili":"5g","fish_sauce":"20g","oyster_sauce":"25g","soy_sauce":"15g","sugar":"10g","egg":"3개","rice":"450g"},"cookTime":20,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","덮밥"],"baseId":"_","baseName":"태국"},{"name":"카오만가이","styles":["🇹🇭 태국"],"ingredients":["chicken","rice","chicken_broth","ginger","garlic","cucumber","cilantro","soy_sauce","fish_sauce","lime"],"ingredientAmounts":{"chicken":"500g","rice":"360g","chicken_broth":"700ml","ginger":"20g","garlic":"15g","cucumber":"120g","cilantro":"10g","soy_sauce":"20g","fish_sauce":"20g","lime":"20g"},"cookTime":50,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","밥"],"baseId":"_","baseName":"태국"},{"name":"카오카무","styles":["🇹🇭 태국"],"ingredients":["pork","rice","soy_sauce","star_anise","cinnamon","garlic","ginger","egg","bok_choy","sugar"],"ingredientAmounts":{"pork":"450g","rice":"360g","soy_sauce":"45g","star_anise":"3g","cinnamon":"3g","garlic":"15g","ginger":"15g","egg":"3개","bok_choy":"180g","sugar":"20g"},"cookTime":70,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","밥"],"baseId":"_","baseName":"태국"},{"name":"뿌팟퐁커리","styles":["🇹🇭 태국"],"ingredients":["crab","egg","curry_powder","coconut_milk","onion","celery","garlic","fish_sauce","sugar","rice"],"ingredientAmounts":{"crab":"500g","egg":"2개","curry_powder":"20g","coconut_milk":"150ml","onion":"120g","celery":"60g","garlic":"12g","fish_sauce":"20g","sugar":"10g","rice":"360g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"태국"},{"name":"쏨땀","styles":["🇹🇭 태국"],"ingredients":["radish","long_bean","tomato","peanut","dried_chili","garlic","fish_sauce","lime","palm_sugar"],"ingredientAmounts":{"radish":"300g","long_bean":"80g","tomato":"120g","peanut":"30g","dried_chili":"5g","garlic":"10g","fish_sauce":"25g","lime":"30g","palm_sugar":"15g"},"cookTime":15,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","샐러드"],"baseId":"_","baseName":"태국"},{"name":"얌운센","styles":["🇹🇭 태국"],"ingredients":["glass_noodle","shrimp","pork","red_onion","celery","cilantro","fish_sauce","lime","dried_chili","sugar"],"ingredientAmounts":{"glass_noodle":"120g","shrimp":"150g","pork":"120g","red_onion":"60g","celery":"50g","cilantro":"10g","fish_sauce":"25g","lime":"30g","dried_chili":"5g","sugar":"10g"},"cookTime":20,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","샐러드"],"baseId":"_","baseName":"태국"},{"name":"팟씨유","styles":["🇹🇭 태국"],"ingredients":["rice_noodle","pork","egg","bok_choy","garlic","soy_sauce","oyster_sauce","sugar","cooking_oil"],"ingredientAmounts":{"rice_noodle":"220g","pork":"200g","egg":"2개","bok_choy":"180g","garlic":"12g","soy_sauce":"35g","oyster_sauce":"30g","sugar":"12g","cooking_oil":"20g"},"cookTime":25,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"태국"},{"name":"분짜","styles":["🇻🇳 베트남"],"ingredients":["pork","rice_noodle","lettuce","cucumber","carrot","radish","fish_sauce","lime","garlic","sugar","cilantro"],"ingredientAmounts":{"pork":"350g","rice_noodle":"220g","lettuce":"120g","cucumber":"120g","carrot":"80g","radish":"80g","fish_sauce":"40g","lime":"30g","garlic":"12g","sugar":"20g","cilantro":"10g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"베트남"},{"name":"반쎄오","styles":["🇻🇳 베트남"],"ingredients":["rice","turmeric","coconut_milk","pork","shrimp","mung_sprout","green_onion","lettuce","fish_sauce","lime"],"ingredientAmounts":{"rice":"160g","turmeric":"5g","coconut_milk":"200ml","pork":"180g","shrimp":"150g","mung_sprout":"180g","green_onion":"30g","lettuce":"120g","fish_sauce":"30g","lime":"25g"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","전"],"baseId":"_","baseName":"베트남"},{"name":"껌승","styles":["🇻🇳 베트남"],"ingredients":["pork","rice","fish_sauce","soy_sauce","garlic","sugar","cucumber","carrot","egg"],"ingredientAmounts":{"pork":"350g","rice":"450g","fish_sauce":"35g","soy_sauce":"20g","garlic":"12g","sugar":"20g","cucumber":"120g","carrot":"80g","egg":"3개"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","밥"],"baseId":"_","baseName":"베트남"},{"name":"고이꾸온","styles":["🇻🇳 베트남"],"ingredients":["rice_paper","shrimp","pork","rice_noodle","lettuce","cucumber","mint","cilantro","hoisin_sauce","peanut"],"ingredientAmounts":{"rice_paper":"12장","shrimp":"180g","pork":"160g","rice_noodle":"120g","lettuce":"120g","cucumber":"100g","mint":"10g","cilantro":"10g","hoisin_sauce":"40g","peanut":"30g"},"cookTime":25,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","롤"],"baseId":"_","baseName":"베트남"},{"name":"분보후에","styles":["🇻🇳 베트남"],"ingredients":["rice_noodle","beef","beef_broth","lemongrass","fish_sauce","chili_oil","onion","lime","cilantro","bean_sprout"],"ingredientAmounts":{"rice_noodle":"250g","beef":"250g","beef_broth":"1200ml","lemongrass":"20g","fish_sauce":"35g","chili_oil":"15g","onion":"100g","lime":"30g","cilantro":"10g","bean_sprout":"150g"},"cookTime":60,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"베트남"},{"name":"미꽝","styles":["🇻🇳 베트남"],"ingredients":["rice_noodle","chicken","shrimp","turmeric","fish_sauce","peanut","lettuce","lime","cilantro","chicken_broth"],"ingredientAmounts":{"rice_noodle":"240g","chicken":"250g","shrimp":"150g","turmeric":"5g","fish_sauce":"35g","peanut":"40g","lettuce":"100g","lime":"30g","cilantro":"10g","chicken_broth":"700ml"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"베트남"},{"name":"보코","styles":["🇻🇳 베트남"],"ingredients":["beef","carrot","onion","tomato_paste","lemongrass","star_anise","cinnamon","fish_sauce","sugar","baguette"],"ingredientAmounts":{"beef":"450g","carrot":"200g","onion":"150g","tomato_paste":"50g","lemongrass":"20g","star_anise":"3g","cinnamon":"3g","fish_sauce":"35g","sugar":"15g","baguette":"1/2개"},"cookTime":75,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","스튜"],"baseId":"_","baseName":"베트남"},{"name":"소토아얌","styles":["🇮🇩 인도네시아"],"ingredients":["chicken","rice_noodle","chicken_broth","turmeric","ginger","garlic","lemongrass","egg","bean_sprout","lime"],"ingredientAmounts":{"chicken":"350g","rice_noodle":"180g","chicken_broth":"1200ml","turmeric":"6g","ginger":"15g","garlic":"12g","lemongrass":"20g","egg":"3개","bean_sprout":"150g","lime":"30g"},"cookTime":55,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","국물"],"baseId":"_","baseName":"인도네시아"},{"name":"박소","styles":["🇮🇩 인도네시아"],"ingredients":["meatball","rice_noodle","beef_broth","bok_choy","garlic","soy_sauce","green_onion","fried_tofu"],"ingredientAmounts":{"meatball":"300g","rice_noodle":"180g","beef_broth":"1200ml","bok_choy":"180g","garlic":"12g","soy_sauce":"25g","green_onion":"30g","fried_tofu":"120g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","국물"],"baseId":"_","baseName":"인도네시아"},{"name":"아얌고렝","styles":["🇮🇩 인도네시아"],"ingredients":["chicken","turmeric","garlic","ginger","coriander_powder","salt","cooking_oil","rice"],"ingredientAmounts":{"chicken":"500g","turmeric":"8g","garlic":"15g","ginger":"15g","coriander_powder":"6g","salt":"5g","cooking_oil":"35g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","튀김"],"baseId":"_","baseName":"인도네시아"},{"name":"사유르로데","styles":["🇮🇩 인도네시아"],"ingredients":["coconut_milk","eggplant","long_bean","cabbage","tofu","tempeh","garlic","dried_chili","rice"],"ingredientAmounts":{"coconut_milk":"500ml","eggplant":"180g","long_bean":"120g","cabbage":"150g","tofu":"180g","tempeh":"150g","garlic":"12g","dried_chili":"5g","rice":"360g"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","스튜"],"baseId":"_","baseName":"인도네시아"},{"name":"나시우둑","styles":["🇮🇩 인도네시아"],"ingredients":["rice","coconut_milk","pandan","lemongrass","bay_leaf","egg","tempeh","peanut","cucumber"],"ingredientAmounts":{"rice":"360g","coconut_milk":"350ml","pandan":"2장","lemongrass":"15g","bay_leaf":"2장","egg":"3개","tempeh":"150g","peanut":"40g","cucumber":"120g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","밥"],"baseId":"_","baseName":"인도네시아"},{"name":"아얌리카리카","styles":["🇮🇩 인도네시아"],"ingredients":["chicken","dried_chili","garlic","ginger","lemongrass","lime","basil","soy_sauce","rice"],"ingredientAmounts":{"chicken":"500g","dried_chili":"10g","garlic":"15g","ginger":"15g","lemongrass":"15g","lime":"25g","basil":"15g","soy_sauce":"20g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"인도네시아"},{"name":"아삼락사","styles":["🇲🇾 말레이시아"],"ingredients":["rice_noodle","mackerel","tamarind_paste","lemongrass","galangal","dried_chili","onion","cucumber","mint","pineapple"],"ingredientAmounts":{"rice_noodle":"250g","mackerel":"300g","tamarind_paste":"35g","lemongrass":"20g","galangal":"10g","dried_chili":"8g","onion":"100g","cucumber":"120g","mint":"10g","pineapple":"100g"},"cookTime":55,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"말레이시아"},{"name":"미고렝마막","styles":["🇲🇾 말레이시아"],"ingredients":["noodle","shrimp","egg","tofu","potato","bean_sprout","kecap_manis","soy_sauce","sambal","lime"],"ingredientAmounts":{"noodle":"250g","shrimp":"150g","egg":"2개","tofu":"150g","potato":"150g","bean_sprout":"150g","kecap_manis":"30g","soy_sauce":"25g","sambal":"20g","lime":"20g"},"cookTime":30,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"말레이시아"},{"name":"로티자나이","styles":["🇲🇾 말레이시아"],"ingredients":["flour","cooking_oil","salt","water","curry_powder","potato","onion","chicken"],"ingredientAmounts":{"flour":"300g","cooking_oil":"40g","salt":"4g","water":"160ml","curry_powder":"25g","potato":"180g","onion":"100g","chicken":"200g"},"cookTime":60,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","빵"],"baseId":"_","baseName":"말레이시아"},{"name":"아얌마삭메라","styles":["🇲🇾 말레이시아"],"ingredients":["chicken","tomato_sauce","dried_chili","onion","garlic","ginger","coconut_milk","sugar","rice"],"ingredientAmounts":{"chicken":"500g","tomato_sauce":"180g","dried_chili":"8g","onion":"150g","garlic":"15g","ginger":"15g","coconut_milk":"150ml","sugar":"15g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"말레이시아"},{"name":"삼발새우","styles":["🇲🇾 말레이시아"],"ingredients":["shrimp","sambal","onion","garlic","tamarind_paste","sugar","lime","rice"],"ingredientAmounts":{"shrimp":"350g","sambal":"45g","onion":"120g","garlic":"12g","tamarind_paste":"20g","sugar":"15g","lime":"20g","rice":"360g"},"cookTime":25,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"말레이시아"},{"name":"카야토스트","styles":["🇸🇬 싱가포르"],"ingredients":["bread","kaya_jam","butter","egg","soy_sauce","coffee"],"ingredientAmounts":{"bread":"4장","kaya_jam":"60g","butter":"30g","egg":"4개","soy_sauce":"10g","coffee":"20g"},"cookTime":15,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","브런치"],"baseId":"_","baseName":"싱가포르"},{"name":"호키엔미","styles":["🇸🇬 싱가포르"],"ingredients":["noodle","rice_noodle","shrimp","squid","pork","egg","bean_sprout","chicken_broth","garlic","lime"],"ingredientAmounts":{"noodle":"180g","rice_noodle":"180g","shrimp":"180g","squid":"150g","pork":"120g","egg":"2개","bean_sprout":"150g","chicken_broth":"300ml","garlic":"12g","lime":"20g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"싱가포르"},{"name":"피시헤드커리","styles":["🇸🇬 싱가포르"],"ingredients":["fish_fillet","coconut_milk","curry_powder","okra","eggplant","tomato","onion","tamarind_paste","rice"],"ingredientAmounts":{"fish_fillet":"450g","coconut_milk":"400ml","curry_powder":"35g","okra":"100g","eggplant":"150g","tomato":"120g","onion":"120g","tamarind_paste":"25g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"싱가포르"},{"name":"미시암","styles":["🇸🇬 싱가포르"],"ingredients":["rice_noodle","shrimp","tamarind_paste","dried_chili","garlic","egg","bean_sprout","green_onion","lime"],"ingredientAmounts":{"rice_noodle":"250g","shrimp":"150g","tamarind_paste":"30g","dried_chili":"8g","garlic":"12g","egg":"2개","bean_sprout":"150g","green_onion":"30g","lime":"25g"},"cookTime":30,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","면"],"baseId":"_","baseName":"싱가포르"},{"name":"차이토우콰이","styles":["🇸🇬 싱가포르"],"ingredients":["radish","rice","egg","garlic","soy_sauce","chili_oil","green_onion","cooking_oil"],"ingredientAmounts":{"radish":"350g","rice":"120g","egg":"2개","garlic":"12g","soy_sauce":"25g","chili_oil":"12g","green_onion":"30g","cooking_oil":"25g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"싱가포르"},{"name":"비콜익스프레스","styles":["🇵🇭 필리핀"],"ingredients":["pork","coconut_milk","shrimp_paste","dried_chili","garlic","onion","ginger","rice"],"ingredientAmounts":{"pork":"400g","coconut_milk":"400ml","shrimp_paste":"35g","dried_chili":"8g","garlic":"12g","onion":"120g","ginger":"15g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","스튜"],"baseId":"_","baseName":"필리핀"},{"name":"티놀라","styles":["🇵🇭 필리핀"],"ingredients":["chicken","ginger","garlic","onion","bok_choy","green_bean","fish_sauce","water","rice"],"ingredientAmounts":{"chicken":"500g","ginger":"25g","garlic":"12g","onion":"120g","bok_choy":"180g","green_bean":"100g","fish_sauce":"30g","water":"1200ml","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","국물"],"baseId":"_","baseName":"필리핀"},{"name":"레촌카왈리","styles":["🇵🇭 필리핀"],"ingredients":["pork_belly","bay_leaf","pepper","salt","garlic","cooking_oil","vinegar","soy_sauce","rice"],"ingredientAmounts":{"pork_belly":"500g","bay_leaf":"2장","pepper":"3g","salt":"5g","garlic":"12g","cooking_oil":"50g","vinegar":"25g","soy_sauce":"20g","rice":"360g"},"cookTime":70,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","튀김"],"baseId":"_","baseName":"필리핀"},{"name":"토르탕탈롱","styles":["🇵🇭 필리핀"],"ingredients":["eggplant","egg","pork","onion","garlic","soy_sauce","pepper","rice"],"ingredientAmounts":{"eggplant":"300g","egg":"4개","pork":"150g","onion":"80g","garlic":"10g","soy_sauce":"15g","pepper":"2g","rice":"360g"},"cookTime":30,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","전"],"baseId":"_","baseName":"필리핀"},{"name":"치킨이나살","styles":["🇵🇭 필리핀"],"ingredients":["chicken","calamansi","vinegar","garlic","ginger","lemongrass","soy_sauce","cooking_oil","rice"],"ingredientAmounts":{"chicken":"500g","calamansi":"30g","vinegar":"30g","garlic":"15g","ginger":"15g","lemongrass":"20g","soy_sauce":"25g","cooking_oil":"25g","rice":"360g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","구이"],"baseId":"_","baseName":"필리핀"},{"name":"포크시시그","styles":["🇵🇭 필리핀"],"ingredients":["pork","onion","calamansi","mayo","soy_sauce","chili_oil","egg","rice"],"ingredientAmounts":{"pork":"400g","onion":"120g","calamansi":"30g","mayo":"40g","soy_sauce":"25g","chili_oil":"10g","egg":"1개","rice":"360g"},"cookTime":35,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"필리핀"},{"name":"팔락파니르","styles":["🇮🇳 인도"],"ingredients":["paneer","spinach","cream","garlic","ginger","onion","tomato","garam_masala","cumin","basmati_rice"],"ingredientAmounts":{"paneer":"250g","spinach":"300g","cream":"80ml","garlic":"12g","ginger":"12g","onion":"120g","tomato":"150g","garam_masala":"8g","cumin":"5g","basmati_rice":"300g"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"인도"},{"name":"알루고비","styles":["🇮🇳 인도"],"ingredients":["potato","cauliflower","onion","tomato","garam_masala","turmeric","cumin","garlic","ginger","basmati_rice"],"ingredientAmounts":{"potato":"300g","cauliflower":"300g","onion":"120g","tomato":"150g","garam_masala":"8g","turmeric":"5g","cumin":"5g","garlic":"12g","ginger":"12g","basmati_rice":"300g"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"인도"},{"name":"차나마살라","styles":["🇮🇳 인도"],"ingredients":["chickpea","onion","tomato","garam_masala","cumin","coriander_powder","turmeric","garlic","ginger","basmati_rice"],"ingredientAmounts":{"chickpea":"400g","onion":"150g","tomato":"200g","garam_masala":"8g","cumin":"5g","coriander_powder":"6g","turmeric":"5g","garlic":"12g","ginger":"12g","basmati_rice":"300g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"인도"},{"name":"달마크니","styles":["🇮🇳 인도"],"ingredients":["lentil","kidney_bean","butter","cream","tomato","garam_masala","garlic","ginger","basmati_rice"],"ingredientAmounts":{"lentil":"250g","kidney_bean":"150g","butter":"40g","cream":"80ml","tomato":"200g","garam_masala":"8g","garlic":"12g","ginger":"12g","basmati_rice":"300g"},"cookTime":70,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"인도"},{"name":"로간조쉬","styles":["🇮🇳 인도"],"ingredients":["lamb","yogurt","onion","tomato","garam_masala","cumin","cardamom","cinnamon","garlic","basmati_rice"],"ingredientAmounts":{"lamb":"450g","yogurt":"150g","onion":"150g","tomato":"150g","garam_masala":"8g","cumin":"5g","cardamom":"3g","cinnamon":"3g","garlic":"12g","basmati_rice":"300g"},"cookTime":70,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","커리"],"baseId":"_","baseName":"인도"},{"name":"사모사","styles":["🇮🇳 인도"],"ingredients":["flour","potato","peas","cumin","garam_masala","turmeric","cooking_oil","cilantro"],"ingredientAmounts":{"flour":"250g","potato":"300g","peas":"100g","cumin":"5g","garam_masala":"6g","turmeric":"4g","cooking_oil":"60g","cilantro":"10g"},"cookTime":60,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","간식"],"baseId":"_","baseName":"인도"},{"name":"도사","styles":["🇮🇳 인도"],"ingredients":["rice","lentil","salt","cooking_oil","potato","mustard_seed","turmeric"],"ingredientAmounts":{"rice":"250g","lentil":"100g","salt":"5g","cooking_oil":"30g","potato":"250g","mustard_seed":"5g","turmeric":"4g"},"cookTime":60,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","전"],"baseId":"_","baseName":"인도"},{"name":"엔칠라다","styles":["🇲🇽 멕시코"],"ingredients":["tortilla","chicken","tomato_sauce","cheese","onion","garlic","cumin","sour_cream"],"ingredientAmounts":{"tortilla":"6장","chicken":"300g","tomato_sauce":"250g","cheese":"120g","onion":"120g","garlic":"12g","cumin":"5g","sour_cream":"60g"},"cookTime":40,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","오븐"],"baseId":"_","baseName":"멕시코"},{"name":"치킨파히타","styles":["🇲🇽 멕시코"],"ingredients":["tortilla","chicken","bell_pepper","onion","lime","cumin","garlic","sour_cream","salsa"],"ingredientAmounts":{"tortilla":"6장","chicken":"350g","bell_pepper":"200g","onion":"150g","lime":"30g","cumin":"6g","garlic":"12g","sour_cream":"60g","salsa":"80g"},"cookTime":30,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","볶음"],"baseId":"_","baseName":"멕시코"},{"name":"포솔레","styles":["🇲🇽 멕시코"],"ingredients":["pork","corn","dried_chili","garlic","onion","cabbage","radish","lime","oregano"],"ingredientAmounts":{"pork":"450g","corn":"300g","dried_chili":"10g","garlic":"12g","onion":"150g","cabbage":"180g","radish":"100g","lime":"30g","oregano":"4g"},"cookTime":80,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","국물"],"baseId":"_","baseName":"멕시코"},{"name":"칠레콘카르네","styles":["🇲🇽 멕시코"],"ingredients":["beef","kidney_bean","tomato","onion","garlic","cumin","chili_powder","cheese","rice"],"ingredientAmounts":{"beef":"350g","kidney_bean":"250g","tomato":"250g","onion":"150g","garlic":"12g","cumin":"6g","chili_powder":"8g","cheese":"80g","rice":"360g"},"cookTime":45,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","스튜"],"baseId":"_","baseName":"멕시코"},{"name":"메네멘","styles":["🇹🇷 터키"],"ingredients":["egg","tomato","bell_pepper","onion","olive_oil","pepper","bread"],"ingredientAmounts":{"egg":"4개","tomato":"300g","bell_pepper":"150g","onion":"100g","olive_oil":"25g","pepper":"2g","bread":"4장"},"cookTime":20,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","브런치"],"baseId":"_","baseName":"터키"},{"name":"라흐마준","styles":["🇹🇷 터키"],"ingredients":["flour","yeast","beef","tomato","onion","parsley","cumin","paprika_powder","lemon"],"ingredientAmounts":{"flour":"300g","yeast":"5g","beef":"250g","tomato":"150g","onion":"120g","parsley":"15g","cumin":"5g","paprika_powder":"6g","lemon":"30g"},"cookTime":55,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","피자"],"baseId":"_","baseName":"터키"},{"name":"피데","styles":["🇹🇷 터키"],"ingredients":["flour","yeast","beef","cheese","egg","onion","tomato","parsley"],"ingredientAmounts":{"flour":"320g","yeast":"5g","beef":"250g","cheese":"120g","egg":"2개","onion":"100g","tomato":"120g","parsley":"12g"},"cookTime":60,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","빵"],"baseId":"_","baseName":"터키"},{"name":"이스켄데르케밥","styles":["🇹🇷 터키"],"ingredients":["lamb","bread","yogurt","tomato_sauce","butter","garlic","paprika_powder"],"ingredientAmounts":{"lamb":"400g","bread":"200g","yogurt":"200g","tomato_sauce":"180g","butter":"40g","garlic":"10g","paprika_powder":"6g"},"cookTime":45,"servings":3,"recipeServings":3,"tags":["글로벌확장","수량보강","대표메뉴검수","케밥"],"baseId":"_","baseName":"터키"},{"name":"무사카","styles":["🇬🇷 그리스"],"ingredients":["eggplant","beef","tomato_sauce","onion","garlic","milk","butter","flour","cheese"],"ingredientAmounts":{"eggplant":"400g","beef":"350g","tomato_sauce":"250g","onion":"120g","garlic":"12g","milk":"300ml","butter":"40g","flour":"30g","cheese":"120g"},"cookTime":70,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","오븐"],"baseId":"_","baseName":"그리스"},{"name":"쿠스쿠스","styles":["🇲🇦 모로코"],"ingredients":["couscous","chicken","chickpea","carrot","zucchini","onion","cumin","cinnamon","turmeric","harissa"],"ingredientAmounts":{"couscous":"300g","chicken":"400g","chickpea":"200g","carrot":"200g","zucchini":"180g","onion":"150g","cumin":"6g","cinnamon":"3g","turmeric":"5g","harissa":"20g"},"cookTime":60,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","스튜"],"baseId":"_","baseName":"모로코"},{"name":"샥슈카","styles":["중동"],"ingredients":["egg","tomato","bell_pepper","onion","garlic","cumin","paprika_powder","olive_oil","bread"],"ingredientAmounts":{"egg":"4개","tomato":"400g","bell_pepper":"150g","onion":"120g","garlic":"12g","cumin":"5g","paprika_powder":"5g","olive_oil":"25g","bread":"4장"},"cookTime":30,"servings":2,"recipeServings":2,"tags":["글로벌확장","수량보강","대표메뉴검수","브런치"],"baseId":"_","baseName":"중동"},{"name":"무자다라","styles":["중동"],"ingredients":["lentil","rice","onion","olive_oil","cumin","yogurt"],"ingredientAmounts":{"lentil":"250g","rice":"250g","onion":"250g","olive_oil":"40g","cumin":"5g","yogurt":"120g"},"cookTime":50,"servings":4,"recipeServings":4,"tags":["글로벌확장","수량보강","대표메뉴검수","밥"],"baseId":"_","baseName":"중동"}]};
  Object.assign(INGREDIENT_DB_V2, patch.ingredients);
  Object.assign(NUTRITION_DB, patch.nutrition);
  patch.menus.forEach(m=>{
    if(!MENU_SCHEMA_V2[m.name]) MENU_SCHEMA_V2[m.name]=m;
  });
  buildMenuDBV2();
  console.info('[Homekeeper DB v8]', Object.keys(MENU_DB).length+' menus', Object.keys(INGREDIENT_DB_V2).length+' ingredients', 'flags normalized + global expansion');
})();
/* ===== /inline-script-13 ===== */


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
