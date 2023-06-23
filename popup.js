window.onload = function() {
  document.getElementById('copy').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id},
          function: copyUrlAndH1
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
        }
      );
    });
  });
}

function copyUrlAndH1() {
  let urlLastPart = window.location.pathname.split("/").pop();
  let h1Text = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
  let combinedText = `${urlLastPart} ${h1Text}`;
  console.log(combinedText)
  // Copy to clipboard
  navigator.clipboard.writeText(combinedText);

  return combinedText;
}
