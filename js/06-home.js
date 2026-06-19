function rOnboard(){
  const mealMeta={
    "아침":{sub:"가볍게 시작",color:"#FF9F1C",bg:"#FFF7E8"},
    "점심":{sub:"든든한 한 끼",color:"var(--primary)",bg:"var(--primary-pale)"},
    "저녁":{sub:"하루 마무리",color:"#425466",bg:"#EEF2FF"},
  };
  const total=totalMeals();
  return`<div style="padding:48px 20px 12px;background:linear-gradient(180deg,#fff,#F7F7FB);position:sticky;top:0;z-index:20">
    <div class="title" style="margin-bottom:4px">식사 스케줄 설정</div>
    <div style="font-size:14px;color:var(--text-sub);line-height:1.45">요일별로 식단을 생성할 끼니를 선택해주세요.</div>
  </div>
  <div class="px" style="padding-bottom:150px">
    <div style="background:#fff;border:1px solid var(--border);border-radius:20px;padding:14px;margin:10px 0 14px;box-shadow:var(--shadow)">
      <div style="font-size:11px;font-weight:700;color:var(--text-sub);letter-spacing:1px;margin-bottom:10px">👥 몇 인 가족이에요?</div>
      <div style="display:flex;gap:8px">
        ${[1,2,3,4].map(n=>`<button onclick="S.people=${n};render()" style="flex:1;padding:12px 0;border-radius:14px;border:2px solid ${S.people===n?'var(--primary)':'var(--border)'};background:${S.people===n?'var(--primary-pale)':'#fff'};color:${S.people===n?'var(--primary)':'var(--text)'};font-weight:900;font-size:15px">${n}인</button>`).join("")}
      </div>
    </div>

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

    ${DAYS.map(day=>`<div style="background:#fff;border:1px solid var(--border);border-radius:20px;padding:12px;margin-bottom:8px;box-shadow:var(--shadow)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-weight:900;font-size:16px">${day}요일</div>
        <div style="font-size:12px;color:var(--text-sub);font-weight:700">${(S.schedule[day]||[]).length}끼</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${["아침","점심","저녁"].map(m=>{
          const on=(S.schedule[day]||[]).includes(m);
          const meta=mealMeta[m];
          return `<button class="schedule-meal-btn ${on?'active':''}" type="button" onclick="toggleSlot('${day}','${m}')" style="min-height:64px;padding:10px 6px;border-radius:17px;border:2px solid ${on?meta.color:'var(--border)'};background:${on?meta.bg:'#F7F8FA'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:inherit;transition:all .14s ease;box-shadow:${on?'0 5px 14px rgba(75,63,216,.12)':'none'};opacity:${on?1:.72}">
            ${rMealSlotIcon(m,on)}
            <span style="font-size:14px;font-weight:900;color:${on?meta.color:'#9AA3AF'}">${m}</span>
            <span style="font-size:10px;font-weight:700;color:${on?meta.color:'#B0B7C3'}">${on?'선택됨':meta.sub}</span>
          </button>`;
        }).join("")}
      </div>
    </div>`).join("")}

    <div style="background:#E8F5E9;border-radius:18px;padding:16px;margin-top:10px;text-align:center;border:1px solid #C8E6C9">
      <div style="font-size:13px;color:#2e7d32;font-weight:900">총 ${total}끼 설정됨</div>
      <div style="font-size:11px;color:#66A06A;margin-top:4px">선택한 끼니 기준으로 식단이 생성돼요</div>
    </div>

    <div style="background:#fff;border:1px solid var(--border);border-radius:20px;padding:14px;margin-top:14px;box-shadow:var(--shadow)">
      <div style="font-size:11px;font-weight:700;color:var(--text-sub);letter-spacing:1px;margin-bottom:10px">📅 식단 기간</div>
      <div style="display:flex;gap:8px">
        ${[
          {v:1,label:"1주일",sub:"7일",icon:"📅"},
          {v:2,label:"2주일",sub:"14일",icon:"📆"},
          {v:4,label:"한달",sub:"30일",icon:"🗓️"},
        ].map(p=>`<button onclick="S.planDuration=${p.v};render()" style="flex:1;padding:12px 8px;border-radius:14px;border:2px solid ${S.planDuration===p.v?'var(--primary)':'var(--border)'};background:${S.planDuration===p.v?'var(--primary-pale)':'#fff'};text-align:center;cursor:pointer">
          <div style="font-size:20px;margin-bottom:4px">${p.icon}</div>
          <div style="font-weight:800;font-size:14px;color:${S.planDuration===p.v?'var(--primary)':'var(--text)'}">${p.label}</div>
          <div style="font-size:11px;color:#aaa">${p.sub}</div>
        </button>`).join("")}
      </div>
    </div>
  </div>
  <div class="bottom-bar">
    <button onclick="completeOnboard()" ${total===0?'disabled':''} class="btn-p" style="background:${total>0?'var(--primary)':'#e0e0e0'}!important;box-shadow:${total>0?'0 8px 24px rgba(75,63,216,0.3)':'none'}!important">
      ${total>0?`${total}끼로 시작하기 →`:"끼니를 선택해주세요"}
    </button>
  </div>`;
}

