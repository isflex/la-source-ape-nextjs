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

# Pourquoi ce site ?

<p>
  L'idée derrière ce site découle du problèmatique du
</p>
<p>
  <strong>&laquo; temps passé devant un écran &raquo;</strong>
</p>
<p>
  auquel tout le monde est confronté aujourd'hui.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Interdire ou mieux introduire<br/>le numérique

<p>
  Si on est tous conscients de la nécessité de mieux modérer, voir réduire, notre consommation d'écrans.
</p>
<p>
  On peut aussi se poser la question :
</p>
<p>
  <strong>&laquo; Quel type d'utilisation on en fait ? &raquo;</strong>
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Développons une meilleure approche au monde numérique

<p>
  Ce site vise à ouvrir la voie à la participation numérique grâce à une plateforme collaborative axée sur le partage, l'apprentissage et l'entraide.
</p>
<p>
  L'un des éléments est le <a class='link' href='/web-app' target='_blank'>web app</a> qui permet aux parents d'élèves d'organiser et de participer a des activites d'entraide autour de leur école :<br/>covoiturage, pedibus (accompagnement a pied), babysitting, soutien aux devoirs, et d'autres activités si besoin.
</p>
<p>
  Les élèves de l'école peuvent participer avec l'accord de leur parents. L'idée étant qu'on promeut le rôle des parenrs à guider dans leurs choix L'utilisation requière les parents ont aussi la responsabilité d'accompagner leur enfant(s) dans l'utilisation et 
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Développons une meilleure approche au monde numérique

<p>
  Les participants sont encouragés à créer du contenu, à produire du code et à expérimenter avec les technologies.
  Nous souhaitons une approche plus critique au numérique qui dissuade d'une consommation compulsive des écrans tactiles dictée par des algorithmes.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Soyons proactifs avec quelque chose de concret... le code

<p>
  En valorisant l'<a class='link' href='https://www.lemonde.fr/economie/article/2025/01/05/l-open-source-l-armee-de-l-ombre-du-logiciel-et-de-l-intelligence-artificielle_6482931_3234.html' target='_blank'>open source</a>, la transparence et un droit d'accès au <a class='link' href='https://www.lemonde.fr/blog/binaire/2023/06/09/le-logiciel-libre-lopen-source-et-letat-echange-avec-stefano-zacchiroli/' target='_blank'>code source</a>,
  ce site cherchera à remédier au problème de la surconsommation du numérique en questionnant son fonctionnement,
  en appréciant sa complexité et les compétences analytiques nécessaires pour le digérer véritablement.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<div class='logo-ape'></div>
