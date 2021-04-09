import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ScenarioList} from '../shared/types';
import {Observable} from 'rxjs';
import {ElectronService} from './electron.service';
import {environment} from '../../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class ScenarioListService {

	public scenarios: Observable<ScenarioList>;

	constructor(private http: HttpClient, private electronService: ElectronService) {
		const path = electronService.remote.require('path');

		const sourcePath = environment.production ? path.join(electronService.remote.app.getAppPath(), 'dist', 'de') : path.join('..', '..');

		this.http.get<ScenarioList>(path.join(sourcePath, 'assets', 'simulation-scenarios.json')).subscribe(value => {
			this.formatScenarioData(value);
		});
	}

	private formatScenarioData(data: ScenarioList): void {
		this.scenarios = new Observable<ScenarioList>(subscriber => {
			subscriber.next(data);
			subscriber.complete();
		});
	}

}
