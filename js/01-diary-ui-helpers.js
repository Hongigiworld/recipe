/* ===== inline-script-11 ===== */
function _safeShelfLife(name){
  if(typeof getShelfLife==='function') return getShelfLife(name);
  return {days:7, storage:'냉장'};
}


// ── 칼로리 목표 저장 ──
function saveCalGoal(){
  localStorage.setItem('wm_cal_goal', String(S.calorieGoal));
}

// ── 식단 일기 저장 ──
function saveMealDiary(){
  localStorage.setItem('wm_meal_diary', JSON.stringify(S.mealDiary));
}
function saveTodayMeals(){
  localStorage.setItem('wm_today_meals', JSON.stringify(S.todayMeals));
}

// ── 오늘 날짜 키 ──


// ── 식단 일기에 메뉴 추가 ──
function addToDiary(menuName, sourceDateKey){
  const key = sourceDateKey || todayKey();
  if(!S.mealDiary[key]) S.mealDiary[key]=[];
  const nut=calcNutrition(menuName,1);
  S.mealDiary[key].push({
    name:menuName,
    time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),
    cal:nut?nut.cal:0,
    pro:nut?nut.pro:0,
    fat:nut?nut.fat:0,
    carb:nut?nut.carb:0,
  });
  saveMealDiary();
  alert(menuName+" 식단 일기에 추가됐어요!");
}

// ── 식단 일기 화면 ──
function rDiaryTab(){
  const key=todayKey();
  if(!S.mealDiary || typeof S.mealDiary!=='object') S.mealDiary={};
  const today=S.mealDiary[key]||[];
  const todayCal=today.reduce((s,m)=>s+(Number(m.cal)||0),0);
  const todayPro=today.reduce((s,m)=>s+(Number(m.pro)||0),0);
  const todayCarb=today.reduce((s,m)=>s+(Number(m.carb)||0),0);
  const todayFat=today.reduce((s,m)=>s+(Number(m.fat)||0),0);
  const goalCal=S.calorieGoal||2000;
  const pct=Math.min(100,Math.round(todayCal/goalCal*100));
  const remain=Math.max(0,goalCal-todayCal);

  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const k=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    const meals=S.mealDiary[k]||[];
    const cal=meals.reduce((s,m)=>s+(Number(m.cal)||0),0);
    days.push({date:d.getDate(),day:["일","월","화","수","목","금","토"][d.getDay()],key:k,meals,cal});
  }

  const plannedToday = (S.mealCalendar&&S.mealCalendar[key]) ? S.mealCalendar[key] : [];
  const plannedHTML = plannedToday.length ? plannedToday.map((m,i)=>{
    const name = m.name || m.menu || m.title || '';
    const type = m.type || m.meal || '';
    const nut = name ? calcNutrition(name,1) : null;
    const already = today.some(x=>x.name===name);
    return `<div class="diary-plan-row">
      <div class="diary-meal-dot">${type==='아침'?'☀️':type==='저녁'?'🌙':'🍽️'}</div>
      <div class="diary-plan-main">
        <div class="diary-plan-name">${name||'메뉴 없음'}</div>
        <div class="diary-plan-sub">${type||'식사'} · ${nut?nut.cal+' kcal':'영양정보 없음'}</div>
      </div>
      <button class="diary-mini-btn ${already?'done':''}" ${already?'disabled':''} onclick="${already?'':'addToDiary(\''+String(name).replace(/'/g,"\'")+'\',\''+key+'\');render()'}">${already?'기록됨':'기록'}</button>
    </div>`;
  }).join('') : `<div class="diary-empty-small">오늘 예정된 식단이 아직 없어요.</div>`;

  return`<div class="diary-v2">
    <div class="diary-head">
      <div>
        <div class="diary-kicker">FOOD DIARY</div>
        <div class="title" style="margin:0">식단 일기</div>
        <div class="diary-date">${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'})}</div>
      </div>
      <button class="diary-head-btn" onclick="showDiaryAdd()">+ 기록</button>
    </div>

    <div class="diary-hero">
      <div class="diary-hero-top">
        <div>
          <div class="diary-label">오늘 섭취</div>
          <div class="diary-cal"><b>${todayCal}</b><span>/ ${goalCal} kcal</span></div>
        </div>
        <div class="diary-ring" style="--p:${pct}">
          <span>${pct}%</span>
        </div>
      </div>
      <div class="diary-progress"><i style="width:${pct}%"></i></div>
      <div class="diary-hero-foot">
        ${todayCal>goalCal?`목표보다 <b>${todayCal-goalCal} kcal</b> 초과했어요.`:`오늘 <b>${remain} kcal</b> 더 섭취 가능해요.`}
      </div>
    </div>

    <div class="diary-macro-grid">
      <div class="diary-macro-card">
        <span>탄수화물</span><b>${Math.round(todayCarb)}g</b>
      </div>
      <div class="diary-macro-card">
        <span>단백질</span><b>${Math.round(todayPro)}g</b>
      </div>
      <div class="diary-macro-card">
        <span>지방</span><b>${Math.round(todayFat)}g</b>
      </div>
    </div>

    <div class="diary-card">
      <div class="diary-card-title">
        <div>
          <b>오늘 예정 식단</b>
          <span>예정된 식단만 기록할 수 있어요</span>
        </div>
      </div>
      <div class="diary-plan-list">${plannedHTML}</div>
    </div>

    <div class="diary-card">
      <div class="diary-card-title">
        <div>
          <b>오늘 기록</b>
          <span>${today.length}개 메뉴</span>
        </div>
        <button onclick="showDiaryAdd()">+ 추가</button>
      </div>
      ${today.length===0?`<div class="diary-empty">아직 기록된 식단이 없어요.<br><span>오늘 먹은 메뉴를 기록하면 칼로리와 탄단지가 자동 집계돼요.</span></div>`:
        `<div class="diary-eaten-list">${today.map((m,i)=>`<div class="diary-eaten-row">
          <div class="diary-eaten-icon">🍽️</div>
          <div class="diary-eaten-main">
            <div>${m.name}</div>
            <span>${m.time||''} · 탄 ${Math.round(m.carb||0)}g · 단 ${Math.round(m.pro||0)}g · 지 ${Math.round(m.fat||0)}g</span>
          </div>
          <b>${Math.round(m.cal||0)} kcal</b>
          <button onclick="S.mealDiary['${key}'].splice(${i},1);saveMealDiary();render()">×</button>
        </div>`).join('')}</div>`}
    </div>

    <div class="diary-card">
      <div class="diary-card-title">
        <div><b>주간 현황</b><span>최근 7일 칼로리 기록</span></div>
      </div>
      <div class="diary-week-grid">
        ${days.map(d=>`<div class="diary-day">
          <span>${d.day}</span>
          <b>${d.date}</b>
          <i style="height:${Math.min(100,Math.max(8,Math.round(d.cal/goalCal*100)))}%;background:${d.cal===0?'#E5E7EB':d.cal>goalCal?'#EF4444':'var(--wm-primary)'}"></i>
          <em>${d.cal===0?'-':Math.round(d.cal/100)*100}</em>
        </div>`).join('')}
      </div>
    </div>

    ${rNutritionReport(days)}
  </div>`;
}

