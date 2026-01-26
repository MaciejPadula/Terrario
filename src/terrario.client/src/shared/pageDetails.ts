import type { PageDetails } from './models/PageDetails';

export const pageDetails: Record<string, PageDetails> = {
  dashboard: {
    nameKey: 'nav.dashboard',
    descriptionKey: 'home.welcomeMessage',
    redirectUrl: '/',
    icon: '🏠',
  },
  animals: {
    nameKey: 'nav.animals',
    descriptionKey: 'animals.manageCollection',
    redirectUrl: '/animals',
    icon: '🦎',
  },
  lists: {
    nameKey: 'nav.lists',
    descriptionKey: 'animalLists.manageLists',
    redirectUrl: '/lists',
    icon: '📋',
  },
  schedule: {
    nameKey: 'nav.schedule',
    descriptionKey: 'reminders.description',
    redirectUrl: '/schedule',
    icon: '📅',
  },
  settings: {
    nameKey: 'nav.settings',
    descriptionKey: 'settings.manageSettings',
    redirectUrl: '/settings',
    icon: '⚙️',
  },
};