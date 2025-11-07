'use client';

import React from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import {
  Link as FlexLink,
  Title,
  TitleLevel,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/newsletter.module.scss'

const Email: React.FC = () => (
  <div className={stylesPage.newsletterContent}>
    <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%">
      <tbody>
        <tr>
          <td>
            <div className={stylesPage.emailContainer}>

              <div className={stylesPage.imageContainer}>
                <Image src={'/assets/img/newsletter/presentation/logo_ape_900x175.png'}
                  alt="Logo de l'APE La Source" width="400" height="200" className={stylesPage.centeredImage} />
              </div>

              <div className={stylesPage.contentBlock}>
                <h2>Bonjour</h2>
                <p>L&apos;Association des parents d&apos;élèves de La Source vous présente un outil pour créer des événements périscolaires.</p>
                <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%" className={stylesPage.outlookFix}>
                  <tbody>
                    <tr>
                      <td align="center">
                        <p><strong>
                          <span className={stylesPage.linkHolder}>
                            <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                              href="https://apelasource.org" target="_blank">
                                https://apelasource.org
                            </FlexLink>
                          </span>
                        </strong></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>Cette application web permettra aux parents et aux élèves d&apos;organiser des événements récurrents ou ponctuels, comme du <strong>baby
                    sitting</strong> par exemple.</p>
                <p>Vous pouvez faire connaître vos besoins en termes de garde d&apos;enfant.</p>
                <p>Vous pouvez également annoncer vos disponibilités en proposant vos services.</p>
                <p>Différents types d&apos;événements sont possibles, comme le <strong>pédibus</strong> (retour à pied en petits groupes après l&apos;école en
                  suivant un itinéraire précis), le <strong>covoiturage</strong>, le <strong>soutien scolaire</strong> ou le <strong>babysitting</strong>
                  comme déjà mentionné. Si votre type d&apos;événement n&apos;est pas déjà répertorié, n&apos;hésitez pas à laisser libre cours à votre imagination en
                  sélectionnant <strong>Autre</strong>.</p>
                <p>Une fois l&apos;événement créé, d&apos;autres personnes peuvent le rejoindre.</p>
                <p>Le créateur de l&apos;événement pourra approuver ou non les participants.</p>
                <p>L&apos;application pourra être adaptée pour faciliter l&apos;inscription d&apos;élèves aux ateliers périscolaires ou pour toute autre activité liée à
                  l&apos;école.</p>
                <p>Tous les événements créés au cours de l&apos;année seront conservés dans un calendrier.</p>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour utiliser l&apos;application</h3>
                <p>L&apos;application présente un tableau d&apos;événements sous forme de blocs de tuiles.</p>
                <p>On commence par créer un nouvel événement selon vos propres critères ou en recherchant des événements qui vous correspondent.</p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image src={'/assets/img/newsletter/presentation/panneau_evenements_900x450.png'}
                  alt="Capture d'écran du panneau des événements" width="400" height="200" className={stylesPage.centeredImage} />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>Vous pouvez utiliser des filtres pour trouver des événements qui vous conviennent.</p>
                <p>En cliquant sur l&apos;une des tuiles, vous accédez au point de rendez-vous qui répertorie tous les participants de l&apos;événement.</p>
              </div>

              <div className={stylesPage.imageContainer}>
                <Image src={'/assets/img/newsletter/presentation/point_de_rencontre_900x450.png'}
                  alt="Capture d'écran du point de rencontre de l'événement" width="400" height="200" className={stylesPage.centeredImage} />
              </div>

              <div className={stylesPage.contentBlock}>
                <p>C&apos;est ici que vous pourriez ajouter des participants à un événement déjà créé.</p>
                <p>La liste interactive présentée ici propose des fonctionnalités supplémentaires pour gérer l&apos;événement.</p>
                <p>Chaque ligne s&apos;agrandit pour afficher toutes les informations concernant le participant.</p>
                <p>Pour accéder à toutes les informations d&apos;un événement, vous devez être connecté.</p>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour vous guider dans l&apos;utilisation de l&apos;application</h3>
                <p>
                  Vous trouverez quelques vidéos de démonstration sur la chaîne Youtube suivante :<br />
                  <span className={stylesPage.linkHolder}>
                  <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                    href="https://www.youtube.com/watch?v=xSNt07vogjg&list=PL1bOVOV8_Gax1RhyGkHs7O1u_QDlw_z8o" target="_blank">
                    https://www.youtube.com/watch?v=xSNt07vogjg
                  </FlexLink>
                  </span>
                </p>
                <ul>
                  <li>
                    <span className={stylesPage.linkHolder}>
                      <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                        href="https://www.youtube.com/watch?v=xSNt07vogjg&list=PL1bOVOV8_Gax1RhyGkHs7O1u_QDlw_z8o&index=1" target="_blank">
                        Créer un nouvel événement
                      </FlexLink>
                    </span>
                  </li>
                  <li>
                    <span className={stylesPage.linkHolder}>
                      <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                        href="https://www.youtube.com/watch?v=yng7ofjyjR0&list=PL1bOVOV8_Gax1RhyGkHs7O1u_QDlw_z8o&index=2" target="_blank">
                        Ajouter des Participants
                      </FlexLink>
                    </span>
                  </li>
                  <li>
                    <span className={stylesPage.linkHolder}>
                      <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                        href="https://www.youtube.com/watch?v=gD53dVAUFQU&list=PL1bOVOV8_Gax1RhyGkHs7O1u_QDlw_z8o&index=3" target="_blank">
                        Contacter et valider la participation d&apos;autres membres
                      </FlexLink>
                    </span>
                  </li>
                </ul>
                <p>
                  Il y a aussi un forum de discussion pour poser des questions et suggérer des améliorations :<br />
                  <span className={stylesPage.linkHolder}>
                    <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                      href="https://chat.whatsapp.com/GRwBDXCS50xLn1t6WuZ0Rn" target="_blank">
                      https://chat.whatsapp.com/GRwBDXCS50xLn1t6WuZ0Rn
                    </FlexLink>
                  </span>
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <h3>Pour rappel l&apos;url de l&apos;application :</h3>
                <p>
                  <span className={stylesPage.linkHolder}>
                    <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                      href="https://apelasource.org" target="_blank">
                        https://apelasource.org
                    </FlexLink>
                  </span>
                </p>
                <p>Nous espérons que vous trouverez cet outil utile et qu&apos;il encouragera les élèves du collège et du lycée à faire du bénévolat ou au
                  moins à gagner de l&apos;argent de poche.</p>
                <p>Nous espérons que cette application contribuera à renforcer les liens scolaires grâce à une plus grande implication entre les
                  classNamees.</p>
              </div>

              <div className={stylesPage.contentBlock}>
                <p>Cordialement,<br />
                  Inoe Scherer<br />
                  Membre de l&apos;APE<br />
                  06 10 61 33 75</p>
              </div>

            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Email
