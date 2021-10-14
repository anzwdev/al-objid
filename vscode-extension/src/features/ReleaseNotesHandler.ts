import path = require("path");
import { commands, ExtensionContext, extensions, Uri } from "vscode";
import * as fs from "fs";
import { Config } from "../lib/Config";
import { ALREADY_USED, LABELS } from "../lib/constants";
import { UI } from "../lib/UI";

export class ReleaseNotesHandler {
    private static _instance: ReleaseNotesHandler;
    private _version?: string;

    private constructor() {}

    public static get instance() {
        return this._instance || (this._instance = new ReleaseNotesHandler());
    }

    public forceShowReleaseNotes() {
        if (!this.releaseNotesExist(this.version)) {
            UI.general.showReleaseNotesNotAvailable(this.version);
        }
        this.openReleaseNotesPanel(this.version);
    }

    public check(context: ExtensionContext) {
        if (!this.version) {
            return;
        }

        this.checkNotes(this.version, context);
    }

    private get version() {
        return this._version || (this._version = extensions.getExtension("vjeko.vjeko-al-objid")?.packageJSON?.version);
    }

    private stateKey(version: string) {
        return `release-notes/${version}`;
    }

    private releaseNotesUri(version: string): Uri {
        return Uri.file(path.join(__dirname, `../../docs/ReleaseNotes.v${version}.md`));
    }

    private releaseNotesExist(version: string): boolean {
        try {
            let stat = fs.statSync(this.releaseNotesUri(version).fsPath);
            return stat.isFile();
        } catch {
            return false;
        }
    }

    private async showReleaseNotes(version: string, context: ExtensionContext) {
        context.globalState.update(this.stateKey(version), true);
        if (this.isFirstRun(context)) {
            return;
        }

        if (!Config.instance.showReleaseNotes) {
            return;
        }

        if (await UI.general.showReleaseNotes(version) === LABELS.BUTTON_SHOW_RELEASE_NOTES) {
            this.openReleaseNotesPanel(version);
        }
    }

    private openReleaseNotesPanel(version: string) {
        commands.executeCommand("markdown.showPreview", this.releaseNotesUri(version));
    }

    private checkNotes(version: string, context: ExtensionContext) {
        if (context.globalState.get(this.stateKey(version))) {
            return;
        }
        if (this.releaseNotesExist(version)) {
            this.showReleaseNotes(version, context);
        }
    }

    private isFirstRun(context: ExtensionContext): boolean {
        if (context.globalState.get(ALREADY_USED)) {
            return false;
        }
        context.globalState.update(ALREADY_USED, true);
        return true;
    }
}
