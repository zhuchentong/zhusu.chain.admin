import { Injectable } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class UserService {

    constructor(private http: _HttpClient) { } 

    public getUserList(param) {
        return  this.http.get(URL.USER, param);
    }

    public getUser(id) {
        return  this.http.get(URL.USER + '/' + id);
    }

    public frozenUser(id, operation) {
        return  this.http.put(URL.USER + '/' + id + `?operation=${operation}`);
    }

    public resetPassword(username) {
        return  this.http.put(URL.USER + '/resetPassword', {username: username});
    }

    public saveUser(user) {
        return  this.http.post(URL.USER, user);
    }

    public getSellerApplicationList(param) {
        return  this.http.get(URL.SELLERAPPLICATION, param);
    }

    public getSellerApplication(id) {
        return  this.http.get(URL.SELLERAPPLICATION + '/' + id);
    }

    public approveSellerApplication(id, saleZones) {
        return  this.http.put(URL.SELLERAPPLICATION + '/approve', {id, saleZones});
    }

    public refuseSellerApplication(id, reason) {
        return  this.http.put(URL.SELLERAPPLICATION + '/refuse', {id, reason});
    }

    public getSellerLicenseList() {
        return  this.http.get(URL.SELLERLICENSE);
    }

    public saveSellerLicense(sellerLicense) {
        return  this.http.post(URL.SELLERLICENSE, sellerLicense);
    }
}
