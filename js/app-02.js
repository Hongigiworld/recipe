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

function getCoupangUrl(keyword){
  // 쿠팡 파트너스 검색 링크
  const encoded = encodeURIComponent(keyword);
  return `https://coupa.ng/search?q=${encoded}&partner=${COUPANG_PARTNER_ID}&subId=${COUPANG_SUB_ID}`;
}

function getMarketKurlyUrl(keyword){
  return `https://www.kurly.com/search?sword=${encodeURIComponent(keyword)}`;
}

function getShoppingUrl(keyword, prefer="coupang"){
  if(prefer==="kurly") return getMarketKurlyUrl(keyword);
  return getCoupangUrl(keyword);
}

// 재료별 추천 구매처 & 검색어
const INGREDIENT_SHOP = {
  // 육류
  "돼지삼겹살": {query:"돼지 삼겹살 500g", shop:"coupang"},
  "돼지목살": {query:"돼지 목살 500g", shop:"coupang"},
  "돼지앞다리살": {query:"돼지 앞다리살 500g", shop:"coupang"},
  "돼지등심": {query:"돼지 등심 500g", shop:"coupang"},
  "돼지갈비": {query:"돼지 갈비 1kg", shop:"coupang"},
  "소고기불고기용": {query:"소고기 불고기용 500g", shop:"coupang"},
  "소고기양지": {query:"소고기 양지 500g", shop:"coupang"},
  "소안심": {query:"소 안심 스테이크", shop:"coupang"},
  "소갈비": {query:"소 갈비찜용 1kg", shop:"coupang"},
  "닭가슴살": {query:"닭가슴살 1kg", shop:"coupang"},
  "닭다리살": {query:"닭다리살 1kg", shop:"coupang"},
  "토종닭": {query:"토종닭 한마리", shop:"coupang"},
  // 해산물
  "새우": {query:"냉동 새우 500g", shop:"kurly"},
  "연어": {query:"생 연어 필렛", shop:"kurly"},
  "고등어": {query:"고등어 손질", shop:"coupang"},
  "오징어": {query:"오징어 손질", shop:"coupang"},
  "굴": {query:"생굴 500g", shop:"kurly"},
  "홍합": {query:"홍합 1kg", shop:"coupang"},
  "바지락": {query:"바지락 1kg", shop:"coupang"},
  // 채소
  "당근": {query:"당근 1kg", shop:"coupang"},
  "감자": {query:"감자 1kg", shop:"coupang"},
  "양파": {query:"양파 1.5kg", shop:"coupang"},
  "대파": {query:"대파 1단", shop:"coupang"},
  "마늘": {query:"깐마늘 1kg", shop:"coupang"},
  "브로콜리": {query:"브로콜리 1개", shop:"kurly"},
  "아보카도": {query:"아보카도 4개", shop:"kurly"},
  // 유제품
  "버터": {query:"버터 무염 200g", shop:"coupang"},
  "생크림": {query:"생크림 500ml", shop:"coupang"},
  "치즈": {query:"슬라이스 치즈 20장", shop:"coupang"},
  "모짜렐라": {query:"모짜렐라 치즈 200g", shop:"kurly"},
  // 양념
  "올리브오일": {query:"올리브오일 500ml", shop:"coupang"},
  "사프란": {query:"사프란 스페인산", shop:"coupang"},
  "코코넛밀크": {query:"코코넛밀크 400ml", shop:"coupang"},
};

function getIngredientShopUrl(ingName){
  // 정확한 매칭
  if(INGREDIENT_SHOP[ingName]){
    const s=INGREDIENT_SHOP[ingName];
    return {url:getShoppingUrl(s.query,s.shop), query:s.query};
  }
  // 부분 매칭
  for(const[k,v]of Object.entries(INGREDIENT_SHOP)){
    if(ingName.includes(k)||k.includes(ingName)){
      return {url:getShoppingUrl(v.query,v.shop), query:v.query};
    }
  }
  // 기본: 쿠팡 검색
  return {url:getCoupangUrl(ingName), query:ingName};
}


