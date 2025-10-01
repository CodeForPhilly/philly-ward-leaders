let store;  
describe('E2E Tests', () => {
  let demLeader;
  let repLeader;
  let demURL;
  let repURL;
  // Set indices for Leaders used in tests
  const demIndex = 22;
  const repIndex = 46;
  
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
        demLeader = democrats[demIndex];
        repLeader = republicans[repIndex];
        
        // Update ward if subward for selected leader is not null
        demLeader.ward = !demLeader.subWard ? demLeader.ward : `${demLeader.ward}${demLeader.subWard}`;
        repLeader.ward = !repLeader.subWard ? repLeader.ward : `${repLeader.ward}${repLeader.subWard}`;

        demURL = `/leaders/democratic/${demLeader.ward}/${demLeader.fullName.replace(/\s/g, '-').toLowerCase()}`
        repURL = `/leaders/republican/${repLeader.ward}/${repLeader.fullName.replace(/\s/g, '-').toLowerCase()}`
        
        // Check data on page for randomly selected leader matches API response and validate correct leader page opens when clicking on leader
        cy.get('.column').should('have.length', democrats.length);
        cy.get('.column').eq(demIndex).within( () => {
          cy.get('h3').should('contain',demLeader.fullName);
          cy.get('.is-info')
            .invoke('attr', 'href')
            .should('eq', demURL );
        });
        
        cy.visit('/leaders/democratic'); // Goes back to Leaders page
        
        cy.get('.tabs ul a').eq(2).click(); // Open Republicans Tab
        cy.get('.column').should('have.length', republicans.length);
        cy.get('.column').eq(repIndex).within( () => {
          cy.get('h3').should('contain',republicans[repIndex].fullName);
          cy.get('.is-info')
            .invoke('attr', 'href')
            .should('eq', repURL );
        });
        //
      });
    });

  });

  describe('Homepage', () => {
    it('has "Philly Ward Leaders" as the page title and clicking "Get started" navigates to "/leaders/democratic"', () => {
      cy.visit('/');
  
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

  describe('Ward Leader Page', () => {
    beforeEach(() => {
      cy.visit(`/leaders/democratic/${demLeader.ward}/${demLeader.fullName.replace(/\s/g, '-').toLowerCase()}`);
    });
  
    it('should display the leaders name and ward information', () => {
      cy.get('.hero').find('.title').should('be.visible');
      cy.get('.hero').find('.title').should('contain.text',demLeader.fullName);
      cy.get('.hero').find('.subtitle').should('contain.text', 'Ward Leader');
      cy.get('.hero').find('.subtitle').should('contain.text',demLeader.ward);
    });
  
    it('should show statistics in the stats bar', () => {
      cy.get('.stats-bar').should('be.visible');
      cy.get('.stats-bar').within(() => {
        cy.contains('Divisions');
        cy.contains('Voters');
      });
    });
  
    it('should display leaders contact details if available', () => {
      cy.get('dt').contains('Address').next('dd').should('exist');
      cy.get('dt').contains('Phone').next('dd').should('exist');
      cy.get('dt').contains('Email').next('dd').within(() => {
        cy.get('a').should('have.attr', 'href').and('include', 'mailto:');
      });
    });
  
    it('should display placeholders when information is missing', () => {
      const missingData = Object.keys(demLeader).filter(key => demLeader[key] === null || demLeader[key] === undefined);
      // Look for missing data in fields besides subward and photo
      const filteredMissingData = missingData.filter(item => !['subWard','photo'].includes(item))
      if (filteredMissingData.length > 0) {
        cy.get('.unknown').should('have.length.at.least', 1);
      }
    });
  
    it('should list committee persons with names and divisions', () => {
      cy.get('.committee-person').should('have.length.at.least', 1);
      cy.get('.committee-person').first().within(() => {
        cy.get('.title').should('be.visible');
        cy.get('.subtitle').should('be.visible');
        cy.get('.content').should('be.visible');
      });
    });
  
    it('should show social media links if available', () => {
      cy.get('dt').contains('Social Media').next('dd').within(() => {
        cy.get('a').should('have.length.at.least', 1);
      });
    });
  });
  
  
});
