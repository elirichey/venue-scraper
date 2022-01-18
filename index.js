import list from "./list.js";
import venue from "./venue.js";

let venues = [];

let run = async () => {
  const link = `https://theconcertdatabase.com/venues`;
  const singleVenueLink = `https://theconcertdatabase.com/venues/1st-mariner-arena`;

  // Recursive...
  // Go through page...
  let pg1 = await list(link);
  venues.push(pg1);

  // Until no more pages exist...
  let singleVenue = await venue(singleVenueLink);

  // Final
  let res = {
    venues,
    singleVenue,
  };
  console.log("RES", res);
};
run();
