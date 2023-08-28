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
      const name: string =
        elementObject.lastName + ", " + elementObject.firstName;
      const email: string = elementObject.email;
      const team: string = elementObject.teamName;
      const totalRevenue: string = `$${Math.round(
        Number(elementObject.totalRevenue) / 1000
      ).toLocaleString("en-US")}k`;
      const spanSpacing1: JSX.Element = (
        <span key={`span1${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      );
      const spanSpacing2: JSX.Element = (
        <span key={`span2${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      );
      const spanSpacing3: JSX.Element = (
        <span key={`span3${keyID}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      );
      return (
        <li key={keyID}>
          {[
            name,
            spanSpacing1,
            email,
            spanSpacing2,
            team,
            spanSpacing3,
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
