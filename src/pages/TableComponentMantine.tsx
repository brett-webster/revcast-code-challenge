import { Dispatch, SetStateAction } from "react";
import { Table } from "@mantine/core"; // https://mantine.dev/core/table/ --- https://www.mantine-react-table.com/docs/guides/sorting

import type { augmentedRepObjectType } from "../server";

// -------

type tableComponentPropsType = {
  dataRows: augmentedRepObjectType[];
  sortedState: sortedStateType;
  setSortedState: Dispatch<SetStateAction<sortedStateType>>;
};

export type sortedStateType = {
  columnHeadToSort: string;
  order: string;
};

// -------

const TableComponentMantine = ({
  dataRows,
  sortedState,
  setSortedState,
}: tableComponentPropsType): JSX.Element => {
  // Bundle up data from dataRows array of row objects into JSX for presentation
  // BELOW THROWS ERROR --> Property 'Tr' / 'Td' does not exist on type 'ForwardRefExoticComponent<TableProps & RefAttributes<HTMLTableElement>>'.
  //   const rows: JSX.Element[] = dataRows.map(
  //     (element: augmentedRepObjectType) => (
  //       <Table.Tr key={element.id}>
  //         <Table.Td>{element.id}</Table.Td>
  //         <Table.Td>{element.firstName}</Table.Td>
  //         <Table.Td>{element.lastName}</Table.Td>
  //         <Table.Td>{element.email}</Table.Td>
  //         <Table.Td>{element.teamName}</Table.Td>
  //         <Table.Td>{element.totalRevenue}</Table.Td>
  //       </Table.Tr>
  //     )
  //   );
  // REPLACEMENT CODE...
  const rows: JSX.Element[] = dataRows.map(
    (element: augmentedRepObjectType) => (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.firstName}</td>
        <td>{element.lastName}</td>
        <td>{element.email}</td>
        <td>{element.teamName}</td>
        <td>
          ${Math.round(element.totalRevenue / 1000).toLocaleString("en-US")}k
        </td>
      </tr>
    )
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

      {/* <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>First Name</Table.Th>
            <Table.Th>Last Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Team</Table.Th>
            <Table.Th>Total Revenue</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table> */}
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Team</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}; // end TableComponentMantine

// -------

export default TableComponentMantine;
