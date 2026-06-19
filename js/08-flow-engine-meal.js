function flowFridgeNames(){return (S.fridge||[]).map(f=>String(f.name||'').trim()).filter(Boolean);}
function flowHasIng(ingName,fridgeNames=flowFridgeNames()){
  const n=String(ingName||'').trim();
  if(!n)return false;
  return fridgeNames.some(f=>f===n||f.includes(n)||n.includes(f));
}
function flowMenuDBName(name){return resolveMenu(name)||name;}
function flowMenuPool(styles){
  let pool=[];
  (styles&&styles.length?styles:["한식"]).forEach(s=>{pool=pool.concat(FLOW_STYLE_MENU_MAP[s]||[]);});
  if(!pool.length)pool=Object.keys(MENU_DB);
  return [...new Set(pool.map(flowMenuDBName).filter(n=>MENU_DB[n]))];
}
function flowScoreMenuByFridge(name){
  const db=MENU_DB[name]; if(!db)return -999;
  const fridgeNames=flowFridgeNames();
  const core=db.ingredients.filter(i=>["단백질","채소","면·밥"].includes(i.category||""));
  const have=db.ingredients.filter(i=>flowHasIng(refineIngredient(i.name,name),fridgeNames)).length;
  const coreHave=core.filter(i=>flowHasIng(refineIngredient(i.name,name),fridgeNames)).length;
  const expiryBoost=(S.fridge||[]).reduce((sum,f)=>{
    const d=getDday(f.addedAt,f.expireDays);
    const hit=db.ingredients.some(i=>flowHasIng(refineIngredient(i.name,name),[f.name]));
    return sum+(hit&&d<=3?3:0);
  },0);
  return have*3+coreHave*5+expiryBoost+getSeasonalScore(name)*2-Math.random();
}
function flowBuildMenu(type,styles,baseMenus){
  const max=totalMeals();
  let pool=[];
  if(type==='fridge') pool=flowMenuPool(styles).sort((a,b)=>flowScoreMenuByFridge(b)-flowScoreMenuByFridge(a));
  if(type==='style') pool=flowMenuPool(styles).sort(()=>Math.random()-0.5);
  if(type==='wishlist'){
    const resolved=[...new Set((baseMenus||[]).map(flowMenuDBName).filter(n=>MENU_DB[n]))];
    pool=[...resolved,...findSimilarMenus(resolved,resolved),...Object.keys(MENU_DB).sort(()=>Math.random()-0.5)];
  }
  pool=[...new Set(pool.filter(n=>MENU_DB[n]))];
  if(!pool.length)pool=Object.keys(MENU_DB).sort(()=>Math.random()-0.5);
  return pool.slice(0,Math.max(max,1));
}
function flowMealObj(type,name){
  const db=MENU_DB[name];
  return {type,name,mainIngredients:db?(db.ingredients||[]).slice(0,3).map(i=>refineIngredient(i.name,name)):[],cookTime:getCookTime(name),nutrition:{protein:"중간",carb:"중간",veggie:"있음"},sides:getSides(name,type)};
}
function flowCreatePlan(menus,tip){
  const weeklyMeal=[];let idx=0;
  for(const day of DAYS){
    const meals=(S.schedule[day]||[]).map(type=>flowMealObj(type,menus[idx++%menus.length]));
    weeklyMeal.push({day,meals});
  }
  S.mealPlan={weeklyMeal,tip};
  S.mealStartDate=getThisMonday();
  flowCreateCalendar(menus);
  saveMeal();
}
function flowCreateCalendar(menus){
  const cal={};let idx=0;
  const start=new Date(); start.setDate(start.getDate()+1);
  const days=totalDays();
  for(let i=0;i<days;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    const key=dateKey(d); const day=DAYS[(d.getDay()+6)%7];
    cal[key]=(S.schedule[day]||[]).map(type=>flowMealObj(type,menus[idx++%menus.length]));
  }
  S.mealCalendar=cal;
  localStorage.setItem('wm_cal',JSON.stringify(S.mealCalendar));
}
function flowBuildCart(menus){
  const {list}=getIngredientsFromDB(menus,S.people);
  S.cart=list.map(i=>({...i,checked:!!i.inFridge,replaceName:"",replaceQty:""}));
  S.cartDone=false;S.fridgeAdded=false;
  localStorage.removeItem("wm_cart_done");
}
function saveMeal(){
  localStorage.setItem("wm_meal",JSON.stringify(S.mealPlan));
  localStorage.setItem("wm_meal_start",S.mealStartDate||"");
  localStorage.setItem("wm_cal",JSON.stringify(S.mealCalendar||{}));
}

function genAMeal(){
  if(!checkUsage())return;
  if(!S.bcStyles.length){alert('스타일을 먼저 선택해주세요');return;}
  if(!S.fridge.length){showInsufficientModal(0);return;}
  const menus=flowBuildMenu('fridge',S.bcStyles,[]);
  if(!menus.length){showInsufficientMenuModal(0,flowFridgeNames());return;}
  const best=menus.filter(n=>flowScoreMenuByFridge(n)>0);
  const selected=(best.length?best:menus).slice(0,totalMeals());
  flowCreatePlan(selected,`❄️ 냉장고 재료 우선으로 ${selected.length}개 메뉴를 배치했어요. 부족 재료는 장보기 탭에 자동 정리됩니다.`);
  flowBuildCart(selected);
  addUsage();
  go('a-meal');
}

function genBSuggest(){
  if(!S.bcStyles.length){alert('스타일을 선택해주세요');return;}
  const max=totalMeals();
  const pool=flowBuildMenu('style',S.bcStyles,[]).slice(0,Math.min(max+8,40));
  const typeOrder=["아침","점심","저녁"];
  S.bcSuggested=pool.map((name,i)=>({name,selected:i<Math.min(max,pool.length),type:typeOrder[i%3],ingredients:(MENU_DB[name]?.ingredients||[]).slice(0,3).map(x=>x.name),sharedWith:[]}));
  go('b-suggest');
}

function genBCCart(){
  try{
    const type=S.bcMode==='b'?'style':'wishlist';
    const seed=S.bcMode==='b'?(S.bcSuggested||[]).filter(m=>m.selected).map(m=>m.name):S.bcMenus;
    if(!seed.length){alert('메뉴를 먼저 선택해주세요');return;}
    const menus=flowBuildMenu(type,S.bcStyles,seed).slice(0,totalMeals());
    S.bcMenus=menus;
    flowBuildCart(menus);
    go('bc-cart');
  }catch(e){console.error(e);alert('재료 분석 중 오류: '+e.message);}
}



