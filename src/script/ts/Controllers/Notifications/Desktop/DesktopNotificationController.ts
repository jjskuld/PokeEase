/// <reference path="../../../../index.d.ts" />

class DesktopNotificationController implements INotificationController {
    public config: IDesktopNotificationControllerConfig;

    constructor(config: IDesktopNotificationControllerConfig) {
        this.config = config;
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }

    private exampleClicked = (ev: JQueryEventObject): void => {
        this.addNotificationExample();
    }
    public addHumanSnipeReachedDestination= (ev:IHumanWalkSnipeReachedEvent): void => {
        
    }

    private updateCurrentPermission = (status: string) => {
        this.config.permissionElement.text(status);
    }

    public addPokemonUpgraded = (ev:IUpgradeEvent) : void => {
        
    }

    public addNotificationExample = (): void => {
        this.addNotification("Example", {
            body: "This is an example of a desktop notification",
            icon: ""
        });
    }

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        if (!this.config.notificationSettings.pokestopUsed) {
            return;
        }
        this.addNotification("Pokestop", {
            body: `${fortUsed.Name}`,
            icon: `images/markers/Normal.png`
        });
    }

    public addNotificationPokemonCapture = (pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void=> {
        const pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
        if (!pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonCapture) {
            return;
        }
        if (pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonSnipe) {
            return;
        }
        const eventType = pokemonCatch.IsSnipe ? "Snipe" : "Catch";
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
        const roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
        this.addNotification(eventType, {
            body: `${pokemonName}
CP: ${pokemonCatch.Cp}
IV: ${roundedPerfection}
Lvl: ${pokemonCatch.Level}`,
            icon: `images/pokemon/${pokemonCatch.Id}.png`
        });
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        if (!this.config.notificationSettings.pokemonEvolved) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
        this.addNotification("Evolve", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${pokemonEvolve.Id}.png`
        });
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        if (!this.config.notificationSettings.pokemonTransfer) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonTransfer.PokemonId];
        this.addNotification("Transfer", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${pokemonTransfer.PokemonId}.png`
        });
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        if (!this.config.notificationSettings.itemRecycle) {
            return;
        }
        this.addNotification("Recycle", {
            body: `${itemRecycle.Count} items`,
            icon: `images/items/${itemRecycle.Id}.png`
        });
    }

    public addNotificationEggHatched = (eggHatched: IEggHatchedEvent): void => {
        if (!this.config.notificationSettings.eggHatched) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
        this.addNotification("Hatch", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${eggHatched.PokemonId}.png`
        });
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        if (!this.config.notificationSettings.incubatorStatus) {
            return;
        }
        const km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
        this.addNotification("Incubator", {
            body: `${km} of ${incubatorStatus.KmToWalk}km`,
            icon: `images/items/0.png`
        });
    }
    public addHumanWalkSnipeStart = (startEvent: IHumanWalkSnipeStartEvent): void => {

        //alert('alert : add event to desktop.....')
        
    }
    private addNotification = (title: string, options: NotificationOptions) => {
		if (typeof Notification === "undefined") {
            this.updateCurrentPermission("unsupported");
            return;
        }
		
		this.updateCurrentPermission(Notification.permission);
		
		if (Notification.permission === "granted") {
			const notification = new Notification(title, options);
			return;
        }
		
		if (Notification.permission !== 'denied') {
			const promise = Notification.requestPermission();
			promise.then(permission => {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					var notification = new Notification(title, options);
				}
				this.updateCurrentPermission(permission);
			}, reason => {
				console.log(reason);
			});
		}
    }

    private onSettingsChanged = (settings: ISettings, previousSettings: ISettings): void => {
        this.config.notificationSettings = settings.notificationsDesktop;
    }
}