function completeOnboard(){
  if(Object.values(S.schedule).reduce((a,b)=>a+b.length,0)===0)return;
  saveSched();
  localStorage.setItem("wm_schedule_set","1");
  localStorage.setItem("wm_plan_duration",String(S.planDuration||1));
  go("home");
}

function rHome(){
  const hour=new Date().getHours();
  const greet=hour<12?"좋은 아침이에요":hour<18?"오늘도 맛있게 챙겨볼까요?":"오늘 식단을 마무리해볼까요?";
  const urgent=S.fridge.filter(i=>getDday(i.addedAt,i.expireDays)<=3&&getDday(i.addedAt,i.expireDays)>0).length;
  const expired=S.fridge.filter(i=>getDday(i.addedAt,i.expireDays)<=0).length;
  const planDays=S.planDuration||1;
  const dayMealCount=Object.values(S.schedule||{}).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0);
  const plannedMeals=Math.max(0, dayMealCount*planDays);
  const todayName=DAYS[(new Date().getDay()+6)%7];
  const todaySlots=(S.schedule&&Array.isArray(S.schedule[todayName]))?S.schedule[todayName]:[];
  const todayCount=todaySlots.length;
  const cartCount=(S.cart||[]).filter(i=>!i.checked).length;
  const fridgeCount=(S.fridge||[]).length;

  // 진행중인 플로우가 있으면 기존 플로우 화면 유지
  if(S.activeFlow==="a") return rHomeA();
  if(S.activeFlow==="b") return rHomeB();
  if(S.activeFlow==="c") return rHomeC();

  // 이번 주 식단이 완성된 경우 기존 완료 홈 유지
  if(S.mealPlan){
    return rHomeDone();
  }

  return`
  <div style="min-height:100%;padding:54px 20px 120px;background:linear-gradient(180deg,#F4F0FF 0%,#FAF9FF 42%,#F7F7FB 100%)">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <div>
        <div style="font-size:13px;color:#7C6FC9;font-weight:700;margin-bottom:5px">${greet}</div>
        <div style="font-size:28px;line-height:1.12;font-weight:900;letter-spacing:-1.1px;color:#171421">이번 주 식단</div>
      </div>
      <button onclick="go('schedule')" style="width:42px;height:42px;border:none;border-radius:16px;background:#fff;box-shadow:0 10px 26px rgba(87,70,180,.10);font-size:18px">⚙️</button>
    </div>

    <div style="position:relative;overflow:hidden;border-radius:30px;padding:22px;background:linear-gradient(145deg,#7C5CFF 0%,#9D7BFF 55%,#BBA5FF 100%);box-shadow:0 24px 48px rgba(124,92,255,.22);color:#fff;margin-bottom:18px">
      <div style="position:absolute;right:-28px;top:-24px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.16)"></div>
      <div style="position:absolute;right:42px;bottom:-46px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.11)"></div>
      <div style="position:relative;z-index:1">
        <div style="font-size:12px;font-weight:700;opacity:.82;margin-bottom:8px">WEEKLY MEAL PLAN</div>
        <div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:4px">
          <div style="font-size:42px;font-weight:900;letter-spacing:-1.8px;line-height:1">${plannedMeals||0}</div>
          <div style="font-size:15px;font-weight:800;margin-bottom:6px;opacity:.92">끼 예정</div>
        </div>
        <div style="font-size:13px;opacity:.82;margin-bottom:14px">${planDays===4?'한 달':planDays===2?'2주':'1주'} 기준 · ${S.people||1}인분 장보기까지 한 번에</div>
        <div style="height:50px;border-radius:18px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;letter-spacing:-.2px">아래에서 시작 방식을 선택하세요</div>
      </div>
    </div>

    ${(urgent>0||expired>0)?`<button onclick="go('tab-fridge')" style="width:100%;border:none;border-radius:22px;background:#FFF3F5;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;text-align:left;box-shadow:0 10px 24px rgba(255,90,122,.08)">
      <div style="width:42px;height:42px;border-radius:15px;background:#FF5A7A;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px">!</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:900;color:#B4233B">냉장고 확인이 필요해요</div>
        <div style="font-size:12px;color:#8B5A66;margin-top:2px">${expired>0?`만료 ${expired}개`:''}${expired>0&&urgent>0?' · ':''}${urgent>0?`3일 이내 ${urgent}개`:''}</div>
      </div>
      <div style="font-size:20px;color:#D98A9A">›</div>
    </button>`:''}

    <div style="font-size:12px;font-weight:900;color:#7E7694;letter-spacing:.5px;margin:2px 2px 10px">식단 시작하기</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
      <button onclick="setFlow('a');go('home')" style="border:none;border-radius:24px;background:#fff;padding:14px 10px;text-align:left;min-height:136px;box-shadow:0 14px 32px rgba(32,25,84,.07)">
        <div style="width:40px;height:40px;border-radius:16px;background:#EEF9F4;display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:12px">🥕</div>
        <div style="font-size:14px;font-weight:900;color:#171421;line-height:1.22;letter-spacing:-.5px">냉장고<br>활용</div>
        <div style="font-size:10px;color:#9A95AA;margin-top:7px;line-height:1.35">${fridgeCount?`${fridgeCount}가지 재료`:'있는 재료로'}</div>
      </button>
      <button onclick="setFlow('b');go('home')" style="border:none;border-radius:24px;background:#fff;padding:14px 10px;text-align:left;min-height:136px;box-shadow:0 14px 32px rgba(32,25,84,.07)">
        <div style="width:40px;height:40px;border-radius:16px;background:#F3F0FF;display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:12px">✨</div>
        <div style="font-size:14px;font-weight:900;color:#171421;line-height:1.22;letter-spacing:-.5px">추천<br>받기</div>
        <div style="font-size:10px;color:#9A95AA;margin-top:7px;line-height:1.35">뭐 먹을지<br>모를 때</div>
      </button>
      <button onclick="setFlow('c');go('home')" style="border:none;border-radius:24px;background:#fff;padding:14px 10px;text-align:left;min-height:136px;box-shadow:0 14px 32px rgba(32,25,84,.07)">
        <div style="width:40px;height:40px;border-radius:16px;background:#FFF2E9;display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:12px">🍽️</div>
        <div style="font-size:14px;font-weight:900;color:#171421;line-height:1.22;letter-spacing:-.5px">직접<br>선택</div>
        <div style="font-size:10px;color:#9A95AA;margin-top:7px;line-height:1.35">먹고 싶은<br>메뉴로</div>
      </button>
    </div>

    <div style="font-size:12px;font-weight:900;color:#7E7694;letter-spacing:.5px;margin:2px 2px 10px">오늘 요약</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
      <div style="background:#fff;border-radius:22px;padding:14px 10px;text-align:center;box-shadow:0 12px 28px rgba(32,25,84,.06)">
        <div style="font-size:20px;font-weight:900;color:#6D50F6">${todayCount}</div>
        <div style="font-size:10px;color:#9A95AA;font-weight:700;margin-top:3px">오늘 끼니</div>
      </div>
      <div style="background:#fff;border-radius:22px;padding:14px 10px;text-align:center;box-shadow:0 12px 28px rgba(32,25,84,.06)">
        <div style="font-size:20px;font-weight:900;color:#6D50F6">${cartCount}</div>
        <div style="font-size:10px;color:#9A95AA;font-weight:700;margin-top:3px">장보기</div>
      </div>
      <div style="background:#fff;border-radius:22px;padding:14px 10px;text-align:center;box-shadow:0 12px 28px rgba(32,25,84,.06)">
        <div style="font-size:20px;font-weight:900;color:#6D50F6">${S.people||1}</div>
        <div style="font-size:10px;color:#9A95AA;font-weight:700;margin-top:3px">인분</div>
      </div>
    </div>

    <div style="background:rgba(255,255,255,.76);border:1px solid rgba(124,92,255,.08);border-radius:24px;padding:16px;box-shadow:0 12px 28px rgba(32,25,84,.05)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:13px;font-weight:900;color:#171421">기본 설정</div>
        <button onclick="go('schedule')" style="border:none;background:#F1EDFF;color:#6D50F6;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:900">수정</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${[1,2,3,4].map(n=>`<button onclick="S.people=${n};render()" style="flex:1;border:none;border-radius:14px;padding:10px 0;background:${S.people===n?'#6D50F6':'#F4F2FA'};color:${S.people===n?'#fff':'#8A849A'};font-size:13px;font-weight:900">${n}인</button>`).join('')}
      </div>
      <div style="display:flex;gap:4px">
        ${["월","화","수","목","금","토","일"].map(d=>{
          const slots=S.schedule[d]||[];
          return`<div style="flex:1;text-align:center;padding:8px 0;border-radius:12px;background:${slots.length?'#F3F0FF':'#F7F7FA'}">
            <div style="font-size:10px;font-weight:900;color:${slots.length?'#6D50F6':'#C0BBCB'}">${d}</div>
            <div style="font-size:9px;color:#A19BAC;margin-top:2px">${slots.length?slots.length+'끼':'-'}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <button onclick="confirmResetMeal()" style="display:block;margin:18px auto 0;border:none;background:none;color:#B4AFC1;font-size:12px;font-weight:700;padding:8px">초기화 · 스케줄 재설정</button>
  </div>`;
}

// 식단 완성 후 홈
function rHomeDone(){
  const urgent=S.fridge.filter(i=>getDday(i.addedAt,i.expireDays)<=3&&getDday(i.addedAt,i.expireDays)>0).length;
  const expired=S.fridge.filter(i=>getDday(i.addedAt,i.expireDays)<=0).length;
  return`
  <div style="padding:80px 20px 14px;background:linear-gradient(160deg,#E8F5E9,#fff)">
    <div style="font-size:13px;color:var(--text-sub);margin-bottom:4px">이번 주 식단 완성 ✅</div>
    <div class="title" style="font-size:24px;margin-bottom:12px">잘 먹고 계신가요? 🍽️</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <span class="badge" style="background:#E8F5E9;color:#2e7d32">❄️ 냉장고 ${S.fridge.length}가지</span>
      
    </div>
  </div>
  <div style="padding:8px 20px 24px">
    ${urgent>0||expired>0?`<div style="background:#FFF0F0;border:1.5px solid #FFD0D0;border-radius:16px;padding:14px;margin-bottom:14px;display:flex;align-items:center;gap:12px" onclick="go('tab-fridge')">
      <div style="width:40px;height:40px;background:#FF6B6B;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">⚠️</div>
      <div style="flex:1">${expired>0?`<div style="font-size:13px;font-weight:700;color:var(--accent)">만료된 재료 ${expired}개</div>`:""} ${urgent>0?`<div style="font-size:13px;font-weight:600;color:var(--primary)">3일 이내 만료 ${urgent}개</div>`:""}</div>
      <span style="color:#ddd">›</span>
    </div>`:""}

    <button onclick="go('tab-meal')" style="width:100%;border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:16px;text-align:left;margin-bottom:10px;border:2px solid #A5D6A7;background:linear-gradient(135deg,#E8F5E9,#F0FFF6);box-shadow:var(--shadow)">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#2ECC71,#27AE60);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">📅</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:16px;color:var(--text)">이번 주 식단 보기</div>
        <div style="font-size:12px;color:var(--text-sub);margin-top:3px">${S.mealStartDate||""} 시작</div>
      </div>
      <span style="font-size:20px;color:#2ECC71">›</span>
    </button>

    ${S.cart.length>0?`<button onclick="go('bc-cart')" style="width:100%;border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:16px;text-align:left;margin-bottom:10px;border:2px solid #FFE0B2;background:linear-gradient(135deg,#FFF8EE,#FFF3E0);box-shadow:var(--shadow)">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,var(--primary),#E67E22);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">🛒</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:16px;color:var(--text)">장보기 목록 확인</div>
        <div style="font-size:12px;color:var(--text-sub);margin-top:3px">${S.cart.filter(i=>!i.checked).length}개 남음</div>
      </div>
      <span style="font-size:20px;color:var(--primary)">›</span>
    </button>`:""}

    <div style="background:#f8f8f8;border-radius:16px;padding:16px;margin-top:8px">
      <div style="font-size:13px;color:#888;margin-bottom:12px;font-weight:600">다음 주 식단 준비</div>
      <button onclick="confirmNewPlan()" style="width:100%;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:14px;font-weight:700;font-size:14px">🔄 새 식단 짜기</button>
    </div>

    <div style="display:flex;gap:8px;margin-top:10px">
      <button onclick="go('schedule')" style="flex:1;background:var(--card);border:none;border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:var(--shadow)">
        <span>⚙️</span><span style="font-size:12px;color:var(--text-sub);font-weight:600">스케줄</span>
      </button>
      <button onclick="S.people=S.people%4+1;render()" style="flex:1;background:var(--card);border:none;border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:var(--shadow)">
        <span>👥</span><span style="font-size:12px;color:var(--text-sub);font-weight:600">${S.people}인</span>
      </button>

    </div>
  </div>`;
}

function confirmNewPlan(){
  const el=document.createElement("div");
  el.id="confirm-popup";
  el.style.cssText="position:fixed;inset:0;background:rgba(26,26,46,0.7);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px";
  el.innerHTML=`<div style="background:#fff;border-radius:24px;padding:28px 24px;width:100%;max-width:360px;text-align:center">
    <div style="font-size:40px;margin-bottom:12px">🔄</div>
    <div style="font-weight:800;font-size:18px;margin-bottom:8px">새 식단을 짤까요?</div>
    <div style="font-size:13px;color:#888;margin-bottom:20px;line-height:1.6">현재 식단과 장보기 목록이<br>초기화돼요</div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('confirm-popup').remove()" style="flex:1;padding:13px;background:#f0f0f0;color:#666;border:none;border-radius:12px;font-weight:700">취소</button>
      <button onclick="document.getElementById('confirm-popup').remove();startNewPlan()" style="flex:1;padding:13px;background:var(--primary);color:#fff;border:none;border-radius:12px;font-weight:700">새로 짜기</button>
    </div>
  </div>`;
  document.body.appendChild(el);
}

function startNewPlan(){
  // 모든 상태 초기화
  S.mealPlan=null;
  S.mealStartDate=null;
  S.cart=[];
  S.bcMenus=[];
  S.bcStyles=[];
  S.bcSuggested=[];
  S.fridgeAdded=false;
  S.cartDone=false;
  localStorage.removeItem("wm_cart_done");
  setFlow(null);
  localStorage.removeItem("wm_meal");
  localStorage.removeItem("wm_meal_start");
  render();
}

// A플로우 홈
function rHomeA(){
  return`
  <div style="padding:0 20px 0;background:linear-gradient(160deg,#E8F5E9,#fff);position:fixed;top:0;left:0;right:0;max-width:480px;margin:0 auto;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#2ECC71,#3498DB);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px">❄️</div>
        <div>
          <div style="font-weight:800;font-size:17px">냉장고 재료로 짜기</div>
          <div style="font-size:11px;color:#aaa">A 플로우</div>
        </div>
      </div>
      <button onclick="S.mealPlan?confirmNewPlan():resetFlow()" style="background:#f5f5f5;border:none;border-radius:10px;padding:8px 12px;font-size:12px;color:#888;font-weight:600">✕ 초기화</button>
    </div>
  </div>
  <div style="padding:120px 20px 24px">
    <!-- 단계 표시 -->
    ${rFlowSteps(["냉장고 확인","스타일 선택","식단 생성","장보기"], S.mealPlan?3:S.bcStyles.length?1:0)}
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:0">
      <!-- 1단계: 냉장고 -->
      <button onclick="S.bcStyles.length>0?null:go('a-fridge')" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.fridge.length>0?"#2ECC71":"var(--border)"};background:${S.fridge.length>0?"#F0FFF6":"var(--card)"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:24px">${S.fridge.length>0?"✅":"❄️"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">냉장고 재료 확인</div>
          <div style="font-size:12px;color:var(--text-sub)">${S.fridge.length>0?`${S.fridge.length}가지 재료 입력됨`:"재료를 추가해주세요"}</div>
        </div>
        <span style="color:#aaa">›</span>
      </button>
      <!-- 2단계: 스타일 -->
      <button onclick="S.mealPlan?null:go('a-style')" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.bcStyles.length>0?"var(--primary)":"var(--border)"};background:${S.bcStyles.length>0?"var(--primary-pale)":"var(--card)"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow);opacity:${S.mealPlan?0.65:S.fridge.length>0?1:0.4};cursor:${S.mealPlan?"default":S.fridge.length>0?"pointer":"default"}">
        <span style="font-size:24px">${S.bcStyles.length>0?"✅":"🍽️"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">식사 스타일 선택</div>
          <div style="font-size:12px;color:var(--text-sub)">${S.bcStyles.length>0?S.bcStyles.join(", "):"한식/일식/중식/국가별"}</div>
        </div>
        <span style="color:#aaa">›</span>
      </button>
      <!-- 3단계: 식단 생성 -->
      <button onclick="${S.fridge.length>0&&S.bcStyles.length>0?"genAMeal()":"alert('냉장고 재료와 스타일을 먼저 선택해주세요')"}" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.mealPlan?"#2ECC71":"var(--border)"};background:${S.fridge.length>0&&S.bcStyles.length>0?"var(--primary)":"#f5f5f5"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:24px">${S.mealPlan?"✅":"✨"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;color:${S.fridge.length>0&&S.bcStyles.length>0?"#fff":"#aaa"}">AI 식단 생성</div>
          <div style="font-size:12px;color:${S.fridge.length>0&&S.bcStyles.length>0?"rgba(255,255,255,0.8)":"#bbb"}">${S.mealPlan?"식단이 생성됐어요":"재료와 스타일 선택 후 생성"}</div>
        </div>
        <span style="color:${S.fridge.length>0&&S.bcStyles.length>0?"rgba(255,255,255,0.7)":"#ccc"}">›</span>
      </button>
      ${S.mealPlan?`<button onclick="go('a-meal')" style="width:100%;padding:14px 18px;border-radius:16px;border:2px solid #2ECC71;background:#E8F5E9;display:flex;align-items:center;gap:14px;text-align:left">
        <span style="font-size:22px">📅</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px;color:#2e7d32">식단 보기</div></div>
        <span style="color:#2ECC71">›</span>
      </button>`:""}
    </div>
  </div>`;
}

// B플로우 홈
function rHomeB(){
  return`
  <div style="padding:0 20px 0;background:linear-gradient(160deg,#FFF8EE,#fff);position:fixed;top:0;left:0;right:0;max-width:480px;margin:0 auto;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0;padding:12px 0 12px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,var(--primary),#FF6B6B);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px">🤔</div>
        <div>
          <div style="font-weight:800;font-size:17px">뭘 먹을지 모르겠어요</div>
          <div style="font-size:11px;color:#aaa">B 플로우</div>
        </div>
      </div>
      <button onclick="S.mealPlan?confirmNewPlan():resetFlow()" style="background:#f5f5f5;border:none;border-radius:10px;padding:8px 12px;font-size:12px;color:#888;font-weight:600">✕ 초기화</button>
    </div>
  </div>
  <div style="padding:120px 20px 24px">
    ${rFlowSteps(["스타일 선택","메뉴 추천","장보기","식단 완성"], S.mealPlan?3:S.cart.length?2:S.bcSuggested.length?1:0)}
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:0">
      <button onclick="S.bcSuggested&&S.bcSuggested.length>0?null:(S.bcMode='b',go('bc-entry'))" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.bcStyles.length>0?"var(--primary)":"var(--border)"};background:${S.bcStyles.length>0?"#FFF8EE":"var(--card)"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow);opacity:${S.bcSuggested&&S.bcSuggested.length>0?0.65:1};cursor:${S.bcSuggested&&S.bcSuggested.length>0?'default':'pointer'}">
        <span style="font-size:24px">${S.bcStyles.length>0?"✅":"🍽️"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">스타일 선택 & 메뉴 추천</div>
          <div style="font-size:12px;color:var(--text-sub)">${S.bcStyles.length>0?S.bcStyles.join(", ")+" 선택됨":"한식/일식/중식/국가별 선택"}</div>
        </div>
        <span style="color:#aaa">›</span>
      </button>
      ${S.bcSuggested.length>0?`<button onclick="S.cart&&S.cart.length>0?null:go('b-suggest')" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid var(--primary);background:#FFF8EE;display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:24px">${S.cart.length>0?"✅":"🛒"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">메뉴 선택 & 장보기</div>
          <div style="font-size:12px;color:var(--text-sub)">${S.cart.length>0?`장보기 ${S.cart.length}개 항목`:"메뉴를 골라주세요"}</div>
        </div>
        <span style="color:#aaa">›</span>
      </button>`:""}
      ${S.cart.length>0?`<button onclick="go('bc-cart')" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid #2ECC71;background:#E8F5E9;display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:22px">🛒</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px">장보기 목록 확인</div></div>
        <span style="color:#aaa">›</span>
      </button>`:""}
      ${S.mealPlan?`<button onclick="go('bc-meal')" style="width:100%;padding:14px 18px;border-radius:16px;border:2px solid #2ECC71;background:#E8F5E9;display:flex;align-items:center;gap:14px;text-align:left">
        <span style="font-size:22px">📅</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px;color:#2e7d32">식단 보기</div></div>
        <span style="color:#2ECC71">›</span>
      </button>`:""}
    </div>
  </div>`;
}

// C플로우 홈
function rHomeC(){
  return`
  <div style="padding:0 20px 0;background:linear-gradient(160deg,#FCE4EC,#fff);position:fixed;top:0;left:0;right:0;max-width:480px;margin:0 auto;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--primary));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px">🍖</div>
        <div>
          <div style="font-weight:800;font-size:17px">먹고 싶은 메뉴가 있어요</div>
          <div style="font-size:11px;color:#aaa">C 플로우</div>
        </div>
      </div>
      <button onclick="S.mealPlan?confirmNewPlan():resetFlow()" style="background:#f5f5f5;border:none;border-radius:10px;padding:8px 12px;font-size:12px;color:#888;font-weight:600">✕ 초기화</button>
    </div>
  </div>
  <div style="padding:120px 20px 24px">
    ${rFlowSteps(["메뉴 입력","재료 분석","장보기","식단 완성"], S.mealPlan?3:S.cart.length?2:S.bcMenus.length?1:0)}
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:0">
      <button onclick="S.cart&&S.cart.length>0?null:(S.bcMode='c',go('bc-entry'))" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.bcMenus.length>0?"var(--accent)":"var(--border)"};background:${S.bcMenus.length>0?"#FFF0F5":"var(--card)"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:24px">${S.bcMenus.length>0?"✅":"🍖"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">메뉴 입력</div>
          <div style="font-size:12px;color:var(--text-sub)">${S.bcMenus.length>0?S.bcMenus.slice(0,3).join(", ")+(S.bcMenus.length>3?" 외 "+(S.bcMenus.length-3)+"개":""):"먹고 싶은 메뉴를 입력해주세요"}</div>
        </div>
        <span style="color:#aaa">›</span>
      </button>
      ${S.bcMenus.length>0?`<button onclick="genBCCart()" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid ${S.cart.length>0?"#2ECC71":"var(--accent)"};background:${S.cart.length>0?"#E8F5E9":"var(--accent)"};display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:24px">${S.cart.length>0?"✅":"🔍"}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;color:${S.cart.length>0?"#2e7d32":"#fff"}">재료 분석 & 장보기 생성</div>
          <div style="font-size:12px;color:${S.cart.length>0?"var(--text-sub)":"rgba(255,255,255,0.8)"}">${S.cart.length>0?`${S.cart.length}개 재료 분석됨`:"탭해서 재료 분석"}</div>
        </div>
        <span style="color:${S.cart.length>0?"#2ECC71":"rgba(255,255,255,0.7)"}">›</span>
      </button>`:""}
      ${S.cart.length>0?`<button onclick="S.mealPlan?null:go('bc-cart')" style="width:100%;padding:16px 18px;border-radius:16px;border:2px solid #2ECC71;background:#E8F5E9;display:flex;align-items:center;gap:14px;text-align:left;box-shadow:var(--shadow)">
        <span style="font-size:22px">🛒</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px">장보기 목록 확인</div></div>
        <span style="color:#aaa">›</span>
      </button>`:""}
      ${S.mealPlan?`<button onclick="go('bc-meal')" style="width:100%;padding:14px 18px;border-radius:16px;border:2px solid #2ECC71;background:#E8F5E9;display:flex;align-items:center;gap:14px;text-align:left">
        <span style="font-size:22px">📅</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px;color:#2e7d32">식단 보기</div></div>
        <span style="color:#2ECC71">›</span>
      </button>`:""}
    </div>
  </div>`;
}

// 플로우 단계 표시
