/// <reference path="../../../../index.d.ts" />

interface IPokemonMenuController {
    pokemonListRequested(request: IRequest): void;
    updatePokemonList(pokemonList: IPokemonListEvent): void;
    updatePokemonAfterUpgraded (pkm: IUpgradeEvent ): void;
}