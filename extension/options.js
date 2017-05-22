var version = `v${chrome.runtime.getManifest().version}`

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("extension_version").textContent = version;
  var database_input = document.getElementById("database");
  var save_button = document.getElementById("save");
  var status = document.getElementById("status");

  chrome.storage.local.get(null, function(items) {
    database_input.value = items.database;
  });

  save_button.addEventListener("click", function() {
    chrome.storage.local.set({
      database: database_input.value
    }, function() {
      status.textContent = "Saved.";
      setTimeout(function() {
        status.textContent = "";
      }, 5000);
    });
  });
});
