import {
  render,
  screen,
  logRoles,
  act,
  waitFor,
  within,
  cleanup,
  configure,
} from "@testing-library/react"; // <--- waitFor https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b  /  https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
import user, { userEvent } from "@testing-library/user-event"; // ADDED & upgraded to version "^14.0.0" from Create React App's default of "^13.5.0"
import { debug } from "jest-preview"; // ADDED -- // USEFUL TOOL: open localhost:3336 to view basic DOM UI in browser

import App from "./App";
import {
  TeamDropdownFilter,
  CustomerDropdownFilter,
} from "./pages/dropdownComponents"; // ADDED
import TableComponent from "./pages/TableComponent"; // ADDED
import LandingPage from "./pages/landingPage"; // ADDED
import {
  teamListArrResult,
  customerListArrResult,
} from "./data/testingDataForfilteringLogicHelperFxns"; // ADDED

// ----------

// USEFUL LINKS FOR REACT TESTING LIBRARY
// ** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library **
// Role List:  https://www.w3.org/TR/html-aria/#docconformance
// Query Priority List:  https://testing-library.com/docs/queries/about/#priority
// React Testing Tutorial (1/53):  https://www.youtube.com/watch?v=T2sv8jXoP4s&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=2
// Future additions:  Snapshots, use MSW

// ----------

beforeEach(async () => {
  jest.resetAllMocks();
  //   await act(async () => ""); // IN PLACE OF 'waitFor', CAN ADD THIS ONLY HERE to avoid following error warning:  "Warning: An update to LandingPage inside a test was not wrapped in act(...).  When testing, code that causes React state updates should be wrapped into act(...):"
  configure({
    throwSuggestions: true,
  }); // UNDOCUMENT this to view all RTL-generated suggested revisions in console
  // --> 2 RED warnings/fails each of which suggests an alternative query:  "TestingLibraryElementError: A better query is available, try this: ..."
  // + "Warning: An update to LandingPage inside a test was not wrapped in act(...)", latter eliminated by using waitFor or act wrappers
});

// ---------------------------------------

