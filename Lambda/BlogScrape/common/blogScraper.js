require("dotenv").config();
const axios = require("axios");

var client_id = process.env.NAVER_CLIENT_ID;
var client_secret = process.env.NAVER_CLIENT_SECRECT;

async function blogScraper(keyword, count, recentPostDate) {
  try {
    let result = [];
    let start = 1;
    const display = 10;
    while (result.length < count) {
      var api_url = `https://openapi.naver.com/v1/search/blog?display=${display}&start=${start}&sort=date&query=\"${encodeURIComponent(
        keyword
      )}\"`;

      let blogsResponse = await axios({
        url: api_url,
        method: "get",
        timeout: 10000,
        headers: {
          "X-Naver-Client-Id": client_id,
          "X-Naver-Client-Secret": client_secret,
        },
      });
      if (blogsResponse.status == 200) {
        const data = await blogsResponse.data.items.map(function (item) {
          return {
            keyword: keyword,
            title: item.title,
            link: item.link,
            postdate: item.postdate,
          };
        });
        const filteredData = data.filter(function (item) {
          console.log(recentPostDate, item.postdate);
          console.log(item.postdate > recentPostDate);
          return item.postdate > recentPostDate;
        });
        result = [...result, ...filteredData];

        if (result.length > count) {
          result = result.slice(0, count + 1);
        }
        if (filteredData.length !== data.length) {
          console.log("스크랩 목표 포스팅 개수 : " + result.length);
          return result;
        }
      }
      start += display;
    }
    console.log("스크랩 목표 포스팅 개수 : " + result.length);
    return result;
  } catch (error) {
    console.error("[Blog Get Error]:", error);
  }
}

// 모듈로 내보내기
module.exports = {
  blogScraper,
};
