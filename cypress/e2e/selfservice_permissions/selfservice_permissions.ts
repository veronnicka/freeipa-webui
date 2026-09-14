import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("self-service permission {string} exists", (name: string) => {
  cy.ipa({
    command: "selfservice-add",
    name,
    specificOptions: "--attrs=cn",
  });
});

Given(
  "self-service permission {string} exists with permissions {string} and attribute {string}",
  (name: string, permissions: string, attribute: string) => {
    const permissionOptions = permissions
      .split(",")
      .map((permission) => `--permissions=${permission.trim()}`)
      .join(" ");

    cy.ipa({
      command: "selfservice-add",
      name,
      specificOptions: `${permissionOptions} --attrs=${attribute}`,
    });
  }
);

Given(
  "self-service permission {string} exists with permissions {string} and attributes {string}",
  (name: string, permissions: string, attributes: string) => {
    const permissionOptions = permissions
      .split(",")
      .map((permission) => `--permissions=${permission.trim()}`)
      .join(" ");
    const attributeOptions = attributes
      .split(",")
      .map((attribute) => `--attrs=${attribute.trim()}`)
      .join(" ");

    cy.ipa({
      command: "selfservice-add",
      name,
      specificOptions: `${permissionOptions} ${attributeOptions}`,
    });
  }
);

Given("I delete self-service permission {string}", (name: string) => {
  cy.ipa({
    command: "selfservice-del",
    name,
    options: { failOnNonZeroExit: false },
  });
});
