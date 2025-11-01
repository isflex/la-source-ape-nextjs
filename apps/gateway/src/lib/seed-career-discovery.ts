'use client';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export async function seedCareerDiscoveryTemplate() {
  try {
    // Check if template already exists
    const existingTemplates = await client.models.CareerDiscoveryTemplate.list();
    const existing2025Template = existingTemplates.data?.find(t => t.year === '2025-2026');

    if (existing2025Template) {
      console.log('Template 2025-2026 already exists');
      return existing2025Template;
    }

    // Create the default template for 2025-2026
    const defaultTemplate = await client.models.CareerDiscoveryTemplate.create({
      year: '2025-2026',
      title: 'Découverte des métiers (2025-2026)',
      subtitle: 'Des présentations des métiers pour le niveau II le lundi 8 décembre, de 8h45 à 9h30.',
      availabilityOptions: [
        'Pour la présentation des métiers du 8 décembre 2025 de 8h45 à 9h30',
        'Pour la présentation des métiers du 9 février 2026 avec priorité aux femmes faisant un métier "dit d\'homme"',
        'Pour une présentation des métiers ultérieure'
      ],
      isActive: true,
    });

    console.log('Default template created successfully:', defaultTemplate);
    return defaultTemplate.data;

  } catch (error) {
    console.error('Error creating default template:', error);
    throw error;
  }
}

// Helper function to get the active template
export async function getActiveTemplate() {
  try {
    const templates = await client.models.CareerDiscoveryTemplate.list();
    return templates.data?.find(t => t.isActive) || null;
  } catch (error) {
    console.error('Error fetching active template:', error);
    return null;
  }
}

// Helper function to get all responses for a specific year
export async function getResponsesByYear(year: string) {
  try {
    const responses = await client.models.CareerDiscoveryResponse.list();
    return responses.data?.filter(r => r.templateYear === year) || [];
  } catch (error) {
    console.error('Error fetching responses:', error);
    return [];
  }
}