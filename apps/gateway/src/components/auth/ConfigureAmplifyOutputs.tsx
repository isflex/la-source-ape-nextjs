'use client';

import { Amplify, type ResourcesConfig } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';
// import { AMPLIFY_AUTH_CONFIG_V2 } from '@src/utils/amplify/configure';
Amplify.configure({
  // ...(AMPLIFY_AUTH_CONFIG_V2 as ResourcesConfig),
  ...outputs,
}, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
