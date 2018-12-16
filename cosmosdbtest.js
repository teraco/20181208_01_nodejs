require('dotenv').config();

const puppeteer = require('puppeteer');
const USER_ID = process.env.MY_USER_ID;
const PASSWORD = process.env.MY_PASSWORD;
const SENDGRID_API_KEY = process.env.MY_APIKEY;
const EMAIL = process.env.MY_EMAIL;

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(SENDGRID_API_KEY);

// メインロジック

(async () => {
  // Puppeteerの起動
  const browser = await puppeteer.launch({
    headless: true, //HeadLessモードでの起動有無
    slowMo: 50, // 指定のミリ秒スローモーションで実行する
  });

  // 新しい空のページを開く
  const page = await browser.newPage();

  // view portの設定
  await page.setViewport({
    width: 1200,
    height: 800,
  })

  // 開く先のWebサイトへ遷移
  await page.goto('https://www.iijmio.jp/service/setup/hdd/couponstatus/')

  // 特定のid属性を待機
  await page.waitForSelector('.content_href > .colm2 > .login_member > form > .input_Gry.fzL.mgbM');

  // // ID入力
  await page.type('input[name=j_username]', USER_ID)

  // Password入力
  await page.type('input[name=j_password]', PASSWORD)

  // submit
  await page.waitForSelector('.colm2 > .login_member > form > .send_Btn > #x-submit')
  await page.click('.colm2 > .login_member > form > .send_Btn > #x-submit')

  // 要素取得
  await page.waitForSelector('.data2')
  const datavolume = await page.evaluate((selector) => {
    return document.querySelector(selector).innerText;
  }, '.data2')

  console.log(datavolume);
  
  // ブラウザの終了.
  await browser.close();

})(); // 最後の()は定義した関数の即時実行

/*
const msg = {
  to: EMAIL,
  from: EMAIL,
  subject: 'Sending with SendGrid is Fun(APIKEY)',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
*/
