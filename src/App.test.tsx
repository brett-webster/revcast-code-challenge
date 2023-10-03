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
import { userEvent } from "@testing-library/user-event"; // ADDED & upgraded to version "^14.0.0" from Create React App's default of "^13.5.0"
import { debug } from "jest-preview"; // USEFUL TOOL: open localhost:3336 to view basic DOM UI in browser

import App from "./App";

// ----------

// USEFUL LINKS FOR REACT TESTING LIBRARY
// ** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library **
// Role List:  https://www.w3.org/TR/html-aria/#docconformance
// Query Priority List:  https://testing-library.com/docs/queries/about/#priority
// React Testing Tutorial (1/53):  https://www.youtube.com/watch?v=T2sv8jXoP4s&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=2

// ----------

beforeEach(async () => {
  jest.resetAllMocks();
  configure({
    throwSuggestions: true,
  }); // UNDOCUMENT this to view all RTL-generated suggested revisions in console
});

// ---------------------------------------

describe("Unit testing of UI component...", () => {
  // *** App.tsx COMPONENT ***
  test("Correctly renders Revcast LOGO img in App.tsx", async () => {
    render(<App />);
    const image = screen.getByRole("img", { name: "Revcast Logo" });
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
    const user = userEvent.setup(); // "@testing-library/user-event": "^14.0.0" <--- https://testing-library.com/docs/user-event/intro/
    render(<App />);

    const teamButtonElement = screen.getByRole("button", {
      name: "-- ALL TEAMS --",
    });
    const customerButtonElement = screen.getByRole("button", {
      name: "-- ALL CUSTOMERS --",
    });

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
}); // END describe("Unit testing of UI component...")