try{
  S.screen="splash";
  render();
}catch(e){
  console.error("WeeklyMeal start failed",e);
  document.getElementById("app").innerHTML='<div style="padding:28px;font-family:Pretendard,Arial,sans-serif"><h2>앱 시작 오류</h2><p>저장된 앱 데이터가 깨져 시작하지 못했습니다.</p><button onclick="localStorage.clear();location.reload()" style="padding:10px 18px;border:0;border-radius:12px;background:#4B3FD8;color:white;font-weight:800">저장데이터 초기화 후 재시작</button></div>';
}






// ── BC: 장보기 목록 생성 ──
const CATEGORY_MAP={"김치찌개": ["김치찌개", "참치김치찌개"], "된장찌개": ["된장찌개", "청국장찌개"], "순두부찌개": ["순두부찌개", "해물순두부찌개"], "제육볶음": ["제육볶음", "간장제육볶음"], "불고기": ["소불고기", "돼지불고기"], "갈비찜": ["갈비찜", "돼지갈비찜"], "파스타": ["알리오올리오", "봉골레파스타", "토마토파스타", "카르보나라", "볼로네제파스타"], "라멘": ["쇼유라멘", "미소라멘", "돈코츠라멘"], "우동": ["유부우동", "카레우동", "나베야키우동"], "볶음밥": ["김치볶음밥", "새우볶음밥", "계란볶음밥"], "샐러드": ["닭가슴살샐러드", "시저샐러드", "그릭샐러드"], "타코": ["비프타코", "치킨타코"], "카레": ["카레라이스", "카레라이스일식", "닭가슴살카레", "버터치킨", "치킨티카마살라"]};

function resolveMenu(menuName){
  if(MENU_DB[menuName]) return menuName;
  if(CATEGORY_MAP[menuName]){
    const subs=CATEGORY_MAP[menuName].filter(m=>MENU_DB[m]);
    if(subs.length) return subs[Math.floor(Math.random()*subs.length)];
  }
  const keys=Object.keys(MENU_DB);
  const partial=keys.filter(k=>k.includes(menuName)||menuName.includes(k));
  if(partial.length) return partial[Math.floor(Math.random()*partial.length)];
  return null;
}

function findSimilarMenus(menuNames, exclude=[]){
  const allIngs=new Set();
  for(const name of (Array.isArray(menuNames)?menuNames:[menuNames])){
    const db=MENU_DB[name];
    if(db) db.ingredients.forEach(i=>allIngs.add(i.name));
  }
  if(!allIngs.size) return[];
  const scores={};
  for(const[k,v]of Object.entries(MENU_DB)){
    if(exclude.includes(k)) continue;
    const overlap=v.ingredients.filter(i=>allIngs.has(i.name)).length;
    if(overlap>0) scores[k]=overlap;
  }
  return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,30).map(x=>x[0]);
}

function genBCCart(){
  try{
    const max=totalMeals();
    const resolved=S.bcMenus.map(m=>resolveMenu(m)).filter(Boolean);
    const unique=[...new Set(resolved)];
    let pool=[...unique];
    if(pool.length>0&&pool.length<max){
      const similar=findSimilarMenus(pool,pool);
      pool=[...pool,...similar.slice(0,max-pool.length)];
    }
    if(pool.length<max){
      const extra=Object.keys(MENU_DB).filter(k=>!pool.includes(k)).sort(()=>Math.random()-0.5).slice(0,max-pool.length);
      pool=[...pool,...extra];
    }
    S.bcMenus=pool;
    const {list}=getIngredientsFromDB(S.bcMenus,S.people);
    S.cart=list.map(i=>({...i,checked:i.inFridge||false,replaceName:"",replaceQty:""}));
    S.fridgeAdded=false;
    go("bc-cart");
  }catch(e){
    console.error("genBCCart 오류:",e);
    alert("재료 분석 중 오류: "+e.message);
  }
}

