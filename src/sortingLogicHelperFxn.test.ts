import { SortByColumnHeaderAscOrDesc } from "./sortingLogicHelperFxn";

import {
  sortedAscByIDinput,
  sortedAscByIDresults,
  sortedAscByTotalRevenueInput,
  sortedAscByTotalRevenueResults,
  sortedAscByFirstNameInput,
  sortedAscByFirstNameResults,
  sortedAscByLastNameInput,
  sortedAscByLastNameResults,
  sortedAscByEmailInput,
  sortedAscByEmailResults,
  sortedAscByTeamInput,
  sortedAscByTeamResults,
} from "./data/testingDataForsortingLogicHelperFxnASC";

import {
  sortedDescByIDinput,
  sortedDescByIDresults,
  sortedDescByTotalRevenueInput,
  sortedDescByTotalRevenueResults,
  sortedDescByFirstNameInput,
  sortedDescByFirstNameResults,
  sortedDescByLastNameInput,
  sortedDescByLastNameResults,
  sortedDescByEmailInput,
  sortedDescByEmailResults,
  sortedDescByTeamInput,
  sortedDescByTeamResults,
} from "./data/testingDataForsortingLogicHelperFxnDESC";

// ----------------------

describe("Unit testing of back-end functions...", () => {
  // SortByColumnHeaderAscOrDesc(sortedState: sortedStateType, threeFilteredObjectsForClient: nestedFilteredObjectsForClientType)
  // *** ASCENDING SORT ***

  // ..by ID - number
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "ID", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByIDinput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByIDresults);

  test("Correctly sorted results in ASCENDING order by ID is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "ID", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByIDinput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByIDresults);
  });

  // --------

  // ...by Total Revenue - number
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Total Revenue", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByTotalRevenueInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByTotalRevenueResults);

  test("Correctly sorted results in ASCENDING order by Total Revenue is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Total Revenue", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByTotalRevenueInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByTotalRevenueResults);
  });

  // --------

  // ...by First Name - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "First Name", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByFirstNameInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByFirstNameResults);

  test("Correctly sorted results in ASCENDING order by First Name is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "First Name", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByFirstNameInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByFirstNameResults);
  });

  // --------

  // ...by Last Name - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Last Name", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByLastNameInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByLastNameResults);

  test("Correctly sorted results in ASCENDING order by Last Name is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Last Name", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByLastNameInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByLastNameResults);
  });

  // --------

  // ...by Email - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Email", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByEmailInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByEmailResults);

  test("Correctly sorted results in ASCENDING order by Email is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Email", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByEmailInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByEmailResults);
  });

  // --------

  // ...by Team - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Team", order: "Ascending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedAscByTeamInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedAscByTeamResults);

  test("Correctly sorted results in ASCENDING order by Team is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Team", order: "Ascending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedAscByTeamInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedAscByTeamResults);
  });

  // ---------------------------************------------------------------

  // *** DESCENDING SORT ***

  // ..by ID - number
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "ID", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByIDinput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByIDresults);

  test("Correctly sorted results in DESCENDING order by ID is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "ID", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByIDinput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByIDresults);
  });

  // --------

  // ...by Total Revenue - number
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Total Revenue", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByTotalRevenueInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByTotalRevenueResults);

  test("Correctly sorted results in DESCENDING order by Total Revenue is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Total Revenue", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByTotalRevenueInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByTotalRevenueResults);
  });

  // --------

  // ...by First Name - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "First Name", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByFirstNameInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByFirstNameResults);

  test("Correctly sorted results in DESCENDING order by First Name is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "First Name", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByFirstNameInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByFirstNameResults);
  });

  // --------

  // ...by Last Name - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Last Name", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByLastNameInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByLastNameResults);

  test("Correctly sorted results in DESCENDING order by Last Name is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Last Name", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByLastNameInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByLastNameResults);
  });

  // --------

  // ...by Email - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Email", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByEmailInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByEmailResults);

  test("Correctly sorted results in DESCENDING order by Email is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Email", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByEmailInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByEmailResults);
  });

  // // --------

  // ...by Team - string
  // console.log(
  //   SortByColumnHeaderAscOrDesc(
  //     { columnHeadToSort: "Team", order: "Descending" },
  //     {
  //       teamCurrentSelectionResults: [],
  //       customerCurrentSelectionResults: [],
  //       combinedCurrentSelectionResults: sortedDescByTeamInput,
  //     }
  //   ).combinedCurrentSelectionResults
  // );
  // console.log(sortedDescByTeamResults);

  test("Correctly sorted results in DESCENDING order by Team is returned in sortingLogicHelperFxn.ts:", () => {
    expect(
      SortByColumnHeaderAscOrDesc(
        { columnHeadToSort: "Team", order: "Descending" },
        {
          teamCurrentSelectionResults: [],
          customerCurrentSelectionResults: [],
          combinedCurrentSelectionResults: sortedDescByTeamInput,
        }
      ).combinedCurrentSelectionResults
    ).toEqual(sortedDescByTeamResults);
  });
}); // END describe("Unit testing of back-end functions...")
