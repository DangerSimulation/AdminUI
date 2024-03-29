import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
	NbButtonModule,
	NbCardModule,
	NbDialogModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbThemeModule,
	NbToastrModule
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {AppRoutingModule} from './app-routing.module';
import {VideoDisplayModule} from './pages/video-display/video-display.module';
import {ScenarioSelectModule} from './pages/scenario-select/scenario-select.module';
import {ScenarioControlModule} from './pages/scenario-control/scenario-control.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DialogModule} from '../common/dialog/dialog.module';
import {ResetScenarioGuard} from '../common/guards/reset-scenario.guard';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PipesModule} from '../common/pipes/pipes.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		NoopAnimationsModule,
		NbThemeModule.forRoot({name: 'cosmic'}),
		NbLayoutModule,
		NbEvaIconsModule,
		AppRoutingModule,
		NbInputModule,
		NbCardModule,
		HttpClientModule,
		FormsModule,
		VideoDisplayModule,
		ScenarioSelectModule,
		ScenarioControlModule,
		NbToastrModule.forRoot(),
		NbDialogModule.forRoot(),
		NgbModule,
		DialogModule,
		NbIconModule,
		NbButtonModule,
		PipesModule
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'de-DE'},
		ResetScenarioGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
