---
marp: true
lang: fr-FR
title: Pourquoi ce site ?
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
  ul {
    margin: 0.5em 1em;
  }
  li {
    font-size: 0.6em;
    margin: 0 0 .2em 0;
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
</style>

# Pourquoi ce site ?

<p>
  L'idée derrière ce site découle du problèmatique du<br/>
  <span>&laquo; temps passé devant un écran &raquo;</span><br/>
  auquel tout le monde est confronté aujourd'hui.
<p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Interdire ou mieux introduire<br/>le numérique

<p>
  Si on est tous conscients de la<br/>
  nécessité de mieux modérer, voir réduire,<br/>
  notre consommation d'écrans.<br/>
  On peut aussi se poser la question :<br/>
  Quel type d'utilisation on en fait ?
<p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Une idée de <s>startup</s> <a class='link' href='https://www.jelancemonedtech.fr/edu-up' target='_blank'>EdTech</a> pour la Source

<p>
  Ce site a pour vocation d'ouvrir la voie à une participation numérique à travers l'expérimentation, l'apprentissage, l'expression artistique et la collaboration.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Développons une meilleure approche au monde numérique

<p>
  Les participants sont encouragés à créer du contenu, à produire du code et à expérimenter avec la technologie. Nous souhaitons une approche plus critique au numérique qui dissuade d'une consommation compulsive dictée par des algorithmes.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Soyons proactifs avec quelque chose de concret... le code

<p>
  En valorisant l'<a class='link' href='https://www.lemonde.fr/economie/article/2025/01/05/l-open-source-l-armee-de-l-ombre-du-logiciel-et-de-l-intelligence-artificielle_6482931_3234.html' target='_blank'>open source</a>, la transparence et un droit d'accès au <a class='link' href='https://www.lemonde.fr/blog/binaire/2023/06/09/le-logiciel-libre-lopen-source-et-letat-echange-avec-stefano-zacchiroli/' target='_blank'>code source</a>, ce site cherchera à remédier au problème de la surconsommation du numérique en questionnant son fonctionnement, en appréciant sa complexité et les compétences analytiques nécessaires pour le digérer véritablement.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Offrons l'excellence, pas l'abondance

<p>
  Ce site est fait maison pour être pleinement libre. C'est une toile vierge qui permet d'accéder à des possibilités quasi infinies. Mais en termes de complexité, il cache bien son jeu. On ne propose pas forcément la simplicité ici.
  <ul>
    <li>
      Ici on peut créer des visuels et des animations complexes sans limites à l'imagination. Nul besoin de se conformer aux contraintes techniques imposés par une plateforme qui usurpe votre créativité. En contre partis on ne peut pas toujours se réposer sur des outils d'automatisation qui facilitent la vie à moins de l'implémenter vous même.
    </li>
    <li>
      Ici, nous ne partageons pas de posts et de likes sur les réseaux sociaux, plutôt nous apprendrons à développer notre propre réseaux sociaux et à définir ensemble les règles pour le modérer.
    </li>
  </ul>
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<div class='logo-ape'></div>
