const axios = require('axios');

const username = process.env.WP_USERNAME;
const password = process.env.WP_PASSWORD;

const token = Buffer
.from(`${username}:${password}`)
.toString('base64');

async function run() {

  // WORDPRESS DATA

  const wp = await axios.get(
    'https://varamama.com/wp-json/wp/v2/posts',
    {
      headers: {
        Authorization: `Basic ${token}`
      }
    }
  );

  const latest = wp.data[0];

  const title = latest.title.rendered;
  const link = latest.link;

  // FACEBOOK PAGE POST

  await axios.post(
    `https://graph.facebook.com/${process.env.PAGE_ID}/feed`,
    null,
    {
      params: {
        message: title,
        link: link,
        access_token: process.env.FB_TOKEN
      }
    }
  );

  // BLOGGER POST

  await axios.post(
    process.env.BLOGGER_URL,
    {
      title: title,
      content: latest.content.rendered
    }
  );

  console.log('DONE');

}

run();
