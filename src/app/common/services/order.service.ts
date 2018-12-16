import { Injectable } from '@angular/core';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class OrderService {

    constructor(private http: _HttpClient) { } 

    public getOrderList(param) {
        return  this.http.get(URL.ORDER, param);
    }

    public getOrder(id) {
        return  this.http.get(URL.ORDER + `/${id}`);
    }

    public getOrderItems(orderId) {
        return  this.http.get(URL.ORDER + '/orderItems',{id:orderId});
    }

    public getOrderFeeList(param) {
        return  this.http.get(URL.ORDERFEE, param);
    }

    public confirmOrderFee(id) {
        return  this.http.put(URL.ORDERFEE+'/confirm', {id:id});
    }

    public getOrderPointLogList(orderId = '') {
        return  this.http.get(URL.ORDERPOINTLOG,{orderId:orderId});
    }

    public getOrderExecutionByOrder(id) {
        return this.http.get(URL.ORDEREXCUTION, {id:id})
    }

    public getOrderTokenLogList(orderId = '') {
        return this.http.get(URL.OrderTokenLogs,{orderId:orderId})
    }

    public getOrderMessageList(param) {
        return this.http.get(URL.OrderMessage,param)
    }

    public getOrderClaimList() {
        return  this.http.get(URL.OrderClaim);
    }
}