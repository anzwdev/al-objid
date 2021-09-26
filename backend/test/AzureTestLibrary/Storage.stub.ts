import { ALObjectType } from "../../src/functions/v2/ALObjectType";
import { ContentAnalyzer, StubBuilder } from "./Storage.fake.types";

let app = 0;
let key = Date.now();

export function authenticatedApp(appId: string, key: string = authKey(), valid: boolean = true) {
    return {
        [authorization(appId)]: {
            key,
            valid
        },
    };
}

export const authorization = (appId) => `${appId}/_authorization.json`;
export const objectIds = (appId, objectType) => `${appId}/${objectType}.json`;
export const appId = () => `app-${Date.now()}-${app++}`;
export const authKey = () => `key-${key--}`;

class AppBuilder extends StubBuilder implements ContentAnalyzer {
    private _parent: StorageBuilder;
    private _content: {} = {};
    private _appId: string = appId();
    private _authKey: string = "";

    constructor(parent: StorageBuilder) {
        super();
        this._parent = parent;
        this._content = parent.content;
    }

    add(objectType: ALObjectType, ids: number[]) {
        this._content[objectIds(this._appId, objectType)] = ids;
        this._parent.updateContent();
        return this;
    }

    authorize() {
        this._authKey = authKey();
        this._content[authorization(this._appId)] = {
            key: this._authKey,
            valid: true
        };
        this._parent.updateContent();
        return this;
    }

    get appId(): string {
        return this._appId;
    }

    get authKey(): string {
        return this._authKey;
    }

    get content(): {} {
        return this._content;
    }

    objectIds(objectType: ALObjectType): number[] {
        return this._content[objectIds(this._appId, objectType)];
    }

    hasChanged(): boolean {
        return JSON.stringify(this._content) !== this._parent.contentSerialized;
    }

    isAuthorized(): boolean {
        const auth = this._content[authorization(this._appId)];
        return !!(auth && auth.key && auth.valid);
    }
}

class StorageBuilder extends StubBuilder {
    private _apps: AppBuilder[] = [];
    private _content: {} = {};
    private _contentSerialized: string = "";

    app() {
        const app = new AppBuilder(this);
        this._apps.push(app);
        this.updateContent();
        return app;
    }

    get content() {
        return this._content;
    }

    updateContent() {
        this._contentSerialized = JSON.stringify(this._content);
    }

    get contentSerialized() {
        return this._contentSerialized;
    }
}

export const buildStorage = () => new StorageBuilder();

export const buildApp = () => new StorageBuilder().app();
