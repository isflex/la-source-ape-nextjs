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

# Qu'est-ce que c'est ?

## C'est une boîte à outils numérique dédier aux parents d'élèves.

<div class="infoBox info">
  🏆 Nous proposons des applications pour faciliter la vie communautaire autour de votre école.
</div>
<p>
  Par exemple, l'application <a class='link' href='/web-app' target='_blank'>Chaperons&Co</a> permet aux parents d'organiser et de participer à des activités d'entraide autour de leur école : covoiturage, pédibus (accompagnement a pied), garde d'enfants, aide aux devoirs et autres activités selon les besoins.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

# Pourquoi ce site ?

## Nous souhaitons proposer une approche différente du monde numérique, axée sur le partage, l'apprentissage et l'entraide.

Pour encourager la bienveillance et les échanges entre niveaux scolaires, les parents peuvent autoriser leur enfant scolarisé à s'occuper d'autres enfants de l'école grace à l'application <a class='link' href='/web-app' target='_blank'>Chaperons&Co</a>.

Un système d'autorisation détermine qui est autorisé à utiliser l'application web et dans quel contexte, afin de garantir la sécurité de la communauté.

Avec le consentement des parents, l'objectif est de promouvoir leur rôle dans l'accompagnement de leurs enfants vers une utilisation appropriée des technologies numériques et d'encourager un dialogue ouvert sur ce sujet.

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

# Anticiper l'avenir numérique

## La programmation ne sera bientôt plus une compétence rare réservée à une élite.

L'avènement de l'intelligence artificielle la rendra omniprésente et accessible à un large public. C'est pourquoi ce projet met en place le cadre nécessaire pour permettre à chacun de contribuer.

En adoptant une architecture technique et des pratiques courantes dans le secteur, nous établissons les normes et les mesures de sécurité indispensables au développement de nouveaux outils d'IA, guidés par l'intervention <s>l'humain</s> des parents.

Si vous souhaitez participer ou si vous pensez que ce logiciel pourrait être utile à votre établissement scolaire, nous vous expliquerons la marche à suivre. Il vous suffit de <a class='link' href='https://www.flexiness.com/meet-up/794e456e-8c6d-4679-9b58-1443a9af8f5f' target='_blank'>réserver un créneau horaire</a> avec un développeur dédié.

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

# Interdire ou mieux introduire<br/>le numérique

Si on est tous conscients de la nécessité de mieux modérer, voir réduire, notre consommation d'écrans.

On peut aussi se poser la question :

<strong>&laquo; Quel type d'utilisation on en fait ? &raquo;</strong>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

# Développons une meilleure approche au monde numérique

## Soyons proactifs avec quelque chose de concret...<br/>le code source

En promouvant l'<a class='link' href='https://www.library.hbs.edu/working-knowledge/open-source-software-the-nine-trillion-resource-companies-take-for-granted' target='_blank'>open source</a>, la transparence et le droit d'accès au <a class='link' href='https://www.sonarsource.com/resources/library/source-code/' target='_blank'>code source</a>, ce site cherchera à lutter contre le problème de la surconsommation de technologies numériques en questionnant leur fonctionnement, en appréciant leur complexité et les compétences analytiques nécessaires pour les maîtriser pleinement.

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
