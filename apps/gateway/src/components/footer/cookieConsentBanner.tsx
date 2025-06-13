// https://posthog.com/tutorials/react-cookie-banner

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  Box,
  // BoxContent,
  Link as FlexLink,
  Text,
  // Title,
  // TitleLevel,
  // VariantState,
  Icon,
  IconSize,
  IconPosition,
  IconName,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/footer.module.scss'

interface BannerProps {
  logoFlexInView: boolean
}

export function cookieConsentGiven() {
  if (!localStorage.getItem('cookie_consent')) {
    return 'undecided';
  }
  return localStorage.getItem('cookie_consent');
}

export const Banner: React.FC<BannerProps> = ({ logoFlexInView }) => {
  const [consentGiven, setConsentGiven] = useState<string>('');

  useEffect(() => {
    setConsentGiven(cookieConsentGiven() || '');
  }, []);

  useEffect(() => {
    if (consentGiven !== '') {
      posthog.set_config({ persistence: consentGiven === 'yes' ? 'localStorage+cookie' : 'memory' });
    }
  }, [consentGiven]);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'yes');
    setConsentGiven('yes');
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookie_consent', 'no');
    setConsentGiven('no');
  };

  return (
    <div className={classNames(stylesPage.cookiesConsentContainer, logoFlexInView && stylesPage.atFooterBottom)}>
      {consentGiven === 'undecided' && (
        <div className={stylesPage.cookiesConsentHolder}>
          <Box className={classNames(flexStyles.isPaddingless, flexStyles.isFlat, flexStyles.isFlatFlexPurple, flexStyles.isGreyDark)}>
            <div style={{ padding: '0 0.5rem'}}>
              <Icon
                content={
                  <Text className={classNames(flexStyles.isSize8)} style={{ margin: '1em 0'}}>
                    En poursuivant votre navigation sur ce site, vous acceptez l&apos;utilisation de cookies purement fonctionnels pour vous garantir
                    une meilleure expérience d&apos;utilisation. Les statistiques anonymes recueillis sont utilisées pour détecter les erreurs
                    lorsqu&apos;elles se produisent. Aucune donnée n&apos;est partagée avec un tiers.
                    <span className={stylesPage.cookiesConsentBtnHolder}>
                      {/* <Button small variant={VariantState.FLEX_PINK} onClick={handleAcceptCookies}>Accepter les cookies</Button> */}
                      {/* <Button small onClick={handleDeclineCookies}>Refuser les cookies</Button> */}
                      <span>
                        <FlexLink onClick={handleAcceptCookies}>
                          Accepter les cookies
                        </FlexLink>
                      </span>
                      <span>
                        <FlexLink onClick={handleDeclineCookies}>
                          Refuser les cookies
                        </FlexLink>
                      </span>
                    </span>
                  </Text>
                }
                size={IconSize.SMALL}
                position={IconPosition.LEFT}
                name={IconName.UI_INFO_CIRCLE}
              />
            </div>
          </Box>
        </div>
      )}
    </div>
  )
}
