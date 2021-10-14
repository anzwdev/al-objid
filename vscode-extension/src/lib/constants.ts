export const EXTENSION_NAME = "AL Object ID Ninja";

export const URLS = {
    AUTHORIZATION_LEARN: "https://github.com/vjekob/al-objid/tree/master/doc/Authorization.md",
    SYNCHRONIZATION_LEARN: "https://github.com/vjekob/al-objid/tree/master/doc/Synchronization.md",
    EXTENSION_LEARN: "https://github.com/vjekob/al-objid/tree/master/doc/Welcome.md",
    AUTO_SYNC: "https://github.com/vjekob/al-objid/tree/master/doc/AutoSync.md",
    AUTO_SYNC_DIRTY: "https://github.com/vjekob/al-objid/tree/master/doc/AutoSyncDirty.md",
}

export const OBJECT_TYPES = [
    "codeunit",
    "enum",
    "enumextension",
    "page",
    "pageextension",
    "permissionset",
    "permissionsetextension",
    "query",
    "report",
    "reportextension",
    "table",
    "tableextension",
    "xmlport"
];

// TODO replace the array above with the enum below (and make sure to break nothing in the proces)
export enum ALObjectType {
    codeunit = "codeunit",
    enum = "enum",
    enumextension = "enumextension",
    page = "page",
    pageextension = "pageextension",
    permissionset = "permissionset",
    permissionsetextension = "permissionsetextension",
    query = "query",
    report = "report",
    reportextension = "reportextension",
    table = "table",
    tableextension = "tableextension",
    xmlport = "xmlport",
}

export const LABELS = {
    BUTTON_SYNCHRONIZE: "Synchronize",
    BUTTON_LEARN_MORE: "Learn more",
    BUTTON_DONT_ASK: "Stop asking me for this VS Code session",
    BUTTON_SHOW_RELEASE_NOTES: "What's New?",

    SYNC_ARE_YOU_SURE: {
        YES: "Yes, please replace existing object ID consumptions in the back end",
        NO: "No, I have changed my mind"
    },

    AUTO_SYNC_PICK: {
        FULL_AUTO: "Fully automated (no questions)",
        INTERACTIVE: "Interactive (ask about folders and branches)",
        LEARN_MORE: "Learn more about auto-syncing"
    }
};

/**
 * Indicates that AL Object Ninja has previously been run on this machine. This is needed to
 * decide whether to show release notes.
 */
export const ALREADY_USED = "already_used";
