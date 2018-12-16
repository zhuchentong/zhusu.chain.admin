import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { PostService } from '../../common/services/post.service';
import { UserService } from '../../common/services/user.service';
import { RegularService } from '../../common/services/regular.service';
import { EmitService } from '../../common/services/emit.service';

@Component({
    moduleId: module.id,
    selector: 'post',
    templateUrl: 'post.component.html',
    styleUrls: ['post.component.scss']
})
export class PostComponent implements OnInit{

  postList: any[]=[];
  count:number;
  pageindex = 1
  q: any = {
    offset: 0,
    max: 10,
    status:null
  };
  statusMap:any;
  statusList = [
    { label: '待审核', value: 'DRAFT' },
    { label: '已发布', value: 'PUBLISHED' },
    { label: '已拒绝', value: 'REFUSED' }
  ];
  post:any;
  isVisible:boolean;
  modalTitle:any;
  status:any;
  reason:any;
  post_isVisible: boolean;
  readers: any;
  userList:any[]=[];
  refuse_isVisible = false;
  message_isVisible = false;
  loading = true;
  postMessageList:any[]=[];
  postMessageCount:number;
  pageindex_postMessage = 1;
  q_postMessage: any = {
    offset: 0,
    max: 10,
    postId:null,
    filter:'post'
  };

  postCountByWriter: number;

  detail_isVisible = false;
  detail_msg_isVisible = false;
  constructor( private router: Router
    , private _msg: NzMessageService
    , private _postService: PostService
    , private _userService: UserService
    , private _regularService: RegularService
    , private _emitService: EmitService) {
      this.statusMap = {'DRAFT': '待审核', 'PUBLISHED': '已发布', 'REFUSED':'已拒绝'};
      this.readers = null;
      this.isVisible = false;
      this.post_isVisible = false;
      this.status = null;
      this.post = {
        id:null,
        writer:{
          displayName:'',
          username:''
        },
        title:'',
        dateCreated:'',
        content:''
      }
  }
  ngOnInit() { 
  this.q.status = 'DRAFT';
  this.getList();
  }
  selectStatus() {
    this.pageindex = 1
    this.q.offset = 0
    this.getList();
  }
  getList() {
    this.loading = true;
    this._postService.getPostList(this.q).subscribe((res:any)=>{
      this.postList = res.postList
      this.count = res.postCount
      this.loading = false;
    });
  }
  //以后需要异步加载
  getUserList() {
    this._userService.getUserList({offset:0,max:100}).subscribe((res:any)=>{
      this.userList = [];
      res.userList.forEach(user => {
        this.userList.push({label: user.displayName+"【"+user.username+"】",value: user.id})
      });
      this.post_isVisible = true;
    });
  }
  pageIndexChange(pageindex: number) {
    this.q.offset = this.q.max * (pageindex - 1)
    this.getList()
  }

  pageIndexPostMessage(pageindex: number) {
    this.q_postMessage.offset = this.q_postMessage.max * (pageindex - 1)
    this.getPostMessageByPost()
  }

  check(data){
    this.getPostCountByWriter(data.writer.id)
    this._postService.getPost(data.id).subscribe(res=>{
        this.post = res;
        this.modalTitle = '审核广告'
        this.isVisible = true;
    });
  }

  getPostCountByWriter(writerId){
    this._postService.getPostList({writerId:writerId, status:'PUBLISHED', max:1}).subscribe((res:any)=>{
      this.postCountByWriter = res.postCount
    })
  }

  clickBtn(type) {
    if(type === 'ok'){
      this.reason = null;
      this.status = 'PUBLISHED';
      this.submitCheck();
    }else if(type === 'refuse') {
      this.refuse_isVisible = true;
    }

  }

  refuse() {
    if(!this.validateCheck()){
      return;
    }
    this.status = 'REFUSED';
    this.submitCheck();
  }
  cancelRefuse() {
    this.refuse_isVisible = false;
    this.reason = null;
    this.status = null;
  }
  submitCheck() {
     this._postService.checkPOST({id:this.post.id,reason:this.reason,status:this.status}).subscribe(res=>{
      this.status === 'REFUSED'?this._msg.success(`已拒绝！`):this._msg.success(`发布成功！`)
      this.reason = null;
      this.status = null;
      this.isVisible = false;
      this.refuse_isVisible = false;
      this.getList();
    })
  }

  submitPost() {
    if(!this.validatePost()) {
      return
    }
    this._postService.savePost({title:this.post.title,
                                content: this.post.content,
                                readers:this.readers}).subscribe(res=>{
        this._msg.success(`新增成功！`);
        this.post_isVisible = false;
        this.getList();
    })
  }
  toMessage(post) {
    this.q_postMessage.offset = 0;
    this.q_postMessage.postId = post.id;
    this.getPostMessageByPost()
  }

  getPostMessageByPost() {
    this._postService.getMessageByPost(this.q_postMessage).subscribe((res:any)=>{
      console.log(res)
      this.postMessageList = res.postMessageList;
      this.postMessageCount = res.postMessageCount
      this.message_isVisible = true;

    })
  }
  cancelMessage() {
    this.message_isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
    this.reason = null;
    this.status = 'PUBLISHED';
    this.post_isVisible = false;
  }

  addPost() {
    this.modalTitle = '新增广告'
    this.post.title = null;
    this.post.content = null;
    this.readers = [];
    this.getUserList();
  }

  validatePost() {
    let validate = this._regularService.isBlank(this.post.title)
    if (validate) {
      this._msg.error('请输入标题!')
      return false
    }
    validate = this._regularService.isBlank(this.post.content)
    if (validate) {
      this._msg.error('请输入内容!')
      return false
    }
    return true;
  }

  validateCheck() {
    let validate = this._regularService.isBlank(this.reason)
    if (validate) {
      this._msg.error('请输入拒绝原因!')
      return false
    }
    return true;
  }
  showUserDetail(id) {
    this._emitService.eventEmit.emit({type:'userDetail',id:id});
  }

  toDetail(data) {
    this._postService.getPost(data.id).subscribe(res=>{
        this.post = res;
        this.modalTitle = '广告详情'
        this.detail_isVisible = true;
        this.detail_msg_isVisible = true;
    });
  }

  cancelDetail() {
    this.detail_isVisible = false;
    this.detail_msg_isVisible = false;
  }
}