# 🧪 Test de la cagnotte — Mode d'emploi pour l'équipe APE La Source

> **En deux mots :** on lance un test grandeur nature de l'application de cagnotte.
> L'objectif est double : **vérifier que tout fonctionne** et **que chaque membre de l'équipe
> comprenne comment ça marche**. Aucun argent réel n'est dépensé — tout se passe en mode test.

---

## 1. Pourquoi ce test ?

Avant d'ouvrir la cagnotte au public, nous devons nous assurer que :

- la création d'une cagnotte fonctionne de bout en bout ;
- les dons (paiements) passent correctement ;
- chaque membre de l'équipe APE La Source sait utiliser l'outil et pourra accompagner les
  familles.

**Tout le monde est invité à participer** en faisant un ou plusieurs **dons de test**. Plus on est
nombreux à tester, plus on repère vite les éventuels problèmes. 🙌

---

## 2. 🔗 Quels liens utiliser ?

Tout le test se déroule sur le **site habituel de l'association** :

> 🌐 **Adresse de base : https://apelasource.org**

⚠️ **Important :** même si l'adresse est celle du vrai site, **Stripe est en mode TEST** pendant
toute cette phase. Aucun argent réel n'est débité (voir §6).

| Action                                            | Lien à utiliser                                  | Pour qui ?            |
| ------------------------------------------------- | ------------------------------------------------ | --------------------- |
| **Créer la cagnotte**                             | `https://apelasource.org/cagnotte/creer/`        | Roxanne               |
| **Configurer / vérifier le compte Stripe Connect**| `https://apelasource.org/cagnotte/compte-stripe/`| Roxanne               |
| **Participer (faire un don)**                     | `https://apelasource.org/cagnotte/<slug>/`       | Toute l'équipe        |

> 💡 Le lien de participation contient un identifiant unique (`<slug>`) généré à la création.
> **Personne n'a à le deviner** : c'est exactement le lien que **Roxanne partagera** par e-mail ou
> sur WhatsApp (voir §3).
>
> 🔚 Pensez à conserver la **barre oblique finale** (`/`) dans les adresses — le site l'utilise par
> convention.

---

## 3. Qui fait quoi ?

### 👤 Roxanne — créatrice de la cagnotte test

Roxanne se rend sur **https://apelasource.org/cagnotte/creer/** et crée la cagnotte de test avec
les paramètres suivants :

| Paramètre        | Valeur de test                                  |
| ---------------- | ----------------------------------------------- |
| **Titre**        | Un titre clair, ex. « Cagnotte TEST – APE »      |
| **Durée**        | **2 jours**                                     |
| **Montant cible**| **50 €**                                        |

#### Création du compte Stripe Connect (justificatif d'identité)

Pour pouvoir recevoir des dons, Roxanne doit créer son **compte Stripe Connect** (depuis
**https://apelasource.org/cagnotte/compte-stripe/**). Stripe demande
normalement une **preuve d'identité** (pièce d'identité). Comme nous sommes sur la **plateforme de
test**, cette étape peut être **accélérée (fast-track)** — il suffit de suivre les indications de
l'écran de vérification de test, sans fournir de vrai document.

> 🎯 **Encore mieux :** si Roxanne le souhaite, il serait **idéal qu'elle utilise une véritable
> pièce d'identité** pour cette vérification. Cela nous permettrait de **confirmer que le processus
> de vérification d'identité de Stripe fonctionne correctement de bout en bout**, et pas seulement
> en mode accéléré. Le fast-track reste une solution de repli tout à fait acceptable si elle
> préfère ne pas transmettre de document réel.

#### Partage du lien

Une fois la cagnotte créée, Roxanne **partage l'URL de la cagnotte** (de la forme
`https://apelasource.org/cagnotte/<slug>/`) :

- dans la **discussion par e-mail**, ou
- dans le **groupe WhatsApp** de l'équipe.

C'est ce lien qui permettra à tout le monde de participer aux dons de test.

