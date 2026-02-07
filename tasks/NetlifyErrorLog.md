11:09:05 PM: build-image version: 996f0ea96f97c0291387fbccd9b699238a7384e2 (noble-new-builds)
11:09:05 PM: buildbot version: 82ffec010ece33e26e6ae786dec2fca533ea1141
11:09:06 PM: Building with cache
11:09:06 PM: Starting to prepare the repo for build
11:09:06 PM: Preparing Git Reference refs/heads/master
11:09:07 PM: Custom build command detected. Proceeding with the specified command: 'npm run build'
11:09:07 PM: Starting to install dependencies
11:09:07 PM: mise ~/.config/mise/config.toml tools: python@3.14.3
11:09:07 PM: mise ~/.config/mise/config.toml tools: ruby@3.4.8
11:09:07 PM: mise ~/.config/mise/config.toml tools: go@1.25.6
11:09:08 PM: v22.22.0 is already installed.
11:09:08 PM: Now using node v22.22.0 (npm v10.9.4)
11:09:08 PM: Enabling Node.js Corepack
11:09:08 PM: No pnpm workspaces detected
11:09:09 PM: Failed during stage 'Install dependencies': dependency_installation script returned non-zero exit code: 1
11:09:09 PM: Installing npm packages using pnpm version 10.28.2
11:09:09 PM:  ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
11:09:09 PM: Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
11:09:09 PM: Failure reason:
11:09:09 PM: specifiers in the lockfile don't match specifiers in package.json:

- 2 dependencies are mismatched:
  11:09:09 PM: - @netlify/edge-functions (lockfile: ^2.0.0, manifest: ^3.0.0)
  11:09:09 PM: - netlify-cli (lockfile: ^15.0.0, manifest: ^23.0.0)
  11:09:09 PM: Error during pnpm install
  11:09:09 PM: Failing build: Failed to install dependencies
