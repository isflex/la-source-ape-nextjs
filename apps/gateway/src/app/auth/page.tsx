'use client';

import React, { useEffect, useState } from 'react';
import { I18n } from 'aws-amplify/utils';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import { signUp, confirmSignUp, autoSignIn, type SignUpOutput, type SignUpInput, type ConfirmSignUpInput } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Section, Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-default';

// Configure translations
I18n.putVocabularies(translations)
I18n.setLanguage('fr')

// Debug logging for auth flow
const debugAuth = (message: string, data?: any) => {
  console.log(`[AUTH DEBUG] ${message}`, data || '');
};
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
        debugAuth('Signup requires confirmation - email should be sent');
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

      // Handle auto sign-in after confirmation (like Gen 1 implementation)
      if (isSignUpComplete) {
        debugAuth('Triggering auto sign-in');
        try {
          const signInResult = await autoSignIn();
          debugAuth('Auto sign-in successful', signInResult);
        } catch (autoSignInError) {
          debugAuth('Auto sign-in failed', autoSignInError);
          // Don't throw the error, let the user sign in manually
        }
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
      // Get return URL from params, or from sessionStorage if OAuth redirect cleared the URL
      let returnUrl = searchParams.get('returnUrl');

      if (!returnUrl) {
        // Check sessionStorage for preserved returnUrl from before OAuth redirect
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
    <div>
      <p>Connexion réussie ! Redirection en cours...</p>
      <button onClick={signOut}>Se déconnecter</button>
    </div>
  );
}

export default function AuthPage() {
  const searchParams = useSearchParams();

  // Store returnUrl in sessionStorage when auth page loads (before OAuth redirect)
  React.useEffect(() => {
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      sessionStorage.setItem('amplify-oauth-returnUrl', returnUrl);
    }
  }, [searchParams]);

  // Determine auth mode from URL parameters
  const mode = searchParams.get('mode') || 'admin'; // Default to admin for backward compatibility
  const isAdminMode = mode === 'admin';
  const isUserMode = mode === 'user';

  // Configure authenticator based on mode
  const hideSignUp = isAdminMode; // Admin mode hides signUp, user mode allows it
  const pageTitle = isAdminMode ? 'Connexion Administrateur' : 'Connexion Utilisateur';

  return (
    <Container>
      <Section>
        <Title level={TitleLevel.LEVEL1}>
          {pageTitle}
        </Title>

        <Authenticator
          hideSignUp={hideSignUp}
          signUpAttributes={isUserMode ? ['given_name', 'family_name', 'email'] : []}
          services={authServices}
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
      </Section>
    </Container>
  );
}
