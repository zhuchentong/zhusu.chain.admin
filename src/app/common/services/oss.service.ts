import { Injectable } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class OssService {

    constructor(private http: _HttpClient) { } 

    public getSecurityToken() {
        return  this.http.get(URL.UPLOADAUTHORITY);
    }
}