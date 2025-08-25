Feature: Hbac rule settings manipulation
  Modify a Hbac rule

  #TODO add data-cy to tabs - buttons and remove the tabs file

  @test
  Scenario: Add a new rule
    Given I am logged in as admin
    And I am on "hbac-rules" page

    When I click on the "hbac-rules-button-add" button
    Then I should see "add-hbac-rule-modal" modal

    When I type in the "modal-textbox-rule-name" textbox text "rule1"
    Then I should see "rule1" in the "modal-textbox-rule-name" textbox

    When I type in the "modal-textbox-description" textbox text "my description"
    Then I should see "my description" in the "modal-textbox-description" textbox

    When I click on the "modal-button-add" button
    Then I should not see "add-hbac-rule-modal" modal
    And I should see "add-hbacrule-success" alert

    When I search for "rule1" in the data table
    Then I should see "rule1" entry in the data table
    And I should see "rule1" entry in the data table with attribute "Description" set to "my description"

  @cleanup
    Scenario: Delete a rule
    Given I delete rule "rule1"


  @test
  Scenario: Add user to Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page
    
    When I click on the "Users" tab
    Then I click on the "settings-button-add-users" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "admin" dual list item on the left

    When I click on "admin" dual list item
    Then I should see "admin" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admin" entry in the data table

  @test
  Scenario: Remove user from Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Users" tab
    Then I should see "admin" entry in the data table
    When I select entry "admin" in the data table
    When I click on the "settings-button-delete-user" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "admin" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "admin" entry in the data table

  @test
  Scenario: Add group to Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Groups" tab
    Then I click on the "settings-button-add-groups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "admins" dual list item on the left

    When I click on "admins" dual list item
    Then I should see "admins" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-group-success" alert
    Then I should see "admins" entry in the data table

  @test
  Scenario: Remove group from Who category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Groups" tab
    Then I should see "admins" entry in the data table
    When I select entry "admins" in the data table
    When I click on the "settings-button-delete-group" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "admin" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "admins" entry in the data table

  @test
  Scenario: Set User category to allow all users
    # When enabling "Allow anyone" all members need to be removed otherwise
    # the update fails
    # 1) Add a user and group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page
    When I click on the "Users" tab
    Then I click on the "settings-button-add-users" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "admin" dual list item on the left

    When I click on "admin" dual list item
    Then I should see "admin" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "admin" entry in the data table

    When I click on the "Groups" tab
    Then I click on the "settings-button-add-groups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "admins" dual list item on the left

    When I click on "admins" dual list item
    Then I should see "admins" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-group-success" alert
    Then I should see "admins" entry in the data table

    When I click on the "hbac-rules-tab-settings-checkbox-usercategory" checkbox
    When I click on the "Users" tab
    Then I should not see "admin" entry in the data table
    When I click on the "Groups" tab
    Then I should not see "admins" entry in the data table

  @seed
  Scenario: Prep: Add a new host that will be used in the tests
    Given host "my-new-host" exists

  @test
  Scenario: Add host to Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Hosts" tab
    Then I click on the "settings-button-add-hosts" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "my-new-host" dual list item on the left

    When I click on "my-new-host" dual list item
    Then I should see "my-new-host" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "my-new-host" entry in the data table

  @test
  Scenario: Remove host from Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Hosts" tab
    Then I should see "my-new-host" entry in the data table
    When I select entry "my-new-host" in the data table
    When I click on the "settings-button-delete-host" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "my-new-host" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "my-new-host" entry in the data table

  @cleanup
  Scenario: Delete host for cleanup
    Given I delete host "my-new-host"

  @test
  Scenario: Add hostgroup to Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Host groups" tab
    Then I click on the "settings-button-add-hostgroups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "ipaservers" dual list item on the left

    When I click on "ipaservers" dual list item
    Then I should see "ipaservers" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "ipaservers" entry in the data table

  @test
  Scenario: Remove hostgroup from Host category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on "Host groups" page tab
    Then I should see "ipaservers" entry in the data table
    When I select entry "ipaservers" in the data table
    When I click on the "settings-button-delete-hostgroup" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "ipaservers" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "ipaservers" entry in the data table

  @test
  Scenario: Set Host category to allow all hosts
    # This is the same test as above but for the host category
    # 1) Add a host and host group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Hosts" tab
    Then I click on the "settings-button-add-hosts" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "my-new-host" dual list item on the left

    When I click on "my-new-host" dual list item
    Then I should see "my-new-host" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "my-new-host" entry in the data table

    When I click on the "Host groups" tab
    Then I click on the "settings-button-add-hostgroups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "ipaservers" dual list item on the left

    When I click on "ipaservers" dual list item
    Then I should see "ipaservers" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-group-success" alert
    Then I should see "ipaservers" entry in the data table

    # 2) Set the category to 'all'
    When I click on the "hbac-rules-tab-settings-checkbox-hostcategory" checkbox
    When I click on the "Hosts" tab
    Then I should not see "my-new-host" entry in the data table
    When I click on the "Host groups" tab
    Then I should not see "ipaservers" entry in the data table

  @test
  Scenario: Add service to Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Services" tab
    Then I click on the "settings-button-add-services" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "crond" dual list item on the left

    When I click on "crond" dual list item
    Then I should see "crond" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "crond" entry in the data table

   
  @test
  Scenario: Remove service from Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Services" tab
    Then I should see "crond" entry in the data table
    When I select entry "crond" in the data table
    When I click on the "settings-button-delete-service" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "crond" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "crond" entry in the data table

  @test
  Scenario: Add service group to Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Service groups" tab
    Then I click on the "settings-button-add-servicegroups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "ftp" dual list item on the left

    When I click on "ftp" dual list item
    Then I should see "ftp" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "ftp" entry in the data table

  @test
  Scenario: Remove service group from Service category
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Service groups" tab
    Then I should see "ftp" entry in the data table
    When I select entry "ftp" in the data table
    When I click on the "settings-button-delete-servicegroup" button
    Then I should see "remove-hbac-rule-members-modal" modal
    Then I should see "ftp" entry in the data table
    When I click on the "modal-button-delete" button
    Then I should see "remove-member-success" alert
    Then I should not see "ftp" entry in the data table

  @test
  Scenario: Set Service category to allow all services
    # 1) Add a service and service group to the tables
    Given I am logged in as admin
    And I am on "hbac-rules/rule1" page

    When I click on the "Services" tab
    Then I click on the "settings-button-add-services" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "crond" dual list item on the left

    When I click on "crond" dual list item
    Then I should see "crond" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-member-success" alert
    Then I should see "crond" entry in the data table

    When I click on the "Service groups" tab
    Then I click on the "settings-button-add-servicegroups" button
    Then I should see "dual-list-modal" modal
    When I click on search link in dual list
    Then I should see "ftp" dual list item on the left

    When I click on "ftp" dual list item
    Then I should see "ftp" dual list item selected

    When I click on the "modal-button-add" button
    Then I should not see "dual-list-modal" modal
    And I should see "add-group-success" alert
    Then I should see "ftp" entry in the data table

    When I click on the "hbac-rules-tab-settings-checkbox-servicecategory" checkbox
    When I click on the "Services" tab
    Then I should not see "crond" entry in the data table
    When I click on the "Service groups" tab
    Then I should not see "ftp" entry in the data table


  @cleanup
  Scenario: Delete the HBAC rule for cleanup
    Given I delete rule "rule1"
