import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // https://www.ag-grid.com/react-data-grid/ --- https://www.youtube.com/watch?v=Pr__B6HM_s4&list=PLsZlhayVgqNwHNHeqpCkSgdRV08xrKtzW --- https://youtu.be/pebXUHUdlos (filter advanced)
import { ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import type { augmentedRepObjectType } from "../server";

// -------

type tableComponentPropsType = {
  dataRows: augmentedRepObjectType[];
};

// Using distilled version of this:  https://www.ag-grid.com/javascript-data-grid/value-formatters/?ref=blog.ag-grid.com#value-formatters
type paramsType = {
  value: number;
};

// -------

const TableComponentAGgrid = ({
  dataRows,
}: tableComponentPropsType): JSX.Element => {
  // Rows passed down as prop
  // Assemble column headers here (ag-grid autoformats 'field' property into suitable 'headerName'...)
  const columnDefs: ColDef[] = [
    { field: "id", headerName: "ID" }, // Adjustment of autoformatting required here, using 'headerName'
    { field: "firstName" }, // --> First Name
    { field: "lastName" }, // --> Last Name
    { field: "email" }, // --> Email
    { field: "teamName", headerName: "Team" },
    { field: "totalRevenue", valueFormatter: currencyFormatter }, // --> Total Revenue
    // https://www.ag-grid.com/javascript-data-grid/value-formatters/?ref=blog.ag-grid.com#value-formatters
  ];

  // https://www.ag-grid.com/javascript-data-grid/value-formatters/?ref=blog.ag-grid.com#value-formatters
  function currencyFormatter(params: paramsType): string {
    return "$" + formatNumber(params.value) + "k";
  }

  function formatNumber(number: number): string {
    // Insert commas into number (eg 1000k --> 1,000k)
    return Math.floor(number / 1000)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  // Avoid re-renders by placing these outside of individual rows
  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      flex: 1, // Dynamically collapse/expand table horizontally:  https://www.ag-grid.com/javascript-data-grid/column-sizing/
    }),
    []
  );

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
          Surfing the Pipeline with Revcast&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <br></br>
      <br></br>

      <div
        className="ag-theme-alpine"
        style={{
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <AgGridReact
          rowData={dataRows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef} // Dynamically collapse/expand table horizontally (see above)
          animateRows={true}
          suppressHorizontalScroll={true}
          domLayout={"autoHeight"} // auto-adjust vertical size of table on-filter
        ></AgGridReact>
      </div>
    </>
  );
}; // end TableComponentAGgrid

// -------

export default TableComponentAGgrid;