// ── 영양 DB (100g당 기준) ──
const NUTRITION_DB = {
  // 육류
  "돼지삼겹살":  {cal:331, pro:17, fat:29, carb:0},
  "돼지목살":    {cal:263, pro:17, fat:22, carb:0},
  "돼지앞다리살":{cal:183, pro:20, fat:11, carb:0},
  "돼지등심":    {cal:155, pro:22, fat:7,  carb:0},
  "돼지갈비":    {cal:280, pro:18, fat:23, carb:0},
  "돼지안심":    {cal:143, pro:22, fat:6,  carb:0},
  "돼지다짐육":  {cal:218, pro:18, fat:16, carb:0},
  "소고기불고기용":{cal:200, pro:20, fat:13, carb:0},
  "소고기양지":  {cal:218, pro:18, fat:16, carb:0},
  "소안심":      {cal:140, pro:22, fat:5,  carb:0},
  "소등심":      {cal:247, pro:18, fat:19, carb:0},
  "소갈비":      {cal:280, pro:16, fat:24, carb:0},
  "소고기다짐육":{cal:215, pro:19, fat:15, carb:0},
  "닭가슴살":    {cal:109, pro:23, fat:1,  carb:0},
  "닭다리살":    {cal:175, pro:18, fat:11, carb:0},
  "닭다리":      {cal:160, pro:17, fat:10, carb:0},
  "토종닭":      {cal:158, pro:18, fat:9,  carb:0},
  "오리":        {cal:201, pro:19, fat:13, carb:0},
  "양고기":      {cal:234, pro:17, fat:18, carb:0},
  "베이컨":      {cal:541, pro:13, fat:54, carb:0},
  "햄":          {cal:145, pro:13, fat:10, carb:1},
  "소시지":      {cal:301, pro:11, fat:27, carb:3},
  "스팸":        {cal:271, pro:12, fat:24, carb:3},
  // 해산물
  "연어":        {cal:208, pro:20, fat:13, carb:0},
  "참치":        {cal:144, pro:23, fat:5,  carb:0},
  "고등어":      {cal:202, pro:18, fat:14, carb:0},
  "갈치":        {cal:133, pro:18, fat:6,  carb:0},
  "대구":        {cal:82,  pro:18, fat:1,  carb:0},
  "명태":        {cal:82,  pro:18, fat:1,  carb:0},
  "낙지":        {cal:73,  pro:15, fat:1,  carb:1},
  "굴":          {cal:69,  pro:8,  fat:2,  carb:4},
  "꽃게":        {cal:72,  pro:14, fat:1,  carb:1},
  // 두부/계란/유제품
  "순두부":      {cal:36,  pro:4,  fat:2,  carb:1},
  "계란":        {cal:155, pro:13, fat:11, carb:1, unit:"개", perUnit:50},
  "달걀":        {cal:155, pro:13, fat:11, carb:1, unit:"개", perUnit:50},
  "치즈":        {cal:350, pro:25, fat:27, carb:2},
  // 채소
  "단호박":      {cal:49,  pro:2,  fat:0,  carb:12},
  // 면/밥/빵
  "우동면":      {cal:105, pro:3,  fat:0,  carb:22},
  "소면":        {cal:127, pro:4,  fat:1,  carb:26},
  // 양념 (소량 사용이라 칼로리 낮게)

  // 헬시 재료
  "곤약쌀":      {cal:10,  pro:0,  fat:0,  carb:3},
  "곤약면":      {cal:10,  pro:0,  fat:0,  carb:3},
  "곤약떡":      {cal:10,  pro:0,  fat:0,  carb:3},
  "두부면":      {cal:30,  pro:4,  fat:1,  carb:1},
  "통밀파스타":  {cal:124, pro:5,  fat:1,  carb:24},
  "현미쌀":      {cal:111, pro:3,  fat:1,  carb:23},
  "귀리":        {cal:389, pro:17, fat:7,  carb:66},
  "그릭요거트":  {cal:59,  pro:10, fat:0,  carb:4},
  "아몬드밀크":  {cal:15,  pro:1,  fat:1,  carb:1},
  "알룰로스":    {cal:4,   pro:0,  fat:0,  carb:1},
  "에리스리톨":  {cal:0,   pro:0,  fat:0,  carb:1},
  "저당마요네즈":{cal:150, pro:1,  fat:16, carb:2},
  "저당간장":    {cal:40,  pro:4,  fat:0,  carb:6},
  "저당고추장":  {cal:120, pro:5,  fat:2,  carb:22},
  "저당굴소스":  {cal:45,  pro:3,  fat:0,  carb:8},
  "히말라야소금":{cal:0,   pro:0,  fat:0,  carb:0},
  "아보카도오일":{cal:884, pro:0,  fat:100,carb:0},
  "치아씨드":    {cal:486, pro:17, fat:31, carb:42},
  "계란흰자":    {cal:52,  pro:11, fat:0,  carb:1},
  "그래놀라저당":{cal:380, pro:9,  fat:16, carb:52},


  // 면류 추가
  "스파게티":    {cal:158, pro:6,  fat:1,  carb:31},
  "파스타":      {cal:158, pro:6,  fat:1,  carb:31},
  "넓은쌀국수":  {cal:109, pro:2,  fat:0,  carb:25},
  "노란쌀국수":  {cal:109, pro:2,  fat:0,  carb:25},
  "탈리아텔레":  {cal:158, pro:6,  fat:1,  carb:31},
  "링귀네":      {cal:158, pro:6,  fat:1,  carb:31},
  "계란면":      {cal:138, pro:5,  fat:2,  carb:26},
  "아르보리오쌀":{cal:130, pro:3,  fat:0,  carb:28},
  "흑미":        {cal:110, pro:3,  fat:1,  carb:23},
  "식빵":        {cal:260, pro:8,  fat:3,  carb:48},
  "파이도우":    {cal:350, pro:5,  fat:20, carb:38},
  "옥수수가루":  {cal:356, pro:9,  fat:4,  carb:73},
  "수수가루":    {cal:340, pro:9,  fat:3,  carb:72},
  // 소스/양념류
  "춘장":        {cal:220, pro:8,  fat:5,  carb:35},
  "케첩":        {cal:100, pro:1,  fat:0,  carb:24},
  "마요네즈":    {cal:680, pro:1,  fat:75, carb:2},
  "토마토소스":  {cal:35,  pro:2,  fat:0,  carb:7},
  "버터":        {cal:717, pro:1,  fat:81, carb:0},
  "생크림":      {cal:340, pro:2,  fat:36, carb:3},
  "우유":        {cal:61,  pro:3,  fat:3,  carb:5},
  "두유":        {cal:54,  pro:4,  fat:2,  carb:5},
  "팜슈거":      {cal:360, pro:0,  fat:0,  carb:93},
  "화자오":      {cal:250, pro:7,  fat:9,  carb:40},
  "레몬즙":      {cal:22,  pro:0,  fat:0,  carb:7},
  "라임즙":      {cal:25,  pro:0,  fat:0,  carb:8},
  "와인":        {cal:83,  pro:0,  fat:0,  carb:3},
  "레드와인":    {cal:83,  pro:0,  fat:0,  carb:3},
  "맛술":        {cal:180, pro:0,  fat:0,  carb:25},
  // 유제품/단백질
  "페코리노치즈":{cal:419, pro:32, fat:32, carb:0},
  "그뤼에르치즈":{cal:413, pro:30, fat:32, carb:0},
  "연유":        {cal:321, pro:8,  fat:9,  carb:54},
  "요거트":      {cal:61,  pro:3,  fat:3,  carb:5},
  "게살":        {cal:84,  pro:18, fat:1,  carb:0},
  "랍스터":      {cal:89,  pro:19, fat:1,  carb:0},
  "전복":        {cal:105, pro:17, fat:1,  carb:7},
  "홍합":        {cal:86,  pro:12, fat:2,  carb:4},
  "조개":        {cal:74,  fat:1,  pro:13, carb:3},
  "바지락":      {cal:74,  pro:13, fat:1,  carb:3},
  "문어":        {cal:82,  pro:15, fat:1,  carb:2},
  "멸치":        {cal:195, pro:42, fat:3,  carb:0},
  "안초비":      {cal:210, pro:29, fat:10, carb:0},
  "팟":          {cal:50,  pro:3,  fat:0,  carb:9},
  // 칼로리 계산 안전 항목: 물/육수류는 부분매칭(물→물엿, 육수→멸치 등) 방지용 exact key
  "육수":        {cal:5,   pro:0,  fat:0,  carb:0},
  "다시마육수":  {cal:5,   pro:0,  fat:0,  carb:0},
  "사골육수":    {cal:30,  pro:2,  fat:1,  carb:0},
  "채수":        {cal:5,   pro:0,  fat:0,  carb:1},
  "비프스톡":    {cal:15,  pro:1,  fat:0,  carb:1},
  "월계수잎":    {cal:0,   pro:0,  fat:0,  carb:0},
  "타마린드페이스트":{cal:239, pro:3, fat:1, carb:60},
  "갈랑갈":      {cal:71,  pro:1,  fat:0,  carb:15},
  // 채소류
  "배추":        {cal:17,  pro:1,  fat:0,  carb:4},
  "고추":        {cal:40,  pro:2,  fat:0,  carb:9},
  "샬롯":        {cal:72,  pro:2,  fat:0,  carb:17},
  "파파야":      {cal:43,  pro:1,  fat:0,  carb:11},
  "양송이버섯":  {cal:22,  pro:3,  fat:0,  carb:3},
  "포르치니버섯":{cal:22,  pro:3,  fat:0,  carb:3},
  "루꼴라":      {cal:25,  pro:3,  fat:1,  carb:4},
  // 견과류/기타
  "피칸":        {cal:691, pro:9,  fat:72, carb:14},
  "율무":        {cal:360, pro:13, fat:2,  carb:72},
  "에다마메":    {cal:122, pro:11, fat:5,  carb:10},
  "연두부":      {cal:55,  pro:5,  fat:3,  carb:2},
  "템페":        {cal:193, pro:19, fat:11, carb:9},
  
  "달걀노른자":  {cal:322, pro:16, fat:27, carb:4},


  // ── 추가: 육류 보완 ──
  "닭고기":      {cal:158, pro:18, fat:9,  carb:0},
  "닭":          {cal:158, pro:18, fat:9,  carb:0},
  "삼겹살":      {cal:331, pro:17, fat:29, carb:0},
  "생선":        {cal:100, pro:18, fat:3,  carb:0},
  "닭발":        {cal:215, pro:20, fat:14, carb:0},
  "닭안심":      {cal:109, pro:23, fat:1,  carb:0},
  "곱창":        {cal:162, pro:15, fat:11, carb:0},
  "장어":        {cal:236, pro:18, fat:18, carb:0},
  "가자미":      {cal:80,  pro:17, fat:1,  carb:0},
  "참치캔":      {cal:128, pro:26, fat:3,  carb:0},
  "염장대구":    {cal:82,  pro:18, fat:1,  carb:0},
  "청어":        {cal:217, pro:20, fat:14, carb:0},
  "메기":        {cal:95,  pro:16, fat:3,  carb:0},
  "가리비":      {cal:88,  pro:17, fat:1,  carb:3},
  // ── 채소 보완 ──
  "무":          {cal:18,  pro:1,  fat:0,  carb:4},
  "무청":        {cal:22,  pro:2,  fat:0,  carb:4},
  "옥수수":      {cal:86,  pro:3,  fat:1,  carb:19},
  "양상추":      {cal:15,  pro:1,  fat:0,  carb:3},
  "셀러리":      {cal:16,  pro:1,  fat:0,  carb:3},
  "청경채":      {cal:13,  pro:2,  fat:0,  carb:2},
  "아스파라거스": {cal:20, pro:2,  fat:0,  carb:4},
  "브로콜리":    {cal:34,  pro:3,  fat:0,  carb:7},
  "콜리플라워":  {cal:25,  pro:2,  fat:0,  carb:5},
  "부추":        {cal:27,  pro:2,  fat:0,  carb:4},
  "청양고추":    {cal:27,  pro:1,  fat:0,  carb:6},
  "봄동":        {cal:16,  pro:2,  fat:0,  carb:3},
  "달래":        {cal:40,  pro:3,  fat:1,  carb:6},
  "냉이":        {cal:36,  pro:4,  fat:1,  carb:5},
  "쑥갓":        {cal:22,  pro:2,  fat:0,  carb:4},
  "완두콩":      {cal:81,  pro:5,  fat:0,  carb:14},
  "파인애플":    {cal:50,  pro:1,  fat:0,  carb:13},
  "망고":        {cal:60,  pro:1,  fat:0,  carb:15},
  "아보카도":    {cal:160, pro:2,  fat:15, carb:9},
  "바나나":      {cal:89,  pro:1,  fat:0,  carb:23},
  "딸기":        {cal:32,  pro:1,  fat:0,  carb:8},
  "블루베리":    {cal:57,  pro:1,  fat:0,  carb:14},
  "사과":        {cal:52,  pro:0,  fat:0,  carb:14},
  "레몬":        {cal:29,  pro:1,  fat:0,  carb:9},
  "라임":        {cal:30,  pro:1,  fat:0,  carb:11},
  "오렌지":      {cal:47,  pro:1,  fat:0,  carb:12},
  "코코넛밀크":  {cal:230, pro:2,  fat:24, carb:6},
  "타마린드":    {cal:239, pro:3,  fat:1,  carb:63},
  "플랜테인":    {cal:122, pro:1,  fat:0,  carb:32},
  // ── 해조류/건어물 ──
  "미역":        {cal:15,  pro:2,  fat:0,  carb:3},
  "김":          {cal:35,  pro:6,  fat:1,  carb:4},
  "다시마":      {cal:43,  pro:2,  fat:0,  carb:9},
  "다시":        {cal:5,   pro:0,  fat:0,  carb:1},
  "매생이":      {cal:11,  pro:2,  fat:0,  carb:1},
  "파래":        {cal:18,  pro:3,  fat:0,  carb:2},
  "해파리":      {cal:11,  pro:2,  fat:0,  carb:0},
  // ── 양념/소스 보완 ──
  "소금":        {cal:0,   pro:0,  fat:0,  carb:0},
  "후추":        {cal:3,   pro:0,  fat:0,  carb:1},
  "깨":          {cal:573, pro:18, fat:50, carb:23},
  "고춧가루":    {cal:282, pro:14, fat:9,  carb:50},
  "커민":        {cal:375, pro:18, fat:22, carb:44},
  "강황":        {cal:312, pro:10, fat:3,  carb:68},
  "고수":        {cal:23,  pro:2,  fat:1,  carb:4},
  "파프리카파우더":{cal:282,pro:14, fat:13, carb:54},
  "오레가노":    {cal:265, pro:11, fat:4,  carb:69},
  "타임":        {cal:101, pro:6,  fat:2,  carb:24},
  "로즈마리":    {cal:131, pro:3,  fat:5,  carb:21},
  "계피":        {cal:247, pro:4,  fat:1,  carb:81},
  "팔각":        {cal:337, pro:18, fat:16, carb:50},
  "딜":          {cal:43,  pro:4,  fat:1,  carb:7},
  "민트잎":      {cal:70,  pro:4,  fat:1,  carb:15},
  "가람마살라":  {cal:379, pro:14, fat:15, carb:51},
  "카레가루":    {cal:379, pro:14, fat:15, carb:51},
  "라스엘하누트":{cal:340, pro:12, fat:14, carb:48},
  "올스파이스":  {cal:263, pro:6,  fat:9,  carb:72},
  "자타르":      {cal:280, pro:10, fat:12, carb:40},
  "하리사":      {cal:170, pro:5,  fat:10, carb:18},
  "와사비":      {cal:109, pro:5,  fat:1,  carb:24},
  "머스터드":    {cal:66,  pro:4,  fat:4,  carb:6},
  "물엿":        {cal:320, pro:0,  fat:0,  carb:80},
  "꿀":          {cal:304, pro:0,  fat:0,  carb:82},
  "이스트":      {cal:105, pro:14, fat:2,  carb:18},
  "육두구":      {cal:525, pro:6,  fat:36, carb:49},
  "오향파우더":  {cal:340, pro:12, fat:10, carb:55},
  "수마크":      {cal:239, pro:5,  fat:1,  carb:72},
  "카다멈":      {cal:311, pro:11, fat:7,  carb:68},
  "국간장":      {cal:35,  pro:4,  fat:0,  carb:5},
  "미소된장":    {cal:200, pro:12, fat:6,  carb:27},
  "아히페이스트":{cal:250, pro:5,  fat:15, carb:25},
  "고추기름":    {cal:884, pro:0,  fat:100,carb:0},
  "케찹마니스":  {cal:260, pro:3,  fat:0,  carb:64},
  "피시소스":    {cal:35,  pro:5,  fat:0,  carb:4},
  "굴소스":      {cal:51,  pro:1,  fat:0,  carb:11},
  "삼발소스":    {cal:95,  pro:2,  fat:6,  carb:10},
  "타히니":      {cal:595, pro:17, fat:54, carb:21},
  "마라소스":    {cal:150, pro:3,  fat:12, carb:8},
  "들깨가루":    {cal:500, pro:16, fat:39, carb:33},
  "쌈장":        {cal:180, pro:10, fat:6,  carb:23},
  "살사소스":    {cal:36,  pro:1,  fat:0,  carb:8},
  // ── 유제품/기타 보완 ──
  "페타치즈":    {cal:264, pro:14, fat:21, carb:4},
  "리코타치즈":  {cal:174, pro:11, fat:13, carb:3},
  "크림치즈":    {cal:342, pro:6,  fat:34, carb:4},
  "마스카르포네": {cal:400,pro:5,  fat:42, carb:3},
  "모짜렐라":    {cal:280, pro:18, fat:22, carb:2},
  "파마산치즈":  {cal:431, pro:38, fat:29, carb:4},
  "사워크림":    {cal:193, pro:3,  fat:19, carb:4},
  "잣":          {cal:673, pro:14, fat:68, carb:13},
  "아몬드":      {cal:579, pro:21, fat:50, carb:22},
  "호두":        {cal:654, pro:15, fat:65, carb:14},
  "캐슈넛":      {cal:553, pro:18, fat:44, carb:30},
  "땅콩":        {cal:567, pro:26, fat:49, carb:16},
  "건포도":      {cal:299, pro:3,  fat:0,  carb:79},
  "그래놀라":    {cal:440, pro:10, fat:16, carb:68},
  "쿠스쿠스":    {cal:376, pro:13, fat:1,  carb:78},
  "카사바가루":  {cal:330, pro:1,  fat:1,  carb:80},
  "타피오카가루":{cal:358, pro:0,  fat:0,  carb:89},
  "빵":          {cal:265, pro:9,  fat:3,  carb:49},
  "베이글":      {cal:270, pro:10, fat:2,  carb:53},
  "바게트":      {cal:280, pro:9,  fat:2,  carb:57},
  "또띠아":      {cal:218, pro:6,  fat:5,  carb:38},
  "라이스페이퍼": {cal:87, pro:2,  fat:0,  carb:20},
  "완탕피":      {cal:280, pro:9,  fat:2,  carb:55},
  "만두피":      {cal:280, pro:9,  fat:2,  carb:55},
  "피타빵":      {cal:275, pro:9,  fat:1,  carb:56},
  "앤초비":      {cal:131, pro:20, fat:5,  carb:0},
  "케이퍼":      {cal:23,  pro:2,  fat:1,  carb:5},
  "올리브":      {cal:115, pro:1,  fat:11, carb:6},
  "김치":        {cal:19,  pro:2,  fat:0,  carb:3},
  "새우페이스트":{cal:80,  pro:10, fat:1,  carb:8},
  "팜슈가":      {cal:390, pro:0,  fat:0,  carb:98},
  "팜오일":      {cal:884, pro:0,  fat:100,carb:0},
  "발사믹":      {cal:88,  pro:0,  fat:0,  carb:17},
  "카피르라임잎":{cal:10,  pro:0,  fat:0,  carb:2},
  "레몬그라스":  {cal:99,  pro:2,  fat:1,  carb:25},
  "불구르":      {cal:342, pro:12, fat:1,  carb:76},
  "보리":        {cal:354, pro:12, fat:2,  carb:73},
  "병아리콩":    {cal:364, pro:19, fat:6,  carb:61},
  "렌틸콩":      {cal:352, pro:24, fat:1,  carb:63},
  "녹두":        {cal:347, pro:24, fat:1,  carb:63},
  "흰강낭콩":    {cal:333, pro:21, fat:1,  carb:61},
  "강낭콩":      {cal:333, pro:21, fat:1,  carb:61},
  "팥":          {cal:339, pro:20, fat:1,  carb:63},
  "쌀":          {cal:359, pro:7,  fat:1,  carb:79},
  "중면":        {cal:137, pro:5,  fat:1,  carb:28},
  "우동":        {cal:130, pro:4,  fat:0,  carb:27},
  "라면":        {cal:460, pro:10, fat:19, carb:63},
  "리가토니":    {cal:357, pro:12, fat:2,  carb:71},
  "펜네":        {cal:357, pro:12, fat:2,  carb:71},
  "마카로니":    {cal:357, pro:12, fat:2,  carb:71},
  "냉면":        {cal:345, pro:7,  fat:1,  carb:76},
  "당면":        {cal:349, pro:0,  fat:0,  carb:87},
  "쌀국수":      {cal:109, pro:2,  fat:0,  carb:25},
  "메밀면":      {cal:337, pro:13, fat:3,  carb:71},
  "오징어채":    {cal:312, pro:66, fat:3,  carb:4},
  "진미채":      {cal:312, pro:66, fat:3,  carb:4},
  "어묵":        {cal:95,  pro:8,  fat:3,  carb:10},
  "BBQ소스":     {cal:172, pro:2,  fat:1,  carb:43},
  "화이트와인":  {cal:82,  pro:0,  fat:0,  carb:3},
  "사프란":      {cal:310, pro:11, fat:6,  carb:65},
  "크림드 레귐": {cal:50,  pro:1,  fat:3,  carb:5},

  // ── 추가 2차: 기타 누락 재료 ──
  "사우어크라우트": {cal:19,  pro:1,  fat:0,  carb:4},
  "고수분말":    {cal:298, pro:12, fat:17, carb:55},
  "초리소":      {cal:455, pro:24, fat:38, carb:3},
  "고사리":      {cal:34,  pro:5,  fat:0,  carb:6},
  "참깨":        {cal:573, pro:18, fat:50, carb:23},
  "로메인":      {cal:17,  pro:1,  fat:0,  carb:3},
  "파니르":      {cal:265, pro:18, fat:20, carb:3},
  "황태":        {cal:325, pro:77, fat:3,  carb:0},
  "북어":        {cal:325, pro:77, fat:3,  carb:0},
  "민트":        {cal:70,  pro:4,  fat:1,  carb:15},
  "허브":        {cal:50,  pro:3,  fat:1,  carb:8},
  "떡":          {cal:220, pro:4,  fat:1,  carb:48},
  "액젓":        {cal:35,  pro:5,  fat:0,  carb:4},
  "레드커리페이스트":{cal:150,pro:5,  fat:10, carb:12},
  "그린커리페이스트":{cal:150,pro:5,  fat:10, carb:12},
  "피클":        {cal:11,  pro:0,  fat:0,  carb:3},
  "겨자":        {cal:66,  pro:4,  fat:4,  carb:6},
  "죽순":        {cal:27,  pro:3,  fat:0,  carb:5},
  "오리고기":    {cal:201, pro:19, fat:13, carb:0},
  "미나리":      {cal:20,  pro:2,  fat:0,  carb:3},
  "오크라":      {cal:33,  pro:2,  fat:0,  carb:7},
  "우거지":      {cal:22,  pro:2,  fat:0,  carb:4},
  "칼국수면":    {cal:137, pro:5,  fat:1,  carb:28},
  "목이버섯":    {cal:25,  pro:2,  fat:0,  carb:5},
  "건고추":      {cal:282, pro:14, fat:9,  carb:50},
  "도라지":      {cal:70,  pro:3,  fat:0,  carb:16},
  "땅콩버터":    {cal:588, pro:25, fat:50, carb:20},
  "새우젓":      {cal:85,  pro:12, fat:2,  carb:4},
  "배":          {cal:57,  pro:0,  fat:0,  carb:15},
  "호박씨":      {cal:559, pro:30, fat:49, carb:11},
  "돼지등뼈":    {cal:280, pro:18, fat:23, carb:0},
  "곤약":        {cal:10,  pro:0,  fat:0,  carb:3},
  "쌀가루":      {cal:366, pro:6,  fat:1,  carb:80},
  "밀":          {cal:340, pro:13, fat:2,  carb:72},
  "고구마줄기":  {cal:30,  pro:2,  fat:0,  carb:6},
  "연근":        {cal:74,  pro:3,  fat:0,  carb:17},
  "우엉":        {cal:72,  pro:2,  fat:0,  carb:17},
  "쑥":          {cal:36,  pro:4,  fat:1,  carb:5},
  "고구마":      {cal:86,  pro:2,  fat:0,  carb:20},
  "미더덕":      {cal:52,  pro:6,  fat:1,  carb:5},
  "찹쌀":        {cal:360, pro:7,  fat:1,  carb:80},
  "현미":        {cal:350, pro:7,  fat:3,  carb:73},
  "밀가루":      {cal:364, pro:10, fat:1,  carb:76},
  "전분":        {cal:342, pro:0,  fat:0,  carb:84},
  "빵가루":      {cal:395, pro:13, fat:5,  carb:75},
  "지짐가루":    {cal:340, pro:10, fat:1,  carb:73},
  "깍두기":      {cal:30,  pro:1,  fat:0,  carb:6},
  "김치국물":    {cal:10,  pro:1,  fat:0,  carb:2},
  "스리라차":    {cal:93,  pro:1,  fat:1,  carb:22},
  "홀스래디시":  {cal:48,  pro:2,  fat:0,  carb:11},
  "방울토마토":  {cal:18,  pro:1,  fat:0,  carb:4},
  "콩":          {cal:347, pro:34, fat:18, carb:30},
  "비트":        {cal:43,  pro:2,  fat:0,  carb:10},
  "얌":          {cal:118, pro:2,  fat:0,  carb:28},
  "카사바":      {cal:160, pro:1,  fat:0,  carb:38},
  "오트밀":      {cal:389, pro:17, fat:7,  carb:66},
  "리크":        {cal:61,  pro:2,  fat:0,  carb:14},
  "루콜라":      {cal:25,  pro:3,  fat:1,  carb:4},
  "아루굴라":    {cal:25,  pro:3,  fat:1,  carb:4},
  "엔다이브":    {cal:17,  pro:1,  fat:0,  carb:3},
  "타피오카":    {cal:358, pro:0,  fat:0,  carb:89},
  "피망":        {cal:20,  pro:1,  fat:0,  carb:5},
  "새우미":      {cal:85,  pro:18, fat:1,  carb:1},
  "돼지창자":    {cal:162, pro:15, fat:11, carb:0},
  "홍어":        {cal:80,  pro:17, fat:1,  carb:0},
  "미역줄기":    {cal:15,  pro:2,  fat:0,  carb:3},
  "솔비":        {cal:320, pro:1,  fat:0,  carb:81},
  "아몬드슬라이스":{cal:579,pro:21, fat:50, carb:22},
  "건자두":      {cal:240, pro:2,  fat:0,  carb:64},
  "아티초크":    {cal:47,  pro:3,  fat:0,  carb:11},
  "케일":        {cal:49,  pro:4,  fat:1,  carb:9},
  "파슬리":      {cal:36,  pro:3,  fat:1,  carb:6},
  "바질":        {cal:23,  pro:3,  fat:1,  carb:3},
  "세이지":      {cal:315, pro:11, fat:13, carb:61},
  "타라곤":      {cal:295, pro:23, fat:7,  carb:50},
  "라벤더":      {cal:49,  pro:2,  fat:1,  carb:10},
  "물":          {cal:0,   pro:0,  fat:0,  carb:0},
  "얼음":        {cal:0,   pro:0,  fat:0,  carb:0},
  "올리브오일":  {cal:884, pro:0,  fat:100,carb:0},
  "코코넛오일":  {cal:892, pro:0,  fat:100,carb:0},
  "참기름":      {cal:884, pro:0,  fat:100,carb:0},

  // ── 추가 3차: 남은 재료 ──
  "인삼":        {cal:60,  pro:2,  fat:0,  carb:14},
  "유부":        {cal:386, pro:18, fat:35, carb:2},
  "우스터소스":  {cal:78,  pro:1,  fat:0,  carb:19},
  "폰즈소스":    {cal:20,  pro:2,  fat:0,  carb:3},
  "명란":        {cal:143, pro:25, fat:4,  carb:2},
  "가쓰오부시":  {cal:350, pro:77, fat:3,  carb:0},
  "공심채":      {cal:19,  pro:2,  fat:0,  carb:3},
  "포도잎":      {cal:93,  pro:5,  fat:2,  carb:17},
  "마른새우":    {cal:306, pro:62, fat:4,  carb:0},
  "꽁치":        {cal:204, pro:18, fat:14, carb:0},
  "도토리묵":    {cal:56,  pro:1,  fat:0,  carb:13},
  "열무":        {cal:18,  pro:2,  fat:0,  carb:3},
  "실파":        {cal:27,  pro:2,  fat:0,  carb:4},
  "유자":        {cal:38,  pro:1,  fat:0,  carb:10},
  "시래기":      {cal:22,  pro:2,  fat:0,  carb:4},
  "블랙빈":      {cal:341, pro:22, fat:1,  carb:63},
  "하몽":        {cal:145, pro:30, fat:3,  carb:0},
  "무말랭이":    {cal:285, pro:10, fat:1,  carb:67},
  "바닐라":      {cal:288, pro:0,  fat:0,  carb:13},
  "청국장":      {cal:173, pro:16, fat:8,  carb:12},
  "파슬리줄기":  {cal:36,  pro:3,  fat:1,  carb:6},
  "홍차":        {cal:2,   pro:0,  fat:0,  carb:1},
  "정향":        {cal:274, pro:6,  fat:13, carb:66},
  "체다치즈":    {cal:402, pro:25, fat:33, carb:2},
  "카망베르":    {cal:300, pro:20, fat:24, carb:1},
  "고르곤졸라":  {cal:353, pro:21, fat:29, carb:2},
  "흑임자":      {cal:573, pro:18, fat:50, carb:23},
  "오징어먹물":  {cal:25,  pro:4,  fat:1,  carb:1},
  "코냑":        {cal:241, pro:0,  fat:0,  carb:0},
  "럼":          {cal:231, pro:0,  fat:0,  carb:0},
  "발효버터":    {cal:717, pro:1,  fat:81, carb:1},
  "석류":        {cal:83,  pro:2,  fat:1,  carb:19},
  "연어알":      {cal:250, pro:30, fat:14, carb:1},
  "성게알":      {cal:172, pro:16, fat:9,  carb:9},
  "대게":        {cal:84,  pro:17, fat:1,  carb:0},
  "킹크랩":      {cal:84,  pro:19, fat:1,  carb:0},
  "피조개":      {cal:55,  pro:9,  fat:1,  carb:3},
  "꼬막":        {cal:55,  pro:9,  fat:1,  carb:3},
  "새우살":      {cal:85,  pro:18, fat:1,  carb:1},
  "관자":        {cal:88,  pro:17, fat:1,  carb:3},
  "문어다리":    {cal:82,  pro:15, fat:1,  carb:2},
  "황태채":      {cal:325, pro:77, fat:3,  carb:0},
  "조기":        {cal:90,  pro:18, fat:2,  carb:0},
  "홍합살":      {cal:86,  pro:12, fat:2,  carb:4},
  "오리훈제":    {cal:250, pro:19, fat:18, carb:1},
  "닭볶음탕":    {cal:158, pro:18, fat:9,  carb:0},
  "닭날개":      {cal:203, pro:19, fat:14, carb:0},
  "고수잎":      {cal:23,  pro:2,  fat:1,  carb:4},
  "라임잎":      {cal:10,  pro:0,  fat:0,  carb:2},
  "생강":        {cal:80,  pro:2,  fat:1,  carb:18},
  "마늘":        {cal:149, pro:6,  fat:1,  carb:33},
  "양파":        {cal:40,  pro:1,  fat:0,  carb:9},
  "대파":        {cal:27,  pro:2,  fat:0,  carb:5},
  "쪽파":        {cal:27,  pro:2,  fat:0,  carb:5},
  "토마토":      {cal:18,  pro:1,  fat:0,  carb:4},
  "감자":        {cal:77,  pro:2,  fat:0,  carb:17},
  "당근":        {cal:41,  pro:1,  fat:0,  carb:10},
  "양배추":      {cal:25,  pro:1,  fat:0,  carb:6},
  "시금치":      {cal:23,  pro:3,  fat:0,  carb:4},
  "버섯":        {cal:22,  pro:3,  fat:0,  carb:3},
  "표고버섯":    {cal:34,  pro:2,  fat:0,  carb:7},
  "팽이버섯":    {cal:37,  pro:3,  fat:0,  carb:7},
  "느타리버섯":  {cal:33,  pro:3,  fat:0,  carb:6},
  "숙주":        {cal:30,  pro:3,  fat:0,  carb:6},
  "콩나물":      {cal:30,  pro:3,  fat:0,  carb:6},
  "오이":        {cal:16,  pro:1,  fat:0,  carb:4},
  "상추":        {cal:14,  pro:1,  fat:0,  carb:2},
  "깻잎":        {cal:37,  pro:4,  fat:1,  carb:6},
  "애호박":      {cal:18,  pro:1,  fat:0,  carb:4},
  "가지":        {cal:25,  pro:1,  fat:0,  carb:6},
  "돼지고기":    {cal:218, pro:18, fat:16, carb:0},
  "소고기":      {cal:212, pro:20, fat:14, carb:0},
  "간장":        {cal:60,  pro:6,  fat:0,  carb:8},
  "설탕":        {cal:387, pro:0,  fat:0,  carb:100},
  "식초":        {cal:20,  pro:0,  fat:0,  carb:1},
  "된장":        {cal:186, pro:12, fat:5,  carb:25},
  "고추장":      {cal:211, pro:7,  fat:4,  carb:40},
  "두반장":      {cal:86,  pro:5,  fat:3,  carb:11},
  "미림":        {cal:257, pro:0,  fat:0,  carb:43},
  "청주":        {cal:159, pro:0,  fat:0,  carb:5},
  "치킨스톡":    {cal:8,   pro:0,  fat:0,  carb:1},
  "멸치육수":    {cal:5,   pro:1,  fat:0,  carb:0},
  "판단잎":      {cal:30,  pro:1,  fat:0,  carb:7},
  "들기름":      {cal:884, pro:0,  fat:100,carb:0},
  "식용유":      {cal:884, pro:0,  fat:100,carb:0},
  "파프리카":    {cal:31,  pro:1,  fat:0,  carb:6},
  "새우":        {cal:85,  pro:18, fat:1,  carb:1},
  "오징어":      {cal:88,  pro:18, fat:1,  carb:2},
  "두부":        {cal:76,  pro:8,  fat:4,  carb:2},
  

  // ── unit/perUnit 복원 (개수 단위 재료) ──
  "감자":         {cal:77,  pro:2,  fat:0,  carb:17, unit:"개", perUnit:150},
  "고구마":       {cal:86,  pro:2,  fat:0,  carb:20, unit:"개", perUnit:150},
  "당근":         {cal:41,  pro:1,  fat:0,  carb:10, unit:"개", perUnit:100},
  "양파":         {cal:40,  pro:1,  fat:0,  carb:9,  unit:"개", perUnit:150},
  "토마토":       {cal:18,  pro:1,  fat:0,  carb:4,  unit:"개", perUnit:150},
  "감자(개)":     {cal:77,  pro:2,  fat:0,  carb:17, unit:"개", perUnit:150},

  // ── 누락 고기 부위 ──
  "소꼬리":       {cal:255, pro:20, fat:19, carb:0},
  "항정살":       {cal:331, pro:17, fat:29, carb:0},
  "대패삼겹":     {cal:331, pro:17, fat:29, carb:0},
  "돼지앞발":     {cal:183, pro:20, fat:11, carb:0},
  "뼈없는닭":     {cal:165, pro:25, fat:7,  carb:0},
  "닭봉":         {cal:175, pro:18, fat:11, carb:0},
  "닭뼈":         {cal:100, pro:15, fat:5,  carb:0},
  "닭목살":       {cal:175, pro:18, fat:11, carb:0},
  "돼지뒷다리":   {cal:183, pro:20, fat:11, carb:0},
  "소갈비":       {cal:280, pro:16, fat:24, carb:0},
  "소꼬리":       {cal:255, pro:20, fat:19, carb:0},
  "소등심":       {cal:247, pro:18, fat:19, carb:0},
  "소사태":       {cal:135, pro:21, fat:5,  carb:0},
  "소양지":       {cal:218, pro:18, fat:16, carb:0},
  "LA갈비":       {cal:280, pro:16, fat:24, carb:0},
  "차돌박이":     {cal:247, pro:18, fat:19, carb:0},
  "육회용소고기": {cal:140, pro:22, fat:5,  carb:0},
  "오겹살":       {cal:331, pro:17, fat:29, carb:0},
  "목삼겹":       {cal:263, pro:17, fat:22, carb:0},
  "제육용돼지":   {cal:183, pro:20, fat:11, carb:0},
  "돼지방삼겹":   {cal:331, pro:17, fat:29, carb:0},
  "소혀":         {cal:224, pro:17, fat:17, carb:0},
  "양고기갈비":   {cal:234, pro:17, fat:18, carb:0},
  "염소고기":     {cal:143, pro:27, fat:3,  carb:0},
  "오리가슴살":   {cal:140, pro:23, fat:5,  carb:0},
  "훈제오리":     {cal:250, pro:19, fat:18, carb:0},
  "통닭":         {cal:158, pro:18, fat:9,  carb:0},
  "닭정육":       {cal:158, pro:18, fat:9,  carb:0},
  // ── 누락 해산물 ──
  "쭈꾸미":       {cal:73,  pro:15, fat:1,  carb:1},
  "대구살":       {cal:82,  pro:18, fat:1,  carb:0},
  "황돔":         {cal:85,  pro:18, fat:1,  carb:0},
  "조기살":       {cal:90,  pro:18, fat:2,  carb:0},
  "바닷가재":     {cal:89,  pro:19, fat:1,  carb:1},
  "코다리":       {cal:82,  pro:18, fat:1,  carb:0},
  "웅어":         {cal:88,  pro:18, fat:1,  carb:0},
  "생대구":       {cal:82,  pro:18, fat:1,  carb:0},
  // ── STD_ING 의존 문제 해결: 대량 사용 재료 ──
  "돼지등뼈":     {cal:260, pro:17, fat:21, carb:0},
  "사골":         {cal:58,  pro:4,  fat:4,  carb:0},
  "꼬리":         {cal:255, pro:20, fat:19, carb:0},
  "갈비":         {cal:280, pro:16, fat:24, carb:0},
  "돼지갈비":     {cal:280, pro:18, fat:23, carb:0},
  "소갈비살":     {cal:280, pro:16, fat:24, carb:0},
  "돼지갈비살":   {cal:280, pro:18, fat:23, carb:0},
  "순대":         {cal:158, pro:7,  fat:8,  carb:18},
  "혈소":         {cal:85,  pro:12, fat:3,  carb:4},
  // ── 국물/스톡 ──
  "닭육수":       {cal:8,   pro:1,  fat:0,  carb:1},
  "소고기육수":   {cal:8,   pro:1,  fat:0,  carb:1},
  "치킨브로스":   {cal:8,   pro:1,  fat:0,  carb:1},
  "비프브로스":   {cal:8,   pro:1,  fat:0,  carb:1},
  "육수":         {cal:8,   pro:1,  fat:0,  carb:1},
  "물":           {cal:0,   pro:0,  fat:0,  carb:0},
  "다시마물":     {cal:5,   pro:0,  fat:0,  carb:1},
  "멸치다시":     {cal:5,   pro:1,  fat:0,  carb:0},
  // ── 기타 누락 ──
  "대마늘":       {cal:149, pro:6,  fat:1,  carb:33},
  "참나물":       {cal:27,  pro:3,  fat:0,  carb:4},
  "취나물":       {cal:31,  pro:3,  fat:0,  carb:5},
  "곤드레":       {cal:34,  pro:3,  fat:0,  carb:6},
  "수리취":       {cal:34,  pro:3,  fat:0,  carb:6},
  "머위":         {cal:14,  pro:1,  fat:0,  carb:2},
  "고구마줄기":   {cal:30,  pro:2,  fat:0,  carb:6},
  "두릅":         {cal:40,  pro:4,  fat:0,  carb:7},
  "참취":         {cal:27,  pro:3,  fat:0,  carb:4},
  "비름":         {cal:26,  pro:3,  fat:0,  carb:4},
  "씀바귀":       {cal:25,  pro:2,  fat:0,  carb:4},
  "냉이":         {cal:36,  pro:4,  fat:1,  carb:5},
  "봄동":         {cal:16,  pro:2,  fat:0,  carb:3},
  "얼갈이배추":   {cal:16,  pro:2,  fat:0,  carb:3},
  "열무":         {cal:18,  pro:2,  fat:0,  carb:3},
  "쑥":           {cal:36,  pro:4,  fat:1,  carb:5},
  "파드득":       {cal:22,  pro:2,  fat:0,  carb:4},
  "도토리묵":     {cal:56,  pro:1,  fat:0,  carb:13},
  "메밀묵":       {cal:55,  pro:2,  fat:0,  carb:12},
  "청포묵":       {cal:44,  pro:1,  fat:0,  carb:11},
  "인절미":       {cal:220, pro:4,  fat:1,  carb:48},
  "가래떡":       {cal:220, pro:4,  fat:1,  carb:48},
  "송편":         {cal:200, pro:3,  fat:1,  carb:44},
  "유자청":       {cal:100, pro:0,  fat:0,  carb:25},
  "매실청":       {cal:95,  pro:0,  fat:0,  carb:24},
  "막걸리":       {cal:59,  pro:2,  fat:0,  carb:9},
  "소주":         {cal:167, pro:0,  fat:0,  carb:0},
  "맥주":         {cal:43,  pro:0,  fat:0,  carb:4},
  "와인":         {cal:85,  pro:0,  fat:0,  carb:3},
  "청주":         {cal:159, pro:0,  fat:0,  carb:5},
  "미원":         {cal:0,   pro:0,  fat:0,  carb:0},
  "다시다":       {cal:5,   pro:0,  fat:0,  carb:1},
  "치킨파우더":   {cal:5,   pro:0,  fat:0,  carb:1},
  "버터밀크":     {cal:40,  pro:3,  fat:1,  carb:5},
  "요거트드레싱": {cal:80,  pro:3,  fat:5,  carb:7},
  "크림소스":     {cal:190, pro:3,  fat:19, carb:5},
  "바베큐소스":   {cal:172, pro:2,  fat:1,  carb:43},
  "데리야키소스": {cal:90,  pro:3,  fat:1,  carb:18},
  "굴소스":       {cal:51,  pro:1,  fat:0,  carb:11},
  "치폴레":       {cal:120, pro:3,  fat:6,  carb:15},
  "아도보소스":   {cal:80,  pro:2,  fat:4,  carb:10},
  "레드와인":     {cal:85,  pro:0,  fat:0,  carb:3},
  "사케":         {cal:134, pro:0,  fat:0,  carb:5},
  "미소":         {cal:200, pro:12, fat:6,  carb:27},
  "된장국물":     {cal:30,  pro:2,  fat:1,  carb:4},
  "고추기름":     {cal:884, pro:0,  fat:100,carb:0},
  "라드":         {cal:902, pro:0,  fat:100,carb:0},

  // ── 유럽 요리 재료 ──
  "레드와인":      {cal:85,  pro:0,  fat:0,  carb:3},
  "화이트와인":    {cal:82,  pro:0,  fat:0,  carb:3},
  "비프스톡":      {cal:8,   pro:1,  fat:0,  carb:1},
  "크레임프레쉬":  {cal:292, pro:3,  fat:30, carb:4},
  "허브부케":      {cal:5,   pro:0,  fat:0,  carb:1},
  "파프리카":      {cal:20,  pro:1,  fat:0,  carb:5},
  "송아지고기":    {cal:172, pro:26, fat:7,  carb:0},
  "햄호크":        {cal:280, pro:18, fat:23, carb:0},
  "판체타":        {cal:541, pro:13, fat:54, carb:0},
  "프로슈토":      {cal:145, pro:30, fat:3,  carb:0},
  "소시송":        {cal:301, pro:11, fat:27, carb:3},
  "살라미":        {cal:456, pro:22, fat:41, carb:2},
  "그뤼에르치즈":  {cal:413, pro:29, fat:32, carb:1},
  "에멘탈치즈":    {cal:380, pro:29, fat:29, carb:2},
  "브리치즈":      {cal:334, pro:21, fat:28, carb:1},
  "고르곤졸라":    {cal:353, pro:21, fat:29, carb:2},
  "디종머스터드":  {cal:66,  pro:4,  fat:4,  carb:6},
  "우스터소스":    {cal:78,  pro:1,  fat:0,  carb:19},
  "앤초비페이스트":{cal:131, pro:20, fat:5,  carb:0},
  "토마토페이스트":{cal:82,  pro:4,  fat:0,  carb:19},
  "그린올리브":    {cal:145, pro:1,  fat:15, carb:4},
  "블랙올리브":    {cal:115, pro:1,  fat:11, carb:6},
  "케이퍼":        {cal:23,  pro:2,  fat:1,  carb:5},
  "허브드프로방스":{cal:150, pro:5,  fat:5,  carb:25},
  "타라곤":        {cal:295, pro:23, fat:7,  carb:50},
  "처빌":          {cal:237, pro:26, fat:4,  carb:35},
  "에스트라곤":    {cal:295, pro:23, fat:7,  carb:50},
  "펜넬":          {cal:31,  pro:1,  fat:0,  carb:7},
  "파스닙":        {cal:75,  pro:1,  fat:0,  carb:18},
  "순무":          {cal:28,  pro:1,  fat:0,  carb:6},
  "스왓 리크":     {cal:61,  pro:2,  fat:0,  carb:14},
  "비트":          {cal:43,  pro:2,  fat:0,  carb:10},
  "흑후추":        {cal:251, pro:10, fat:3,  carb:64},
  "월계수잎":      {cal:313, pro:8,  fat:8,  carb:75},

  "오리기름":     {cal:882, pro:0,  fat:100,carb:0},
  "돼지족발":     {cal:214, pro:17, fat:16, carb:0},
  "백후추":       {cal:296, pro:10, fat:3,  carb:64},
  "케찹":         {cal:100, pro:2,  fat:0,  carb:26},
  "초콜릿":       {cal:546, pro:5,  fat:31, carb:60},
  "카카오파우더": {cal:228, pro:20, fat:14, carb:55},
  "오리기름":     {cal:882, pro:0,  fat:100,carb:0},
  "생선소스":     {cal:35,  pro:5,  fat:0,  carb:4},
  "스리라차소스": {cal:93,  pro:1,  fat:1,  carb:22},
  "핫소스":       {cal:32,  pro:1,  fat:0,  carb:7},

  "동치미":       {cal:10,  pro:0,  fat:0,  carb:2},
  "소고기육수":   {cal:8,   pro:1,  fat:0,  carb:1},
  "파래":         {cal:18,  pro:3,  fat:0,  carb:2},

  // ── 식포일러 재료 ──
  "망고처트니":   {cal:230, pro:1,  fat:0,  carb:57},
  "고형카레":     {cal:463, pro:9,  fat:28, carb:48},
  "통삼겹":       {cal:331, pro:17, fat:29, carb:0},
  "참치회":       {cal:144, pro:23, fat:5,  carb:0},
  "참치살":       {cal:144, pro:23, fat:5,  carb:0},
  "참치포":       {cal:180, pro:26, fat:8,  carb:0},
  "오이소박이":   {cal:17,  pro:1,  fat:0,  carb:3},
  "돼지기름":     {cal:902, pro:0,  fat:100,carb:0},
  "닭다리살":     {cal:175, pro:19, fat:10, carb:0},
  "닭봉":         {cal:203, pro:19, fat:14, carb:0},
  "가쓰오부시육수":{cal:5,  pro:1,  fat:0,  carb:0},
  "미소":         {cal:200, pro:12, fat:6,  carb:27},
  "유자청":       {cal:100, pro:0,  fat:0,  carb:25},
  "유부":         {cal:386, pro:18, fat:35, carb:2},
  // ── 추가 재료 (미매핑 해소) ──
  "베이크드빈":     {cal:94,  pro:5,  fat:0,  carb:17},
  "베이킹파우더":   {cal:53,  pro:0,  fat:0,  carb:28},
  "바스마티쌀":     {cal:350, pro:7,  fat:1,  carb:78},
  "깔라만시":       {cal:22,  pro:1,  fat:0,  carb:7},
  "차슈":           {cal:250, pro:18, fat:18, carb:3},
  "칠리파우더":     {cal:282, pro:14, fat:15, carb:50},
  "커피":           {cal:2,   pro:0,  fat:0,  carb:0},
  "흰살생선":       {cal:96,  pro:20, fat:1,  carb:0},
  "그린빈":         {cal:31,  pro:2,  fat:0,  carb:7},
  "호이신소스":     {cal:220, pro:4,  fat:1,  carb:49},
  "할라피뇨":       {cal:29,  pro:1,  fat:0,  carb:7},
  "일본식마요네즈": {cal:670, pro:2,  fat:73, carb:4},
  "대추":           {cal:282, pro:4,  fat:1,  carb:67},
  "카야잼":         {cal:320, pro:3,  fat:8,  carb:58},
  "김칫국물":       {cal:15,  pro:1,  fat:0,  carb:3},
  "라자냐면":       {cal:357, pro:12, fat:2,  carb:71},
  "줄콩":           {cal:31,  pro:2,  fat:0,  carb:7},
  "메이플시럽":     {cal:260, pro:0,  fat:0,  carb:67},
  "미트볼":         {cal:250, pro:14, fat:18, carb:8},
  "멘마":           {cal:25,  pro:2,  fat:0,  carb:5},
  "머스터드씨드":   {cal:508, pro:26, fat:36, carb:28},
  "면":             {cal:357, pro:12, fat:2,  carb:71},
  "넛맥":           {cal:525, pro:6,  fat:36, carb:49},
  "오코노미야키소스":{cal:100, pro:2,  fat:0,  carb:23},
  "단무지":         {cal:21,  pro:1,  fat:0,  carb:5},
  "동태":           {cal:82,  pro:18, fat:1,  carb:0},
  "슈가파우더":     {cal:387, pro:0,  fat:0,  carb:100},
  "메추리알":       {cal:158, pro:13, fat:11, carb:1},
  "라멘":           {cal:357, pro:12, fat:2,  carb:71},
  "라멘타레":       {cal:120, pro:8,  fat:2,  carb:18},
  "삼발소스":       {cal:140, pro:3,  fat:8,  carb:16},
  "케캡마니스":     {cal:259, pro:5,  fat:0,  carb:62},
  "피타빵":         {cal:275, pro:9,  fat:1,  carb:56},
  "불구르":         {cal:342, pro:12, fat:1,  carb:76},
  "야키소바소스":   {cal:95,  pro:3,  fat:0,  carb:21},
  "오코노미야키반죽":{cal:200, pro:5,  fat:3,  carb:38},
  "텐카스":         {cal:560, pro:6,  fat:38, carb:48},
  "미림":           {cal:228, pro:0,  fat:0,  carb:43},
  "청주":           {cal:134, pro:0,  fat:0,  carb:5},
  "튀김유(흡수)":   {cal:884, pro:0,  fat:100,carb:0},
  "스프링롤피":     {cal:320, pro:7,  fat:1,  carb:70},
};