// ── 영양 주간 리포트 ──
function rNutritionReport(days){
  const totals=days.reduce((acc,d)=>{
    (d.meals||[]).forEach(m=>{acc.cal+=Number(m.cal)||0;acc.pro+=Number(m.pro)||0;acc.fat+=Number(m.fat)||0;acc.carb+=Number(m.carb)||0;});
    return acc;
  },{cal:0,pro:0,fat:0,carb:0});
  const activeDays=days.filter(d=>d.cal>0).length||1;
  const avg={
    cal:Math.round(totals.cal/activeDays),
    pro:Math.round(totals.pro/activeDays),
    fat:Math.round(totals.fat/activeDays),
    carb:Math.round(totals.carb/activeDays),
  };
  const totalMacro=(avg.pro*4)+(avg.fat*9)+(avg.carb*4)||1;
  const carbPct=Math.round(avg.carb*4/totalMacro*100);
  const proPct=Math.round(avg.pro*4/totalMacro*100);
  const fatPct=Math.max(0,100-carbPct-proPct);
  const goalCal=S.calorieGoal||2000;

  return`<div class="diary-card diary-report">
    <div class="diary-card-title">
      <div><b>영양 주간 리포트</b><span>기록한 날 기준 평균</span></div>
    </div>

    <div class="diary-report-main">
      <div>
        <span>평균 칼로리</span>
        <b>${avg.cal}</b>
        <em>kcal / 목표 ${goalCal}</em>
      </div>
      <div>
        <span>평균 단백질</span>
        <b>${avg.pro}g</b>
        <em>하루 평균</em>
      </div>
    </div>

    <div class="diary-ratio-title">탄 · 단 · 지 비율</div>
    <div class="diary-ratio">
      <i style="width:${carbPct}%"></i>
      <i style="width:${proPct}%"></i>
      <i style="width:${fatPct}%"></i>
    </div>
    <div class="diary-ratio-legend">
      <span>탄수 ${carbPct}%</span>
      <span>단백질 ${proPct}%</span>
      <span>지방 ${fatPct}%</span>
    </div>

    ${avg.cal===0?`<div class="diary-empty-small">아직 기록이 부족해요. 식단을 기록하면 리포트가 채워져요.</div>`:''}
  </div>`;
}

// ── 식단 일기 추가 팝업 ──
function showDiaryAdd(){
  const overlay=document.createElement("div");
  overlay.className="diary-sheet-bg";
  const sheet=document.createElement("div");
  sheet.className="diary-sheet";

  const title=document.createElement("div");
  title.className="diary-sheet-title";
  title.innerHTML="<b>식단 기록 추가</b><span>오늘 먹은 메뉴를 검색해서 추가하세요</span>";

  const input=document.createElement("input");
  input.placeholder="메뉴 검색...";
  input.className="diary-sheet-input";

  const list=document.createElement("div");
  list.className="diary-sheet-list";

  function buildList(q){
    list.innerHTML="";
    const lq=String(q||'').toLowerCase();
    const keys=Object.keys(MENU_DB).filter(k=>!q||String(k).toLowerCase().includes(lq)).slice(0,28);
    if(!keys.length){
      list.innerHTML='<div class="diary-empty-small">검색 결과가 없어요.</div>';
      return;
    }
    keys.forEach(name=>{
      const nut=calcNutrition(name,1);
      const btn=document.createElement("button");
      btn.className="diary-search-row";
      btn.innerHTML=`<div><b>${name}</b><span>${nut?`탄 ${Math.round(nut.carb||0)}g · 단 ${Math.round(nut.pro||0)}g · 지 ${Math.round(nut.fat||0)}g`:''}</span></div><em>${nut?nut.cal+' kcal':''}</em>`;
      btn.onclick=()=>{addToDiary(name);overlay.remove();render();};
      list.appendChild(btn);
    });
  }

  input.oninput=()=>buildList(input.value);
  buildList("");

  const closeBtn=document.createElement("button");
  closeBtn.className="diary-sheet-close";
  closeBtn.textContent="닫기";
  closeBtn.onclick=()=>overlay.remove();

  sheet.appendChild(title);
  sheet.appendChild(input);
  sheet.appendChild(list);
  sheet.appendChild(closeBtn);
  overlay.appendChild(sheet);
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(()=>input.focus(),80);
}

