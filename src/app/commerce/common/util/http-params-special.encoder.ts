import { HttpParameterCodec } from "@angular/common/http";

/**
 * for encoding query-parameters with special characters
 *
 * angular default encoding is too light or too heavy
 *
 * use only where necessary
 */
export class HttpParamsSpecialEncoder implements HttpParameterCodec {
  encodeKey(k:string):string {
    return encodeURIComponent(k);
  }

  decodeKey(k:string):string {
    return decodeURIComponent(k);
  }

  encodeValue(v:string):string {
    return this.encodeKey(v);
  }

  decodeValue(v:string):string {
    return this.decodeKey(v);
  }
}