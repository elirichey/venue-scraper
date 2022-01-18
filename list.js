import puppeteer from "puppeteer";

const list = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(url, { waitUntil: "networkidle2" });
  await navigationPromise;

  const urlSelector = `tr > .views-field-title > a`;

  /*/
   * Need to make verify each selector exist before setting values
  /*/

  let urls = null;
  let hasName = (await page.$(urlSelector)) !== null;
  if (hasName) {
    urls = await page.$$eval(urlSelector, (url) =>
      url.map((item) => {
        const baseUrl = `https://theconcertdatabase.com`;
        const resUrl = `${baseUrl}${item.getAttribute("href")}`;
        return resUrl;
      })
    );
  }

  await browser.close();

  let res = urls;
  return res;
};

export default list;
