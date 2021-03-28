import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ScenarioControlComponent} from '../../app/pages/scenario-control/scenario-control.component';
import {NbDialogService} from '@nebular/theme';
import {SceneResetComponent} from '../dialog/scene-reset/scene-reset.component';
import {ScenarioService} from '../service/scenario.service';
import {MessageService} from '../service/message.service';
import {SimulationMessage, SystemUpdateMessage} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class ResetScenarioGuard implements CanDeactivate<ScenarioControlComponent> {

    constructor(private dialogService: NbDialogService, private scenarioService: ScenarioService,
                private messageService: MessageService) {
    }

    //Return true to route
    canDeactivate(
        component: ScenarioControlComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.scenarioService.currentStep === undefined) {
            return true;
        }

        return new Observable<boolean>(subscriber => {
            this.dialogService.open(SceneResetComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false
            }).onClose.subscribe(arg => {
                if (arg) {
                    const message: SimulationMessage<SystemUpdateMessage<string>> = {
                        eventType: 'SystemUpdate',
                        data: {
                            action: 'SceneCancel',
                            additionalData: 'Returned to scene selection'
                        }
                    };
                    this.messageService.sendMessage(message);
                }

                subscriber.next(arg);
                subscriber.complete();
            });
        });
    }

}
