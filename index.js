import list from "./list.js";
import venue from "./venue.js";

let venues = [];

let run = async () => {
  const link = `https://theconcertdatabase.com/venues`;

  // Go through page...
  let pg1 = await list(link);

  // Until no more pages exist...
  let allVenues = pg1.map(async (item) => {
    let ven = await venue(item);
    if (ven) venues.push(ven);
  });
  await Promise.all(allVenues);

  let res = venues;
  console.log("RES", res);
};
run();
