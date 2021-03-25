import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ScenarioInformation} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class ScenarioListService {

    private scenarios: ScenarioInformation;

    constructor(private http: HttpClient) {
        this.http.get<ScenarioInformation>('../../assets/simulation-scenarios.json').subscribe(value => {
            this.formatScenarioData(value);
        });
    }

    private formatScenarioData(data: ScenarioInformation): void {
        this.scenarios = data;
    }
}
