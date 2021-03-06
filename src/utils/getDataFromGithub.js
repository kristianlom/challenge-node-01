const puppeteer = require('puppeteer');
const console = require('Console');
const fs = require('fs');
const getTime = require('./getTime');
const postToSlack = require('./postToSlack');

const getDataFromGithub = async (githubUser) => {

  console.log('Launch Puppeteer');
  const githubUrl = 'https://github.com/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (!fs.existsSync('src/images')) {
    fs.mkdirSync('src/images');
  }

  await page.goto(`${githubUrl}${githubUser}`);
  await page.screenshot({ path: `src/images/${getTime()}-${githubUser}.png` });

  const githubCounter = await page.evaluate(() => document.getElementsByClassName('Counter')[0].innerText);
  const githubUserPhoto = await page.evaluate(() => document.getElementsByClassName('avatar-before-user-status')[0].src);

  postToSlack(githubUser, githubUserPhoto, githubCounter);

  await browser.close();
};

module.exports = getDataFromGithub;
