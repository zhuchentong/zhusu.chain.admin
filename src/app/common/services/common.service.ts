import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class CommonService {

    constructor(private http: _HttpClient) { } 

    getUniqueArr(arr){
        return Array.from(new Set(arr));
    }
    

}