describe("Unit testing of UI component...", () => {
  // *** App.tsx COMPONENT ***
  test("Correctly renders Revcast LOGO img in App.tsx", async () => {
    render(<App />);
    const image = screen.getByRole("img", { name: "Revcast Logo" });
    //   console.log(image); // view properties of image here
    await waitFor(() => {
      expect(image).toBeInTheDocument();
    });
    // screen.debug(); // USEFUL TOOL: logs formatted DOM tree to CLI for closer inspection
    //   await waitFor(() => {
    //     const view = render(<App />);
    //     logRoles(view.container); // USEFUL TOOL: view implicit aria roles w/in DOM tree for closer inspection (NOTE: must first import { logRoles } from "@testing-library/react"; AND assign const view = render(<COMPONENT /> as above)
    //   });
    //   debug(); // USEFUL TOOL (distinct from screen.debug): used w/ "jest-preview" library (OPEN localhost:3336 to view basic DOM UI in browser)
  });

  test("Elements are correctly focused on keyboard tabbing (full circle) in App.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    render(<App />);

    const teamButtonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
    const customerButtonElement = screen.getByRole("button", {
      name: "-- ALL CUSTOMERS --",
    });

    // await act(async () => { // equiv. to waitFor
    await waitFor(async () => {
      await user.tab();
      expect(teamButtonElement).toHaveFocus();
      expect(customerButtonElement).not.toHaveFocus();
      // debug();
      await user.tab();
      expect(customerButtonElement).toHaveFocus();
      expect(teamButtonElement).not.toHaveFocus();
      await user.tab();
      expect(teamButtonElement).not.toHaveFocus();
      expect(customerButtonElement).not.toHaveFocus();
      await user.tab();
      expect(teamButtonElement).toHaveFocus();
      expect(customerButtonElement).not.toHaveFocus();
      // debug();
    });
  });

  // ------------

  // *** dropdownComponents.tsx COMPONENT ***
  test("Correctly renders dropdown button -- ALL TEAMS -- in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(
      <TeamDropdownFilter
        teamList={teamListArrResult} // importing this data in from testingDataForfilteringLogicHelperFxns.tsx in order to populate TEAM dropdown array
        setSelectedTeam={() => {}} // dummy data passed in as props to avoid error
        setTeamOrCustomerChangedFlag={() => {}} // dummy data passed in as props to avoid error
        selectedTeam={""} // dummy data passed in as props to avoid error
      />
      // { wrapper: LandingPage }
    );

    const buttonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
    //   const buttonElement = screen.getByRole("button", {
    //     name: /\-\- all teams \-\-/i,
    //   });
    expect(buttonElement).toBeInTheDocument();

    // Identical logic to ALL CUSTOMERS below...
    //   console.log(buttonElement.style.backgroundColor); // default color = "#bee1d4" = rgb(190, 225, 212)
    await waitFor(async () => {
      await user.hover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(buttonElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      // console.log(buttonElement.style.backgroundColor); // default color = "#bee1d4" = rgb(190, 225, 212)
    });
  });

  test("Correctly renders dropdown button -- ALL CUSTOMERS -- in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(
      <CustomerDropdownFilter
        customerList={customerListArrResult} // importing this data in from testingDataForfilteringLogicHelperFxns.tsx in order to populate CUSTOMER dropdown array
        setSelectedCustomer={() => {}} // dummy data passed in as props to avoid error
        setTeamOrCustomerChangedFlag={() => {}} // dummy data passed in as props to avoid error
        selectedCustomer={""} // dummy data passed in as props to avoid error
      />
      // { wrapper: LandingPage }
    );

    const buttonElement = screen.getByRole("button", {
      name: "-- ALL CUSTOMERS --",
    });
    //   const buttonElement = screen.getByRole("button", {
    //     name: /\-\- all customers \-\-/i,
    //   });
    expect(buttonElement).toBeInTheDocument();

    // Identical logic to ALL TEAMS above...
    //   console.log(buttonElement.style.backgroundColor); // default color = "#bee1d4" = rgb(190, 225, 212)
    await waitFor(async () => {
      await user.hover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(buttonElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(buttonElement); //
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      // console.log(buttonElement.style.backgroundColor); // default color = "#bee1d4" = rgb(190, 225, 212)
    });
  });

  test("onClick correctly works for TEAMS dropdown LIST button in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    const handleDropdownFilterClick = jest.fn();
    const teamButton = (
      <button onClick={handleDropdownFilterClick}>-- ALL TEAMS --</button>
    );
    render(teamButton);
    const buttonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
    //   const buttonElement = screen.getByRole("button", {
    //     name: /\-\- all teams \-\-/i,
    //   });
    await waitFor(async () => {
      await user.click(buttonElement);
    });
    await waitFor(() => {
      expect(handleDropdownFilterClick).toBeCalledTimes(1);
      expect(handleDropdownFilterClick).not.toBeCalledTimes(0);
      expect(handleDropdownFilterClick).not.toBeCalledTimes(2);
    });
  });

  // Replicate above test for CUSTOMERS dropdown LIST button here...

  test("onClick correctly renders fully functional dropdown LIST of TEAMS in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(
      // <LandingPage />
      <TeamDropdownFilter
        teamList={teamListArrResult} // importing this data in from testingDataForfilteringLogicHelperFxns.tsx in order to populate TEAM dropdown array
        setSelectedTeam={() => {}} // dummy data passed in as props to avoid error
        setTeamOrCustomerChangedFlag={() => {}} // dummy data passed in as props to avoid error
        selectedTeam={""} // dummy data passed in as props to avoid error
      />,
      { wrapper: LandingPage }
    );

    const buttonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
    //   let dropdownList: any = null; // REMOVE
    let dropdownList: any = screen.queryByRole("list", {}); // by default, dropdown list is NOT rendered until button is clicked
    //   console.log(dropdownList); // 'queryByRole' returns 'null' in absence vs. throwing error in case of 'getByRole'
    expect(dropdownList).not.toBeInTheDocument();
    //   debug();

    // First click on dropdown button to render dropdown list...
    await waitFor(async () => {
      await user.click(buttonElement);
      // dropdownList = screen.getByTestId("dropdownListTEAMS");
      dropdownList = screen.getByRole("list", {});
      // console.log("dropdownList TEAM: ", dropdownList);
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ---> Document out remainder of test to view rendered dropdown upon auto-click in browser using "Jest-preview"...
    // ...in order to test hovering away from dropdown button
    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument(); // EXAMINE this more closely, should throw error REMOVING '.not'...
      // debug();
    });

    // Click on dropdown button again...
    await waitFor(async () => {
      await user.click(buttonElement);
      // dropdownList = screen.getByTestId("dropdownListTEAMS");
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ...in order to test hovering away from dropdown list itself (and button)
    await waitFor(async () => {
      await user.unhover(dropdownList);
      // await user.unhover(buttonElement); // TO REMOVE
      // console.log("HERE: ", buttonElement.style.backgroundColor);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
      // debug();
    });

    // Click on dropdown button for 3rd time...
    await waitFor(async () => {
      await user.click(buttonElement);
      // dropdownList = screen.getByTestId("dropdownListTEAMS"); // NOTE:  Replaced w/ getByRole
      dropdownList = screen.getByRole("list", {});
      // console.log(dropdownList);
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ...in order to test selecting a dropdown list item
    await waitFor(async () => {
      // const { getAllByRole } = within(dropdownList);
      // const items = getAllByRole("listitem");
      // const penultimateListElement = items[11]; // Teal Titans
      // console.log(
      //   "TEAM COUNT = ",
      //   items.length,
      //   items[11].textContent,
      //   items[11]
      // );
      // const penultimateListElement = screen.getByRole("listitem", {
      //   name: "Teal Titans",
      // }); // this throws error since multiple list items...
      // const penultimateListElement = screen.getByText("Teal Titans"); // Not working either...NOTE:  getByText may find multiple occurrences --> "Found multiple elements with the text: Teal Titans" (<button>, <li> & potentially in table body)
      // const penultimateListElement = screen.getByTestId("Teal TitansTESTID"); // Note: Not ideal to use TESTID here, replaced w/ getAllByRole
      let teamListItemArray = screen.getAllByRole("listitem"); // ** NOTE: including process.env.NODE_ENV === "test" conditional in dropDownComponents.tsx module in order to populate expandedTeamList array & avoid empty array error
      // console.log("teamListItemArray: ", teamListItemArray.length);
      expect(teamListItemArray).toHaveLength(teamListArrResult.length + 1); // 13 total
      const penultimateListElement = teamListItemArray[11]; // "Teal Titans" @ index # 11

      // console.log(
      //   "penultimateListElement:  ",
      //   penultimateListElement.textContent,
      //   penultimateListElement
      // );

      expect(penultimateListElement).toHaveTextContent("Teal Titans");
      await user.click(penultimateListElement);
      expect(buttonElement).toHaveValue("Teal Titans"); // reset value in button element changes
      expect(buttonElement).not.toHaveValue("-- ALL TEAMS --");
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });

      dropdownList = screen.queryByRole("list", {});
      teamListItemArray = screen.queryAllByRole("listitem");
      // console.log(teamListItemArray); // should return empty array [] using 'queryAllByRole'
      expect(dropdownList).not.toBeInTheDocument();
      expect(teamListItemArray).toHaveLength(0); // should return empty array [] using 'queryAllByRole'
      // debug();
    });
  });

  test("onClick correctly renders fully functional dropdown LIST of CUSTOMERS in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(
      // <LandingPage />
      <CustomerDropdownFilter
        customerList={customerListArrResult} // importing this data in from testingDataForfilteringLogicHelperFxns.tsx in order to populate CUSTOMER dropdown array
        setSelectedCustomer={() => {}} // dummy data passed in as props to avoid error
        setTeamOrCustomerChangedFlag={() => {}} // dummy data passed in as props to avoid error
        selectedCustomer={""} // dummy data passed in as props to avoid error
      />,
      { wrapper: LandingPage }
    );

    const buttonElement = screen.getByRole("button", {
      name: "-- ALL CUSTOMERS --",
    });
    //   let dropdownList: any = null; // REMOVE
    let dropdownList: any = screen.queryByRole("list", {}); // by default, dropdown list is NOT rendered until button is clicked
    //   console.log(dropdownList); // 'queryByRole' returns 'null' in absence vs. throwing error in case of 'getByRole'
    expect(dropdownList).not.toBeInTheDocument();

    //   debug();
    // First click on dropdown button to render dropdown list...
    await waitFor(async () => {
      await user.click(buttonElement); // , undefined, { skipHover: true }
      // dropdownList = screen.getByTestId("dropdownListCUSTOMERS"); // NOTE:  Replaced w/ getByRole
      dropdownList = screen.getByRole("list", {});
      // console.log("dropdownList CUSTOMER:  ", dropdownList);
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ---> Document out remainder of test to view rendered dropdown upon auto-click in browser using "Jest-preview"...
    // ...in order to test hovering away from dropdown button
    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
      // debug();
    });

    // Click on dropdown button again...
    await waitFor(async () => {
      await user.click(buttonElement);
      // dropdownList = screen.getByTestId("dropdownListCUSTOMERS"); // NOTE:  Replaced w/ getByRole
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ...in order to test hovering away from dropdown list itself
    await waitFor(async () => {
      await user.unhover(dropdownList);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
      // debug();
    });

    // Click on dropdown button for 3rd time...
    await waitFor(async () => {
      await user.click(buttonElement);
      // dropdownList = screen.getByTestId("dropdownListCUSTOMERS"); // NOTE:  Replaced w/ getByRole
      dropdownList = screen.getByRole("list", {});
      // console.log(dropdownList);
      expect(dropdownList).toBeInTheDocument();
      // debug();
    });

    // ...in order to test selecting a dropdown list item
    await waitFor(async () => {
      // const secondListElement = screen.getByRole("listitem", {
      //   name: "ABC Company",
      // }); // this throws error since multiple listitems...
      // const secondListElement = screen.getByText("ABC Company"); // NOTE:  getByText may find multiple occurrences --> "Found multiple elements with the text: ABC Company" (<button>, <li> & potentially in table body)
      let customerListItemArray = screen.getAllByRole("listitem"); // ** NOTE: including process.env.NODE_ENV === "test" conditional in dropDownComponents.tsx module in order to populate expandedCustomerList array & avoid empty array error
      expect(customerListItemArray).toHaveLength(
        customerListArrResult.length + 1
      ); // 8 total
      const secondListElement = customerListItemArray[2]; // "ABC Company" @ index # 2
      // console.log("secondListElement:  ", secondListElement);

      await user.click(secondListElement);
      expect(buttonElement).toHaveValue("ABC Company"); // reset value in button element changes
      expect(buttonElement).not.toHaveValue("-- ALL CUSTOMERS --");
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });

      dropdownList = screen.queryByRole("list", {});
      customerListItemArray = screen.queryAllByRole("listitem");
      // console.log(customerListItemArray); // should return empty array [] using 'queryAllByRole'
      expect(dropdownList).not.toBeInTheDocument();
      expect(customerListItemArray).toHaveLength(0); // should return empty array [] using 'queryAllByRole'
      // debug();
    });
  });

  // -------------

  // *** TableComponent.tsx COMPONENT ***
  const tableComponentWithDummyProps = (
    <TableComponent
      dataRows={[]} // empty
      sortedState={{
        columnHeadToSort: "ID",
        order: "Ascending", // "Descending"
      }}
      setSortedState={() => {}} // dummy fxn
    />
  );
  test("Correctly renders Surfing the Pipeline with Revcast TITLE in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps); // assigned above
    const element = screen.getByText("Surfing the Pipeline with Revcast"); // getByTestId("title") + data-testid="title" NOT needed here <-- https://testing-library.com/docs/queries/about/#priority
    //   const element = screen.getByRole("title"); // UNDOCUMENT TO VIEW all Roles in DOM since will throw Error
    await waitFor(() => {
      expect(element).toHaveTextContent("Surfing the Pipeline with Revcast");
    });
  });

  test("Correctly renders Surfing the Pipeline with Revcast! TABLE HEADER in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps);
    const element = screen.getByText(/Surfing the Pipeline with Revcast!/i);
    await waitFor(() => {
      expect(element).toBeInTheDocument();
    });
  });

  // Full Table ---> <table>
  test("Correctly renders entire TABLE in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps);
    const fullTableElement = screen.getByRole("table", {});
    await waitFor(() => {
      expect(fullTableElement).toBeInTheDocument();
    });
  });

  // Table Header ---> <thead>
  test("Correctly renders entire TABLE HEADER in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps);
    // const tableHeaderElement = screen.getByTestId("tableHeader"); // NOTE:  Replaced w/ getByRole
    const tableHeaderElement = screen.getAllByRole("rowgroup", {})[0]; // NOTE:  screen.getByRole("rowgroup", {}) throws ERROR because 2 rowgroup roles --> <thead> & <tbody>

    await waitFor(() => {
      expect(tableHeaderElement).toBeInTheDocument();
    });
  });

  // Table Body ---> <tbody>
  test("Correctly renders entire TABLE BODY in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps);
    //   const tableBodyElement = screen.getByTestId("tableBody"); // NOTE:  Replaced w/ getByRole
    const tableBodyElement = screen.getAllByRole("rowgroup", {})[1]; // NOTE:  screen.getByRole("rowgroup", {}) throws ERROR because 2 rowgroup roles --> <thead> & <tbody>

    await waitFor(() => {
      expect(tableBodyElement).toBeInTheDocument();
    });
  });

  // Full Row Column Headers ---> <tr> --> ALL:  'ID First Name Last Name Email Team Total Revenue'
  test("Correctly renders ALL column headers as single ROW in TableComponent.tsx", async () => {
    render(tableComponentWithDummyProps, { wrapper: LandingPage }); // NOTE: wrapper needed here to avoid error...
    const fullRowElement = screen.getByRole("row", {
      name: "ID First Name Last Name Email Team Total Revenue",
    });
    await waitFor(() => {
      expect(fullRowElement).toBeInTheDocument();
    });
  });

  // Column Headers ---> <td> --> INDIVIDUAL CELLS:  ID First Name Last Name Email Team Total Revenue
  test("Correctly renders individual column header ID as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /id/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
      // debug();
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("Correctly renders individual column header First Name as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /First Name/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("Correctly renders individual column header Last Name as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /Last Name/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("Correctly renders individual column header Email as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /Email/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("Correctly renders individual column header Team as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /Team/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("Correctly renders individual column header Total Revenue as a CELL in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    const cellElement = screen.getByRole("cell", { name: /Total Revenue/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    //   console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    await waitFor(async () => {
      await user.hover(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
      // console.log(cellElement.style.backgroundColor); // hover color = "#2dbe89" = rgb(45, 190, 137)
    });

    await waitFor(async () => {
      await user.unhover(cellElement); //
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(52, 211, 153)", // default color = "#34d399" = rgb(52, 211, 153)
      });
      // console.log(cellElement.style.backgroundColor); // default color = "#34d399" = rgb(52, 211, 153)
    });
  });

  test("onClick/offClick correctly renders individual column header ID and Total Revenue as CELLs with UP/DOWN arrows in TableComponent.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(tableComponentWithDummyProps);

    let cellElement = screen.getByRole("cell", { name: /id/i });
    await waitFor(() => {
      expect(cellElement).toBeInTheDocument();
    });

    // Click #1 on ID column header
    await waitFor(async () => {
      await user.click(cellElement);
      expect(cellElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
        cursor: "pointer", // default = "cursor"
      });
      // console.log(cellElement.textContent);
    });

    await waitFor(() => {
      // expect(cellElement.textContent).toBe("ID  ▲"); // WHY NOT WORKING??
      // ID element contents (ONLY contains ▲)
      expect(cellElement).toHaveTextContent("ID ▲");
      expect(cellElement).not.toHaveTextContent("▼");

      // Other 5 element contents (i.e. absence of ▲ or ▼)
      expect(
        screen.getByRole("cell", { name: /First Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Last Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Email/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(screen.getByRole("cell", { name: /Team/i })).not.toHaveTextContent(
        "▲" && "▼"
      );
      expect(
        screen.getByRole("cell", { name: /Total Revenue/i })
      ).not.toHaveTextContent("▲" && "▼");
    });
    cleanup(); // Remove ▲ component rendered above.  NOTE:  Document this out to view stacked time series of multiple column headers

    // Pre-render TableComponent prior to artificial click (required since removing column headers from prior assertions)
    render(
      <TableComponent
        dataRows={[]} // dummy data passed down as props to avoid error
        sortedState={{
          columnHeadToSort: "ID",
          order: "Descending",
        }}
        setSortedState={() => {}} // dummy fxn passed down as props to avoid error
      />
    );

    cellElement = screen.getByRole("cell", { name: /id/i });
    // Click #2 on ID column header
    await waitFor(async () => {
      await user.click(cellElement);
    });

    await waitFor(() => {
      // ID element contents (ONLY contains ▼)
      expect(cellElement).toHaveTextContent("ID ▼");
      expect(cellElement).not.toHaveTextContent("▲");

      // Other 5 element contents (i.e. absence of ▲ or ▼)
      expect(
        screen.getByRole("cell", { name: /First Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Last Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Email/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(screen.getByRole("cell", { name: /Team/i })).not.toHaveTextContent(
        "▲" && "▼"
      );
      expect(
        screen.getByRole("cell", { name: /Total Revenue/i })
      ).not.toHaveTextContent("▲" && "▼");
    });
    cleanup(); // Remove ▼ component rendered above.  NOTE:  Document this out to view stacked time series of multiple column headers

    // Pre-render TableComponent prior to artificial click (required since removing column headers from prior assertions)
    render(
      <TableComponent
        dataRows={[]} // empty
        sortedState={{
          columnHeadToSort: "Total Revenue",
          order: "Ascending",
        }}
        setSortedState={() => {}} // dummy fxn
      />
    );

    cellElement = screen.getByRole("cell", { name: /Total Revenue/i });
    // Click #1 on Total Revenue column header
    await waitFor(async () => {
      await user.click(cellElement);
    });

    await waitFor(() => {
      // ID element contents (ONLY contains ▲)
      expect(cellElement).toHaveTextContent("Total Revenue ▲");
      expect(cellElement).not.toHaveTextContent("▼");

      // Other 5 element contents (i.e. absence of ▲ or ▼)
      expect(screen.getByRole("cell", { name: /ID/i })).not.toHaveTextContent(
        "▲" && "▼"
      );
      expect(
        screen.getByRole("cell", { name: /First Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Last Name/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(
        screen.getByRole("cell", { name: /Email/i })
      ).not.toHaveTextContent("▲" && "▼");
      expect(screen.getByRole("cell", { name: /Team/i })).not.toHaveTextContent(
        "▲" && "▼"
      );
    });

    //   debug();
  });

  // Replicate the above for each of the other 5 column headers here (excluding ID):  First Name Last Name Email Team Total Revenue
}); // END describe("Unit testing of UI component...")
