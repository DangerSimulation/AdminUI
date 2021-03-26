import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ScenarioInformation} from '../shared/types';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScenarioListService {

    public scenarios: Observable<ScenarioInformation>;

    constructor(private http: HttpClient) {
        this.http.get<ScenarioInformation>('../../assets/simulation-scenarios.json').subscribe(value => {
            this.formatScenarioData(value);
        });
    }

    private formatScenarioData(data: ScenarioInformation): void {
        this.scenarios = new Observable<ScenarioInformation>(subscriber => {
            subscriber.next(data);
            subscriber.complete();
        });
    }
}
