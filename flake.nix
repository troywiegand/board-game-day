{
  description = "shell convert flake";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        name = "board-game-day";

        buildInputs = with pkgs; [
          nodejs
        ];

        shellHook = ''
          export name="";
        '';
      };
    }
  );
}
