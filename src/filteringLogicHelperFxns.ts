import { reps } from "./data/repDb";
import { salesOpps } from "./data/salesOppDb";
import { teams } from "./data/teamsDb";

import type { Representative, Team, SalesOpportunity } from "./data";
import type { augmentedRepObjectType } from "./server";

// --------

// DATA OVERVIEW
// 12 teams (12 unique teams)
// 1000 salesOps (7 unique companies, many dups)
// 80 reps (80 unique reps / 40 reps are active in salesOpps, IDs 1-40)

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
  const customerListArray: string[] = [...customerListSet].sort();

  return customerListArray;
}

// --------

function GetEntireUniqueSortedArrayOfObjs(): augmentedRepObjectType[] {
  const fullResultsOfDB: augmentedRepObjectType[] =
    FilterEntireDatabaseByTeamName("");

  return fullResultsOfDB;
}

// --------

// This 'sub-helper' fxn is invoked in several different times in the below helper fxns that are called w/in the endpoint logic in server.ts
function FilterEntireDatabaseByTeamName(
  teamName: string
): augmentedRepObjectType[] {
  const teamID: number | undefined = teams.find(
    (team: Team) => team.name === teamName
  )?.id;

  // ONLY filter if an actual team name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
  let repsOnTeam: Representative[] = reps.slice();
  if (teamName !== "") {
    repsOnTeam = reps.filter((rep: Representative) => rep.teamId === teamID);
  }

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

    // Access firstName, lastName, email from reps array
    const currentRepObj: Representative = reps.find(
      (rep: Representative) => rep.id === repID
    )!; // NOTE:  non-null assertion operator (!) required here

    // destructure object here using "in-line"
    const { firstName, lastName, email, teamId }: Representative =
      currentRepObj;

    // Use teamId from above to extract teamName from 'teams' array for each rep
    const teamName: string = teams.find(
      (team: Team) => team.id === teamId
    )!.name; // NOTE:  non-null assertion operator (!) required here

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

function TeamSelectedCustomerBlank(teamName: string): augmentedRepObjectType[] {
  const finalRepArrayForDisplay: augmentedRepObjectType[] =
    FilterEntireDatabaseByTeamName(teamName); // invoking 'sub-helper' fxn above

  return finalRepArrayForDisplay;
}

// --------

function CustomerSelectedTeamBlank(
  customerName: string
): augmentedRepObjectType[] {
  const finalRepArrayForDisplay: augmentedRepObjectType[] =
    FilterEntireDatabaseByCustomerName(customerName); // invoking 'sub-helper' fxn above

  return finalRepArrayForDisplay;
}

// --------

function BothSelected(
  teamName: string,
  customerName: string
): augmentedRepObjectType[] {
  // Invoke 'sub-helper' fxn to first generate results filtered by customer name from entirety of databases
  const customerCurrentSelectionResults: augmentedRepObjectType[] =
    CustomerSelectedTeamBlank(customerName);

  // ONLY filter if an actual team name has been selected, defaulting to entire database if not (i.e. if reset to blank or '')
  let finalRepArrayForDisplay: augmentedRepObjectType[] =
    customerCurrentSelectionResults.slice();
  if (teamName !== "") {
    // Below logic uses the customerCurrentSelectionResults and simply filters out only the newly selected team name if not blank / '' (no aggregate revenue re-calc is required, i.e. it will remain unchanged from prior calc)
    finalRepArrayForDisplay = customerCurrentSelectionResults.filter(
      (repObj: augmentedRepObjectType) => repObj.teamName === teamName
    );
  }

  return finalRepArrayForDisplay;
}

// --------

export {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  TeamSelectedCustomerBlank,
  CustomerSelectedTeamBlank,
  BothSelected,
};

// --------
