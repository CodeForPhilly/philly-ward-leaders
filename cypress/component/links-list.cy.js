import linksList from "../../src/components/links-list.vue";

describe('Links List Component', () => {
  it('renders correctly with props', () => {
        const props = [
                {
                    title: 'Instagram - John Doe',
                    url: 'https://www.example.com'
                },
                {
                    title: 'LinkedIn - John Doe',
                    url: 'https://www.linkedin.com'
                }
            ]
        cy.mount(linksList, {props:{links:props}})
        // Assert it has 2 <li> children
        cy.get('li').should('have.length', 2)
        // Check URL rendering
        cy.get('li a').eq(0).should('have.attr', 'href', props[0].url)    
        cy.get('li a').eq(1).should('have.attr', 'href', props[1].url)    
    })

})