### 👥 Le reste de l'équipe — donateurs de test

Chacun ouvre le lien partagé par Roxanne et effectue un **don de test** (voir les cartes ci-dessous).

---

## 4. Cartes bancaires de test Stripe 💳

Aucune vraie carte n'est nécessaire. Utilisez l'une de ces **cartes de test Stripe** :

- **Date d'expiration** : n'importe quelle date future (ex. `12/34`)
- **CVC** : n'importe quels 3 chiffres (ex. `123`)
- **Code postal** : n'importe lequel (ex. `75001`)

| Numéro de carte           | Résultat attendu                                  |
| ------------------------- | ------------------------------------------------- |
| `4242 4242 4242 4242`     | ✅ Paiement **réussi** (cas standard)              |
| `4000 0025 0000 3155`     | 🔐 Demande une **authentification 3D Secure**     |
| `4000 0000 0000 9995`     | ❌ Paiement **refusé** (fonds insuffisants)        |

> 💡 Testez de préférence les trois cas pour vérifier que l'application réagit correctement aussi
> bien aux paiements réussis qu'aux refus.

---

## 5. Qui paie les frais ? La configuration des frais Stripe

L'application gère **qui prend en charge les frais** de transaction. Deux configurations nous
intéressent :

### ⚙️ Configuration actuelle : **Freemium** (active aujourd'hui)

- **Le donateur** prend en charge les frais de carte bancaire (le montant est légèrement majoré au
  paiement, pour que la cagnotte reçoive **100 % du don souhaité**).
- **Le bénéficiaire** prend en charge le petit frais de virement vers son compte.
- **Aucune commission de plateforme** (0 %).

➡️ Avantage : l'association ne perd rien, la cagnotte reçoit le montant entier.

### ⚙️ Configuration alternative possible (frais de virement pris en charge par la plateforme)

- **Le donateur** prend en charge les frais de carte bancaire (comme en Freemium — la cagnotte
  reçoit **100 % du don souhaité**).
- **La plateforme** prend en charge le petit frais de virement vers le compte du bénéficiaire.
- **Aucune commission de plateforme** (0 %).

➡️ Avantage : par rapport au Freemium, le bénéficiaire **ne supporte aucun frais** — c'est la
plateforme qui absorbe le coût du virement.

> Nous testons actuellement en mode **Freemium**. Le passage éventuel à cette configuration
> alternative est une simple décision de paramétrage que nous pourrons prendre ensemble après le
> test.

---

## 6. Environnement de test → puis passage en réel 🚀

- **Aujourd'hui**, l'application utilise un **compte Stripe de TEST**. Aucun argent réel ne circule.
- **Après un test réussi**, nous basculerons vers un **compte Stripe en mode réel (live)**, qui
  utilisera le **compte bancaire de Flexiness** comme **plateforme orchestratrice** des paiements.

### Option : un compte plateforme au nom de « APE La Source »

Si elle le souhaite, **Meriem (trésorière)** peut faire créer un **compte plateforme Stripe au nom
de l'association « APE La Source »**, adossé au **compte bancaire de l'association**. Dans ce cas,
les fonds transiteraient directement par l'association plutôt que par Flexiness.

> 📩 **Merci de noter** : si ce compte Stripe « APE La Source » est créé, il devra impérativement
> utiliser l'adresse e-mail **contact@apelasource.org**.

---

## ✅ Récapitulatif — À vos marques, testez !

1. **Roxanne** crée la cagnotte test (titre clair, **2 jours**, **50 €**) et valide son compte
   Stripe Connect via le fast-track de test.
2. **Roxanne** partage l'URL de la cagnotte par e-mail ou sur WhatsApp.
3. **Toute l'équipe** fait des dons de test avec les cartes Stripe ci-dessus.
4. On vérifie ensemble que tout fonctionne, puis on décide du passage en mode réel.

Bon test à toutes et à tous ! 🎉
