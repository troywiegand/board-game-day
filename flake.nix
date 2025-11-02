{
  description = "shell convert flake";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        name = "board-game-day";

        buildInputs = with pkgs; [
          bun
        ];

        shellHook = ''
          export name="";
          export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib";
        '';
      };
    }
  );
}
