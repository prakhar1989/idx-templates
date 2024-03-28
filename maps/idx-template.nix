{pkgs, ...}: {
    bootstrap = ''
      cp -rf ${./.}/java "$WS_NAME"
      chmod -R +w "$WS_NAME"
      mv "$WS_NAME" "$out"
    '';
}
