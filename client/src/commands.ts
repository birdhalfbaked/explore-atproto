import { Express, Request, Response } from 'express'
import { getAgent } from './oauth';

async function getProfile(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        let profile = (await agent.getProfile({ actor: agent.did })).data;
        res.json({
            "name": `${profile.displayName}@${profile.handle}`,
            "did": profile.did,
            "followers": profile.followersCount,
            "following": profile.followsCount
        });
    } catch (err) {
        res.status(500).json(`Something failed: ${err}`);
    }
}

async function getFollowers(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
        }
        let response = await agent.getFollowers({ actor: agent.did });
        let followers = response.data.followers.map(follower => {
            return `${follower.displayName}@${follower.handle}`;
        });
        res.json(followers);
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}

async function myLastFivePosts(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        let response = await agent.getAuthorFeed({ actor: agent.did, limit: 5, filter: 'posts_and_author_threads' });
        let posts = response.data.feed.map(content => {
            return {
                "createdAt": content.post.record["createdAt"],
                "likes": content.post.likeCount,
                "reposts": content.post.repostCount,
                "replies": content.post.replyCount,
                "content": content.post.record["text"] || "<embedded content>"
            };
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}

async function latestTimeline(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        let response = await agent.getTimeline({ limit: 5 });
        let posts = response.data.feed.map(content => {
            return {
                "author": `${content.post.author.displayName}@${content.post.author.handle}`,
                "createdAt": content.post.record["createdAt"],
                "likes": content.post.likeCount,
                "reposts": content.post.repostCount,
                "replies": content.post.replyCount,
                "content": content.post.record["text"] || "<embedded content>"
            };
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}

async function createTestPost(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        res.json(await agent.post({ text: "This is a test post made via my custom ATProto client! More to come!", tags: ["Bluesky", "ATProto"] }))
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}

async function topFeeds(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        let response = await agent.app._client.call("app.bsky.unspecced.getPopularFeedGenerators", { limit: 5 });
        let feeds = response.data.feeds.map(feed => {
            return {
                "name": feed.displayName,
                "description": feed.description,
                "likes": feed.likeCount
            }
        })
        res.json(feeds);
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}

async function rawXRPC(req: Request, res: Response, next: any) {
    try {
        const agent = getAgent();
        if (agent == null) {
            res.status(401).json("Unauthorized, login first");
            return;
        }
        let nsid = req.params.nsid.trim();
        let response = await agent.app._client.call(nsid, req.query || {});
        res.json(response.data);
    } catch (err) {
        res.status(500).json(`Something failed: ${err} `);
    }
}


export function addCommandViews(app: Express) {
    app.get("/profile", getProfile);
    app.get("/profile/followers", getFollowers);
    app.get("/posts", latestTimeline);
    app.get("/posts/me", myLastFivePosts);
    app.post("/posts", createTestPost);
    app.get("/feeds", topFeeds);
    app.get("/xrpc/:nsid", rawXRPC);
}
