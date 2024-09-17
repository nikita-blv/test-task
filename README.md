# test-task

### [Link to the App](https://test-task-jkjt.onrender.com)

#### Hello, that my test task, first of want to thank you for the ability to do that task, i did it with real enthusiasm and joy.

I am glad to say, that all required tasks was implemented.

Unfortunately, didn't have a time to  realize everything i thought would be able to do

How to run it.

1. Clone env files 
`cp ./apps/client/.env.example ./apps/client/.env.local && cp ./apps/server/.env.example ./apps/server/.env`
2. But to properly run it it's needed to set your mongo atlas db credential(transactions issue, described below).
3. `nvm use`
4. `corepack enable`
5. `pnpm install`
6. run
   * `pnpm dev` and go to the `http://localhost:5173` to the frontend
   * more "production like" run `pnpm start` and go to the `http://localhost:5173` to the frontend

The things i planned to do, but didn't have a time(for some of them i did some parts, but they were left not finished)
* Redis (for caching and storing sessions, currently they are stored in RAM)
* Refresh tokens mechanism (for caching and storing sessions)
* Online mechanism
* Stats by cases users
* Full working local environment(had some issues with mongo's transactions, even tried to solve it, but simplest solution was just use mongo from atlas)