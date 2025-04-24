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
  Si je devais citer l'outil le plus précieux, ce serait sans doute sa facilité d'utilisation pour déployer un projet mener en groupe.
  C'est-à-dire mettre en ligne des modifications apportées au site lorsque celles-ci sont effectuées par plusieurs personnes.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<style>
  .split {
    height: 195px;
  }
  .left-bg {
    /*
    background-image: url('/assets/svg/fragile-box.svg');
    background-size: 80%;
    background-position: left center;
    */
    background-color: #25465f;
    mask-repeat: no-repeat;
    mask-image: url('/assets/svg/fragile-box.svg');
    mask-size: 80%;
    mask-position: left center;
  }
  .right-bg {
    /*
    background-image: url('/assets/svg/box-fireworks.svg');
    background-size: 80%;
    background-position: right center;
    */
    background-color: #25465f;
    mask-repeat: no-repeat;
    mask-image: url('/assets/svg/box-fireworks.svg');
    mask-size: 80%;
    mask-position: right center;
  }
</style>

![bg opacity](/assets/img/gradient.jpg)

## C'est si simple
<br/>
<div class='split'>
  <div class='screen-20 screen-bg left-bg'>
  </div>
  <div class='screen-80'>
    <p class='align-left'>
      Ce site est conçu pour cohabiter avec les espaces numériques existants de l'école :<br/>
      <ul>
        <li>
          la vitrine publique <a class='link' href='https://ecolelasource.org/'>https://ecolelasource.org</a>
        </li>
        <li>
          l'interface administrative <a class='link' href='https://www.ecoledirecte.com/'>https://www.ecoledirecte.com</a>
        </li>
      </ul>
    </p>
  </div>
</div>
<div class='split'>
  <div class='screen-80'>
    <p class='align-left'>
      Si chacun de ces espaces joue un rôle important, ils ne sont pas forcément
      le lieu approprié pour un travail d'expérimentation avec le code par des élèves.
    </p>
  </div>
  <div class='screen-20 screen-bg right-bg'>
  </div>
</div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<style>
  .center-bg {
    /*
    background-image: url('/assets/svg/code.svg'), url('/assets/svg/pair-programming.svg'), url('/assets/svg/brilliant-star.svg');
    background-size: 7%, 6%, 6%;
    background-position: 20% center, center center, 80% center;
    */
    height: 120px;
    background-color: #25465f;
    mask-repeat: no-repeat;
    mask-image: url('/assets/svg/code.svg'), url('/assets/svg/pair-programming.svg'), url('/assets/svg/brilliant-star.svg');
    mask-size: 7%, 6%, 6%;
    mask-position: 20% center, center center, 80% center;
  }
</style>

## Une plateforme de formation

<p>
  On recherche activement des subventions pour permettre à ce que ce site puisse s'accompagner d'ateliers éducatifs,
  ludiques et innovants conçus spécialement pour les élèves en fonction de leur niveaux. On souhaite proposer des ateliers
  sous forme de <a class='link' href='https://www.bearstudio.fr/blog/developpement/peer-programming' target='_blank'>pair-programming</a>
  où un tuteur accompagnera des élèves un à un, en binôme devant un seul écran.
<p>
<div class='screen-100 screen-bg center-bg'>
</div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Des ateliers accompagnés

<p>ʕ·ᴥ·ʔ</p>
<p>
  Dans un premier temps, les objectifs des ateliers seront ultra simples pour limiter la faitigue et pour permettre
  l'acquisition de connaissances par étapes. L'accent sera mise à la familiarisation du terminale bash et l'inspection
  du console navigateur. Voici quelques exemples de jeux éducatifs bash.
<p>
<ul>
  <li>
    Pour les élèves à partir de 8 ans ˗ˏˋ★ᯓ <span class='link' id="squirrelLink">écureuil</span> ᯓ★ˎˊ˗
  </li>
  <li>
    Pour les élèves à partir de 12 ans ˗ˏˋ★ᯓ <span class='link' id="terminusLink">terminus</span> ᯓ★ˎˊ˗
  </li>
</ul>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Des tutoriels participatifs

<p>
  Avec des élèves plus âgés et plus autonomes, les ateliers s'orienteront vers des mini-projets ménés en groupe.
  Les élèves coderont à tour de rôle, en binôme avec le tuteur, sur un seul écran. Mais on partagera à l'aide d'un
  projecteur le code source pour que tout le monde puisse suivre en même temps. L'enjeu ici c'est de travailler en équipe :
  <ul>
    <li>
      Sur des idées <a class='link' href='https://scratch.mit.edu/projects/editor' target='_blank'>scratch</a> au début.
    </li>
    <li>
      Puis d'aller plus loin avec l'intégration d'animations plus complexes à travers
      <a class='link' href='https://examples.motion.dev/react/path-drawing' target='_blank'>motion.dev</a> et
      <a class='link' href='https://www.figma.com/board/lAF3mWnC9bQk3KNM0R7mqV/Timeline-template-in-FigJam-(Community)?node-id=0-1&p=f&t=lBI0u3EYR55xsl4j-0' target='_blank'>figma</a>.
    </li>
    <li>
      Pour aboutir à projets plus complexes où le code fonctionel prime d'avantage comme avec des
      <a class='link' href='https://webcontainer-tutorial.pages.dev/1-webcontainer-api/1-express-app/1-what-we-are-building/' target='_blank'>stackblitz</a>.
    </li>
  </ul>
<p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## L'opportunité d'acquérir un savoir-faire de base ou d'aller plus loin

<p class="small">
  Si ce site a pour objectif d'ouvrir la voie à l'apprentissage du code, il n'a pas forcément pour objectif de transformer chaque élève
  en développeur(eusse). En revanche, il vise à réduire la barrière entre codeurs et non-codeurs. Cela dit, il n'est pas exclu qu'il y ait
  des étudiants qui ont l'envie et les réelles compétences pour aller plus loin. Ce site leur permettra d'avoir accès à des ressources de
  cloud computing de manière sécurisée et contrôlée pour donner suite à leurs idées. En tout cas, nous ne pourrons pas les empêcher.
  Plutôt que d'apprendre à hacker dans l’ombre, de surfer sur le dark web dans un projet Tor, nous préférons qu’il se découvre dans un climat
  de confiance et de respect mutuel.
<p>

---

<style>
  .center-bg-2 {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: hsl(206, 44%, 26%, 0.2);
    mask-repeat: no-repeat;
    mask-image: url(/assets/svg/code-fork.svg);
    mask-size: 30%;
    mask-position: 50% 50%;
  }
</style>

## Si on devait résumer les objectifs ce serait :

<ul>
  <li>
    Valoriser le codage comme une forme d'art et pas seulement comme produit de masse.
  </li>
  <li>
    Promouvoir une analyse critique des technologies de demain en étant :
    <ul>
      <li>
        à l'aise devant une console pour lancer des commandes de base.
      </li>
      <li>
        être capable d'inspecter le DOM dans un navigateur, tester et debugger.
      </li>
      <li>
        savoir paramétrer l'IA dans un IDE pour expliquer le code, proposer des modifications et en juger de leur pertinence.
      </li>
      <li>
        maîtriser des opérations GIT pour accéder à un code source et contribuer de manière collaborative.
      </li>
    </ul>
  </li>
  <li>
    Défendre l'accès au code source au même titre que l'accès aux ressources d'une bibliothèque.
  </li>
</ul>

<div class='screen-100 screen-bg center-bg-2'></div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

<div class='logo-ape'></div>
