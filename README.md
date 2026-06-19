# Weekly Meal modular safe split

작동 확인된 3-file 버전에서 `js/app.js`를 순서 보존 방식으로 분리했습니다.

## 반영
- 홈 문구: `WEEKLY MEAL FLOW ...` → `WEEKLY MEAL`
- 2.2MB `app.js` 제거
- 가장 큰 DB 파일도 약 310KB 수준으로 분리

## 구조
```text
index.html
css/main.css
js/00-early-patches.js
...
js/19-flow-ui-runtime-patches.js
```

## 주의
`index.html`의 `<script>` 순서를 바꾸면 안 됩니다.

## JS 파일 크기
- `00-early-patches.js`: 33.5 KB
- `01-diary-ui-helpers.js`: 43.8 KB
- `02-shopping-links.js`: 40.5 KB
- `03-menu-nutrition-db.js`: 131.0 KB
- `04-recipe-ingredient-core.js`: 266.8 KB
- `05-state-router-splash.js`: 166.2 KB
- `06-home.js`: 32.3 KB
- `07-schedule-flow-entry.js`: 40.3 KB
- `08-flow-engine-meal.js`: 47.8 KB
- `09-fridge-cart-tabs.js`: 22.2 KB
- `10-db-audit-base.js`: 1.0 KB
- `11-menu-expansion-v7.js`: 331.5 KB
- `12-db-curation-overrides.js`: 68.9 KB
- `13-db-audit-and-meat.js`: 66.5 KB
- `14-portion-bflow-patches.js`: 51.9 KB
- `15-commercial-nutrition-patches.js`: 130.0 KB
- `16-nutrition-display-logic.js`: 128.7 KB
- `17-shopping-runtime-patches.js`: 17.1 KB
- `18a-clean-menu-schemas.js`: 414.2 KB
- `18b-clean-ingredient-db.js`: 93.4 KB
- `18c-clean-menu-ingredient-register.js`: 0.8 KB
- `19-flow-ui-runtime-patches.js`: 48.5 KB
