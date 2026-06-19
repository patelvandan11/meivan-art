const dns = require("dns");

dns.resolveSrv("_xmpp-server._tcp.gmail.com", (err, records) => {
  console.log(err);
  console.log(records);
});