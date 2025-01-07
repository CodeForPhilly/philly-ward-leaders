import BaseballCard from '../../src/components/baseball-card/index.vue';

describe('BaseballCard Component', () => {
  it('renders correctly with props', () => {
    const props = {
      name: 'John Doe',
      ward: 1,
      subWard: 'A',
      party: 'democratic',
      photo: 'https://example.com/photo.jpg',
      registeredVotersParty: 1000,
      turnoutParty: 400,
      turnoutTotal: 600,
      divisionCount: 30,
      committeePersonCount: 25,
    };

    cy.mount(BaseballCard, { props });

    // Verify basic rendering
    cy.get('.stats h3').contains('John Doe');
    cy.get('.ward-ordinal').contains('1st Ward A');
    cy.get('dt').contains('Voters (D)');
    cy.get('dd').contains('1,000');
    cy.get('dt').contains('Turnout (D)');
    cy.get('dd').contains('40%');
  });

  it('computes the correct URL', () => {
    const props = {
      name: 'Jane Doe',
      ward: 3,
      subWard: 'B',
      party: 'republican',
      registeredVotersParty: 500,
      turnoutParty: 200,
      turnoutTotal: 300,
      divisionCount: 10,
      committeePersonCount: 15,
    };

    cy.mount(BaseballCard, { props });
    cy.get(".button").should('have.attr', 'to', '/leaders/republican/3B/jane-doe');
  });

  it('renders fallback values for missing data', () => {
    const props = {
      name: 'Anonymous',
      ward: 4,
      party: 'independent',
    };

    cy.mount(BaseballCard, { props });

    cy.get('dt').contains('Voters (I)');
    cy.get('dd').contains('Unknown');
    cy.get('dt').contains('Turnout (I)');
    cy.get('dd').contains('Unknown');
    cy.get('dt').contains('Vacancies');
    cy.get('dd').contains('Unknown');
  });

  it('responds to hover interactions', () => {
    const props = {
      name: 'Hover Test',
      ward: 5,
      party: 'democratic',
    };

    cy.mount(BaseballCard, { props });

    // // Simulate hover interaction
    cy.get('.front').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
    
    // Check that the back side is rotated out of view
    cy.get('.back').should('have.css', 'transform', 'matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)');
  

    cy.get('.flip-container').trigger('mouseover');
    
    // Check that the back side is now visible
    cy.get('.back').should('have.css', 'transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    
    // Check that the front side is now rotated out of view
    cy.get('.front').should('have.css', 'transform', 'matrix3d(-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
  
  });
})
