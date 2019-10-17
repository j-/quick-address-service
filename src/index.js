const express = require('express');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const fetch = require('node-fetch');

const SIT1 = 'SIT1';
const SIT3 = 'SIT3';
const ENV = SIT3;

const ADDRESS_HOST_SIT1 = 'https://electronicverification-csp-test-fuchsia.apps.omni.service.test/';
const ADDRESS_HOST_SIT3 = 'https://electronicverification-csp-test-sienna.apps.omni.service.test/';
const ADDRESS_HOST = ENV === SIT1 ? ADDRESS_HOST_SIT1 : ENV === SIT3 ? ADDRESS_HOST_SIT3 : null;

const AUTH_HOST_SIT1 = 'https://credentialrecoverysit3.dev.anz/';
const AUTH_HOST_SIT3 = 'https://onlineappsqa.dev.anz/';
const AUTH_HOST = ENV === SIT1 ? AUTH_HOST_SIT1 : ENV === SIT3 ? AUTH_HOST_SIT3 : null;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
let auth = null;

app.get('/', (_req, res) => {
  res.redirect('/api/electronicverification/verifications/addresses?limit=15&queryString=p07k%20211%20powlett');
});

app.use(cors());

app.use('/api', proxy({
  target: ADDRESS_HOST,
  changeOrigin: true,
  secure: false,
  onProxyRes: (res) => {
    delete res.headers['set-cookie'];
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('authorization', auth);
  },
  headers: {
    "accept": "application/vnd.csp-anz.com+json;version=1.0",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "anz-application-id": "ANZ-AU-COLA",
    "anz-application-version": "1.0",
    "anz-request-id": "0ebdb3c4-30dc-44de-949c-7c985e579c0a",
    "cache-control": "no-cache",
    "cookie": "visid_incap_1994183=4ArQwBqlQDCxerSeIvNo1kmBCF0AAAAAQUIPAAAAAAAdD8bNU9Wzo1FcKG56W5ku; s_vi=[CS]v1|2E8440A5852C3DDF-600000C080000894[CE]; LPVID=MwYzRlN2E5YzliM2IxNDll; _ga=GA1.2.2007626680.1561093010; AAMC_anz_0=REGION%7C8; aam_uuid=27734731380037184774746378269319544171; s_ecid=MCMID%7C12296225073571903421332354152267782299; nlbi_1994183=nBiNas9I7hsp/9y+nRXGbwAAAABkK4KvgzTevQKOmxg0zVEk; AMCVS_67A216D751E567B20A490D4C%40AdobeOrg=1; s_cc=true; s_tl_f=1; AMCV_67A216D751E567B20A490D4C%40AdobeOrg=-330454231%7CMCIDTS%7C18179%7CMCMID%7C27523183409550473554724817030132992413%7CMCAID%7CNONE%7CMCOPTOUT-1570665932s%7CNONE%7CvVersion%7C3.1.2; incap_ses_362_1994183=XkumMqnpZWiqugaP5hUGBRNmnl0AAAAAh3MDmrPd2kz89EDtf9QkUw==; superT_s1=1570661903998.623189; superT_v1=1560838474627.543021%3A21%3A1%3A58; s_ppvl=personal%253Abank-accounts%253Aola%253Aonline-saver%253Astart%2C55%2C95%2C1614%2C1680%2C848%2C1680%2C1050%2C2%2CL; s_sq=%5B%5BB%5D%5D; LPSID-47757941=MR5wSqXESwqXl681q10NlQ; s_eVar27=IXMD; s_ppv=personal%253Acredit-cards%253Aola%253Aanz-frequent-flyer-black%253Astart%2C33%2C78%2C2007%2C1680%2C516%2C1680%2C1050%2C2%2CL; s_nr=1570661917453-Repeat",
    "evtokenretrievalcallinprocess": "false",
    "evtokenretrievalerror": "",
    "evverificationtoken": "",
    "expiresat": "1570665508",
    "origapp": "COLA",
    "pragma": "no-cache",
    "referer": "https://creditcardapp.anz.com/",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
    "uuid": "c7d80c92-e957-4997-82b4-6cde3cfd4fd5",
    "x-application-context": "ANZ-AU-COLA/1.0",
    "x-b3-traceid": "0ebdb3c4-30dc-44de-949c-7c985e579c0a",
  },
}));

const getAuthentication = async () => {
  const res = await fetch(AUTH_HOST + 'zeroauthntokenissuer/tokens/v1', {
    "credentials": "include",
    "headers": {
      "accept": "application/vnd.csp-anz.com+json;version=1.0",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "anz-application-id": "ANZ-AU-COLA",
      "anz-application-version": "1.0",
      "anz-request-id": "93acd8f6-9d28-4cab-9634-059fa15316fa",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "origapp": "COLA",
      "pragma": "no-cache",
      "requestid": "93acd8f6-9d28-4cab-9634-059fa15316fa",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-application-context": "ANZ-AU-COLA/1.0",
      "x-b3-traceid": "93acd8f6-9d28-4cab-9634-059fa15316fa"
    },
    "referrer": ADDRESS_HOST,
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "{\"audience\":\"cola\",\"scopes\":[\"AU.UNAUTHENTICATED\"]}",
    "method": "POST",
    "mode": "cors"
  });
  const json = await res.json();
  const auth = json['Jwt-Token'];
  return auth;
};

const updateAuthentication = async () => {
  try {
    console.info('Fetch JWT');
    auth = await getAuthentication();
    console.log(auth);
  } catch (err) {
    console.error('Error fetching JWT');
    console.error(err.message);
  }
};

updateAuthentication(); // Fetch token immediately
setInterval(updateAuthentication, 1000 * 60 * 5); // Every 5 minutes

app.listen(8080);
