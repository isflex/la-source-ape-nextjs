'use client';

import React, { useEffect, useState } from 'react';
import { I18n, Hub } from 'aws-amplify/utils';
import { Authenticator, useAuthenticator, translations, ThemeProvider, type Theme } from '@aws-amplify/ui-react';
import { signUp, confirmSignUp, autoSignIn, type SignUpOutput, type SignUpInput, type ConfirmSignUpInput } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames'
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Divider } from '@flex-design-system/react-ts/client-sync-styled-direct/divider';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import {
  IconName,
  IconSize,
  IconPosition,
  IconStatus,
  StatusIcon
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { Link } from '@flex-design-system/react-ts/client-sync-styled-direct/link';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { View } from '@flex-design-system/react-ts/client-sync-styled-direct/view';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import CustomGoogleButton from '@src/components/auth/CustomGoogleButton';

// Configure translations
I18n.putVocabularies(translations)
I18n.setLanguage('fr')

// Debug logging for auth flow
const debugAuth = (message: string, data?: any) => {
  console.log(`[AUTH DEBUG] ${message}`, data || '');
};

function setupAuthListener() {
  Hub.listen('auth', async (data) => {
    debugAuth(`Hub event: ${data.payload.event}`, data.payload);

    // "signInWithRedirect" | "signInWithRedirect_failure" | "tokenRefresh" | "tokenRefresh_failure" | "customOAuthState" | "signedIn" | "signedOut"
    switch (data.payload.event) {
      case 'signedIn':
        debugAuth('SignIn event detected', data.payload);
        break;
      case 'signedIn':
        debugAuth('SignOut event detected', data.payload);
        break;
      case 'tokenRefresh':
        debugAuth('Token refresh detected', data.payload);
        break;
      case 'tokenRefresh_failure':
        debugAuth('Token refresh failed', data.payload);
        break;
      case 'signInWithRedirect':
        debugAuth('SignInwithRedirect detected', data.payload);
        break;
      case 'signInWithRedirect_failure':
        debugAuth('SignInWithRedirect failed', data.payload);
        break;
      case 'customOAuthState':
        debugAuth('Custom OAuth State', data.payload);
        break;
      default:
        debugAuth(`Other auth event: ${data.payload.event}`, data.payload);
        break;
    }
  });
}

// Initialize auth listener
setupAuthListener();
I18n.putVocabularies({
  // https://github.com/aws-amplify/amplify-ui/blob/main/packages/ui/src/i18n/dictionaries/authenticator/fr.ts
  fr: {
    // SignIn
    'Sign In': 'Connexion sécurisée', // Tab header
    'Sign in': 'Se connecter', // Button label
    'Sign in to your account': 'Connectez-vous à votre compte', // Header text
    'Username (Label)': `Nom d'utilisateur`,
    'Username (Placeholder)': `Saisissez votre nom d'utilisateur`,
    'Password (Label)': 'Mot de passe',
    'Password (Placeholder)': 'Saisissez votre mot de passe',
    'Forgot your password?': 'Réinitialiser votre mot de passe',
    'There is already a signed in user.': 'Vous êtes déjà connecté. Actualiser la page.',
    'User does not exist.': `L'utilisateur n'existe pas. Veuillez créer votre compte.`,
    // SignUp
    'Create Account': `Créer mon compte`, // Tab header
    'Sign Up': `S'inscrire`, // Button label
    'Create a new account': 'Créer un nouveau compte', // Header text
    'Email (Label)': 'Adresse email',
    'Email (Placeholder)': 'Saisissez votre adresse email',
    'Phone Number (Label)': 'Numéro mobile',
    'Phone Number (Placeholder)': 'Saisissez votre numéro de mobile',
    'Confirm Password (Label)': 'Confirmation de mot de passe',
    'Confirm Password (Placeholder)': 'Saisissez votre mot de passe de nouveau',
    'GivenName (Label)': 'Prénom',
    'GivenName (Placeholder)': 'Saisissez votre prénom',
    'FamilyName (Label)': 'Nom',
    'FamilyName (Placeholder)': 'Saisissez votre nom',
    'username is required to signUp': 'Vous devez saisir une adresse email',
    // 'username is required to signUp': 'Il faut renseigner une adresse email ou un numéro de téléphone',
    // VerifyUser
    'Account recovery requires verified contact information': 'La récupération du compte nécessite des informations de contact vérifiées',
    Skip: 'Passer cet étape',
    // Forgot Password
    'Reset your password': 'Mot de passe oublié ?', // Link text
    'Forgotten password': 'Réinitialisez votre mot de passe', // Header text
    'Account username (Label)': `Nom d'utilisateur lié au compte`,
    'Enter your account username (Placeholder)': `Saisissez votre nom d'utilisateur`,
    // 'Enter your username (Placeholder)': `Saisissez votre nom d'utilisateur ou votre adresse e-mail`,
    'Send code': 'Envoyer le code',
    'Back to Sign In': 'Retour à la connexion',
    'Enter Information': 'Saisir les informations',
    // ConfirmResetPassword
    'Confirm code (Label)': 'Code de vérification',
    'Confirm code (Placeholder)': 'Entrez votre code de vérification',
    'Send code again': 'Renvoyer le code à nouveau',
    'Account password (Label)': `Nouveau mot de passe`,
    'Enter your account password (Placeholder)': `Saisissez votre nouveau mot de passe`,
    'Confirm Account password (Label)': `Confirmation de mot de passe`,
    'Confirm account password (Placeholder)': `Confirmez votre nouveau mot de passe`,
    // Validation Errors
    'Password must have at least 8 characters': 'Le mot de passe doit comporter au moins 8 caractères',
    "Cannot read properties of undefined (reading 'replace')": 'Veuillez fournir un numéro de mobile',
    'Attribute value for phone_number must not be null': 'Veuillez fournir un numéro de mobile',
    'Invalid phone number format.': "Le format du numéro mobile n'est pas valide",
    'Username cannot be of email format, since user pool is configured for email alias.':
      "Veuillez fournir un nom d'utilisateur qui diffère de l'adresse email",
  },
})

const theme: Theme = {
  name: 'flex-override-theme-gateway',
  tokens: {
    components: {
      button: {
        primary: {
          color: { value: 'var(--flex-primary-invert, #fff)' },
          borderColor: { value: 'var(--flex-primary, #fe544b)' },
          backgroundColor: { value: 'var(--flex-primary, #fe544b)' },
          _hover: {
            borderColor: { value: '#fe544bcc' },
            backgroundColor: { value: '#fe544bcc' },
          },
        },
      },
      input: {
        color: { value: 'var(--flex-input-color, #25465f)' },
        borderColor: { value: 'var(--flex-input-border-color, rgba(37, 70, 95, 0.4))' },
        // backgroundColor: { value: 'var(--flex-input-border-color, rgba(37, 70, 95, 0.4))'},
        _focus: {
          borderColor: { value: 'var(--flex-link-hover, #109db9)' },
          // borderColor: { value: 'var(--flex-input-hover-border-color, #25465f)' },
        },
      },
    },
  },
}

// Custom authentication services
const authServices = {
  async handleSignUp(formData: SignUpInput) {
    debugAuth('Starting signup process', { username: formData.username });

    if (!formData.password) {
      throw new Error('Password is required');
    }

    try {
      const { isSignUpComplete, userId, nextStep }: SignUpOutput = await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: formData.options?.userAttributes || {},
          autoSignIn: true, // Enable auto sign-in after confirmation
        },
      });

      debugAuth('Signup response', { isSignUpComplete, userId, nextStep });

      if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        const _deliveryMedium = nextStep?.codeDeliveryDetails?.deliveryMedium || 'email'
        debugAuth(`Signup requires confirmation - ${_deliveryMedium} should be sent`);
      }

      return { isSignUpComplete, userId, nextStep };
    } catch (error) {
      debugAuth('Signup error', error);
      throw error;
    }
  },

  async handleConfirmSignUp(formData: ConfirmSignUpInput) {
    debugAuth('Starting confirmation process', { username: formData.username });

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: formData.username,
        confirmationCode: formData.confirmationCode,
      });

      debugAuth('Confirmation response', { isSignUpComplete, nextStep });

      // Let the Hub listener handle autoSignIn
      if (nextStep?.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        debugAuth('Confirmation complete, autoSignIn should be triggered by Hub');
      } else if (isSignUpComplete) {
        debugAuth('Sign-up complete', { nextStep });
      }

      return { isSignUpComplete, nextStep };
    } catch (error) {
      debugAuth('Confirmation error', error);
      throw error;
    }
  },
};