function showWarn(msgs){
  if(!msgs||!msgs.length){go("home");return;}
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px";
  const box=document.createElement("div");
  box.style.cssText="background:#fff;border-radius:20px;padding:24px;max-width:360px;width:100%";
  const title=document.createElement("div");
  title.style.cssText="font-weight:800;font-size:17px;margin-bottom:12px";
  title.textContent="재료 부족 안내";
  box.appendChild(title);
  msgs.forEach(function(m){
    const d=document.createElement("div");
    d.style.cssText="font-size:13px;color:#555;padding:6px 0;border-bottom:1px solid #f0f0f0";
    d.textContent=m;
    box.appendChild(d);
  });
  const btn=document.createElement("button");
  btn.style.cssText="width:100%;padding:12px;background:var(--primary);color:#fff;border:none;border-radius:12px;font-weight:700;font-size:14px;margin-top:14px;cursor:pointer";
  btn.textContent="확인하고 식단 보기";
  btn.onclick=function(){overlay.remove();go("home");};
  box.appendChild(btn);
  overlay.appendChild(box);
  overlay.onclick=function(e){if(e.target===overlay){overlay.remove();go("home");}};
  document.body.appendChild(overlay);
}

function openStyleDrop(){
  const existing=document.getElementById('style-modal');
  if(existing){existing.remove();return;}

  const ALL_STYLES=[
    {group:"국내/기본", items:[{id:"한식",e:"🍚"},{id:"일식",e:"🍱"},{id:"중식",e:"🥢"},{id:"헬시",e:"🥗"}]},
    {group:"동남아시아", items:[{id:"🇹🇭 태국",e:"🇹🇭"},{id:"🇻🇳 베트남",e:"🇻🇳"},{id:"🇮🇩 인도네시아",e:"🇮🇩"},{id:"🇲🇾 말레이시아",e:"🇲🇾"},{id:"🇸🇬 싱가포르",e:"🇸🇬"},{id:"🇵🇭 필리핀",e:"🇵🇭"},{id:"🇹🇼 대만",e:"🇹🇼"}]},
    {group:"남아시아/중동", items:[{id:"🇮🇳 인도",e:"🇮🇳"},{id:"🌙 중동",e:"🌙"},{id:"🇹🇷 터키",e:"🇹🇷"}]},
    {group:"유럽", items:[{id:"🇬🇷 그리스",e:"🇬🇷"},{id:"🇪🇸 스페인",e:"🇪🇸"},{id:"🇫🇷 프랑스",e:"🇫🇷"},{id:"🇮🇹 이탈리아",e:"🇮🇹"},{id:"🇩🇪 독일",e:"🇩🇪"},{id:"🇵🇹 포르투갈",e:"🇵🇹"},{id:"🇷🇺 러시아",e:"🇷🇺"},{id:"🇵🇱 폴란드",e:"🇵🇱"},{id:"🇸🇪 스웨덴",e:"🇸🇪"},{id:"🇨🇿 체코",e:"🇨🇿"}]},
    {group:"아메리카", items:[{id:"🇲🇽 멕시코",e:"🇲🇽"},{id:"🇺🇸 미국",e:"🇺🇸"},{id:"🇦🇷 아르헨티나",e:"🇦🇷"},{id:"🇧🇷 브라질",e:"🇧🇷"},{id:"🇵🇪 페루",e:"🇵🇪"},{id:"🇨🇴 콜롬비아",e:"🇨🇴"},{id:"🇯🇲 자메이카",e:"🇯🇲"}]},
    {group:"아프리카", items:[{id:"🇲🇦 모로코",e:"🇲🇦"},{id:"🇪🇹 에티오피아",e:"🇪🇹"},{id:"🇳🇬 나이지리아",e:"🇳🇬"},{id:"🇹🇳 튀니지",e:"🇹🇳"}]}
  ];

  // DOM으로 직접 생성 - 백틱/따옴표 충돌 없음
  function buildList(q){
    const lq=q.toLowerCase();
    const listEl=document.getElementById('style-modal-list');
    if(!listEl)return;
    listEl.innerHTML='';
    let found=false;
    ALL_STYLES.forEach(grp=>{
      const items=grp.items.filter(s=>!q||s.id.toLowerCase().includes(lq));
      if(!items.length)return;
      found=true;
      const hdr=document.createElement('div');
      hdr.style.cssText='padding:8px 16px 4px;font-size:11px;font-weight:700;color:#aaa;letter-spacing:1px';
      hdr.textContent=grp.group;
      listEl.appendChild(hdr);
      items.forEach(s=>{
        const sel=S.bcStyles.includes(s.id);
        const btn=document.createElement('button');
        btn.style.cssText='width:100%;padding:13px 16px;border:none;background:'+(sel?'#FFF8EE':'#fff')+';display:flex;align-items:center;gap:12px;text-align:left;border-bottom:1px solid #f5f5f5;cursor:pointer';
        // 이름 span
        const nameEl = document.createElement('span');
        const nameTxt = s.id.includes(' ') ? s.id.split(' ').slice(1).join(' ') : s.id;
        nameEl.style.cssText = 'font-weight:600;font-size:15px;flex:1;color:'+(sel?'var(--primary)':'var(--text)');
        nameEl.textContent = nameTxt;

        btn.appendChild(nameEl);

        if(sel){
          const chk = document.createElement('span');
          chk.style.cssText = 'color:var(--primary);font-size:18px;font-weight:900';
          chk.textContent = '✓';
          btn.appendChild(chk);
        }

        btn.addEventListener('click',function(){
          pushStyle(s.id, true);
          // 선택 후 목록 갱신
          const q2=document.getElementById('style-search-modal')?.value||'';
          buildList(q2);
        });
        listEl.appendChild(btn);
      });
    });
    if(!found){
      const empty=document.createElement('div');
      empty.style.cssText='padding:24px;text-align:center;color:#aaa;font-size:14px';
      empty.textContent='검색 결과가 없어요';
      listEl.appendChild(empty);
    }
  }

  // 모달 생성
  const overlay=document.createElement('div');
  overlay.id='style-modal';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(26,26,46,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center';

  const sheet=document.createElement('div');
  sheet.style.cssText='background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden';

  // 헤더
  const hdr=document.createElement('div');
  hdr.style.cssText='padding:16px 16px 10px;border-bottom:1px solid #f0f0f0;flex-shrink:0';
  const titleRow=document.createElement('div');
  titleRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
  const title=document.createElement('div');
  title.style.cssText='font-weight:800;font-size:16px';
  title.textContent='음식 스타일 선택';
  const closeBtn=document.createElement('button');
  closeBtn.style.cssText='background:#f0f0f0;border:none;border-radius:10px;padding:6px 14px;font-size:13px;color:#666;font-weight:600;cursor:pointer';
  closeBtn.textContent='완료';
  closeBtn.onclick=()=>overlay.remove();
  titleRow.appendChild(title);
  titleRow.appendChild(closeBtn);

  const search=document.createElement('input');
  search.id='style-search-modal';
  search.placeholder='국가/스타일 검색...';
  search.style.cssText='width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:14px;outline:none;box-sizing:border-box';
  search.oninput=function(){buildList(this.value);};

  hdr.appendChild(titleRow);
  hdr.appendChild(search);

  // 리스트 컨테이너
  const listEl=document.createElement('div');
  listEl.id='style-modal-list';
  listEl.style.cssText='overflow-y:auto;flex:1;padding-bottom:24px';

  sheet.appendChild(hdr);
  sheet.appendChild(listEl);
  overlay.appendChild(sheet);
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);

  buildList('');
  setTimeout(()=>search.focus(),100);
}


