# explore-atproto
Exploration of ATProto. Including SDK usage and PDS shenanigans

## How to use

### Pre-requisites

 - Docker engine on your machine
   - [get docker](https://docs.docker.com/get-started/get-docker/)

### Build the docker image

1. Open up a terminal that can run docker commands
2. Run: `docker build -t atproto-client .`

### Run the docker image
1. Run: `docker run -e APP__LOGIN_HANDLE=<your @name minus the @ symbol> -p 8080:8080 atproto-client`
   - Example: `docker run -e APP__LOGIN_HANDLE=birdhalfbaked.com -p 8080:8080 atproto-client`

### Login and explore!
1. go to the url `http://localhost:8080/login`
2. login to bluesky if prompted
3. when shown the permissions to authorize, click authorize
4. play around by calling the routes in the ## Routes section
   - Example: go to http://localhost:8080/profile to see your profile info

## Routes

### Profile and social info

- Get my profile details
  - GET http://localhost:8080/profile
- List who I follow
  - GET http://localhost:8080/followers

### Feeds and content
- Read my 5 latest posts
  - GET http://localhost:8080/myPosts
- Read my timeline's 5 latest posts
  - GET http://localhost:8080/posts
- Create a test post
  - POST http://localhost:8080/createTest

### Custom XRPC calls

- Top 5 globally popular feed generators
  - GET http://localhost:8080/feeds
- Call whatever NSID you want from the spec
  - GET http://localhost:8080/xrpc/:method
    - :method can be any NSID found in the lexicons at Bluesky's repo https://github.com/bluesky-social/atproto/tree/main/lexicons
        - Example: app.bsky.actor.getPreferences
    - params can be added in query param form
        - Example: http://localhost:8080/xrpc/some.lexicon.nsid?param1=test&param2=foo

### Modify!

This codebase can be modified. Want to add some fancier stuff? Go to the src/commands.ts file to add your own!

I can't guarantee I'll look at PRs a lot here, but I will try my best if my code absolutely is dog poo!
