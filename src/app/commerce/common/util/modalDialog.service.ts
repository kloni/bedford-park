import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ModalBaseComponent } from '../../components/generic/modal/modal.base.component';

@Injectable()
export class ModalDialogService {

    prevComponent: ComponentRef<any>;
    sessionErrorSource = new Subject<any>();

    sessionError$ = this.sessionErrorSource.asObservable();
    errorInputSource = new BehaviorSubject<any>(null);
    errorInput$ = this.errorInputSource.asObservable();
    failedReqSource = new BehaviorSubject<any>(null);
    failedReq$ = this.failedReqSource.asObservable();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
        this.prevComponent = null;

    }

    addTargetComponent(targetComponent: any): void {
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(targetComponent);
        const component: ComponentRef<any> = componentRef.create(this.injector);

        // Destroy previous component created and detachView
        if (this.prevComponent) {
            this.prevComponent.destroy();
            this.appRef.detachView(this.prevComponent.hostView);
        }

        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(component.hostView);

        // Get DOM element from component
        const domElem = (component.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        document.body.appendChild(domElem);

        this.prevComponent = component;
    }

  /**
   *
   * @param {string} contentId
   * @returns {Observable<boolean>}
   */
    launchCustomModal(contentId: string): Observable<boolean>{
        if (!(this.prevComponent && this.prevComponent.componentType instanceof ModalBaseComponent)){
            this.addTargetComponent(ModalBaseComponent);
        }
        return (<ModalBaseComponent>this.prevComponent.instance).loadContent(contentId);
    }

}
