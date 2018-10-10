import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pdpAttr'})
export class PDPAttrDisablerPipe implements PipeTransform {
    /**
     * true if computed value doesn't exist in availAttrs, false otherwise
     * @param a attribute
     * @param v element of attribute value array
     * @param index index of attribute in defnAttrs
     * @param sel current-selection (SKU most likely)
     * @param defnAttrs defining attributes array
     * @param availAttrs available attributes Set (pre-computed)
     */
    transform(a:any, v:any, index:number, sel:any, defnAttrs:any[], availAttrs:Set<String>):boolean {
        let rc:boolean=false;
        if (a && index>0) {
            let u:string[]=[];
            let c:string;
            for (let d of defnAttrs) {
                u.push(a.identifier==d.identifier?v.identifier:sel.selectedAttributes[d.identifier]);
            }
            c=u.join("|");
            rc=!availAttrs.has(c);
        }
        return rc;
    }
}
