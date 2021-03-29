import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ScenarioList} from '../shared/types';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScenarioListService {

    public scenarios: Observable<ScenarioList>;

    constructor(private http: HttpClient) {
        this.http.get<ScenarioList>('../../assets/simulation-scenarios.json').subscribe(value => {
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
