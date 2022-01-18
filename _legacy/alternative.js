// Single Page Scraping
const cheerio = require("cheerio");
const axios = require("axios");

// Multi Page Scraping
const puppeteer = require("puppeteer");

let getVenueFromSinglePage = async () => {
  let url = `https://theconcertdatabase.com/venues`;
  return axios.get(url).then(function ({ data }) {
    let $ = cheerio.load(data);

    const names = [];
    const addresses = [];
    const cities = [];
    const states = [];
    const countries = [];

    $("tr > .views-field-title > a").each((i, el) => {
      let name = $(el).text();
      names[i] = name !== "" ? name : null;
    });
    $("tr > .views-field-field-address").each((i, el) => {
      let address = el.children[0].data.trim();
      addresses[i] = address !== "" ? address : null;
    });
    $("tr > .views-field-field-city").each((i, el) => {
      let city = el.children[0].data.trim();
      cities[i] = city !== "" ? city : null;
    });
    $("tr > .views-field-field-state").each((i, el) => {
      let state = el.children[0].data.trim();
      states[i] = state !== "" ? state : null;
    });
    $("tr > .views-field-field-country").each((i, el) => {
      let country = el.children[0].data.trim();
      countries[i] = country !== "" ? country : null;
    });

    const result = [];
    for (let i = 0; i < names.length; i++) {
      result[i] = {
        name: names[i],
        address: addresses[i],
        city: cities[i],
        state: states[i],
        country: countries[i],
      };
    }

    console.log("SinglePageResults", result);
    return;
  });
};

let getVenuesFromMultiplePages = async () => {
  const url = `https://www.tripadvisor.com/Search?geo=55229&q=music%20venues&queryParsed=true&searchSessionId=337B5387AB1A8733820CD382311CEB4D1642385509905ssid&sid=86F441D25385489291953DD3D4B1512F1642385513665&blockRedirect=true&rf=1`;
  let nameSelector = `.result-title > span`;
  let addressSelector = `div.address > .address-text`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(url, { waitUntil: "networkidle2" });
  await navigationPromise;

  const names = await page.$$eval(nameSelector, (list) =>
    list.map((el) => el.innerText)
  );
  const addresses = await page.$$eval(addressSelector, (list) =>
    list.map((el) => el.innerText)
  );

  const results = [];
  for (let i = 0; i < names.length; i++) {
    results[i] = {
      name: names[i],
      address: addresses[i],
    };
  }

  // Addresses must start with a number
  function validateAddress(item) {
    if (item.address.match(/^\d/)) return true;
  }

  const res = results.filter(validateAddress);
  console.log("RESPONSE", res);

  await browser.close();
};

// getVenueFromSinglePage();
getVenuesFromMultiplePages();
