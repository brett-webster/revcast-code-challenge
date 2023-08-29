import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

// ---------

// Helper fxn:  Invoked above 2 different times in landingPage.tsx assemble array of JSX.Elements for display
function assembleBundledRowsForDisplayHelperFxn(
  rowResultsFromDB: augmentedRepObjectType[]
): JSX.Element[] {
  // Bundle up latest result and reset state -- each 'rep row' contains 4 columns:  Name, Eamil, Team, Total Revenue
  const bundledRowsToDisplay: JSX.Element[] = rowResultsFromDB.map(
    (elementObject: augmentedRepObjectType) => {
      const keyID: number = elementObject.id;
      // const name: string =
      //   elementObject.lastName + ", " + elementObject.firstName;
      const firstName: string = elementObject.firstName; // ADDED
      const lastName: string = elementObject.lastName; // ADDED
      const email: string = elementObject.email;
      const team: string = elementObject.teamName;
      const totalRevenue: string = `$${Math.round(
        Number(elementObject.totalRevenue) / 1000
      ).toLocaleString("en-US")}k`;
      const spanSpacing1: JSX.Element = (
        <span key={`span1${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      );
      const spanSpacing2: JSX.Element = (
        <span key={`span2${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
      );
      const spanSpacing3: JSX.Element = (
        <span key={`span3${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
      );
      const spanSpacing4: JSX.Element = // ADDED
        (
          <span key={`span4${keyID}`}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
          </span>
        );
      return (
        <li key={keyID}>
          {[
            firstName,
            spanSpacing1,
            lastName,
            spanSpacing2,
            email,
            spanSpacing3,
            team,
            spanSpacing4,
            totalRevenue,
          ]}
        </li>
      );
    }
  );
  return bundledRowsToDisplay;
}

// ---------

export default assembleBundledRowsForDisplayHelperFxn;
