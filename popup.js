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
  let url = new URL(window.location.href);
  let jiraID = url.searchParams.get("selectedIssue") || url.pathname.split("/").pop();

  let taskTitle = document.querySelector('h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]').innerText
  return `${jiraID} ${taskTitle}`;
}
