describe('Flujo completo: Login -> Cargar acta -> Procesar acta', () => {
  Cypress.on('uncaught:exception', () => false);

  it('Login exitoso', () => {
    cy.visit('/login')
    cy.get('input[name=email]', { timeout: 5000 })
      .should('be.visible')
      .clear()
      .type('marta0000@cujae.edu.cu');
    cy.get('input[name=password]', {timeout: 5000})
      .should('be.visible')
      .clear()
      .type('00000000');
    // Solo marca el checkbox si existe en el DOM
    cy.get('input[name=rememberMe]').then($el => {
      if ($el.length) {
        cy.wrap($el).check({ force: true }).should('be.checked');
      }
    });
    cy.get('button[type=submit]').should('be.enabled').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains('Panel de Control').should('be.visible');
 
    // Asume que ya está logueado por la prueba anterior o sesión persistente
    cy.visit('/minutes');
  cy.contains('button', 'Cargar acta')
    .should('be.visible')
    .click();

    // Verifica que se abre el Dialog de carga de actas y los elementos principales
    cy.contains('Cargar actas').should('be.visible');
    cy.contains('Seleccione el tipo de acta').should('be.visible');
    cy.get('input[type=radio][name=tipoActa][value=ro]').should('exist');
    cy.get('input[type=radio][name=tipoActa][value=cp]').should('exist');
    cy.contains('Arrastre archivos aquí').should('be.visible');
    cy.get('input[type=file][multiple][accept=".pdf,.docx"]').should('exist');
    cy.contains('Cargar archivos').should('be.visible').and('be.disabled');

    cy.get('input[type=file][multiple][accept=".pdf,.docx"]')
      .selectFile('cypress/fixtures/Acta N° 48 febrero 2023.pdf', { force: true });
    // El botón debe habilitarse tras seleccionar el archivo
    cy.contains('Cargar archivos').should('be.enabled').click();
  });
})
