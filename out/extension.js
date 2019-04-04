"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const file_controller_1 = require("./file-controller");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mocha-test-generator" is now active!');
    if (vscode.window.activeTextEditor) {
        const currentFileName = vscode.window.activeTextEditor.document.fileName;
        const currentDir = path.dirname(currentFileName);
        const fileController = new file_controller_1.FileController(currentDir);
        fileController.generateTests();
    }
    // if (!fs.existsSync('../../../test')) {
    // fs.mkdirSync('test');
    // }
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.generateMochaTest', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Generating Mocha Tests.');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map