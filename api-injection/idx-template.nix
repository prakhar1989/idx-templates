{ pkgs, apikey ? "missingkey", ... }: {
  packages = [];
  bootstrap = ''
    mkdir -p "$WS_NAME"
    mkdir -p "$WS_NAME/.idx/"
    echo ${apikey} > "$WS_NAME/apikey.txt"
    chmod -R +w "$WS_NAME"
    mv "$WS_NAME" "$out"
  '';
}