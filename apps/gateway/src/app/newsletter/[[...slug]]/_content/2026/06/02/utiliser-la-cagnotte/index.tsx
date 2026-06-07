"use client";

import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { Link as FlexLink } from "@flex-design-system/react-ts/client-sync-styled-direct/link";
import { default as flexStyles } from "@flex-design-system/framework";
import { default as stylesPage } from "@src/styles/scss/pages/newsletter.module.scss";
import { DEFAULT_FEE_CONFIG, type FeePayer } from "@src/lib/cagnotte-fees";

// Fee wording is driven by the active Stripe fee configuration — specifically
// who pays the card processing fee on contributions (DEFAULT_FEE_CONFIG.payInFeePayer).
// Keeps this newsletter accurate across config presets without manual edits.
const stripeFeePayer: FeePayer = DEFAULT_FEE_CONFIG.payInFeePayer;

const FEE_COPY: Record<
  FeePayer,
  { intro: React.ReactNode; contribute: React.ReactNode }
> = {
  // Platform/APE absorbs the card fee → donors pay nothing.
  platform: {
    intro: (
      <>
        {`, et l'APE prend les frais à sa charge : `}
        <strong>0 % de frais pour les donateurs</strong>
        {`.`}
      </>
    ),
    contribute: (
      <>
        {`Le paiement s'effectue par carte bancaire via Stripe. Rappel : les donateurs ne paient `}
        <strong>aucun frais</strong>
        {` — l'APE les prend en charge.`}
      </>
    ),
  },
  // Freemium: the donor covers the card fee so 100 % reaches the cagnotte.
  contributor: {
    intro: (
      <>
        {`, sans `}
        <strong>aucune commission de plateforme</strong>
        {` : 100 % de votre don parvient à la cagnotte.`}
      </>
    ),
    contribute: (
      <>
        {`Le paiement s'effectue par carte bancaire via Stripe. Les frais de traitement sont ajoutés à votre contribution afin que `}
        <strong>100 % de votre don</strong>
        {` parvienne à la cagnotte, sans commission de plateforme.`}
      </>
    ),
  },
  // Fees deducted from the amount the cagnotte receives.
  recipient: {
    intro: (
      <>
        {`, sans `}
        <strong>aucune commission de plateforme</strong>
        {`. Les frais de traitement sont déduits du montant reçu par la cagnotte.`}
      </>
    ),
    contribute: (
      <>
        {`Le paiement s'effectue par carte bancaire via Stripe. Vous payez exactement le montant indiqué ; les `}
        <strong>
          frais de traitement sont déduits du montant reçu par la cagnotte
        </strong>
        {`, sans commission de plateforme.`}
      </>
    ),
  },
};

const feeCopy = FEE_COPY[stripeFeePayer] ?? FEE_COPY.platform;

