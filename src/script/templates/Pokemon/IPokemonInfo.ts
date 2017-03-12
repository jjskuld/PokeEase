/// <reference path="../../index.d.ts" />

interface IPokemonInfo extends IPokemonListEntry{
    Name? : string;
    Move1Name? : string;
    Move2Name? : string;
    CreationDateTime?: string;
    PokemonTypes? : string[]
}