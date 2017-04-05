/// <reference path="../../index.d.ts" />

interface IGymInfoWindow extends IGymEvent {
    GymLevel?:number;
    NextGymLevelRequired?:number;   
    DefenderName?:string;    
}