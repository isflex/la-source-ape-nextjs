Bonjour,

Avant les vacances d’avril, nous avons discuté de la question des adhésions.

Depuis, il a été décidé de continuer à collecter les adhésions par l’intermédiaire de l’administration scolaire, comme auparavant.

Toutefois, une alternative est proposée ici si l’association des parents d’élèves souhaite gérer les adhésions de manière indépendante.

L’idée est de pouvoir configurer plus facilement le formulaire d’adhésion sur notre site web selon nos besoins :

- Un champ RGPD nous permettant d’obtenir le consentement des membres pour communiquer avec eux par courriel (et par téléphone si nécessaire)
- Un ciblage basé sur le niveau scolaire de leurs enfants scolarisés afin de mieux définir notre public

Comme avec le parcours des cagnottes, le formulaire ici est mode test sandbox. Il est branché sur une instance de helloasso backoffice qui est également en mode test sandbox. 

Je vous invite d'en prendre connaissance.


# 🧪 Test de l'adhésion — Mode d'emploi pour l'équipe APE La Source

> **En deux mots :** on lance un test grandeur nature de l'application d'**adhésion** (la cotisation
> annuelle à l'APE). L'objectif est double : **vérifier que tout fonctionne** et **que chaque membre
> de l'équipe comprenne comment ça marche**. Aucun argent réel n'est dépensé — tout se passe en mode
> test (HelloAsso sandbox).

---

## 1. Pourquoi ce test ?

Avant d'ouvrir l'adhésion en ligne au public, nous devons nous assurer que :

- le parcours d'adhésion fonctionne de bout en bout (connexion → formulaire → paiement) ;
- le paiement via **HelloAsso** passe correctement ;
- l'adhésion est bien **reliée automatiquement au compte** du membre (grâce à l'e-mail) ;
- chaque membre de l'équipe sait utiliser l'outil et pourra accompagner les familles.

**Tout le monde est invité à participer** en réalisant une ou plusieurs **adhésions de test**. Plus
on est nombreux à tester, plus on repère vite les éventuels problèmes. 🙌

---

## 2. 🔗 Quels liens utiliser ?

