import { Injectable } from '@angular/core';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class OrderService {

    constructor(private http: _HttpClient) { }

    public getOrderList(param) {
        return this.http.get(URL.ORDER, param);
    }

    public getOrder(id) {
        return this.http.get(URL.ORDER + `/${id}`);
    }

    public getOrderExecutionByOrder(id) {
        return this.http.get(URL.ORDEREXCUTION, { id: id });
    }
}
