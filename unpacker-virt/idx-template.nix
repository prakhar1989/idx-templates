{ pkgs, bundleId ? "", ... }: {
  packages = [
    pkgs.nodejs
    pkgs.nodePackages.ts-node
  ];
  bootstrap = ''
    ts-node  ${./unpacker.ts} ${./.} "$out" ${pkgs.lib.escapeShellArg bundleId}
  '';
}
