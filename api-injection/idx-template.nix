{ pkgs, apikey ? "missing-key", ... }: {
  packages = [
    pkgs.nodejs
  ];
  bootstrap = ''
    mkdir -p "$WS_NAME"
    npm create -y vite@latest "$WS_NAME" -- --template "preact-ts"
    mkdir -p "$WS_NAME/.idx/"
    chmod -R +w "$WS_NAME"
    mv "$WS_NAME" "$out"
  '';
}