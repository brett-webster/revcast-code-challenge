// CYPRESS SETUP:  https://gist.github.com/textbook/3377dda14efe4449772c2377188c3fa8
// INSTALL:  'npm install cypress --save-dev'
// RUN CYPRESS TESTS in CLI:  'npm run e2e'
// CYPRESS TEST RUNNER (ELECTRON APP):  'npm run cypress:open' (time travel debugging, selector playground --> click on element to view cy.get(XX), Cypress Studio, dev tools output in browser console, etc.)
// NOTE:  Be sure to start dev server ('npm start') in separate CLI window BEFORE running Cypress e2e tests
// REFERENCE:  https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Assertions
// Custom commands:  Cypress.Commands.add():  https://docs.cypress.io/api/cypress-api/custom-commands
// DEBUGGING:  Insert cy.pause(); into code to pause execution at that point; then click forward arrow to step thru each command in Command Log... <--- https://docs.cypress.io/guides/core-concepts/cypress-app#Command-Log

import resultArr80Teams from "../fixtures/resultArr80Teams.json";

// -----------------------------*************--------------------------------

describe("Various e2e tests...", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button").first().as("TeamDropdownButton"); // Alias:  https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Aliases
    cy.get("button").eq(1).as("CustomerDropdownButton"); // Alias: Illustrative purposes ONLY
  });

  // -----------------------------*************--------------------------------

  it.only("Systematically test ALL functionality of dropdown buttons/list item selection, table header sorting and resulting table results", () => {
    cy.get("button").first().should("have.value", ""); // "" is shorthand for -- ALL TEAMS -- (i.e. no selection)
    cy.get("button").eq(1).should("have.value", ""); // "" is shorthand for -- ALL CUSTOMERS -- (i.e. no selection)
    // cy.get("@TeamDropdownButton").should("have.value", ""); // Alias - Illustrative purposes ONLY - equivalent to:  "cy.get("button").first()"
    // cy.get("@CustomerDropdownButton").should("have.value", ""); // Alias - Illustrative purposes ONLY - equivalent:  "cy.get("button").eq(1)"

    // SELECT "Thunderbolts" from TEAMS dropdown (only selection)
    // cy.get("@TeamDropdownButton") // Alias - Illustrative purposes ONLY - equivalent to: "cy.get("button").contains(/^-- ALL TEAMS --$/)"
    cy.get("button")
      .contains(/^-- ALL TEAMS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^Aqua Serpents$/) // Picking a random team from the list
      .get("li")
      .contains(/^Thunderbolts$/)
      .click();
    // ** CONFIRM TABLE RESULTS **

    // SELECT "XYZ Corporation" from CUSTOMERS dropdown (in addition to Thunderbolts TEAM selection from above)
    // cy.get("@CustomerDropdownButton") // Alias - Illustrative purposes ONLY - equivalent to: "cy.get("button").contains(/^-- ALL CUSTOMERS --$/)"
    cy.get("button")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click();
    cy.get("ul")
      .contains(/^123 Industries$/) // Picking a random customer from the list
      .get("li")
      .contains(/^XYZ Corporation$/)
      .click()
      // .debug(); // UNDOCUMENT to use debugger

    // USEFUL for DEBUGGING:  https://docs.cypress.io/guides/guides/debugging#Using-the-Developer-Tools
    // cy.pause(); // insert into code in order to step-thru each command in Command Log... <-- https://docs.cypress.io/api/commands/pause
    // cy.debug(); // insert into code to log --- Debug Info --- to CLI <-- https://docs.cypress.io/api/commands/debug (NOTE:  React Dev Tools incompatible w/ Electron in current version, so dev tools NOT working here)

    // Cypress Studio:  Interact/click to auto-generate DOM code preview for quick insertion into tests (i.e. click on DOM element in browser to generate command suggestions) <-- https://docs.cypress.io/guides/references/cypress-studio

    // ** CONFIRM TABLE RESULTS **
    // Confirm button text matches (alternatives documented out)
    cy.get("button").first().should("have.value", "Thunderbolts"); // TEAM dropdown is 1st button in DOM
    cy.get("button").eq(1).should("have.value", "XYZ Corporation"); // CUSTOMER dropdown is 2nd button in DOM (i.e. index 1 using eq())
    // cy.get("button").first().should("have.text", "Thunderbolts"); // Expects EXACT match
    // cy.get("button").first().should("not.have.text", "Thunderbolt"); // Expects EXACT match (case sensitive)
    // cy.get("button").eq(1).should("have.text", "XYZ Corporation"); // Expects EXACT match
    // cy.get("button").eq(1).should("not.have.text", "xyz Corporation"); // Expects EXACT match (case sensitive)

    // -----

    // Before hovering over buttons (& testing for background color changes)
    cy.get("button")
      .first()
      .should("have.css", "background-color", "rgb(190, 225, 212)");
    cy.get("button")
      .eq(1)
      .should("have.css", "background-color", "rgb(190, 225, 212)");

    // Hover over buttons and then off buttons (& test for background color changes)
    cy.get("button").first().trigger("mouseover"); // hover equivalent over TEAMS dropdown button (1st button in DOM)
    cy.get("button")
      .first()
      .should("have.css", "background-color", "rgb(45, 190, 137)");
    cy.get("button").first().trigger("mouseout"); // hover equivalent outside TEAMS dropdown button (1st button in DOM)
    cy.get("button")
      .first()
      .should("not.have.css", "background-color", "rgb(45, 190, 137)");
    cy.get("button").eq(1).trigger("mouseover"); // hover equivalent over CUSTOMERS dropdown button (2nd button in DOM)
    cy.get("button")
      .eq(1)
      .should("have.css", "background-color", "rgb(45, 190, 137)");
    cy.get("button").eq(1).trigger("mouseout"); // hover equivalent over CUSTOMERS dropdown button (2nd button in DOM)
    cy.get("button")
      .eq(1)
      .should("not.have.css", "background-color", "rgb(45, 190, 137)");

    // After unhovering over buttons (& testing for background color changes)
    cy.get("button")
      .first()
      .should("have.css", "background-color", "rgb(190, 225, 212)");
    cy.get("button")
      .eq(1)
      .should("have.css", "background-color", "rgb(190, 225, 212)");

    // -----

    // Reset dropdown back to -- ALL TEAMS --
    cy.get("button")
      .contains(/^Thunderbolts$/)
      .click();
    cy.get("ul")
      .contains(/^Aqua Serpents$/) // Picking a random team from the list
      .get("li")
      .contains(/^-- ALL TEAMS --$/)
      .click();
    // ** CONFIRM TABLE RESULTS **

    // Reset dropdown back to -- ALL CUSTOMERS --
    cy.get("button")
      .contains(/^XYZ Corporation$/)
      .click();
    cy.get("ul")
      .contains(/^123 Industries$/) // Picking a random customer from the list
      .get("li")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click();
    // ** CONFIRM TABLE RESULTS **

    // Confirming buttons remain in DOM (have shifted to top of page)
    cy.get("button").first();
    cy.get("button").eq(1);
    cy.get("button").eq(2).should("not.exist"); // Removing .should("not.exist") throws error
    cy.get("button").first().should("have.value", ""); // "" is shorthand for -- ALL TEAMS -- (i.e. no selection) ... TEAM dropdown is 1st button in DOM
    cy.get("button").eq(1).should("have.value", ""); // "" is shorthand for -- ALL CUSTOMERS -- (i.e. no selection) ... CUSTOMER dropdown is 2nd button in DOM (i.e. index 1 using eq())

    // -----

    // Click TEAMS button, hover over dropdown and then hover outside dropdown
    cy.get("button")
      // .contains("Thunderbolt") // NOTE:  This passes since NOT EXACT match
      .contains(/^-- ALL TEAMS --$/) // EXACT match
      .click();
    cy.get("ul")
      .contains(/^Cocoa Commandos$/) // Picking a random team from the list
      .get("li")
      .contains(/^Blazing Phoenix$/)
      .trigger("mouseover");
    cy.get("body") // Using click outside of button/dropdown to close dropdown (hover away not working...)
      .click(0, 0);
    // *** FIX BELOW HOVERING, REPLACE body CLICK ABOVE ***
    // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__hover-hidden-elements
    // cy.get("ul")
    //   .contains(/^Cocoa Commandos$/) // Picking a random team from the list
    //   .trigger("mouseout");
    // cy.get("li")
    //   .contains(/^Blazing Phoenix$/)
    //   .trigger("mouseout");

    // Click CUSTOMERS button, hover over dropdown and then hover outside dropdown
    cy.get("button")
      // .contains("XYZ Corporation") // NOTE:  This passes since NOT EXACT match
      .contains(/^-- ALL CUSTOMERS --$/)
      .click();
    cy.get("ul")
      .contains(/^123 Industries$/) // Picking a random customer from the list
      .get("li")
      .contains(/^EFG Ltd$/)
      .trigger("mouseover");
    cy.get("body") // Using click outside of button/dropdown to close dropdown (hover away not working...)
      .click(0, 0);
    // *** FIX BELOW HOVERING, REPLACE body CLICK ABOVE ***
    // cy.get("ul")
    //   .contains(/^123 Industries$/) // Picking a random customer from the list
    //   .trigger("mouseout");
    // cy.get("li")
    //   .contains(/^EFG Ltd$/)
    //   .trigger("mouseout");

    // ------------ START SECTION w/ TABLE COLUMN HEADERS ------------
    // https://sahithigundu.medium.com/how-to-handle-webtable-in-cypress-automation-e843b7e0cc07

    // // REMOVE BELOW
    cy.get("button")
      // .contains("Thunderbolt") // NOTE:  This passes since NOT EXACT match
      .contains(/^-- ALL TEAMS --$/) // EXACT match
      .click();
    cy.get("ul")
      .contains(/^Cocoa Commandos$/) // Picking a random team from the list
      .get("li")
      .contains(/^Blazing Phoenix$/)
      .click();
    // // REMOVE ABOVE

    cy.get("table").contains("ID").should("exist");
    cy.get("td.reps-table-cell").first().should("have.text", "ID"); // This works (w/o ▲ ▼ symbols); contain.text also works for partial match

    cy.get("td.reps-table-cell").contains(/^ID$/).click();
    cy.get("td.reps-table-cell")
      .contains(/^ID ▲$/) // ▲ ▼
      .click();
    // cy.get("td").contains(/^ID$/).click().click(); // Alternatively
    cy.get("td.reps-table-cell").first().should("exist");

    // cy.get("td.reps-table-cell").first().should("have.text", "ID  ▼"); // NOT working for symbols ▲ ▼...
    // cy.get("td.reps-table-cell")
    //   .first()
    //   .invoke("text")
    //   .should("equal", "ID  ▼"); // NOT working for symbols ▲ ▼...

    cy.get("td.reps-table-cell")
      .contains(/^First Name$/)
      .click();
    cy.get("td.reps-table-cell")
      .contains(/^First Name ▲$/)
      .click(); // DECREASING
    cy.get("td.reps-table-cell").eq(1).should("contain.text", "First Name"); // NOTE: "have.text", "First Name  ▼" does NOT work due to symbol...
    cy.get("td.reps-table-cell")
      .contains(/^Last Name$/)
      .click();
    cy.get("td.reps-table-cell")
      .contains(/^Last Name ▲$/)
      .click(); // DECREASING
    cy.get("td.reps-table-cell").eq(2).should("contain.text", "Last Name");
    cy.get("td.reps-table-cell")
      .contains(/^Email$/)
      .click();
    cy.get("td.reps-table-cell")
      .contains(/^Email ▲$/)
      .click(); // DECREASING
    cy.get("td.reps-table-cell").eq(3).should("contain.text", "Email");
    cy.get("td.reps-table-cell")
      .contains(/^Team$/)
      .click(); // INCREASING
    cy.get("td.reps-table-cell").eq(4).should("contain.text", "Team");
    cy.get("td.reps-table-cell")
      .contains(/^Total Revenue$/)
      .click();
    cy.get("td.reps-table-cell")
      .contains(/^Total Revenue ▲$/)
      .click(); // DECREASING
    cy.get("td.reps-table-cell").eq(5).should("contain.text", "Total Revenue");

    //   cy.get("button").contains("-- ALL CUSTOMER --").click(); // INTENTIONAL ERROR to TAKE SNAPSHOT...
  });

  // -----------------------------*************--------------------------------

  // Journey #1
  // FILTER TEAM
  // SORT by Revenue DESC
  // FILTER CUSTOMER
  // UNFILTER TEAM
  // SORT by LAST NAME ASC
  // FILTER NEW TEAM
  // CHANGE TEAM

  it("Journey #1 through the MAIN page of the app", () => {
    // --------------- START PRE-SET OF ARRAY VALUES OF EACH COLUMN (length = 80) ----------------
    // Generate & store array of 80 IDs in ASC order (assemble 80 IDs programatically & store in closure variable..)
    let resultArr80ids = Array.from({ length: 80 }, (_, index) => index + 1);

    // Generate & store array of 80 FIRST NAMES in ASC order (assemble 80 names programatically & store in closure variable..)
    let resultArr80FirstNames; // closure variable
    cy.get("table tbody tr td:nth-child(2)")
      .invoke("text")
      .then((text) => {
        resultArr80FirstNames = text.split(/[A-Z]/);
        resultArr80FirstNames.shift(); // remove empty string at beginning of array
        const onlyCaps = text.replace(/[a-z]/g, ""); // remove all lowercase letters
        resultArr80FirstNames = resultArr80FirstNames.map(
          (elem, index) => onlyCaps[index] + elem
        ); // add back uppercase letter to beginning of each string
        resultArr80FirstNames.sort();
      });

    // Generate & store array of 80 LAST NAMES in ASC order (assemble 80 names programatically & store in closure variable..)
    let resultArr80LastNames; // closure variable
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .then((text) => {
        // expect(firstElem).to.equal(""); // correct syntax BUT throws ERROR since not equal
        resultArr80LastNames = text.split(/[A-Z]/);
        resultArr80LastNames.shift(); // remove empty string at beginning of array
        const onlyCaps = text.replace(/[a-z]/g, ""); // remove all lowercase letters
        resultArr80LastNames = resultArr80LastNames.map(
          (elem, index) => onlyCaps[index] + elem
        ); // add back uppercase letter to beginning of each string
        resultArr80LastNames.sort();
        // cy.get("table tbody tr td:nth-child(3)")
        //   .invoke("text")
        //   .should("eq", resultArr80LastNames.join("")); // REMOVE - This works as nested here
      });
    // .should("eq", resultArr80LastNames.join("")); // REMOVE
    // expect(resultArr80LastNames).to.deep.equal([]); // REMOVE - returning undefined...
    // cy.get("table tbody tr td:nth-child(3)")
    //   .invoke("text")
    //   .should("eq", resultArr80LastNames.join("")); // REMOVE - undefined again...

    // Generate & store array of 80 EMAILS in ASC order (assemble 80 emails programatically & store in closure variable..)
    let resultArr80Emails; // closure variable
    cy.get("table tbody tr td:nth-child(4)")
      .invoke("text")
      .then((text) => {
        resultArr80Emails = text.split(/.com/); // only works w/ .com addresses...
        resultArr80Emails = resultArr80Emails.map(
          (elem, index) => elem + ".com"
        ); // add back ".com" to end of each string
        resultArr80Emails.sort();
        resultArr80Emails.shift(); // remove string at beginning of array
        // expect(resultArr80Emails.length).to.equal(80);
        // expect(resultArr80Emails).to.equal([]);
      });

    // Generate & store array of 80 Teams in ASC order (assemble 80 IDs programatically & store in closure variable..)
    // NOTE:  Doing this one MANUALLY -- TEAM sort validation will NOT work as-is for dynamic data...
    // cy.fixture("resultArr80Teams.json").as("resultArr80Teams"); // Imported above, replaces below variable declaration; fixture not needed  <-- https://docs.cypress.io/api/commands/fixture
    // let resultArr80Teams = [
    //   "Royal Ravens",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Teal Titans",
    //   "Magenta Mystics",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Emerald Enchanters",
    //   "Lime Lightning",
    //   "Teal Titans",
    //   "Cocoa Commandos",
    //   "Lime Lightning",
    //   "Thunderbolts",
    //   "Royal Ravens",
    //   "Teal Titans",
    //   "Cosmic Cyclones",
    //   "Cosmic Cyclones",
    //   "Aqua Serpents",
    //   "Royal Ravens",
    //   "Cocoa Commandos",
    //   "Blazing Phoenix",
    //   "Aqua Serpents",
    //   "Emerald Enchanters",
    //   "Sunset Strikers",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Bubblegum Unicorns",
    //   "Teal Titans",
    //   "Thunderbolts",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Aqua Serpents",
    //   "Bubblegum Unicorns",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Cosmic Cyclones",
    //   "Royal Ravens",
    //   "Aqua Serpents",
    //   "Emerald Enchanters",
    //   "Thunderbolts",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Cocoa Commandos",
    //   "Aqua Serpents",
    //   "Magenta Mystics",
    //   "Emerald Enchanters",
    //   "Teal Titans",
    //   "Emerald Enchanters",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Bubblegum Unicorns",
    //   "Sunset Strikers",
    //   "Bubblegum Unicorns",
    //   "Emerald Enchanters",
    //   "Teal Titans",
    //   "Thunderbolts",
    //   "Sunset Strikers",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Bubblegum Unicorns",
    //   "Cocoa Commandos",
    //   "Bubblegum Unicorns",
    //   "Blazing Phoenix",
    //   "Magenta Mystics",
    //   "Thunderbolts",
    //   "Bubblegum Unicorns",
    //   "Thunderbolts",
    //   "Lime Lightning",
    //   "Cocoa Commandos",
    //   "Teal Titans",
    //   "Blazing Phoenix",
    //   "Magenta Mystics",
    //   "Teal Titans",
    //   "Lime Lightning",
    // ];

    // Generate & store array of 80 TOTAL REVENUE in DESC order (assemble 80 emails programatically & store in closure variable..)
    let resultArr80Revenue; // closure variable
    cy.get("table tbody tr td:nth-child(6)")
      .invoke("text")
      .then((text) => {
        text = text.replaceAll(",", ""); // remove commas to avoid NaN error in string type conversion to number
        resultArr80Revenue = text.split(/k/);
        resultArr80Revenue = resultArr80Revenue.map((elem, index) => {
          return (elem = Number(elem.slice(1, elem.length))); // Remove leading $ (trailing k already removed)
        });
        resultArr80Revenue.pop(); // remove string at end of array
        resultArr80Revenue.sort().reverse();
        // expect(resultArr80Revenue).to.equal([]);
      });

    // --------------- END PRE-SET OF ARRAY VALUES OF EACH COLUMN (length = 80) ----------------

    // SELECT "Emerald Enchanters" from TEAMS dropdown (only selection)
    cy.get("button")
      .contains(/^-- ALL TEAMS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Emerald Enchanters$/)
      .click();
    // SAMPLE CODE
    // cy.get("td.reps-table-cell").eq(6).should("have.text", "6");
    // cy.get("td.reps-table-cell").eq(7).should("not.have.text", "Natha"); // EXACT match only
    // cy.get("table thead tr td:nth-child(1)").eq(0).should("have.text", "ID"); // Alternative, used below

    // cy.get("table tbody tr td:nth-child(1)").eq(1).should("exist"); // 1st column of table (under ID column), 2nd row of TABLE BODY (zero-indexed)
    // cy.get("table tbody tr td:nth-child(1)").eq(1).should("have.text", "8");
    // cy.get("table tbody tr td:nth-child(2)")
    //   .eq(0)
    //   .should("have.text", "Nathan"); // 2nd column of table (under First Name column), 1st row of TABLE BODY (zero-indexed)

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "9"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(9 * 6)); // Asserts # of TOTAL CELLS in table body
    // cy.get("table").find("tbody tr").last().should("have.length", "6"); // NOTE:  This does NOT work for column count

    // Validate order:  Default sort is by ID ASC...
    // Compare 1st vs 2nd row of table - ID (type NUMBER)
    let firstElem; // closure variable
    cy.get("table tbody tr td:nth-child(1)")
      .first()
      .invoke("text")
      .then((text) => (firstElem = text)); // set closure variable as first row
    cy.get("table tbody tr td:nth-child(1)")
      .eq(1)
      .invoke("text")
      .then((secondElem) =>
        expect(Number(secondElem)).to.be.gte(Number(firstElem))
      ); // compare closure variable in assertion

    // Compare penultimate vs final row of table - ID (type NUMBER)
    let penultimateElem; // closure variable
    cy.get("table tbody tr td:nth-child(1)")
      .eq(8 - 1) // 9 rows in body
      .invoke("text")
      .then((text) => (penultimateElem = text)); // set closure variable as first row
    cy.get("table tbody tr td:nth-child(1)")
      .last()
      .invoke("text")
      .then((finalElem) =>
        expect(Number(finalElem)).to.be.gte(Number(penultimateElem))
      ); // compare closure variable in assertion

    // Validate order - ID ASC - EMAIL column
    cy.get("table tbody tr td:nth-child(4)")
      .invoke("text")
      .should(
        "eq",
        [
          "nathan.mitchell@example.com",
          "aiden.evans@example.com",
          "riley.price@example.com",
          "gabriella.green@example.com",
          "aria.green@example.com",
          "savannah.kim@example.com",
          "natalie.smith@example.com",
          "isaiah.stewart@example.com",
          "brooklyn.diaz@example.com",
        ].join("")
      );

    // ------

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "6"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "nathan.mitchell@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Emerald Enchanters"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$9,703k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "63"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "brooklyn.diaz@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Emerald Enchanters"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // -------

    // SORT by Revenue DESC
    cy.get("td.reps-table-cell")
      .contains(/^Total Revenue$/)
      .click();
    cy.get("td.reps-table-cell")
      .contains(/^Total Revenue ▲$/)
      .click(); // DECREASING
    cy.get("td.reps-table-cell").eq(5).should("contain.text", "Total Revenue");

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "40"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "aria.green@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Emerald Enchanters"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$13,677k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "63"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "brooklyn.diaz@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Emerald Enchanters"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE DESC - TOTAL REVENUE column
    cy.get("table tbody tr td:nth-child(6)")
      .invoke("text")
      .should(
        "eq",
        [
          "$13,677k",
          "$13,498k",
          "$9,703k",
          "$8,294k",
          "$6,852k",
          "$0k",
          "$0k",
          "$0k",
          "$0k",
        ].join("")
      );

    // -------

    // SELECT "Acme Corp" from CUSTOMERS dropdown (only selection)
    cy.get("button")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL CUSTOMERS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Acme Corp$/)
      .click();

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    // STILL aria.green@example.com in 1st row...some in middle have shifted positions...
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$1,656k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)
    // STILL brooklyn.diaz@example.com in final row...
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE DESC - TOTAL REVENUE column
    cy.get("table tbody tr td:nth-child(6)")
      .invoke("text")
      .should(
        "eq",
        [
          "$1,656k",
          "$1,196k",
          "$844k",
          "$40k",
          "$0k",
          "$0k",
          "$0k",
          "$0k",
          "$0k",
        ].join("")
      );

    // -------

    // Remove filter from TEAMS dropdown (only 'Acme Corp' CUSTOMER selected)
    cy.get("button")
      .contains(/^Emerald Enchanters$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^-- ALL TEAMS --$/)
      .click();

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "80"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(80 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "13"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "lily.wilson@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Thunderbolts"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$3,786k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "80"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "audrey.allen@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Lime Lightning"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE DESC - TOTAL REVENUE column (1st & final couple rows ONLY)
    // Compare 1st vs 2nd row of table - TOTAL REVENUE (type NUMBER) - 80 total rows
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .invoke("text")
      .then((text) => (firstElem = text)); // set closure variable as first row
    cy.get("table tbody tr td:nth-child(6)")
      .eq(1)
      .invoke("text")
      .then((secondElem) => {
        // expect(typeof secondElem).to.equal("string"); // <-- https://devhints.io/chai  /  https://docs.cypress.io/guides/references/assertions
        secondElem = secondElem.slice(1, secondElem.length - 1); // Remove leading $ and trailing k
        secondElem = secondElem.replaceAll(",", "");
        firstElem = firstElem.slice(1, firstElem.length - 1); // Remove leading $ and trailing k
        firstElem = firstElem.replaceAll(",", "");
        expect(Number(secondElem)).to.be.lte(Number(firstElem));
        // expect(Number(secondElem) <= Number(firstElem)).to.be.true; // Alternative
      });
    // compare closure variable in assertion

    // Compare penultimate vs final row of table - TOTAL REVENUE (type NUMBER) - 80 total rows
    cy.get("table tbody tr td:nth-child(6)")
      .eq(80 - 2) // 80 rows in body, penultimate (zero indexed)
      .invoke("text")
      .then((text) => (penultimateElem = text)); // set closure variable as first row
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .invoke("text")
      .then((finalElem) => {
        finalElem = finalElem.slice(1, finalElem.length - 1); // Remove leading $ and trailing k
        finalElem = finalElem.replaceAll(",", "");
        penultimateElem = penultimateElem.slice(1, penultimateElem.length - 1); // Remove leading $ and trailing k
        penultimateElem = penultimateElem.replaceAll(",", "");
        expect(Number(finalElem)).to.be.lte(Number(penultimateElem));
      }); // compare closure variable in assertion

    // -------

    // SORT ASC by Last Name, still filtered by ONLY 'Acme Corp' CUSTOMER
    cy.get("td.reps-table-cell")
      .contains(/^Last Name$/)
      .click(); // INCREASING
    cy.get("td.reps-table-cell").eq(2).should("contain.text", "Last Name");

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "24"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "caleb.adams@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Sunset Strikers"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$3,091k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "37"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "benjamin.wood@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Cosmic Cyclones"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$520k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order assertion - LAST NAME ASC - LAST NAME column
    // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .then((text) => {
        resultArr80LastNames.sort(); // reset stored array of 80 LAST NAMES to ASC to validate against
        expect(text).to.equal(resultArr80LastNames.join(""));
        resultArr80LastNames.sort(); // reset to ASC
      });

    // -------

    // SELECT "Bubblegum Unicorns" from TEAMS dropdown (+ 'Acme Corp' CUSTOMER selection from above)
    cy.get("button")
      .contains(/^-- ALL TEAMS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Bubblegum Unicorns$/)
      .click();

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "7"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(7 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "68"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "abigail.allen@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Bubblegum Unicorns"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").first().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "27"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "aria.ramos@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Bubblegum Unicorns"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$1,355k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - LAST NAME ASC - LAST NAME column
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .should(
        "eq",
        [
          "Allen",
          "Alvarez",
          "Bennett",
          "Castillo",
          "Hernandez",
          "Lopez",
          "Ramos",
        ].join("")
      );

    // -------

    // SELECT "Teal Titans" from TEAMS dropdown, replacing 'Bubblegum Unicorns' (+ 'Acme Corp' CUSTOMER selection from above)
    cy.get("button")
      .contains(/^Bubblegum Unicorns$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Teal Titans$/)
      .click();

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "11"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(11 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "10"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "zoe.brooks@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Teal Titans"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$2,334k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "4"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "adam.walker@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Teal Titans"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$1,790k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - LAST NAME ASC - LAST NAME column
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .should(
        "eq",
        [
          "Brooks",
          "Brooks",
          "Collins",
          "Diaz",
          "Hall",
          "Hernandez",
          "Johnson",
          "Lopez",
          "Reed",
          "Rodriguez",
          "Walker",
        ].join("")
      );

    // -----------------------

    // cy.get("button").contains("-- ALL CUSTOMER --").click(); // INTENTIONAL ERROR to TAKE SNAPSHOT...
  }); // END test #2 (Journey #1)

  // -----------------------------*************--------------------------------

  // Journey #2
  // SORT by TEAM ASC
  // FILTER CUSTOMER
  // FILTER TEAM
  // UNFILTER CUSTOMER
  // SORT by Revenue DESC
  // FILTER NEW TEAM
  // FILTER CUSTOMER
  // FILTER NEW CUSTOMER
  // SORT by ID ASC

  it("Journey #2 through the MAIN page of the app", () => {
    // --------------- START PRE-SET OF ARRAY VALUES OF EACH COLUMN (length = 80) ----------------
    // NOTE:  Duplicating code here intentionally vs. modularizing bc of closure variable usage...
    // Generate & store array of 80 IDs in ASC order (assemble 80 IDs programatically & store in closure variable..)
    let resultArr80ids = Array.from({ length: 80 }, (_, index) => index + 1);

    // Generate & store array of 80 FIRST NAMES in ASC order (assemble 80 names programatically & store in closure variable..)
    let resultArr80FirstNames; // closure variable
    cy.get("table tbody tr td:nth-child(2)")
      .invoke("text")
      .then((text) => {
        resultArr80FirstNames = text.split(/[A-Z]/);
        resultArr80FirstNames.shift(); // remove empty string at beginning of array
        const onlyCaps = text.replace(/[a-z]/g, ""); // remove all lowercase letters
        resultArr80FirstNames = resultArr80FirstNames.map(
          (elem, index) => onlyCaps[index] + elem
        ); // add back uppercase letter to beginning of each string
        resultArr80FirstNames.sort();
      });

    // Generate & store array of 80 LAST NAMES in ASC order (assemble 80 names programatically & store in closure variable..)
    let resultArr80LastNames; // closure variable
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .then((text) => {
        // expect(firstElem).to.equal(""); // correct syntax BUT throws ERROR since not equal
        resultArr80LastNames = text.split(/[A-Z]/);
        resultArr80LastNames.shift(); // remove empty string at beginning of array
        const onlyCaps = text.replace(/[a-z]/g, ""); // remove all lowercase letters
        resultArr80LastNames = resultArr80LastNames.map(
          (elem, index) => onlyCaps[index] + elem
        ); // add back uppercase letter to beginning of each string
        resultArr80LastNames.sort();
        // cy.get("table tbody tr td:nth-child(3)")
        //   .invoke("text")
        //   .should("eq", resultArr80LastNames.join("")); // REMOVE - This works as nested here
      });
    // .should("eq", resultArr80LastNames.join("")); // REMOVE
    // expect(resultArr80LastNames).to.deep.equal([]); // REMOVE - returning undefined...
    // cy.get("table tbody tr td:nth-child(3)")
    //   .invoke("text")
    //   .should("eq", resultArr80LastNames.join("")); // REMOVE - undefined again...

    // Generate & store array of 80 EMAILS in ASC order (assemble 80 emails programatically & store in closure variable..)
    let resultArr80Emails; // closure variable
    cy.get("table tbody tr td:nth-child(4)")
      .invoke("text")
      .then((text) => {
        resultArr80Emails = text.split(/.com/); // only works w/ .com addresses...
        resultArr80Emails = resultArr80Emails.map(
          (elem, index) => elem + ".com"
        ); // add back ".com" to end of each string
        resultArr80Emails.sort();
        resultArr80Emails.shift(); // remove string at beginning of array
        // expect(resultArr80Emails.length).to.equal(80);
        // expect(resultArr80Emails).to.equal([]);
      });

    // Generate & store array of 80 Teams in ASC order (assemble 80 IDs programatically & store in closure variable..)
    // NOTE:  Doing this one MANUALLY -- TEAM sort validation will NOT work as-is for dynamic data...
    // resultArr80Teams is imported from 'fixtures' @ top
    // let resultArr80Teams = [
    //   "Royal Ravens",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Teal Titans",
    //   "Magenta Mystics",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Emerald Enchanters",
    //   "Lime Lightning",
    //   "Teal Titans",
    //   "Cocoa Commandos",
    //   "Lime Lightning",
    //   "Thunderbolts",
    //   "Royal Ravens",
    //   "Teal Titans",
    //   "Cosmic Cyclones",
    //   "Cosmic Cyclones",
    //   "Aqua Serpents",
    //   "Royal Ravens",
    //   "Cocoa Commandos",
    //   "Blazing Phoenix",
    //   "Aqua Serpents",
    //   "Emerald Enchanters",
    //   "Sunset Strikers",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Bubblegum Unicorns",
    //   "Teal Titans",
    //   "Thunderbolts",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Aqua Serpents",
    //   "Bubblegum Unicorns",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Cosmic Cyclones",
    //   "Royal Ravens",
    //   "Aqua Serpents",
    //   "Emerald Enchanters",
    //   "Thunderbolts",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Cocoa Commandos",
    //   "Aqua Serpents",
    //   "Magenta Mystics",
    //   "Emerald Enchanters",
    //   "Teal Titans",
    //   "Emerald Enchanters",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Bubblegum Unicorns",
    //   "Sunset Strikers",
    //   "Bubblegum Unicorns",
    //   "Emerald Enchanters",
    //   "Teal Titans",
    //   "Thunderbolts",
    //   "Sunset Strikers",
    //   "Royal Ravens",
    //   "Sunset Strikers",
    //   "Thunderbolts",
    //   "Teal Titans",
    //   "Emerald Enchanters",
    //   "Royal Ravens",
    //   "Cosmic Cyclones",
    //   "Bubblegum Unicorns",
    //   "Cocoa Commandos",
    //   "Bubblegum Unicorns",
    //   "Blazing Phoenix",
    //   "Magenta Mystics",
    //   "Thunderbolts",
    //   "Bubblegum Unicorns",
    //   "Thunderbolts",
    //   "Lime Lightning",
    //   "Cocoa Commandos",
    //   "Teal Titans",
    //   "Blazing Phoenix",
    //   "Magenta Mystics",
    //   "Teal Titans",
    //   "Lime Lightning",
    // ];

    // Generate & store array of 80 TOTAL REVENUE in DESC order (assemble 80 emails programatically & store in closure variable..)
    let resultArr80Revenue; // closure variable
    cy.get("table tbody tr td:nth-child(6)")
      .invoke("text")
      .then((text) => {
        text = text.replaceAll(",", ""); // remove commas to avoid NaN error in string type conversion to number
        resultArr80Revenue = text.split(/k/);
        resultArr80Revenue = resultArr80Revenue.map((elem, index) => {
          return (elem = Number(elem.slice(1, elem.length))); // Remove leading $ (trailing k already removed)
        });
        resultArr80Revenue.pop(); // remove string at end of array
        resultArr80Revenue.sort().reverse();
        // expect(resultArr80Revenue).to.equal([]);
      });

    // --------------- END PRE-SET OF ARRAY VALUES OF EACH COLUMN (length = 80) ----------------

    // SORT ASC by TEAM
    cy.get("td.reps-table-cell")
      .contains(/^Team$/)
      .click(); // INCREASING
    cy.get("td.reps-table-cell").eq(4).should("contain.text", "Team");

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "80"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(80 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "18"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "sophia.gomez@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Aqua Serpents"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$16,138k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "73"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "henry.torres@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Thunderbolts"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order assertion - TEAM ASC - TEAM column
    // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
    cy.get("table tbody tr td:nth-child(5)")
      .invoke("text")
      .then((text) => {
        resultArr80Teams.sort();
        expect(text).to.equal(resultArr80Teams.join(""));
      });

    // -------

    // SELECT "ABC Company" from CUSTOMERS dropdown (only selection)
    cy.get("button")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL CUSTOMERS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^ABC Company$/)
      .click();

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table + randow other rows:  Total Revenue
    // STILL sophia.gomez@example.com in 1st row...
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$4,818k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)
    // STILL henry.torres@example.com in final row...
    cy.get("table tbody tr td:nth-child(6)")
      .eq(1)
      .should("have.text", "$1,145k");
    cy.get("table tbody tr td:nth-child(6)").eq(5).should("have.text", "$316k");
    cy.get("table tbody tr td:nth-child(6)")
      .eq(74 - 1) // 74th row in body (zero indexed)
      .should("have.text", "$1,632k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // -------

    // SELECT "Magenta Mystics" from TEAMS dropdown (+ 'ABC Company' CUSTOMER selection from above)
    cy.get("button")
      .contains(/^-- ALL TEAMS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Magenta Mystics$/)
      .click();

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "4"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(4 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "5"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "evan.edwards@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Magenta Mystics"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$449k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "78"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "sofia.foster@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Magenta Mystics"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TEAM ASC - FIRST NAME column
    cy.get("table tbody tr td:nth-child(2)")
      .invoke("text")
      .should("eq", ["Evan", "Evan", "Eliana", "Sofia"].join(""));

    // -------

    // Remove filter from CUSTOMERS dropdown (only 'Magenta Mystics' TEAM selected)
    cy.get("button")
      .contains(/^ABC Company$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL CUSTOMERS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click();

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    // STILL evan.edwards@example.com in 1st row... NO OTHER CHANGES to table body aside from evan.edwards' Total Revenue
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$9,317k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)
    // STILL sofia.foster@example.com in final row...
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // -------

    // SORT by Revenue ASC (still only 'Magenta Mystics' TEAM selected)
    cy.get("td.reps-table-cell")
      .contains(/^Total Revenue$/)
      .click(); // INCREASING
    cy.get("td.reps-table-cell").eq(5).should("contain.text", "Total Revenue");

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "46"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "evan.johnson@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Magenta Mystics"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").first().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "5"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "evan.edwards@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Magenta Mystics"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$9,317k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE ASC - EMAIL column
    cy.get("table tbody tr td:nth-child(4)")
      .invoke("text")
      .should(
        "eq",
        [
          "evan.johnson@example.com",
          "eliana.cox@example.com",
          "sofia.foster@example.com",
          "evan.edwards@example.com",
        ].join("")
      );

    // -------

    // SELECT "Royal Ravens" from TEAMS dropdown (only selection, replacing 'Magenta Mystics)
    cy.get("button")
      .contains(/^Magenta Mystics$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL TEAMS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Royal Ravens$/)
      .click();

    // Assert table dimensions
    cy.get("table tbody tr").should("have.length", "11"); // Assert # of ROWS in table body
    cy.get("table tbody tr td").should("have.length", String(11 * 6)); // Asserts # of TOTAL CELLS in table body

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "42"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "jonathan.parker@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").first().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "31"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "james.castillo@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$16,564k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE ASC - ID column
    cy.get("table tbody tr td:nth-child(1)")
      .invoke("text")
      .should(
        "eq",
        ["42", "59", "64", "2", "1", "14", "25", "38", "19", "7", "31"].join("")
      );

    // -------

    // SELECT "Sample Corp" from CUSTOMERS dropdown (+ 'Royal Ravens' TEAM selection from above)
    cy.get("button")
      .contains(/^-- ALL CUSTOMERS --$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL CUSTOMERS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^Sample Corp$/)
      .click();

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    // STILL jonathan.parker@example.com in 1st row...
    cy.get("table tbody tr td:nth-child(6)").first().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // NO LONGER james.castillo@example.com in final row...
    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "19"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "matthew.clark@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$3,977k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE ASC - TOTAL REVENUE column
    cy.get("table tbody tr td:nth-child(6)")
      .invoke("text")
      .should(
        "eq",
        [
          "$0k",
          "$0k",
          "$0k",
          "$42k",
          "$1,103k",
          "$1,843k",
          "$1,872k",
          "$1,895k",
          "$2,250k",
          "$3,626k",
          "$3,977k",
        ].join("")
      );

    // -------

    // SELECT "EFG Ltd" from CUSTOMERS dropdown, replacing "Sample Corp" (+ 'Royal Ravens' TEAM selection from above)
    cy.get("button")
      .contains(/^Sample Corp$/)
      .click(); // EXACT match only
    cy.get("ul")
      .contains(/^-- ALL CUSTOMERS --$/) // Picking a random team from the list
      .get("li")
      .contains(/^EFG Ltd$/)
      .click();

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    // STILL jonathan.parker@example.com in 1st row...
    cy.get("table tbody tr td:nth-child(6)").first().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // NO LONGER matthew.clark@example.com in final row...
    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "1"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "michael.chavez@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .last()
      .should("have.text", "$4,820k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - TOTAL REVENUE ASC - LAST NAME column
    cy.get("table tbody tr td:nth-child(3)")
      .invoke("text")
      .should(
        "eq",
        [
          "Parker",
          "Perez",
          "Stewart",
          "Jimenez",
          "Clark",
          "Lopez",
          "Johnson",
          "Long",
          "Castillo",
          "Evans",
          "Chavez",
        ].join("")
      );

    // -------

    // SORT by ID ASC (still 'Royal Ravens' TEAM & 'EFG Ltd' customer selected)
    cy.get("td.reps-table-cell").contains(/^ID$/).click(); // INCREASING
    cy.get("td.reps-table-cell").eq(0).should("contain.text", "ID");

    // No need here to assert table dimensions since unchanged...

    // Assert following details in 1st & final row of table:  ID, Email, Team, Total Revenue
    cy.get("table tbody tr td:nth-child(1)").first().should("have.text", "1"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .first()
      .should("have.text", "michael.chavez@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .first()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)")
      .first()
      .should("have.text", "$4,820k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    cy.get("table tbody tr td:nth-child(1)").last().should("have.text", "64"); // 1st column of table (under ID column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(4)")
      .last()
      .should("have.text", "jaxon.stewart@example.com"); // 4th column of table (under EMAIL column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(5)")
      .last()
      .should("have.text", "Royal Ravens"); // 5th column of table (under TEAM column), 1st row of TABLE BODY (zero-indexed)
    cy.get("table tbody tr td:nth-child(6)").last().should("have.text", "$0k"); // 6th column of table (under TOTAL REVENUE column), 1st row of TABLE BODY (zero-indexed)

    // Validate order - ID ASC - ID column
    cy.get("table tbody tr td:nth-child(1)")
      .invoke("text")
      .should(
        "eq",
        ["1", "2", "7", "14", "19", "25", "31", "38", "42", "59", "64"].join("")
      );

    // -----------------------

    // cy.get("button").contains("-- ALL CUSTOMER --").click(); // INTENTIONAL ERROR to TAKE SNAPSHOT...
  }); // END test #3 (Journey #2)
}); // END describe

