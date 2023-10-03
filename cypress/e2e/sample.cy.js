it("should load the MAIN page of the app", () => {
  cy.visit("/");
  cy.get("button")
    .contains(/^-- ALL TEAMS --$/)
    .should("have.length", 1);
});
