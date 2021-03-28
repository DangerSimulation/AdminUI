import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
    selector: 'app-scene-reset',
    templateUrl: './scene-reset.component.html',
    styleUrls: ['./scene-reset.component.css']
})
export class SceneResetComponent implements OnInit {

    constructor(protected dialogReference: NbDialogRef<SceneResetComponent>) {
    }

    ngOnInit(): void {
    }

    public onConfirmClick(): void {
        this.dialogReference.close(true);
    }

    public onCancelClick(): void {
        this.dialogReference.close(false);
    }
}
