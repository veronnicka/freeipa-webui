import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { typeInTextbox } from "../common/ui/textbox";

Given("host {string} exists", (name: string) => {
  loginAsAdmin();
  navigateTo("hosts");

  cy.dataCy("hosts-button-add").click();
  cy.dataCy("add-host-modal").should("exist");

  // Set host name
  typeInTextbox("modal-textbox-host-name", name);
  cy.dataCy("modal-textbox-host-name").should("have.value", name);

  cy.dataCy("modal-checkbox-force-host").check({ force: true });

  // Submit
  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-host-modal").should("not.exist");

  searchForEntry(name);
  entryExists(name);
  logout();
});

Given("I delete host {string}", (name: string) => {
  loginAsAdmin();
  navigateTo("hosts");
  selectEntry(name);

  cy.dataCy("hosts-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("not.exist");

  searchForEntry(name);
  entryDoesNotExist(name);
  logout();
});
