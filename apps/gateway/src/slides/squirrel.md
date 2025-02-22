---
marp: true
lang: fr-FR
title: Jeux éducatifs - écureuil bash
description: Tu es un écureuil dans un terminal bash, trouver tous les glands cachés dans l'arborescence en utilisant les commandes ls, cd, cat et tail
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
  p.align-left {
    text-align: left;
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
  .squirrel-bg {
    height: 100%;
    background-image: url('/assets/svg/squirrel.svg');
    background-size: 100%;
    background-position: center center;
  }
</style>


<div class='screen-100 screen-bg squirrel-bg'>
  <h2>Jeux éducatifs - écureuil bash</h2>
</div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<style>
  @import url('https://fonts.googleapis.com/css?family=Ubuntu');
  @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono');

  #ubuntu {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 18px;
    margin-bottom: 1em;
    height: 300px;
  }

  #terminal {
    width: auto;
    min-width: 80%;
    /* height: 80%; */
    height: 100%;
    font-family: Ubuntu;
    box-shadow: 2px 4px 10px rgba(0,0,0,0.5);
  }

  #terminal__bar {
    display: flex;
    width: 100%;
    height: 30px;
    align-items: center;
    padding: 0 8px;
    box-sizing: border-box;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: linear-gradient(#504b45 0%,#3c3b37 100%);
  }

  #bar__buttons {
    display: flex;
    align-items: center;
  }

  .bar__button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-right: 5px;
    font-size: 10px;
    height: 12px;
    width: 12px;
    box-sizing: border-box;
    border: none;
    border-radius: 100%;
    background: linear-gradient(#7d7871 0%, #595953 100%);
    text-shadow: 0px 1px 0px rgba(255,255,255,0.2);
    box-shadow: 0px 0px 1px 0px #41403A, 0px 1px 1px 0px #474642;
  }
  .bar__button:hover {
    cursor: none;
  }
  .bar__button:focus {
    outline: none;
  }
  #bar__button--exit {
    background: linear-gradient(#f37458 0%, #de4c12 100%);
    background-clip: padding-box;
  }

  #bar__user {
    color: #d5d0ce;
    /* margin-top: 15px !important; */
    margin-left: 6px !important;
    font-size: 14px;
    line-height: 15px;
  }

  #terminal__body {
    background: rgba(56, 4, 40, 0.9);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    /* background: transparent; */
    font-family: 'Ubuntu Mono';
    height: calc(100% - 70px);
    padding: 2px 7px 1rem;
    margin-top: -1px;
    display: grid;
    grid-auto-rows: max-content;
    align-items: center;
    justify-content: start;
    justify-items: flex-start;
  }

  #terminal__prompt {
    /* display: flex; */
    display: inline-table;
    color: #fff;
  }
  #terminal__prompt--user {
    color: #7eda28;
  }
  #terminal__prompt--location {
    color: #4878c0;
  }
  #terminal__prompt--bling {
    color: #dddddd;
    margin-right: 8px;
  }
  #terminal__prompt--cursor {
    /* display: block;
    height: 17px;
    width: 8px;
    margin-top: 5px;
    margin-left: 0px; */
    display: table-cell;
    width: 10px;
    animation: blink 1200ms linear infinite;
  }
  .terminal__folder {
    color: #0024ff;
  }

  @keyframes blink {
    0% {
      background: #ffffff;
    }
    49% {
      background: #ffffff;
    }
    60% {
      background: transparent;
    }
    99% {
      background: transparent;
    }
    100% {
      background: #ffffff;
    }
  }

  @media (max-width: 600px) {
    #terminal {
      max-height: 90%;
      width: 90%;
    }
  }
</style>

<p>
  Tu es un écureuil dans un terminal bash.
  Trouver tous les glands cachés dans l'arborescence.
</p>
<ul>
  <li>
    Pour regarder autour de toi et te situer, utilise la commande <code>ls</code>.
  </li>
  <li>
    Pour bouger et changer d'arbre ou de branche, utilise la commande <code>cd</code>.
  </li>
  <li>
    Sur ta route tu pourras croiser quelques amis qui te porteront conseil, utilise la commande <code>cat</code> pour leur parler.
  </li>
</ul>
<div id="ubuntu">
  <div id='terminal'>
    <section id="terminal__bar">
      <div id="bar__buttons">
        <button class="bar__button" id="bar__button--exit">&#10005;</button>
        <button class="bar__button">&#9472;</button>
        <button class="bar__button">&#9723;</button>
      </div>
      <p id="bar__user">écureuil@la-source: ~</p>
    </section>
    <!-- Terminal Body -->
    <section id="terminal__body">
      <div id="terminal__prompt">
        <span id="terminal__prompt--user">écureuil:</span>
        <span id="terminal__prompt--location">~/sol</span>
        <span id="terminal__prompt--bling">$</span>
        <span>ls</span>
      </div>
      <div id="terminal__prompt">
        <span id="terminal__prompt--user">écureuil:</span>
        <span id="terminal__prompt--location">~/sol</span>
        <span id="terminal__prompt--bling">$</span>
        <span><span class="terminal__folder">grand-arbre</span> <span class="terminal__folder">petit-arbre</span> <span class="terminal__folder">arbre-haut</span></span>
      </div>
      <div id="terminal__prompt">
        <span id="terminal__prompt--user">écureuil:</span>
        <span id="terminal__prompt--location">~/sol</span>
        <span id="terminal__prompt--bling">$</span>
        <span>cd grand-arbre</span>
      </div>
      <div id="terminal__prompt">
        <span id="terminal__prompt--user">écureuil:</span>
        <span id="terminal__prompt--location">~/sol/grand-arbre</span>
        <span id="terminal__prompt--bling">$</span>
        <span id="terminal__prompt--cursor"></span>
      </div>
    </section>
  </div>
