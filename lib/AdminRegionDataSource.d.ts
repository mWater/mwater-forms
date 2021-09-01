export default class AdminRegionDataSource {
    constructor(apiUrl: any);
    getAdminRegionPath: (id: any, callback: any) => any;
    getSubAdminRegions: (id: any, level: any, callback: any) => any;
    findAdminRegionByLatLng: (lat: any, lng: any, callback: any) => any;
    _executeQuery(query: any, callback: any): any;
}