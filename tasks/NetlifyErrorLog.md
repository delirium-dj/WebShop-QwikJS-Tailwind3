10:39:43 PM: build-image version: 996f0ea96f97c0291387fbccd9b699238a7384e2 (noble-new-builds)
10:39:43 PM: buildbot version: 82ffec010ece33e26e6ae786dec2fca533ea1141
10:39:43 PM: Building with cache
10:39:43 PM: Starting to prepare the repo for build
10:39:43 PM: Preparing Git Reference refs/heads/master
10:39:44 PM: Custom build command detected. Proceeding with the specified command: 'npm run build'
10:39:44 PM: Starting to install dependencies
10:39:44 PM: mise ~/.config/mise/config.toml tools: python@3.14.3
10:39:44 PM: mise ~/.config/mise/config.toml tools: ruby@3.4.8
10:39:44 PM: mise ~/.config/mise/config.toml tools: go@1.25.6
10:39:45 PM: v22.22.0 is already installed.
10:39:45 PM: Now using node v22.22.0 (npm v10.9.4)
10:39:45 PM: Enabling Node.js Corepack
10:39:46 PM: No pnpm workspaces detected
10:39:46 PM: Installing npm packages using pnpm version 10.28.2
10:39:46 PM: Lockfile is up to date, resolution step is skipped
10:39:46 PM: Progress: resolved 1, reused 0, downloaded 0, added 0
10:39:46 PM: Packages: +986 -10
10:39:46 PM: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
10:39:47 PM: Progress: resolved 986, reused 21, downloaded 20, added 3
10:39:48 PM: Progress: resolved 986, reused 21, downloaded 222, added 159
10:39:49 PM: Progress: resolved 986, reused 21, downloaded 589, added 506
10:39:50 PM: Progress: resolved 986, reused 21, downloaded 965, added 958
10:39:50 PM: Progress: resolved 986, reused 21, downloaded 965, added 975, done
10:39:51 PM: devDependencies:
10:39:51 PM: + @netlify/edge-functions 2.19.0
10:39:51 PM: + netlify-cli 15.11.0
10:39:51 PM: ╭ Warning ─────────────────────────────────────────────────────────────────────╮
10:39:51 PM: │ │
10:39:51 PM: │ Ignored build scripts: @netlify/esbuild@0.14.39, @parcel/watcher@2.5.6, │
10:39:51 PM: │ esbuild@0.25.4, esbuild@0.27.2, less@4.5.1, netlify-cli@15.11.0, │
10:39:51 PM: │ protobufjs@7.5.4, sharp@0.34.5, unix-dgram@2.0.7. │
10:39:51 PM: │ Run "pnpm approve-builds" to pick which dependencies should be allowed │
10:39:51 PM: │ to run scripts. │
10:39:51 PM: │ │
10:39:51 PM: ╰──────────────────────────────────────────────────────────────────────────────╯
10:39:51 PM: Done in 5.2s using pnpm v10.28.2
10:39:51 PM: npm packages installed using pnpm
10:39:51 PM: Successfully installed dependencies
10:39:52 PM: Detected 1 framework(s)
10:39:52 PM: "qwik" at version "1.19.0"
10:39:52 PM: Starting build script
10:39:53 PM: Section completed: initializing
10:39:55 PM: ​
10:39:55 PM: Netlify Build  
10:39:55 PM: ────────────────────────────────────────────────────────────────
10:39:55 PM: ​
10:39:55 PM: ❯ Version
10:39:55 PM: @netlify/build 35.6.2
10:39:55 PM: ​
10:39:55 PM: ❯ Flags
10:39:55 PM: accountId: 647b7f32af2e9e287a6f1f19
10:39:55 PM: baseRelDir: true
10:39:55 PM: buildId: 6987b11eca6988000816dc70
10:39:55 PM: deployId: 6987b11eca6988000816dc72
10:39:55 PM: ​
10:39:55 PM: ❯ Current directory
10:39:55 PM: /opt/build/repo
10:39:55 PM: ​
10:39:55 PM: ❯ Config file
10:39:55 PM: /opt/build/repo/netlify.toml
10:39:55 PM: ​
10:39:55 PM: ❯ Context
10:39:55 PM: production
10:39:55 PM: ​
10:39:55 PM: build.command from netlify.toml  
10:39:55 PM: ────────────────────────────────────────────────────────────────
10:39:55 PM: ​
10:39:55 PM: $ npm run build
10:39:55 PM: > build
10:39:55 PM: > qwik build
10:39:55 PM:
10:39:55 PM: ............
10:39:55 PM: .::: :--------:.
10:39:55 PM: .:::: .:-------:.
10:39:55 PM: .:::::. .:-------.
10:39:55 PM: ::::::. .:------.
10:39:55 PM: ::::::. :-----:
10:39:55 PM: ::::::. .:-----.
10:39:55 PM: :::::::. .-----.
10:39:55 PM: ::::::::.. ---:.
10:39:55 PM: .:::::::::. :-:.
10:39:55 PM: ..::::::::::::
10:39:55 PM: ...::::
10:39:55 PM:  
10:39:55 PM: npm run build.types
10:39:55 PM: npm run build.client
10:39:55 PM: npm run build.server
10:39:55 PM: npm run lint
10:39:55 PM: > build.types
10:39:55 PM: > tsc --incremental --noEmit
10:39:55 PM: > build.client
10:39:55 PM: > vite build
10:39:56 PM: using deprecated parameters for the initialization function; pass a single object instead
10:39:57 PM: vite v7.3.1 building client environment for production...
10:39:57 PM: transforming...
10:39:59 PM: ✓ 138 modules transformed.
10:39:59 PM: rendering chunks...
10:39:59 PM: computing gzip size...
10:39:59 PM: dist/assets/CnqkvS5O-bundle-graph.json 2.82 kB │ gzip: 1.53 kB
10:39:59 PM: dist/q-manifest.json 66.79 kB │ gzip: 8.51 kB
10:39:59 PM: dist/assets/CaFhZ1DE-style.css 26.33 kB │ gzip: 5.25 kB
10:39:59 PM: dist/build/q-Ip7IH1LW.js 0.09 kB │ gzip: 0.11 kB
10:39:59 PM: dist/build/q-CLPR0uPy.js 0.15 kB │ gzip: 0.13 kB
10:39:59 PM: dist/build/q-DL3aj9Xi.js 0.17 kB │ gzip: 0.15 kB
10:39:59 PM: dist/build/q-0X0peFO1.js 0.19 kB │ gzip: 0.16 kB
10:39:59 PM: dist/build/q-DpBi9*2*.js 0.24 kB │ gzip: 0.19 kB
10:39:59 PM: dist/build/q-BrhFDNiQ.js 0.25 kB │ gzip: 0.21 kB
10:39:59 PM: dist/build/q-q6ItbY0O.js 0.27 kB │ gzip: 0.24 kB
10:39:59 PM: dist/build/q-B9xEexWb.js 0.31 kB │ gzip: 0.26 kB
10:39:59 PM: dist/build/q-zqFeXgQc.js 0.34 kB │ gzip: 0.26 kB
10:39:59 PM: dist/build/q-BqU8ZhUF.js 0.48 kB │ gzip: 0.36 kB
10:39:59 PM: dist/build/q-DCMtTeuu.js 0.54 kB │ gzip: 0.39 kB
10:39:59 PM: dist/build/q-Cp4xY6xU.js 0.55 kB │ gzip: 0.37 kB
10:39:59 PM: dist/build/q-DTVhIqM\_.js 0.61 kB │ gzip: 0.42 kB
10:39:59 PM: dist/build/q-QtzK4u1T.js 0.80 kB │ gzip: 0.48 kB
10:39:59 PM: dist/build/q-BkOfy_S9.js 0.80 kB │ gzip: 0.48 kB
10:39:59 PM: dist/build/q-CkmAAXdv.js 0.80 kB │ gzip: 0.41 kB
10:39:59 PM: dist/build/q-DoH2bb0s.js 0.81 kB │ gzip: 0.48 kB
10:39:59 PM: dist/build/q-Cv10lo5u.js 0.93 kB │ gzip: 0.54 kB
10:39:59 PM: dist/build/q-NbIiw9A7.js 0.93 kB │ gzip: 0.50 kB
10:39:59 PM: dist/build/q-Dfx41a5N.js 0.97 kB │ gzip: 0.58 kB
10:39:59 PM: dist/build/q-BQuOeLCt.js 1.25 kB │ gzip: 0.66 kB
10:39:59 PM: dist/build/q-B4--TuCZ.js 1.28 kB │ gzip: 0.71 kB
10:39:59 PM: dist/build/q-Cu6ya5Sl.js 1.29 kB │ gzip: 0.68 kB
10:39:59 PM: dist/build/q-QhhslwEJ.js 1.39 kB │ gzip: 0.75 kB
10:39:59 PM: dist/build/q-BWlbf2eG.js 1.40 kB │ gzip: 0.74 kB
10:39:59 PM: dist/build/q-HYQmZV9q.js 1.48 kB │ gzip: 0.76 kB
10:39:59 PM: dist/build/q-CGmylQi1.js 1.61 kB │ gzip: 0.82 kB
10:39:59 PM: dist/build/q-C3SFAe4w.js 2.12 kB │ gzip: 1.01 kB
10:39:59 PM: dist/build/q-DHkLsnlT.js 2.15 kB │ gzip: 0.93 kB
10:39:59 PM: dist/build/q-C2Us_U0J.js 2.24 kB │ gzip: 1.09 kB
10:39:59 PM: dist/build/q-DjQ0XEAX.js 2.30 kB │ gzip: 1.11 kB
10:39:59 PM: dist/build/q-BootxLi4.js 2.56 kB │ gzip: 1.13 kB
10:39:59 PM: dist/build/q-DDFobEYG.js 2.79 kB │ gzip: 1.08 kB
10:39:59 PM: dist/build/q-C0E3uokI.js 3.08 kB │ gzip: 1.08 kB
10:39:59 PM: dist/build/q-naDMFAHy.js 3.10 kB │ gzip: 1.68 kB
10:39:59 PM: dist/build/q-DC6B39GB.js 3.34 kB │ gzip: 1.68 kB
10:39:59 PM: dist/build/q-BKZ00VYc.js 3.73 kB │ gzip: 2.00 kB
10:39:59 PM: dist/build/q-CRbOz5bh.js 3.84 kB │ gzip: 1.56 kB
10:39:59 PM: dist/build/q-CDcen4M2.js 3.91 kB │ gzip: 1.42 kB
10:39:59 PM: dist/build/q-DoHhnB78.js 4.06 kB │ gzip: 1.41 kB
10:39:59 PM: dist/build/q-C3wjedHl.js 6.37 kB │ gzip: 2.15 kB
10:39:59 PM: dist/build/q-NqK9DT_i.js 7.00 kB │ gzip: 2.87 kB
10:39:59 PM: dist/build/q-BUoZXvKk.js 7.54 kB │ gzip: 2.47 kB
10:39:59 PM: dist/build/q-DR_Pca-X.js 8.75 kB │ gzip: 2.48 kB
10:39:59 PM: dist/build/q-rGtVLuVM.js 58.71 kB │ gzip: 23.93 kB
10:39:59 PM: ✓ built in 2.46s
10:39:59 PM: ✨ [vite-plugin-image-optimizer] - optimized images successfully:
10:39:59 PM: dist/favicon.svg 0% skipped original: 0.92 kB <= optimized: 0.92 kB
10:39:59 PM: ✓ Built client modules
10:39:59 PM: > lint
10:39:59 PM: > eslint "src/\*_/_.ts*"
10:40:00 PM: > build.server
10:40:00 PM: > qwik check-client src dist && vite build -c adapters/netlify-edge/vite.config.ts
10:40:00 PM:
10:40:00 PM: ............
10:40:00 PM: .::: :--------:.
10:40:00 PM: .:::: .:-------:.
10:40:00 PM: .:::::. .:-------.
10:40:00 PM: ::::::. .:------.
10:40:00 PM: ::::::. :-----:
10:40:00 PM: ::::::. .:-----.
10:40:00 PM: :::::::. .-----.
10:40:00 PM: ::::::::.. ---:.
10:40:00 PM: .:::::::::. :-:.
10:40:00 PM: ..::::::::::::
10:40:00 PM: ...::::
10:40:00 PM:  
10:40:00 PM: using deprecated parameters for the initialization function; pass a single object instead
10:40:00 PM: vite v7.3.1 building ssr environment for production...
10:40:00 PM: transforming...
10:40:02 PM: ✓ 54 modules transformed.
10:40:02 PM: rendering chunks...
10:40:02 PM: .netlify/edge-functions/entry.netlify-edge/entry.ssr.js 0.08 kB
10:40:02 PM: .netlify/edge-functions/entry.netlify-edge/entry.netlify-edge.js 21.59 kB
10:40:02 PM: .netlify/edge-functions/entry.netlify-edge/q-1UBUP_pG.js 24.29 kB
10:40:02 PM: .netlify/edge-functions/entry.netlify-edge/@qwik-city-plan.js 55.12 kB
10:40:02 PM: .netlify/edge-functions/entry.netlify-edge/q-CvXxSGeN.js 82.39 kB
10:40:02 PM: ✓ built in 1.83s
10:40:02 PM: Starting Qwik City SSG...
10:40:02 PM: SSG results
10:40:02 PM: - Duration: 11.0 ms
10:40:03 PM: [plugin vite-plugin-qwik-city-netlify-edge]
10:40:03 PM: ==============================================
10:40:03 PM: Note: Make sure that you are serving the built files with proper cache headers.
10:40:03 PM: See https://qwik.dev/docs/deployments/#cache-headers for more information.
10:40:03 PM: ==============================================
10:40:04 PM:
10:40:04 PM: /opt/build/repo/src/components/home/Banner.tsx
10:40:04 PM: 7:9 warning Local images can be optimized by importing using ESM, like this:
10:40:04 PM:
10:40:04 PM: import ImgBanner from '~/media/images/banner/banner.jpg?jsx';
10:40:04 PM: <ImgBanner />
10:40:04 PM:
10:40:04 PM: See https://qwik.dev/docs/integrations/image-optimization/#responsive-images qwik/jsx-img
10:40:04 PM:
10:40:04 PM: ✖ 1 problem (0 errors, 1 warning)
10:40:04 PM:
10:40:04 PM: ✓ Built server (ssr) modules
10:40:04 PM: ✓ Type checked
10:40:04 PM: ✓ Lint checked
10:40:04 PM: ​
10:40:04 PM: (build.command completed in 9.5s)
10:40:04 PM: ​
10:40:04 PM: Edge Functions bundling  
10:40:04 PM: ────────────────────────────────────────────────────────────────
10:40:04 PM: ​
10:40:04 PM: Packaging Edge Functions from .netlify/edge-functions directory:
10:40:04 PM: - entry.netlify-edge
10:40:05 PM: Failed during stage 'building site': Build script returned non-zero exit code: 1 (https://ntl.fyi/exit-code-1)
10:40:05 PM: node:internal/process/promises:394
10:40:05 PM: triggerUncaughtException(err, true /* fromPromise \*/);
10:40:05 PM: ^
10:40:05 PM: [Error: ENOENT: no such file or directory, stat '/tmp/tmp-2093-NJEx4bi0sFXO/qwik-city-not-found-paths.js'] {
10:40:05 PM: errno: -2,
10:40:05 PM: code: 'ENOENT',
10:40:05 PM: syscall: 'stat',
10:40:05 PM: path: '/tmp/tmp-2093-NJEx4bi0sFXO/qwik-city-not-found-paths.js'
10:40:05 PM: }
10:40:05 PM: Node.js v22.22.0
10:40:05 PM: Build was terminated: Build script returned non-zero exit code: 1
10:40:05 PM: Failing build: Failed to build site
10:40:06 PM: Finished processing build request in 22.684s
