import { defineFunction } from '@aws-amplify/backend';

export const imageBase64Converter = defineFunction({
  name: 'image-base64-converter',
  entry: './handler.ts',
  // Environment variables will be set by backend.ts using storage bucket reference
  runtime: 20,
  timeoutSeconds: 30,
  memoryMB: 256,
});
