import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../common/services/comment.service';
import { HotelService } from '../../common/services/hotel.service';
import { UserService } from '../../common/services/user.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentList: any[] = [];
  loading = false;
  q = {
    offset: 0,
    max: 10
  };
  constructor(
    private _CommentService: CommentService,
    private _HotelService: HotelService,
    private _UserService: UserService,
    private _msg: NzMessageService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this._CommentService.getCommentList(this.q).subscribe((res: any) => {
      console.log(res);
      this.commentList = res.commentList;
      this.loading = false;
    });
  }

  delete(i) {
    this._CommentService.deleteComment(i.id).subscribe(res => {
      this._msg.success(`删除成功！`);
      this.getData();
    });
  }

}
