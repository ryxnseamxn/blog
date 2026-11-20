# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Running everything

With the API repo checked out next to this one (`../friendsgiving-api`):

```bash
cp .env.example .env          # optional; every value has a local default
docker compose up --build
```

| Service | URL |
|---------|-----|
| App (Expo dev server, web) | http://localhost:8081 |
| API | http://localhost:5080 |
| Postgres | `localhost:5433`, user/password/db all `friendsgiving` |

The source is bind-mounted, so edits hot-reload. After changing `package.json`, rebuild and drop the old `node_modules` volume with `docker compose up --build -V`.

To use a physical phone with Expo Go, set `LAN_IP` and `EXPO_PUBLIC_API_BASE_URL=http://<LAN_IP>:5080` in `.env`.

## Deploying the web app (EAS Hosting)

The API runs on Railway (see `../friendsgiving-api`). The web app is hosted on EAS Hosting at `https://<slug>.expo.app`.

**Easiest:** run `./scripts/deploy.zsh`. It walks you through everything below and the Railway setup, checking each step and skipping what's already done. Re-run it any time.

Manual steps, if you'd rather:

One-time setup:

```bash
npm install --global eas-cli
eas login
eas init                                        # links this app to an Expo project (fills in projectId)
eas env:set --environment production --visibility plaintext \
  --name EXPO_PUBLIC_API_BASE_URL --value https://<your-api>.up.railway.app
eas env:set --environment production --visibility plaintext \
  --name EXPO_PUBLIC_APP_URL --value https://<slug>.expo.app
npm run deploy:web                              # first deploy; pick the subdomain when prompted
```

After that, `.eas/workflows/deploy-web.yml` redeploys on every push to `master` (connect the GitHub repo under the project's settings on expo.dev). `npm run deploy:web` deploys manually. `EXPO_PUBLIC_*` values are baked in at export time, so changing one needs a redeploy.

The app exports as a single-page app (`web.output: "single"`). After the first deploy, open a `/friendsgiving/<id>` link directly to confirm EAS Hosting serves deep links. If it 404s, switch `web.output` to `"static"`.

## Friendsgiving

Guests open `/friendsgiving/<gatheringId>` to claim dishes. Hosts manage gatherings from **Admin** in the drawer (`/admin`). If the API sets `Admin:ApiKey`, the admin screen asks for that key and remembers it on the device.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Feature flags

Routes are gated behind feature flags defined in `src/config/feature-flags.ts`.

- Flags are keyed 1:1 by screen route path (e.g., `/about`).
- Defaults to **off** in production; missing keys are treated as off.
- In development (`__DEV__`), every flag returns **true**, so you can work without toggling flags.
- When a route is disabled, it is hidden from navigation and redirects to `/`.

To flip a flag in production, just update the value and ship via EAS Update (no store rebuild required):

```bash
npx eas update --branch production
```

Run the flag/route 1:1 mapping check (also part of lint):

```bash
npm run check:flags
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
