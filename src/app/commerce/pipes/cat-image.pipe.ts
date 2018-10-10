import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'app/Constants';
import { environment } from 'app/environment/environment';

@Pipe( {
    name: 'catImage'
} )
export class CatImagePipe implements PipeTransform {
    private readonly STORE_ASSET_PREFIX: string = "/store/0/storeAsset?assetPath=";
    private readonly DELIVERY_URL:string;

    constructor() {
        this.DELIVERY_URL=environment.deliveryUrl.toString();
    }

    transform( value: string, args?: any ): string {
        if ( value && value.indexOf( this.STORE_ASSET_PREFIX ) == 0 ) {
            return value.replace( this.STORE_ASSET_PREFIX, this.DELIVERY_URL );
        }
        else {
            return value;
        }
    }

}
