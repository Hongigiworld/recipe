# Weekly Meal clean 3-file split

이 버전은 기존 단일 `index.html`에서 인라인 CSS/JS를 분리한 1차 정리본입니다.

## 구조

```text
index.html
css/main.css
js/app.js
```

## 목적

- GitHub 웹 에디터에서 `index.html`을 가볍게 열기
- 누적된 `<style>` 블록을 `css/main.css`로 모으기
- 누적된 인라인 `<script>` 블록을 `js/app.js`로 모으기

## 주의

이건 완전한 모듈화가 아니라 안전한 1차 정리입니다.
다음 단계에서 `flowA.js`, `flowB.js`, `flowC.js`, `fridge.js`, `shopping.js`, `diary.js`, `data/menu-db.js`, `data/ingredient-db.js`로 의미별 분리하면 됩니다.
```
