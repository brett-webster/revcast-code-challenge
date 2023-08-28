import { reps } from "./data/repDb";
import { salesOpps } from "./data/salesOppDb";
import { teams } from "./data/teamsDb";

import type { Representative, Team, SalesOpportunity } from "./data";
import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "./server";

// --------

// DATA OVERVIEW
// 12 teams (12 unique teams)
// 1000 salesOps (7 unique companies, many dups)
// 80 reps (80 unique reps / 40 reps are active in salesOpps, IDs 1-40)

// --------

// console.log(salesOpps); // REMOVE

// --------

function GetUniqueSortedTeamList(): string[] {
  const teamListArray: string[] = teams.map((elem: Team) => elem.name);
  teamListArray.sort();

  return teamListArray;
}

// --------

function GetUniqueSortedCustomerList(): string[] {
  const customerListSet: Set<string> = new Set();
  salesOpps.forEach((elem: SalesOpportunity) =>
    customerListSet.add(elem.customerName)
  );
  // console.log(customerListSet, [...customerListSet].length);  // REMOVE
  const customerListArray: string[] = [...customerListSet].sort();

  return customerListArray;
}

// --------

function GetEntireUniqueSortedArrayOfObjs(): augmentedRepObjectType[] {
  const fullResultsOfDB: augmentedRepObjectType[] =
    FilterEntireDatabaseByTeamName("");
  //   console.log(fullResultsOfDB); // REMOVE

  return fullResultsOfDB;
}

// ----------------------------

// This 'sub-helper' fxn is invoked in several different times in the below helper fxns that are called w/in the endpoint logic in server.ts
function FilterEntireDatabaseByTeamName(
  teamName: string
): augmentedRepObjectType[] {
  const teamID: number | undefined = teams.find(
    (team: Team) => team.name === teamName
  )?.id;
  // ALTERNATIVE - remove
  // const teamID: number = teams.find(
  //   (team: Team) => team.name === teamName
  // )!.id;

  // ONLY filter if an actual team name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
  let repsOnTeam: Representative[] = reps.slice();
  if (teamName !== "") {
    repsOnTeam = reps.filter((rep: Representative) => rep.teamId === teamID);
  }
  //   console.log(repsOnTeam, repsOnTeam.length, teamID); // REMOVE

  // Iterate thru array of repsOnTeam, adding (1) actual teamName as a property and (2) aggregating & adding revenue from salesOpps array as another property
  // Then add each revised object to finalRepArrayForDisplay
  const finalRepArrayForDisplay: augmentedRepObjectType[] = [];
  repsOnTeam.forEach((repObject: Representative) => {
    // Aggregate revenue for current rep by referencing salesOpps array & filtering for repId
    const currentRepOnlySalesOpps: SalesOpportunity[] = salesOpps.filter(
      (salesOpp: SalesOpportunity) => salesOpp.repId === repObject.id
    );

    // Aggregate revenue for each rep using reduce method
    const totalRevenue: number = currentRepOnlySalesOpps.reduce(
      (total: number, current: SalesOpportunity) => {
        return total + current.revenue;
      },
      0
    );
    // console.log(currentRepOnlySalesOpps, totalRevenue); // REMOVE below
    // let total = 0;
    // for (let i = 0; i < currentRepOnlySalesOpps.length; i++) {
    //   total += currentRepOnlySalesOpps[i].revenue;
    // }
    // console.log(total); // REMOVE above

    // Match teamID to team name (in case all teams are selected)
    const teamNameFromDB: string = teams.find(
      (team: Team) => repObject.teamId === team.id
    )!.name;

    const augmentedRepObject: augmentedRepObjectType = {
      ...repObject,
      teamName: teamNameFromDB,
      totalRevenue: totalRevenue,
    };
    finalRepArrayForDisplay.push(augmentedRepObject);
  }); // ** end forEach **

  return finalRepArrayForDisplay;
}

// --------

