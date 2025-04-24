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
  p.small {
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

  .number {
    position: relative;
    display: inline;
    width: 30px;
    height: 30px;
    margin: 0 1.5rem 0 0;
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
  .mask-bg {
    height: inherit;
  }
  .tree {
    text-align: left;
  }
</style>

# Dans quel but ?

<p>-`♡´-</p>
<p>
  À la différence des réseaux sociaux qui propulsent les élèves dans un monde numérique en dehors de l'enceinte de l'école,<br/>
  <strong>ce site leur propose un terrain de jeu qui reste ancré dedans</strong>.<br/>
  C'est une cour de récréation numérique, un intranet,<br/>
  un recueil du best of web ... ou ce que vous voulez qu'il soit.<br/>
  On y participe à travers l'apprentissage du code.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<style>
  .split.split-1 {
    height: 195px;
  }
  .split.split-2 {
    height: 230px;
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
    mask-size: 95%;
    mask-position: right center;
  }
</style>

![bg opacity](/assets/img/gradient.jpg)

## Un espace dédié pour coder

<div class='split split-1'>
  <div class='screen-20 screen-bg mask-bg left-bg'>
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
<div class='split split-2'>
  <div class='screen-80'>
    <p class='align-left'>
      Si chacun de ces espaces joue un rôle important, ils ne sont pas forcément
      le lieu approprié pour un travail d'expérimentation avec le code par des élèves.
    </p>
  </div>
  <div class='screen-20 screen-bg mask-bg right-bg'>
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
</p>
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
</p>
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
  Les élèves coderont à tour de rôle sur un seul écran mais on partagera à l'aide d'un projecteur le code source.
  L'enjeu ici c'est de travailler en équipe :
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
      Pour aboutir à des projets plus complexes où le code fonctionel prime d'avantage. Par exemple on pourrait créer
      <a class='link' href='https://codepen.io/HunorMarton/pen/PoGbgqj' target='_blank'>un calendrier de l'avent</a> dédié aux valeurs de la source.
    </li>
  </ul>
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## L'opportunité d'acquérir un savoir-faire de base pour aller plus loin

<p class="small">
  Si ce site a pour objectif d'ouvrir la voie à l'apprentissage du code, il n'a pas forcément pour objectif de transformer chaque élève
  en développeur(eusse). En revanche, il vise à réduire la barrière entre codeurs et non-codeurs. Cela dit, il n'est pas exclu qu'il y ait
  des étudiants qui auront l'envie et les réelles compétences pour aller plus loin. Ce site leur permettra d'avoir accès à des ressources de
  cloud computing de manière sécurisée et contrôlée pour donner suite à leurs idées.
</p>

---

## Pour soulever des problèmes qui fachent

<p class="small">
  Pour les enfants, il n'y a pas de doute que l'<strong>utilisation solitaire et sans limites</strong> des écrans tactiles,
  des réseaux sociaux et bientôt le recours aux assistants de l'IA qui leur seront dédiés, ont déjà et auront d'avantage des impacts néfastes
  sur leur développement. Un enfant a besoin de grandir en tant qu'enfant en jouant et en apprenant avec d'autres enfants. On nous a promis
  un monde plus connecté à travers les réseaux sociaux mais on constate qu'il est de plus en plus divisé et déconnecté en termes de liens sociaux.
</p>
<p class="small">
  C'est pourquoi ce site cherche avant tout d'être un forum collectif où on cherchera d'aboutir à un consensus de groupe.
  On veut soulèver les problèmes liées à la technologie pour en parler et les étudier ensemble. Une idée d'atelier serait que des élèves mènent
  l'enquête pour vérifier l'exactitude d'informations sur les réseaux sociaux, le web et les médias autour d'un sujet d'actualité (info ou intox) -
  <a class='link' href='https://www.clemi.fr/familles/activites-en-famille/mission-fact-checking' target='_blank'>Mission fact-checking</a>
</p>

---

![bg opacity](/assets/img/gradient.jpg)

## Pour sortir des malaises de l'ombre

<p class="small">
  Si ce forum est l'un des moyens de lutter contre le harcèlement sur les reseaux sociaux, il est aussi le lieu pour mettre en évidence l'isolement
  face aux méandres de la technologie. Quels sont les signes d'un effacement derrière les écrans ? On voudrait formuler concrêtement les enjeux du
  <strong>&laquo; big data &raquo;</strong> et soulever la vulnérabilité de l'estime de soi face à des normes irréalistes. Un exemple concret serait
  de parler de la polémique autour des <strong>&laquo; influenceurs &raquo;</strong> et de <strong>fameify</strong> qui est une plateforme IA
  pour générer des <strong>&laquo; followers &raquo;</strong> virtuels.
</p>
<p class="small">
  Au-delà des mise en gardes, il est également important de dissiper certaines idées reçues. Par exemple, le <strong>&laquo; piratage &raquo;</strong>
  est généralement considéré comme illégal. Mais <strong>&laquo; hacker &raquo;</strong> est parfois un procédé légitime, particulièrement
  apprécié dans le domaine de la sécurité informatique. Questionner les différentes <a class='link'
  href='https://www.arsouyes.org/articles/2020/32_Chapeaux/' target='_blank'>casquettes que portent les hackeurs</a> peut aboutir à une discussion
  importante sur l'éthique et la morale.
</p>
<p class="small">Quoi qu'il en soit, on ne pourra jamais complètement empêcher les élèves d'explorer le monde numérique d'eux-mêmes.
  On ne peut que mieux les guider dans leurs choix. Plutôt que d'appréhender des techniques de piratage dans l'ombre ou de naviguer sur
  le dark web en projet Tor, nous préférons que leur découverte se fasse dans un climat de confiance et de respect mutuel.
</p>

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

<!-- <div class='screen-100 screen-bg center-bg-2'></div> -->

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

<div class='logo-ape'></div>
