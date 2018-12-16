import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { PostService } from '../../../common/services/post.service';
import { UserService } from '../../../common/services/user.service';
import { RegularService } from '../../../common/services/regular.service';
import { EmitService } from '../../../common/services/emit.service';
import { Input } from '@angular/core';
@Component({
    selector: 'post-dialog',
    templateUrl: 'post-dialog.component.html',
    styleUrls: ['post-dialog.component.scss']
  })
export class PostDialogComponent implements OnInit{
  @Input() postId: number;
  @Input() writerId: number;

  messageList:any[]=[]
  currentUserId:any
  content:any;
  constructor( private router: Router
    , private _msg: NzMessageService
    , private _postService: PostService
    , private _userService: UserService
    , private _regularService: RegularService
    , private _emitService: EmitService) {
      this.currentUserId = parseInt(sessionStorage.getItem('currentUserId'))
      console.log(this.currentUserId)
  }
  q = {
    max:10,
    sort:'id',
    order:'desc',
    postId: null,
    filter:'reader',
    readerId:null
  }
  ngOnInit() { 
    console.log(this.postId)
    console.log(this.writerId)
  this.q.postId = this.postId
  this.q.readerId = this.writerId
  this.getList();
  }
  getList() {
    this._postService.getMessage(this.q).subscribe((res:any)=>{
      this.messageList = res.postMessageList;
     });
  }

  sendMessage(event) {
    if (this.content != '' && event.code != 'Enter') {
      let data = {
        postId: this.q.postId,
        receiverId: this.q.readerId,
        content: this.content
      }
      this._postService.sendMessage(data).subscribe(res=>{
        this.getList();
        this.content = '';
      })
    }
  }
}