// -----------------------------*************--------------------------------

// NOTES FOR e2e TESTS
// 1) Comprehensive test
// 2) First flow test
// 3) Second flow test

// Confirm view of all teams
// Click dropdown item
// Confirm view of selected team

// Repeat above with customers

// Re-select "ALL" for each customers/teams

// Click on teams button
// Confirm dropdown list appears
// Hover outside dropdown list
// Confirm only button appears post-hover/click outside

// Test each of the above vs. table results

// --------------- START OF VALIDATE COLUMN ORDER ASSERTIONS - REFERENCE ONLY --------------

// // ** DOCUMENT OUT ALL THE BELOW **
// cy.get("td.reps-table-cell")
//   .contains(/^Total Revenue$/)
//   .click()
//   .click(); // DECREASING

// // Validate order assertion - ID ASC - ID column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(1)")
//   .invoke("text")
//   .then((text) => {
//     // resultArr80ids.reverse();
//     expect(text).to.equal(resultArr80ids.join("")); <-- https://devhints.io/chai
//     resultArr80ids.sort(); // reset to ASC
//   });

// // Validate order assertion - FIRST NAME ASC - FIRST NAME column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(2)")
//   .invoke("text")
//   .then((text) => {
//     // resultArr80FirstNames.reverse();
//     expect(text).to.equal(resultArr80FirstNames.join(""));
//     resultArr80FirstNames.sort(); // reset to ASC
//   });