function rBCCart(){
  const cats=["채소","단백질","양념","면·밥","기타"];
  const catIcon={채소:"🥬",단백질:"🥩",양념:"🧄","면·밥":"🍚",기타:"🛒"};
  const done=S.cart.filter(i=>i.checked).length;
  const fridgeCount=S.cart.filter(i=>i.inFridge).length;
  const needBuy=S.cart.length-fridgeCount;
  let cartHTML="";
  for(const cat of cats){
    const items=S.cart.filter(i=>(i.category||"기타")===cat);
    if(!items.length)continue;
    cartHTML+=`<div style="margin-bottom:14px"><div class="sec">${catIcon[cat]} ${cat}</div>`;
    for(const item of items){
      const idx=S.cart.indexOf(item);
      const hf=item.inFridge;
      const shopInfo=!hf?getIngredientShopUrl(item.replaceName||item.name):null;
      cartHTML+=`<div class="shop-item" style="background:${hf?"#F0FFF6":"#fff"};border:1.5px solid ${hf?"#A5D6A7":"transparent"}">
        <div class="chk ${item.checked?"done":""}" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">${item.checked?"✓":""}</div>
        <span style="font-size:20px">${item.icon||getIcon(item.name)}</span>
        <div style="flex:1" onclick="S.cart[${idx}].checked=!S.cart[${idx}].checked;render()">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:14px;text-decoration:${item.checked?"line-through":"none"};color:${item.checked?"#bbb":"var(--text)"}">${item.replaceName||item.name}</span>
            ${hf?"<span style='font-size:10px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 6px;font-weight:700'>냉장고✓</span>":""}
          </div>
          <div style="font-size:11px;color:#aaa">${item.replaceQty||item.amount}${item.usedIn?" · "+item.usedIn:""}</div>
        </div>
        ${!hf&&!item.checked&&shopInfo?`<a href="${shopInfo.url}" target="_blank" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;background:#E2173C;color:#fff;border-radius:10px;padding:6px 8px;text-decoration:none;flex-shrink:0;gap:1px">
          <span style="font-size:14px">🛒</span>
          <span style="font-size:9px;font-weight:700">쿠팡</span>
        </a>`:""}
        <button onclick="openEditCart(${idx})" style="background:none;border:none;color:#aaa;font-size:13px;flex-shrink:0">✏️</button>
      </div>`;
    }
    cartHTML+="</div>";
  }
  return`<div style="padding:80px 20px 14px;background:linear-gradient(160deg,#FCE4EC,#fff)">
    <button class="back" onclick="go(S.bcMode==='b'?'b-suggest':'bc-entry')">←</button>
    <div class="title">🛒 ${S.people}인분 장보기</div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <div style="flex:1;background:#E8F5E9;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#2e7d32">냉장고✓</div>
        <div style="font-size:16px;font-weight:900;color:#2ECC71">${fridgeCount}개</div>
      </div>
      <div style="flex:1;background:#FFF8EE;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#e65100">사야할것</div>
        <div style="font-size:16px;font-weight:900;color:var(--primary)">${needBuy}개</div>
      </div>
      <div style="flex:1;background:#f8f8f8;border-radius:10px;padding:8px;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#888">완료</div>
        <div style="font-size:16px;font-weight:900;color:var(--primary)">${done}개</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-top:10px">
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=true);render()" style="flex:1;padding:8px;background:var(--primary-pale);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--primary)">✓ 전체선택</button>
      <button onclick="S.cart.forEach((_,i)=>S.cart[i].checked=false);render()" style="flex:1;padding:8px;background:#f5f5f5;border:none;border-radius:10px;font-size:12px;font-weight:700;color:#888">✕ 전체해제</button>
      <button onclick="S.cart=S.cart.filter(i=>!i.checked||i.inFridge);render()" style="flex:1;padding:8px;background:#FFF0F0;border:none;border-radius:10px;font-size:12px;font-weight:700;color:#e53935">🗑 선택삭제</button>
    </div>
  </div>
  <div class="px" style="padding-top:8px;padding-bottom:130px">${cartHTML}</div>
  <div class="bottom-bar">
    ${S.cartDone
      ?`<div style="text-align:center">
          <div style="font-size:13px;color:var(--green);font-weight:700;margin-bottom:8px">✅ 냉장고에 담겼어요!</div>
          <button onclick="go('home')" class="btn-p">🏠 홈으로 돌아가기</button>
        </div>`
      :`<button class="btn-g" ${done===0?"disabled":""} onclick="addToFridge()">❄️ 구매완료 - 냉장고에 넣기 (${done}개)</button>`
    }
  </div>
  <div id="cart-modal" style="display:none" class="modal-bg"><div class="modal-card">
    <div style="font-weight:800;font-size:17px;margin-bottom:16px" id="cart-modal-name"></div>
    <div class="sec" style="margin-bottom:4px">대체 재료명</div>
    <input id="cart-rep-name" class="inp" style="width:100%;margin-bottom:10px" placeholder="그대로면 비워두세요">
    <div class="sec" style="margin-bottom:4px">수량 수정</div>
    <input id="cart-rep-qty" class="inp" style="width:100%;margin-bottom:16px" placeholder="예: 500g">
    <button class="btn-p" onclick="confirmEditCart()">수정 완료</button>
    <button onclick="document.getElementById('cart-modal').style.display='none'" style="width:100%;padding:12px;background:none;border:none;color:#aaa;font-size:14px;margin-top:6px">취소</button>
  </div></div>`;
}

let _cartEditIdx=-1;
function openEditCart(idx){
  _cartEditIdx=idx;
  const item=S.cart[idx];
  document.getElementById('cart-modal-name').textContent=item.name;
  document.getElementById('cart-rep-name').value=item.replaceName||"";
  document.getElementById('cart-rep-qty').value=item.replaceQty||"";
  document.getElementById('cart-modal').style.display='flex';
}
function confirmEditCart(){
  if(_cartEditIdx<0)return;
  S.cart[_cartEditIdx].replaceName=document.getElementById('cart-rep-name').value;
  S.cart[_cartEditIdx].replaceQty=document.getElementById('cart-rep-qty').value;
  document.getElementById('cart-modal').style.display='none';
  render();
}


function rMeal(backScreen,gradColor){
  const plan=S.mealPlan;if(!plan)return"";
  const day=plan.weeklyMeal?.[S.currentDay];
  if(!day)return"";
  const tIcon={"아침":"🌅","점심":"☀️","저녁":"🌙"};
  return`<div style="padding:80px 20px 14px;background:linear-gradient(160deg,${gradColor||"var(--primary-pale)"},#fff)">
    <button class="back" onclick="go('home')">←</button>
    <div class="title">🍽️ 이번 주 식단</div>
    ${plan.tip?`<div style="background:rgba(255,255,255,0.8);border-radius:10px;padding:10px 13px;font-size:12px;color:#555;margin-top:10px">💡 ${plan.tip}</div>`:""}
  </div>
  <div class="day-tabs">
    ${(plan.weeklyMeal||[]).map((w,i)=>{
      const meals=w.meals||[];
      return`<button class="day-tab ${S.currentDay===i?"active":""}" onclick="S.currentDay=${i};render()">
        <span style="font-size:12px;font-weight:800">${w.day}</span>
        <span style="font-size:10px;color:#aaa">${meals.length}끼</span>
      </button>`;
    }).join("")}
  </div>
  <div class="px" style="padding-bottom:100px">
    ${day.meals&&day.meals.length?day.meals.map((m,mi)=>{
      const nut=calcNutrition(m.name,1);
      const sides=m.sides||[];
      const dayIdx=S.currentDay;
      return`<div style="background:var(--card);border-radius:18px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:42px;height:42px;background:var(--primary-pale);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px">${tIcon[m.type]||"🍽️"}</div>
          <div style="flex:1">
            <div style="font-size:11px;color:#aaa">${m.type}</div>
            <div style="font-weight:800;font-size:16px">${m.name}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
          <span class="badge">⏱ ${m.cookTime||getCookTime(m.name)}분</span>
          ${nut?`<span class="badge" style="background:#FFF3E0;color:#E65100">🔥 ${nut.calRange||nut.cal+"kcal"}</span>`:""}
          ${nut?`<span class="badge" style="background:#E3F2FD;color:#1976D2">단백질 ${nut.pro}g</span>`:""}
        </div>
        ${sides.length?`<div style="font-size:11px;color:#888;margin-bottom:8px">🍱 추천 반찬: ${sides.map(s=>`<button onclick="showSideRecipe('${s}')" style="background:#f5f5f5;border:none;border-radius:12px;padding:3px 8px;font-size:11px;margin:2px;cursor:pointer">${s}</button>`).join("")}</div>`:""}
        <button onclick="setMeal(${dayIdx},${mi})" style="width:100%;padding:10px;background:var(--primary);color:#fff;border:none;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer">레시피 보기 →</button>
      </div>`;
    }).join(""):`<div style="text-align:center;padding:40px 0;color:#aaa">이 날은 식사 계획이 없어요</div>`}
  </div>`;
}

