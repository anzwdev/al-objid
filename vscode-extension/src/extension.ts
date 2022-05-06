import { ExtensionContext, commands, languages, window } from "vscode";
import { authorizeApp } from "./commands/authorize-app";
import { autoSyncObjectIds } from "./commands/auto-sync-object-ids";
import { commitSuggestionCommand } from "./commands/commit-suggestion";
import { confirmAuthorizeApp } from "./commands/confirm-authorize-app";
import { confirmDeauthorizeApp } from "./commands/confirm-deauthorize-app";
import { confirmSyncObjectIds } from "./commands/confirm-sync-object-ids";
import { deauthorizeApp } from "./commands/deauthorize-app";
import { syncObjectIds } from "./commands/sync-object-ids";
import { NewsHandler } from "./features/NewsHandler";
import { AuthorizationStatusBar } from "./features/AuthorizationStatusBar";
import { PollingHandler } from "./features/PollingHandler";
import { NextObjectIdCompletionProvider } from "./features/NextObjectIdCompletionProvider";
import { Output } from "./features/Output";
import { Config } from "./lib/Config";
import { HttpStatusHandler } from "./features/HttpStatusHandler";
import { ReleaseNotesHandler } from "./features/ReleaseNotesHandler";
import { showReleaseNotes } from "./commands/show-release-notes";
import { ExplorerTreeDataProvider } from "./features/Explorer/ExplorerTreeDataProvider";
import { ExplorerDecorationsProvider } from "./features/Explorer/ExplorerDecorationsProvider";
import { ConsumptionWarnings } from "./features/ConsumptionWarnings";
import { Telemetry } from "./lib/Telemetry";
import { ParserConnector } from "./features/ParserConnector";
import { ObjIdConfigMonitor } from "./features/ObjIdConfigMonitor";
import { copyRanges } from "./commands/copy-ranges";
import { consolidateRanges } from "./commands/consolidate-ranges";
import { createAppPool } from "./commands/create-app-pool";
import { Diagnostics } from "./features/Diagnostics";
import { validateLicense } from "./commands/validate-license";
import { ObjIdConfigActionProvider } from "./features/ObjIdConfigCodeActionProvider";
import { selectBCLicense } from "./commands/select-bclicense";
import { quickFixRemoveDeclaration } from "./commands/quickfix-remove-declaration";
import { quickFixSelectValidType } from "./commands/quickfix-select-valid-type";

export function activate(context: ExtensionContext) {
	ConsumptionWarnings.instance.setContext(context);
	Telemetry.instance.setContext(context);
	commands.executeCommand("setContext", "vjeko-al-objid.active", true);

	context.subscriptions.push(
		// Commands
		commands.registerCommand("vjeko-al-objid.confirm-sync-object-ids", confirmSyncObjectIds),
		commands.registerCommand("vjeko-al-objid.confirm-authorize-app", confirmAuthorizeApp),
		commands.registerCommand("vjeko-al-objid.confirm-deauthorize-app", confirmDeauthorizeApp),
		commands.registerCommand("vjeko-al-objid.auto-sync-object-ids", autoSyncObjectIds),
		commands.registerCommand("vjeko-al-objid.show-release-notes", showReleaseNotes),
		commands.registerCommand("vjeko-al-objid.copy-ranges", copyRanges),
		commands.registerCommand("vjeko-al-objid.consolidate-ranges", consolidateRanges),
		commands.registerCommand("vjeko-al-objid.create-app-pool-preview", createAppPool),

		// Internal commands
		commands.registerCommand("vjeko-al-objid.commit-suggestion", commitSuggestionCommand),
		commands.registerCommand("vjeko-al-objid.sync-object-ids", syncObjectIds),
		commands.registerCommand("vjeko-al-objid.authorize-app", authorizeApp),
		commands.registerCommand("vjeko-al-objid.deauthorize-app", deauthorizeApp),
		commands.registerCommand("vjeko-al-objid.validate-license-preview", validateLicense),
		commands.registerCommand("vjeko-al-objid.select-bclicense", selectBCLicense),
		commands.registerCommand("vjeko-al-objid.quickfix-remove-declaration", quickFixRemoveDeclaration),
		commands.registerCommand("vjeko-al-objid.quickfix-select-valid-type", quickFixSelectValidType),

		// Tree view
		ExplorerTreeDataProvider.instance,
		window.registerTreeDataProvider("ninja-rangeExplorer", ExplorerTreeDataProvider.instance),
		window.registerFileDecorationProvider(ExplorerDecorationsProvider.instance),

		// CodeActions provider
		languages.registerCodeActionsProvider("jsonc", new ObjIdConfigActionProvider()),

		// Other
		languages.registerCompletionItemProvider("al", new NextObjectIdCompletionProvider()),
		AuthorizationStatusBar.instance.getDisposables(),
		Output.instance.getDisposables(),
		Config.instance.getDisposables(),
		new PollingHandler(),
		new NewsHandler(context),
		new ObjIdConfigMonitor(),
		new HttpStatusHandler(context).getDisposables(),
		ParserConnector.instance,
		Diagnostics.instance
	);

	ReleaseNotesHandler.instance.check(context);
}

export function deactivate() {
	commands.executeCommand("setContext", "vjeko-al-objid.active", false);
}
