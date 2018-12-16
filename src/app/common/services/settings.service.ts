import { Injectable } from '@angular/core';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: _HttpClient) { }

  public getSplash() {
    return this.http.get(URL.SPLASH);
  }

  public saveSplash(splash) {
    return this.http.post(URL.SPLASH, splash);
  }

  public updateSplash(id, splash) {
    console.log(id);
    console.log(splash);
    return this.http.put(URL.SPLASH + '/' + id, splash);
  }

  public deleteSplash(id){
    return this.http.delete(URL.SPLASH + '/' + id);
  }

}
