import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { augmentedRepObjectType } from "../server";

// import "../index.css";  // REMOVE?

// -------

// Using typing here for props bc in-line destructuring unwieldy
type columnHeaderPropsType = {
  columnHeaderNames: string[];
  sortedState: sortedStateType;
  setSortedState: Dispatch<SetStateAction<sortedStateType>>;
};

type columnHeaderCellPropsType = {
  sortedState: sortedStateType;
  columnName: string;
  setSortedState: Dispatch<SetStateAction<sortedStateType>>;
};

type tableContentPropsType = {
  dataRows: augmentedRepObjectType[];
  columnHeadersMatchingSchema: string[];
};

type tableComponentPropsType = {
  dataRows: augmentedRepObjectType[];
  sortedState: sortedStateType;
  setSortedState: Dispatch<SetStateAction<sortedStateType>>;
};

// https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty
// NOTE:  Used to solve an object indexing error.  Solution search for "export interface IItem extends Record<string, any> {" ...
interface dataRowModifiedType extends Record<string, any> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  teamId: number;
  teamName: string;
  totalRevenue: number;
}

export type sortedStateType = {
  columnHeadToSort: string;
  order: string;
};

// -------

const ColumnHeaderCell = ({
  columnName,
  sortedState,
  setSortedState,
}: columnHeaderCellPropsType): JSX.Element => {
  // Based on current state of sorting (order), determine what next click would yield so it can be used in setSortedState
  let nextSortingOrder: string = "";
  if (sortedState.columnHeadToSort !== columnName)
    nextSortingOrder = "Ascending";
  else if (sortedState.order === "Ascending") nextSortingOrder = "Descending";
  else nextSortingOrder = "Ascending";

  // TO REMOVE
  // if (process.env.NODE_ENV === "test") {
  //   nextSortingOrder = sortedState.order; // overwrite above toggle w. props passed in from unit test
  //   // console.log("nextSortingOrder:  ", nextSortingOrder, sortedState);
  // }

  // :hover in CSS NOT working for some reason so using mouseOver in-line...
  const [cellBackgroundColor, setCellBackgroundColorOnHover] =
    useState<string>("#34d399");
  const [mouseCursorType, setMouseCursor] = useState<string>("cursor");

  type headerCellStyleType = {
    backgroundColor: string;
    cursor: string;
  };

  const headerCellStyle: headerCellStyleType = {
    backgroundColor: cellBackgroundColor,
    cursor: mouseCursorType,
  };

  const columnHeaderCell: JSX.Element = (
    <td
      //   id="reps-table-cell-header"  // :hover in CSS not working for some reason...
      style={headerCellStyle}
      onMouseOver={() => {
        setCellBackgroundColorOnHover("#2dbe89");
        setMouseCursor("pointer");
      }}
      onMouseLeave={() => {
        setCellBackgroundColorOnHover("#34d399");
        setMouseCursor("cursor");
      }}
      className="reps-table-cell"
      onClick={() => {
        setSortedState({
          columnHeadToSort: columnName,
          order: nextSortingOrder,
        });
      }} // Reset state to newly clicked on column header name & order
      key={`${columnName}HEADERCELL`}
    >
      {columnName}
      {sortedState.columnHeadToSort === columnName &&
      sortedState.order === "Ascending" ? (
        <span>&nbsp;&nbsp;▲</span>
      ) : null}
      {sortedState.columnHeadToSort === columnName &&
      sortedState.order === "Descending" ? (
        <span>&nbsp;&nbsp;▼</span>
      ) : null}
    </td>
  );

  return <>{columnHeaderCell}</>;
}; // end ColumnHeader Individual CellComponent

//   --------

const ColumnHeader = ({
  columnHeaderNames,
  sortedState,
  setSortedState,
}: columnHeaderPropsType): JSX.Element => {
  const columnHeaderNamesBundle: JSX.Element[] = columnHeaderNames.map(
    (columnName: string) => (
      <ColumnHeaderCell
        columnName={columnName}
        sortedState={sortedState}
        setSortedState={setSortedState}
        key={`${columnName}HEADER`}
      />
    )
  );

  return (
    <thead
      style={{ fontWeight: 600, backgroundColor: "#34d399" }}
      // data-testid="tableHeader"
    >
      <tr>{columnHeaderNamesBundle}</tr>
    </thead>
  );
}; // end ColumnHeader Component

// -------

const TableContent = ({
  dataRows,
  columnHeadersMatchingSchema,
}: tableContentPropsType): JSX.Element => {
  const bundledTable: JSX.Element[] = dataRows?.map(
    (dataRow: augmentedRepObjectType, indexPostFilter: number) => (
      <tr
        style={
          indexPostFilter % 2 === 0
            ? { backgroundColor: "rgb(240, 240, 240)" }
            : { backgroundColor: "ddddd" }
        }
        key={`${indexPostFilter}DATA`}
      >
        {columnHeadersMatchingSchema.map((columnSchemaName: string) => (
          <td className="reps-table-cell" key={`${columnSchemaName}SCHEMA`}>
            {columnSchemaName === "totalRevenue"
              ? "$" +
                Math.round(
                  (dataRow as dataRowModifiedType)[columnSchemaName] / 1000
                ).toLocaleString("en-US") +
                "k"
              : (dataRow as dataRowModifiedType)[columnSchemaName]}
          </td>
        ))}
      </tr>
    )
  );

  return (
    <tbody
    // data-testid="tableBody"
    >
      {bundledTable}
    </tbody>
  );
}; // end TableContent Component

// -------

const TableComponent = ({
  dataRows,
  sortedState,
  setSortedState,
}: tableComponentPropsType): JSX.Element => {
  const columnHeaderNames: string[] = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Team",
    "Total Revenue",
  ];
  const columnHeadersMatchingSchema: string[] = [
    "id",
    "firstName",
    "lastName",
    "email",
    "teamName",
    "totalRevenue",
  ];

  return (
    <>
      <title>Surfing the Pipeline with Revcast</title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20%",
          marginRight: "20%",
          marginTop: "3%",
        }}
      >
        <div
          style={{
            fontFamily: "verdana",
            fontSize: "28px",
            fontWeight: "600",
            display: "flex",
          }}
        >
          Surfing the Pipeline with Revcast!&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <table className="reps-table">
        <ColumnHeader
          columnHeaderNames={columnHeaderNames}
          sortedState={sortedState}
          setSortedState={setSortedState}
        />
        <TableContent
          dataRows={dataRows}
          columnHeadersMatchingSchema={columnHeadersMatchingSchema}
        />
      </table>
    </>
  );
}; // end TableComponent

// -------

export default TableComponent;
