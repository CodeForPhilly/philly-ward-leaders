import { mount } from 'cypress/vue';
import  Api  from '../../src/api';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '../../src/config'
const api = new Api(CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN)

Cypress.Commands.add('mount', mount);
Cypress.Commands.add('fetchLeaders', () => {
    return cy.wrap(api.fetchLeaders());
});
