import {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  FilterEntireDatabaseByTeamName,
  FilterEntireDatabaseByCustomerName,
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
  const teamListArr: string[] = teamListArrResult;
  test("Correct, sorted TEAM list is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetUniqueSortedTeamList()).toEqual(teamListArr);
  });

  // ----------

  const customerListArr: string[] = customerListArrResult;
  test("Correct, sorted CUSTOMER list is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetUniqueSortedCustomerList()).toEqual(customerListArr);
  });

  // ----------

  const entireUniqueSortedArrayOfObjs: augmentedRepObjectType[] =
    entireUniqueSortedArrayOfObjsResult;
  test("Correct, ENTIRE, sorted array of objects is returned in filteringLogicHelperFxns.ts:", () => {
    expect(GetEntireUniqueSortedArrayOfObjs()).toEqual(
      entireUniqueSortedArrayOfObjs
    );
  });

  // ----------

  const teamNameInput1 = "Royal Ravens";
  const resultsFilteredByTeamName: augmentedRepObjectType[] =
    resultsFilteredByTeamNameResult;
  test("Correct, rep list filtered by TEAM NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(FilterEntireDatabaseByTeamName(teamNameInput1)).toEqual(
      resultsFilteredByTeamName
    );
  });

  // ----------

  const customerNameInput1 = "Sample Corp";
  const resultsFilteredByCustomerName: augmentedRepObjectType[] =
    resultsFilteredByCustomerNameResult;
  test("Correct, rep list filtered by CUSTOMER NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(FilterEntireDatabaseByCustomerName(customerNameInput1)).toEqual(
      resultsFilteredByCustomerName
    );
  });

  // ----------

  // NOTE:  BELOW IS IDENTICAL TO ABOVE FilterEntireDatabaseByTeamName(teamName: string)
  const teamNameInput2 = "Lime Lightning";
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
  const customerNameInput2 = "123 Industries";
  const combinedCurrentSelectionResultsONLY2: augmentedRepObjectType[] =
    CustomerNewlySelectedOrReplacedAndTeamBlankResult;
  test("Correct, rep list of composite results filtered ONLY by CUSTOMER NAME is returned in filteringLogicHelperFxns.ts:", () => {
    expect(
      CustomerNewlySelectedOrReplacedAndTeamBlank(customerNameInput2)
        .combinedCurrentSelectionResults
    ).toEqual(combinedCurrentSelectionResultsONLY2);
  });

  // ----------

  const customerNameInput3 = "EFG Ltd"; // "Teal Titans" pre-filtered
  const preFilteredTeamResultsInput: augmentedRepObjectType[] =
    preFilteredTeamResultsONLYinput;

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

  const teamNameInput3 = "Blazing Phoenix"; // "XYZ Corporation" pre-filtered
  const preFilteredCustomerResultsInput: augmentedRepObjectType[] =
    preFilteredCustomerResultsONLYinput;

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
