import Notification from '../../src/components/notification.vue'

describe('Notification Component', () => {
    const message = 'This is a danger notification!';
  
    beforeEach(() => {
      // Mount the component before each test
      cy.mount(Notification, {
        props: {
          msg: message,
        }
      });
    });
  
    it('renders the notification message correctly', () => {
      cy.get('.notification.is-danger').should('contain.text', message);
    });
  
    it('emits the dismiss event when the delete button is clicked', () => {
      const onDismissSpy = cy.spy().as('onDismissSpy');
  
      cy.mount(Notification, {
        props: {
          msg: message,
          onDismiss: onDismissSpy
        }
      });
  
      cy.get('.delete').click();
      cy.get('@onDismissSpy').should('have.been.calledOnce');
    });

  });
  