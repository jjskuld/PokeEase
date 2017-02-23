/// <reference path="../../../../index.d.ts" />

class AudioNotificationController implements INotificationController {
    public config: IAudioNotificationControllerConfig;

    constructor(config: IAudioNotificationControllerConfig) {
        this.config = config;
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }

    private exampleClicked = (ev: JQueryEventObject): void => {
        this.addNotificationExample();
    }
    public addHumanSnipeReachedDestination= (ev:IHumanWalkSnipeReachedEvent): void => {
        
    }
    public addPokemonUpgraded = (ev:IUpgradeEvent) : void => {
        this.addNotification('powerup');
    }

    public addNotificationExample = (): void => {
        this.addNotification('generic');
    }

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        if (!this.config.notificationSettings.pokestopUsed) {
            return;
        }
        this.addNotification('robbed');
    }

    public addNotificationPokemonCapture = (pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void=> {
        const pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
        if (!pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonCapture) {
            return;
        }
        if (pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonSnipe) {
            return;
        }
        if (pokemonCatch.IsSnipe) {
            this.addNotification('throwing');
        }else {
            this.addNotification('caught');
        }
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        if (!this.config.notificationSettings.pokemonEvolved) {
            return;
        }
        this.addNotification('evolved');
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        if (!this.config.notificationSettings.pokemonTransfer) {
            return;
        }
        this.addNotification('transfered');
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        if (!this.config.notificationSettings.itemRecycle) {
            return;
        }
        this.addNotification('bagfull');
    }

    public addNotificationEggHatched = (eggHatched: IEggHatchedEvent): void => {
        if (!this.config.notificationSettings.eggHatched) {
            return;
        }
        this.addNotification('hatched');
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        if (!this.config.notificationSettings.incubatorStatus) {
            return;
        }
        this.addNotification('pickup');
    }
    public addHumanWalkSnipeStart = (startEvent: IHumanWalkSnipeStartEvent): void => {
    }
    private addNotification = (audioName: string) => {
        this.config.container.src = "audio/" + audioName + ".mp3";
        try {
            this.config.container.play();
        }catch (error) {
            // console.error(error);
        }
    }

    private onSettingsChanged = (settings: ISettings, previousSettings: ISettings): void => {
        this.config.notificationSettings = settings.notificationsAudio;
    }
}