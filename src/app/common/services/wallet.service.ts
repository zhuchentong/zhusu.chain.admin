import { Injectable } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class WalletService {

    constructor(private http: _HttpClient) { } 

    public getTxLogList(param) {
        return  this.http.get(URL.TxLogs,param);
    }

}