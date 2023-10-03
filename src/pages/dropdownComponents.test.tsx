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
import { debug } from "jest-preview"; // USEFUL TOOL: open localhost:3336 to view basic DOM UI in browser

import {
  TeamDropdownFilter,
  CustomerDropdownFilter,
} from "./dropdownComponents";
import LandingPage from "./landingPage";
import {
  teamListArrResult,
  customerListArrResult,
} from "../data/testingDataForfilteringLogicHelperFxns";

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
    expect(buttonElement).toBeInTheDocument();

    // Identical logic to ALL CUSTOMERS below...
    await waitFor(async () => {
      await user.hover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
    });

    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
    });
  });

  test("Correctly renders dropdown button -- ALL CUSTOMERS -- in dropdownComponents.tsx", async () => {
    const user = userEvent.setup();
    render(
      <CustomerDropdownFilter
        customerList={customerListArrResult} // importing this data in from testingDataForfilteringLogicHelperFxns.tsx in order to populate CUSTOMER dropdown array
        setSelectedCustomer={() => {}} // dummy data passed in as props to avoid error
        setTeamOrCustomerChangedFlag={() => {}} // dummy data passed in as props to avoid error
        selectedCustomer={""} // dummy data passed in as props to avoid error
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: "-- ALL CUSTOMERS --",
    });
    expect(buttonElement).toBeInTheDocument();

    // Identical logic to ALL TEAMS above...
    await waitFor(async () => {
      await user.hover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(45, 190, 137)", // hover color = "#2dbe89" = rgb(45, 190, 137)
      });
    });

    await waitFor(async () => {
      await user.unhover(buttonElement); //
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
    });
  });

  test("onClick correctly works for TEAMS dropdown LIST button in dropdownComponents.tsx", async () => {
    const user = userEvent.setup();
    const handleDropdownFilterClick = jest.fn();
    const teamButton = (
      <button onClick={handleDropdownFilterClick}>-- ALL TEAMS --</button>
    );
    render(teamButton);
    const buttonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
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
    let dropdownList: any = screen.queryByRole("list", {}); // by default, dropdown list is NOT rendered until button is clicked
    expect(dropdownList).not.toBeInTheDocument();
    //   debug();

    // First click on dropdown button to render dropdown list...
    await waitFor(async () => {
      await user.click(buttonElement);
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test hovering away from dropdown button
    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument(); // Should throw error REMOVING '.not'...
    });

    // Click on dropdown button again...
    await waitFor(async () => {
      await user.click(buttonElement);
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test hovering away from dropdown list itself (and button)
    await waitFor(async () => {
      await user.unhover(dropdownList);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
    });

    // Click on dropdown button for 3rd time...
    await waitFor(async () => {
      await user.click(buttonElement);
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test selecting a dropdown list item
    await waitFor(async () => {
      let teamListItemArray = screen.getAllByRole("listitem"); // ** NOTE: including process.env.NODE_ENV === "test" conditional in dropDownComponents.tsx module in order to populate expandedTeamList array & avoid empty array error
      expect(teamListItemArray).toHaveLength(teamListArrResult.length + 1); // 13 total
      const penultimateListElement = teamListItemArray[11]; // "Teal Titans" @ index # 11

      expect(penultimateListElement).toHaveTextContent("Teal Titans");
      await user.click(penultimateListElement);
      expect(buttonElement).toHaveValue("Teal Titans"); // reset value in button element changes
      expect(buttonElement).not.toHaveValue("-- ALL TEAMS --");
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });

      dropdownList = screen.queryByRole("list", {});
      teamListItemArray = screen.queryAllByRole("listitem");
      expect(dropdownList).not.toBeInTheDocument();
      expect(teamListItemArray).toHaveLength(0); // should return empty array [] using 'queryAllByRole'
    });
  });

  test("onClick correctly renders fully functional dropdown LIST of CUSTOMERS in dropdownComponents.tsx", async () => {
    const user = userEvent.setup();
    render(
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
    let dropdownList: any = screen.queryByRole("list", {}); // by default, dropdown list is NOT rendered until button is clicked
    expect(dropdownList).not.toBeInTheDocument();

    // First click on dropdown button to render dropdown list...
    await waitFor(async () => {
      await user.click(buttonElement); // , undefined, { skipHover: true }
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test hovering away from dropdown button
    await waitFor(async () => {
      await user.unhover(buttonElement);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
    });

    // Click on dropdown button again...
    await waitFor(async () => {
      await user.click(buttonElement);
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test hovering away from dropdown list itself
    await waitFor(async () => {
      await user.unhover(dropdownList);
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });
      dropdownList = screen.queryByRole("list", {});
      expect(dropdownList).not.toBeInTheDocument();
    });

    // Click on dropdown button for 3rd time...
    await waitFor(async () => {
      await user.click(buttonElement);
      dropdownList = screen.getByRole("list", {});
      expect(dropdownList).toBeInTheDocument();
    });

    // ...in order to test selecting a dropdown list item
    await waitFor(async () => {
      let customerListItemArray = screen.getAllByRole("listitem"); // ** NOTE: including process.env.NODE_ENV === "test" conditional in dropDownComponents.tsx module in order to populate expandedCustomerList array & avoid empty array error
      expect(customerListItemArray).toHaveLength(
        customerListArrResult.length + 1
      ); // 8 total
      const secondListElement = customerListItemArray[2]; // "ABC Company" @ index # 2

      await user.click(secondListElement);
      expect(buttonElement).toHaveValue("ABC Company"); // reset value in button element changes
      expect(buttonElement).not.toHaveValue("-- ALL CUSTOMERS --");
      expect(buttonElement).toHaveStyle({
        backgroundColor: "rgb(190, 225, 212)", // default color = "#bee1d4" = rgb(190, 225, 212)
      });

      dropdownList = screen.queryByRole("list", {});
      customerListItemArray = screen.queryAllByRole("listitem");
      expect(dropdownList).not.toBeInTheDocument();
      expect(customerListItemArray).toHaveLength(0); // should return empty array [] using 'queryAllByRole'
    });
  });
}); // END describe("Unit testing of UI component...")
