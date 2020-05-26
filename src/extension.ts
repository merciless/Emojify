import * as vscode from "vscode";
import { list } from "./emojis";

const pickOptions = {
  matchOnDetail: true,
  matchOnDescription: true,
  placeHolder: "Type emoji name",
};

const actions = [
  {
    label: "📝",
    description: "Insert on cursor",
  },
  {
    label: "🙏",
    description: "Copy to clipboard",
  },
  {
    label: "🙈",
    description: "Get emoji code",
  },
  {
    label: "🚀",
    description: "Prepare commit message",
  },
];

const insertText = (text: string) => {
  const editor = vscode.window.activeTextEditor;
  editor!
    .edit((editBuilder) => editBuilder.delete(editor!.selection))
    .then(() => {
      editor!.edit((editBuilder) =>
        editBuilder.insert(editor!.selection.start, text)
      );
    });
};

const copyToClipboard = async (text: string) => {
  vscode.env.clipboard.writeText(text);
  vscode.window.showInformationMessage(
    `${text} succesfully copied to your clipboard!`
  );
  let clipboard_content = await vscode.env.clipboard.readText();
  if (clipboard_content !== text) {
    vscode.window.showWarningMessage(
      "Something went wrong whily copying emoji.. Please, try again!"
    );
  }
};

const prepareCommitMessage = (emoji: string, text: string) => {
  const msg: string = "".concat(emoji, " ", text);
  copyToClipboard(msg);
};

export function activate(context: vscode.ExtensionContext) {
  const handler = () => {
    vscode.window.showQuickPick(list, pickOptions).then((emoji) => {
      vscode.window.showQuickPick(actions, pickOptions).then((t) => {
        switch (t?.description) {
          case "Insert on cursor": {
            insertText(emoji!.label);
            break;
          }
          case "Copy to clipboard": {
            copyToClipboard(emoji!.label);
            break;
          }
          case "Prepare commit message": {
            vscode.window
              .showInputBox({
                ignoreFocusOut: true,
                placeHolder: "Enter your commit message",
              })
              .then((msg) => prepareCommitMessage(emoji!.label, msg!));
            break;
          }
          case "Get emoji code": {
            copyToClipboard(emoji!.code);
            break;
          }
          default: {
            vscode.window.showWarningMessage(
              "Something went wrong whily copying emoji.. Please, try again!"
            );
            break;
          }
        }
      });
    });
  };

  const startCommand = vscode.commands.registerCommand("Emojify.start", () =>
    handler()
  );

  context.subscriptions.push(startCommand);
}

export function deactivate() {}
