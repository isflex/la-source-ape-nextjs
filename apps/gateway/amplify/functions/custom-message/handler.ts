import type { CustomMessageTriggerHandler } from 'aws-lambda';

export const handler: CustomMessageTriggerHandler = async (event) => {
  console.log('CustomMessage trigger invoked with:', JSON.stringify(event, null, 2));

  if (event.triggerSource === 'CustomMessage_SignUp' || event.triggerSource === 'CustomMessage_ResendCode') {
    console.log('Processing confirmation message for user:', event.userName, 'trigger:', event.triggerSource);

    // Log user attributes to see phone/email availability
    const userAttributes = event.request.userAttributes;
    console.log('User attributes:', {
      email: userAttributes?.email,
      phone_number: userAttributes?.phone_number,
      hasPhone: !!userAttributes?.phone_number,
      hasEmail: !!userAttributes?.email
    });
    const emailMessage = `
    <div style="text-align: center;">
      <span style="font-weight: bold;">Merci de finaliser votre inscription</span>
    </div>
    <br/>
    <div style="text-align: center;">
      🚀 Votre code de vérification : ${event.request.codeParameter}
    </div>`;

    // Only configure email (SMS disabled until SNS production access)
    event.response.emailMessage = emailMessage;
    event.response.emailSubject = "Bienvenue sur l'application APE La Source";

    // SMS configuration (disabled until SNS production access):
    // const smsMessage = `Merci de finaliser votre inscription. 🚀 Votre code de vérification : ${event.request.codeParameter}`;
    // event.response.smsMessage = smsMessage;

    console.log('Confirmation messages configured:', {
      emailSubject: event.response.emailSubject,
      hasEmailMessage: !!event.response.emailMessage,
      hasSmsMessage: !!event.response.smsMessage,
      codeParameter: event.request.codeParameter
    });
  } else {
    console.log('Trigger source not for signup:', event.triggerSource);
  }

  console.log('CustomMessage handler completed');
  return event;
};
