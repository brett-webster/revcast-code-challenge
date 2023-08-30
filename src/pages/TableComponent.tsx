import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

import "../index.css";

// -------

// Using typing here for props bc in-line destructuring unwieldy
type columnHeaderPropsType = {
  columnHeaderNames: string[];
};

type tableContentPropsType = {
  columnHeadersMatchingSchema: string[];
  dataRows: augmentedRepObjectType[];
};

type tableComponentPropsType = {
  dataRows: augmentedRepObjectType[];
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

// -------

const ColumnHeader = ({
  columnHeaderNames,
}: columnHeaderPropsType): JSX.Element => {
  const columnHeaderNamesBundle: JSX.Element[] = columnHeaderNames.map(
    (columnName: string) => (
      <td className="reps-table-cell" key={`${columnName}HEADER`}>
        {columnName}
      </td>
    )
  );

  return (
    <thead style={{ fontWeight: 600, backgroundColor: "#34d399" }}>
      <tr>{columnHeaderNamesBundle}</tr>
    </thead>
  );
}; // end ColumnHeader Component

// -------

const TableContent = ({
  columnHeadersMatchingSchema,
  dataRows,
}: tableContentPropsType): JSX.Element => {
  const bundledTable: JSX.Element[] = dataRows.map(
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

  return <tbody>{bundledTable}</tbody>;
}; // end TableContent Component

// -------

const TableComponent = ({ dataRows }: tableComponentPropsType): JSX.Element => {
  // 'any' should be tableComponentPropsType
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
          Surfing the Pipeline with Revcast&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <table className="reps-table">
        <ColumnHeader columnHeaderNames={columnHeaderNames} />
        <TableContent
          columnHeadersMatchingSchema={columnHeadersMatchingSchema}
          dataRows={dataRows}
        />
      </table>
    </>
  );
}; // end TableComponent

// -------

export default TableComponent;
