const puppeteer = require("puppeteer");
// const link = `https://theconcertdatabase.com/venues/vogue`;
const link = `https://theconcertdatabase.com/venues/1st-mariner-arena`;

let getVenue = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(url, { waitUntil: "networkidle2" });
  await navigationPromise;

  const titleSelector = `h1.title`;
  const addressSelector = `div.field-name-field-address > div.field-items > div.field-item`;
  const citySelector = `div.field-name-field-city > div.field-items > div.field-item`;
  const stateSelector = `div.field-name-field-state > div.field-items > div.field-item`;
  const countrySelector = `div.field-name-field-country > div.field-items > div.field-item`;

  /*/
   * Need to make verify each selector exist before setting values
  /*/

  let name = null;
  let hasName = (await page.$(titleSelector)) !== null;
  if (hasName) {
    name = await page.$$eval(titleSelector, (name) => name[0].innerText.trim());
  }

  let address = null;
  let hasAddress = (await page.$(addressSelector)) !== null;
  if (hasAddress) {
    address = await page.$$eval(addressSelector, (address) =>
      address ? address[0].innerText.trim() : null
    );
  }

  let city = null;
  let hasCity = (await page.$(citySelector)) !== null;
  if (hasCity) {
    city = await page.$$eval(citySelector, (city) =>
      city ? city[0].innerText.trim() : null
    );
  }

  let state = null;
  let hasState = (await page.$(stateSelector)) !== null;
  if (hasState) {
    state = await page.$$eval(stateSelector, (state) =>
      state ? state[0].innerText.trim() : null
    );
  }

  let country = null;
  let hasCountry = (await page.$(countrySelector)) !== null;
  if (hasCountry) {
    country = await page.$$eval(countrySelector, (country) =>
      country ? country[0].innerText.trim() : null
    );
  }

  await browser.close();

  let res;
  if (address !== null) {
    res = { name, address, city, state, country };
  } else res = false;

  console.log("RES", res);
  return res;
};

getVenue(link);
