/// <reference path="../../index.d.ts" />

interface ITemplateInfoWindow {
    GymInfoWindow(data: IGymInfoWindow): string;
    PokestopInfoWindow(data: IPokestopInfoWindow): string;
}