require('dotenv').config();
const puppeteer = require('puppeteer');

const bot = async (req, res) => {
    const toSearch = req.body.message; 
    let emails = [];
    let regex = /[A-Za-z0-9.]+@[A-Za-z0-9]+\.com/g;
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
          ],
          executablePath:
            process.env.NODE_ENV === "production"
              ? process.env.PUPPETEER_EXECUTABLE_PATH
              : puppeteer.executablePath(),
    });

    try {
        //Open browser and search the toSearch
        const page = await browser.newPage();
        await page.goto("https://www.google.com/");
        await page.waitForSelector(".gLFyf");
        await page.type(".gLFyf", toSearch , {delay: 10});
        await page.keyboard.press("Enter", {delay : 10});
        await page.waitForSelector("#result-stats");
        await new Promise((resolve)=> setTimeout(resolve,5000));

        // Open n pages
        for(let i=0; i< 100; i++){
            try{
                await autoscroll(page);
            }
            catch(err){
                console.log("Finish");
                break;
            } 
        }

        // Collect each html element that can contain email
        const elements = await page.$$('div.MjjYud');
        for(let element of elements){
            let source = await page.evaluate(el => el.querySelector("div").textContent, element);
            const matches = source.match(regex);
            if(matches!==null) emails.push(...matches);
        };
 
        // clean emails and send them to the frontend
        emails = [...(new Set(emails))];
        emails = emails.map(email => email.toLowerCase());
        res.status(200).json(emails);
    } catch (error) {
        console.log(error);
        res.status(500).json('Something want wrong please try again');
    }
    finally{
        await browser.close();
    }
}


module.exports = bot;

//////////:::::::::::::: Functions :::::::::://////////////

async function autoscroll(page){
    while(~page.waitForSelector(".RVQdVd")){
      try {
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await new Promise((resolve)=> setTimeout(resolve,2000));
        if(page.waitForSelector(".RVQdVd")){
          await new Promise((resolve)=> setTimeout(resolve,500));
          await page.click(".RVQdVd")
          break;
        } 
      } catch (error) {
        throw new Error();
      }
    }
}