// 단위 → gram 변환
// 메뉴 영양 계산
// 표시/식단일기용 칼로리는 항상 "1인분 기준"으로 계산한다.
// people은 장보기 수량 계산용 개념이므로 칼로리 표시에는 사용하지 않는다.
function calcNutrition(menuName, people){
  people = Math.max(1, people||1);

  // ① MENU_SCHEMA_V2 재료 계산식 (메인 로직)
  var schema = (typeof MENU_SCHEMA_V2 !== 'undefined') ? MENU_SCHEMA_V2[menuName] : null;
  if(schema && schema.ingredientAmounts && Object.keys(schema.ingredientAmounts).length > 0){
    var totCal=0, totCarb=0, totFat=0, totPro=0;
    var servings = Math.max(1, schema.servings || schema.recipeServings || 1);

    // 옵션1 표준 1인분 기준
    var STD_SERVINGS = {
      '밥·덮밥': 1, '면': 1, '국·찌개': 3, '구이': 2, '볶음': 2, '튀김': 2
    };

    Object.entries(schema.ingredientAmounts).forEach(function(entry){
      var ingId = entry[0];
      var amtStr = entry[1];

      // g 변환
      var grams = 0;
      var num = parseFloat(String(amtStr).replace(/[^0-9.]/g,''));
      if(isNaN(num)) return;
      if(/ml/.test(amtStr)) grams = num;        // ml ≈ g
      else if(/kg/.test(amtStr)) grams = num*1000;
      else if(/g/.test(amtStr)) grams = num;
      else if(/큰술/.test(amtStr)) grams = num*12;
      else if(/작은술/.test(amtStr)) grams = num*4;
      else if(/컵/.test(amtStr)) grams = num*200;
      else if(/개/.test(amtStr)) grams = num*50;
      else if(/장/.test(amtStr)) grams = num*3;
      else grams = num;

      // 식용유·튀김기름은 흡수율 18% 적용
      var absRate = (/cooking_oil|olive_oil|oil/.test(ingId)) ? 0.18 : 1.0;
      grams = grams * absRate;

      // INGREDIENT_DB_V2로 한글명 변환 → NUTRITION_DB 조회
      var ingName = (typeof INGREDIENT_DB_V2 !== 'undefined' && INGREDIENT_DB_V2[ingId])
        ? INGREDIENT_DB_V2[ingId].name : ingId;
      var nut = (typeof NUTRITION_DB !== 'undefined') ? NUTRITION_DB[ingName] : null;
      if(!nut) return;

      var ratio = grams / 100;
      totCal  += nut.cal  * ratio;
      totCarb += (nut.carb||0) * ratio;
      totFat  += (nut.fat||0)  * ratio;
      totPro  += (nut.pro||0)  * ratio;
    });

    // 1인분 환산
    var perCal  = totCal  / servings * people;
    var perCarb = totCarb / servings * people;
    var perFat  = totFat  / servings * people;
    var perPro  = totPro  / servings * people;

    // ±15% 범위
    var lo = Math.round(perCal * 0.95);
    var hi = Math.round(perCal * 1.05);

    return {
      cal:   Math.round(perCal),
      calLo: lo,
      calHi: hi,
      calRange: lo + '~' + hi + 'kcal',
      carb: Math.round(perCarb),
      fat:  Math.round(perFat),
      pro:  Math.round(perPro),
    };
  }

  // ② fallback: MENU_NUT 조회
  var nut2 = getMenuNut(menuName);
  if(nut2){
    var lo2 = Math.round(nut2.cal * 0.95);
    var hi2 = Math.round(nut2.cal * 1.05);
    return {
      cal:   Math.round(nut2.cal  * people),
      calLo: lo2,
      calHi: hi2,
      calRange: lo2 + '~' + hi2 + 'kcal',
      carb: Math.round(nut2.carb * people),
      fat:  Math.round(nut2.fat  * people),
      pro:  Math.round(nut2.pro  * people),
    };
  }
  return null;
}


