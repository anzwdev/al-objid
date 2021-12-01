import { Uri } from "vscode";
import { getManifest, getUriFromAppId } from "../lib/AppManifest";
import { Backend } from "../lib/Backend";
import { UI } from "../lib/UI";
import { ALWorkspace } from "../lib/ALWorkspace";
import { ObjIdConfig } from "../lib/ObjIdConfig";
import { output } from "../features/Output";
import { ConsumptionInfo } from "../lib/BackendTypes";
import { LABELS } from "../lib/constants";
import { getActualConsumption, getObjectDefinitions, getWorkspaceFolderFiles } from "../lib/ObjectIds";
import { Telemetry } from "../lib/Telemetry";

interface SyncOptions {
    merge: boolean,
    skipQuestion: boolean,
    uri: Uri,
}

/**
 * Synchronizes object ID consumption information with the Azure back end.
 * 
 * @param patch Flag that indicates whether patching (merge) rather than full replace should be done
 * @param uri Uri of a document or a workspace folder for which to run the synchronization
 * @returns 
 */
export const syncObjectIds = async (options?: SyncOptions, appId?: string) => {
    let uri: Uri | undefined;
    if (!appId) {
        uri = await ALWorkspace.selectWorkspaceFolder(options?.uri);
        if (!uri) return;

        const manifest = getManifest(uri);

        if (!manifest) {
            UI.sync.showNoManifestError();
            return;
        }

        appId = manifest.id;

    } else {
        uri = getUriFromAppId(appId);
    }
    let authKey = ObjIdConfig.instance(uri).authKey;

    if (!options?.merge) {
        let consumption = await Backend.getConsumption(appId, authKey);
        if (consumption?._total) {
            let answer = await UI.sync.showAreYouSure();
            if (answer === LABELS.SYNC_ARE_YOU_SURE.NO) return;
        }
    }

    output.log("Starting syncing object ID consumption with the back end");

    const uris = await getWorkspaceFolderFiles(uri);
    const objects = await getObjectDefinitions(uris);
    const consumption: ConsumptionInfo = getActualConsumption(objects);

    Telemetry.instance.log("syncIds", appId);
    if (await Backend.syncIds(appId, consumption, !!(options?.merge), ObjIdConfig.instance(uri).authKey || "")) {
        UI.sync.showSuccessInfo();
    }
}
