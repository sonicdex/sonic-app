export default class FetchApi {
  static region() {
    return fetch('http://www.cloudflare.com/cdn-cgi/trace')
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        return data.split('=')[9].replace(/\s+/g, '').replace('tls', '');

        // return {ip:data.ip,loc:data.loc}
      });
  }
}