function AuthenticatedContent() {
  const { signOut, user } = useAuthenticator();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      // Get return URL from params (now properly restored after OAuth)
      let returnUrl = searchParams.get('returnUrl');

      // Fallback to sessionStorage (legacy support)
      if (!returnUrl) {
        returnUrl = sessionStorage.getItem('amplify-oauth-returnUrl');
        sessionStorage.removeItem('amplify-oauth-returnUrl'); // Clean up
      }

      // Default fallback
      if (!returnUrl) {
        returnUrl = '/newsletter/souscrire/';
      }

      router.push(returnUrl);
    }
  }, [user, router, searchParams]);

  return (
    <InfoBlock>
      <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
        <Title level={TitleLevel.LEVEL3}>Connexion réussie !</Title>
      </InfoBlockHeader>
      <InfoBlockContent>
        <Text>Redirection en cours...</Text>
      </InfoBlockContent>
    </InfoBlock>
  );
}

interface AuthPageProps {
  nonce: string
}

export default function AuthPage({ nonce }: AuthPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle parameter preservation for OAuth flow
  React.useEffect(() => {
    // Check if this is an OAuth callback (has code & state but no other params)
    const hasOAuthParams = searchParams.has('code') && searchParams.has('state');
    const hasOnlyOAuthParams = Array.from(searchParams.keys()).every(key => ['code', 'state'].includes(key));

    if (hasOAuthParams && hasOnlyOAuthParams) {
      // This is an OAuth redirect - restore original params from sessionStorage
      const originalParamsStr = sessionStorage.getItem('amplify-oauth-original-params');
      if (originalParamsStr) {
        try {
          const originalParams = JSON.parse(originalParamsStr);

          console.log('[AUTH_PAGE] Restoring original params:', originalParams);

          // Build new URL with original params plus OAuth params
          const currentUrl = new URL(window.location.href);

          // Add original params back
          Object.entries(originalParams).forEach(([key, value]) => {
            currentUrl.searchParams.set(key, value as string);
          });

          // Use router.replace to trigger React re-render
          router.replace(currentUrl.pathname + currentUrl.search);

          // Clean up sessionStorage
          sessionStorage.removeItem('amplify-oauth-original-params');
        } catch (error) {
          console.error('[AUTH_PAGE] Error parsing original params:', error);
        }
      }
    } else if (!hasOAuthParams) {
      // Initial auth access - store all params for later restoration
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });

      if (Object.keys(allParams).length > 0) {
        sessionStorage.setItem('amplify-oauth-original-params', JSON.stringify(allParams));
        console.log('[AUTH_PAGE] Stored original params for OAuth:', allParams);
      }
    }
  }, [searchParams, router]);

  // Determine auth mode from URL parameters (now properly restored)
  const mode = searchParams.get('mode') || 'user'; // Default to user for backward compatibility
  const isAdminMode = mode === 'admin';
  const isUserMode = mode === 'user';

  // Configure authenticator based on mode
  const hideSignUp = isAdminMode; // Admin mode hides signUp, user mode allows it
  const pageTitle = isAdminMode ? 'Connexion Administrateur' : 'Connexion Utilisateur';

  const components = {
    SignIn: {
      Header: () => {
        if (!isUserMode) return null
        return (
          <View className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
            <Title level={3} className={flexStyles.hasTextCentered}>
              {I18n.get('Sign in to your account')}
            </Title>
            <div className={flexStyles.isFullwidth} style={{ padding: '0 2rem' }}>
              <CustomGoogleButton mode={mode} btnText={`Se connecter avec Google`} />
              <Divider content='Ou' />
            </div>
          </View>
        )
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator()

        if (!isUserMode) return null

        return (
          <View className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
            <small><Link onClick={() => toForgotPassword()}>{I18n.get('Reset your password')}</Link></small>
          </View>
        )
      },
    },
    SignUp: {
      Header: () => {
        if (!isUserMode) return null
        return (
          <View className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
            <Title level={3} className={flexStyles.hasTextCentered}>
              {I18n.get('Create a new account')}
            </Title>
            <div className={flexStyles.isFullwidth} style={{ padding: '0 2rem' }}>
              <CustomGoogleButton mode={mode} btnText={`S'inscrire avec Google`} />
              <Divider content='Ou' />
            </div>
          </View>
        )
      },
      Footer() {
        const { toSignIn } = useAuthenticator()

        if (!isUserMode) return null

        return (
          <View className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter)}>
            <small><Link onClick={() => toSignIn()}>{I18n.get('Back to Sign In')}</Link></small>
          </View>
        )
      },
    }
  }

  return (
    <Container>
      <Section>
        <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
          {pageTitle}
        </Title>

        <div {...(isAdminMode && { ['data-admin-mode']: true })} {...(isUserMode && { ['data-user-mode']: true })}>
          <ThemeProvider theme={theme} colorMode={'dark'} nonce={nonce} >
            <Authenticator
              hideSignUp={hideSignUp}
              signUpAttributes={isUserMode ? ['given_name', 'family_name', 'email'] : []}
              services={authServices}
              socialProviders={[]} // Disable built-in social provider
              components={components}
              formFields={{
                signUp: {
                  given_name: {
                    label: 'Prénom',
                    placeholder: 'Saisissez votre prénom',
                    order: 1,
                    isRequired: true,
                    type: 'text',
                    // autoComplete:: 'given-name',
                  },
                  family_name: {
                    label: 'Nom',
                    placeholder: 'Saisissez votre nom',
                    order: 2,
                    isRequired: true,
                    type: 'text',
                    // autoComplete:: 'family-name',
                  },
                  email: {
                    label: 'Adresse email',
                    placeholder: 'Saisissez votre adresse email',
                    order: 3,
                    isRequired: true,
                    type: 'email',
                    // autoComplete:: 'username',
                  },
                  // phone_number: { // Disabled until SNS production access
                  //   label: 'Numéro mobile (optionnel)',
                  //   placeholder: 'Saisissez votre numéro de mobile',
                  //   order: 4,
                  //   isRequired: false,
                  //   type: 'tel',
                  //   dialCode: '+33',
                  // },
                  password: {
                    label: 'Mot de passe',
                    placeholder: 'Saisissez votre mot de passe',
                    order: 4,
                    isRequired: true,
                    type: 'password',
                    // autoComplete:: 'new-password',
                  },
                  confirm_password: {
                    label: 'Confirmation de mot de passe',
                    placeholder: 'Confirmez votre mot de passe',
                    order: 5,
                    isRequired: true,
                    type: 'password',
                    // autoComplete:: 'new-password',
                  },
                },
              }}
            >
              <AuthenticatedContent />
            </Authenticator>
          </ThemeProvider>
        </div>
      </Section>
    </Container>
  );
}
