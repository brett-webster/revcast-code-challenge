// npm START -------> "start": "NODE_ENV=development react-scripts start & NODE_ENV=development nodemon src/server.ts",
// npm run BUILD ---> "build": "react-scripts build",
// npm run DEPLOY --> "deploy": "NODE_ENV=production ts-node src/server.ts",
// "proxy": "http://localhost:4000"

// --------

import express, { Request, Response, NextFunction, Application } from "express";
import path from "path";
import * as dotenv from "dotenv";
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

// Filter for ONLY team:  assemble object in the below format to return to client
// Format:  {firstName, lastName, email, teamName, totalRevenue, teamId, id}
app.post(
  "/api/bothDropdownsBlankThenTeamSelected",
  (req: Request, res: Response, next: NextFunction): Response => {
    // console.log(req.body); // REMOVE
    const teamName: string = req.body.selectedTeam;
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
    const customerName: string = req.body.selectedCustomer;
    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerNewlySelectedOrReplacedAndTeamBlank(customerName);
    // console.log(threeFilteredObjectsForClient); // REMOVE

    return res.status(200).json(threeFilteredObjectsForClient);
  }
);

// --------

// Filter for ONLY team after previously selected team is replaced by another selection (could be blank / ''):  assemble object in the below format to return to client
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

// Filter for ONLY customer after previously selected customer is replaced by another selection (could be blank / ''):  assemble object in the below format to return to client
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
    const { selectedTeam }: { selectedTeam: string } = req.body; // destructuring
    const {
      customerCurrentSelectionResults,
    }: { customerCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerDisplayedThenTeamSelected(
        selectedTeam,
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
    const { selectedCustomer }: { selectedCustomer: string } = req.body; // destructuring
    const {
      teamCurrentSelectionResults,
    }: { teamCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamDisplayedThenCustomerSelected(
        selectedCustomer,
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
    const { selectedTeam }: { selectedTeam: string } = req.body; // destructuring
    const {
      customerCurrentSelectionResults,
    }: { customerCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      CustomerDisplayedThenTeamSelected(
        selectedTeam,
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
    const { selectedCustomer }: { selectedCustomer: string } = req.body; // destructuring
    const {
      teamCurrentSelectionResults,
    }: { teamCurrentSelectionResults: augmentedRepObjectType[] } = req.body;

    const threeFilteredObjectsForClient: nestedFilteredObjectsForClientType =
      TeamDisplayedThenCustomerSelected(
        selectedCustomer,
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

// Create-react-app server:  front-end html + React bundle --> port 3000 in dev mode, utilizing 4000 in prod mode
// Express dev server:  provides API data & business logic --> port 4000 in both dev mode & in prod mode
// Prod mode:  Everything served off of single port 4000 once built/deployed
app.listen(4000);

// --------

export type { augmentedRepObjectType, nestedFilteredObjectsForClientType };
