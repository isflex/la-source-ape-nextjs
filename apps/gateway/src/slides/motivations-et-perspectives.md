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
    font-size: 1.1em;
    letter-spacing: 3px;
  }
  h2 {
    color: #25465f;
    font-size: 0.8em;
    letter-spacing: 2px;
  }
  p {
    max-width: 100%;
    font-size: 0.6em;
    letter-spacing: 0.03em;
    margin: 0 auto;
  }
  p:not(first-of-type):not(.paddingless) {
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
  p.smallest {
    font-size: 0.4em;
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
    margin: 0.3rem 1rem;
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
    height: 35%;
    background-image: url('/logo/ape/ape_la_source_logo_2.svg');
    background-repeat: no-repeat;
    background-size: 18%;
    background-position: center center, 50%, 50%;
  }
  .logo-flexiness {
    width: 100%;
    height: 25%;
    background-image: url('/logo/filled/rectangle/logo_flexiness_2.svg');
    background-repeat: no-repeat;
    background-size: 20.5%;
    background-position: center center, 50%, 50%;
  }

  .infoBox {
    position: relative;
    font-size: 0.6em;
    letter-spacing: 0.05em;
    background-color: #402d6c;
    border-radius: 5px;
    color: #fff;
    text-align: left;
    padding: 0.25rem 0.5rem;
    width: 100%;
    margin: 0.25rem auto;
  }

  .infoBox.boxed {
    padding: 0.3rem 0.25rem 0.25rem 1.25rem;
    max-width: 50vw;
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
    margin: 0 1.15rem 0 0;
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
</style>

# Motivations et Perspectives

<p class='smallest'>
Ce site propose des outils pratiques pour faciliter et optimiser les démarches qui grâce à
l'implication des parents, enrichissent la vie scolaire.
</p>

<p class='smallest'>
À « La Source École Nouvelle », nous valorisons le simple fait de pouvoir accompagner nos enfants à la piscine pour aider l'enseignant [<a class='link' href='/newsletter/2026/06/02/utiliser-le-planning' target='_blank'>planning piscine</a>]. On est un peu fière de pouvoir venir présenter notre métiers aux enfants [<a class='link' href='/decouverte-des-metiers' target='_blank'>découverte des métiers</a>]. Nous croyons que ces petits gestes contribuent à tisser des liens et à enrichir la vie scolaire.
</p>

<p class='smallest'>
Malheureusement, l'implication des parents reste l'exception dans le système éducatif. De nombreuses écoles ne disposent pas de la structure organisationnelle nécessaire pour permettre aux représentants des parents de participer aux discussions constructives issues des conseils de classe et des réunions d'échange et d'information. La bienveillance générale dont bénéficie notre école est une chance, une ressource précieuse à préserver, cultiver et à partager.
</p>

<p class='smallest'>
Ce site web vise à démocratiser les atouts dont nous bénéficions dans le secteur semi-privé pour les exporter vers d'autres écoles. En modélisant certains aspects de l'éducation nouvelle dont nous nous sommes imprégnés, il vise à les rationaliser pour que d'autres établissements puissent les adoptés facilement.
</p>

<p class='smallest'>
Ce site web est donc destiné à être déployé ailleurs sous forme de solution logicielle en tant que service (SaaS). Dans un premier temps, son objectif est d'aider les écoles qui ne disposent pas d'une association de parents d'élèves (APE) à en créer une. Il préconise ensuite de promouvoir les valeurs de l'éducation nouvelle en proposant des conseils et des méthodologies adaptables à toute école.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

<div class='logo-ape'></div>

<p class="tiny">
  Plateforme développée en partenariat avec l'agence web
</p>

<a href='https://www.flexiness.com' target='_blank'>
  <div class='logo-flexiness'></div>
</a>

<p class="tiny paddingless">
  Flexiness - 46 rue Vital, 75116 Paris<br/>
  <a class='link' href='mailto:hello@flexiness.com'>hello@flexiness.com</a>
</p>
