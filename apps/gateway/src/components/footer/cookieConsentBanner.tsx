// https://posthog.com/tutorials/react-cookie-banner

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';

import classNames from 'classnames'
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Link as FlexLink } from '@flex-design-system/react-ts/client-sync-styled-direct/link';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import {
  Icon,
  IconSize,
  IconPosition,
  IconName
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon'
import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesPage } from '@src/styles/scss/pages/footer.module.scss'

interface BannerProps {
  logoFlexInView: boolean
}

export function cookieConsentGiven(): string {
  if (typeof window === 'undefined') {
    return 'undecided';
  }
  const consent = localStorage.getItem('cookie_consent');
  return consent || 'undecided';
}

export const Banner: React.FC<BannerProps> = ({ logoFlexInView }) => {
  const [consentGiven, setConsentGiven] = useState<string>('undecided');

  // Check localStorage after hydration to avoid hydration mismatch
  // We initialize with 'undecided' for both server and client, then update
  // from localStorage only on the client side after hydration is complete
  useEffect(() => {
    const storedConsent = cookieConsentGiven();
    if (storedConsent && storedConsent !== 'undecided') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Required to sync localStorage after hydration without causing hydration errors
      setConsentGiven(storedConsent);
    }
  }, []);

  useEffect(() => {
    if (consentGiven !== '') {
      posthog.set_config({ persistence: consentGiven === 'yes' ? 'localStorage+cookie' : 'memory' });
    }
  }, [consentGiven]);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'yes');
    setConsentGiven('yes');
    posthog.opt_in_capturing();
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookie_consent', 'no');
    setConsentGiven('no');
    posthog.opt_out_capturing();
  };

  return (
    <div className={classNames(stylesPage.cookiesConsentContainer, logoFlexInView && stylesPage.atFooterBottom)}>
      {(consentGiven === 'undecided' || posthog.get_explicit_consent_status() === 'pending') && (
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
