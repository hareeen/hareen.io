{
  description = "hareen.io — Astro site built with Bun";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    playwright = {
      url = "github:halfwhey/nix-playwright-nightly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{
      flake-parts,
      playwright,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      imports = [
        inputs.treefmt-nix.flakeModule
        inputs.git-hooks.flakeModule
      ];

      perSystem =
        { config, pkgs, ... }:
        let
          inherit (pkgs) lib;
          packageJson = lib.importJSON ./package.json;
          projectPlaywrightVersion = packageJson.dependencies.playwright or null;
          playwrightVersion =
            assert lib.assertMsg (
              projectPlaywrightVersion != null
              && builtins.match "[0-9]+\\.[0-9]+\\.[0-9]+" projectPlaywrightVersion != null
            ) "package.json must pin playwright to an exact version";
            projectPlaywrightVersion;
          playwrightPinPath = playwright.outPath + "/pins/node/${playwrightVersion}.json";
          playwrightPin =
            assert lib.assertMsg (builtins.pathExists playwrightPinPath)
              "Playwright ${playwrightVersion} browsers are unavailable; update the playwright flake input";
            lib.importJSON playwrightPinPath;

          # Use the input's browser builder directly so package.json remains the version oracle without fetching unused browsers.
          playwrightBrowsers = (pkgs.callPackage (playwright.outPath + "/lib/mkBrowsers.nix") { }) {
            chromium-headless-shell = playwrightPin.browsers."chromium-headless-shell";
          };
        in
        {
          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
            # Not `programs.biome`: that module formats against a generated config via `--config-path`, which would bypass the repo's biome.json.
            settings.formatter.biome = {
              command = lib.getExe pkgs.biome;
              options = [
                "format"
                "--write"
                "--no-errors-on-unmatched"
              ];
              includes = [
                "*.astro"
                "*.css"
                "*.js"
                "*.json"
                "*.jsx"
                "*.mjs"
                "*.ts"
                "*.tsx"
              ];
            };
          };

          pre-commit.settings.hooks = {
            # pre-commit
            treefmt = {
              enable = true;
              package = config.treefmt.build.wrapper;
            };

            # pre-push
            biome-lint = {
              enable = true;
              name = "biome lint";
              entry = "${lib.getExe pkgs.biome} lint --error-on-warnings";
              pass_filenames = false;
              stages = [ "pre-push" ];
            };
            actionlint = {
              enable = true;
              stages = [ "pre-push" ];
            };
            statix = {
              enable = true;
              stages = [ "pre-push" ];
            };
            deadnix = {
              enable = true;
              stages = [ "pre-push" ];
            };
          };

          devShells.default = pkgs.mkShell {
            inputsFrom = [ config.pre-commit.devShell ];
            packages = [
              pkgs.actionlint
              pkgs.biome
              pkgs.bun
              pkgs.nodejs_24
              config.treefmt.build.wrapper
            ];

            env = {
              PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
              PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
              PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
            };

            shellHook = ''
              export PATH="$PWD/node_modules/.bin:$PATH"
            '';
          };
        };
    };
}