// // Validate order assertion - LAST NAME ASC - LAST NAME column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(3)")
//   .invoke("text")
//   .then((text) => {
//     // resultArr80LastNames.reverse();
//     expect(text).to.equal(resultArr80LastNames.join(""));
//     resultArr80LastNames.sort(); // reset to ASC
//   });

// // Validate order assertion - EMAIL ASC - EMAIL column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(4)")
//   .invoke("text")
//   .then((text) => {
//     // resultArr80Emails.reverse();
//     expect(text).to.equal(resultArr80Emails.join(""));
//     resultArr80Emails.sort(); // reset to ASC
//   });

// // Validate order assertion - TEAM ASC - TEAM column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(5)")
//   .invoke("text")
//   .then((text) => {
//     //   resultArr80Teams.reverse();
//     expect(text).to.equal(resultArr80Teams.join(""));
//     resultArr80Teams.sort(); // reset to ASC
//   });

// // Validate order assertion - REVENUE ASC - REVENUE column
// // Re-sort closure array variable (if needed for assertion), then collapse array into string to compare vs. actual table results (string w/o spaces)
// cy.get("table tbody tr td:nth-child(6)")
//   .invoke("text")
//   .then((text) => {
//     // resultArr80Revenue.sort().reverse();
//     expect(text).to.equal(resultArr80Revenue.join(""));
//     resultArr80Revenue.sort(); // reset to ASC
//   });

// // --------------- END OF VALIDATE COLUMN ORDER ASSERTIONS - REFERENCE ONLY --------------
