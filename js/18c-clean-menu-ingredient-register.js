/* ===== clean-menu-ingredient-register ===== */
(function(){
  var cleanMenuSchemas = window.WM_CLEAN_MENU_SCHEMAS || [];
  var cleanIngDB = window.WM_CLEAN_ING_DB || {};
  
  // INGREDIENT_DB_V2에 재료 등록
  if(typeof INGREDIENT_DB_V2 === 'object') {
    Object.keys(cleanIngDB).forEach(function(id){
      if(!INGREDIENT_DB_V2[id]) INGREDIENT_DB_V2[id] = cleanIngDB[id];
    });
  }
  
  // MENU_SCHEMA_V2에 메뉴 등록
  if(typeof MENU_SCHEMA_V2 === 'object') {
    cleanMenuSchemas.forEach(function(m){
      if(!MENU_SCHEMA_V2[m.name]) MENU_SCHEMA_V2[m.name] = m;
    });
  }
  
  // buildMenuDBV2 재호출
  if(typeof buildMenuDBV2 === 'function') buildMenuDBV2();
  
  console.info('[CLEAN_MENUS 직접등록]', cleanMenuSchemas.length + '개 메뉴, 아귀찜: ' + (MENU_DB['아귀찜'] ? '✅' : '❌'));
})();
/* ===== /inline-script-45 ===== */
