/// <reference path="../../../../index.d.ts" />

class HumanSnipeMenuController implements IHumanSnipeMenuController {
    private config: IHumanSnipeMenuControllerConfig;

    private pokemonList: ISnipePokemonInfo[];
    private currentReverse: boolean;

    constructor(config: IHumanSnipeMenuControllerConfig) {
        this.config = config;
    }
    private updatePokemonListInner = (): void => {
        if (!this.pokemonList) {
            return;
        }
        this.config.snipeMenuElement.find(".pokemon").remove();
        const pokemons = this.pokemonList;
        for (let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i] as ISnipePokemonInfo;
            const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.Id];
            const expired =Math.round( (new Date(pokemon.ExpiredTime).valueOf() - (new Date()).valueOf()) / 1000);
            const className = pokemon.IsCatching?"walking-to": (pokemon.Setting.Priority == 0?"targeted": "");
           
            const html = app.templates.SnipePokemonItem({
                PokemonName: pokemonName,
                Distance: pokemon.Distance,
                Expired:expired,
                Estimated:pokemon.EstimatedTime,
                IsCatching :pokemon.IsCatching,
                Priority:pokemon.Setting.Priority,
                ClassName : className,
                UniqueId:pokemon.UniqueId,
                Id:pokemon.Id
            });
            const pokemonElement = $(html);
            pokemonElement.find('.snipe-him').click(this.onSetAsTarget)
            pokemonElement.find('.delete').click(this.onRemoveSnipe)

            this.config.snipeMenuElement.append(pokemonElement);
        }
    }
    private onSetAsTarget :any = (ev:any) =>{
         const uniqueId = $(ev.target).attr('data-uniqueId');
         this.config.requestSender.sendHumanSnipePokemonSnipeRequest(uniqueId);
    }
     private onRemoveSnipe :any = (ev:any) =>{
        const uniqueId = $(ev.target).attr("data-uniqueId");
        $(ev.target).closest(".pokemon").fadeOut(500);
        this.config.requestSender.sendHumanSnipePokemonRemoveRequest(uniqueId);
    }

    public pokemonListRequested = (request: IRequest): void => {
        //this.config.pokemonLoadingSpinner.show();
    }

    public updateSnipePokemonList = (pokemonList: IHumanWalkSnipeListEvent): void => {
        this.pokemonList = pokemonList.Pokemons;
        this.updatePokemonListInner();
    }
}
