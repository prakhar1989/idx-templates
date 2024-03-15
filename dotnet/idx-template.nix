{ pkgs, ... }: {
  packages = [
    pkgs.dotnet-sdk_8
  ];
  bootstrap = ''
    export HOME=/home/user
    dotnet new blazor -o "$WS_NAME"
    mkdir -p "$WS_NAME/.idx/"
    cp -rf ${./.idx/dev.nix} "$WS_NAME/.idx/dev.nix"
    cp -rf ${./.idx/logo.png} "$WS_NAME/.idx/icon.png"
    mv "$WS_NAME" "$out"
  '';
}
