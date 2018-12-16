import { Injectable } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../url';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class PostService {

    constructor(private http: _HttpClient) { } 

    public getPostList(param) {
        return  this.http.get(URL.POST, param);
    }

    public savePost(post) {
        return  this.http.post(URL.POST, post);
    }

    public getPost(id) {
        return  this.http.get(URL.POST+'/'+id);
    }

    public checkPOST(check) {
        return  this.http.put(URL.POST+'/check', check);
    }

    public getMessageByPost(param) {
        return  this.http.get(URL.postMessage, param);
    }

    public getMessage(param) {
        return this.http.get(URL.POST_MESSAGE, param)
    }

    public sendMessage(data) {
        return  this.http.post(URL.POST_MESSAGE, data);
    }
}