function flagImg(emoji){
  if(!emoji) return '';
  try {
    // 유니코드 코드포인트로 twemoji SVG URL 직접 생성
    const codepoints = [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
    const url = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/' + codepoints + '.svg';
    return '<img src="' + url + '" style="width:20px;height:20px;vertical-align:middle;display:inline-block" onerror="this.style.display=\'none\';this.insertAdjacentHTML(\'afterend\',\'<span>'+emoji+'</span>\')">';
  } catch(e) {
    return '<span style="font-size:16px">'+emoji+'</span>';
  }
}

function pushStyle(id, skipRender){
  if(!S.bcStyles.includes(id)) S.bcStyles.push(id);
  if(!skipRender) render();
}

function removeStyle(id, skipRender){
  S.bcStyles = S.bcStyles.filter(x=>x!==id);
  if(!skipRender) render();
}






function setMeal(dayIdx, mealIdx, backScreen){
  const plan = S.mealPlan;
  if(!plan||!plan.weeklyMeal) return;
  const day = plan.weeklyMeal[dayIdx];
  if(!day||!day.meals) return;
  S.currentMeal = day.meals[mealIdx];
  S.recipeBack = backScreen||'a-meal';
  go('recipe');
}
function setMealFromMonthly(dateKey, mealIdx){
  if(!S.monthlyPlan||!S.monthlyPlan[dateKey]) return;
  S.currentMeal = S.monthlyPlan[dateKey][mealIdx];
  S.recipeBack = 'tab-meal';
  go('recipe');
}

// ── 브랜드 DB ──
const BRAND_DB={
  김치:[{name:"종갓집",product:"포기김치 3kg",icon:"🥬",color:"#c62828",url:"https://coupa.ng/jongga_kimchi",until:"2025-12-31"},{name:"비비고",product:"썰은김치 500g",icon:"🥬",color:"#d32f2f",url:"https://smartstore.naver.com/bibigo",until:"2025-11-30"}],
  깍두기:[{name:"종갓집",product:"깍두기 500g",icon:"🥕",color:"#c62828",url:"https://coupa.ng/jongga_kimchi",until:"2025-12-31"},{name:"풀무원",product:"깍두기 400g",icon:"🥕",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  나물:[{name:"풀무원",product:"시금치나물 200g",icon:"🥬",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"},{name:"동원",product:"모둠나물 3종",icon:"🌿",color:"#1565c0",url:"https://smartstore.naver.com/dongwon",until:"2025-12-31"}],
  시금치나물:[{name:"풀무원",product:"시금치나물 200g",icon:"🥬",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  콩나물무침:[{name:"풀무원",product:"콩나물무침 200g",icon:"🌿",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  계란말이:[{name:"CJ",product:"햇반 계란말이 2입",icon:"🥚",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  계란후라이:[{name:"CJ",product:"햇반 반찬 계란",icon:"🥚",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  감자볶음:[{name:"오뚜기",product:"감자볶음 200g",icon:"🥔",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"}],
  장조림:[{name:"CJ",product:"소고기 장조림 200g",icon:"🥩",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"},{name:"동원",product:"장조림 180g",icon:"🥩",color:"#1565c0",url:"https://smartstore.naver.com/dongwon",until:"2025-12-31"}],
  조림:[{name:"CJ",product:"두부조림 200g",icon:"🟫",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"},{name:"오뚜기",product:"생선조림 200g",icon:"🐟",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"}],
  멸치볶음:[{name:"동원",product:"멸치볶음 100g",icon:"🐟",color:"#1565c0",url:"https://smartstore.naver.com/dongwon",until:"2025-12-31"},{name:"CJ",product:"마른반찬 멸치",icon:"🐟",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  어묵볶음:[{name:"삼진어묵",product:"어묵볶음 200g",icon:"🟡",color:"#e65100",url:"https://smartstore.naver.com/samjin",until:"2025-12-31"},{name:"고래사",product:"어묵 모둠",icon:"🟡",color:"#0288d1",url:"https://smartstore.naver.com/koraesa",until:"2025-12-31"}],
  단무지:[{name:"피코크",product:"단무지 350g",icon:"🟡",color:"#6a1b9a",url:"https://emart.ssg.com",until:"2025-12-31"},{name:"오뚜기",product:"단무지 300g",icon:"🟡",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"}],
  오이무침:[{name:"풀무원",product:"오이무침 200g",icon:"🥒",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  깻잎:[{name:"풀무원",product:"깻잎무침 150g",icon:"🌿",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  상추:[{name:"풀무원",product:"신선 상추 150g",icon:"🥬",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  샐러드:[{name:"풀무원",product:"샐러드 믹스 150g",icon:"🥗",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"},{name:"피코크",product:"시저샐러드 키트",icon:"🥗",color:"#6a1b9a",url:"https://emart.ssg.com",until:"2025-12-31"}],
  고추장:[{name:"순창",product:"태양초 고추장 500g",icon:"🌶️",color:"#b71c1c",url:"https://smartstore.naver.com/sunchang",until:"2025-12-31"},{name:"청정원",product:"순창 고추장",icon:"🌶️",color:"#558b2f",url:"https://smartstore.naver.com/daesang",until:"2025-12-31"}],
  된장:[{name:"청정원",product:"명품 된장 500g",icon:"🥣",color:"#795548",url:"https://smartstore.naver.com/daesang",until:"2025-12-31"},{name:"샘표",product:"된장 450g",icon:"🥣",color:"#4e342e",url:"https://smartstore.naver.com/sempio",until:"2025-12-31"}],
  쌈장:[{name:"CJ",product:"쌈장 170g",icon:"🥣",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"},{name:"청정원",product:"강된장 쌈장",icon:"🥣",color:"#558b2f",url:"https://smartstore.naver.com/daesang",until:"2025-12-31"}],
  참기름:[{name:"오뚜기",product:"참기름 320ml",icon:"🫙",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"},{name:"청정원",product:"들기름 320ml",icon:"🫙",color:"#558b2f",url:"https://smartstore.naver.com/daesang",until:"2025-12-31"}],
  간장:[{name:"샘표",product:"501 진간장 930ml",icon:"🍶",color:"#4e342e",url:"https://smartstore.naver.com/sempio",until:"2025-12-31"},{name:"CJ",product:"백설 국간장",icon:"🍶",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  무나물:[{name:"풀무원",product:"무나물 200g",icon:"🥬",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  도라지무침:[{name:"풀무원",product:"도라지무침 150g",icon:"🥬",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  고사리나물:[{name:"풀무원",product:"고사리나물 200g",icon:"🌿",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"}],
  연근조림:[{name:"CJ",product:"연근조림 200g",icon:"🥬",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  알감자조림:[{name:"오뚜기",product:"알감자조림 200g",icon:"🥔",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"}],
  두부조림:[{name:"풀무원",product:"두부조림 200g",icon:"🟫",color:"#2e7d32",url:"https://smartstore.naver.com/pulmuone",until:"2025-12-31"},{name:"CJ",product:"두부조림 200g",icon:"🟫",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  피클:[{name:"오뚜기",product:"오이피클 320g",icon:"🥒",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"},{name:"피코크",product:"모둠피클 380g",icon:"🥒",color:"#6a1b9a",url:"https://emart.ssg.com",until:"2025-12-31"}],
  교자:[{name:"비비고",product:"왕교자 385g",icon:"🥟",color:"#d32f2f",url:"https://smartstore.naver.com/bibigo",until:"2025-12-31"},{name:"CJ",product:"육즙만두 350g",icon:"🥟",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  만두:[{name:"비비고",product:"왕교자 385g",icon:"🥟",color:"#d32f2f",url:"https://smartstore.naver.com/bibigo",until:"2025-12-31"},{name:"동원",product:"떡만두국 500g",icon:"🥟",color:"#1565c0",url:"https://smartstore.naver.com/dongwon",until:"2025-12-31"}],
  순대:[{name:"하림",product:"순대 500g",icon:"🌭",color:"#ff6f00",url:"https://smartstore.naver.com/harim",until:"2025-12-31"}],
  튀김:[{name:"오뚜기",product:"냉동튀김 모둠 500g",icon:"🍤",color:"#f57c00",url:"https://smartstore.naver.com/ottogi",until:"2025-12-31"},{name:"CJ",product:"고소한 튀김 400g",icon:"🍤",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"}],
  기타:[{name:"CJ",product:"햇반 210g x3",icon:"🍚",color:"#1976d2",url:"https://smartstore.naver.com/cj",until:"2025-12-31"},{name:"동원",product:"참치캔 3입",icon:"🐟",color:"#0288d1",url:"https://smartstore.naver.com/dongwon",until:"2025-11-30"}],
};

// ── 반찬 매핑 ──


// ── 조리시간 매핑 ──

// ── 사이드/반찬 레시피 DB ──
const SIDES_RECIPE = {
  // ─── 한식 반찬 ───
  "김치": {
    desc:"발효 배추김치",
    ingredients:["배추 1포기","굵은소금 1컵","고춧가루 1컵","마늘 1통","생강 1큰술","새우젓 3큰술","액젓 4큰술","설탕 1큰술","쪽파 1단"],
    steps:["배추를 4등분해 소금에 절여 6시간 둔다","절인 배추를 씻어 물기를 짠다","양념재료를 모두 섞어 김치소를 만든다","배추에 김치소를 켜켜이 버무린다","용기에 담아 실온 하루 후 냉장 보관"],
    cookTime:30, tip:"소금절임 시간이 맛의 핵심이에요"
  },
  "계란말이": {
    desc:"부드러운 일식풍 계란말이",
    ingredients:["계란 3개","당근 1/4개","파 약간","소금 약간","설탕 1/2작은술","식용유 적당량"],
    steps:["계란에 소금, 설탕, 다진 채소를 넣고 잘 풀어준다","달군 팬에 기름을 두르고 계란물을 붓는다","반쯤 익으면 한쪽으로 말아가며 돌돌 만다","식으면 먹기 좋은 크기로 썬다"],
    cookTime:10, tip:"약불에서 천천히 말아야 예쁘게 나와요"
  },
  "시금치나물": {
    desc:"참기름향 시금치나물",
    ingredients:["시금치 300g","참기름 1큰술","간장 1큰술","다진마늘 1작은술","소금 약간","참깨 약간"],
    steps:["시금치를 끓는 물에 30초 데친다","찬물에 헹궈 물기를 꼭 짠다","간장, 참기름, 마늘, 소금으로 무친다","참깨를 뿌려 완성"],
    cookTime:10, tip:"데치는 시간이 너무 길면 색이 변해요"
  },
  "콩나물무침": {
    desc:"아삭한 콩나물무침",
    ingredients:["콩나물 300g","참기름 1큰술","간장 1큰술","고춧가루 1작은술","다진마늘 1작은술","소금 약간","대파 약간"],
    steps:["콩나물을 끓는 물에 3~4분 삶는다","찬물에 헹궈 물기를 뺀다","양념재료와 함께 골고루 무친다"],
    cookTime:10, tip:"뚜껑 열고 삶아야 비린내가 안 나요"
  },
  "멸치볶음": {
    desc:"달콤짭조름 멸치볶음",
    ingredients:["잔멸치 200g","간장 1큰술","설탕 1큰술","물엿 1큰술","다진마늘 1작은술","참기름 1큰술","참깨 약간","식용유 1큰술"],
    steps:["마른 팬에 멸치를 볶아 비린내를 날린다","식용유를 두르고 마늘을 볶는다","간장, 설탕, 물엿을 넣고 볶는다","참기름과 참깨를 뿌려 마무리"],
    cookTime:10, tip:"마지막에 참기름 넣으면 윤기가 나요"
  },
  "감자볶음": {
    desc:"담백한 감자채볶음",
    ingredients:["감자 3개","소금 약간","참기름 1큰술","식용유 1큰술","대파 약간"],
    steps:["감자를 채썰어 찬물에 담가 전분을 뺀다","팬에 기름을 두르고 감자채를 볶는다","소금으로 간하고 참기름으로 마무리"],
    cookTime:15, tip:"찬물에 담가야 부서지지 않아요"
  },
  "두부조림": {
    desc:"짭조름한 두부조림",
    ingredients:["두부 1모","간장 3큰술","고춧가루 1큰술","설탕 1큰술","다진마늘 1큰술","대파 약간","참기름 1큰술","식용유 2큰술"],
    steps:["두부를 도톰하게 썰어 기름에 앞뒤로 굽는다","간장, 설탕, 고춧가루, 마늘, 물을 섞어 양념을 만든다","구운 두부 위에 양념을 넣고 조린다","대파와 참기름으로 마무리"],
    cookTime:15, tip:"두부는 충분히 구워야 양념이 잘 배어요"
  },
  "오이무침": {
    desc:"새콤달콤 오이무침",
    ingredients:["오이 2개","소금 1큰술","고춧가루 1큰술","식초 1큰술","설탕 1작은술","다진마늘 1작은술","참기름 1큰술","참깨 약간"],
    steps:["오이를 반달 모양으로 썰어 소금에 절인다","15분 후 물기를 꼭 짠다","양념재료와 함께 무친다","참깨를 뿌려 완성"],
    cookTime:10, tip:"물기를 잘 짜야 물이 생기지 않아요"
  },
  "무나물": {
    desc:"달콤한 무나물",
    ingredients:["무 400g","들기름 1큰술","간장 1큰술","다진마늘 1작은술","소금 약간","대파 약간"],
    steps:["무를 채썰어 들기름에 볶는다","간장, 마늘을 넣고 계속 볶는다","소금으로 간하고 대파를 넣어 마무리"],
    cookTime:15, tip:"들기름에 볶으면 풍미가 살아나요"
  },
  "계란찜": {
    desc:"부드러운 뚝배기 계란찜",
    ingredients:["계란 3개","멸치육수 200ml","소금 약간","참기름 1작은술","대파 약간"],
    steps:["계란을 잘 풀어준다","멸치육수와 소금을 넣고 섞는다","뚝배기에 부어 약불에서 10분 익힌다","대파와 참기름으로 마무리"],
    cookTime:10, tip:"약불에서 천천히 익혀야 부드러워요"
  },
  "깍두기": {
    desc:"아삭한 깍두기",
    ingredients:["무 1개","굵은소금 2큰술","고춧가루 3큰술","다진마늘 1큰술","새우젓 1큰술","설탕 1큰술","쪽파 약간"],
    steps:["무를 깍두기 모양으로 썰어 소금에 30분 절인다","물기를 빼고 고춧가루로 버무린다","마늘, 새우젓, 설탕을 넣고 무친다","쪽파를 넣어 완성"],
    cookTime:20, tip:"소금 절임 후 물기를 잘 빼야 해요"
  },
  "겉절이": {
    desc:"신선한 상추 겉절이",
    ingredients:["상추 200g","고춧가루 1큰술","간장 1큰술","식초 1큰술","참기름 1큰술","설탕 1작은술","깨 약간"],
    steps:["상추를 씻어 먹기 좋게 뜯는다","양념재료를 모두 섞는다","먹기 직전에 버무린다"],
    cookTime:5, tip:"먹기 직전에 버무려야 싱싱해요"
  },
  // ─── 일식 사이드 ───
  "미소국": {
    desc:"일본식 된장국",
    ingredients:["미소된장 2큰술","두부 1/4모","미역 약간","대파 약간","다시마육수 500ml"],
    steps:["다시마육수를 끓인다","두부와 미역을 넣는다","불을 끄고 미소된장을 풀어 넣는다","대파를 넣어 완성"],
    cookTime:10, tip:"된장은 끓이지 않아야 향이 살아요"
  },
  "단무지": {
    desc:"노란 단무지",
    ingredients:["무 1개","식초 100ml","설탕 3큰술","소금 1큰술","강황가루 1작은술"],
    steps:["무를 길게 채썰거나 통으로 썬다","절임액 재료를 모두 섞는다","무에 절임액을 붓고 하루 절인다"],
    cookTime:10, tip:"강황가루가 노란색을 내요"
  },
  "오이절임": {
    desc:"일식풍 오이절임",
    ingredients:["오이 2개","소금 1큰술","식초 2큰술","설탕 1큰술","생강 약간"],
    steps:["오이를 얇게 썰어 소금에 절인다","물기를 꼭 짠다","식초, 설탕, 생강으로 무친다"],
    cookTime:10, tip:"생강이 일식 풍미를 내줘요"
  },
  "교자": {
    desc:"바삭한 군만두",
    ingredients:["교자피 20장","돼지고기 150g","배추 200g","부추 50g","간장 1큰술","참기름 1큰술","소금 약간","식용유 적당량"],
    steps:["속재료를 모두 섞어 소를 만든다","교자피에 소를 넣고 빚는다","팬에 기름 두르고 교자를 굽는다","물을 넣고 뚜껑 덮어 5분 쪄낸다"],
    cookTime:25, tip:"물을 넣고 찌면 속까지 잘 익어요"
  },
  "절임채소": {
    desc:"일식풍 모둠 절임채소",
    ingredients:["오이 1개","당근 1/2개","무 100g","식초 100ml","설탕 3큰술","소금 1큰술"],
    steps:["채소를 먹기 좋은 크기로 썬다","절임액을 끓여 식힌다","채소에 절임액을 붓고 1시간 이상 절인다"],
    cookTime:10, tip:"냉장고에 1주일 보관 가능해요"
  },
  // ─── 중식 사이드 ───
  "달걀수프": {
    desc:"중식 에그드롭 수프",
    ingredients:["계란 2개","닭육수 500ml","전분 1큰술","소금 약간","파 약간","참기름 1작은술"],
    steps:["닭육수를 끓인다","전분물을 넣어 살짝 걸쭉하게 한다","계란을 풀어 실처럼 넣는다","소금, 참기름, 파로 마무리"],
    cookTime:10, tip:"계란은 천천히 저으면서 넣어야 실처럼 돼요"
  },
  "중화피클": {
    desc:"중식풍 채소피클",
    ingredients:["오이 1개","당근 1/2개","식초 2큰술","설탕 1큰술","소금 약간","고추 약간","참기름 약간"],
    steps:["채소를 어슷썰기한다","소금에 살짝 절인다","식초, 설탕, 고추로 무친다","참기름으로 마무리"],
    cookTime:10, tip:"냉장고에서 차갑게 먹으면 더 맛있어요"
  },
  "양파절임": {
    desc:"중식 양파절임",
    ingredients:["양파 2개","식초 3큰술","설탕 2큰술","소금 1큰술","고추 약간"],
    steps:["양파를 채썰어 소금에 10분 절인다","물기를 빼고 식초, 설탕으로 무친다","냉장고에 30분 재워 먹는다"],
    cookTime:10, tip:"짜장면, 짬뽕에 곁들이면 딱이에요"
  },
  "시저샐러드": {
    desc:"클래식 시저샐러드",
    ingredients:["로메인 200g","파마산 치즈 30g","크루통 50g","시저드레싱 3큰술","레몬즙 약간","후추 약간"],
    steps:["로메인을 씻어 먹기 좋게 뜯는다","시저드레싱과 버무린다","파마산 치즈를 갈아 올린다","크루통을 얹어 완성"],
    cookTime:5, tip:"드레싱은 먹기 직전에 버무려야 해요"
  },
  "그린샐러드": {
    desc:"신선한 믹스그린 샐러드",
    ingredients:["믹스그린 150g","방울토마토 10개","오이 1/2개","올리브오일 2큰술","발사믹 1큰술","소금 약간","후추 약간"],
    steps:["채소를 씻어 준비한다","드레싱 재료를 섞는다","먹기 직전에 드레싱을 뿌린다"],
    cookTime:5, tip:"발사믹 드레싱이 이 샐러드와 잘 어울려요"
  },
  "마늘빵": {
    desc:"바삭한 갈릭 버터빵",
    ingredients:["바게트 1/2개","버터 50g","다진마늘 1큰술","파슬리 약간","소금 약간"],
    steps:["버터를 실온에 두어 부드럽게 한다","마늘, 파슬리, 소금을 섞어 마늘버터를 만든다","빵에 마늘버터를 바른다","180도 오븐에서 10분 굽는다"],
    cookTime:15, tip:"에어프라이어로도 쉽게 만들 수 있어요"
  },
  "루꼴라샐러드": {
    desc:"이탈리안 루꼴라 샐러드",
    ingredients:["루꼴라 100g","파마산 치즈 20g","레몬즙 1큰술","올리브오일 2큰술","소금 약간","후추 약간"],
    steps:["루꼴라를 씻어 물기를 뺀다","올리브오일과 레몬즙으로 드레싱을 만든다","루꼴라에 드레싱을 뿌린다","파마산 치즈를 갈아 올린다"],
    cookTime:5, tip:"파마산을 듬뿍 올려야 이탈리아 풍미가 나요"
  },
  "감자퓨레": {
    desc:"크리미한 매쉬드 포테이토",
    ingredients:["감자 4개","버터 50g","우유 100ml","소금 약간","후추 약간","파슬리 약간"],
    steps:["감자를 삶아 뜨거울 때 으깬다","버터를 넣고 섞는다","우유를 조금씩 넣으며 크림처럼 만든다","소금, 후추로 간한다"],
    cookTime:25, tip:"뜨거울 때 버터를 넣어야 잘 녹아요"
  },
  "콜슬로": {
    desc:"크리미 코울슬로",
    ingredients:["양배추 1/4통","당근 1/2개","마요네즈 3큰술","식초 1큰술","설탕 1큰술","소금 약간","후추 약간"],
    steps:["양배추와 당근을 채썬다","소금에 10분 절여 물기를 짠다","마요네즈, 식초, 설탕으로 드레싱을 만든다","채소와 드레싱을 버무린다"],
    cookTime:10, tip:"냉장고에 1시간 두면 맛이 들어요"
  },
  "브루스케타": {
    desc:"이탈리안 브루스케타",
    ingredients:["바게트 1/2개","토마토 2개","바질 약간","올리브오일 2큰술","마늘 1쪽","소금 약간"],
    steps:["바게트를 슬라이스해 오븐에 굽는다","토마토를 다져 올리브오일, 소금과 섞는다","구운 빵에 마늘을 문지른다","토마토 토핑을 올리고 바질로 장식"],
    cookTime:10, tip:"토마토는 씨를 제거해야 질척이지 않아요"
  },
  // ─── 동남아 사이드 ───
  "과카몰레": {
    desc:"멕시칸 아보카도 딥",
    ingredients:["아보카도 2개","라임즙 2큰술","양파 1/4개","고수 약간","소금 약간","할라피뇨 약간"],
    steps:["아보카도를 으깨 라임즙을 넣는다","다진 양파, 고수, 할라피뇨를 넣는다","소금으로 간한다"],
    cookTime:5, tip:"라임즙이 색변화를 막아줘요"
  },
  "살사소스": {
    desc:"신선한 토마토 살사",
    ingredients:["토마토 3개","양파 1/4개","고수 약간","라임즙 1큰술","소금 약간","할라피뇨 1개"],
    steps:["모든 재료를 잘게 다진다","라임즙과 소금으로 간한다","30분 냉장 숙성 후 제공"],
    cookTime:10, tip:"냉장 숙성하면 맛이 더 진해져요"
  },
  "후무스": {
    desc:"중동식 병아리콩 딥",
    ingredients:["병아리콩 400g","타히니 3큰술","레몬즙 3큰술","마늘 2쪽","올리브오일 3큰술","소금 약간","파프리카파우더 약간"],
    steps:["병아리콩을 삶거나 캔을 사용한다","모든 재료를 블렌더에 넣고 간다","올리브오일을 뿌리고 파프리카로 장식"],
    cookTime:10, tip:"병아리콩 삶은 물을 넣으면 더 부드러워요"
  },
  "타불레": {
    desc:"레바논 허브 샐러드",
    ingredients:["파슬리 100g","토마토 2개","오이 1개","불구르 50g","레몬즙 3큰술","올리브오일 3큰술","소금 약간","민트 약간"],
    steps:["불구르를 뜨거운 물에 20분 불린다","파슬리, 토마토, 오이를 잘게 다진다","모든 재료를 섞고 레몬즙과 오일로 드레싱"],
    cookTime:15, tip:"파슬리를 잘게 다질수록 정통 맛이 나요"
  },
};

// 사이드 레시피 조회

function showSideRecipe(sideName){
  const recipe=getSideRecipe(sideName);
  if(!recipe){
    alert(`${sideName}의 레시피 정보가 없어요`);
    return;
  }
  const el=document.createElement("div");
  el.id="side-recipe-popup";
  el.style.cssText="position:fixed;inset:0;background:rgba(26,26,46,0.7);z-index:1000;display:flex;align-items:flex-end;justify-content:center";
  el.innerHTML=`<div style="background:#fff;border-radius:24px 24px 0 0;padding:24px 20px 44px;width:100%;max-width:480px;max-height:80vh;overflow-y:auto">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-weight:800;font-size:18px">${sideName}</div>
        <div style="font-size:12px;color:#aaa">${recipe.desc||""} · ⏱ ${recipe.cookTime||10}분</div>
      </div>
      <button onclick="document.getElementById('side-recipe-popup').remove()" style="background:#f5f5f5;border:none;border-radius:10px;padding:8px 12px;font-size:14px">✕</button>
    </div>

    <div style="background:#f8f8f8;border-radius:14px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:#888;margin-bottom:8px;letter-spacing:1px">🥬 재료</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${recipe.ingredients.map(i=>`<span style="background:#fff;border:1px solid #e0e0e0;border-radius:20px;padding:4px 10px;font-size:12px">${i}</span>`).join("")}
      </div>
    </div>

    <div style="margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:#888;margin-bottom:8px;letter-spacing:1px">👨‍🍳 만드는 법</div>
      ${recipe.steps.map((s,i)=>`<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
        <div style="width:22px;height:22px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${i+1}</div>
        <div style="font-size:13px;color:var(--text);line-height:1.5">${s}</div>
      </div>`).join("")}
    </div>

    ${recipe.tip?`<div style="background:var(--primary-pale);border-radius:12px;padding:10px 14px">
      <div style="font-size:12px;color:var(--primary)">💡 ${recipe.tip}</div>
    </div>`:""}
  </div>`;
  el.onclick=function(e){if(e.target===el)el.remove();};
  document.body.appendChild(el);
}

function getSideRecipe(sideName){
  // 정확한 매칭
  if(SIDES_RECIPE[sideName]) return SIDES_RECIPE[sideName];
  // 부분 매칭
  for(const[k,v] of Object.entries(SIDES_RECIPE)){
    if(sideName.includes(k)||k.includes(sideName)) return v;
  }
  return null;
}

function getCookTime(menuName){
  const rules=[
    // 60분+ - 오래 걸리는 요리 (먼저 체크)
    {keywords:["갈비찜","갈비탕","설렁탕","곰탕","삼계탕","백숙","사골","보쌈","수육","족발","동파","홍소","꼬리찜","소꼬리"], time:60},
    // 35분 - 솥밥
    {keywords:["솥밥"], time:35},
    // 30분 - 조림/찜/스튜
    {keywords:["조림","찜","라멘","카레","스튜","수프","피자","스테이크","추어탕","감자탕"], time:30},
    // 25분 - 구이/전/튀김/파스타
    {keywords:["구이","전","튀김","강정","가라아게","데리야끼","파스타","리조또","짜장","짬뽕","탕수"], time:25},
    // 20분 - 볶음/찌개
    {keywords:["볶음","찌개","된장","순두부","청국장","전골","수제비","칼국수","덮밥","규동","오야코","가츠동","잡채"], time:20},
    // 15분 - 빠른 밥/면
    {keywords:["볶음밥","라면","국수","우동","소바","야키소바","볶음면","냉면","비빔면","비빔밥","죽"], time:15},
    // 10분 - 간단 요리
    {keywords:["계란말이","오믈렛","토스트","샌드위치","냉국","무침","겉절이","냉채","샐러드"], time:10},
    // 5분 - 즉석
    {keywords:["계란후라이","스크램블","온천계란","냉두부","연두부무침","참기름계란밥","버터간장밥","명란버터밥","참치마요밥","계란찜"], time:5},
  ];
  for(const rule of rules){
    if(rule.keywords.some(kw=>menuName.includes(kw))) return rule.time;
  }
  return 20; // 기본값
}


// ── 쿠팡 파트너스 설정 ──
const COUPANG_PARTNER_ID = "YOUR_PARTNER_ID"; // 실제 파트너스 ID로 교체
const COUPANG_SUB_ID = "weeklymeal";
