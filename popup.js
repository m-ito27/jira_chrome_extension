window.onload = function() {
  document.getElementById('copy').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id},
          func: getUrlAndH1
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            // Use clipboard directly in the popup page.
            navigator.clipboard.writeText(result[0].result).then(() => {
              console.log("Copied successfully");
            }).catch((err) => {
              console.error("Error copying text: ", err);
            });
          }
        }
      );
    });
  });
}

function getUrlAndH1() {
  let urlLastPart = window.location.pathname.split("/").pop();
  let h1Text = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
  return `${urlLastPart} ${h1Text}`;
}
