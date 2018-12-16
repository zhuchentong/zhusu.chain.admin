import { Component, OnInit } from '@angular/core';
import { RegularService } from '../../../common/services/regular.service';
import { NzMessageService } from 'ng-zorro-antd';
import { HotelService } from '../../../common/services/hotel.service';
import { isThisQuarter } from 'date-fns';

@Component({
    moduleId: module.id,
    selector: 'tag',
    templateUrl: 'tag.component.html',
    styleUrls: ['tag.component.scss']
})
export class TagComponent implements OnInit {

    modalTitle: any;
    action: any;

    isVisible: boolean;
    pageindex = 1;
    tagList: any[] = [];
    tag: any;
    editObj: any;
    constructor(private _msg: NzMessageService
        , private _regularService: RegularService
        , private _hotelService: HotelService) {
        this.isVisible = false;
        this.action = '';
        this.modalTitle = '';
        this.tag = {
            id: null,
            name: ''
        };

    }

    ngOnInit() {
        this.getList();
    }

    initTag() {
        this.tag = {
            name: ''
        };
    }
    getList() {
        this._hotelService.getTagList().subscribe((res: any) => {
            console.log(res);
            if (res[0] !== null) {
                this.tagList = res;
            }
        });
    }

    addTag() {
        this.action = 'add';
        this.modalTitle = '新增分类';
        this.initTag();
        this.isVisible = true;

    }

    handleCancel() {
        this.isVisible = false;
    }

    saveTag() {
        if (!this.validateTag()) {
            return;
        }
        console.log(this.tag);
        if (this.action === 'add') {
            this._hotelService.saveTag(this.tag).subscribe(res => {
                this.isVisible = false;
                this._msg.success(`新增成功！`);
                this.getList();
            },
                err => {
                    console.log(err);
                });
        } else {
            this._hotelService.updateTag(this.tag.id, this.tag).subscribe(res => {
                this.isVisible = false;
                this._msg.success(`修改成功！`);
                this.getList();
            });
        }
    }

    editTag(id) {
        this.modalTitle = '修改分类';
        this._hotelService.getTag(id).subscribe((res: any) => {
            this.action = 'edit';
            this.tag = {
                id: res.id,
                name: res.name,
            };
            this.isVisible = true;
        });
    }

    deleteTag(id) {
        this._hotelService.deleteTag(id).subscribe(res => {
            this._msg.success(`删除成功！`);
            this.getList();
        });
    }

    validateTag() {
        const validate = this._regularService.isBlank(this.tag.name);
        if (validate) {
            this._msg.error('请输入分类名!');
            return false;
        }
        return true;
    }

}
