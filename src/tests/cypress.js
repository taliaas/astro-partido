describe('Flujo completo: Login -> Cargar acta -> Procesar -> Ver resultados', () => {
    it('debería permitir al usuario loguearse, cargar un acta y visualizar los indicadores procesados', () => {
        // 1. Ir al login
        cy.visit('/login');

        // 2. Llenar credenciales
        cy.get('input[name=email]').type('secretario@pcc.cujae.cu');
        cy.get('input[name=password]').type('contrasenaSegura123');
        cy.get('button[type=submit]').click();

        // 3. Verificar que llegó al dashboard
        cy.url().should('include', '/dashboard');

        // 4. Navegar al módulo de actas
        cy.get('a[href="/actas"]').click();

        // 5. Cargar un acta
        cy.get('input[type="file"]').selectFile('cypress/fixtures/acta_ejemplo.pdf', { force: true });
        cy.get('select[name="tipoActa"]').select('Ordinaria');
        cy.get('button').contains('Cargar Acta').click();

        // 6. Esperar que se procesen los indicadores
        cy.get('.loading-indicadores', { timeout: 15000 }).should('not.exist');

        // 7. Ver los resultados del procesamiento
        cy.get('.indicadores-extraidos').should('contain', 'Disciplina');
        cy.get('.indicadores-extraidos').should('contain', 'Cumplimiento de tareas');

        // 8. Validar y guardar
        cy.get('button').contains('Aceptar Indicadores').click();

        // 9. Confirmar retroalimentación del sistema
        cy.get('.toast-message').should('contain', 'Acta procesada y guardada correctamente');
    });
});
