// npm START -------> "start": "NODE_ENV=development react-scripts start & NODE_ENV=development nodemon src/server.ts",
// npm run BUILD ---> "build": "react-scripts build",
// npm run DEPLOY --> "deploy": "NODE_ENV=production ts-node src/server.ts",
// "proxy": "http://localhost:4000"

// --------

import express, { Request, Response, NextFunction, Application } from "express";
import path from "path";
import * as dotenv from "dotenv";
import type { Representative } from "./data";

// Importing helper fxns containing filtering logic
import {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  // FilterEntireDatabaseByTeamName,
  // FilterEntireDatabaseByCustomerName,
  TeamSelectedCustomerBlank,
  CustomerSelectedTeamBlank,
  BothSelected,
  // TeamSelectedCustomerBlank,
  // CustomerSelectedTeamBlank,
  // TeamDisplayedThenCustomerSelected,
  // CustomerDisplayedThenTeamSelected,
} from "./filteringLogicHelperFxns";

// Importing helper fxn containing re-sorting logic
// import { SortByColumnHeaderAscOrDesc } from "./sortingLogicHelperFxn";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------

// Extend properties of user-defined Representative type (imported above) for object that will be returned back to client for display
export interface augmentedRepObjectType extends Representative {
  teamName: string;
  totalRevenue: number;
}

export type nestedFilteredObjectsForClientType = {
  teamCurrentSelectionResults: augmentedRepObjectType[];
  customerCurrentSelectionResults: augmentedRepObjectType[];
  combinedCurrentSelectionResults: augmentedRepObjectType[];
};

// export type sortedStateType = {
//   columnHeadToSort: string;
//   order: string;
// };

// --------

dotenv.config();

// For production mode ONLY ('npm run build' first in CLI...) -- ENSURE 2 below path.joins are correct for file directory hierarchy
if (process.env.NODE_ENV === "production") {
  // console.log(process.env); // REMOVE, TESTING FOR ENTERING CONDITIONAL
  console.log(
    "DEPLOYED, RUNNING IN PRODUCTION MODE ON port 4000 at 'http://localhost:4000/' ..."
  );
  // console.log(path.join(__dirname, "../build")); // REMOVE
  // console.log(path.join(__dirname, "../build/index.html")); // REMOVE

  // statically serve everything in the build folder on the route '/build', if already built -- this includes a pre-built index.html
  app.use(express.static(path.join(__dirname, "../build")));
  // serve index.html on the route '/'
  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../build/index.html"));
  });
}

// --------

// Assemble sorted list of teams for presentation in dropdown menu (no dups here)
app.get(
  "/api/getUniqueSortedTeamList",
  (req: Request, res: Response, next: NextFunction): Response => {
    const teamListArray: string[] = GetUniqueSortedTeamList(); // Helper fxn

    return res.status(200).json(teamListArray);
  }
);

// Assemble sorted list of customers for presentation in dropdown menu (removing dups)
app.get(
  "/api/getUniqueSortedCustomerList",
  (req: Request, res: Response, next: NextFunction): Response => {
    const customerListArray: string[] = GetUniqueSortedCustomerList(); // Helper fxn

    return res.status(200).json(customerListArray);
  }
);

// Assemble sorted list of ALL reps for presentation in dropdown menu
app.get(
  "/api/getEntireUniqueSortedArrayOfObjs",
  (req: Request, res: Response, next: NextFunction): Response => {
    const fullResultsOfDB: augmentedRepObjectType[] =
      GetEntireUniqueSortedArrayOfObjs(); // Helper fxn

    return res.status(200).json(fullResultsOfDB);
  }
);

// --------

// Assemble sorted list of teams for presentation in dropdown menu (no dups here)
app.post(
  "/api/getTeamAndCustomerSelectionsFiltered",
  (req: Request, res: Response, next: NextFunction): Response => {
    const { selectedTeam, selectedCustomer, fullRowResultsOfDBinCache } =
      req.body; // destructuring

    let filteredResultsOfDB: augmentedRepObjectType[] = [];
    if (selectedTeam === "" && selectedCustomer === "")
      filteredResultsOfDB = fullRowResultsOfDBinCache;
    // setting = to cached state here, no endpoint accessed
    else {
      if (selectedTeam !== "" && selectedCustomer === "")
        filteredResultsOfDB = TeamSelectedCustomerBlank(selectedTeam);

      if (selectedTeam === "" && selectedCustomer !== "")
        filteredResultsOfDB = CustomerSelectedTeamBlank(selectedCustomer);

      if (selectedTeam !== "" && selectedCustomer !== "")
        filteredResultsOfDB = BothSelected(selectedTeam, selectedCustomer);
    }

    return res.status(200).json(filteredResultsOfDB);
  }
);

// // NO team or customer filter applied (i.e. full DB is returned) but sorting is required on any basis OTHER than by id, ascending
// // Format:  {firstName, lastName, email, teamName, totalRevenue, teamId, id}
// app.post(
//   "/api/allSelectedButNeedsReSorted",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const sortedState: sortedStateType = req.body.sortedState;

//     const fullResultsOfDB: augmentedRepObjectType[] =
//       GetEntireUniqueSortedArrayOfObjs(); // Helper fxn

//     const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType = {
//       teamCurrentSelectionResults: [],
//       customerCurrentSelectionResults: [],
//       combinedCurrentSelectionResults: fullResultsOfDB,
//     };

//     const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsForClient);

//     return res.status(200).json(reSortedThreeFilteredObjectsForClient);
//   }
// );

// // --------

// // Filter for ONLY team (swapping out current team selection or from blank):  assemble object in the below format to return to client
// app.post(
//   "/api/onlyTeamSelected",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const teamName: string = req.body.selectedTeam;
//     const sortedState: sortedStateType = req.body.sortedState;

//     const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       TeamSelectedCustomerBlank(teamName);

//     const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsForClient);

//     return res.status(200).json(reSortedThreeFilteredObjectsForClient);
//   }
// );

// // --------

// // Filter for ONLY customer (swapping out current customer selection or from blank):  assemble object in the below format to return to client
// app.post(
//   "/api/onlyCustomerSelected",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const customerName: string = req.body.selectedCustomer;
//     const sortedState: sortedStateType = req.body.sortedState;

//     const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       CustomerSelectedTeamBlank(customerName);

//     const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsForClient);

//     return res.status(200).json(reSortedThreeFilteredObjectsForClient);
//   }
// );

// // --------

// // Case #1:  Customer is currently selected and team selection is NEWLY added from blank
// // Case #2:  BOTH customer AND team are currently selected & user selects a different, non-blank team
// // Passing in:  (1) newly selected team name & (2) pre-filtered customer array of object results from front-end (persisted from previous filter -- persisting this data previously calculated upfront saves unneeded computation)
// // 2 steps:  (1) Filter for team results on a stand-alone basis and save for future and (2) using passed in customer array of object results, filter for team and assign copy of results to combinedCurrentSelectionResults object, returning all to client
// app.post(
//   "/api/bothSelectedTeamJustChanged",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const { selectedTeam }: { selectedTeam: string } = req.body; // destructuring
//     const {
//       customerCurrentSelectionResults,
//     }: { customerCurrentSelectionResults: augmentedRepObjectType[] } = req.body;
//     const sortedState: sortedStateType = req.body.sortedState;

//     const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       CustomerDisplayedThenTeamSelected(
//         selectedTeam,
//         customerCurrentSelectionResults
//       );

//     const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsForClient);

//     return res.status(200).json(reSortedThreeFilteredObjectsForClient);
//   }
// );

// // --------

// // Case #1:  Team is currently selected and company selection is NEWLY added from blank
// // Case #2:  BOTH customer AND team are currently selected & user selects a different, non-blank customer
// // Passing in:  (1) newly selected company name & (2) pre-filtered team array of object results from front-end (persisted from previous filter -- persisting this data previously calculated upfront saves unneeded computation)
// // 2 steps:  (1) Filter for company results on a stand-alone basis and save for future and (2) using passed in team array of object results, filter for company and assign copy of results to combinedCurrentSelectionResults object, returning all to client
// app.post(
//   "/api/bothSelectedCustomerJustChanged",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const { selectedCustomer }: { selectedCustomer: string } = req.body; // destructuring
//     const {
//       teamCurrentSelectionResults,
//     }: { teamCurrentSelectionResults: augmentedRepObjectType[] } = req.body;
//     const sortedState: sortedStateType = req.body.sortedState;

//     const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       TeamDisplayedThenCustomerSelected(
//         selectedCustomer,
//         teamCurrentSelectionResults
//       );

//     const reSortedThreeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsForClient);

//     return res.status(200).json(reSortedThreeFilteredObjectsForClient);
//   }
// );

// // --------

// // ONLY endpoint relating to re-sorting by column head (ascending/descending)
// app.post(
//   "/api/reSortTable",
//   (req: Request, res: Response, next: NextFunction): Response => {
//     const { sortedState }: { sortedState: sortedStateType } = req.body; // destructuring
//     const {
//       threeFilteredObjectsCache,
//     }: { threeFilteredObjectsCache: nestedFilteredObjectsForClientType } =
//       req.body; // destructuring

//     const reSortedThreeFilteredObjectsCache: nestedFilteredObjectsForClientType =
//       SortByColumnHeaderAscOrDesc(sortedState, threeFilteredObjectsCache);

//     return res.status(200).json(threeFilteredObjectsCache);
//   }
// );

// --------

//404 handler
app.use(
  (req: Request, res: Response): Response =>
    res.status(404).json("Page Not Found")
);

// User-defined typing
type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

//Global error handler
app.use(
  (
    err: ServerError,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    console.log(err);
    const defaultErr: ServerError = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };
    const errorObj: ServerError = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

// --------

// Create-react-app server:  front-end html + React bundle --> port 3000 in dev mode, utilizing 4000 in prod mode
// Express dev server:  provides API data & business logic --> port 4000 in both dev mode & in prod mode
// Prod mode:  Everything served off of single port 4000 once built/deployed
app.listen(4000);

// --------
