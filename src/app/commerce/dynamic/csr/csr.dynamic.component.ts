import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChildren, QueryList } from "@angular/core";
import { StorefrontUtils } from "../../common/storefrontUtils.service";
import { PersonService } from "../../services/rest/transaction/person.service";
import { CommerceEnvironment } from "../../commerce.environment";
import { Subscription } from "rxjs/Subscription";
import { AuthenticationTransactionService } from "../../services/componentTransaction/authentication.transaction.service";
import { Router, NavigationEnd } from "@angular/router";
import { Constants } from "../../../Constants";
import { CurrentUser } from "../../common/util/currentUser";
import { DatePipe } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { CountryService } from "../../services/rest/transaction/country.service";
import { OrderService } from "../../services/rest/transaction/order.service";
import { GuestIdentityService } from "../../services/rest/transaction/guestIdentity.service";
import { CartTransactionService } from "../../services/componentTransaction/cart.transaction.service";
const uniqueId = require('lodash/uniqueId');
import * as $ from 'jquery';

@Component({
    selector: 'app-dynamic-csr-component',
    templateUrl: './csr.dynamic.html',
    styleUrls: ['./csr.dynamic.scss'],
    preserveWhitespaces: false
})
export class DynamicCSRComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()title:string="";
    readonly userDesc:any={
        logonId:"",
        firstName:"",
        lastName:"",
        email1:"",
        phone1:"",
        address1:"",
        zipcode:"",
        country:"",
        state:"",
        parentOrgName:""
    };
    readonly orderDesc:any={
      firstName:"",
      lastName:"",
      email:"",
      phone:"",
      streetAddress1:"",
      zipCode:"",
      country:"",
      state:"",
      city:"",
      orderDateTo:"",
      orderDateFrom:"",
      orderId:""
    };
    readonly REG_TEMPLATE:any=JSON.parse(JSON.stringify(CommerceEnvironment.fullRegSkeleton));
    readonly SEARCH_ATTRS:string[] = Object.keys(this.userDesc);
    readonly ORDER_ATTRS:string[]=Object.keys(this.orderDesc);
    readonly csrLink:string;
    readonly homeLink:string;
    readonly orderDetailsLink:string;
    readonly cartLink:string;
    readonly maLink:string;
    readonly csrDesc:any={isCSR:true,actingAs:null,notifyActingAs:false,actingDisplay:""};
    readonly CHOICES:any={
      ACT:"act",
      STATUS:"status",
      FLIP_LOCK:"flipLock",
      TAKEOVER_UNLOCK:"takeOverUnlock",
      VIEW_SUMMARY:"orderSummary"
    };
    readonly csrErrors:any={
      searchError:"",
      searchOrderError:"",
      shopGuestError:""
    };
    searchResults:any[]=[];
    orderResults:any[]=[];
    subs:Subscription[]=[];
    id:string="";
    countries:any[];
    cDescs:any={};
    noStates:any={"":true};
    tabsInit:boolean=false;
    userInit:boolean=false;
    orderInit:boolean=false;
    noResultsFound:boolean=false;
    noOrdersFound:boolean=false;

    @ViewChildren('csrTabs') csrTabs: QueryList<any>;
    @ViewChildren('userAccordion') userAccordion: QueryList<any>;
    @ViewChildren('orderAccordion') orderAccordion: QueryList<any>;

    constructor(private su:StorefrontUtils,
                private psvc:PersonService,
                private countrySvc:CountryService,
                private auth:AuthenticationTransactionService,
                private ordSvc:OrderService,
                private datePipe:DatePipe,
                private guestSvc:GuestIdentityService,
                private cartTxnSvc:CartTransactionService,
                private router:Router) {
        this.csrLink = this.su.getPageLink(Constants.customerServiceIdentifier);
        this.homeLink = this.su.getPageLink(Constants.homePageIdentifier);
        this.orderDetailsLink = this.su.getPageLink(Constants.orderDetailsPageIdentifier);
        this.cartLink = this.su.getPageLink(Constants.shoppingCartPageIdentifier);
        this.maLink = this.su.getPageLink(Constants.myAccountPageIdentifier);
        this.id=uniqueId();
    }

    ngOnInit() {
        this.getCountries()
        .then((r)=>{this.initCountries(r)})
        .catch(
            /* istanbul ignore next */
            (e)=>{
                /* istanbul ignore next */
                this.su.handleErrorCase(e,"Unable to retrieve country and state list")
            }
        );
        this.csrDesc.actingAs=StorefrontUtils.getForUser(null);
        this.REG_TEMPLATE.csr=this.csrDesc;
        if (!!this.csrDesc.actingAs) {
          this.csrDesc.notifyActingAs=true;
          const userDesc:any={};
          Promise.all(this.getMemberData([{memberId:this.csrDesc.actingAs.userId}],userDesc))
          .then(u=>this.setActingDisplay(userDesc[this.csrDesc.actingAs.userId]))
          .catch(e=>this.su.handleErrorCase(e,"Unable to fetch descriptor for user current being acted-as"))
        }
    }

    ngOnDestroy() {
        this.subs.forEach(v=>v.unsubscribe());
        if (this.tabsInit) {
          (<any>$(`#csrTabs_${this.id}`)).foundation('_destroy');
        }
        if (this.userInit) {
          (<any>$(`#userAccordion_${this.id}`)).foundation('_destroy');
        }
        if (this.orderInit) {
          (<any>$(`#orderAccordion_${this.id}`)).foundation('_destroy');
        }
    }

    ngAfterViewInit(){
        (<any>$(`#csrTabs_${this.id}`)).foundation();
        (<any>$(`#userAccordion_${this.id}`)).foundation();
        (<any>$(`#orderAccordion_${this.id}`)).foundation();

        if (this.csrDesc.actingAs &&  !this.csrDesc.actingDisplay) {
          (<any>$(`#csrTabs_${this.id}`)).foundation('_handleTabChange', $(`#itemCustomerAdd_${this.id}`));
        }

        this.tabsInit=true;
        this.userInit=true;
        this.subs.push(
          this.csrTabs.changes.subscribe((change) => {
            Foundation.reInit(['tabs']);
            this.tabsInit=true;
        }));
        this.subs.push(
          this.userAccordion.changes.subscribe((change) => {
            Foundation.reInit(['accordion']);
            this.userInit=true;
        }));
        this.subs.push(
          this.orderAccordion.changes.subscribe((change) => {
            Foundation.reInit(['accordion']);
            this.orderInit=true;
        }));
    }

    initCountries(r:any) {
        this.countries=r.body.countries;
        this.cDescs={};
        for (let c of this.countries) {
            this.cDescs[c.code]=c;
            c.stDescs={};
            if (c.states.length) {
              c.states.forEach((s:any)=>c.stDescs[s.code]=s);
            } else {
              this.noStates[c.code]=true;
            }
        }
        this.fixState(this.userDesc);
        this.fixState(this.orderDesc);

    }

    getCountries():Promise<HttpResponse<any>> {
        if (!this.countries) {
            return this.countrySvc.findCountryStateList({storeId:this.su.commerceStoreId}).toPromise();
        } else {
            return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
        }
    }

    fixState(desc:any) {
      if (!this.noStates[desc.country]&&!this.cDescs[desc.country].stDescs[desc.state])
          desc.state="";
    }

    isUserSearchInvalid() {
      return !Object.keys(this.userDesc).map(k=>this.userDesc[k]).join('');
    }

    search() {
        // copy attributes specified
        const searchBody:any={};
        this.SEARCH_ATTRS.forEach((a)=>{
            if (this.userDesc[a]) {
                searchBody[a]=this.userDesc[a];
                if (a=="logonId") {
                    searchBody["logonIdSearchType"]="6";
                }
            }
        });

        return this.getRegUsersICanManage(searchBody)
        .then(r=>{
            this.doAccordionAction("userAccordion","itemUserAccordion_content","up");
            this.searchResults=r.body.userDataBeans;
            this.noResultsFound=this.searchResults.length==0;
        })
        .catch(e=>{
          this.csrErrors.searchError=this.su.handleErrorCase(e,"Unable to perform user search as CSR");
          throw e;
        });
    }

    clear() {
        this.searchResults=[];
        this.SEARCH_ATTRS.forEach((a)=>{
            this.userDesc[a]="";
        });
        this.doAccordionAction("userAccordion","itemUserAccordion_content","down");
    }

    clearOrderForm() {
      this.orderResults=[];
      this.ORDER_ATTRS.forEach((a)=>{
        this.orderDesc[a]="";
      });
      this.doAccordionAction("orderAccordion","itemOrderAccordion_content","down");
    }

    startActing(u:any) {
        if (!this.csrDesc.actingAs) {
          StorefrontUtils.setForUser(null,{userName:u.logonId,userId:u.memberId||u.userId,personalizationId:u.personalizationId||u.personalizationID});
          this.csrDesc.actingAs=StorefrontUtils.getForUser(null);
          this.cartTxnSvc.getCart();
          this.setActingDisplay(u);
          window.scrollTo(0,0);
        }
    }

    stopActing() {
        StorefrontUtils.wipeForUser(null);
        this.csrDesc.actingAs=null;
        this.clearActingDisplay();
    }

    setActingDisplay(u:any) {
      this.csrDesc.notifyActingAs=true;
      if (u.userRegistry) {
        const a=u.address?u.address:u;
        this.csrDesc.actingDisplay=`${a.firstName} ${a.lastName}`;
      } else {
        this.csrDesc.actingDisplay=null;
        this.doTabAction("csrTabs","itemCustomerAdd","_handleTabChange");
      }
    }

    clearActingDisplay() {
      this.clearActingNotification();
      this.csrDesc.actingDisplay=null;
    }

    doAction(u:any,a:string) {
      if (this.CHOICES.ACT==a) {
        if (this.csrDesc.actingAs&&this.csrDesc.actingAs.userId==u.userId) {
          this.stopActing();
        } else {
          this.startActing(u);
        }
      } else {
        const newStatus=u.userRegistry.status=="1"?"0":"1";
        const p:any={ storeId: this.su.commerceStoreId, userId: u.userId, body: { userStatus: newStatus } };
        return this.psvc.updatePersonByAdmin(p).toPromise()
        .then(r=>
          // it seems like there's a cache at the IDC backend that retains any previously fetched rest-call
          ///  responses; it does get cleared on the update that this callback is for, but isn't "fast-enough"
          //   for this next search, which causes the status to not show as "updated"; i'll put a 500-ms delay
          //   here to allow the cache to catch-up to the update, so that the search fetches the "updated" status
          setTimeout(()=>this.search(),500)
        )
        .catch(e=>{
          this.su.handleErrorCase(e,"Unable to perform status update on user as CSR");
          throw e;
        });
      }
    }

    doOrderAction(o:any,a:string):Promise<any> {
      const searchBody:any={
        maxResults: "1",
        logonIdSearchType: "5"
      };

      // start acting button
      if (this.CHOICES.ACT==a) {
        if (this.csrDesc.actingAs&&this.csrDesc.actingAs.userId==o.memberId) {
          this.stopActing();
        } else {
          // unfortunately, the order doesn't have all the details we need (personalization-id specifically), so need to one more fetch here
          if (o.memberDescriptor.registerType!="G") {
            searchBody.logonId=o.memberDescriptor.userRegistry.logonId;
            return this.getRegUsersICanManage(searchBody)
            .then(u=>this.startActing(u.body.userDataBeans[0]))
            .catch(e=>{
              this.csrErrors.searchError=this.su.handleErrorCase(e,"Unable to perform user search as CSR");
              throw e;
            });
          } else {
            this.startActing({logonId:o.memberDescriptor.logonId,memberId:o.memberDescriptor.userId,personalizationId:this.su.generatePersonalizationId()})
          }
        }
      }
      // disable/enable user button
      else if (this.CHOICES.STATUS==a) {
        const p:any={ storeId: this.su.commerceStoreId, userId: o.memberDescriptor.userId, body: { userStatus: o.memberDescriptor.userRegistry.status=="1"?"0":"1" } };
        return this.psvc.updatePersonByAdmin(p).toPromise()
        .then(r=>this.searchOrders())
        .catch(e=>{
          this.su.handleErrorCase(e,"Unable to perform status update on user as CSR")
          throw e;
        });
      }
      // view order-summary button
      else if (this.CHOICES.VIEW_SUMMARY==a) {
        // unfortunately, the order doesn't have all the details we need (personalization-id specifically), so need to one more fetch here
        if (o.memberDescriptor.registerType!="G") {
          searchBody.logonId=o.memberDescriptor.userRegistry.logonId;
          return this.getRegUsersICanManage(searchBody)
          .then(u=>{
            this.startActing(u.body.userDataBeans[0]);
            if (o.status=="P") {
              this.router.navigate([this.cartLink]);
            } else {
              this.router.navigate([this.orderDetailsLink], { queryParams: { orderId: o.orderId } });
            }
          })
          .catch(e=>{
            this.csrErrors.searchError=this.su.handleErrorCase(e,"Unable to perform user search as CSR using order-data for view-summary");
            throw e;
          });
        } else {
          this.startActing({logonId:o.memberDescriptor.logonId,memberId:o.memberDescriptor.userId,personalizationId:this.su.generatePersonalizationId()});
          if (o.status=="P") {
            this.router.navigate([this.cartLink]);
          } else {
            this.router.navigate([this.orderDetailsLink], { queryParams: { orderId: o.orderId } });
          }
        }
      }
      // lock/unlock cart button
      else if (this.CHOICES.FLIP_LOCK==a) {
        const promise:Promise<any>=o.checkLock?this.cartTxnSvc.unlockCart(o.orderId):this.cartTxnSvc.lockCart(o.orderId);
        return promise
        .then(r=>this.searchOrders())
        .catch(e=>{
          this.su.handleErrorCase(e,"Unable to flip cart status");
          throw e;
        })
      }
      // takeover cart-lock button
      else {
        return this.cartTxnSvc.lockCart(o.orderId,{takeOverLock:"Y"})
        .then(r=>this.doOrderAction({orderId:o.orderId,checkLock:true},this.CHOICES.FLIP_LOCK))
        .catch(e=>{
          this.su.handleErrorCase(e,"Unable to take over lock");
          throw e;
        })
      }
    }

    getRegUsersICanManage(extra:any):Promise<any> {
      const searchBody:any={
        storeId: this.su.commerceStoreId,
        q: "registeredUsersICanManage",
        profileName: "IBM_User_List_Basic_Summary",
        startIndex: "0",
        maxResults: CommerceEnvironment.csrSearchMax
      };
      Object.assign(searchBody,extra);
      return this.psvc.registeredUsersICanManage(searchBody).toPromise();
    }

    searchOrders() {
      const queryParams:any={};
      const searchBody:any={
        storeId: this.su.commerceStoreId,
        q: "ordersICanWorkonbehalf",
        profileName: "IBM_Summary",
        orderByFieldName: "TIMEPLACED DESC",
        retrievePendingGuestOrders: "false",
        startIndex: "0",
        maxResults: CommerceEnvironment.csrSearchMax,
        $queryParameters: queryParams
      };

      // copy attributes specified
      this.ORDER_ATTRS.forEach(a=>{
        if (this.orderDesc[a]) {
          queryParams[a]=a.startsWith("orderDate")?this.datePipe.transform(this.orderDesc[a],"yyyy-MM-dd HH:mm:ss.SSS"):this.orderDesc[a];
        }
      });

      return this.ordSvc.ordersICanWorkonbehalf(searchBody).toPromise()
      .then(r=>{
        const orders:any[]=r.body.resultList.filter(o=>o.status!='X');
        this.noOrdersFound=orders.length==0;
        if (orders.length>0) {
          const descs:any={};
          Promise.all(this.getMemberData(orders,descs))
          .then(x=>{
            orders.forEach(v=>v.memberDescriptor=descs[v.memberId]);
            this.orderResults=orders;
            this.doAccordionAction("orderAccordion","itemOrderAccordion_content","up");
          })
          .catch(e=>{
            this.csrErrors.searchOrderError=this.su.handleErrorCase(e,"Unable to fetch one or more member descriptors");
            throw e;
          })
        } else {
          this.orderResults=orders;
          this.doAccordionAction("orderAccordion","itemOrderAccordion_content","up");
        }
      })
      .catch(e=>{
        this.csrErrors.searchOrderError=this.su.handleErrorCase(e,"Unable to search for orders as CSR");
        throw e;
      })
    }

    getMemberData(orders:any[], descs:any):Promise<any>[] {
      const rc:Promise<any>[]=[];
      const cache:any={};

      orders.forEach((v,i)=>{
        // no need to refetch data that may already be fetched
        if (!cache[v.memberId]) {
          cache[v.memberId]=true;
          const memberParam = {
            storeId:this.su.commerceStoreId,
            userId:v.memberId,
            profileName:"IBM_User_Registration_Details"
          };
          rc.push(
            this.psvc.findByUserId(memberParam).toPromise()
            .then(u=>{ descs[v.memberId]=u.body; return u; })
            .catch(e=>this.csrErrors.searchOrderError=this.su.handleErrorCase(e,"Unable to fetch member descriptor for order at index"+i))
          );
        }
      });

      return rc;
    }

    clearError(attr:string) {
      this.csrErrors[attr]="";
    }

    clearNoResults() {
      this.noResultsFound=false;
      this.doAccordionAction("userAccordion","itemUserAccordion_content","down");
    }

    clearNoOrderResults() {
      this.noOrdersFound=false;
      this.doAccordionAction("orderAccordion","itemOrderAccordion_content","down");
    }

    doAccordionAction(tab:string,item:string,action:string) {
      (<any>$(`#${tab}_${this.id}`)).foundation(action, $(`#${item}_${this.id}`));
    }

    doTabAction(tab:string,item:string,action:string) {
      (<any>$(`#${tab}_${this.id}`)).foundation(action, $(`#${item}_${this.id}`));
    }

    shopAsGuest() {
      return this.guestSvc.login({storeId:this.su.commerceStoreId}).toPromise()
      .then(r=>{
        this.doTabAction("csrTabs", "itemCustomerAdd", "_handleTabChange");
        this.startActing(r.body)
      })
      .catch(e=>{
        this.csrErrors.shopGuestError=this.su.handleErrorCase(e,"Unable to login as guest user");
        throw e;
      });
    }

    clearActingNotification() {
      this.csrDesc.notifyActingAs=false;
    }
}