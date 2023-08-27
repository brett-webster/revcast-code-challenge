// tsc src/server.ts ---> node server.js [whichever file server.js is emitted to...]
// "start": "react-scripts start & nodemon src/server.ts",
// "build": "react-scripts build & ts-node src/server.ts",
// "proxy": "http://localhost:3001"

// --------

import express, { Request, Response, NextFunction, Application } from "express";
import type { Representative, Team, SalesOpportunity } from "./data";

// Importing helper fxns containing filtering logic
import {
  GetUniqueSortedTeamList,
  GetUniqueSortedCustomerList,
  GetEntireUniqueSortedArrayOfObjs,
  TeamNewlySelectedOrReplacedAndCustomerBlank,
  CustomerNewlySelectedOrReplacedAndTeamBlank,
  TeamDisplayedThenCustomerSelected,
  CustomerDisplayedThenTeamSelected,
} from "./filteringLogicHelperFxns";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------

// Extend properties of user-defined Representative type (imported above) for object that will be returned back to client for display
interface augmentedRepObjectType extends Representative {
  teamName: string;
  totalRevenue: number;
}

type nestedFilteredObjectsForClientType = {
  teamCurrentSelectionResults: augmentedRepObjectType[];
  customerCurrentSelectionResults: augmentedRepObjectType[];
  combinedCurrentSelectionResults: augmentedRepObjectType[];
};

// --------

// Assemble sorted list of teams for presentation in dropdown menu (no dups here)
app.get(
  "/api/getUniqueSortedTeamList",
  (req: Request, res: Response, next: NextFunction): Response => {
    const teamListArray = GetUniqueSortedTeamList(); // Helper fxn

    return res.status(200).json(teamListArray);
  }
);

// Assemble sorted list of customers for presentation in dropdown menu (removing dups)
app.get(
  "/api/getUniqueSortedCustomerList",
  (req: Request, res: Response, next: NextFunction): Response => {
    const customerListArray = GetUniqueSortedCustomerList(); // Helper fxn

    return res.status(200).json(customerListArray);
  }
);

// Assemble sorted list of ALL reps for presentation in dropdown menu
app.get(
  "/api/getEntireUniqueSortedArrayOfObjs",
  (req: Request, res: Response, next: NextFunction): Response => {
    const fullResultsOfDB = GetEntireUniqueSortedArrayOfObjs(); // Helper fxn

    return res.status(200).json(fullResultsOfDB);
  }
);

// --------

// Filter for ONLY team:  assemble object in the below format to return to client
// Format:  {firstName, lastName, email, teamName, totalRevenue, teamId, id}
app.post(
  "/api/bothDropdownsBlankThenTeamSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const teamName: string = req.body.teamName;
    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamNewlySelectedOrReplacedAndCustomerBlank(teamName);

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Filter for ONLY customer:  assemble object in the below format to return to client
app.post(
  "/api/bothDropdownsBlankThenCustomerSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const customerName: string = req.body.customerName;
    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerNewlySelectedOrReplacedAndTeamBlank(customerName);

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Filter for ONLY team after previously selected team is replaced by another selection (could be blank / 'ALL'):  assemble object in the below format to return to client
// NOTE:  Below logic is identical to "/api/bothDropdownsBlankThenTeamSelected" endpoint
app.post(
  "/api/onlyTeamDisplayedThenDifferentTeamSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const teamName: string = req.body.teamName;
    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamNewlySelectedOrReplacedAndCustomerBlank(teamName);

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Filter for ONLY customer after previously selected customer is replaced by another selection (could be blank / 'ALL'):  assemble object in the below format to return to client
// NOTE:  Below logic is identical to "/api/bothDropdownsBlankThenCustomerSelected" endpoint
app.post(
  "/api/onlyCustomerDisplayedThenDifferentCustomerSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const customerName: string = req.body.customerName;
    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerNewlySelectedOrReplacedAndTeamBlank(customerName);

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Case where customer is currently selected and team selection is NEWLY added
// Passing in:  (1) newly selected team name & (2) pre-filtered customer array of object results from front-end (persisted from previous filter -- persisting this data previously calculated upfront saves unneeded computation)
// 2 steps:  (1) Filter for team results on a stand-alone basis and save for future and (2) using passed in customer array of object results, filter for team an assign copy of results to combinedCurrentSelectionResults object, returning all to client
app.post(
  "/api/onlyCustomerDisplayedThenTeamSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const { teamName }: { teamName: string } = req.body; // destructuring
    const {
      customerCurrentSelectionResults,
    }: { customerCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerDisplayedThenTeamSelected(
        teamName,
        customerCurrentSelectionResults
      );

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Case where team is currently selected and company selection is NEWLY added
// Passing in:  (1) newly selected company name & (2) pre-filtered team array of object results from front-end (persisted from previous filter -- persisting this data previously calculated upfront saves unneeded computation)
// 2 steps:  (1) Filter for company results on a stand-alone basis and save for future and (2) using passed in team array of object results, filter for company an assign copy of results to combinedCurrentSelectionResults object, returning all to client
app.post(
  "/api/onlyTeamDisplayedThenCustomerSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const { customerName }: { customerName: string } = req.body; // destructuring
    const {
      teamCurrentSelectionResults,
    }: { teamCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamDisplayedThenCustomerSelected(
        customerName,
        teamCurrentSelectionResults
      );

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Case where BOTH customer AND team are selected & user selects different non-blank team
// NOTE:  Below logic is identical to "/api/onlyCustomerDisplayedThenTeamSelected" endpoint
app.post(
  "/api/bothTeamAndCustomerSelectedThenDifferentTeamSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const { teamName }: { teamName: string } = req.body; // destructuring
    const {
      customerCurrentSelectionResults,
    }: { customerCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerDisplayedThenTeamSelected(
        teamName,
        customerCurrentSelectionResults
      );

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Case where BOTH customer AND team are selected & user selects different non-blank customer
// NOTE:  Below logic is identical to "/api/onlyTeamDisplayedThenCustomerSelected" endpoint
app.post(
  "/api/bothTeamAndCustomerSelectedThenDifferentCustomerSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const { customerName }: { customerName: string } = req.body; // destructuring
    const {
      teamCurrentSelectionResults,
    }: { teamCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamDisplayedThenCustomerSelected(
        customerName,
        teamCurrentSelectionResults
      );

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

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

// Express dev server:  provides API data & business logic --> port 3001 in dev mode
// Prod mode:  Everything served off of single port 3000 in prod mode
app.listen(3001);

// --------

export type { augmentedRepObjectType, nestedFilteredObjectsForClientType };
