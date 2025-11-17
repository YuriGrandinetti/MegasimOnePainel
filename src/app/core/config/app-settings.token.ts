import { InjectionToken } from '@angular/core';
import { AppSettings } from './app-settings.model';

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS');