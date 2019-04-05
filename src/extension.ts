// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { FileController } from './file-controller';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mocha-test-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.generateMochaTest', () => {
		// The code you place here will be executed every time your command is executed
		if (vscode.window.activeTextEditor) {
			const currentFile = vscode.window.activeTextEditor.document.fileName;
			const currentDir = path.dirname(currentFile);
			const fileController = new FileController(currentDir, currentFile);
			fileController.generateSingleTest();
		}

		// Display a message box to the user
		vscode.window.showInformationMessage('Generating Mocha Tests.');
	});

	context.subscriptions.push(disposable);

	let disposableAllTests = vscode.commands.registerCommand('extension.generateMochaTestsForAllFiles', () => {
		// The code you place here will be executed every time your command is executed
		if (vscode.window.activeTextEditor) {
			const currentFile = vscode.window.activeTextEditor.document.fileName;
			const currentDir = path.dirname(currentFile);
			const fileController = new FileController(currentDir, currentFile);
			fileController.generateTests();
		}
	});

	context.subscriptions.push(disposableAllTests);
}

// this method is called when your extension is deactivated
export function deactivate() { }
