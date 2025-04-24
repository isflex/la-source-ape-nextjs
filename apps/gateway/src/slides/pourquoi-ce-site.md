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

<p>-`<svg style="width:28px;height:28px" viewBox="0 0 31 42" aria-hidden="true"><path d="M6.645 5.69694C7.3455 8.35432 8.98766 10.2743 11.0008 12.4524C13.1904 14.8214 15.3279 17.2156 15.1716 20.6386C15.1824 20.8745 15.1819 21.1048 15.1716 21.3312V27.7798C15.4195 29.3643 13.7832 28.0964 12.4478 29.7634C11.7433 30.6426 10.4182 30.5351 9.08434 31.0138C7.97244 32.4059 7.10513 33.834 6.645 35.5805H24.0084C23.4834 33.5894 22.4302 32.0122 21.088 30.4303C19.9544 30.5746 18.9004 31.3067 18.2843 30.5375C16.9484 28.8705 15.2352 29.3643 15.4826 27.7798V21.3555C15.4715 21.1216 15.4707 20.8829 15.4818 20.6386C15.3254 17.2156 17.463 14.8214 19.6526 12.4524C20.359 11.6881 21.0196 10.9556 21.6098 10.212C15.5054 10.3187 16.4822 5.02768 6.645 5.69694Z" /><path d="M4.13241 3.52906C4.392 8.49473 7.11684 11.4439 9.40905 13.9236C11.439 16.1196 13.1675 17.9909 13.0009 20.6386C13.1675 23.2863 11.439 25.1576 9.40905 27.3536C7.11684 29.8334 4.39184 32.7824 4.13241 37.748H26.521C26.2615 32.7824 23.5367 29.8334 21.2443 27.3536C19.2143 25.1576 17.4858 23.2863 17.6526 20.6386C17.4858 17.9909 19.2143 16.1196 21.2443 13.9236C23.5367 11.4439 26.2615 8.49473 26.521 3.52906H4.13241ZM8.05163 15.1792C5.40628 12.3171 2.23317 8.8841 2.26129 2.67627V2.59303L2.2691 1.67105H28.3843L28.3919 2.59303V2.67627C28.4202 8.8841 25.2471 12.3171 22.6014 15.1792C20.8529 17.0708 19.3659 18.6802 19.5078 20.5699V20.7073C19.3659 22.5971 20.8529 24.2064 22.6014 26.098C25.2471 28.9601 28.4202 32.393 28.3919 38.6011V38.6844L28.3843 39.606H2.2691L2.26129 38.6844V38.6011C2.23317 32.393 5.40628 28.9601 8.05163 26.098C9.80046 24.2064 11.2875 22.5971 11.1455 20.7073V20.5699C11.2875 18.6802 9.80046 17.0708 8.05163 15.1792Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M1.76461 0H28.8889C29.8593 0 30.6534 0.794214 30.6534 1.76461C30.6534 2.735 29.8593 3.52906 28.8889 3.52906H1.76461C0.794214 3.52906 0 2.735 0 1.76461C0 0.794214 0.794214 0 1.76461 0Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M1.76461 37.748H28.8889C29.8593 37.748 30.6534 38.5422 30.6534 39.5128C30.6534 40.4833 29.8593 41.2774 28.8889 41.2774H1.76461C0.794214 41.2774 0 40.4833 0 39.5128C0 38.5422 0.794214 37.748 1.76461 37.748Z" /></svg>´-</p>
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

## Une idée de <s>startup</s> <a class='link' href='https://www.jelancemonedtech.fr/edu-up' target='_blank'>EdTech</a> pour la Source

<p>
  Ce site a pour vocation d'ouvrir la voie à une participation numérique à travers l'expérimentation, l'apprentissage, l'expression artistique
  et la collaboration.
</p>
<p>
  Si l'un des objectifs est de faire évoluer et maintenir le <a class='link' href='/onboard' target='_blank'>web app</a><br/>
  par les plus assidus, nous recherchons également l'implication de chacun, quel que soit son niveau, grace notamment à l'utilisation de l'IA.
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

![bg opacity](/assets/img/gradient.jpg)

## Choisissons les technologies à mettre en avant

<p class="small align-left">
  Tous les écrans ne sont pas égaux. Comme choix d'écran on souhaite privilégier la fenêtre des navigateurs web sur desktop. À la différence
  des écrans tactiles mobiles et tablettes celles-ci favorisent le libre accès au code source, le débogage et la programmation. Il n'y a pas de
  mode développeur sur mobile et tablette.
</p>
<p class="small align-left">
  Vous aurez peut-être remarqué que cette présentation s'accompagnent d'une animation au fur et à mesure que vous consultez les quatres documents pdf.
  L'idée est d'utiliser des processus similaires pour coder des jeux éducatifs avec les élèves. Nous publierions en ligne des poèmes appris accompagnés
  de leurs dessins ou des notes de cours accompagnés d'une série de questions à choix multiples.
</p>
<p class="small align-left">
  Bien que l'intégralité du contenu du site soit accessible sur tous les appareils grâce à un design responsive, l'animation n'est visible que sur
  desktop. Ainsi l'expérience ultime pour l'utilisateur sera <strong>&laquo; desktop first &raquo;</strong>. On ne dégrade pas l'expérience mobile,
  elle est juste moins alléchante.
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

## Sécurisons notre pare-feu.

<p class="small">
  En développant <strong>notre</strong> code on pourrait
</p>
<p class="align-left tiny">
  <span class="number" number="1"></span>
  Limiter le temps de connexion quotidien autorisé par session, chaque élève ne pourra pas dépasser un temps déterminé avec <a class='link' href='https://github.com/ashishks55/websocket-with-custom-reconnect-timer' target='_blank'>Websocket API</a>
</p>
<p class="align-left tiny">
  <span class="number" number="2"></span>
  Choisir quelles pages seront accessibles à un large public ou réservées à des groupes restreints avec avec la mise en œuvre d'<a class='link' href='https://medium.com/@turingvang/nextjs-middleware-auth-56a2da4ea341' target='_blank'>Authentification Middleware Nextjs</a>
</p>
<p class="align-left tiny">
  <span class="number" number="3"></span>
  Limiter l'accès au site avec <a class='link' href='https://docs.aws.amazon.com/fr_fr/vpc/latest/userguide/vpc-security-groups.htmlNetwork' target='_blank'>Groupes de sécurité AWS</a>
  <ul class="tiny">
    <li>
      permis si provenant d'un lien à partir d'ÉcoleDirecte.
    </li>
    <li>
      permis si connecté au réseaux internet de l'école.
      <div class="infoBox info">
        <span>Dans la limite du possible, on peut toujours utiliser un vpn pour contourner ce contrôle d'adresse IP mais cela rend l'accès indésirable plus difficile.</span>
      </div>
    </li>
  </ul>
</p>
<p class="align-left tiny">
  <span class="number" number="4"></span>
  Protéger la propriété de notre contenu du site avec <a class='link' href='https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS' target='_blank'>la partage de ressources d'origine croisée (CORS)</a>. Considérez cela comme un serveur qui dit : &laquo; Je partagerai mes données, mais uniquement avec des amis approuvés &raquo;.
  <div class="infoBox info">
    <span>Cela dit, un utilisateur pourra toujours partager une capture d'écran du site, cette protection ne concerne donc que la manière dont les serveurs communiquent entre eux.</span>
  </div>
</p>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

![bg opacity](/assets/img/gradient.jpg)

## Offrons l'excellence, pas l'abondance

<p class="align-left tiny">
  L'avènement de l'intelligence artificielle permettra de produire du code plus vite sans avoir besoin de comprendre son fonctionnment. On observe déjà ce phénomène prendre de l'ampleur avec l'engouement pour le <a class='link' href='https://fr.wikipedia.org/wiki/Vibecoding' target='_blank'>vibe coding</a>. Utiliser cette approche en <strong>&laquo; mode créatif minecraft &raquo;</strong> n'est pas sans intérêt, mais elle a ses limites. Révéler et explorer la complexité sous-jacente est l’une de nos ambitions. On ne propose pas forcément la simplicité ici.
</p>
<ul class="tiny">
  <li>
    Ici on peut créer des visuels et des animations complexes sans limites à l'imagination. Nul besoin de se conformer aux contraintes techniques imposés par une plateforme qui usurpe votre créativité. En contre partis on ne peut pas toujours se réposer sur des outils d'automatisation qui facilitent la vie à moins de les implémenter vous même.
  </li>
  <li>
    Ici, nous ne partageons pas de posts et de likes sur les réseaux sociaux, plutôt nous apprendrons à développer notre propre réseaux sociaux et à définir ensemble les règles pour le modérer.
  </li>
  <li>
    Ici nous allons explorer le code qui créera les agents IA de demain. Être capable de lancer des projets commme <a class='link' href='https://github.com/femakin01/NextGPTCoverLetter' target='_blank'>NextGPTCoverLetter</a> et <a class='link' href='https://github.com/reworkd/AgentGPT' target='_blank'>AgentGPT</a> nous en donnera déjà un aperçu. Savoir comment exploiter des outils comme tels que <a class='link' href='https://on.warp.dev/home' target='_blank'>Warp</a> ou <a class='link' href='https://github.com/aws/amazon-q-developer-cli?tab=readme-ov-file' target='_blank'>Amazon Q CLI</a> nous mènera plus loin.
  </li>
</ul>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<div class='logo-ape'></div>
