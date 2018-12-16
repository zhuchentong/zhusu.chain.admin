import { Injectable } from '@angular/core';
import { isUndefined } from "util";

@Injectable()
export class RegularService {
    Int_regular: any;
    Float_regular: any;
    Sn_regular: any;
    Strong_regular: any;
    DomainName_regular: any;
    IP_regular: any;
    Version_regular: any
    MAP_regular: any
    List_regular: any
    Phone_regular: any
    Email_regular: any

    constructor() {
        this.Int_regular = /^[0-9]*$/;
        this.Float_regular = /^[0-9.]*$/; //-?\d+(\.\d+)?
        this.Sn_regular = /^[0-9a-zA-Z\W]+$/;
        this.Strong_regular = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
        this.DomainName_regular = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
        this.IP_regular = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        this.Version_regular = /^\d{1,2}(\.\d{1,2}){1,3}$/;
        this.MAP_regular = /^[^,:]+:[^,:]+(,[^,:]+:[^,:]+)*$/;
        this.List_regular = /^\d+(,\d+)*$/;
        this.Phone_regular = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        this.Email_regular = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    };
    isVersion(value) {
        return this.Version_regular.test(value);
    }
    isDomainName(value) {
        return this.DomainName_regular.test(value);
    }
    isIP(value) {
        return this.IP_regular.test(value);
    }
    isInt(value) {
        return this.Int_regular.test(value);
    }

    isFloat(value) {
        return this.Float_regular.test(value);
    }

    isBlank(value) {
        if (value === null || value === '' || value === undefined) {
            return true;
        }
        return false;
    }

    isSn(value) {
        return this.Sn_regular.test(value);
    }

    isStrong(value) {
        return this.Strong_regular.test(value);
    }
    isMap(value) {
        return this.MAP_regular.test(value)
    }
    isList(value) {
        return this.List_regular.test(value)
    }
    isPhone(value) {
        return this.Phone_regular.test(value)
    }
    isEmail(value) {
        return this.Email_regular.test(value)
    }
}
