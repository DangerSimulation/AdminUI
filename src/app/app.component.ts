import {Component} from '@angular/core';
import {SharedService} from '../common/service/shared.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    //Import the shared service here to have all important services loaded all the time
    constructor(private sharedService: SharedService) {
    }
}
