var db;

function load_options() {
  db = {};
  chrome.storage.local.get("database", function(items) {
    if (!items.database || items.database == "") {
      items.database = `# Contribute to the database by filing an issue at:
# https://github.com/stefansundin/the-onion-notifier

www.facebook.com   www.facebookcorewwwi.onion   # https://www.facebook.com/notes/protect-the-graph/making-connections-to-facebook-more-secure/1526085754298237
protonmail.com     protonirockerxow.onion       # https://protonmail.com/tor
keybase.io         fncuwbiisyh6ak3i.onion       # https://keybase.io/docs/command_line/tor
www.propublica.org propub3r6espa33w.onion       # https://www.propublica.org/nerds/item/a-more-secure-and-anonymous-propublica-using-tor-hidden-services
scryptmail.com     scryptmaildniwm6.onion       # https://blog.scryptmail.com/complete-tor-support/
duckduckgo.com     3g2upl4pq6kufc4m.onion       # https://github.com/duckduckgo/zeroclickinfo-goodies/blob/b9e7ad188885aa22b37c578296afbf270bc44665/t/DuckDuckGo.t#L95-L110
www.qubes-os.org   qubesos4rrrrz6n4.onion       # bottom of https://www.qubes-os.org/

# https://riseup.net/en/tor#riseups-tor-hidden-services
# https://riseup.net/security/network-security/tor/hs-addresses-signed.txt
riseup.net         nzh3fv6jc6jskki3.onion
www.riseup.net     nzh3fv6jc6jskki3.onion
help.riseup.net    nzh3fv6jc6jskki3.onion
black.riseup.net   cwoiopiifrlzcuos.onion
lists.riseup.net   xpgylzydxykgdqyg.onion
mail.riseup.net    zsolxunfmbfuq7wf.onion
pad.riseup.net     5jp7xtmox6jyoqd5.onion
share.riseup.net   6zc6sejeho3fwrd4.onion
account.riseup.net j6uhdvbhz74oefxf.onion
we.riseup.net      7lvd7fa5yfbdqaii.onion

# bottom of https://thepiratebay.org/
thepiratebay.am    uj3wazyk5u4hnvtk.onion
thepiratebay.com   uj3wazyk5u4hnvtk.onion
thepiratebay.gd    uj3wazyk5u4hnvtk.onion
thepiratebay.gl    uj3wazyk5u4hnvtk.onion
thepiratebay.gs    uj3wazyk5u4hnvtk.onion
thepiratebay.gy    uj3wazyk5u4hnvtk.onion
thepiratebay.la    uj3wazyk5u4hnvtk.onion
thepiratebay.mn    uj3wazyk5u4hnvtk.onion
thepiratebay.ms    uj3wazyk5u4hnvtk.onion
thepiratebay.net   uj3wazyk5u4hnvtk.onion
thepiratebay.org   uj3wazyk5u4hnvtk.onion
thepiratebay.pe    uj3wazyk5u4hnvtk.onion
thepiratebay.se    uj3wazyk5u4hnvtk.onion
thepiratebay.sx    uj3wazyk5u4hnvtk.onion
thepiratebay.vg    uj3wazyk5u4hnvtk.onion
piratebay.am       uj3wazyk5u4hnvtk.onion
piratebay.net      uj3wazyk5u4hnvtk.onion
piratebay.no       uj3wazyk5u4hnvtk.onion
piratebay.se       uj3wazyk5u4hnvtk.onion
themusicbay.com    uj3wazyk5u4hnvtk.onion
themusicbay.net    uj3wazyk5u4hnvtk.onion
themusicbay.org    uj3wazyk5u4hnvtk.onion
`;
      chrome.storage.local.set(items);
    }
    items.database.split("\n").forEach(function(line) {
      var hash_index = line.indexOf("#");
      if (hash_index != -1) {
        line = line.substr(0, hash_index);
      }
      line = line.trim();
      if (line == "") return;
      var space_index = line.indexOf(" ");
      var domain = line.substr(0, space_index);
      var onion_domain = line.substr(space_index).trim();
      db[domain] = onion_domain;
    });
  });
}

load_options();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action == "load-options") {
    load_options();
  }
});

function extract_domain(url) {
  var prot_index = url.indexOf("://");
  if (prot_index == -1) return;
  var path_index = url.indexOf("/", prot_index+3);
  if (path_index == -1) return;
  return url.substring(prot_index+3, path_index);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    var domain = extract_domain(changeInfo.url);
    var onion_domain = db[domain];
    if (onion_domain) {
      chrome.notifications.create(`${tabId}`, {
        type: "basic",
        iconUrl: "img/icon48.png",
        title: `Onion domain available for ${domain}`,
        message: `Click to open ${onion_domain}.`,
      });
    }
    else {
      chrome.notifications.clear(`${tabId}`);
    }
  }
});

chrome.notifications.onClicked.addListener(function(id) {
  var tabId = parseInt(id, 10);
  chrome.tabs.get(tabId, function(tab) {
    var domain = extract_domain(tab.url);
    var onion_domain = db[domain];
    var onion_url = tab.url.replace(domain, onion_domain).replace(/^https/, "http");
    chrome.tabs.update(tabId, {
      active: true,
      url: onion_url,
    });
  });
});
