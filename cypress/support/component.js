import { mount } from 'cypress/vue';
import "cypress-real-events";

Cypress.Commands.add('mount', mount);
