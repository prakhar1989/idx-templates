{ pkgs, bundleId ? "", ... }: {
  packages = [
    pkgs.nodejs
    pkgs.nodePackages.ts-node
  ];
  bootstrap = ''
    mkdir -p "$WS_NAME"/.idx
    cp ${./dev.nix} "$WS_NAME"/.idx/dev.nix && chmod +w "$WS_NAME"/.idx/dev.nix
    ts-node  ${./unpacker.ts} "$WS_NAME" ${pkgs.lib.escapeShellArg bundleId}
    mv "$WS_NAME" "$out"
  '';
}
