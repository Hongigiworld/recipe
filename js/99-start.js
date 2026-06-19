
// Final startup: run only after every split script has loaded.
(function(){
  function showStartError(e){
    console.error("WeeklyMeal start failed", e);
    var app=document.getElementById("app");
    if(!app) return;
    var msg=(e && (e.message || String(e))) || "unknown error";
    app.innerHTML='<div style="padding:28px;font-family:Pretendard,Arial,sans-serif"><h2>앱 시작 오류</h2><p>시작 중 오류가 발생했습니다.</p><div style="margin:12px 0;padding:10px;border-radius:10px;background:#f5f5f5;color:#555;font-size:12px;word-break:break-all">'+msg.replace(/[<>&]/g,function(c){return {"<":"&lt;",">":"&gt;","&":"&amp;"}[c];})+'</div><button onclick="localStorage.clear();location.reload()" style="padding:14px 18px;border:0;border-radius:12px;background:#4B3FD8;color:white;font-weight:800">저장데이터 초기화 후 재시작</button></div>';
  }
  try{
    if(typeof S === "undefined") throw new Error("S state is not defined");
    if(typeof render !== "function") throw new Error("render function is not defined");
    S.screen="splash";
    render();
  }catch(e){
    showStartError(e);
  }
})();
