require('dotenv').config();

const puppeteer = require('puppeteer');
const USER_ID = process.env.MY_USER_ID;
const PASSWORD = process.env.MY_PASSWORD;
const SENDGRID_API_KEY = process.env.MY_APIKEY;
const EMAIL = process.env.MY_EMAIL;

const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');
const url = require('url');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;

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


// Create the database if it does not exist
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  console.log(`Created database:\n${database.id}\n`);
}

// Read the database definition
async function readDatabase() {
  const { body: databaseDefinition } = await client.database(databaseId).read();
  console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

// Create the container if it does not exist
async function createContainer() {
  const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
  console.log(`Created container:\n${config.container.id}\n`);
}

// Read the container definition
async function readContainer() {
  const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

// Create family item if it does not exist
async function createFamilyItem(itemBody) {
    try {
        // read the item to see if it exists
        const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).read();
        console.log(`Item with family id ${itemBody.id} already exists\n`);
    }
    catch (error) {
       // create the family item if it does not exist
       if (error.code === HttpStatusCodes.NOTFOUND) {
           const { item } = await client.database(databaseId).container(containerId).items.create(itemBody);
           console.log(`Created family item with id:\n${itemBody.id}\n`);
       } else {
           throw error;
       }
    }
  };

// Query the container using SQL
async function queryContainer() {
    console.log(`Querying container:\n${config.container.id}`);
  
    // query to return all children in a family
    const querySpec = {
       query: "SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName",
       parameters: [
           {
               name: "@lastName",
               value: "Andersen"
           }
       ]
   };
  
   const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec).toArray();
   for (var queryResult of results) {
       let resultString = JSON.stringify(queryResult);
       console.log(`\tQuery returned ${resultString}\n`);
   }
  };

// Exit the app with a prompt
// @param {message} message - The message to display
function exit(message) {
  console.log(message);
  console.log('Press any key to exit');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}

createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer())
  .then(() => readContainer())
  .then(() => createFamilyItem(config.items.Andersen))
  .then(() => createFamilyItem(config.items.Wakefield))
  .then(() => createFamilyItem(config.items.iijmio))
  .then(() => queryContainer())

  .then(() => { exit(`Completed successfully`); })
  .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
