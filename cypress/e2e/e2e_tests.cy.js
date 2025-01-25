let store;  
describe('E2E Tests', () => {
    describe('Notifications', () => {
      beforeEach(() => {
        // Visit the app before each test
        cy.visit('/').then(win => store = win.store)
      });
      it('Displays a notification', () => {
        const message = 'Hello, world!';
  
        // Trigger the NOTIFY action via UI interaction
        cy.wait(500)
          .then(() => store.dispatch('NOTIFY', message));
  
        // Verify the notification is displayed
        cy.get('.notification')
          .should('be.visible')
          .and('contain.text', message);
      });
  
      it('Removes notification after timer', () => {
        const message = 'This will disappear';
  
        // Trigger the NOTIFY action
        cy.wait(500)
          .then(() => store.dispatch('NOTIFY', message));
  
        // Verify the notification appears and disappears
        cy.get('.notification').should('be.visible');
        cy.wait(6000); // Timeout is set to 5000 in NOTIFY action
        cy.get('.notification').should('not.exist');
      });
    });

    describe('Ward Leaders', () => {
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
  
          cy.get('.column').should('have.length', democrats.length);
          cy.get('.tabs ul a').eq(2).click();
          cy.get('.column').should('have.length', republicans.length);
      });
  });
  
  });
});