function rRecipe(){
  const m=S.currentMeal;if(!m)return"";
  const tIcon={"아침":"🌅","점심":"☀️","저녁":"🌙"};
  const nut=calcNutrition(m.name,1);
  const fridgeNames=S.fridge.map(f=>f.name);
  return`<div style="padding:80px 20px 14px;background:linear-gradient(160deg,#E8F5E9,#fff)">
    <button class="back" onclick="go(S.recipeBack||'a-meal')">←</button>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span>${tIcon[m.type]||""}</span><span style="font-size:12px;color:#aaa;font-weight:700">${m.type||""}</span></div>
    <div class="title">${m.name}</div>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <span class="badge" style="background:#E8F5E9;color:#2e7d32">⏱ ${m.cookTime||getCookTime(m.name)}분</span>
      <span class="badge" style="background:#E3F2FD;color:#1565C0">👥 ${S.people}인분</span>
      ${nut?`<span class="badge" style="background:#FFF3E0;color:#E65100">🔥 ${nut.calRange||nut.cal+"kcal"}</span>`:""}
    </div>
    ${nut?`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px">
      <div style="background:#E3F2FD;border-radius:12px;padding:10px;text-align:center"><div style="font-size:10px;color:#1565C0;font-weight:700">단백질</div><div style="font-size:16px;font-weight:900;color:#1976D2">${nut.pro}g</div></div>
      <div style="background:#FFF3E0;border-radius:12px;padding:10px;text-align:center"><div style="font-size:10px;color:#E65100;font-weight:700">지방</div><div style="font-size:16px;font-weight:900;color:#F57C00">${nut.fat}g</div></div>
      <div style="background:#F3E5F5;border-radius:12px;padding:10px;text-align:center"><div style="font-size:10px;color:#4B3FD8;font-weight:700">탄수화물</div><div style="font-size:16px;font-weight:900;color:#4B3FD8">${nut.carb}g</div></div>
    </div>`:""}
  </div>
  <div style="margin:0 20px 8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
    <a href="https://www.10000recipe.com/recipe/list.html?q=${encodeURIComponent(m.name)}" target="_blank" style="padding:10px;background:#FF6B35;color:#fff;border-radius:12px;text-align:center;text-decoration:none;font-weight:700;font-size:12px">🍳 만개레시피</a>
    <a href="https://search.naver.com/search.naver?where=recipe&query=${encodeURIComponent(m.name+" 만들기")}" target="_blank" style="padding:10px;background:#03C75A;color:#fff;border-radius:12px;text-align:center;text-decoration:none;font-weight:700;font-size:12px">🔍 네이버</a>
    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(m.name+" 레시피")}" target="_blank" style="padding:10px;background:#FF0000;color:#fff;border-radius:12px;text-align:center;text-decoration:none;font-weight:700;font-size:12px">▶ 유튜브</a>
  </div>
  <div style="margin:0 20px 8px">
    <button onclick="addToDiary('${m.name}')" style="width:100%;padding:11px;background:var(--primary-pale);border:none;border-radius:12px;font-weight:700;font-size:13px;color:var(--primary);cursor:pointer">📔 식단 일기에 추가</button>
  </div>
  <div style="margin:0 20px 100px">
    <div class="sec">🧾 재료 목록</div>
    <div style="background:var(--card);border-radius:16px;padding:10px;box-shadow:var(--shadow)">
      ${(()=>{
        const db=MENU_DB[m.name];
        const ings=db?db.ingredients:[];
        if(!ings.length)return"<div style='color:#ccc;text-align:center;padding:12px'>재료 정보가 없어요</div>";
        const cats=["단백질","채소","면·밥","양념","기타"];
        const catIcon={"단백질":"🥩","채소":"🥬","면·밥":"🍚","양념":"🧄","기타":"🛒"};
        let html="";
        for(const cat of cats){
          const items=ings.filter(i=>(i.category||"기타")===cat);
          if(!items.length)continue;
          html+=`<div style="margin-bottom:10px"><div style="font-size:10px;color:#aaa;font-weight:700;letter-spacing:1px;margin-bottom:6px">${catIcon[cat]} ${cat}</div>`;
          for(const ing of items){
            const refined=refineIngredient(ing.name,m.name);
            const inF=fridgeNames.some(f=>f===ing.name||f===refined||f.includes(ing.name)||ing.name.includes(f));
            const amt=ing.amount?scaleAmt(ing.amount,S.people):"";
            const shopUrl=!inF?getIngredientShopUrl(refined):null;
            html+=`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:8px;flex:1">
                <span style="font-size:18px">${ing.icon||getIcon(ing.name)}</span>
                <div>
                  <div style="font-size:14px;font-weight:600;color:${inF?"#2e7d32":"var(--text)"}">
                    ${refined!==ing.name?refined:ing.name}
                    ${inF?"<span style='font-size:10px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 6px;margin-left:4px;font-weight:700'>냉장고✓</span>":""}
                  </div>
                  <div style="font-size:12px;color:var(--text-sub)">${amt}</div>
                </div>
              </div>
              ${!inF&&shopUrl?`<a href="${shopUrl.url}" target="_blank" style="display:flex;flex-direction:column;align-items:center;background:#E2173C;color:#fff;border-radius:10px;padding:6px 10px;text-decoration:none;flex-shrink:0">
                <span style="font-size:13px">🛒</span><span style="font-size:9px;font-weight:700">쿠팡</span>
              </a>`:`<span style="font-size:13px;color:#2ECC71;font-weight:700">${inF?"있음✓":""}</span>`}
            </div>`;
          }
          html+="</div>";
        }
        return html;
      })()}
    </div>
    ${(m.sides||[]).length?`<div class="sec" style="margin-top:16px">🍱 추천 반찬 <span style="font-size:11px;color:var(--primary)">(탭하면 레시피)</span></div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${(m.sides||[]).map(s=>{const sr=getSideRecipe(s);return`<button onclick="showSideRecipe('${s}')" style="background:${sr?"var(--primary-pale)":"#f5f5f5"};border:1px solid ${sr?"var(--primary)":"#ddd"};border-radius:20px;padding:5px 10px;font-size:12px;font-weight:600;color:${sr?"var(--primary)":"#666"}">${s}${sr?" 📖":""}</button>`;}).join("")}
    </div>`:""}
  </div>`;
}

