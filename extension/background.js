var db = {
  "www.facebook.com":   "www.facebookcorewwwi.onion",
  "thepiratebay.am":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.com":   "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.gd":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.gl":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.gs":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.gy":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.la":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.mn":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.ms":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.net":   "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.org":   "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.pe":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.se":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.sx":    "uj3wazyk5u4hnvtk.onion",
  "thepiratebay.vg":    "uj3wazyk5u4hnvtk.onion",
  "piratebay.am":       "uj3wazyk5u4hnvtk.onion",
  "piratebay.net":      "uj3wazyk5u4hnvtk.onion",
  "piratebay.no":       "uj3wazyk5u4hnvtk.onion",
  "piratebay.se":       "uj3wazyk5u4hnvtk.onion",
  "themusicbay.com":    "uj3wazyk5u4hnvtk.onion",
  "themusicbay.net":    "uj3wazyk5u4hnvtk.onion",
  "themusicbay.org":    "uj3wazyk5u4hnvtk.onion",
  "protonmail.com":     "protonirockerxow.onion",
  "riseup.net":         "nzh3fv6jc6jskki3.onion",
  "www.riseup.net":     "nzh3fv6jc6jskki3.onion",
  "help.riseup.net":    "nzh3fv6jc6jskki3.onion",
  "black.riseup.net":   "cwoiopiifrlzcuos.onion",
  "lists.riseup.net":   "xpgylzydxykgdqyg.onion",
  "mail.riseup.net":    "zsolxunfmbfuq7wf.onion",
  "pad.riseup.net":     "5jp7xtmox6jyoqd5.onion",
  "share.riseup.net":   "6zc6sejeho3fwrd4.onion",
  "account.riseup.net": "j6uhdvbhz74oefxf.onion",
  "we.riseup.net":      "7lvd7fa5yfbdqaii.onion",
  "keybase.io":         "fncuwbiisyh6ak3i.onion",
  "www.propublica.org": "propub3r6espa33w.onion",
  "scryptmail.com":     "scryptmaildniwm6.onion",
  "duckduckgo.com":     "3g2upl4pq6kufc4m.onion",
  "www.qubes-os.org":   "qubesos4rrrrz6n4.onion",
};

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
