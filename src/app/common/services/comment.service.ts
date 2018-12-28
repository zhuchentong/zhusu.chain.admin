import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { URL } from '../url';

@Injectable()
export class CommentService {

  constructor(private http: _HttpClient) { }

  public getCommentList(param) {
    return this.http.get(URL.COMMENT, param);
  }

  public updateComment(id) {
    return this.http.put(URL.COMMENT, id);
  }

  public deleteComment(id) {
    return this.http.delete(URL.COMMENT, id);
  }
}
