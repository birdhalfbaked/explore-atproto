import { JoseKey } from "@atproto/jwk-jose";
import express, { Express, Request, Response } from "express";
import { Key, NodeOAuthClient, NodeSavedState, NodeSavedSession, NodeSavedSessionStore, NodeSavedStateStore } from "@atproto/oauth-client-node";
import { ClientConfig } from "./config";
import { Agent } from "@atproto/api";


var LOCAL_AGENT: Agent = null;

export function getAgent(): Agent {
    return LOCAL_AGENT
}

class LocalStore<Type> {
    internalStore: Map<string, Type>

    constructor() {
        this.internalStore = new Map<string, Type>();
    }

    get(key: string): Type {
        return this.internalStore[key];
    }
    set(key: string, value: Type): void {
        this.internalStore[key] = value;
    }
    del(key: string): void {
        this.internalStore.delete(key);
    }
}

export const ATProtoClient = new NodeOAuthClient({
    clientMetadata: {
        redirect_uris: [
            "http://127.0.0.1:8080/atproto-oauth-callback"
        ],
        client_id: "http://localhost?scope=atproto transition:generic&redirect_uri=http://127.0.0.1:8080/atproto-oauth-callback",
        scope: "atproto transition:generic",
        response_types: ['code'],
        application_type: 'web',
        token_endpoint_auth_method: 'none',
        dpop_bound_access_tokens: true,
    },
    keyset: [],
    stateStore: new LocalStore<NodeSavedState>(),
    sessionStore: new LocalStore<NodeSavedSession>(),
});

export function authenticate(req: Request, res: Response, next: any): void {
    const handle = ClientConfig.LoginHandle;
    const state = "123456";
    ATProtoClient.authorize(handle, {
        state,
        ui_locales: 'en',
    }).then((url) => { res.redirect(url.toString()) });

}

async function oauthCallback(req: Request, res: Response, next: any) {
    try {
        const params = new URLSearchParams(req.url.split('?')[1])
        const { session, state } = await ATProtoClient.callback(params)
        LOCAL_AGENT = new Agent(session);
        res.json("Authenticated successfully!")
    } catch (err) {
        next(err)
    }
}

export function addOauthViews(app: Express) {
    app.get('/atproto-oauth-callback', oauthCallback);
    app.get('/login', authenticate);
}
