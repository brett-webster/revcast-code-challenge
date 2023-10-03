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

import {
  TeamDropdownFilter,
  CustomerDropdownFilter,
} from "./dropdownComponents"; // ADDED
import LandingPage from "./landingPage"; // ADDED
import {
  teamListArrResult,
  customerListArrResult,
} from "../data/testingDataForfilteringLogicHelperFxns"; // ADDED

// ----------

beforeEach(async () => {
  jest.resetAllMocks();
  configure({
    throwSuggestions: true,
  }); // UNDOCUMENT this to view all RTL-generated suggested revisions in console
});

// --------------

describe("Unit testing of UI components...", () => {
  test("Correctly renders dropdown button -- ALL TEAMS -- in dropdownComponents.tsx", async () => {
    //   user.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    const user = userEvent.setup();
    render(
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
}); // END describe("Unit testing of UI component...")