⚠️ **Différence avec la cagnotte :** la page d'adhésion n'est **pas encore visible sur le site de
production** ([https://apelasource.org/adhesion](https://apelasource.org/adhesion)) — la fonctionnalité y est désactivée pour l'instant. Le test se
déroule donc sur l'**environnement de pré-production (sandbox)**.

> 🌐 **Adresse de base :** [https://flexi.d2ybqei9w8j7t5.amplifyapp.com/adhesion](https://flexi.d2ybqei9w8j7t5.amplifyapp.com/adhesion)

⚠️ **Important :** HelloAsso est en **mode TEST (sandbox)** pendant toute cette phase. Aucun argent
réel n'est débité (voir §4 et §6).

| Action                                              | Lien à utiliser                                                                                              | Pour qui ?            |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------- |
| **Adhérer (faire une adhésion de test)**            | [formulaire d'adhésion en test sandbox](https://flexi.d2ybqei9w8j7t5.amplifyapp.com/adhesion)                                                                         | Toute l'équipe        |
| **Vérifier les adhérents (backoffice HelloAsso)**   | [backoffice helloasso en test sandbox](https://admin.helloasso-sandbox.com/association-des-parents-d-eleves-de-la-source-ecole-nouvelle-sandbox/adhesions/test-subscribe/statistiques) | Meriem (trésorière) ou autre administrateur du backoffice  |

---

## 3. Qui fait quoi ?

### 👥 Toute l'équipe — adhérents de test

Chaque membre :

1. Ouvre **[https://flexi.d2ybqei9w8j7t5.amplifyapp.com/adhesion](https://flexi.d2ybqei9w8j7t5.amplifyapp.com/adhesion)** et se **connecte** (bouton « Se connecter »).
2. La page vérifie automatiquement votre statut (« Vérification de votre adhésion en cours... »).
3. Si vous n'êtes pas encore adhérent, le **formulaire HelloAsso** s'affiche directement dans la
   page (« Complétez le formulaire ci-dessous pour finaliser votre adhésion »).
4. ⚠️ **Important :** utilisez **la même adresse e-mail que celle de votre compte de connexion** au moment
   du paiement. C'est ce qui relie automatiquement votre adhésion à votre compte. La page vous
   rappelle l'adresse à utiliser.
5. Payez avec une **carte de test** (voir §4).
6. Rechargez la page : vous devez voir le message « **Vous êtes déjà adhérent(e)** » avec votre nom
   et la date de l'adhésion.

> 💡 Testez aussi le cas du « retour » : en revenant sur la page une fois adhérent, vous ne devez
> **plus** voir le formulaire, mais bien le message de confirmation.

### 👤 Meriem (trésorière) — vérification des adhésions

Meriem se connecte au **backoffice HelloAsso sandbox** pour vérifier que les adhésions de test
remontent bien :

- 🔗 Backoffice : `https://admin.helloasso-sandbox.com/association-des-parents-d-eleves-de-la-source-ecole-nouvelle-sandbox/adhesions/test-subscribe/statistiques`
- **Identifiant :** `is-test@apelasource.org`
- **Mot de passe :** `S8v8r8Nc8!seven`

> Ces identifiants sont aussi affichés dans l'encart **« Environnement de test (sandbox) »**
> directement sur la page d'adhésion.

---

## 4. Carte bancaire de test HelloAsso 💳

Aucune vraie carte n'est nécessaire. Utilisez la **carte de test** :

| Champ                  | Valeur                                            |
| ---------------------- | ------------------------------------------------- |
| **Numéro de carte**    | `4242 4242 4242 4242`                             |
| **Date d'expiration**  | n'importe quelle date future (ex. `12/34`)        |
| **CVC**                | n'importe quels 3 chiffres (ex. `123`)            |

> Cette carte simule un **paiement réussi** — c'est le scénario principal à valider pour l'adhésion.

---

## 5. Les frais : le modèle HelloAsso

HelloAsso est **gratuit pour l'association** : la plateforme ne prélève **aucune commission** sur
les adhésions. Son fonctionnement repose sur une **contribution volontaire** (« pourboire »)
proposée au donateur au moment du paiement :

- au paiement, l'adhérent peut **laisser une contribution à HelloAsso** ;
- cette contribution est **entièrement facultative** et peut être **ramenée à 0 €** ;
- dans tous les cas, **l'intégralité du montant de l'adhésion** revient à l'APE.

> 💡 Pendant le test, essayez avec **et** sans contribution volontaire pour voir les deux cas. Le
> montant de l'adhésion lui-même est défini dans le formulaire HelloAsso (backoffice).

---

## 6. Environnement de test → puis passage en réel 🚀

- **Aujourd'hui**, l'application utilise l'environnement **HelloAsso sandbox**, et la page
  d'adhésion n'est active que sur le **production-sandbox**. Aucun argent réel ne circule.
- **Après un test réussi**, nous activerons l'adhésion sur le **site de production**
  (`https://apelasource.org/adhesion/`) et basculerons vers le **formulaire HelloAsso réel** de
  l'association.

> 📩 **À noter :** le passage en réel nécessite le formulaire HelloAsso de **production** de l'APE
> et l'activation du paramètre **`ADHESION_ENABLED`** sur la production.

---

## ✅ Récapitulatif — À vos marques, testez !

1. Rendez-vous sur **https://<URL-DU-SANDBOX>/adhesion/** et **connectez-vous**.
2. Remplissez le **formulaire HelloAsso** en utilisant **la même adresse e-mail que votre compte**.
3. Payez avec la carte de test `4242 4242 4242 4242`.
4. Vérifiez le message « **Vous êtes déjà adhérent(e)** » après rechargement de la page.
5. **Meriem** vérifie les adhésions dans le **backoffice HelloAsso sandbox**.
6. On valide ensemble, puis on décide du passage en mode réel.

Bon test à toutes et à tous ! 🎉
