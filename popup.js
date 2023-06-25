window.onload = function() {
  document.getElementById('copy-single-task').addEventListener('click', function() {
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

  document.getElementById('copy-all-task').addEventListener('click', async function() {
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

async function getTasksText() {
  let tasksElement = document.getElementById('your-work-dropdown-tabs-0-tab');
  if (!tasksElement) {
    headerElement = document.getElementById('ak-jira-navigation');
    let spanElements = headerElement.querySelectorAll('span');
    for (let spanElement of spanElements) {
      if (spanElement.innerText === 'あなたの作業') {
        spanElement.click();

        await waitForElement('#your-work-dropdown-tabs-0-tab', "[data-ds--menu--heading-item='true']");
        tasksElement = document.getElementById('your-work-dropdown-tabs-0-tab');
        break;
      }
    }
  }
  let copyText = ''
  reversedTaskList = Array.from(tasksElement.querySelectorAll("[data-ds--menu--heading-item='true']")).reverse()
  reversedTaskList.forEach((element) => {
    jiraStatus = element.innerText
    copyText = copyText.concat(`[${jiraStatus}]\n`)
    parent = element.parentElement
    parent.querySelectorAll("[data-item-title='true']").forEach((eachTask) => {
      taskTitle = eachTask.innerText
      jiraID = eachTask.parentElement.querySelector("[data-item-description='true']").childNodes[0].textContent
      copyText = copyText.concat(`${jiraID} ${taskTitle}\n`)
    })
  })
  return copyText

  function waitForElement(parentSelector, childSelector) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const element = document.querySelector(parentSelector)?.querySelector(childSelector);
            if (element) {
              resolve(element);
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    });
  }
}
