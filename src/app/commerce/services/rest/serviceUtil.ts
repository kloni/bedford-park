import { HttpParams } from "@angular/common/http";
export class serviceUtils {
    public static setQueryParam(queryParameters: HttpParams, name: string, parameter): HttpParams {
        if (parameter instanceof Array) {
            parameter.forEach(value => {
                queryParameters = queryParameters.append(name, value);
            });
        } else {
            queryParameters = queryParameters.set(name, parameter);
        }
        return queryParameters;
    }
}