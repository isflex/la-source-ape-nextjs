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
                  {`${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION_GENERIC} de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC} met à votre disposition un outil pour `}
                  <strong>mobiliser les parents accompagnateurs</strong>
                  {` lors des sorties scolaires. Régulièrement, les enseignants ont besoin d'un nombre suffisant d'adultes pour encadrer les groupes d'élèves lorsqu'ils quittent l'enceinte de l'école.`}
                </p>
                <p>
                  {`La sortie la plus fréquente au primaire étant le trajet à la `}
                  <strong>piscine</strong>
                  {`, c'est elle qui a donné son nom à l'outil. Fini les listes papier et les échanges de messages : tout se fait en ligne, et chacun voit en temps réel les `}
                  <strong>parents inscrits</strong>
                  {`.`}
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Comment ça marche ?</h3>
                <ol>
                  <li>
                    {`Le délégué crée un planning en choisissant les jours, les horaires et les dates des sorties.`}
                  </li>
                  <li>{`Il partage le lien du planning avec les parents.`}</li>
                  <li>
                    {`Chaque parent se porte volontaire comme accompagnateur sur les créneaux disponibles.`}
                  </li>
                  <li>
                    {`Le délégué suit les inscriptions et peut les exporter.`}
                  </li>
                </ol>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour les délégués : créer un planning</h3>
                <p>
                  {`Pour créer un planning, connectez-vous puis rendez-vous sur la page de création. Tout se fait en plusieurs étapes simples : le choix des `}
                  <strong>jours de la semaine</strong>
                  {`, la définition des `}
                  <strong>horaires</strong>
                  {`, la sélection des `}
                  <strong>dates</strong>
                  {`, le niveau scolaire et le nom de l'enseignant, puis le titre du planning.`}
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
                                href="https://apelasource.org/planning/piscine/creer/"
                                target="_blank"
                              >
                                https://apelasource.org/planning/piscine/creer
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
                  src={"/assets/img/newsletter/planning/creer-planning-1.png"}
                  alt="Capture d'écran de la création d'un planning de piscine"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>
                  {`Une fois le planning créé, partagez le lien, suivez les inscriptions en temps réel, réorganisez les accompagnateurs si besoin et exportez la liste complète au format CSV.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={"/assets/img/newsletter/planning/gestion-plannings.png"}
                  alt="Capture d'écran de la gestion des planning de piscine"
                  width="400"
                  height="200"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>
                  Pour les parents : se porter volontaire comme accompagnateur
                </h3>
                <p>
                  {`Ouvrez le lien du planning, connectez-vous, puis cliquez sur `}
                  <strong>« S'inscrire »</strong>
                  {` sur le créneau de la sortie que vous pouvez accompagner.`}
                </p>
                <p>
                  {`Renseignez votre prénom, votre nom, votre e-mail, votre numéro de téléphone ainsi que le nom de votre enfant. Votre inscription apparaît aussitôt dans la liste des `}
                  <strong>parents inscrits</strong>
                  {`.`}
                </p>
                <p>
                  {`Vous pouvez `}
                  <strong>modifier ou supprimer</strong>
                  {` votre propre inscription à tout moment.`}
                </p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image
                  src={"/assets/img/newsletter/planning/inscrire-planning.png"}
                  alt="Capture d'écran de l'inscription d'un parent accompagnateur"
                  width="400"
                  height="338"
                  className={stylesPage.centeredImage}
                />
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour rappel l&apos;url du planning :</h3>
                <p>
                  {`Délégués, pour créer un planning, rendez-vous sur :`}
                  <br />
                  <span className={stylesPage.linkHolder}>
                    <FlexLink
                      className={classNames(
                        flexStyles.link,
                        flexStyles.hasInheritedColor,
                      )}
                      href="https://apelasource.org/planning/piscine/creer/"
                      target="_blank"
                    >
                      https://apelasource.org/planning/piscine/creer
                    </FlexLink>
                  </span>
                </p>
                <p>
                  {`Parents, pour vous porter volontaire comme accompagnateur, utilisez le `}
                  <strong>
                    lien du planning que votre délégué vous a communiqué
                  </strong>
                  {`.`}
                </p>
                <p>
                  Nous espérons que cet outil appelé &laquo; plannings piscine
                  &raquo; simplifiera l&apos;organisation des sorties scolaires
                  et encouragera les parents à se porter volontaires pour
                  accompagner les sorties.
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