// This 'sub-helper' fxn is invoked in several different times in the below helper fxns that are called w/in the endpoint logic in server.ts
function FilterEntireDatabaseByCustomerName(
  customerName: string
): augmentedRepObjectType[] {
  // ONLY filter if an actual customer name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
  // NOTE:  There will be duplicate repIDs w/in the filtered array -- these need to be aggregated
  let salesOppsWithCustomerNameOnly: SalesOpportunity[] = salesOpps.slice();
  if (customerName !== "") {
    salesOppsWithCustomerNameOnly = salesOpps.filter(
      (salesOpp: SalesOpportunity) => salesOpp.customerName === customerName
    );
  }

  // Create list of repIds
  const repIDarray: number[] = reps.map((elem) => elem.id);
  //   console.log(repIDarray, repIDarray.length); // REMOVE

  // Iterate thru unique list of repIds (customerListArray) & for each individual rep, (1) calculate and save aggregate revenue (2) create an augmented object containing additional details like name, email, team name, etc.
  // Then add each revised object to finalRepArrayForDisplay
  const finalRepArrayForDisplay: augmentedRepObjectType[] = [];
  repIDarray.forEach((repID: number) => {
    // Aggregate revenue for current rep by referencing sales array & filtering for repId
    const currentRepOnlySalesOpps: SalesOpportunity[] =
      salesOppsWithCustomerNameOnly.filter(
        (salesOpp: SalesOpportunity) => salesOpp.repId === repID
      );

    // Aggregate revenue for each rep using reduce method
    const totalRevenue: number = currentRepOnlySalesOpps.reduce(
      (total: number, current: SalesOpportunity) => {
        return total + current.revenue;
      },
      0
    );
    // console.log(currentRepOnlySalesOpps, totalRevenue); // REMOVE

    // Access firstName, lastName, email from reps array
    const currentRepObj: Representative = reps.find(
      (rep: Representative) => rep.id === repID
    )!; // NOTE:  non-null assertion operator (!) required here
    // console.log(currentRepObj, " ...NEXT..."); // REMOVE
    // destructure object here using "in-line"
    const { firstName, lastName, email, teamId }: Representative =
      currentRepObj;

    // Use teamId from above to extract teamName from 'teams' array for each rep
    const teamName: string = teams.find(
      (team: Team) => team.id === teamId
    )!.name;

    const augmentedRepObject: augmentedRepObjectType = {
      id: repID,
      firstName: firstName,
      lastName: lastName,
      email: email,
      teamName: teamName,
      totalRevenue: totalRevenue,
      teamId: teamId,
    };
    finalRepArrayForDisplay.push(augmentedRepObject);
  }); // ** end forEach **

  return finalRepArrayForDisplay;
}

// ------------------------

function TeamNewlySelectedOrReplacedAndCustomerBlank(
  teamName: string
): nestedFilteredObjectsForClientType {
  const finalRepArrayForDisplay: augmentedRepObjectType[] =
    FilterEntireDatabaseByTeamName(teamName); // invoking 'sub-helper' fxn above

  // Bundling the 3 objects below to send back to client
  const teamCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();
  const customerCurrentSelectionResults: augmentedRepObjectType[] = [];
  const combinedCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();

  return {
    teamCurrentSelectionResults,
    customerCurrentSelectionResults,
    combinedCurrentSelectionResults,
  };
}

// --------

function CustomerNewlySelectedOrReplacedAndTeamBlank(
  customerName: string
): nestedFilteredObjectsForClientType {
  const finalRepArrayForDisplay: augmentedRepObjectType[] =
    FilterEntireDatabaseByCustomerName(customerName); // invoking 'sub-helper' fxn above

  // Bundling the 3 objects below to send back to client
  const teamCurrentSelectionResults: augmentedRepObjectType[] = [];
  const customerCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();
  const combinedCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();

  return {
    teamCurrentSelectionResults,
    customerCurrentSelectionResults,
    combinedCurrentSelectionResults,
  };
}

// --------

