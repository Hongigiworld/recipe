# Weekly Meal semantic safe split v3

기존 작동하던 3파일 버전을 기준으로 JS를 안전한 큰 단위로 분리했습니다.

- `index.html`
- `css/main.css`
- `js/app-01.js` ~ `js/app-11.js`

변경 포함:
- 홈 문구 `WEEKLY MEAL FLOW` / 설명문 제거 → `WEEKLY MEAL`만 표시
- 큰 DB 블록은 별도 파일로 분리
- 각 JS 파일 `node --check` 통과

주의: `index.html`의 script 순서 변경 금지.
