{ pkgs, ... }: {
  bootstrap = ''
    cp -rf ${./app} "$out"
    chmod -R +w "$out"
    chmod +x "$out"/devserver.sh
  '';
}
