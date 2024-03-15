{ pkgs, ... }: {
  packages = [
    pkgs.dotnet-sdk_8
  ];
  bootstrap = ''
    dotnet new blazor -o .
    mkdir -p "$WS_NAME/.idx/"
    cp -rf ${./dev.nix} "$WS_NAME/.idx/dev.nix"
    cp -rf ${./icon.png} "$WS_NAME/.idx/icon.png"
  '';
}