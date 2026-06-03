"use client";

import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { Link as FlexLink } from "@flex-design-system/react-ts/client-sync-styled-direct/link";
import { default as flexStyles } from "@flex-design-system/framework";
import { default as stylesPage } from "@src/styles/scss/pages/newsletter.module.scss";

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
                  src={
                    "/assets/img/newsletter/presentation/logo_ape_900x175.png"
                  }
                  alt="Logo de l'APE La Source"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h2>Bonjour</h2>
                <p>
                  {`${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC} de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC} met à votre disposition un nouvel outil : la `}
                  <strong>cagnotte en ligne</strong>
                  {`. Elle permet d'organiser facilement une collecte solidaire entre parents — par exemple pour offrir un cadeau de fin d'année à un enseignant ou financer un projet de classe.`}
                </p>
                <p>
                  {`Les paiements sont entièrement sécurisés par `}
                  <strong>Stripe</strong>
                  {`, et l'APE prend les frais à sa charge : `}
                  <strong>0 % de frais pour les donateurs</strong>
                  {`.`}
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
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
                                href="https://apelasource.org/cagnotte/"
                                target="_blank"
                              >
                                https://apelasource.org/cagnotte
                              </FlexLink>
                            </span>
                          </strong>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                <h3>Pour les délégués : créer une cagnotte</h3>
                <p>
                  {`Pour créer une cagnotte, connectez-vous puis configurez votre `}
                  <strong>compte Stripe</strong>
                  {` (IBAN et vérification d'identité). C'est cette étape qui permet de recevoir les fonds en toute sécurité.`}
                </p>
                <p>
                  {`La création se fait ensuite en quatre étapes simples : le titre de la cagnotte et le nom de l'enseignant, une description, un montant cible et une date limite, puis un récapitulatif. Vous pouvez rendre la cagnotte publique ou la réserver aux parents disposant du lien.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/creer_cagnotte_900x450.png"
                  }
                  alt="Capture d'écran du formulaire de création d'une cagnotte"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois la cagnotte créée, publiez-la, partagez le lien, suivez les contributions en temps réel, puis demandez le versement des fonds une fois la collecte terminée.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={
                    "/assets/img/newsletter/cagnotte/compte_stripe_900x450.png"
                  }
                  alt="Capture d'écran de la configuration du compte Stripe (IBAN)"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les parents : contribuer</h3>
                <p>
                  {`Ouvrez le lien de la cagnotte, connectez-vous, puis cliquez sur `}
                  <strong>« Contribuer à cette cagnotte »</strong>
                  {`.`}
                </p>
                <p>
                  {`Indiquez votre nom, votre e-mail et le montant de votre choix (entre 5 € et 1000 €). Vous pouvez ajouter un petit mot, rester `}
                  <strong>anonyme</strong>
                  {` ou masquer le montant de votre contribution.`}
                </p>
                <p>
                  {`Le paiement s'effectue par carte bancaire via Stripe. Rappel : les donateurs ne paient `}
                  <strong>aucun frais</strong>
                  {` — l'APE les prend en charge.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={"/assets/img/newsletter/cagnotte/contribuer_900x450.png"}
                  alt="Capture d'écran du formulaire de contribution à une cagnotte"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour rappel l&apos;url de la cagnotte :</h3>
                <p>
                  <span className={stylesPage.linkHolder}>
                    <FlexLink
                      className={classNames(
                        flexStyles.link,
                        flexStyles.hasInheritedColor,
                      )}
                      href="https://apelasource.org/cagnotte/"
                      target="_blank"
                    >
                      https://apelasource.org/cagnotte
                    </FlexLink>
                  </span>
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
