import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
  sortedStateType,
} from "./server";

// ----------

function SortByColumnHeaderAscOrDesc(
  sortedState: sortedStateType,
  threeFilteredObjectsForClient: nestedFilteredObjectsForClientType
) {
  //   const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
  // JSON.parse(JSON.stringify(threeFilteredObjectsForClient)); // deep clone
  const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
    { ...threeFilteredObjectsForClient }; // deep copy top level, shallow lower level
  //   const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
  //     {
  //       teamCurrentSelectionResults:
  //         threeFilteredObjectsForClient?.teamCurrentSelectionResults.slice(),
  //       customerCurrentSelectionResults:
  //         threeFilteredObjectsForClient?.customerCurrentSelectionResults.slice(),
  //       combinedCurrentSelectionResults:
  //         threeFilteredObjectsForClient?.combinedCurrentSelectionResults.slice(),
  //     };

  const {
    columnHeadToSort,
    order,
  }: { columnHeadToSort: string; order: string } = sortedState; // destructuring in-line

  // Below used to map column headers displayed onto keys needed to reference object
  type columnHeadMapType = {
    ID: string;
    "First Name": string;
    "Last Name": string;
    Email: string;
    Team: string;
    "Total Revenue": string;
  };

  const columnHeadMap: columnHeadMapType = {
    ID: "id",
    "First Name": "firstName",
    "Last Name": "lastName",
    Email: "email",
    Team: "teamName",
    "Total Revenue": "totalRevenue",
  };
  const columnHeadSchemaToSort = columnHeadMap[columnHeadToSort];

  //   const test: keyof augmentedRepObjectType = "teamName";  // REMOVE
  console.log("TOP: ", columnHeadToSort, columnHeadSchemaToSort, order); // REMOVE
  //   console.log(threeFilteredObjectsForClient?.combinedCurrentSelectionResults); // REMOVE

  // ----------

  // ASCENDING SORT
  // Typeof columnHeadToSort dictates type of sort required in JavaScript (numbers & string differing)
  // Sort 3 arrays w/in threeFilteredObjectsForClient based on ascending/descending
  if (order === "Ascending") {
    if (
      columnHeadSchemaToSort === "id" ||
      columnHeadSchemaToSort === "totalRevenue"
    ) {
      // ASCENDING, for numbers
      reSortedThreeFilteredObjectsForClient?.teamCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] - b[columnHeadSchemaToSort];
        }
      );
      reSortedThreeFilteredObjectsForClient?.customerCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] - b[columnHeadSchemaToSort];
        }
      );
      reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] - b[columnHeadSchemaToSort];
        }
      );
      //   console.log(
      //     // reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults,
      //     "in ascending for NUMS....",
      //     columnHeadToSort,
      //     columnHeadSchemaToSort
      //   ); // REMOVE
    } else {
      // ASCENDING for strings
      reSortedThreeFilteredObjectsForClient?.teamCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? -1 : 1;
        }
      );
      reSortedThreeFilteredObjectsForClient?.customerCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? -1 : 1;
        }
      );
      reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? -1 : 1;
        }
      );
      //   console.log(
      //     // reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults,
      //     "in ascending for STRINGS....",
      //     columnHeadToSort,
      //     columnHeadSchemaToSort
      //   ); // REMOVE
    }
  } // end ASCENDING

  // ----------

  // DESCENDING SORT
  else if (order === "Descending") {
    if (
      columnHeadSchemaToSort === "id" ||
      columnHeadSchemaToSort === "totalRevenue"
    ) {
      // DESCENDING, for numbers
      reSortedThreeFilteredObjectsForClient?.teamCurrentSelectionResults?.sort(
        (a, b) => {
          return b[columnHeadSchemaToSort] - a[columnHeadSchemaToSort];
        }
      );
      reSortedThreeFilteredObjectsForClient?.customerCurrentSelectionResults?.sort(
        (a, b) => {
          return b[columnHeadSchemaToSort] - a[columnHeadSchemaToSort];
        }
      );
      reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults?.sort(
        (a, b) => {
          return b[columnHeadSchemaToSort] - a[columnHeadSchemaToSort];
        }
      );
      //   console.log(
      //     // reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults,
      //     "in descending for NUMS....",
      //     columnHeadToSort,
      //     columnHeadSchemaToSort
      //   ); // REMOVE
    } else {
      // DESCENDING for strings
      reSortedThreeFilteredObjectsForClient?.teamCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? 1 : -1;
        }
      );
      reSortedThreeFilteredObjectsForClient?.customerCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? 1 : -1;
        }
      );
      reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults?.sort(
        (a, b) => {
          return a[columnHeadSchemaToSort] < b[columnHeadSchemaToSort] ? 1 : -1;
        }
      );
      //   console.log(
      //     // reSortedThreeFilteredObjectsForClient?.combinedCurrentSelectionResults,
      //     "in descending for STRINGS....",
      //     columnHeadToSort,
      //     columnHeadSchemaToSort
      //   ); // REMOVE
    }
  } // end DESCENDING

  // ----------

  return reSortedThreeFilteredObjectsForClient;
}

// ----------

export { SortByColumnHeaderAscOrDesc };
