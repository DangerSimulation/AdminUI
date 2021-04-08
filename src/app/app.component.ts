import {SharedService} from '../common/service/shared.service';
import {Component} from "@angular/core";

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
