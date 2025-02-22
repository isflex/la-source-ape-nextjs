---
marp: true
lang: fr-FR
title: Dans quel but ?
description: Développons une meilleure approche au monde numérique
theme: uncover
transition: fade
paginate: true
_paginate: false
---

<script type="text/javascript">
  function addRouteListeners() {
    document.querySelector('#squirrelLink').addEventListener("click", (e) => {
      e.preventDefault()
      window.parent.postMessage('go2routeSquirrel', '*')
    })
    document.querySelector('#terminusLink').addEventListener("click", (e) => {
      e.preventDefault()
      window.parent.postMessage('go2routeTerminus', '*')
    })
  }
  window.addEventListener('DOMContentLoaded', addRouteListeners)
</script>

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
  }
  h2 {
    color: #25465f;
    font-size: 1.2em;
  }
  p {
    max-width: 100%;
    font-size: 0.8em;
    margin: 0 auto;
  }
  p.align-left {
    text-align: left;
  }
  P.small {
    font-size: 0.6em;
  }
  ul {
    margin: 0.5em 1em;
  }
  li {
    font-size: 0.6em;
    margin: 0 0 .2em 0;
  }
  ul > li > ul > li {
    font-size: 0.6rem;
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

# Dans quel but ?

<p>-`♡´-</p>
<p>
  À la différence des réseaux sociaux<br/>
  qui propulsent les élèves dans un monde numérique<br/>
  en dehors de l'enceinte de l'école, ce site leur propose<br/>
  un terrain de jeu qui reste ancré dedans.<br/>
  C'est une cour de récréation numérique, un intranet,<br/>
  un recueil du best of web ... ou ce que vous voulez qu'il soit.<br/>
  On y participe à travers l'apprentissage du code.
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

## Un espace dédié pour coder
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
