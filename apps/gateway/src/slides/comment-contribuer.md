---
marp: true
lang: fr-FR
title: Comment contribuer ?
description: Développons une meilleure approche au monde numérique
theme: uncover
transition: fade
paginate: true
_paginate: false
---

<style>
  @font-face {
    font-family: Commissioner;
    src: url(/assets/fonts/commissioner-v1.0/static/ttfs/Commissioner-Regular.ttf), url(https://after-school.flexiness.com:3992/assets/fonts/commissioner-v1.0/static/ttfs/Commissioner-Regular.ttf);
    font-weight: 400;
    font-display: swap
  }
  @keyframes slidingLink {
    50% {
      left: 100%;
      right: 0;
    }
    50.01% {
      left: 0;
      right: 100%;
    }
  }
  section {
    margin: 0;
    background: linear-gradient(180deg, rgb(117 81 194), rgb(255 255 255));
    font-family: Commissioner,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
  }
  h1 {
    color: #25465f;
    font-size: 1.4em;
    letter-spacing: 3px;
  }
  h2 {
    color: #25465f;
    font-size: 1.2em;
    letter-spacing: 2px;
  }
  p {
    max-width: 100%;
    font-size: 0.8em;
    letter-spacing: 0.03em;
    margin: 0 auto;
  }
  p:not(first-of-type) {
    margin: 0.5rem auto 0;
  }
  p.align-left {
    text-align: left;
  }
  P.small {
    font-size: 0.6em;
  }
  p.smaller {
    font-size: 0.5em;
  }
  p.tiny {
    font-size: 0.5rem;
  }
  p.tiniest {
    font-size: 0.4rem;
  }
  ul {
    margin: 0.5em 1em;
  }
  li {
    font-size: 0.6em;
    letter-spacing: 0.05em;
    margin: 0 0 .2em 0;
  }
  ul > li > ul > li {
    font-size: 0.6rem;
  }
  ul.smaller {
    margin: 0.25em 1em;
  }
  ul.smaller li {
    font-size: 0.5em;
  }
  ul.tiny {
    margin: 0.5rem 1rem;
  }
  ul.tiny li {
    font-size: 0.5rem;
  }
  s {
    text-decoration-line: line-through;
    text-decoration-style: solid;
    text-decoration-color: var(--flex-link, #c8007b);
    text-decoration-thickness: 0.1em;
    text-decoration-skip-ink: none;
  }
  .link:not([disabled]) {
    cursor: pointer;
    position: relative;
    font-size: inherit;
    font-weight: inherit;
    text-decoration: none;
    color: var(--flex-link, #c8007b);
    padding-bottom: 0.1em;
    border-bottom: solid 0.1em currentColor;
    box-decoration-break: clone;
  }
  .link:not([disabled]) > * {
    font-size: inherit;
    font-weight: inherit;
  }
  .link:not([disabled]):hover {
    opacity: 0.9;
    color: var(--flex-link-hover, #c8007b);
  }
  @media screen and (min-width: 720px) {
    .link:not([disabled]):not(.isStatic) {
      display: inline-flex;
      border-bottom-width: 0;
    }
    .link:not([disabled]):not(.isStatic)::after {
      content: "";
      background: currentcolor;
      height: 0.1em;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .link:not([disabled]):not(.isStatic):hover::after {
      animation: slidingLink 1s cubic-bezier(0.654, 0.045, 0.355, 1);
    }
  }
  .logo-ape {
    width: 100%;
    height: 100%;
    background-image: url('/logo/ape/ape_la_source_logo_1.svg');
    background-repeat: no-repeat;
    background-size: 25%;
    background-position: center center, 50%, 50%;
  }

  .infoBox {
    position: relative;
    font-size: 0.3rem;
    letter-spacing: 0.05em;
    background-color: #402d6c;
    border-radius: 5px;
    color: #fff;
    text-align: left;
    padding: 0.3rem 0.25rem 0.25rem 1.25rem;
    width: 100%;
    max-width: 50vw;
    margin: 0.25rem auto;
  }

  li .infoBox {
    transform: translate(-18px, 0);
  }

  .infoBox > span::before {
    position: absolute;
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    content: '';
    top: 0.25rem;
    left: 0.25rem;
    vertical-align: middle;
  }

  .infoBox > span::before {
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: 50% 50%;
    background-color: transparent;
  }

  .infoBox .link {
    color: #fff;
  }

  .infoBox .link:not([disabled]):hover {
    opacity: 0.9;
    color: #fff;
  }

  .infoBox.info > span::before {
    background-image: url('/assets/svg/info-circle.svg');
  }
  .number:before {
    position: absolute;
    width: 38px;
    height: 38px;
    content: ' ';
    left: 0;
    top: 2px;
    background-image: url('/assets/svg/empty-circle.svg');
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: 50% 50%;
    background-color: transparent;
  }
  .number:after {
    position: absolute;
    width: 30px;
    height: 30px;
    font-size: 26px;
    font-weight: bold;
    content: attr(number);
    left: 12.5px;
    top: 1.5px;
    color: #c8007b;
  }
  .tiny .number:before {
    width: 32px;
    height: 32px;
    left: 0;
    top: -2px;
  }
  .tiny .number:after {
    width: 15px;
    height: 15px;
    font-size: 20px;
    left: 11px;
    top: -1px;
  }
  .tiny .number {
    margin: 0 1.25rem 0 0;
  }
  .tiniest .number:before {
    width: 28px;
    height: 28px;
    left: 0;
    top: -2px;
  }
  .tiniest .number:after {
    width: 15px;
    height: 15px;
    font-size: 16px;
    left: 9.5px;
    top: -1px;
  }
  .tiniest .number {
    margin: 0 1rem 0 0;
  }

  .split {
    height: 195px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .screen-100 {
    width: 100%;
  }
  .screen-80 {
    width: 80%;
  }
  .screen-60 {
    width: 60%;
  }
  .screen-50 {
    width: 50%;
  }
  .screen-30 {
    width: 30%;
  }
  .screen-20 {
    width: 20%;
  }
  .screen-bg {
    height: calc(100vh - 720px);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center center;
  }
  .tree {
    text-align: left;
  }
</style>

# Comment contribuer ?

<p>-`<svg style="width:28px;height:28px"  viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.3523 15.4825L18.5074 0.642968C17.6555 -0.214323 16.267 -0.214323 15.4086 0.642968L12.3322 3.72475L16.2436 7.63089C17.1562 7.32707 18.1972 7.53103 18.9164 8.2566C19.6473 8.98747 19.8513 10.0381 19.5421 10.9453L23.3049 14.7134C24.2174 14.3979 25.2691 14.6029 25.9936 15.3327C27.0177 16.3504 27.0177 17.9991 25.9936 19.0179C24.9759 20.0356 23.3325 20.0356 22.3137 19.0179C21.5499 18.2541 21.3566 17.1259 21.7379 16.191L18.2132 12.6833V21.9286C18.4617 22.0508 18.6997 22.2165 18.9047 22.4215C19.9171 23.4456 19.9171 25.088 18.9047 26.1067C17.887 27.1244 16.2319 27.1244 15.2089 26.1067C14.1912 25.089 14.1912 23.4456 15.2089 22.4215C15.4692 22.1666 15.7571 21.9785 16.0662 21.8521V12.5186C15.7624 12.3858 15.4681 12.2031 15.2142 11.9492C14.4451 11.1801 14.2571 10.0519 14.6555 9.10539L10.8152 5.24386L0.635 15.4187C-0.211667 16.2707 -0.211667 17.6592 0.635 18.5175L15.4798 33.357C16.3371 34.2143 17.7203 34.2143 18.5786 33.357L33.3512 18.5844C34.2085 17.7325 34.2085 16.344 33.3512 15.4857L33.3523 15.4825Z" fill="black"/>
</svg>´-</p>
<p>
  Le choix d'utiliser le framework cloud Amplify AWS s'est basé sur le fait que tous les services et fonctionnalités en feront, à mon avis, un outil pédagogique fantastique pour appréhender le code.
</p>
<p>
  L’outil le plus précieux est sans doute la facilité des déploiements pour un projet mener en groupe. La mise en ligne des modifications se résume à quelques opérations <strong>git</strong>. C'est l'équivalent du <strong>&laquo; sauvegarde &raquo;</strong> dans l'univers du code.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## 🤝 Contribuer c'est aussi simple que ça

1. Forkez le dépôt de code: <a class='link' href='https://github.com/isflex/la-source-ape-nextjs.git' target='_blank'>https://github.com/isflex/la-source-ape-nextjs</a><br/><br/>
2. Créez votre branche :
```bash
git checkout -b my-new-feature
```
3. Validez vos modifications :
```bash
git commit -m 'Add some feature'
```
4. Publiez sur la branche :
```bash
git push origin my-new-feature
```

<p class="smaller">
  <strong>Une fois votre demande d'extraction fusionnée</strong>, vous pouvez supprimer votre branche en toute sécurité.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->
---

## Toutes les informations détaillés sont dans le <a class='link' href='https://github.com/isflex/la-source-ape-nextjs/blob/main/README.md' target='_blank'>README</a>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Pour toutes vos questions et de l'aide, rejoignez le groupe de discussion <a class='link' href='https://chat.whatsapp.com/HqVx1dpEQM8Bk3XrDDaXtI' target='_blank'>WhatsApp</a>.

<div style="width: 100%; padding: 5px 0; display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: start;">
  <div style="width: 210px; margin: 0 auto; border-radius: 5px; padding: 5px 0; background-color: #F9423A; display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center;">
    <img src="/assets/img/qr-code-whatsapp.jpg" style="position: relative; width: 200px; height: 200px;" />
  </div>
</div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<div class='logo-ape'></div>
