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
                <h2>Chers parents,</h2>
                <p>
                  L&apos;Association des Parents d&apos;Elèves (APE) de La Source vous donne rendez-vous pour un temps de convivialité et de partage :
                </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%" className={stylesPage.outlookFix}>
                  <tbody>
                    <tr>
                      <td align="center">
                        <p>
                          <strong>
                            Vendredi 21 mars au café Le Central (26 rue Marcel Allégot à Meudon) entre 8h30 et 9h30.
                          </strong>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={stylesPage.contentBlock}>
                <p>Au plaisir de vous retrouver,</p>
                <p>Les membres du Conseil d&apos;Administration de l&apos;APE </p>
              </div>

              <div className={stylesPage.contentBlock}>
                <p>NB : Les cafés-rencontres entre parents de La Source ont lieu régulièrement dans l&apos;année. Si vous ne pouvez pas être présents cette fois-ci, vous pourrez nous rejoindre lors des prochains cafés !</p>
              </div>

            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Email
