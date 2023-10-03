import {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  FilterEntireDatabaseByTeamName, // ADDED FOR TESTING
  FilterEntireDatabaseByCustomerName, // ADDED FOR TESTING
  TeamNewlySelectedOrReplacedAndCustomerBlank,
  CustomerNewlySelectedOrReplacedAndTeamBlank,
  TeamDisplayedThenCustomerSelected,
  CustomerDisplayedThenTeamSelected,
} from "./filteringLogicHelperFxns";

import type { augmentedRepObjectType } from "./server";

import {
  teamListArrResult,
  customerListArrResult,
  entireUniqueSortedArrayOfObjsResult,
  resultsFilteredByTeamNameResult,
  resultsFilteredByCustomerNameResult,
  TeamNewlySelectedOrReplacedAndCustomerBlankResult,
  CustomerNewlySelectedOrReplacedAndTeamBlankResult,
  TeamDisplayedThenCustomerSelectedResult,
  CustomerDisplayedThenTeamSelectedResult,
  preFilteredTeamResultsONLYinput,
  preFilteredCustomerResultsONLYinput,
} from "./data/testingDataForfilteringLogicHelperFxns";

// ----------

describe("Unit testing of back-end functions...", () => {
  // GetUniqueSortedTeamList()
  // console.log(GetUniqueSortedTeamList());
  const teamListArr: string[] = teamListArrResult;
  test("Correct, sorted TEAM list is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetUniqueSortedTeamList()).toEqual(teamListArr);
  });

  // ----------

  // GetUniqueSortedCustomerList()
  // console.log(GetUniqueSortedCustomerList());
  const customerListArr: string[] = customerListArrResult;
  test("Correct, sorted CUSTOMER list is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetUniqueSortedCustomerList()).toEqual(customerListArr);
  });

  // ----------

  // GetEntireUniqueSortedArrayOfObjs()
  // console.log(GetEntireUniqueSortedArrayOfObjs());
  const entireUniqueSortedArrayOfObjs: augmentedRepObjectType[] =
    entireUniqueSortedArrayOfObjsResult;
  test("Correct, ENTIRE, sorted array of objects is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetEntireUniqueSortedArrayOfObjs()).toEqual(
      entireUniqueSortedArrayOfObjs
    );
  });

  // ----------

  // FilterEntireDatabaseByTeamName(teamName: string)
  const teamNameInput1 = "Royal Ravens";
  // console.log(FilterEntireDatabaseByTeamName(teamNameInput1));
  const resultsFilteredByTeamName: augmentedRepObjectType[] =
    resultsFilteredByTeamNameResult;
  test("Correct, rep list filtered by TEAM NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(FilterEntireDatabaseByTeamName(teamNameInput1)).toEqual(
      resultsFilteredByTeamName
    );
  });

  // ----------

  // FilterEntireDatabaseByCustomerName(customerName: string)
  const customerNameInput1 = "Sample Corp";
  // console.log(FilterEntireDatabaseByCustomerName(customerNameInput1));
  const resultsFilteredByCustomerName: augmentedRepObjectType[] =
    resultsFilteredByCustomerNameResult;
  test("Correct, rep list filtered by CUSTOMER NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(FilterEntireDatabaseByCustomerName(customerNameInput1)).toEqual(
      resultsFilteredByCustomerName
    );
  });

  // ----------

  // NOTE:  BELOW IS IDENTICAL TO ABOVE FilterEntireDatabaseByTeamName(teamName: string)
  // TeamNewlySelectedOrReplacedAndCustomerBlank(teamName: string)
  const teamNameInput2 = "Lime Lightning";
  // console.log(
  //   TeamNewlySelectedOrReplacedAndCustomerBlank(teamNameInput2)
  //     .combinedCurrentSelectionResults
  // );
  const combinedCurrentSelectionResultsONLY1: augmentedRepObjectType[] =
    TeamNewlySelectedOrReplacedAndCustomerBlankResult;
  test("Correct, rep list of composite results filtered ONLY by TEAM NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(
      TeamNewlySelectedOrReplacedAndCustomerBlank(teamNameInput2)
        .combinedCurrentSelectionResults
    ).toEqual(combinedCurrentSelectionResultsONLY1);
  });

  // ----------

  // NOTE:  BELOW IS IDENTICAL TO ABOVE FilterEntireDatabaseByCustomerName(customerName: string)
  // CustomerNewlySelectedOrReplacedAndTeamBlank(customerName: string)
  const customerNameInput2 = "123 Industries";
  // console.log(
  //   CustomerNewlySelectedOrReplacedAndTeamBlank(customerNameInput2)
  //     .combinedCurrentSelectionResults
  // );
  const combinedCurrentSelectionResultsONLY2: augmentedRepObjectType[] =
    CustomerNewlySelectedOrReplacedAndTeamBlankResult;
  test("Correct, rep list of composite results filtered ONLY by CUSTOMER NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(
      CustomerNewlySelectedOrReplacedAndTeamBlank(customerNameInput2)
        .combinedCurrentSelectionResults
    ).toEqual(combinedCurrentSelectionResultsONLY2);
  });

  // ----------

  // TeamDisplayedThenCustomerSelected(customerName: string, teamCurrentSelectionResults: augmentedRepObjectType[])
  // console.log(
  //   TeamNewlySelectedOrReplacedAndCustomerBlank("Teal Titans")
  //     .combinedCurrentSelectionResults
  // );
  const customerNameInput3 = "EFG Ltd"; // "Teal Titans" pre-filtered
  const preFilteredTeamResultsInput: augmentedRepObjectType[] =
    preFilteredTeamResultsONLYinput;

  // console.log(
  //   TeamDisplayedThenCustomerSelected(
  //     customerNameInput3,
  //     preFilteredTeamResultsInput
  //   ).combinedCurrentSelectionResults
  // );

  const combinedCurrentSelectionResultsONLY3: augmentedRepObjectType[] =
    TeamDisplayedThenCustomerSelectedResult;
  test("Correct, rep list of composite results (pre-filtered by TEAM NAME & then CUSTOMER NAME) is returned in filteringLogicHelperFxns.ts:", () => {
    expect(
      TeamDisplayedThenCustomerSelected(
        customerNameInput3,
        preFilteredTeamResultsInput
      ).combinedCurrentSelectionResults
    ).toEqual(combinedCurrentSelectionResultsONLY3);
  });

  // ----------

  // CustomerDisplayedThenTeamSelected(teamName: string, customerCurrentSelectionResults: augmentedRepObjectType[])
  // console.log(
  //   CustomerNewlySelectedOrReplacedAndTeamBlank("XYZ Corporation")
  //     .combinedCurrentSelectionResults
  // );
  const teamNameInput3 = "Blazing Phoenix"; // "XYZ Corporation" pre-filtered
  const preFilteredCustomerResultsInput: augmentedRepObjectType[] =
    preFilteredCustomerResultsONLYinput;

  // console.log(
  //   CustomerDisplayedThenTeamSelected(
  //     teamNameInput3,
  //     preFilteredCustomerResultsInput
  //   ).combinedCurrentSelectionResults
  // );

  const combinedCurrentSelectionResultsONLY4: augmentedRepObjectType[] =
    CustomerDisplayedThenTeamSelectedResult;
  test("Correct, rep list of composite results (pre-filtered by CUSTOMER NAME & then TEAM NAME) is returned in filteringLogicHelperFxns.ts:", () => {
    expect(
      CustomerDisplayedThenTeamSelected(
        teamNameInput3,
        preFilteredCustomerResultsInput
      ).combinedCurrentSelectionResults
    ).toEqual(combinedCurrentSelectionResultsONLY4);
  });
}); // END describe("Unit testing of back-end functions...")