function TeamDisplayedThenCustomerSelected(
  customerName: string,
  teamCurrentSelectionResults: augmentedRepObjectType[]
): nestedFilteredObjectsForClientType {
  // Invoke 'sub-helper' fxn to generate results filtered by customer name from entirety of databases
  const finalRepArrayForStorage: augmentedRepObjectType[] =
    FilterEntireDatabaseByCustomerName(customerName); // invoking 'sub-helper' fxn above
  //   console.log(finalRepArrayForStorage); // REMOVE

  // Below logic uses the teamCurrentSelectionResults and filters out only the newly selected customer (assuming not blank / '' selected)
  // Iterate thru teamCurrentSelectionResults, for each unique rep re-calculate aggregate revenue figure so that it is ONLY for the newly selected customer
  const finalRepArrayForDisplay: augmentedRepObjectType[] = [];
  teamCurrentSelectionResults.forEach((repObject: augmentedRepObjectType) => {
    const repID: number = repObject.id;

    // ONLY filter if an actual customer name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
    let currentRepOnlySalesOpps: SalesOpportunity[] = salesOpps.slice();
    if (customerName !== "") {
      // Aggregate revenue for current rep by referencing salesOpps array & filtering for customerName
      currentRepOnlySalesOpps = salesOpps.filter(
        (salesOpp: SalesOpportunity) => salesOpp.repId === repID
      );
    }
    // console.log(currentRepOnlySalesOpps); // REMOVE

    const currentRepOnlySalesOppsForSelectCustomer: SalesOpportunity[] =
      currentRepOnlySalesOpps.filter(
        (salesOpp: SalesOpportunity) => salesOpp.customerName === customerName
      );
    // console.log(currentRepOnlySalesOppsForSelectCustomer); // REMOVE

    // Aggregate revenue for each rep using reduce method
    const totalRevenue: number =
      currentRepOnlySalesOppsForSelectCustomer.reduce(
        (total: number, current: SalesOpportunity) => {
          return total + current.revenue;
        },
        0
      );

    const augmentedRepObject: augmentedRepObjectType = {
      ...repObject,
      totalRevenue: totalRevenue,
    };
    finalRepArrayForDisplay.push(augmentedRepObject);
  }); // ** end forEach **

  // Bundling the 3 objects below to send back to client
  // const teamCurrentSelectionResults;  // UNCHANGED
  const customerCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForStorage.slice();
  const combinedCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();

  return {
    teamCurrentSelectionResults,
    customerCurrentSelectionResults,
    combinedCurrentSelectionResults,
  };
}

// --------

function CustomerDisplayedThenTeamSelected(
  teamName: string,
  customerCurrentSelectionResults: augmentedRepObjectType[]
): nestedFilteredObjectsForClientType {
  // Invoke 'sub-helper' fxn to generate results filtered by team name from entirety of databases
  const finalRepArrayForStorage: augmentedRepObjectType[] =
    FilterEntireDatabaseByTeamName(teamName); // invoking 'sub-helper' fxn above

  // ONLY filter if an actual team name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
  let finalRepArrayForDisplay: augmentedRepObjectType[] =
    customerCurrentSelectionResults.slice();
  if (teamName !== "") {
    // Below logic uses the customerCurrentSelectionResults and simply filters out only the newly selected team name if not blank / '' (no aggregate revenue re-calc is required, i.e. it will remain unchanged from prior calc)
    finalRepArrayForDisplay = customerCurrentSelectionResults.filter(
      (repObj: augmentedRepObjectType) => repObj.teamName === teamName
    );
  }

  // Bundling the 3 objects below to send back to client
  const teamCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForStorage.slice();
  // const customerCurrentSelectionResults;  // UNCHANGED
  const combinedCurrentSelectionResults: augmentedRepObjectType[] =
    finalRepArrayForDisplay.slice();

  return {
    teamCurrentSelectionResults,
    customerCurrentSelectionResults,
    combinedCurrentSelectionResults,
  };
}

// ----------------------

export {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  TeamNewlySelectedOrReplacedAndCustomerBlank,
  CustomerNewlySelectedOrReplacedAndTeamBlank,
  TeamDisplayedThenCustomerSelected,
  CustomerDisplayedThenTeamSelected,
};

// --------
