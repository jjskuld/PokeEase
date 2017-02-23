/// <reference path="../../../../index.d.ts" />

class PokemonMenuController implements IPokemonMenuController {
    private config: IPokemonMenuControllerConfig;

    private pokemonList: IPokemonListEvent;
    private currentPokemon: IPokemonListEntry;
    private currentOrdering: PokemonOrdering;
    private currentReverse: boolean;

    constructor(config: IPokemonMenuControllerConfig) {
        this.config = config;
        //this.config.pokemonDetailsElement.find("#confirm-transfer").click(this.transferPokemon);
        //this.config.pokemonDetailsElement.find("#confirm-evolve").click(this.evolvePokemon);
        this.currentOrdering = PokemonOrdering.Date;
        this.currentReverse = true;
        this.config.pokemonOrderButtons.click(this.onOrderButtonClicked);
    }

    private onOrderButtonClicked = (event: JQueryEventObject) => {
        const button = $(event.target).closest(".pokemon-order-button");
        const orderingStr = button.attr("data-order-by");
        if (!orderingStr) {
            return;
        }
        const ordering = PokemonOrdering[orderingStr];
        const previousOrdering = this.currentOrdering;
        this.currentOrdering = ordering;
        if (previousOrdering === ordering) {
            this.currentReverse = !this.currentReverse;
        } else {
            this.currentReverse = true;
        }
        const chevron = button.find(".pokemon-order-chevron");
        if (this.currentReverse) {
            chevron.addClass("descending");
        } else {
            chevron.removeClass("descending");
        }
        this.updatePokemonListInner();
    }

    public pokemonListRequested = (request: IRequest): void => {
        this.config.pokemonLoadingSpinner.show();
    }

    public updatePokemonList = (pokemonList: IPokemonListEvent): void => {
        this.pokemonList = pokemonList;
        this.updatePokemonListInner();
    }

    private getOrderedPokemons = (): IPokemonListEntry[] => {
        let pokemons: IPokemonListEntry[];
        switch (this.currentOrdering) {
            case PokemonOrdering.Date:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.CreationTimeMs);
                break;
            case PokemonOrdering.Cp:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Cp);
                break;
            case PokemonOrdering.Iv:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Perfection);
                break;
            case PokemonOrdering.Number:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.PokemonId);
                break;
            case PokemonOrdering.Name:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => {
                    const pokemonName = this.config.translationController.translation.pokemonNames[p.PokemonId];
                    return pokemonName;
                });
                break;
            default:
                pokemons = this.pokemonList.Pokemons;
        }
        if (this.currentReverse) {
            pokemons = pokemons.reverse();
        }
        return pokemons;
    }

    private updatePokemonListInner = (): void => {
        if (!this.pokemonList) {
            return;
        }
        this.config.pokemonMenuElement.find(".pokemon").remove();
        const pokemons = this.getOrderedPokemons();
        for (let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i];
            const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
            const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
            const html =
                `<div class="pokemon" data-pokemon-unique-id="${pokemon.Id}">
    <h1 class="name">${pokemonName}</h1>
    <div class="image-container">
        <img src="images/pokemon/${pokemon.PokemonId}.png"/>
    </div>
    <h3 class="cp">${pokemon.Cp}</h3>
    <h3 class="iv">${roundedIv}</h3>
</div>`;
            const pokemonElement = $(html);
            pokemonElement.click(this.pokemonClick);
            this.config.pokemonMenuElement.append(pokemonElement);
        }
        this.config.pokemonLoadingSpinner.fadeOut(150);
    }
    private displayPokemonInfo= (pokemon : IPokemonListEntry) :void =>{
        const info : IPokemonInfo = pokemon;
        info.Name =  this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
        /*
        if (StaticData.pokemonData[pokemon.PokemonId].evolvesInto.length === 0) {
            evolveButton.hide();
        } else {
            const candiesRequired = StaticData.pokemonData[pokemon.PokemonId].candyToEvolve;
            evolveButton.find(".button-disabled-reason").text(`${candiesRequired} candies required`);
            if (typeof pokemon.FamilyCandies !== "undefined" && pokemon.FamilyCandies < candiesRequired) {
                evolveButton.addClass("disabled");
            } else {
                evolveButton.removeClass("disabled");
            }
            evolveButton.show();
        }
        */
        
        
        info.PokemonTypes = [];        
        info.Move1Name = this.config.translationController.translation.moveNames[pokemon.Move1];
        info.Move2Name  = this.config.translationController.translation.moveNames[pokemon.Move2];
        const pokemonData = StaticData.pokemonData[pokemon.PokemonId];
        for (let i = 0; i < pokemonData.elements.length; i++) {
            const elementStr = PokeElement[pokemonData.elements[i]].toLowerCase();
            info.PokemonTypes.push(elementStr)
        }
        
        this.config.pokemonMenuElement.closest("#content-wrap").addClass("blurred");
        const html = $(app.templates.Pokemon.PokemonInfo(pokemon));
        html.bind('click', function() { ;return false;})
        html.find('#confirm-transfer').click(this.transferPokemon)
        html.find('#confirm-evolve').click(this.evolvePokemon)
        html.find('#confirm-upgrade').click(this.upgradePokemon)
        html.find('#confirm-upgrade-max').click(this.maxUpgradePokemon)

        html.find('.close-button').click(this.close);
        this.config.pokemonDetailsElement.html("").append(html);
        this.config.pokemonDetailsElement.fadeIn();
    }

    private pokemonClick = (ev: JQueryEventObject) => {
        const pokemonBox = $(ev.target).closest(".pokemon");
        const pokemonUniqueIdStr = pokemonBox.attr("data-pokemon-unique-id");
        const pokemon = _.find(this.pokemonList.Pokemons, p => p.Id === pokemonUniqueIdStr);
        this.currentPokemon = pokemon;
        const info : IPokemonInfo = pokemon;
        this.displayPokemonInfo(info);
        
    }

    private close = (ev: JQueryEventObject)  => {
        this.config.pokemonMenuElement.closest("#content-wrap").removeClass("blurred");
        this.config.pokemonDetailsElement.fadeOut()
    }
    private transferPokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendTransferPokemonRequest(pokemonUniqueId);
        this.config.pokemonDetailsElement.fadeOut()
        this.close(ev)
    }
    public updatePokemonAfterUpgraded = (pkm :IUpgradeEvent) => {
        if(this.currentPokemon.Id == pkm.Id) {
            this.currentPokemon.Cp = pkm.Cp;
            this.currentPokemon.FamilyCandies = pkm.FamilyCandies;
            this.displayPokemonInfo(this.currentPokemon);
            
        }

        this.pokemonList.Pokemons.forEach((item, index, arr)=> {
            if(item.Id == pkm.Id) {
                item.Cp = pkm.Cp;
                item.FamilyCandies = pkm.FamilyCandies;        
            }            
        });

        this.updatePokemonListInner();     
    }
    private evolvePokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendEvolvePokemonRequest(pokemonUniqueId);
        this.config.pokemonDetailsElement.fadeOut()
        this.close(ev)
    }

    private upgradePokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendUpgradePokemonRequest(pokemonUniqueId, false);
    }

    private maxUpgradePokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendUpgradePokemonRequest(pokemonUniqueId, true);
    }

}
