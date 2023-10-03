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

import TableComponent from "./TableComponent"; // ADDED
import LandingPage from "./landingPage"; // ADDED

// ----------

beforeEach(async () => {
  jest.resetAllMocks();
  configure({
    throwSuggestions: true,
  }); // UNDOCUMENT this to view all RTL-generated suggested revisions in console
});

// --------------

describe("Unit testing of UI component...", () => {
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
