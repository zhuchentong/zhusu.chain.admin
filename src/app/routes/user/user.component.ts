import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../common/services/user.service';
import { RegularService } from '../../common/services/regular.service';
import { EmitService } from '../../common/services/emit.service';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit {

  userType: any;
  userList: any[] = [];
  roleList: any[] = [];
  count: number;
  pageindex = 1;
  q = {
    max: 10,
    offset: 0,
    role: ''
  };

  user_isVisible = false;
  modalTitle: string;
  user = {
    username: '',
    password: '',
    displayName: '',
    enabled: true,
    role: ''
  };

  loading = false;
  userDetailId: any;
  isShowDetail: boolean;
  constructor(
    public _msg: NzMessageService
    , private activedRoute: ActivatedRoute
    , private _userService: UserService
    , private _regularService: RegularService
    , private _emitService: EmitService) {
    this.roleList = [{ label: '用户', value: 'ROLE_YH' }
      , { label: '酒店管理员', value: 'ROLE_SELLER' }
      , { label: '系统管理员', value: 'ROLE_ADMIN' }
    ];
    this.userType = this.roleList[0].value;
    this.q.role = this.roleList[0].value;
    this.modalTitle = '';
    this.isShowDetail = false;
  }

  ngOnInit() {
    this.activedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.getData();
    });

  }

  initUser() {
    this.user = {
      username: '',
      password: '888888',
      displayName: '',
      enabled: true,
      role: ''
    };
  }

  getData() {
    this.loading = true;
    this._userService.getUserList(this.q).subscribe((res: any) => {
      this.userList = res.userList;
      this.count = res.userCount;
      this.loading = false;
    });
  }

  accountLocked(i, operation) {
    this._userService.frozenUser(i.id, operation).subscribe(res => {
      operation === 'frozen' ? this._msg.success('冻结用户成功！') : this._msg.success('解冻用户成功！');
      this.getData();
    });
  }

  resetPassword(username) {
    this._userService.resetPassword(username).subscribe(res => {
      this._msg.success('重置密码成功，新密码已通过短信发送给该用户');
      this.getData();
    });
  }

  selectRole(event) {
    this.userType = event;
    this.pageindex = 1;
    this.q.offset = 0;
    this.getData();
  }

  addUser() {
    this.initUser();
    this.modalTitle = '新增';
    this.user_isVisible = true;
  }

  saveUser() {
    if (!this.validateUser()) {
      return false;
    }
    this._userService.saveUser(this.user).subscribe(res => {
      this._msg.success(`新增成功！`);
      this.getData();
      this.user_isVisible = false;
    });
  }

  validateUser() {
    let validate = this._regularService.isBlank(this.user.displayName);
    if (validate) {
      this._msg.error('昵称不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.user.username);
    if (validate) {
      this._msg.error('手机号不能为空！');
      return false;
    }
    if (this.user.username.length !== 11) {
      this._msg.error('请输入正确的手机号！');
      return false;
    }

    return true;
  }

  showDetail(id) {
    this._emitService.eventEmit.emit({ type: 'userDetail', id: id });
  }

  handleCancel() {
    this.user_isVisible = false;
  }
}
