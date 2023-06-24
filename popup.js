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
            navigator.clipboard.writeText(result[0].result)
          }
        }
      );
    });
  });

  document.getElementById('all-task-copy-btn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: getTasksText,
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          navigator.clipboard.writeText(results[0].result);
        }
      });
    });
  })

}

function getUrlAndH1() {
  let url = new URL(window.location.href);
  let jiraID = url.searchParams.get("selectedIssue") || url.pathname.split("/").pop();

  let taskTitle = document.querySelector('h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]').innerText
  return `${jiraID} ${taskTitle}`;
}

function getTasksText() {
  let tasksElement = document.getElementById('your-work-dropdown-tabs-0-tab');
  let copyText = ''
  reversedTaskList = Array.from(tasksElement.querySelectorAll("[data-ds--menu--heading-item='true']")).reverse()
  reversedTaskList.forEach((element) => {
    jiraStatus = element.innerText
    copyText = copyText.concat(`[${jiraStatus}]\n`)
    parent = element.parentElement
    parent.querySelectorAll("[data-item-title='true']").forEach((eachTask) => {
      taskTitle = eachTask.innerText
      jiraID = eachTask.parentElement.querySelector("[data-item-description='true']").childNodes[0].textContent
      // console.log(`${jiraID} ${taskTitle}`)
      copyText = copyText.concat(`${jiraID} ${taskTitle}\n`)
    })
  })
  return copyText
}
