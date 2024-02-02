const h1TitleTag = 'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]'
const workPanelId = 'your-work-dropdown-tabs-0-tab'
const headerId = 'ak-jira-navigation'
const workStatusProp = "[data-ds--menu--heading-item='true']"
const workTitleProp = "[data-item-title='true']"
const workDescriptionProp = "[data-item-description='true']"

window.onload = function() {
  document.getElementById('copy-single-task').addEventListener('click', function() {
    writeToClipBoard(getUrlAndH1, [h1TitleTag])
  })

  document.getElementById('copy-all-task').addEventListener('click', async function() {
    writeToClipBoard(getTasksText, [workPanelId, headerId, workStatusProp, workTitleProp, workDescriptionProp])
  })
}

function writeToClipBoard(func, args) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: func,
          args: args
      }, (result) => {
          if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
          } else {
              navigator.clipboard.writeText(result[0].result);
          }
      });
  });
}

function getUrlAndH1(h1TitleTag) {
  let url = new URL(window.location.href);
  let jiraID = url.searchParams.get("selectedIssue") || url.pathname.split("/").pop();

  let taskTitle = document.querySelector(h1TitleTag).innerText
  return `${jiraID} ${taskTitle}`;
}

async function getTasksText(workPanelId, headerId, workStatusProp, workTitleProp, workDescriptionProp) {
  let tasksElement = document.getElementById(workPanelId);
  if (!tasksElement) {
    headerElement = document.getElementById(headerId);
    let spanElements = headerElement.querySelectorAll('span');
    for (let spanElement of spanElements) {
      if (spanElement.innerText === 'あなたの作業') {
        spanElement.click();

        await waitForElement(`#${workPanelId}`, workStatusProp);
        tasksElement = document.getElementById(workPanelId);
        break;
      }
    }
  }
  let copyText = ''
  reversedTaskList = Array.from(tasksElement.querySelectorAll(workStatusProp)).reverse()
  reversedTaskList.forEach((element) => {
    jiraStatus = element.innerText
    copyText = copyText.concat(`[${jiraStatus}]\n`)
    parent = element.parentElement
    parent.querySelectorAll(workTitleProp).forEach((eachTask) => {
      taskTitle = eachTask.innerText
      jiraID = eachTask.parentElement.querySelector(workDescriptionProp).childNodes[0].textContent
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
