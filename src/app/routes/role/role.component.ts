import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../../common/url'
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from "@angular/forms";
@Component({
    selector: 'role',
    templateUrl: 'role.component.html',
    styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit{
  
  roleList = []
  q = {
    max: 100,
    offset: 0,
    order: 'asc',
    sort: 'id'
  }
  roleForm : FormGroup
  isVisible = false
  modalTitle:string
  editCache = {};
  constructor(private http: _HttpClient
    , private fb: FormBuilder 
    , public msg: NzMessageService
    , private modalService: NzModalService
    , private _router: Router){
    //this.getRoleList()
  }
  ngOnInit() { 
    this.roleForm = this.fb.group({
      authority: [null, [Validators.required]]
    });
  }
  getRoleList(){
    this.http.get(URL.ROLE_LIST, this.q).subscribe((res:any)=> {
      console.log(res)
      this.roleList = res.list
      this.updateEditCache()
    })
  }
  addRole(){
    this.isVisible =  true;
    this.modalTitle = '新增组织'
    this.roleForm.setValue({
      authority: null
    })
  }
  //应用表格中的编辑
  startEdit(id: string): void {
    this.editCache[ id ].edit = true;
  }
  //应用表格中的撤销
  cancelEdit(id: string): void {
    this.editCache[ id ].edit = false;
  }
  //应用表格中的保存
  saveEdit(id: string): void {
    const index = this.roleList.findIndex(item => item.key === id);
    this.roleList[ index ] = this.editCache[ id ].data;
    this.editCache[ id ].edit = false;
    this.http.put(URL.ROLE_LIST+'/'+id,this.editCache[ id ].data).subscribe((res:any)=> {
      this.msg.success(`修改成功！`);
      this.getRoleList()
    })

  }
  updateEditCache(): void {
    this.roleList.forEach(item => {
      if (!this.editCache[ item.id ]) {
        this.editCache[ item.id ] = {
          edit: false,
          data: item
        };
      }
    });
  }
  deleteApp(id){
    this.http.delete(URL.ROLE_LIST+'/'+ id).subscribe((res:any)=> {
      this.msg.success(`删除成功！`);
      this.getRoleList()
    })
  }
  serviceSubmit(){
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    if (this.roleForm.invalid) return;
    this.http.post(URL.ROLE_LIST, this.roleForm.value).subscribe((res:any)=> {
      this.isVisible = false;
      this.msg.success(`新增成功！`);
      this.getRoleList()
    },
    error =>{
      console.log('oops', error)
    });
  }
  cancel(){
    this.isVisible =  false;
  }
  toUser(event){
    this._router.navigateByUrl(`user/role/${event}`);
  }
}
