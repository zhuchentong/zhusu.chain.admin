import { Injectable } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class HotelService {

    constructor(private http: _HttpClient) { }
    // å分类
    public getTagList() {
        return this.http.get(URL.TAG);
    }

    public saveTag(tag) {
        return this.http.post(URL.TAG, tag);
    }

    public getTag(id) {
        return this.http.get(URL.TAG + '/' + id);
    }

    public updateTag(id, tag) {
        return this.http.put(URL.TAG + '/' + id, tag);
    }

    public deleteTag(id) {
        return this.http.delete(URL.TAG + '/' + id);
    }
    // 商品
    public getHotelList(param) {
        return this.http.get(URL.HOTEL, param);
    }

    public saveHotel(hotel) {
        return this.http.post(URL.HOTEL, hotel);
    }

    public getHotel(id) {
        return this.http.get(URL.HOTEL + '/' + id);
    }

    public updateHotel(id, hotel) {
        return this.http.put(URL.HOTEL + '/' + id, hotel);
    }

    public deleteHotel(id) {
        return this.http.delete(URL.HOTEL + '/' + id);
    }
}