function goMakeMeal(){
  // 이미 식단 있으면 확인 모달
  const hasCal = S.mealCalendar && Object.keys(S.mealCalendar).length > 0;
  if(hasCal){
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(26,26,46,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    const box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:20px;padding:24px;max-width:340px;width:100%';
    box.innerHTML = `
      <div style="font-size:32px;text-align:center;margin-bottom:12px">🗓️</div>
      <div style="font-weight:800;font-size:17px;text-align:center;margin-bottom:8px">이미 식단이 있어요</div>
      <div style="font-size:13px;color:#aaa;text-align:center;margin-bottom:20px;line-height:1.5">다시 짜면 기존 식단이 사라져요.<br>계속 진행할까요?</div>
      <button id="confirm-remake" style="width:100%;padding:10px;background:var(--primary);border:none;border-radius:14px;font-weight:700;font-size:15px;color:#fff;cursor:pointer;margin-bottom:10px">새로 짜기</button>
      <button id="cancel-remake" style="width:100%;padding:12px;background:#f5f5f5;border:none;border-radius:14px;font-weight:700;font-size:14px;color:#aaa;cursor:pointer">취소</button>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.getElementById('confirm-remake').onclick = () => { overlay.remove(); _doMakeMeal(); };
    document.getElementById('cancel-remake').onclick = () => overlay.remove();
    overlay.onclick = e => { if(e.target===overlay) overlay.remove(); };
    return;
  }
  _doMakeMeal();
}
function _doMakeMeal(){
  const fridgeNames=S.fridge.map(f=>f.name);
  const pool=S.bcMenus&&S.bcMenus.length>0 ? S.bcMenus : Object.keys(MENU_DB).sort(()=>Math.random()-0.5).slice(0,totalMeals());

  // 내일부터 시작
  const startDate=new Date();
  startDate.setDate(startDate.getDate()+1);

  const totalWeeks=S.planDuration||1;
  const totalDaysCount=7*totalWeeks;
  const dayNames=["일","월","화","수","목","금","토"];

  // 날짜별 메뉴 배정
  const mealCalendar={};
  const weeklyMeal=[]; // 기존 호환용
  let menuIdx=0;

  for(let i=0;i<totalDaysCount;i++){
    const d=new Date(startDate);
    d.setDate(startDate.getDate()+i);
    const key=dateKey(d);
    const dayName=["일","월","화","수","목","금","토"][d.getDay()];
    const slots=S.schedule[dayName]||[];
    if(!slots.length){ weeklyMeal.push({day:dayName,date:key,meals:[]}); continue; }

    const meals=slots.map(type=>{
      const name=pool[menuIdx%pool.length];
      menuIdx++;
      const db=MENU_DB[name];
      return{
        type, name,
        cookTime:getCookTime(name),
        sides:getSides(name,type),
        mainIngredients:db?db.ingredients.slice(0,3).map(i=>i.name):[],
      };
    });

    mealCalendar[key]=meals;
    weeklyMeal.push({day:dayName, date:key, meals});
  }

  S.mealCalendar=mealCalendar;
  S.mealPlan={weeklyMeal, tip:`${pool.length}개 메뉴로 ${totalWeeks>1?totalWeeks+'주':''} 식단을 구성했어요`};
  S.mealStartDate=dateKey(startDate);
  S.calSelectedDay=undefined;
  S.calViewDate=null;
  saveMeal();
  addUsage();
  setFlow(S.activeFlow);

  // 냉장고 부족 재료 알림
  const missing=[];
  pool.slice(0,7).forEach(name=>{
    const db=MENU_DB[name];
    if(!db) return;
    db.ingredients.filter(i=>i.category==="단백질"&&!fridgeNames.some(f=>f.includes(i.name)||i.name.includes(f)))
      .forEach(i=>missing.push(`"${name}" - ${i.name}`));
  });
  if(missing.length>0) showWarn([...new Set(missing)].slice(0,5));
  else go("home");
}
// 캘린더에서 메뉴 선택 → 레시피
function setCalMeal(dateKey, mealIdx){
  const cal=S.mealCalendar||{};
  const meals=cal[dateKey]||[];
  if(!meals[mealIdx]) return;
  S.currentMeal=meals[mealIdx];
  S.recipeBack='tab-meal';
  go('recipe');
}

// 초기화 2단계 모달
function confirmResetMeal(){
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(26,26,46,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px";
  const box=document.createElement("div");
  box.style.cssText="background:#fff;border-radius:20px;padding:24px;max-width:360px;width:100%";

  const title=document.createElement("div");
  title.style.cssText="font-weight:800;font-size:17px;margin-bottom:6px";
  title.textContent="🔄 식단 초기화";

  const sub=document.createElement("div");
  sub.style.cssText="font-size:13px;color:#aaa;margin-bottom:16px";
  sub.textContent="냉장고 재료는 어떤 경우에도 유지돼요";

  // 1단계: 식단만 초기화
  const btn1=document.createElement("button");
  btn1.style.cssText="width:100%;padding:10px;background:#FFF3E0;border:none;border-radius:14px;font-weight:700;font-size:14px;color:#E65100;cursor:pointer;margin-bottom:10px;text-align:left;display:flex;flex-direction:column;gap:4px";
  btn1.innerHTML='<span>🗓️ 식단만 초기화</span><span style="font-size:11px;font-weight:400;color:#aaa">식단 캘린더 삭제 · 냉장고/스케줄 유지</span>';
  btn1.onclick=()=>{
    S.mealCalendar={};
    S.mealPlan=null;
    S.mealStartDate=null;
    S.calViewDate=null;
    localStorage.removeItem("wm_cal");
    localStorage.removeItem("wm_meal");
    localStorage.removeItem("wm_cart_done");
    S.cart=[];S.cartDone=false;
    overlay.remove();
    render();
  };

  // 2단계: 완전 초기화
  const btn2=document.createElement("button");
  btn2.style.cssText="width:100%;padding:10px;background:#FFEBEE;border:none;border-radius:14px;font-weight:700;font-size:14px;color:#e53935;cursor:pointer;margin-bottom:10px;text-align:left;display:flex;flex-direction:column;gap:4px";
  btn2.innerHTML='<span>⚠️ 완전 초기화</span><span style="font-size:11px;font-weight:400;color:#aaa">식단+스케줄+기간 초기화 · 온보딩 재시작</span>';
  btn2.onclick=()=>{
    S.mealCalendar={};
    S.mealPlan=null;
    S.mealStartDate=null;
    S.calViewDate=null;
    S.planDuration=1;
    S.activeFlow=null;
    localStorage.removeItem("wm_cal");
    localStorage.removeItem("wm_meal");
    localStorage.removeItem("wm_schedule_set");
    localStorage.removeItem("wm_plan_duration");
    localStorage.removeItem("wm_flow");
    overlay.remove();
    go("onboard");
  };

  const cancelBtn=document.createElement("button");
  cancelBtn.style.cssText="width:100%;padding:12px;background:#f5f5f5;border:none;border-radius:12px;font-weight:700;font-size:14px;color:#aaa;cursor:pointer";
  cancelBtn.textContent="취소";
  cancelBtn.onclick=()=>overlay.remove();

  box.appendChild(title);
  box.appendChild(sub);
  box.appendChild(btn1);
  box.appendChild(btn2);
  box.appendChild(cancelBtn);
  overlay.appendChild(box);
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}

function rBSuggest(){
  const menus=S.bcSuggested||[];
  const sel=menus.filter(m=>m.selected).length;
  const max=totalMeals();
  const tIcon={"아침":"🌅","점심":"☀️","저녁":"🌙"};
  return`<div style="padding:52px 20px 12px;background:linear-gradient(160deg,#FFF8EE,#fff)">
    <button class="back" onclick="go('bc-entry')">←</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
      <div>
        <div class="title" style="margin:0">🍽️ 메뉴 추천</div>
        <div style="font-size:12px;color:#aaa;margin-top:2px">${sel}개 선택 / 최대 ${max}개</div>
      </div>
      ${sel>0?`<div style="background:var(--primary);color:#fff;border-radius:20px;padding:4px 14px;font-size:13px;font-weight:700">${sel}개</div>`:''}
    </div>
  </div>
  <div style="padding:8px 16px 140px;display:flex;flex-direction:column;gap:8px">
    ${menus.length===0?'<div style="text-align:center;padding:40px;color:#aaa">추천 메뉴가 없어요</div>':
    menus.map((m,i)=>{
      const nut=calcNutrition(m.name,1);
      const isS=getSeasonalScore(m.name)>0;
      const sel=m.selected;
      return`<div onclick="(function(){const cur=S.bcSuggested[${i}].selected;const selCount=S.bcSuggested.filter(m=>m.selected).length;if(!cur&&selCount>=${max})return;S.bcSuggested[${i}].selected=!cur;render();})()"
        style="background:${sel?'#FFF8EE':'#fff'};border:1.5px solid ${sel?'var(--primary)':'#f0f0f0'};
        border-radius:16px;padding:10px 16px;cursor:pointer;
        box-shadow:${sel?'0 2px 12px rgba(255,152,0,0.15)':'0 1px 4px rgba(0,0,0,0.05)'};
        display:flex;align-items:center;gap:12px">
        <div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;
          background:${sel?'var(--primary)':'#f5f5f5'};
          border:2px solid ${sel?'var(--primary)':'#e0e0e0'};
          display:flex;align-items:center;justify-content:center">
          ${sel?'<span style="color:#fff;font-size:13px;font-weight:900">✓</span>':''}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="font-weight:700;font-size:15px;color:${sel?'var(--primary)':'var(--text)'}">${m.name}</span>
            ${isS?'<span style="font-size:9px;background:#2ECC71;color:#fff;border-radius:6px;padding:1px 5px;font-weight:700">제철</span>':''}
          </div>
          <div style="font-size:11px;color:#aaa;display:flex;gap:8px">
            <span>${tIcon[m.type]||''} ${m.type}</span>
            <span>⏱ ${getCookTime(m.name)}분</span>
            ${nut?`<span style="color:#E65100">🔥 ${nut.calRange||nut.cal+"kcal"}</span>`:''}
          </div>
          ${m.ingredients&&m.ingredients.length?`<div style="font-size:11px;color:#bbb;margin-top:3px">${m.ingredients.slice(0,3).join(' · ')}</div>`:''}
        </div>
      </div>`;
    }).join('')}
  </div>
  <div class="bottom-bar">
    <div style="font-size:12px;color:#aaa;text-align:center;margin-bottom:8px">
      ${sel===0?'메뉴를 선택해주세요':sel<max?`${max-sel}개 더 선택 가능해요`:`${sel}개 선택 완료! 🎉`}
    </div>
    <button class="btn-o" ${sel===0?'disabled':''} onclick="S.bcMenus=S.bcSuggested.filter(m=>m.selected).map(m=>m.name);genBCCart()">
      🛒 재료 분석하기 (${sel}개)
    </button>
  </div>`;
}


function rMealTab(){
  const cal=S.mealCalendar||{};
  const tIcon={"아침":"☀️","점심":"🍽️","저녁":"🌙"};
  const tTone={
    "아침":["#FFF4DA","#F2A900"],
    "점심":["#F1ECFF","var(--primary)"],
    "저녁":["#EEF2F7","#475569"]
  };
  const now=new Date();
  const today=dateKey(now);
  let changed=false;

  Object.keys(cal).forEach(key=>{
    if(isPastDate(key)){
      cal[key].forEach(meal=>{
        const db=MENU_DB[meal.name];
        if(!db) return;
        db.ingredients.forEach(ing=>{
          const idx=S.fridge.findIndex(f=>f.name===ing.name||f.name.includes(ing.name)||ing.name.includes(f.name));
          if(idx!==-1) S.fridge.splice(idx,1);
        });
      });
      delete cal[key];
      changed=true;
    }
  });
  if(changed){S.mealCalendar=cal;saveMeal();saveFridge();}

  const fmtKcal=v=>Number(v||0).toLocaleString('ko-KR');
  const mealNut=m=>calcNutrition(m.name,1)||{cal:0,carb:0,pro:0,fat:0};
  const macroLine=n=>`탄 ${Math.round(n.carb||0)}g · 단 ${Math.round(n.pro||0)}g · 지 ${Math.round(n.fat||0)}g`;
  const mealCard=(m,idx,key)=>{
    const n=mealNut(m);
    const tone=tTone[m.type]||["#F1ECFF","var(--primary)"];
    const cook=(typeof getCookTime==='function'?getCookTime(m.name):'');
    return `<div onclick="setCalMeal('${key}',${idx})" style="position:relative;overflow:hidden;background:#fff;border:1px solid rgba(17,24,39,.07);border-radius:24px;padding:16px 16px 15px;box-shadow:0 14px 34px rgba(31,41,55,.07);cursor:pointer">
      <div style="position:absolute;right:-28px;top:-34px;width:92px;height:92px;border-radius:50%;background:${tone[0]};opacity:.9"></div>
      <div style="position:relative;z-index:1;display:flex;align-items:flex-start;gap:12px">
        <div style="width:44px;height:44px;border-radius:17px;background:${tone[0]};display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0">${tIcon[m.type]||'🍽️'}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
            <span style="font-size:11px;font-weight:800;color:${tone[1]};background:${tone[0]};border-radius:999px;padding:3px 9px">${m.type||'식사'}</span>
            ${cook?`<span style="font-size:11px;font-weight:500;color:#98A2B3">⏱ ${cook}분</span>`:''}
          </div>
          <div style="font-size:17px;font-weight:900;letter-spacing:-.6px;color:#111827;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:12px;gap:10px">
            <div>
              <div style="font-size:25px;font-weight:900;letter-spacing:-1px;color:#111827;line-height:1">${fmtKcal(n.cal)} <span style="font-size:12px;font-weight:700;color:#98A2B3">kcal</span></div>
              <div style="font-size:11px;color:#98A2B3;margin-top:5px;font-weight:400">${macroLine(n)}</div>
            </div>
            <div style="width:28px;height:28px;border-radius:11px;background:#F6F4FF;color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;flex-shrink:0">›</div>
          </div>
        </div>
      </div>
    </div>`;
  };

  if(S.calViewDate){
    const meals=cal[S.calViewDate]||[];
    const parts=S.calViewDate.split("-");
    const d=new Date(parseInt(parts[0]),parseInt(parts[1])-1,parseInt(parts[2]));
    const dayName=["일","월","화","수","목","금","토"][d.getDay()];
    const dayCal=meals.reduce((s,m)=>s+(mealNut(m).cal||0),0);
    const dayMacro=meals.reduce((a,m)=>{const n=mealNut(m);a.carb+=(n.carb||0);a.pro+=(n.pro||0);a.fat+=(n.fat||0);return a;},{carb:0,pro:0,fat:0});

    if(!meals.length) return`<div style="min-height:100%;padding:52px 20px 120px;background:linear-gradient(180deg,#F5F1FF 0%,#FBFAFF 44%,#F7F7FB 100%)">
      <button onclick="S.calViewDate=null;render()" style="width:40px;height:40px;border:none;border-radius:15px;background:#fff;box-shadow:0 10px 24px rgba(31,41,55,.08);font-size:20px;color:var(--primary);margin-bottom:14px">←</button>
      <div style="font-size:26px;font-weight:900;letter-spacing:-1px">${d.getMonth()+1}/${d.getDate()} (${dayName})</div>
      <div style="margin-top:34px;text-align:center;padding:34px 20px;background:#fff;border-radius:26px;border:1px solid rgba(17,24,39,.06);box-shadow:0 14px 34px rgba(31,41,55,.06)">
        <div style="font-size:40px;margin-bottom:8px">📅</div>
        <div style="font-weight:800;color:#111827">아직 빈칸이에요</div>
      </div>
    </div>`;

    return`<div style="min-height:100%;padding:52px 20px 120px;background:linear-gradient(180deg,#F5F1FF 0%,#FBFAFF 44%,#F7F7FB 100%)">
      <button onclick="S.calViewDate=null;render()" style="width:40px;height:40px;border:none;border-radius:15px;background:#fff;box-shadow:0 10px 24px rgba(31,41,55,.08);font-size:20px;color:var(--primary);margin-bottom:14px">←</button>

      <div style="border-radius:30px;padding:20px;background:linear-gradient(145deg,#7C5CFF,#A486FF);color:#fff;box-shadow:0 24px 48px rgba(124,92,255,.22);margin-bottom:16px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.14)"></div>
        <div style="position:relative;z-index:1">
          <div style="font-size:12px;font-weight:700;opacity:.82;margin-bottom:6px">${d.getMonth()+1}월 ${d.getDate()}일 ${dayName}요일</div>
          <div style="font-size:32px;font-weight:900;letter-spacing:-1.3px;line-height:1">${fmtKcal(dayCal)} kcal</div>
          <div style="font-size:12px;opacity:.84;margin-top:7px">${meals.length}끼 · ${macroLine(dayMacro)}</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${meals.map((m,mi)=>mealCard(m,mi,S.calViewDate)).join("")}
      </div>
    </div>`;
  }

  const hasAny=Object.keys(cal).length>0;
  const viewMonth=S.calViewMonth!=null?S.calViewMonth:now.getMonth();
  const viewYear=S.calViewYear!=null?S.calViewYear:now.getFullYear();
  const firstDay=new Date(viewYear,viewMonth,1).getDay();
  const daysInMonth=new Date(viewYear,viewMonth+1,0).getDate();
  const startOffset=firstDay===0?6:firstDay-1;
  const monthNames=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const monthMeals=Object.keys(cal).filter(k=>{
    const [y,m]=k.split("-").map(Number);
    return y===viewYear && m===viewMonth+1;
  }).reduce((s,k)=>s+(cal[k]||[]).length,0);
  const monthCal=Object.keys(cal).filter(k=>{
    const [y,m]=k.split("-").map(Number);
    return y===viewYear && m===viewMonth+1;
  }).reduce((s,k)=>s+(cal[k]||[]).reduce((a,m)=>a+(mealNut(m).cal||0),0),0);

  return`<div style="min-height:100%;padding:52px 20px 120px;background:linear-gradient(180deg,#F5F1FF 0%,#FBFAFF 44%,#F7F7FB 100%)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:13px;color:#7C6FC9;font-weight:800;margin-bottom:5px">MEAL PLAN</div>
        <div style="font-size:28px;font-weight:900;letter-spacing:-1.1px;color:#111827;line-height:1.1">식단 캘린더</div>
      </div>
      ${hasAny?`<button onclick="confirmResetMeal()" style="background:#FFF0F0;border:none;border-radius:14px;padding:9px 12px;font-size:11px;font-weight:800;color:#e53935">초기화</button>`:''}
    </div>

    <div style="display:grid;grid-template-columns:1.1fr .9fr;gap:10px;margin-bottom:16px">
      <div style="background:#fff;border:1px solid rgba(17,24,39,.07);border-radius:24px;padding:16px;box-shadow:0 12px 30px rgba(31,41,55,.06)">
        <div style="font-size:11px;color:#98A2B3;font-weight:700;margin-bottom:5px">이번 달 예정</div>
        <div style="font-size:30px;font-weight:900;letter-spacing:-1px;color:#111827;line-height:1">${monthMeals}<span style="font-size:13px;color:#98A2B3;font-weight:700"> 끼</span></div>
      </div>
      <div style="background:#fff;border:1px solid rgba(17,24,39,.07);border-radius:24px;padding:16px;box-shadow:0 12px 30px rgba(31,41,55,.06)">
        <div style="font-size:11px;color:#98A2B3;font-weight:700;margin-bottom:5px">예상 섭취</div>
        <div style="font-size:22px;font-weight:900;letter-spacing:-.7px;color:var(--primary);line-height:1">${fmtKcal(monthCal)}<span style="font-size:11px;color:#98A2B3;font-weight:700"> kcal</span></div>
      </div>
    </div>

    <div style="background:#fff;border:1px solid rgba(17,24,39,.07);border-radius:30px;padding:16px;box-shadow:0 16px 38px rgba(31,41,55,.07)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <button onclick="if(S.calViewMonth==null)S.calViewMonth=new Date().getMonth();S.calViewMonth--;if(S.calViewMonth<0){S.calViewMonth=11;if(S.calViewYear==null)S.calViewYear=new Date().getFullYear();S.calViewYear--;}render()" style="width:36px;height:36px;border:none;border-radius:14px;background:#F6F4FF;color:var(--primary);font-size:22px">‹</button>
        <div style="font-size:17px;font-weight:900;color:#111827">${viewYear}년 ${monthNames[viewMonth]}</div>
        <button onclick="if(S.calViewMonth==null)S.calViewMonth=new Date().getMonth();S.calViewMonth++;if(S.calViewMonth>11){S.calViewMonth=0;if(S.calViewYear==null)S.calViewYear=new Date().getFullYear();S.calViewYear++;}render()" style="width:36px;height:36px;border:none;border-radius:14px;background:#F6F4FF;color:var(--primary);font-size:22px">›</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:7px">
        ${["월","화","수","목","금","토","일"].map(d=>`<div style="text-align:center;font-size:11px;font-weight:800;color:${d==='토'||d==='일'?'#EF8B8B':'#98A2B3'}">${d}</div>`).join("")}
      </div>

      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">
        ${Array(startOffset).fill('<div></div>').join("")}
        ${Array.from({length:daysInMonth},(_,i)=>{
          const day=i+1;
          const key=`${viewYear}-${viewMonth+1}-${day}`;
          const dayMeals=cal[key];
          const isToday=key===today;
          const isPast=key<today;
          const hasMeals=dayMeals&&dayMeals.length>0;
          const dayCal=hasMeals?dayMeals.reduce((s,m)=>s+(mealNut(m).cal||0),0):0;
          return`<div onclick="${hasMeals?`S.calViewDate='${key}';render()`:''}"
            style="border-radius:16px;padding:7px 2px;text-align:center;min-height:62px;cursor:${hasMeals?'pointer':'default'};background:${isToday?'linear-gradient(145deg,#7C5CFF,#9D7BFF)':hasMeals?'#F8F7FF':'transparent'};border:1px solid ${isToday?'transparent':hasMeals?'#E6E1FF':'transparent'};opacity:${isPast&&!isToday?0.48:1};position:relative">
            <div style="font-size:12px;font-weight:900;color:${isToday?'#fff':hasMeals?'#111827':'#CCD1DA'}">${day}</div>
            ${hasMeals?`<div style="display:flex;justify-content:center;gap:2px;margin-top:7px">
              ${dayMeals.slice(0,4).map(m=>`<div style="width:5px;height:5px;border-radius:50%;background:${isToday?'rgba(255,255,255,.85)':(tTone[m.type]||['','var(--primary)'])[1]}"></div>`).join("")}
            </div>
            ${dayCal>0?`<div style="font-size:8px;color:${isToday?'rgba(255,255,255,.82)':'#7C6FC9'};margin-top:4px;font-weight:800">${Math.round(dayCal/100)*100}</div>`:''}`:
            `<div style="font-size:9px;color:#E5E7EB;margin-top:10px">-</div>`}
          </div>`;
        }).join("")}
      </div>
    </div>

    ${!hasAny?`<div style="text-align:center;padding:30px 20px;background:#fff;border:1px solid rgba(17,24,39,.07);border-radius:28px;margin-top:16px;box-shadow:0 14px 34px rgba(31,41,55,.06)">
      <div style="font-size:42px;margin-bottom:10px">📅</div>
      <div style="font-weight:900;font-size:17px;color:#111827">아직 빈칸이에요</div>
      <div style="font-size:13px;color:#98A2B3;margin-top:6px;margin-bottom:16px">홈에서 식단을 짜면 달력에 채워져요</div>
      <button onclick="go('home')" class="btn-p">식단 짜러 가기</button>
    </div>`:''}
  </div>`;
}

function rWeeklyCalendar(weekDays,seasonal,tIcon){
  const days=weekDays||[];
  return`<div style="padding:0 20px 100px">
    ${days.map((w,i)=>{
      if(!w.meals||!w.meals.length) return`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#f8f8f8;border-radius:12px;margin-bottom:6px">
        <div style="font-weight:700;color:#ccc">${w.day||""}요일</div>
        <div style="font-size:12px;color:#ddd">아직 빈칸이에요</div>
      </div>`;
      const dayCal=w.meals.reduce((s,m)=>{const n=calcNutrition(m.name,1);return s+(n?n.cal:0);},0);
      return`<div onclick="S.calSelectedDay=${i};render()" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--card);border-radius:12px;cursor:pointer;box-shadow:var(--shadow);margin-bottom:6px">
        <div style="font-weight:800">${w.day||""}요일</div>
        <div style="display:flex;align-items:center;gap:8px">
          ${dayCal>0?`<span style="font-size:11px;color:#E65100">🔥${dayCal}kcal</span>`:''}
          <span style="font-size:13px;color:#aaa">${w.meals.map(m=>tIcon[m.type]||'').join("")}</span>
          <span style="color:#ddd">›</span>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function rMonthlyCalendar(plan,seasonal,tIcon){
  return rMealTab();
}

function genMonthlyMeal(){
  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const pool=Object.keys(MENU_DB).sort(()=>Math.random()-0.5);
  const monthPlan={};
  let pi=0;
  for(let d=1;d<=daysInMonth;d++){
    const key=`${year}-${month+1}-${d}`;
    const dow=new Date(year,month,d).getDay();
    const slots=dow===0||dow===6?["아침","점심","저녁"]:["점심","저녁"];
    monthPlan[key]=slots.map(type=>({type,name:pool[pi++%pool.length],cookTime:20}));
  }
  S.monthlyPlan=monthPlan;
  S.mealCalendar={...S.mealCalendar,...monthPlan};
  S.showMonthly=true;
  saveMeal();
  render();
}