const Email: React.FC = () => (
  <div className={stylesPage.newsletterContent}>
    <table
      role="presentation"
      cellSpacing={0}
      cellPadding="0"
      border={0}
      width="100%"
    >
      <tbody>
        <tr>
          <td>
            <div className={stylesPage.emailContainer}>
              <div className={stylesPage.imageContainer}>
                <Image
                  src={"/assets/img/newsletter/header/logo_ape_900x175.png"}
                  alt="Logo de l'APE La Source"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h2>Bonjour</h2>
                <p>
                  {`${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC_GENERIC} de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC} met à votre disposition un nouvel outil : la `}
                  <strong>cagnotte en ligne</strong>
                  {`. Elle permet d'organiser facilement une collecte solidaire entre parents — par exemple pour offrir un cadeau de fin d'année à un enseignant ou financer un projet de classe.`}
                </p>
                <p>
                  {`Les paiements sont entièrement sécurisés par `}
                  <strong>Stripe</strong>
                  {feeCopy.intro}
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Comment ça marche ?</h3>
                <ol>
                  <li>
                    {`Le délégué crée un compte et configure son IBAN via Stripe.`}
                  </li>
                  <li>
                    {`Il crée une cagnotte et partage le lien avec les parents.`}
                  </li>
                  <li>{`Les parents contribuent par carte bancaire.`}</li>
                  <li>
                    {`Le délégué clôture la cagnotte et reçoit les fonds sur son compte.`}
                  </li>
                </ol>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les délégués : configurer votre compte Stripe</h3>
                <p>
                  {`Avant de créer votre première cagnotte, vous configurez une seule fois votre `}
                  <strong>compte Stripe</strong>
                  {`, le service de paiement sécurisé qui vous permettra de recevoir les fonds directement sur votre compte bancaire. ${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC} ne voit jamais vos coordonnées bancaires : tout est géré par Stripe.`}
                </p>
                <p>
                  {`Cette configuration se déroule en `}
                  <strong>deux étapes</strong>
                  {`, avec quelques allers-retours entre notre site et la plateforme Stripe. C'est tout à fait normal et sans risque : Stripe est notre partenaire de paiement et vous guide à chaque écran. Vous pouvez vous interrompre et reprendre plus tard, votre progression est conservée.`}
                </p>
                <p>
                  {`Tout commence sur notre site : un écran récapitule ce qui va se passer, puis vous cliquez sur `}
                  <strong>« Configurer mon compte Stripe »</strong>
                  {`.`}
                </p>
                <table
                  role="presentation"
                  cellSpacing={0}
                  cellPadding="0"
                  border={0}
                  width="100%"
                  className={stylesPage.outlookFix}
                >
                  <tbody>
                    <tr>
                      <td align="center">
                        <p>
                          <strong>
                            <span className={stylesPage.linkHolder}>
                              <FlexLink
                                className={classNames(
                                  flexStyles.link,
                                  flexStyles.hasInheritedColor,
                                )}
                                href="https://apelasource.org/cagnotte/creer/"
                                target="_blank"
                              >
                                https://apelasource.org/cagnotte/creer
                              </FlexLink>
                            </span>
                          </strong>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-1-gestion-intro.png"
                  }
                  alt="Sur notre site : écran « Configuration Stripe requise » expliquant les étapes à venir et le bouton « Configurer mon compte Stripe »"
                  width="900"
                  height="458"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Étape 1 : vos coordonnées et votre IBAN</h3>
                <p>
                  {`Toujours sur notre site, un écran vous indique précisément ce que Stripe va vous demander : vos `}
                  <strong>informations personnelles</strong>
                  {`, vos `}
                  <strong>coordonnées bancaires (IBAN)</strong>
                  {` et une `}
                  <strong>pièce d'identité</strong>
                  {`. Lorsque vous êtes prêt, cliquez sur « Commencer la configuration ».`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-2a-gestion-etape-1.png"
                  }
                  alt="Sur notre site : écran « Compte Stripe Connect » indiquant que la configuration est requise"
                  width="900"
                  height="510"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-2b-gestion-etape-1.png"
                  }
                  alt="Gros plan sur les trois informations demandées par Stripe : informations personnelles, informations bancaires (IBAN) et pièce d'identité"
                  width="900"
                  height="600"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Vous êtes alors redirigé vers la `}
                  <strong>plateforme Stripe</strong>
                  {`. Vous y vérifiez et complétez vos informations, puis vous validez avec le bouton « Accepter et envoyer ». C'est Stripe, et non ${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC}, qui recueille et protège ces données.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-3-compte-stripe-etape-1.png"
                  }
                  alt="Sur la plateforme Stripe : récapitulatif des informations personnelles et bancaires à confirmer avant de cliquer sur « Accepter et envoyer »"
                  width="900"
                  height="979"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois validé, vous revenez automatiquement sur notre site. Votre compte affiche `}
                  <strong>« En attente de vérification »</strong>
                  {` : la première étape est faite, il ne reste plus que la vérification de votre identité.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-4a-gestion-etape-2.png"
                  }
                  alt="De retour sur notre site : le compte est « En attente de vérification » avec le bouton « Compléter mes informations »"
                  width="900"
                  height="509"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-4b-gestion-etape-2.png"
                  }
                  alt="Gros plan : les informations personnelles et bancaires sont validées, seule la pièce d'identité reste à fournir"
                  width="900"
                  height="660"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Étape 2 : la vérification de votre identité</h3>
                <p>
                  {`Cliquez sur `}
                  <strong>« Compléter mes informations »</strong>
                  {`. Vous repartez une dernière fois vers Stripe pour confirmer votre identité, par exemple à l'aide d'un selfie et d'une pièce d'identité. Cette vérification est rapide, sécurisée et exigée par la réglementation bancaire.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-5-compte-stripe-etape-2.png"
                  }
                  alt="Sur la plateforme Stripe : écran de vérification d'identité proposant un selfie et une photo de pièce d'identité"
                  width="900"
                  height="983"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois la vérification terminée, vous revenez sur notre site et votre compte passe au statut `}
                  <strong>« Actif »</strong>
                  {`. Tout est prêt : vous pouvez désormais créer vos cagnottes et recevoir des contributions en toute sérénité.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/setup/cagnottes-6-gestion-finale.png"
                  }
                  alt="De retour sur notre site : le compte Stripe Connect est « Actif » avec le bouton « Créer une cagnotte »"
                  width="900"
                  height="469"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les délégués : créer votre cagnotte</h3>
                <p>
                  {`Votre compte Stripe étant actif, la création de la cagnotte se fait en `}
                  <strong>quatre étapes simples</strong>
                  {` : le titre de la cagnotte et le nom de l'enseignant, une description, un montant cible et une date limite, puis un récapitulatif. Vous pouvez rendre la cagnotte publique ou la réserver aux parents disposant du lien.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/create/cagnottes-1-create.png"
                  }
                  alt="Capture d'écran du formulaire de création d'une cagnotte, à l'étape 1 sur 4 (informations de base)"
                  width="900"
                  height="511"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois ces quatre étapes terminées, votre cagnotte apparaît dans `}
                  <strong>« Mes cagnottes »</strong>
                  {` avec le statut `}
                  <strong>« Brouillon »</strong>
                  {` : elle est créée mais `}
                  <strong>pas encore visible</strong>
                  {`. Pour la mettre en ligne, cliquez sur le bouton vert `}
                  <strong>« Publier »</strong>
                  {`.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/create/cagnottes-2-create.png"
                  }
                  alt="Capture d'écran de la liste « Mes cagnottes » : la cagnotte est au statut Brouillon (non publiée), avec le bouton vert « Publier »"
                  width="901"
                  height="510"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Le statut passe alors de `}
                  <strong>« Brouillon »</strong>
                  {` à `}
                  <strong>« Active »</strong>
                  {` : votre cagnotte est désormais en ligne. Cliquez sur « Voir » pour l'ouvrir, puis copiez l'URL de la page — c'est ce lien que vous partagez avec les autres parents pour qu'ils puissent contribuer. Vous pouvez ensuite suivre les contributions en temps réel et demander le versement des fonds une fois la collecte terminée.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/create/cagnottes-3-create.png"
                  }
                  alt="Capture d'écran de la liste « Mes cagnottes » : la cagnotte est passée au statut Active après publication"
                  width="900"
                  height="512"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/create/cagnottes-4-create.png"
                  }
                  alt="Capture d'écran de la page publique de la cagnotte en ligne, au statut Active, avec le bouton « Contribuer à cette cagnotte »"
                  width="900"
                  height="802"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les parents : contribuer</h3>
                <p>
                  {`Ouvrez le lien de la cagnotte que le délégué vous a partagé. Vous accédez à la page publique : vous y voyez les `}
                  <strong>détails</strong>
                  {`, l'`}
                  <strong>objectif</strong>
                  {` et la `}
                  <strong>progression</strong>
                  {` de la collecte. Pour contribuer, il faut d'abord vous connecter : l'encart « Contribuer » affiche `}
                  <strong>« Connexion requise »</strong>
                  {`. Cliquez sur `}
                  <strong>« Se connecter »</strong>
                  {`.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/participate/cagnottes-1-participate.png"
                  }
                  alt="Page publique de la cagnotte, sans être connecté : l'encart « Contribuer » indique « Connexion requise » avec le bouton « Se connecter »"
                  width="901"
                  height="912"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois connecté, vous revenez sur la même page et l'encart « Contribuer » propose désormais le bouton `}
                  <strong>« Contribuer à cette cagnotte »</strong>
                  {`. Cliquez dessus pour ouvrir le formulaire.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/participate/cagnottes-2-participate.png"
                  }
                  alt="La même page, une fois connecté : l'encart « Contribuer » affiche le bouton « Contribuer à cette cagnotte »"
                  width="901"
                  height="795"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Renseignez votre nom, votre e-mail et le `}
                  <strong>montant</strong>
                  {` de votre choix (dans les limites fixées par le délégué). Un `}
                  <strong>récapitulatif</strong>
                  {` détaille votre contribution, le montant débité et la somme reçue par la cagnotte. Vous pouvez ajouter un petit mot et activer les `}
                  <strong>options de confidentialité</strong>
                  {` : rester `}
                  <strong>anonyme</strong>
                  {` ou masquer le montant de votre contribution.`}
                </p>
                <p>{feeCopy.contribute}</p>
                <p>
                  {`Lorsque tout est prêt, cliquez sur `}
                  <strong>« Continuer vers le paiement »</strong>
                  {`.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/participate/cagnottes-3-participate.png"
                  }
                  alt="Formulaire de contribution sur notre site : nom, e-mail, montant, récapitulatif (contribution, montant débité, somme reçue), message et options de confidentialité"
                  width="901"
                  height="1382"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Vous êtes alors redirigé vers la page de paiement sécurisée `}
                  <strong>Stripe</strong>
                  {`. Réglez votre contribution par `}
                  <strong>carte bancaire</strong>
                  {` (ou via Link), puis validez. Comme pour les délégués, ${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC} ne voit jamais vos coordonnées bancaires : tout est géré par Stripe.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/participate/cagnottes-4-participate.png"
                  }
                  alt="Sur la plateforme Stripe : page de paiement sécurisée pour régler la contribution par carte bancaire ou via Link"
                  width="900"
                  height="512"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Après le paiement, vous revenez automatiquement sur la page de la cagnotte. La `}
                  <strong>progression</strong>
                  {` et la `}
                  <strong>liste des contributions</strong>
                  {` se mettent à jour aussitôt, dans le respect de vos choix de confidentialité (ici `}
                  <strong>« Anonyme »</strong>
                  {` et `}
                  <strong>« Montant masqué »</strong>
                  {`).`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/participate/cagnottes-5-participate.png"
                  }
                  alt="De retour sur notre site : la progression a augmenté et la contribution apparaît dans la liste, en « Anonyme » avec un « Montant masqué »"
                  width="901"
                  height="892"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les délégués : clôturer la cagnotte</h3>
                <p>
                  {`Une fois la campagne de collecte de fonds sera terminée, le statut `}
                  <strong>« Terminée »</strong>
                  {` apparaîtra dans la liste des campagnes que vous avez créées. Vous pourrez alors cliquer sur `}
                  <strong>« Demander paiement »</strong>
                  {` pour que les fonds soient transférés sur votre compte.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/payout/cagnottes-1-payout.png"
                  }
                  alt="Capture d'écran de la liste des cagnottes, avec une cagnotte à l'état terminée"
                  width="900"
                  height="388"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour rappel l&apos;url de la cagnotte :</h3>
                <p>
                  {`Délégués, pour créer une cagnotte, rendez-vous sur :`}
                  <br />
                  <span className={stylesPage.linkHolder}>
                    <FlexLink
                      className={classNames(
                        flexStyles.link,
                        flexStyles.hasInheritedColor,
                      )}
                      href="https://apelasource.org/cagnotte/creer/"
                      target="_blank"
                    >
                      https://apelasource.org/cagnotte/creer
                    </FlexLink>
                  </span>
                </p>
                <p>
                  {`Parents, pour contribuer, utilisez le `}
                  <strong>
                    lien de la cagnotte que votre délégué vous a communiqué
                  </strong>
                  {`.`}
                </p>
                <p>
                  Nous espérons que cet outil facilitera vos collectes et
                  renforcera la solidarité entre les familles de l&apos;école.
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  Cordialement,
                  <br />
                  Inoe Scherer
                  <br />
                  Membre de l&apos;APE
                  <br />
                  inoe@apelasource.org
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Email;
