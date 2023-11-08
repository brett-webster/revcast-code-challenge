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
  TeamSelectedCustomerBlank,
  CustomerSelectedTeamBlank,
  BothSelected,
} from "./filteringLogicHelperFxns";

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

    // Note: Case where selectedTeam & selectedCustomer both = "" is taken into account on client-side
    if (selectedTeam !== "" && selectedCustomer === "")
      filteredResultsOfDB = TeamSelectedCustomerBlank(selectedTeam);

    if (selectedTeam === "" && selectedCustomer !== "")
      filteredResultsOfDB = CustomerSelectedTeamBlank(selectedCustomer);

    if (selectedTeam !== "" && selectedCustomer !== "")
      filteredResultsOfDB = BothSelected(selectedTeam, selectedCustomer);

    return res.status(200).json(filteredResultsOfDB);
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
