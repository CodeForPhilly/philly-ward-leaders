let store;  
describe('E2E Tests', () => {
   
  describe('Ward Leaders List', () => {
    beforeEach(() => {
      // Visit the page before each test
      cy.visit('/leaders/democratic')
    });
    
    it('should display the hero component', () => {
      cy.get('.hero-body').should('exist');
    });
    
    it('Tabs should render with correct labels and flip visibility on click', () => {
      cy.get('ul').find('a').debug();
      cy.get('.tabs ul').within(() => {
        // Check Base State (Democrat)
        cy.get('a').should('have.length', 4); // Assert 2 tabs exist
        cy.get('a').eq(1).should('contain.text', 'Democrats'); // First tab
        cy.get('a').eq(0).should('have.class', 'is-active');
        cy.get('a').eq(3).should('contain.text', 'Republicans'); // Second tab
        cy.get('a').eq(2).should('not.have.class', 'is-active');
        
        // Check State after clicking on Republican Tab
        cy.get('a').eq(2).click()
        cy.get('a').eq(2).should('have.class', 'is-active');
        cy.get('a').eq(0).should('not.have.class', 'is-active');
      });
  });
  
  it('Ward Leader data must be displayed correctly', () => {
    cy.fetchLeaders().then((leaders) => {
        const republicans = leaders.filter((leader) => leader.party === 'republican');
        const democrats = leaders.filter((leader) => leader.party === 'democratic');
        // Select random leader for each party
        const [demIndex,repIndex] = [democrats,republicans].map(party => Math.floor(Math.random() * party.length))
        const demLeader = democrats[demIndex];
        const repLeader = republicans[repIndex];
        
        // Update ward if subward for selected leader is not null
        demLeader.ward = !demLeader.subWard ? demLeader.ward : `${demLeader.ward}${demLeader.subWard}`;
        repLeader.ward = !repLeader.subWard ? repLeader.ward : `${repLeader.ward}${repLeader.subWard}`;
        
        // Check data on page for randomly selected leader matches API response and validate correct leader page opens when clicking on leader
        cy.get('.column').should('have.length', democrats.length);
        cy.get('.column').eq(demIndex).within( () => {
          cy.get('h3').should('contain',demLeader.fullName);
          cy.get('.is-info')
            .invoke('attr', 'href')
            .should('eq', `/leaders/democratic/${demLeader.ward}/${demLeader.fullName.replace(/\s/g, '-').toLowerCase()}`);
        });
        
        cy.visit('/leaders/democratic'); // Goes back to Leaders page
        
        cy.get('.tabs ul a').eq(2).click(); // Open Republicans Tab
        cy.get('.column').should('have.length', republicans.length);
        cy.get('.column').eq(repIndex).within( () => {
          cy.get('h3').should('contain',republicans[repIndex].fullName);
          cy.get('.is-info')
            .invoke('attr', 'href')
            .should('eq', `/leaders/republican/${repLeader.ward}/${repLeader.fullName.replace(/\s/g, '-').toLowerCase()}`);
        });
        //
      });
    });

  });

  describe('Homepage', () => {
    it('has "Philly Ward Leaders" as the page title and clicking "Get started" navigates to "/leaders/democratic"', () => {
      cy.visit('http://localhost:5173');
  
      // Assert the page title
      cy.title().should('eq', 'Philly Ward Leaders');
  
      // Get the "Get started" link
      cy.contains('Get started')
        .should('have.attr', 'href', '/leaders')
        .click();
  
      // Assert the new URL contains /leaders/democratic
      cy.url().should('include', '/leaders/democratic');
    });
  });
  
});
