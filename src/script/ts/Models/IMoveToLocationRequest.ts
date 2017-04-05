interface IMoveToLocationRequest extends IRequest {
    Longitude: number,
    Latitude: number,
    UseTeleport: boolean,
    FortId?:string
}