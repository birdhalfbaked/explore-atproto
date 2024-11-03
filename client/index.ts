import express from 'express';
import { addOauthViews } from './src/oauth';
import { addCommandViews } from './src/commands';


async function main() {
    const app = express();
    addOauthViews(app);
    addCommandViews(app);
    app.listen(8080);
}

main();
