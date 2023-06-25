# <img width="40" alt="image" src="https://github.com/m-ito27/jira_chrome_extension/assets/65613054/a5b23880-ba8a-4c5a-9a96-e83c45578b62"> Copy JIRA for Report(Chrome拡張機能)

## What is this?

JIRAの課題をいい感じにコピーできる、Chromeの拡張機能です。

## Usage

### Copy your watching task's JIRA-ID + JIRA-Title

1. JIRAのタスクを開いているページ※に遷移する  
   ※タスクの詳細画面orタスクをモーダルで開いている状態
2. 拡張機能の「Copy Task」をクリックする  
3. `JIRA-ID JIRA-Title`のかたちでクリップボードにコピーされます。

例:
```
HPRR-1 サンプルタスク
```

### Copy all your tasks

1. JIRAで、「あなたの作業」ドロップダウンを押しているor表示されている状態にする
2. 拡張機能の「Copy All Tasks」をクリックする
3. ステータスごとにあなたのタスク一覧がクリップボードにコピーされます。

例:
```
[進行中]
HPRR-1 サンプルタスク
HPRR-2 進行中のタスク
[TO DO]
HPRR-3 やらねばタスク
```