</div>

<!-- Ceci est une note pour le présentateur. Vous pouvez écrire des notes via cette balise de commentaire HTML -->

---

<style>
  .tree {
    font-size: 0.4em;
    letter-spacing: 0px;
  }

  .tree code {
    position: relative;
    z-index: 99;
  }

  .grid {
    position: relative;
    display: grid;
    row-gap: 0;
    column-gap: 0;
  }

  .tree-cols-level-1 {
    grid-template-columns: 10fr 40fr 10fr;
  }

  .tree-cols-level-2 {
    grid-template-columns: 30fr 30fr;
  }

  .tree-cols-level-2 > .tree-1,
  .tree-cols-level-2 > .tree-2 {
    grid-template-columns: 20fr 20fr 20fr;
  }

  .branch-cols {
    column-gap: 1rem;
  }

  .branch-cols-5 {
    grid-template-columns: 8fr 8fr 8fr 8fr 8fr;
  }

  .branch-base-0::after {
    content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    position: absolute;
    display: block;
    width: 100%;
    left: 0;
    overflow: hidden;
  }

  .branch-base-1::after {
    content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    position: absolute;
    display: block;
    width: 635px;
    left: -215px;
    overflow: hidden;
  }

  .branch-base-2a::after {
    content: "━━━━━━━━━━━";
    position: absolute;
    display: block;
    width: 185px;
    left: 24px;
    overflow: hidden;
  }

  .branch-base-2b::after {
    content: "━━━━━━━━";
    position: absolute;
    display: block;
    width: 145px;
    left: 35px;
    overflow: hidden;
  }

  .branch-base-3::after {
    content: "━━━━━━━━━━━━━━━━━━━━━━━";
    position: absolute;
    display: block;
    width: 375px;
    left: -95px;
    overflow: hidden;
  }

  .branch-vert-1::before {
    content: "┃";
    position: absolute;
    display: block;
    width: 100%;
    height: 20px;
    left: 0;
    top: -6px;
    overflow: hidden;
  }

  .branch-vert-1::after {
    content: "┃";
    position: absolute;
    display: block;
    width: 100%;
    height: 20px;
    left: 0;
    bottom: -6px;
    overflow: hidden;
  }

  .branch-cols-5-span-1-2 {
    grid-column: 1 / span 2;
    align-self: start;
  }

  .branch-cols-5-span-2-3 {
    grid-column: 2 / span 2;
    align-self: start;
  }

  .branch-cols-5-span-3-4 {
    grid-column: 3 / span 2;
    align-self: end;
  }

  .branch-cols-5-span-4-5 {
    grid-column: 4 / span 2;
    align-self: end;
  }

  .branch-cols-3 {
    grid-template-columns: 13.5fr 13.5fr 13.5fr;
  }

  .branch-cols-3-span-1-2 {
    grid-column: 1 / span 2;
    align-self: start;
  }

  .branch-cols-3-span-2-3 {
    grid-column: 2 / span 2;
    align-self: end;
  }

  .tree-align-left {
    text-align: left;
  }

  .tree-align-right {
    text-align: right;
  }

  .tree-1,
  .branch-1 {
    grid-column: 1;
  }
  .tree-2,
  .branch-2  {
    grid-column: 2;
  }
  .tree-3,
  .branch-3  {
    grid-column: 3;
  }

  .grid-transparent {
    display: inline;
    color: transparent;
  }
</style>

