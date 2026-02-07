11:13:39 PM: build-image version: 996f0ea96f97c0291387fbccd9b699238a7384e2 (noble-new-builds)
11:13:39 PM: buildbot version: 82ffec010ece33e26e6ae786dec2fca533ea1141
11:13:39 PM: Building with cache
11:13:39 PM: Starting to prepare the repo for build
11:13:40 PM: Preparing Git Reference refs/heads/master
11:13:41 PM: Custom build command detected. Proceeding with the specified command: 'npm run build'
11:13:41 PM: Starting to install dependencies
11:13:41 PM: mise ~/.config/mise/config.toml tools: python@3.14.3
11:13:41 PM: mise ~/.config/mise/config.toml tools: ruby@3.4.8
11:13:41 PM: mise ~/.config/mise/config.toml tools: go@1.25.6
11:13:42 PM: v22.22.0 is already installed.
11:13:42 PM: Now using node v22.22.0 (npm v10.9.4)
11:13:42 PM: Enabling Node.js Corepack
11:13:43 PM: No pnpm workspaces detected
11:13:43 PM: Installing npm packages using pnpm version 10.28.2
11:13:43 PM: Lockfile is up to date, resolution step is skipped
11:13:43 PM: Progress: resolved 1, reused 0, downloaded 0, added 0
11:13:43 PM: Packages: +790 -10
11:13:43 PM: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
11:13:44 PM: Progress: resolved 790, reused 23, downloaded 16, added 2
11:13:45 PM: Progress: resolved 790, reused 23, downloaded 188, added 102
11:13:46 PM: Progress: resolved 790, reused 23, downloaded 450, added 323
11:13:47 PM: Progress: resolved 790, reused 23, downloaded 740, added 645
11:13:48 PM: Progress: resolved 790, reused 23, downloaded 765, added 779, done
11:13:48 PM: .../node_modules/netlify-cli postinstall$ node ./scripts/postinstall.js
11:13:49 PM: .../node_modules/netlify-cli postinstall: ╭───────────────────────────────────── ⬥  ─────────────────────────────────────╮
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ Success! Netlify CLI has been installed! │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ You can now use Netlify CLI to develop, deploy, and manage your Netlify │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ projects. │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ 🚀 Now get building! │
11:13:49 PM: .../node_modules/netlify-cli postinstall: │ │
11:13:49 PM: .../node_modules/netlify-cli postinstall: ╰──────────────────────────────────────────────────────────────────────────────╯
11:13:49 PM: .../node_modules/netlify-cli postinstall: Next steps:
11:13:49 PM: .../node_modules/netlify-cli postinstall: netlify login Log in to your Netlify account
11:13:49 PM: .../node_modules/netlify-cli postinstall: netlify init Connect or create a Netlify project from the current directory
11:13:49 PM: .../node_modules/netlify-cli postinstall: netlify deploy Deploy the latest changes to your Netlify project
11:13:49 PM: .../node_modules/netlify-cli postinstall: netlify help Find out what else you can do 👀
11:13:49 PM: .../node_modules/netlify-cli postinstall: For more help with the CLI, visit https://developers.netlify.com/cli
11:13:49 PM: .../node_modules/netlify-cli postinstall: For help with Netlify, visit https://docs.netlify.com
11:13:49 PM: .../node_modules/netlify-cli postinstall: Done
11:13:49 PM: devDependencies:
11:13:49 PM: + @netlify/edge-functions 3.0.3
11:13:49 PM: + netlify-cli 23.15.1
11:13:49 PM: .../esbuild@0.27.2/node_modules/esbuild postinstall$ node install.js
11:13:49 PM: .../sharp@0.34.5/node_modules/sharp install$ node install/check.js || npm run build
11:13:49 PM: .../sharp@0.34.5/node_modules/sharp install: Done
11:13:49 PM: .../esbuild@0.27.2/node_modules/esbuild postinstall: Done
11:13:51 PM: Done in 8.2s using pnpm v10.28.2
11:13:51 PM: npm packages installed using pnpm
11:13:51 PM: Successfully installed dependencies
11:13:52 PM: Detected 1 framework(s)
11:13:52 PM: "qwik" at version "1.19.0"
11:13:52 PM: Starting build script
11:13:52 PM: Section completed: initializing
11:13:55 PM: ​
11:13:55 PM: Netlify Build  
11:13:55 PM: ────────────────────────────────────────────────────────────────
11:13:55 PM: ​
11:13:55 PM: ❯ Version
11:13:55 PM: @netlify/build 35.6.2
11:13:55 PM: ​
11:13:55 PM: ❯ Flags
11:13:55 PM: accountId: 647b7f32af2e9e287a6f1f19
11:13:55 PM: baseRelDir: true
11:13:55 PM: buildId: 6987b91249dbe100085fca07
11:13:55 PM: deployId: 6987b91249dbe100085fca09
11:13:55 PM: ​
11:13:55 PM: ❯ Current directory
11:13:55 PM: /opt/build/repo
11:13:55 PM: ​
11:13:55 PM: ❯ Config file
11:13:55 PM: /opt/build/repo/netlify.toml
11:13:55 PM: ​
11:13:55 PM: ❯ Context
11:13:55 PM: production
11:13:55 PM: ​
11:13:55 PM: build.command from netlify.toml  
11:13:55 PM: ────────────────────────────────────────────────────────────────
11:13:55 PM: ​
11:13:55 PM: $ npm run build
11:13:55 PM: > build
11:13:55 PM: > qwik build
11:13:55 PM:
11:13:55 PM: ............
11:13:55 PM: .::: :--------:.
11:13:55 PM: .:::: .:-------:.
11:13:55 PM: .:::::. .:-------.
11:13:55 PM: ::::::. .:------.
11:13:55 PM: ::::::. :-----:
11:13:55 PM: ::::::. .:-----.
11:13:55 PM: :::::::. .-----.
11:13:55 PM: ::::::::.. ---:.
11:13:55 PM: .:::::::::. :-:.
11:13:55 PM: ..::::::::::::
11:13:55 PM: ...::::
11:13:55 PM:  
11:13:55 PM: npm run build.types
11:13:55 PM: npm run build.client
11:13:55 PM: npm run build.server
11:13:55 PM: npm run lint
11:13:55 PM: > build.types
11:13:55 PM: > tsc --incremental --noEmit
11:13:55 PM: > build.client
11:13:55 PM: > vite build
11:13:56 PM: using deprecated parameters for the initialization function; pass a single object instead
11:13:56 PM: vite v7.3.1 building client environment for production...
11:13:56 PM: transforming...
11:13:59 PM: ✓ 173 modules transformed.
11:13:59 PM: rendering chunks...
11:13:59 PM: computing gzip size...
11:13:59 PM: dist/assets/B9SgTb6D-bundle-graph.json 3.61 kB │ gzip: 1.93 kB
11:13:59 PM: dist/q-manifest.json 84.20 kB │ gzip: 10.91 kB
11:13:59 PM: dist/assets/D7bk372F-style.css 28.49 kB │ gzip: 5.59 kB
11:13:59 PM: dist/build/q-CcXpwPLN.js 0.08 kB │ gzip: 0.10 kB
11:13:59 PM: dist/build/q-Ip7IH1LW.js 0.09 kB │ gzip: 0.11 kB
11:13:59 PM: dist/build/q-CRXrqJgR.js 0.15 kB │ gzip: 0.13 kB
11:13:59 PM: dist/build/q-Ho5qVKUp.js 0.17 kB │ gzip: 0.15 kB
11:13:59 PM: dist/build/q-C8F0Jo38.js 0.19 kB │ gzip: 0.17 kB
11:13:59 PM: dist/build/q-BYCBGHhc.js 0.19 kB │ gzip: 0.16 kB
11:13:59 PM: dist/build/q-CkboPk1W.js 0.24 kB │ gzip: 0.19 kB
11:13:59 PM: dist/build/q-D8883NtI.js 0.25 kB │ gzip: 0.21 kB
11:13:59 PM: dist/build/q-D8Wg4Qbu.js 0.27 kB │ gzip: 0.24 kB
11:13:59 PM: dist/build/q-CM6o97OV.js 0.31 kB │ gzip: 0.26 kB
11:13:59 PM: dist/build/q-B9UafE7A.js 0.34 kB │ gzip: 0.26 kB
11:13:59 PM: dist/build/q-COL-\_Gqg.js 0.34 kB │ gzip: 0.22 kB
11:13:59 PM: dist/build/q-BmCKJJzB.js 0.41 kB │ gzip: 0.29 kB
11:13:59 PM: dist/build/q-CiN--BRd.js 0.48 kB │ gzip: 0.36 kB
11:13:59 PM: dist/build/q-D8uU_Pln.js 0.54 kB │ gzip: 0.39 kB
11:13:59 PM: dist/build/q-DDnR32BZ.js 0.55 kB │ gzip: 0.37 kB
11:13:59 PM: dist/build/q-Btngk0HH.js 0.80 kB │ gzip: 0.48 kB
11:13:59 PM: dist/build/q-CJBSr0qB.js 0.80 kB │ gzip: 0.47 kB
11:13:59 PM: dist/build/q-kHa-wIcG.js 0.80 kB │ gzip: 0.41 kB
11:13:59 PM: dist/build/q-BmGbFxEk.js 0.81 kB │ gzip: 0.48 kB
11:13:59 PM: dist/build/q-CrrQfOGy.js 0.93 kB │ gzip: 0.54 kB
11:13:59 PM: dist/build/q-DcGGL3Nh.js 0.93 kB │ gzip: 0.50 kB
11:13:59 PM: dist/build/q-CnsP2Ut5.js 0.97 kB │ gzip: 0.58 kB
11:13:59 PM: dist/build/q-CigAe1nb.js 1.08 kB │ gzip: 0.64 kB
11:13:59 PM: dist/build/q-CS3KWthy.js 1.24 kB │ gzip: 0.65 kB
11:13:59 PM: dist/build/q-DPDJUJE0.js 1.28 kB │ gzip: 0.71 kB
11:13:59 PM: dist/build/q-DZp8X-3J.js 1.29 kB │ gzip: 0.68 kB
11:13:59 PM: dist/build/q-Ewq2mD84.js 1.39 kB │ gzip: 0.75 kB
11:13:59 PM: dist/build/q-hWC-Ah49.js 1.40 kB │ gzip: 0.73 kB
11:13:59 PM: dist/build/q-D-HkajlG.js 1.58 kB │ gzip: 0.80 kB
11:13:59 PM: dist/build/q-BLg4Dkjb.js 1.61 kB │ gzip: 0.81 kB
11:13:59 PM: dist/build/q-CXtwTLZG.js 2.12 kB │ gzip: 1.01 kB
11:13:59 PM: dist/build/q-CumUlYPS.js 2.15 kB │ gzip: 0.93 kB
11:13:59 PM: dist/build/q-C2Us_U0J.js 2.24 kB │ gzip: 1.09 kB
11:13:59 PM: dist/build/q-BLzZyk0R.js 2.78 kB │ gzip: 1.42 kB
11:13:59 PM: dist/build/q-CFHMYrCZ.js 2.79 kB │ gzip: 1.08 kB
11:13:59 PM: dist/build/q-DwQDFZdY.js 3.08 kB │ gzip: 1.08 kB
11:13:59 PM: dist/build/q-naDMFAHy.js 3.10 kB │ gzip: 1.68 kB
11:13:59 PM: dist/build/q-D8MxqmVW.js 3.37 kB │ gzip: 1.69 kB
11:13:59 PM: dist/build/q-BKZ00VYc.js 3.73 kB │ gzip: 2.00 kB
11:13:59 PM: dist/build/q-DgTid6mQ.js 3.74 kB │ gzip: 1.49 kB
11:13:59 PM: dist/build/q-DJVhq50u.js 3.91 kB │ gzip: 1.42 kB
11:13:59 PM: dist/build/q-OWaVarDf.js 4.06 kB │ gzip: 1.41 kB
11:13:59 PM: dist/build/q-DnZmWZmj.js 4.45 kB │ gzip: 2.03 kB
11:13:59 PM: dist/build/q-DyJMdZYy.js 5.98 kB │ gzip: 2.06 kB
11:13:59 PM: dist/build/q-CWZYNiA3.js 6.37 kB │ gzip: 2.15 kB
11:13:59 PM: dist/build/q-COS71rz0.js 7.13 kB │ gzip: 2.90 kB
11:13:59 PM: dist/build/q-BuXOwFSV.js 7.54 kB │ gzip: 2.47 kB
11:13:59 PM: dist/build/q-Dg7Z9xfX.js 9.65 kB │ gzip: 2.91 kB
11:13:59 PM: dist/build/q-DOHmcqJS.js 10.00 kB │ gzip: 2.98 kB
11:13:59 PM: dist/build/q-B1kP6O7p.js 10.36 kB │ gzip: 3.06 kB
11:13:59 PM: dist/build/q-eYnmPBpH.js 58.71 kB │ gzip: 23.93 kB
11:13:59 PM: ✓ built in 2.89s
11:13:59 PM: ✨ [vite-plugin-image-optimizer] - optimized images successfully:
11:13:59 PM: dist/favicon.svg 0% skipped original: 0.92 kB <= optimized: 0.92 kB
11:13:59 PM: ✓ Built client modules
11:13:59 PM: > lint
11:13:59 PM: > eslint "src/\*_/_.ts*"
11:13:59 PM: > build.server
11:13:59 PM: > qwik check-client src dist && vite build -c adapters/netlify-edge/vite.config.ts
11:13:59 PM:
11:13:59 PM: ............
11:13:59 PM: .::: :--------:.
11:13:59 PM: .:::: .:-------:.
11:13:59 PM: .:::::. .:-------.
11:13:59 PM: ::::::. .:------.
11:13:59 PM: ::::::. :-----:
11:13:59 PM: ::::::. .:-----.
11:13:59 PM: :::::::. .-----.
11:13:59 PM: ::::::::.. ---:.
11:13:59 PM: .:::::::::. :-:.
11:13:59 PM: ..::::::::::::
11:13:59 PM: ...::::
11:13:59 PM:  
11:14:00 PM: using deprecated parameters for the initialization function; pass a single object instead
11:14:00 PM: vite v7.3.1 building ssr environment for production...
11:14:00 PM: transforming...
11:14:01 PM: ✓ 61 modules transformed.
11:14:02 PM: rendering chunks...
11:14:02 PM: .netlify/edge-functions/entry.netlify-edge/entry.ssr.js 0.08 kB
11:14:02 PM: .netlify/edge-functions/entry.netlify-edge/entry.netlify-edge.js 21.59 kB
11:14:02 PM: .netlify/edge-functions/entry.netlify-edge/q-gxw7nP2f.js 25.13 kB
11:14:02 PM: .netlify/edge-functions/entry.netlify-edge/@qwik-city-plan.js 80.68 kB
11:14:02 PM: .netlify/edge-functions/entry.netlify-edge/q-CvXxSGeN.js 82.39 kB
11:14:02 PM: ✓ built in 1.69s
11:14:02 PM: Starting Qwik City SSG...
11:14:02 PM: SSG results
11:14:02 PM: - Duration: 3.3 ms
11:14:02 PM: [plugin vite-plugin-qwik-city-netlify-edge]
11:14:02 PM: ==============================================
11:14:02 PM: Note: Make sure that you are serving the built files with proper cache headers.
11:14:02 PM: See https://qwik.dev/docs/deployments/#cache-headers for more information.
11:14:02 PM: ==============================================
11:14:03 PM:
11:14:03 PM: /opt/build/repo/src/components/home/Banner.tsx
11:14:03 PM: 7:9 warning Local images can be optimized by importing using ESM, like this:
11:14:03 PM:
11:14:03 PM: import ImgBanner from '~/media/images/banner/banner.jpg?jsx';
11:14:03 PM: <ImgBanner />
11:14:03 PM:
11:14:03 PM: See https://qwik.dev/docs/integrations/image-optimization/#responsive-images qwik/jsx-img
11:14:03 PM:
11:14:03 PM: /opt/build/repo/src/components/product/ImageGallery.tsx
11:14:03 PM: 78:3 warning useVisibleTask$() runs eagerly and blocks the main thread, preventing user interaction until the task is finished. Consider using useTask$(), useOn(), useOnDocument(), or useOnWindow() instead. If you have to use a useVisibleTask$(), you can disable the warning with a '// eslint-disable-next-line qwik/no-use-visible-task' comment qwik/no-use-visible-task
11:14:03 PM:
11:14:03 PM: ✖ 2 problems (0 errors, 2 warnings)
11:14:03 PM:
11:14:03 PM: ✓ Built server (ssr) modules
11:14:03 PM: ✓ Type checked
11:14:03 PM: ✓ Lint checked
11:14:04 PM: Failed during stage 'building site': Build script returned non-zero exit code: 1 (https://ntl.fyi/exit-code-1)
11:14:04 PM: ​
11:14:04 PM: (build.command completed in 8.9s)
11:14:04 PM: ​
11:14:04 PM: Edge Functions bundling  
11:14:04 PM: ────────────────────────────────────────────────────────────────
11:14:04 PM: ​
11:14:04 PM: Packaging Edge Functions from .netlify/edge-functions directory:
11:14:04 PM: - entry.netlify-edge
11:14:04 PM: node:internal/process/promises:394
11:14:04 PM: triggerUncaughtException(err, true /* fromPromise \*/);
11:14:04 PM: ^
11:14:04 PM: [Error: ENOENT: no such file or directory, stat '/tmp/tmp-2137-i9jzmprv3i4m/qwik-city-not-found-paths.js'] {
11:14:04 PM: errno: -2,
11:14:04 PM: code: 'ENOENT',
11:14:04 PM: syscall: 'stat',
11:14:04 PM: path: '/tmp/tmp-2137-i9jzmprv3i4m/qwik-city-not-found-paths.js'
11:14:04 PM: }
11:14:04 PM: Node.js v22.22.0
11:14:04 PM: Build was terminated: Build script returned non-zero exit code: 1
11:14:04 PM: Failing build: Failed to build site
11:14:05 PM: Finished processing build request in 25.119s
