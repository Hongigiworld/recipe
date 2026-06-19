function rFlowSteps(steps, current){
  const n=steps.length;
  return`<div style="background:var(--card);border-radius:16px;padding:20px 20px 14px;margin-bottom:16px;box-shadow:var(--shadow)">
    <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start">
      <!-- 연결선 (원들 중심을 잇는 선) -->
      <div style="position:absolute;top:15px;left:calc(100%/${n*2});right:calc(100%/${n*2});height:2px;display:flex;z-index:0">
        ${steps.slice(0,-1).map((_,i)=>`<div style="flex:1;height:2px;background:${i<current?"var(--primary)":"#e8e8e8"}"></div>`).join("")}
      </div>
      <!-- 원+텍스트 -->
      ${steps.map((s,i)=>`<div style="display:flex;flex-direction:column;align-items:center;width:${Math.floor(100/n)}%;z-index:1">
        <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;
          background:${i<current?"var(--primary)":i===current?"var(--primary)":"#f0f0f0"};
          color:${i<current?"#fff":i===current?"#fff":"#bbb"};
          box-shadow:${i<=current?"0 2px 8px rgba(0,0,0,0.2)":"none"}">
          ${i<current?"✓":i===current?"●":String(i+1)}
        </div>
        <div style="font-size:9px;font-weight:700;margin-top:6px;text-align:center;
          color:${i<current?"var(--primary)":i===current?"var(--primary)":"#ccc"}">${s}</div>
      </div>`).join("")}
    </div>
  </div>`;
}

// ── 식사 스케줄 ──
function rMealSlotIcon(meal,on){
  const color = meal==="아침" ? "#FF9F1C" : meal==="점심" ? "#4B3FD8" : "#425466";
  const bg = on ? color : "#C8CED8";
  if(meal==="아침"){
    return `<span style="width:30px;height:30px;border-radius:12px;background:${on?'#FFF4DE':'#F1F3F7'};display:inline-flex;align-items:center;justify-content:center;position:relative;flex-shrink:0">
      <span style="width:15px;height:15px;border-radius:50%;background:${bg};box-shadow:${on?'0 0 0 4px rgba(255,159,28,.16)':'none'}"></span>
    </span>`;
  }
  if(meal==="점심"){
    return `<span style="width:30px;height:30px;border-radius:12px;background:${on?'#F0EEFF':'#F1F3F7'};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
      <span style="width:18px;height:18px;border:2px solid ${bg};border-radius:50%;position:relative;display:inline-block">
        <span style="position:absolute;left:7px;top:-6px;width:2px;height:5px;background:${bg};border-radius:2px"></span>
        <span style="position:absolute;left:7px;bottom:-6px;width:2px;height:5px;background:${bg};border-radius:2px"></span>
        <span style="position:absolute;left:-6px;top:7px;width:5px;height:2px;background:${bg};border-radius:2px"></span>
        <span style="position:absolute;right:-6px;top:7px;width:5px;height:2px;background:${bg};border-radius:2px"></span>
      </span>
    </span>`;
  }
  return `<span style="width:30px;height:30px;border-radius:12px;background:${on?'#EEF2FF':'#F1F3F7'};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
    <span style="width:17px;height:17px;border-radius:50%;background:${bg};position:relative;display:inline-block">
      <span style="position:absolute;right:-4px;top:-2px;width:17px;height:17px;border-radius:50%;background:${on?'#EEF2FF':'#F1F3F7'}"></span>
    </span>
  </span>`;
}

// ── 식사 스케줄 ──
function rSchedule(){
  const mealMeta={
    "아침":{sub:"가볍게 시작",color:"#FF9F1C",bg:"#FFF7E8"},
    "점심":{sub:"든든한 한 끼",color:"var(--primary)",bg:"var(--primary-pale)"},
    "저녁":{sub:"하루 마무리",color:"#425466",bg:"#EEF2FF"},
  };
  return`<div style="padding:48px 20px 12px;background:linear-gradient(180deg,#fff,#F7F7FB);position:sticky;top:0;z-index:20">
    <button class="back" onclick="go('home')" style="margin-bottom:14px">←</button>
    <div class="title" style="margin-bottom:4px">식사 스케줄 설정</div>
    <div style="font-size:14px;color:var(--text-sub);line-height:1.45">요일별로 식단을 생성할 끼니를 선택해주세요.</div>
  </div>
  <div class="px" style="padding-bottom:120px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 14px">
      ${["아침","점심","저녁"].map(m=>{
        const cnt=DAYS.filter(d=>(S.schedule[d]||[]).includes(m)).length;
        return `<div style="background:#fff;border:1px solid var(--border);border-radius:16px;padding:12px;text-align:center;box-shadow:var(--shadow)">
          ${rMealSlotIcon(m,true)}
          <div style="font-size:12px;font-weight:800;margin-top:7px">${m}</div>
          <div style="font-size:11px;color:#8B95A1;margin-top:2px">${cnt}일 선택</div>
        </div>`;
      }).join("")}
    </div>
    ${DAYS.map(day=>`<div style="background:#fff;border:1px solid var(--border);border-radius:20px;padding:14px;margin-bottom:10px;box-shadow:var(--shadow)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-weight:900;font-size:16px">${day}요일</div>
        <div style="font-size:12px;color:var(--text-sub);font-weight:700">${(S.schedule[day]||[]).length}끼</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${["아침","점심","저녁"].map(m=>{
          const on=(S.schedule[day]||[]).includes(m);
          const meta=mealMeta[m];
          return `<button type="button" onclick="toggleSlot('${day}','${m}')" style="min-height:86px;padding:10px 6px;border-radius:17px;border:2px solid ${on?meta.color:'var(--border)'};background:${on?meta.bg:'#F7F8FA'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:inherit;transition:all .14s ease;box-shadow:${on?'0 5px 14px rgba(75,63,216,.12)':'none'};opacity:${on?1:.72}">
            ${rMealSlotIcon(m,on)}
            <span style="font-size:14px;font-weight:900;color:${on?meta.color:'#9AA3AF'}">${m}</span>
            <span style="font-size:10px;font-weight:700;color:${on?meta.color:'#B0B7C3'}">${on?'선택됨':meta.sub}</span>
          </button>`;
        }).join("")}
      </div>
    </div>`).join("")}
    <div style="background:#E8F5E9;border-radius:18px;padding:16px;margin-top:10px;text-align:center;border:1px solid #C8E6C9">
      <div style="font-size:13px;color:#2e7d32;font-weight:900">총 ${totalMeals()}끼 설정됨</div>
      <div style="font-size:11px;color:#66A06A;margin-top:4px">선택한 끼니 기준으로 식단이 생성돼요</div>
    </div>
  </div>
  <div class="bottom-bar"><button class="btn-p" onclick="saveSched();go('home')">설정 완료 →</button></div>`;
}
function toggleSlot(day,meal){
  if(!S.schedule[day])S.schedule[day]=[];
  const i=S.schedule[day].indexOf(meal);
  if(i>=0) S.schedule[day].splice(i,1);
  else S.schedule[day].push(meal);
  S.schedule[day].sort((a,b)=>["아침","점심","저녁"].indexOf(a)-["아침","점심","저녁"].indexOf(b));
  saveSched();
  render();
}

// ── A: 냉장고 화면 ──
function rAFridge(){
  const sorted=[...S.fridge].sort((a,b)=>getDday(a.addedAt,a.expireDays)-getDday(b.addedAt,b.expireDays));
  return`<div class="pad"><button class="back" onclick="go('home')">←</button><div class="title">❄️ 냉장고 확인</div></div>
  <div class="px" style="padding-top:8px;padding-bottom:130px">
    ${sorted.length===0?`<div style="text-align:center;color:#ccc;padding:32px">냉장고가 비어있어요</div>`:""}
    ${sorted.map((ing,i)=>{const d=getDday(ing.addedAt,ing.expireDays);return`<div class="${fiClass(d)}"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:22px">${ing.icon}</span><div><div style="font-weight:600;font-size:14px">${ing.name} ${storageBadge(ing.storage||getShelfLife(ing.name).storage)}</div><div style="font-size:12px;color:#aaa">${ing.qty}${ing.unit} · ${d<=0?"만료":d+"일"}</div></div></div><div style="display:flex;align-items:center;gap:6px">${ddayBadge(d)}<button onclick="editFI(${i})" style="background:none;border:none;color:#aaa;font-size:13px">✏️</button><button onclick="S.fridge.splice(${i},1);saveFridge();render()" style="background:none;border:none;color:#ddd;font-size:18px">×</button></div></div>`;}).join("")}
    <button onclick="openAddFI()" style="width:100%;padding:12px;background:#f8f8f8;border:1.5px dashed #ddd;border-radius:12px;color:#aaa;font-size:14px;margin-top:8px">+ 재료 직접 추가</button>
  </div>
  <div class="bottom-bar"><button class="btn-p" onclick="go('a-style')">🍽️ 이 재료로 식단 짜기</button></div>
`;
}
let _fiIdx=-1;
function openAddFI(){_fiIdx=-1;document.getElementById("fi-modal-title").textContent="재료 추가";document.getElementById("fi-name").value="";document.getElementById("fi-qty").value="";document.getElementById("fi-exp").value="14";document.getElementById("fi-modal").style.display="flex";}
function editFI(i){_fiIdx=i;const f=S.fridge[i];document.getElementById("fi-modal-title").textContent="재료 수정";document.getElementById("fi-name").value=f.name;document.getElementById("fi-qty").value=f.qty;document.getElementById("fi-unit").value=f.unit||"g";document.getElementById("fi-exp").value=f.expireDays||(getShelfLife(f.name||"").days)||7;document.getElementById("fi-modal").style.display="flex";}
function confirmFI(){const n=document.getElementById("fi-name").value.trim();const q=document.getElementById("fi-qty").value;const u=document.getElementById("fi-unit").value;const e=parseInt(document.getElementById("fi-exp").value)||14;if(!n)return;const item={name:n,qty:q||"적당량",unit:q?u:"",icon:getIcon(n),addedAt:new Date().toISOString().slice(0,10),expireDays:e};if(_fiIdx>=0)S.fridge[_fiIdx]=item;else S.fridge.push(item);saveFridge();document.getElementById("fi-modal").style.display="none";render();}

// ── A: 스타일 선택 ──
function rAStyle(){
  var sel=S.bcStyles||[];

  // 선택된 태그 뱃지 - B플로우와 동일 방식
  var styles=[{id:'한식',e:'🍚'},{id:'일식',e:'🍱'},{id:'중식',e:'🥢'},{id:'헬시',e:'🥗'},
    {id:'🇹🇭 태국',e:'🇹🇭'},{id:'🇻🇳 베트남',e:'🇻🇳'},{id:'🇮🇩 인도네시아',e:'🇮🇩'},{id:'🇲🇾 말레이시아',e:'🇲🇾'},
    {id:'🇸🇬 싱가포르',e:'🇸🇬'},{id:'🇵🇭 필리핀',e:'🇵🇭'},{id:'🇮🇳 인도',e:'🇮🇳'},{id:'🌙 중동',e:'🌙'},
    {id:'🇹🇷 터키',e:'🇹🇷'},{id:'🇬🇷 그리스',e:'🇬🇷'},{id:'🇪🇸 스페인',e:'🇪🇸'},{id:'🇫🇷 프랑스',e:'🇫🇷'},
    {id:'🇮🇹 이탈리아',e:'🇮🇹'},{id:'🇩🇪 독일',e:'🇩🇪'},{id:'🇵🇹 포르투갈',e:'🇵🇹'},{id:'🇲🇽 멕시코',e:'🇲🇽'},
    {id:'🇺🇸 미국',e:'🇺🇸'},{id:'🇧🇷 브라질',e:'🇧🇷'}
  ];

  var tagsHtml='';
  if(sel.length===0){
    tagsHtml='<span style="color:#aaa;font-size:14px">선택된 스타일 없음</span>';
  } else {
    tagsHtml=sel.map(function(s,i){
      var st=styles.find(function(x){return x.id===s;})||{e:''};
      var emoji=st.e||'';
      var name=s.includes(' ')?s.replace(/^\S+\s+/,'').trim():s;
      var flagUrl=emoji?'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/'+[...emoji].map(function(c){return c.codePointAt(0).toString(16);}).join('-')+'.svg':'';
      return '<span onclick="toggleStyle(\'' +s+ '\')" style="display:inline-flex;align-items:center;gap:4px;background:var(--primary);color:#fff;border-radius:20px;padding:5px 10px;font-size:13px;font-weight:700">'
        +(flagUrl?'<img src="'+flagUrl+'" width="16" height="16" style="vertical-align:middle" onerror="this.style.display=\'none\'">':'')
        +'<span>'+name+'</span>'
        +'<span style="margin-left:2px">✕</span>'
        +'</span>';
    }).join('');
  }

  // 버튼 라벨
  var btnLabel='스타일을 선택해주세요';
  if(sel.length>0){
    btnLabel=sel.map(function(s){return s.includes(' ')?s.replace(/^\S+\s+/,'').trim():s;}).join(' + ')+' 식단 짜기';
  }

  var clearBtn=sel.length>0?'<button onclick="S.bcStyles=[];render()" style="background:none;border:none;color:#999;font-size:13px;padding:4px 0;margin-bottom:8px;cursor:pointer">전체 해제</button>':'';

  return '<div class="pad">'
    +'<button class="back" onclick="go(\'a-fridge\')">←</button>'
    +'<div class="title">🍽️ 어떤 스타일로?</div>'
    +'<div class="sub" style="margin-bottom:12px">여러 개 선택 가능해요</div>'
    +'</div>'
    +'<div class="px" style="padding-bottom:140px">'
    +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;min-height:36px">'+tagsHtml+'</div>'
    +'<div style="margin-bottom:8px">'
    +'<label style="font-size:13px;color:#888;font-weight:600;margin-bottom:6px;display:block">국가/스타일 선택</label>'
    +'<button onclick="openStyleDrop()" style="width:100%;padding:14px 16px;border-radius:14px;border:2px solid var(--border);background:#fff;text-align:left;font-size:14px;color:var(--text-sub);cursor:pointer;display:flex;justify-content:space-between;align-items:center"><span>스타일 추가하기</span><span>＋</span></button>'
    +'</div>'
    +clearBtn
    +'</div>'
    +'<div class="bottom-bar">'
    +'<button class="btn-p" '+(sel.length===0?'disabled':'')+' onclick="genAMeal()">✨ '+btnLabel+'</button>'
    +'</div>';
}
function handleStyleDropdown(sel){
  var val=sel.value;
  if(!val)return;
  if(S.bcStyles.indexOf(val)<0) S.bcStyles.push(val);
  sel.value='';
  render();
}
function toggleStyle(s){
  var i=S.bcStyles.indexOf(s);
  if(i>=0) S.bcStyles.splice(i,1);
  else S.bcStyles.push(s);
  render();
}

// ── A: 식단 생성 ──
function genAMeal(){
  if(typeof flowBuildMenu==='function'){
    if(!S.bcStyles.length){alert('스타일을 먼저 선택해주세요');return;}
    if(!S.fridge.length){showInsufficientModal(0);return;}
    const menus=flowBuildMenu('fridge',S.bcStyles,[]);
    const best=menus.filter(n=>flowScoreMenuByFridge(n)>0);
    const selected=(best.length?best:menus).slice(0,totalMeals());
    flowCreatePlan(selected,`❄️ 냉장고 재료 우선으로 ${selected.length}개 메뉴를 배치했어요.`);
    flowBuildCart(selected);
    go('a-meal');
    return;
  }
}

// 재료 부족 안내 모달
function closePopup(){const e=document.getElementById("insuf-popup");if(e)e.remove();}

function showInsufficientModal(count){
  const el=document.createElement("div");
  el.id="insuf-popup";
  el.style.cssText="position:fixed;inset:0;background:rgba(26,26,46,0.7);z-index:999;display:flex;align-items:flex-end;justify-content:center";
  el.innerHTML=`<div style="background:#fff;border-radius:24px 24px 0 0;padding:28px 20px 44px;width:100%;max-width:480px">
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:48px">❄️</div>
      <div style="font-weight:800;font-size:18px;margin-top:8px">냉장고 재료가 부족해요</div>
      <div style="font-size:13px;color:#888;margin-top:6px">현재 <strong>${count}가지</strong> 재료가 있어요<br>식단을 짜려면 최소 <strong>5가지 이상</strong> 필요해요</div>
    </div>
    <div style="background:#f8f8f8;border-radius:14px;padding:14px;margin-bottom:16px;font-size:13px;color:#666;line-height:1.8">
      💡 <strong>이렇게 해보세요</strong><br>
      • ❄️ 냉장고에 재료를 더 추가하기<br>
      • 🤔 B플로우: 스타일 선택 후 메뉴 추천받기<br>
      • 🍖 C플로우: 먹고 싶은 메뉴 직접 입력하기
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="closePopup();go('a-fridge')" style="flex:1;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:14px;font-weight:700;font-size:14px">재료 추가하기</button>
      <button onclick="closePopup();resetFlow()" style="flex:1;padding:14px;background:#f0f0f0;color:#666;border:none;border-radius:14px;font-weight:700;font-size:14px">다른 방법으로</button>
    </div>
  </div>`;
  document.body.appendChild(el);
}

// 만들 수 있는 메뉴 부족 안내 모달
function showInsufficientMenuModal(count, fridgeNames){
  const el=document.createElement("div");
  el.id="insuf-popup";
  el.style.cssText="position:fixed;inset:0;background:rgba(26,26,46,0.7);z-index:999;display:flex;align-items:flex-end;justify-content:center";
  el.innerHTML=`<div style="background:#fff;border-radius:24px 24px 0 0;padding:28px 20px 44px;width:100%;max-width:480px">
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:48px">🤔</div>
      <div style="font-weight:800;font-size:18px;margin-top:8px">재료로 만들 수 있는 메뉴가 부족해요</div>
      <div style="font-size:13px;color:#888;margin-top:6px">현재 재료로 만들 수 있는 메뉴가 <strong>${count}개</strong>뿐이에요<br>재료를 더 추가하거나 스타일을 바꿔보세요</div>
    </div>
    <div style="background:#FFF8EE;border-radius:14px;padding:14px;margin-bottom:16px;font-size:13px;color:#666;line-height:1.8">
      🛒 <strong>장을 봐서 채워볼까요?</strong><br>
      B/C 플로우로 가면 필요한 재료를 한번에 장볼 수 있어요
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="closePopup();go('a-style')" style="flex:1;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:14px;font-weight:700;font-size:14px">스타일 다시 선택</button>
      <button onclick="closePopup();resetFlow()" style="flex:1;padding:14px;background:#f0f0f0;color:#666;border:none;border-radius:14px;font-weight:700;font-size:14px">다른 방법으로</button>
    </div>
  </div>`;
  document.body.appendChild(el);
}


/* ===== STYLE CHIP LABEL PATCH: 선택 후에는 국가명만 표시 ===== */
function bcStyleDisplayName(style){
  const raw=String(style||'').trim();
  if(!raw) return '';
  return raw.includes(' ') ? raw.replace(/^\S+\s+/,'').trim() : raw;
}

// ── BC: 진입 ──
function startBC(mode){S.bcMode=mode;S.bcMenus=[];S.bcStyles=[];S.bcSuggested=[];go("bc-entry");}
function rBCEntry(){
  if(typeof normalizeBCStylesV8==="function") normalizeBCStylesV8();
  const isB=S.bcMode==="b";
  const max=totalMeals();
  const POPULAR=["삼겹살구이","된장찌개","김치찌개","비빔밥","제육볶음","불고기","카레라이스","짜장면","파스타","스테이크","라멘","볶음밥","닭볶음탕","갈비찜","오야코동"];
  const styles=[{id:"한식",e:"🍚"},{id:"일식",e:"🍱"},{id:"중식",e:"🥢"},{id:"🇹🇭 태국",e:"🇹🇭"},{id:"🇻🇳 베트남",e:"🇻🇳"},{id:"🇮🇩 인도네시아",e:"🇮🇩"},{id:"🇲🇾 말레이시아",e:"🇲🇾"},{id:"🇸🇬 싱가포르",e:"🇸🇬"},{id:"🇵🇭 필리핀",e:"🇵🇭"},{id:"🇮🇳 인도",e:"🇮🇳"},{id:"🇲🇽 멕시코",e:"🇲🇽"},{id:"🇹🇷 터키",e:"🇹🇷"}];
  return`<div style="padding:0 20px 12px;background:linear-gradient(160deg,${isB?"#FFF8EE":"#FCE4EC"},#fff);position:fixed;top:0;left:0;right:0;max-width:480px;margin:0 auto;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.06))">
    <button class="back" onclick="go('home')">←</button>
    <div class="title">${isB?"🤔 뭐 드실 건가요?":"🍖 먹고 싶은 메뉴"}</div>
    <div class="sub">${isB?"스타일을 고르면 메뉴를 추천해드려요":`최대 ${max}개 선택`}</div>
  </div>
  <div class="px" style="padding-top:8px;padding-bottom:130px">
    <div class="card" style="margin-bottom:14px"><div class="sec">👥 인원수</div><div style="display:flex;gap:8px;margin-top:8px">${[1,2,3,4].map(n=>`<button onclick="S.people=${n};render()" style="flex:1;padding:11px;border-radius:10px;border:2px solid ${S.people===n?"var(--primary)":"var(--border)"};background:${S.people===n?"var(--primary-pale)":"#fff"};font-weight:700;font-size:15px;color:${S.people===n?"var(--primary)":"var(--text)"}">${n}인</button>`).join("")}</div></div>
    ${isB?`
    <div class="sec" style="margin-bottom:10px">음식 스타일 선택</div>
    ${S.bcStyles.length>0?`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${S.bcStyles.map((s,i)=>{
        const name=bcStyleDisplayName(s);
        return`<span style="background:var(--primary);color:#fff;border-radius:20px;padding:5px 12px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:5px">
          <span>${name}</span>
          <button type="button" onclick="event.preventDefault();event.stopPropagation();S.bcStyles.splice(${i},1);render();return false;" style="background:rgba(255,255,255,0.25);border:none;color:#fff;font-size:11px;cursor:pointer;padding:2px 5px;border-radius:8px;line-height:1;font-weight:900;pointer-events:auto">✕</button>
        </span>`;}).join("")}
    </div>`:""}
    <button onclick="openStyleDrop()" style="width:100%;padding:14px 16px;border-radius:14px;border:2px dashed var(--primary);background:#FFF8EE;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;color:var(--primary)">
      ＋ 스타일 추가하기
    </button>`:`
    <div class="sec">메뉴 입력 (${S.bcMenus.length}/${max})</div>
    <div style="position:relative">
    <div style="display:flex;gap:8px;margin-bottom:4px">
      <input id="c-inp" class="inp" placeholder="예: 삼겹살, 된장찌개..." style="flex:1" onkeydown="if(event.key==='Enter'){addCMenu();}" oninput="showAutoComplete(this.value)" autocomplete="off">
      <button onclick="addCMenu()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:11px 16px;font-weight:700">추가</button>
    </div>
    <div id="ac-drop" style="display:none;position:absolute;top:100%;left:0;right:44px;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,0.12);z-index:100;overflow:hidden;max-height:240px;overflow-y:auto"></div>
  </div>
    ${S.bcMenus.length>0?`<div style="display:flex;flex-wrap:wrap;margin-bottom:12px">${S.bcMenus.map((m,i)=>`<span style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;font-size:13px;border:1.5px solid #f48fb1;background:#fce4ec;color:var(--accent);font-weight:700;margin:3px">${m}<button onclick="S.bcMenus.splice(${i},1);render()" style="background:none;border:none;color:#f48fb1;font-size:15px;padding:0">×</button></span>`).join("")}</div>`:""}
    <div class="sec">인기 메뉴</div>
    <div style="display:flex;flex-wrap:wrap">${POPULAR.map(m=>{const sel=S.bcMenus.includes(m);return`<button onclick="toggleCMenu('${m}')" style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:20px;font-size:13px;border:1.5px solid ${sel?"#f48fb1":"var(--border)"};background:${sel?"#fce4ec":"#fff"};color:${sel?"var(--accent)":"var(--text-sub)"};font-weight:${sel?700:400};margin:3px">${sel?"✓ ":""}${m}</button>`;}).join("")}</div>`}
  </div>
  <div class="bottom-bar">
    ${isB?`<button class="btn-o" ${S.bcStyles.length===0?"disabled":""} onclick="genBSuggest()">🍽️ ${S.bcStyles.length>0?S.bcStyles.map(s=>bcStyleDisplayName(s)).join(" + ")+' 메뉴 추천':'스타일을 선택해주세요'}</button>`:`
    <div style="display:flex;flex-direction:column;gap:8px">
      ${S.bcMenus.length>0&&S.bcMenus.length<max?`<div style="text-align:center;font-size:12px;color:#aaa">나머지 ${max-S.bcMenus.length}개는 AI가 자동으로 채워드려요</div>`:""}
      <button class="btn-p" ${S.bcMenus.length===0?"disabled":""} onclick="genBCCart()">🛒 재료 분석하기</button>
    </div>`}
  </div>`;
}

function showAutoComplete(val){
  const drop=document.getElementById("ac-drop");
  if(!drop)return;
  const q=val.trim();
  if(q.length<1){drop.style.display="none";return;}

  // DB에서 부분일치 검색 - 입력값이 포함된 메뉴 찾기
  const keys=Object.keys(MENU_DB);
  const allMatches=keys.filter(k=>k.includes(q));
  // 정확히 시작하는 것 먼저, 그 다음 포함하는 것
  const results=[
    ...allMatches.filter(k=>k.startsWith(q)),
    ...allMatches.filter(k=>!k.startsWith(q))
  ].slice(0,20);

  // 없으면 초성/키워드로 넓게 검색
  const extra = results.length < 4
    ? keys.filter(k=>!results.includes(k) && (
        k.replace(/찌개|볶음|구이|조림|나물|무침|전골|탕|국/g,"").includes(q) ||
        q.replace(/찌개|볶음|구이|조림|나물|무침|전골|탕|국/g,"").length>0 && k.includes(q.replace(/찌개|볶음|구이|조림|나물|무침|전골|탕|국/g,""))
      )).slice(0, 8-results.length)
    : [];

  const all=[...results,...extra];
  if(!all.length){drop.style.display="none";return;}

  drop.innerHTML=all.map(name=>{
    const db=MENU_DB[name];
    const cat=db?.ingredients.find(i=>i.category==="단백질")?.name||"";
    const highlighted=name.replace(new RegExp(q,"g"),`<span style="color:var(--primary);font-weight:800">${q}</span>`);
    return`<div onclick="selectAC('${name}')" style="padding:12px 14px;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:10px;active:background:#f5f5f5">
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600">${highlighted}</div>
        ${cat?`<div style="font-size:11px;color:#aaa">주재료: ${cat}</div>`:""}
      </div>
      <span style="font-size:11px;color:var(--primary);font-weight:700">선택</span>
    </div>`;
  }).join("");
  drop.style.display="block";
}

function selectAC(name){
  const inp=document.getElementById("c-inp");
  if(inp)inp.value=name;
  const drop=document.getElementById("ac-drop");
  if(drop)drop.style.display="none";
  addCMenu();
}

// 외부 클릭시 드롭다운 닫기
document.addEventListener("click",function(e){
  const drop=document.getElementById("ac-drop");
  if(drop&&!drop.contains(e.target)&&e.target.id!=="c-inp") drop.style.display="none";
});

// ── MENU_DB 추가 항목 2 ──






function addCMenu(){const i=document.getElementById("c-inp");const v=i.value.trim();if(v&&!S.bcMenus.includes(v)&&S.bcMenus.length<totalMeals())S.bcMenus.push(v);i.value="";render();}
function toggleCMenu(m){const i=S.bcMenus.indexOf(m);if(i>=0)S.bcMenus.splice(i,1);else if(S.bcMenus.length<totalMeals())S.bcMenus.push(m);render();}

// ── B: AI 메뉴 추천 ──
function genBSuggest(){
  const max=totalMeals();
  const typeOrder=["아침","점심","저녁"];
  let pool=(S.bcStyles&&S.bcStyles.length?S.bcStyles:["한식"]).flatMap(s=>FLOW_STYLE_MENU_MAP[s]||[]);
  pool=[...new Set(pool)].filter(name=>MENU_DB[name]);
  if(!pool.length) pool=Object.keys(MENU_DB);
  const menus=pool.sort((a,b)=>{
    const sa=getSeasonalScore(a), sb=getSeasonalScore(b);
    if(sa!==sb) return sb-sa;
    return Math.random()-0.5;
  }).slice(0,Math.min(max+5,pool.length)).map((name,i)=>({
    name,
    selected:false,
    type:typeOrder[i%3],
    ingredients:(MENU_DB[name]?.ingredients||[]).slice(0,3).map(x=>x.name),
    sharedWith:[]
  }));
  S.bcSuggested=menus;
  go("b-suggest");
}



// ── 앱 시작 ──
document.addEventListener("click", function(e){
  const drop = document.getElementById("style-drop");
  if(drop && !drop.contains(e.target) && !e.target.closest('button[onclick*="style-drop"]')){
    drop.style.display = "none";
  }
  const acDrop = document.getElementById("ac-drop");
  if(acDrop && !acDrop.contains(e.target) && e.target.id !== "c-inp"){
    acDrop.style.display = "none";
  }
});



/* =========================================================
   FLOW PATCH v2 - 구조도 기준 식단 생성 엔진
   A: 냉장고 파먹기 / B: 스타일 추천 / C: 먹고 싶은 메뉴
   ========================================================= */
const FLOW_STYLE_MENU_MAP={"한식": ["된장찌개", "김치찌개", "참치김치찌개", "순두부찌개", "해물순두부찌개", "부대찌개", "청국장찌개", "감자탕", "동태찌개", "꽃게탕", "미역국", "소고기뭇국", "콩나물국", "북어국", "육개장", "갈비탕", "삼계탕", "제육볶음", "간장제육볶음", "소불고기", "돼지불고기", "닭갈비", "닭볶음탕", "찜닭", "갈비찜", "돼지갈비찜", "보쌈", "수육", "오징어볶음", "낙지볶음", "주꾸미볶음", "고등어구이", "고등어조림", "갈치조림", "삼치구이", "비빔밥", "김치볶음밥", "새우볶음밥", "오므라이스", "카레라이스", "콩나물밥", "김밥", "떡국", "떡볶이", "라볶이", "잡채", "잔치국수", "비빔국수", "칼국수", "수제비", "냉면", "김치전", "해물파전", "감자전", "계란말이", "계란찜", "두부조림", "장조림", "멸치볶음", "어묵볶음", "시금치나물", "콩나물무침", "오이무침", "무생채", "깍두기", "오이소박이", "닭가슴살샐러드", "현미채소덮밥", "닭가슴살카레", "등갈비찜", "황태국", "콩나물해장국", "닭개장", "설렁탕", "돌솥비빔밥", "쌈밥", "유부초밥", "닭곰탕", "소고기미역국", "두루치기", "고추장불고기", "묵은지삼겹살", "우거지갈비찜", "약밥", "북어무침", "들깨순두부찌개", "오리주물럭", "두부채소볶음", "닭가슴살채소볶음", "아욱국", "갈치구이", "간고등어구이", "코다리조림", "동태전", "감자볶음", "도라지무침", "취나물무침", "가지볶음", "느타리버섯볶음", "고사리나물", "전복죽", "닭죽", "건새우미역무침", "잡곡밥", "영양솥밥", "된장삼겹살", "간장새우장", "버섯솥밥", "두부미역국", "계란국", "배추된장국", "마늘종볶음", "참나물무침", "삼치조림", "골뱅이무침", "닭한마리", "추어탕", "들깨미역국", "대패삼겹살구이", "두부부침", "황태구이", "간장게장", "전복미역국", "된장비빔밥", "홍합탕", "바지락탕", "꼬리곰탕", "우거지해장국", "냉이된장국", "쑥된장국", "무조림", "연근조림", "우엉조림", "더덕구이", "꽁치조림", "꽁치김치찌개", "소고기죽", "소고기덮밥", "계란덮밥", "낙지덮밥", "참치마요덮밥", "오삼불고기", "두부김치", "돼지고기깻잎볶음", "소고기볶음", "호박전", "버섯전", "육전", "빈대떡", "무나물", "호박나물", "숙주나물", "미역줄기볶음", "깻잎무침", "삼겹살구이", "목살구이", "막국수", "콩나물국밥", "도토리묵무침", "감자수제비", "해물잡채", "아귀찜", "팥죽", "순대국밥", "현미채소볶음밥", "닭가슴살채소볶음밥", "장어구이", "돼지국밥", "쟁반국수", "어묵국", "떡갈비", "곱창볶음", "순대볶음", "열무비빔밥", "오이냉국", "미역냉국", "물김치", "총각김치", "불고기전골", "해물전골", "들깨칼국수", "비지찌개", "산채비빔밥", "육회비빔밥", "떡만두국", "파김치", "황기닭백숙", "소갈비구이", "팽이버섯전골", "냉이무침", "열무국수", "채소달걀국", "닭가슴살채소볶음", "두부버섯솥밥", "들기름막국수", "평양냉면", "비빔냉면", "물냉면", "함흥냉면", "콩나물냉국수", "닭비빔막국수", "간장닭날개튀김", "참치회비빔밥", "간장비빔소면"], "헬시": ["된장찌개", "순두부찌개", "청국장찌개", "미역국", "삼계탕", "고등어구이", "비빔밥", "잡채", "물냉면", "두부조림", "카오팟", "쌀국수", "반미", "고이꾸온", "클램차우더", "렌틸수프", "그릭샐러드", "닭가슴살샐러드", "연어포케", "두부포케", "그릭요거트볼", "오트밀", "현미채소덮밥", "두부스테이크", "렌틸콩샐러드", "계란아보카도토스트", "닭가슴살카레", "연어아보카도볼", "퀴노아채소볼", "두부채소볶음", "닭가슴살채소볶음", "갈치구이", "라이타", "버섯솥밥", "두부미역국", "병아리콩샐러드", "참치채소샐러드", "가스파초", "두부스크램블에그", "채소커리", "메밀소바샐러드", "아보카도연어토스트", "타불레", "콩나물국밥", "두부스테이크테리야키", "현미채소볶음밥", "닭가슴살채소볶음밥", "연어스테이크", "단호박수프", "닭가슴살요거트볼", "비트샐러드", "채소달걀국", "하리라", "달마카니", "탄두리연어", "연어아보카도포케", "닭가슴살채소볶음", "두부버섯솥밥", "클래식 세비체", "들기름막국수", "평양냉면", "물냉면", "참치회비빔밥"], "일식": ["규동", "오야코동", "가츠동", "텐동", "카레우동", "유부우동", "야키소바", "쇼유라멘", "미소라멘", "돈코츠라멘", "돈카츠", "치킨카츠", "가라아게", "데리야키치킨", "연어데리야키", "사바미소니", "오코노미야키", "타코야키", "니쿠자가", "스키야키", "샤브샤브", "미소국", "차완무시", "이나리초밥", "연어초밥", "참치마요오니기리", "명란오니기리", "일본식계란말이", "히야시츄카", "자루소바", "나베야키우동", "일본식 카레라이스", "교자", "사케동", "치라시즈시", "아게다시두부", "오덴", "유도후", "야키토리", "수프카레", "에비마요", "쯔케멘", "히레카츠", "멘치카츠", "코로케", "마제소바", "돈지루", "에비후라이", "야키우동", "치킨난반", "이시카리나베", "카키아게", "사케미소즈케", "부타킴치", "메밀소바샐러드", "타마고산도", "규나베", "에비텐동", "가이센동", "미소버터라멘", "부타네기야키", "아지후라이", "두부스테이크테리야키", "카니돈부리", "야키오니기리", "모야시라멘", "오야코우동", "다코라이스", "부타네기폰즈", "스키야키", "부타카쿠니", "오징어먹물 파스타"], "중식": ["마파두부", "짜장면", "짬뽕", "계란볶음밥", "새우볶음밥", "탕수육", "깐풍기", "유린기", "깐쇼새우", "칠리새우", "고추잡채", "꽃빵고추잡채", "양장피", "팔보채", "마라탕", "마라샹궈", "동파육", "훠궈", "군만두", "물만두", "완탕면", "탄탄면", "꿔바로우", "토마토계란볶음", "청경채굴소스볶음", "가지볶음", "해물누룽지탕", "어향가지", "샤오롱바오", "회과육", "우육면", "오향장육", "라조기", "새우완탕면", "베이징덕", "차슈", "홍샤오러우", "어향육사", "마늘새우볶음", "소고기브로콜리볶음", "닭고기캐슈넛볶음", "중식오이냉채", "마파가지", "차오멘", "바오즈", "쿵파오치킨", "슈마이", "게살볶음밥", "해파리냉채", "부추계란볶음", "피단두부무침", "마라라면", "광동식볶음밥", "파기름파스타", "중식만두전골", "총유병", "완탕탕", "광동볶음면", "야채춘권", "팽이버섯볶음", "닭육수면", "광동식탕수육"], "🇹🇭 태국": ["팟타이", "팟씨유", "팟카파오 무쌉", "카오팟", "카오만가이", "똠얌꿍", "그린커리", "레드커리", "쏨땀", "카오소이", "마사만커리", "똠카가이", "얌운센", "팟팍붕파이댕", "카오니아오", "꾸어이티어우", "팟프리킹", "얌마무앙", "카오팟크라파오", "카이지아우무쌉", "뿌팟퐁가리", "파낭커리", "얌느아", "카오니아우마무앙", "얌탈레", "칸톰카이", "팟팟카나", "카오무댕", "라르브무", "팟나", "카오닌무삥", "마싸만 커리"], "🇻🇳 베트남": ["쌀국수", "반미", "분짜", "고이꾸온", "짜조", "반쎄오", "분보후에", "껌승", "퍼가", "분팃느엉", "껌가", "넴느엉꾸온", "카인까우아", "반꾸온", "미꽝", "보룩락", "껌찌엔", "껌땀", "미싸오", "차까", "넴루이", "보비아", "커리치킨반미", "고이가", "쌀국수볶음", "반팃느엉", "생선국수", "보코", "퍼싸오", "껌스엉", "반보팻짠"], "🇮🇩 인도네시아": ["나시고랭", "미고랭", "비프 렌당", "사테아얌", "가도가도", "소토아얌", "바쿠소", "나시우둑", "아얌바카르", "오포르아얌", "삼발텀페", "나시짬빌", "이칸고랭", "삼발우당", "캅카이", "시오미", "아얌페냑", "템페고랭", "롱통", "아얌세리", "페센베크", "사유르아삼", "굴라이 이칸", "레막캄빙", "아삼이칸", "비프 렌당"], "🇲🇾 말레이시아": ["락사", "나시르막", "차퀘이테오", "치킨커리말레이", "아삼락사", "로티차나이", "이칸바카르", "미고랭말레이", "오탁오탁", "마삭메라", "논야커리", "이칸마살라", "삼발켄팅", "케랍아얌", "이칸아삼", "아얌고랭베렘팍", "달채소카레", "아삼프라이드치킨", "나시머냑", "이칸페프리", "나시고랭", "로미에", "아얌마삭르막"], "🇸🇬 싱가포르": ["하이난 치킨라이스", "칠리크랩", "바쿠테", "싱가포르락사", "호켄미", "싱가포르사테", "프론미", "카야토스트", "캐롯케이크", "블랙페퍼크랩", "미폭국수", "나시빠당", "오타오타싱가포르", "스팀보트", "싱가포르죽", "피시헤드커리", "비가탄면", "찐호키엔미", "체가이볶음면", "완탕미싱가포르", "무이판", "오타오타", "하이난 치킨라이스"], "🇵🇭 필리핀": ["치킨아도보", "포크아도보", "시니강", "판싯", "레촌카왈리", "칼데레타", "판싯칸톤", "씨씩", "불라로", "암팔라야볶음", "피나클렛", "에스카베체", "비나고나안", "킬라윈", "카레카레", "니라가", "토실로그", "이나살", "크리스피파타", "판싯바하이", "기나탕마노크", "아도봉캉콩", "피시볼국"], "🇲🇽 멕시코": ["비프타코", "치킨타코", "치킨부리토", "퀘사디야", "칠리콘카르네", "나초", "과카몰레", "엔칠라다", "카르네아사다", "피시타코", "토르티야수프", "멕시칸라이스", "포졸레", "타말레", "토스타다", "칠레레예노", "치미창가", "소파데리마", "엠파나다", "멕시코콩스튜", "칠레아도보", "소파데피데오", "멕시코식타말", "치킨몰레", "세비체", "카마로네스알라디아블라", "카르네 아사다 타코"], "🇮🇳 인도": ["치킨티카마살라", "버터치킨", "팔락파니르", "달커리", "알루고비", "비리야니", "차나마살라", "탄두리치킨", "치킨코르마", "빈달루", "파니르티카", "아루나달", "도사", "사모사", "새우마살라", "로건조시", "말라이코프타", "라이타", "사히파니르", "알루파라타", "케이마마터", "마카니달", "고아피시커리", "팬니르도피아자", "암리차리컬차", "케랄라새우커리", "치킨발티", "팔라크아루", "치킨두피아자", "달타르카", "달마카니", "램 코르마", "탄두리연어"], "🇹🇷 터키": ["케밥", "치킨케밥", "메네멘", "렌틸수프", "고등어케밥", "아다나케밥", "이스켄데르케밥", "쾨프테", "이맘바이으르디", "터키식필라프", "만트", "보렉", "쉬쉬타북", "훔무스", "카르니야르크", "귀벡", "자작크", "메르지메크수프", "카부르가", "타쉬쾨프테", "타부크수유", "이즈미르쾨프테"], "🇬🇷 그리스": ["그릭샐러드", "무사카", "수블라키", "기로스", "스파나코피타", "돌마데스", "파스티치오", "클레프티코", "차지키", "티로피타", "스티파도", "브리암", "스코르달리아", "아브고레모노", "스파나코리조", "파소울라다", "아고우렐라이오", "프라이드피타", "할루미구이", "아르니굽기", "호르타", "기로스 피타"], "🇪🇸 스페인": ["파에야", "가스파초", "또르티야에스파뇰라", "파타타스브라바스", "알봉디가스", "감바스알아히요", "살모레호", "코시도", "피미엔토파드론", "하몬크로케타", "풀포갈레가", "파파아루가다", "소파카스텔야나", "아호블랑코", "사르수엘라", "초리소와인조림", "시피오네스앙코아"], "🇫🇷 프랑스": ["부야베스", "크로크무슈", "코코뱅", "프렌치어니언수프", "라따뚜이", "니수아즈 샐러드", "카술레", "솔뮈니에르", "크레프", "버섯벨루테", "프로방살토마토", "크림소스연어", "니스스타일피자", "쿠르제트수프", "파르망티에", "뵈프엔다우브", "아만딘송어"], "🇮🇹 이탈리아": ["리볼리타", "아쿠아파차", "포카치아", "카포나타", "오소부코", "살팀보카", "시칠리아파스타", "아라비아타파스타", "버터세이지뇨키", "리가토니알라보드카", "폴포살라다"], "🌙 중동": ["팔라펠", "샤와르마", "타불레", "키베", "만사프", "마클루베", "머제타이스", "치킨샤와르마랩", "카프타그릴", "마크부스", "레바논타울룩", "코프타 케밥"], "🇵🇪 페루": ["로모살타도", "아히데갈리나", "차우파", "클래식 세비체"], "🇲🇦 모로코": ["치킨타진", "쿠스쿠스로얄", "하리라", "바스틸라", "케프타 타진"], "🇷🇺 러시아": ["솔얀카"], "🇵🇹 포르투갈": ["칼데이라다", "코지두 아 포르투게사"], "🇧🇷 브라질": ["무케카"], "🇺🇸 미국": ["슬로피 조", "잠발라야"], "🇹🇼 대만": ["멘보샤"]};