// ── 제철 재료 DB (월별) ──
const SEASONAL_DB = {
  1:  ["굴","과메기","한치","방어","대구","홍합","꼬막","배추","무","시금치","우엉","연근","도라지","귤","한라봉"],
  2:  ["굴","꼬막","홍합","꽃게","시금치","봄동","냉이","달래","쑥","딸기","한라봉","귤"],
  3:  ["도다리","주꾸미","바지락","냉이","달래","쑥","봄동","두릅","참나물","딸기","한라봉"],
  4:  ["주꾸미","도다리","멍게","미더덕","바지락","두릅","취나물","참나물","냉이","달래","딸기","아스파라거스"],
  5:  ["멍게","미더덕","도다리","전복","참나물","두릅","취나물","아스파라거스","완두콩","딸기","참외"],
  6:  ["전복","민어","농어","오징어","갈치","참외","복숭아","자두","토마토","옥수수","감자","마늘"],
  7:  ["민어","오징어","갈치","낙지","전복","복숭아","참외","수박","옥수수","토마토","가지","애호박","감자"],
  8:  ["오징어","갈치","낙지","전복","장어","수박","복숭아","포도","옥수수","가지","고추","토마토","감자"],
  9:  ["꽃게","전어","고등어","낙지","대하","새우","포도","배","사과","고구마","버섯","고추","가지"],
  10: ["꽃게","대하","전어","고등어","갈치","굴","배","사과","감","고구마","버섯","브로콜리","연근"],
  11: ["굴","꼬막","대구","방어","고등어","배추","무","시금치","브로콜리","감","사과","유자"],
  12: ["굴","과메기","방어","대구","홍합","꼬막","배추","무","시금치","귤","한라봉","유자"],
};

