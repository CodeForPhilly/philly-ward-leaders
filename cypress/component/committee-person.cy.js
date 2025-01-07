import CommitteePerson from '../../src/components/committee-person.vue'

describe('CommitteePerson Component', () => {
    beforeEach(() => {
      // Mount the component before each test
      cy.mount(CommitteePerson, {
        props: {
          fullName: 'John Doe',
          division: 3,
          address: '123 Main Street, Springfield',
          title: 'Chairman',
          email: 'johndoe@example.com'
        }
      });
    });
  
    it('renders the full name correctly', () => {
      cy.get('.title.is-4').should('contain.text', 'John Doe');
    });
  
    it('renders the division with ordinal formatting', () => {
      cy.get('.subtitle.is-6 span:first').should('contain.text', '3rd Division');
    });
  
    it('renders the title when provided', () => {
      cy.get('.subtitle.is-6').should('contain.text', '& Chairman');
    });
  
    it('does not render the title when not provided', () => {
      cy.mount(CommitteePerson, {
        props: {
          fullName: 'John Doe',
          division: 3,
          address: '123 Main Street, Springfield',
          email: 'johndoe@example.com'
        }
      });
      cy.get('.subtitle.is-6').should('not.contain.text', '&');
    });
  
    it('renders the address correctly', () => {
      cy.get('address').should('contain.text', '123 Main Street, Springfield');
    });
  
    it('renders the email as a mailto link when provided', () => {
      cy.get('a[href="mailto:johndoe@example.com"]').should('contain.text', 'johndoe@example.com');
    });
  
    it('does not render the email link when not provided', () => {
      cy.mount(CommitteePerson, {
        props: {
          fullName: 'John Doe',
          division: 3,
          address: '123 Main Street, Springfield',
          title: 'Chairman'
        }
      });
      cy.get('a[href^="mailto:"]').should('not.exist');
    });
  });
  