import { mount } from 'cypress/vue';
import  Api  from '../../src/api';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_ENVIRONMENT } from '../../src/config'

const api = new Api(CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_ENVIRONMENT)

Cypress.Commands.add('mount', mount);
Cypress.Commands.add('fetchLeaders', () => cy.wrap(api.fetchLeaders()));