// 현재 달의 제철 재료 반환
function getSeasonalIngs(){
  const month = new Date().getMonth()+1;
  return SEASONAL_DB[month]||[];
}

// 메뉴의 제철 점수 계산 (제철 재료 몇 개 포함하는지)
function getSeasonalScore(menuName){
  const db=MENU_DB[menuName];
  if(!db)return 0;
  const seasonal=getSeasonalIngs();
  return db.ingredients.filter(i=>seasonal.some(s=>i.name.includes(s)||s.includes(i.name))).length;
}

function scaleAmt(amount, people){
  if(people===1||!amount)return amount;
  const num=parseFloat(amount);
  if(!num||isNaN(num))return amount;
  const unit=amount.replace(/[0-9./]/g,'').trim();
  const scaled=Math.round(num*people*10)/10;
  return scaled+unit;
}

function getSides(name, type){
  if(type==="아침") return [];
  const map={
    // ── 한식 찌개 (메인 → 국+나물 사이드) ──
    "된장찌개":["계란말이","시금치나물","멸치볶음"],
    "두부된장찌개":["계란말이","콩나물무침","김치"],
    "버섯된장찌개":["두부조림","시금치나물","김치"],
    "조개된장찌개":["계란말이","무나물","깍두기"],
    "김치찌개":["계란말이","감자볶음","시금치나물"],
    "돼지고기김치찌개":["두부조림","콩나물무침","깍두기"],
    "참치김치찌개":["계란말이","오이무침","깍두기"],
    "묵은지김치찌개":["계란찜","시금치나물","멸치볶음"],
    "순두부찌개":["멸치볶음","오이무침","김치"],
    "해물순두부찌개":["계란말이","시금치나물","깍두기"],
    "부대찌개":["단무지","오이무침","김치"],
    "청국장찌개":["깍두기","시금치나물","멸치볶음"],
    "동태찌개":["무나물","김치","계란말이"],
    // ── 한식 국 → 사이드로 활용 ──
    "미역국":["멸치볶음","두부조림","오이무침"],
    "콩나물국":["멸치볶음","계란말이","김치"],
    "된장국":["멸치볶음","시금치나물","감자볶음"],
    "북어국":["오이무침","멸치볶음","김치"],
    "황태국":["오이무침","두부조림","김치"],
    "소고기뭇국":["시금치나물","멸치볶음","깍두기"],
    "아욱국":["멸치볶음","오이무침","김치"],
    "시금치국":["계란말이","두부조림","김치"],
    "냉이국":["멸치볶음","오이무침","깍두기"],
    // ── 한식 메인 (국류 사이드로) ──
    "제육볶음":["된장국","김치","콩나물무침"],
    "고추장제육볶음":["미역국","김치","시금치나물"],
    "간장제육볶음":["된장국","오이무침","콩나물무침"],
    "불고기":["미역국","김치","시금치나물"],
    "간장불고기":["된장국","깍두기","무나물"],
    "버섯불고기":["콩나물국","오이무침","김치"],
    "갈비찜":["콩나물국","깍두기","시금치나물"],
    "소갈비찜":["된장국","김치","나물"],
    "닭볶음탕":["된장국","오이무침","깍두기"],
    "감자닭볶음탕":["미역국","깍두기","시금치나물"],
    "닭갈비":["된장국","깍두기","오이무침"],
    "춘천식닭갈비":["콩나물국","깍두기","오이무침"],
    "삼겹살":["된장찌개","상추","쌈장"],
    "마늘삼겹살구이":["된장찌개","깻잎","상추"],
    "소금삼겹살구이":["된장찌개","상추","마늘"],
    "오징어볶음":["미역국","김치","콩나물무침"],
    "고추장오징어볶음":["콩나물국","김치","두부조림"],
    "낙지볶음":["된장국","김치","오이무침"],
    "보쌈":["새우젓","쌈장","깍두기"],
    "수육":["새우젓","쌈장","겉절이"],
    "잡채":["미역국","김치","나물"],
    "고등어조림":["된장국","시금치나물","김치"],
    "갈치조림":["된장국","콩나물무침","깍두기"],
    "비빔밥":["된장국","깍두기","나물"],
    "김치볶음밥":["계란후라이","오이무침","단무지"],
    "볶음밥":["계란국","오이무침","단무지"],
    "냉면":["편육","깍두기","겨자"],
    "떡볶이":["순대","어묵국","튀김"],
    "두부김치":["콩나물국","멸치볶음","오이무침"],
    "삼계탕":["깍두기","나물","겉절이"],
    "갈비탕":["깍두기","나물","깻잎절임"],
    "설렁탕":["깍두기","나물","김치"],
    "육개장":["깍두기","나물","계란말이"],
    "감자탕":["깍두기","겉절이","나물"],
    // ── 일식 사이드 ──
    "오야코동":["미소국","단무지","오이절임"],
    "규동":["미소국","단무지","오이절임"],
    "가츠동":["미소국","단무지","절임채소"],
    "우나동":["미소국","절임채소","시금치나물"],
    "텐동":["미소국","단무지","오이절임"],
    "라멘":["교자","멘마","나루토"],
    "쇼유라멘":["교자","반숙계란","멘마"],
    "된장라멘":["교자","옥수수","버터"],
    "돈코츠라멘":["교자","홍생강","멘마"],
    "도쿄라멘":["교자","반숙계란","해초"],
    "우동":["튀김","오니기리","절임채소"],
    "소바":["튀김","와사비","절임채소"],
    "야키소바":["절임채소","미소국","단무지"],
    "가라아게":["마요네즈","레몬","절임채소"],
    "닭가슴살데리야끼":["미소국","절임채소","시금치무침"],
    "연어데리야끼":["미소국","절임채소","오이절임"],
    "일식샤부샤부":["폰즈소스","참깨소스","오니기리"],
    "돈카츠":["된장국","양배추채","단무지"],
    "미소국":["오니기리","절임채소","나물"],
    // ── 중식 사이드 ──
    "짜장면":["단무지","오이무침","양파절임"],
    "짬뽕":["단무지","오이무침","양파절임"],
    "마파두부":["흰쌀밥","오이무침","단무지"],
    "탕수육":["짜장소스","오이무침","단무지"],
    "깐소새우":["흰쌀밥","단무지","오이무침"],
    "볶음밥중식":["달걀수프","단무지","오이무침"],
    "마라탕":["흰쌀밥","오이절임","단무지"],
    "광동식볶음면":["달걀수프","중화피클","오이무침"],
    "딤섬":["우롱차","XO소스","간장"],
    "사천마라새우":["흰쌀밥","오이무침","단무지"],
    "파스타":["시저샐러드","마늘빵","미네스트로네"],
    "카르보나라":["시저샐러드","마늘빵","미네스트로네"],
    "알리오올리오":["루꼴라샐러드","브루스케타","미네스트로네"],
    "봉골레화이트파스타":["루꼴라샐러드","마늘빵","올리브오일빵"],
    "토마토새우파스타":["시저샐러드","마늘빵","수프"],
    "크림새우파스타":["그린샐러드","마늘빵","수프"],
    "마늘올리브파스타":["루꼴라샐러드","브루스케타","수프"],
    "리조또":["그린샐러드","브루스케타","수프"],
    "버섯리조또":["루꼴라샐러드","마늘빵","파마산"],
    "새우리조또":["그린샐러드","브루스케타","수프"],
    "스테이크":["시저샐러드","감자퓨레","머스룸소스"],
    "소등심구이":["그린샐러드","감자퓨레","로즈마리"],
    "레몬허브치킨":["그린샐러드","감자구이","마늘빵"],
    "발사믹치킨":["루꼴라샐러드","감자구이","수프"],
    "피자":["그린샐러드","마늘빵","수프"],
    "마르게리타피자":["루꼴라샐러드","마늘빵","올리브"],
    "햄버거":["감자튀김","콜슬로","피클"],
    "클럽샌드위치":["감자칩","피클","코울슬로"],
    "피시앤칩스":["콜슬로","타르타르소스","레몬"],
    // ── 동남아 사이드 ──
    "팟타이":["똠얌수프","스프링롤","라임"],
    "그린커리":["흰쌀밥","파파덤","망고샐러드"],
    "레드커리":["흰쌀밥","파파덤","오이절임"],
    "나시고렝":["에그프라이","크루폭","오이절임"],
    "미고렝":["사테","크루폭","절임채소"],
    "인도네시아사테":["오이절임","밥","땅콩소스"],
    "말레이시아락사":["삶은계란","두부","숙주"],
    "쌀국수":["숙주","라임","허브"],
    "팟씨유":["오이절임","스프링롤","라임"],
    // ── 인도 사이드 ──
    "버터치킨":["난","라씨","처트니"],
    "탄두리치킨":["난","민트처트니","양파절임"],
    "비리야니":["라이타","처트니","파파덤"],
    "달커리":["난","처트니","라이타"],
    // ── 중동/기타 사이드 ──
    "케밥":["피타빵","타불레","후무스"],
    "팔라펠":["피타빵","후무스","타불레"],
    "쿠스쿠스":["처트니","올리브","피타빵"],
    "타진":["쿠스쿠스","올리브","피타빵"],
    // ── 스페인 사이드 ──
    "파에야":["빵","올리브","샐러드"],
    "해물파에야":["빵","올리브","레몬"],
    "감바스알아히요":["바게트","올리브","샐러드"],
    "가스파초":["크루통","올리브","빵"],
    // ── 멕시코 사이드 ──
    "타코":["과카몰레","살사","사워크림"],
    "카르니타스타코":["과카몰레","살사","할라피뇨"],
    "부리토":["과카몰레","살사","사워크림"],
    "엔칠라다":["과카몰레","사워크림","샐러드"],
    "퀘사디야":["과카몰레","살사","사워크림"],
  };

  // 키워드 기반 fallback
  const keywords=[
    // 한식
    {k:"찌개",  s:["콩나물국","김치","나물"]},
    {k:"탕",    s:["깍두기","나물","겉절이"]},
    {k:"국",    s:["멸치볶음","오이무침","김치"]},
    {k:"구이",  s:["된장국","김치","나물"]},
    {k:"볶음",  s:["된장국","김치","오이무침"]},
    {k:"조림",  s:["된장국","시금치나물","김치"]},
    {k:"찜",    s:["된장국","깍두기","나물"]},
    {k:"전",    s:["막걸리","오이무침","김치"]},
    {k:"죽",    s:["김치","깍두기","나물"]},
    {k:"비빔밥",s:["된장국","깍두기","나물"]},
    // 일식
    {k:"동",    s:["미소국","단무지","오이절임"]},
    {k:"라멘",  s:["교자","멘마","절임채소"]},
    {k:"우동",  s:["튀김","오니기리","절임채소"]},
    {k:"소바",  s:["튀김","절임채소","와사비"]},
    {k:"데리야끼",s:["미소국","절임채소","샐러드"]},
    {k:"카츠",  s:["미소국","양배추채","단무지"]},
    // 중식
    {k:"짜장",  s:["단무지","오이무침","양파절임"]},
    {k:"짬뽕",  s:["단무지","오이무침","양파절임"]},
    {k:"볶음밥",s:["달걀수프","단무지","오이무침"]},
    {k:"마파",  s:["흰쌀밥","오이무침","단무지"]},
    {k:"파스타",s:["시저샐러드","마늘빵","수프"]},
    {k:"리조또",s:["그린샐러드","마늘빵","수프"]},
    {k:"스테이크",s:["시저샐러드","감자퓨레","수프"]},
    {k:"피자",  s:["그린샐러드","마늘빵","올리브"]},
    {k:"수프",  s:["마늘빵","샐러드","크루통"]},
    {k:"샐러드",s:["수프","빵","올리브"]},
    {k:"카레",  s:["난","오이피클","처트니"]},
    // 동남아
    {k:"커리",  s:["흰쌀밥","난","처트니"]},
    {k:"볶음면",s:["오이절임","스프링롤","라임"]},
    {k:"타코",  s:["과카몰레","살사","사워크림"]},
    {k:"부리토",s:["과카몰레","살사","사워크림"]},
  ];

  if(map[name]) return map[name];
  for(const{k,s}of keywords) if(name.includes(k)) return s;
  return["김치","나물"];
}

function getBrands(side){
  // 직접 매핑
  if(BRAND_DB[side]) return BRAND_DB[side].filter(b=>new Date(b.until)>=new Date());
  // 키워드 매핑
  const keys=Object.keys(BRAND_DB);
  for(const k of keys) if(side.includes(k)||k.includes(side)) return(BRAND_DB[k]||[]).filter(b=>new Date(b.until)>=new Date());
  return(BRAND_DB.기타||[]).filter(b=>new Date(b.until)>=new Date());
}

// ── 정제 MENU_DB: 메뉴 ↔ 재료 로컬 지식베이스 ──