<div class="grid tree">
  <div class="grid ground-rows">
    <div class="grid tree-cols-level-2">
      <div class="grid tree-1">
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Branche gauche</code></div>
          <div class="grid branch-vert-1">┃</div>
          <div class="">┣</div>
          <div class="grid branch-vert-1">┃</div>
        </div>
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Tronc</code></div>
          <div class="grid branch-vert-1">┃</div>
          <div class="grid branch-base-3">┻</div>
          <div class="">&nbsp;</div>
        </div>
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Branche droite</code></div>
          <div class="grid branch-vert-1">┃</div>
          <div class="">┛</div>
          <div class="">&nbsp;</div>
        </div>
      </div>
      <div class="grid tree-2">
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Branche gauche</code></div>
          <div class="grid branch-vert-1">┃</div>
          <div class="">┗</div>
          <div class="">&nbsp;</div>
        </div>
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Tronc</code></div>
            <div class="grid branch-vert-1">┃</div>
            <div class="grid branch-base-3">┻</div>
          <div class="">&nbsp;</div>
        </div>
        <div class="">
          <div class="">┃</div>
          <div class="">┃</div>
          <div class=""><code>Branche droite</code></div>
          <div class="grid branch-vert-1">┃</div>
          <div class="">┫</div>
          <div class="grid branch-vert-1">┃</div>
        </div>
      </div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1">
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div><code>Tronc</code></div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
      </div>
      <div class="grid tree-2">
        <div class="grid branch-cols">
          <div class="grid branch-1">
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
              <div class="">&nbsp;</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-cols-5-span-4-5"><code>Feuille-4</code></div>
            </div>
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-cols-5-span-3-4"><code>Feuille-3</code></div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
              <div class="grid branch-cols-5-span-2-3"><code>Feuille-2</code></div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-cols-5-span-1-2"><code>Feuille-1</code></div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-5 branch-base-2a">
              <div class="">┗</div>
              <div class="">━</div>
              <div class="">╋</div>
              <div class="">┛</div>
              <div class="">┛</div>
            </div>
            <div class="grid branch-vert-1">┃</div>
            <div><code>Branche gauche</code></div>
            <div class="grid branch-vert-1">┃</div>
            <div class="">┗</div>
          </div>
          <div class="grid branch-2">
            <div class="grid branch-cols-3">
              <div class="">&nbsp;</div>
              <div class="grid branch-cols-3-span-1-2"><code>Gland</code></div>
            </div>
            <div class="grid branch-cols-3">
              <div class="">
                <div class="grid">
                  <div class="grid branch-vert-1">┃</div>
                  <div class="grid branch-vert-1">┃</div>
                </div>
              </div>
              <div class="grid branch-cols-3-span-2-3"><code>Petite Feuille</code></div>
            </div>
            <div class="grid branch-cols-3">
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-3">
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-3">
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-3">
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-3 branch-base-2b">
              <div class="">┗</div>
              <div class="">┳</div>
              <div class="">┛</div>
            </div>
            <div class="grid branch-vert-1">┃</div>
            <div><code>Branche au centre</code></div>
            <div class="grid branch-vert-1">┃</div>
            <div class="grid branch-base-1">╋</div>
          </div>
          <div class="grid branch-3">
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-cols-5-span-1-2 tree-align-left"><code>Feuille-1</code></div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-cols-5-span-2-3 tree-align-left"><code>Feuille-2</code></div>
              <div class="">&nbsp;</div>
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-cols-5-span-3-4"><code>Feuille-3</code></div>
              <div class="">&nbsp;</div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-cols-5-span-4-5 tree-align-right"><code>Feuille-4</code></div>
            </div>
            <div class="grid branch-cols-5">
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="grid branch-vert-1">┃</div>
              <div class="">&nbsp;</div>
              <div class="grid branch-vert-1">┃</div>
            </div>
            <div class="grid branch-cols-5 branch-base-2a">
              <div class="">┗</div>
              <div class="">┗</div>
              <div class="">╋</div>
              <div class="">━</div>
              <div class="">┛</div>
            </div>
            <div class="grid branch-vert-1">┃</div>
            <div><code>Branche droite</code></div>
            <div class="grid branch-vert-1">┃</div>
            <div class="">┛</div>
          </div>
        </div>
      </div>
      <div class="grid tree-3">
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div><code>Tronc</code></div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
        <div class="grid branch-vert-1">┃</div>
      </div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1 branch-vert-1">┃</div>
      <div class="grid tree-2 branch-vert-1">┃</div>
      <div class="grid tree-3 branch-vert-1">┃</div>
    </div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1 branch-vert-1">┃</div>
      <div class="grid tree-2 branch-vert-1">┃</div>
      <div class="grid tree-3 branch-vert-1">┃</div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1">
        <div class="grid branch-vert-1">┃</div>
      </div>
      <div class="grid tree-2">
        <div><code>Tronc</code></div>
      </div>
      <div class="grid tree-3">
        <div class="grid branch-vert-1">┃</div>
      </div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1 branch-vert-1">┃</div>
      <div class="grid tree-2 branch-vert-1">┃</div>
      <div class="grid tree-3 branch-vert-1">┃</div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1">
        <div><code>Grand Arbre</code></div>
      </div>
      <div class="grid tree-2">
        <div><code>Petit Arbre</code></div>
      </div>
      <div class="grid tree-3">
        <div><code>Arbre Haut</code></div>
      </div>
    </div>
    <div class="grid tree-cols-level-1">
      <div class="grid tree-1 branch-vert-1">┃</div>
      <div class="grid tree-2 branch-vert-1">┃</div>
      <div class="grid tree-3 branch-vert-1">┃</div>
    </div>
    <div class="grid tree-cols-level-1 branch-base-0">
      <div class="grid tree-1">┻</div>
      <div class="grid tree-2">┻</div>
      <div class="grid tree-3">┻</div>
    </div>
    <div>
      ////////////////////////////////////////////////////////////////////////////////////////// Le Sol //////////////////////////////////////////////////////////////////////////////////////////
    </div>
  </div>
</div>

---

<div class='logo-ape'></div>
