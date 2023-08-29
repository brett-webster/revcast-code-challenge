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
  dataRows: augmentedRepObjectType[]; // augmentedRepObjectType[]
};

type tableComponentPropsType = {
  dataRows: augmentedRepObjectType[]; // augmentedRepObjectType[] ** OLD ERROR STARTS HERE **
};

// https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty
// NOTE:  Used to solve an object indexing error.  Solution search for "export interface IItem extends Record<string, any> {" ...
export interface dataRowModifiedType extends Record<string, any> {
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
    <thead>
      <tr>{columnHeaderNamesBundle}</tr>
    </thead>
  );
}; // end ColumnHeader Component

// -------

const TableContent = ({
  columnHeadersMatchingSchema,
  dataRows,
}: tableContentPropsType): JSX.Element => {
  const bundledTable: JSX.Element[] = dataRows?.map(
    (dataRow: augmentedRepObjectType) => (
      <tr key={`${dataRow.id}DATA`}>
        {columnHeadersMatchingSchema.map((columnSchemaName: string) => (
          <td className="reps-table-cell" key={`${columnSchemaName}SCHEMA`}>
            {(dataRow as dataRowModifiedType)[columnSchemaName]}
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
      TITLE HERE!!
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
