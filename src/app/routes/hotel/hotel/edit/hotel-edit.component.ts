import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorConfig } from '../../../../common/editor/model/editor-config';
import { HotelService } from '../../../../common/services/hotel.service';
import { RegularService } from '../../../../common/services/regular.service';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { OssService } from '../../../../common/services/oss.service';
import { Md5 } from 'ts-md5';
@Component({
  selector: 'hotel-edit',
  templateUrl: 'hotel-edit.component.html',
  styleUrls: ['hotel-edit.component.scss']
})
export class HotelEditComponent implements OnInit {
  hotel = {
    id: null,
    name: null,
    hotelType: null,
    totalRanking: null,
    commenterCount: null,
    location: null,
    description: null,
    tags: null,
    managerId: null,
    englishName: null,
    grand: null,
    facilities: null,
    contact: null,
    photos: null
  };
  imagesList: any[] = [];
  hotelTypeList: any[] = [];
  tagList: any[] = [];
  facilitiesList: string[] = ['餐厅', '免费WiFi', '残障通道'];
  setting = { title: '新增', bttitle: '保存' };
  isUpdate: boolean;
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;
  constructor(private router: Router
    , public _msg: NzMessageService
    , private _hotelService: HotelService
    , private _regularService: RegularService
    , private _activedRoute: ActivatedRoute
    , private http: _HttpClient
    , private _sanitizer: DomSanitizer
    , private _ossService: OssService) {
  }
  ngOnInit() {
    this.hotelTypeList = [{ label: '酒店', value: 'HOTEL' }
      , { label: '民宿', value: 'HOMESTAY' }
    ];
    this._activedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id === 0) {
        this.hotel.tags.forEach(tag => {
          tag.checked = false;
        });
      } else if (id > 0) {
        this.hotel.id = id;
        this.getHotel();
      }
      this.getTagList();
    });
    this.isUpdate = false;
  }


  return() {
    this.router.navigateByUrl(`/hotel`);
  }

  grandChanged() {
    console.log(this.hotel.grand);
  }

  getHotel() {
    this.initimages();
    this._hotelService.getHotel(this.hotel.id).subscribe((res: any) => {
      this.hotel = res;
      this.imagesList = [];
      if (this.hotel.photos) {
        this.hotel.photos.forEach(b => {
          this.imagesList.push({ url: b, file: null, filename: null, ossUrl: b });
        });
      }
      if (this.hotel.tags) {
        this.hotel.tags.forEach(tag => {
          tag.checked = true;
        });
      }
    });
  }

  getTagList() {
    this._hotelService.getTagList().subscribe((res: any) => {
        console.log(res);
        if (res[0] !== null) {
            this.tagList = res;
        }
    });
  }

  tagCheckChange(e: boolean, id): void {
    this.hotel.tags.push(id);
  }

  facilityCheckChange(e: boolean, facility) {
    this.hotel.facilities.push(facility);
  }

  handleClose(removedTag: {}): void {
    this.facilitiesList = this.facilitiesList.filter(facility => facility !== removedTag);
  }

  sliceTagName(facility: string): string {
    const isLongTag = facility.length > 20;
    return isLongTag ? `${facility.slice(0, 20)}...` : facility;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.facilitiesList.indexOf(this.inputValue) === -1) {
      this.facilitiesList.push(this.inputValue);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  submitForm() {
    this.hotel.photos = [];
    this.imagesList.forEach(image => {
      this.hotel.photos.push(image.ossUrl);
    });
    if (this.imagesList.length === 0) {
      this.hotel.photos = null;
    }
    if (this.hotel.id > 0) {
      this._hotelService.updateHotel(this.hotel.id, this.hotel).subscribe(res => {
        this._msg.success(`修改成功！`);
        this.router.navigateByUrl(`/hotels`);
      });
    } else {
      this.hotel.totalRanking = 0;
      this.hotel.commenterCount = 0;
      this._hotelService.saveHotel(this.hotel).subscribe(res => {
        this._msg.success(`新增成功！`);
        this.router.navigateByUrl(`/hotels`);
      });
    }
  }

  imagesFileChange(event: any, index) {
    if (index !== -1) {
      this.imagesList[index] = {
        url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[0])),
        file: event.srcElement.files[0],
        filename: event.srcElement.files[0].name,
        ossUrl: null
      };
    } else {
      for (let i = 0; i < event.srcElement.files.length; i++) {
        this.imagesList.push({
          url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[i])),
          file: event.srcElement.files[i],
          filename: event.srcElement.files[i].name,
          ossUrl: null
        });
      }
    }
  }

  uploadToOss() {
    if (!this.validateHotels()) {
      return;
    }
    const expire = sessionStorage.getItem('expire');
    const now = new Date().getTime().toString();
    let dir;
    let OSSAccessKeyId;
    let host;
    let policy;
    let signature;
    let cdnUrl;
    if (now >= expire) {
      this._ossService.getSecurityToken().subscribe((res: any) => {
        console.log(res);
        sessionStorage.setItem('accessKeyId', res.accessKeyId);
        sessionStorage.setItem('dir', res.dir);
        sessionStorage.setItem('expire', res.expire);
        sessionStorage.setItem('host', res.host);
        sessionStorage.setItem('policy', res.policy);
        sessionStorage.setItem('signature', res.signature);
        sessionStorage.setItem('cdnUrl', res.cdnUrl);

        dir = res.dir;
        OSSAccessKeyId = res.accessKeyId;
        host = res.host;
        policy = res.policy;
        signature = res.signature;
        cdnUrl = res.cdnUrl;
        this.setImage(dir, policy, OSSAccessKeyId, signature, host, cdnUrl);
      });
    } else {
      dir = sessionStorage.getItem('dir');
      OSSAccessKeyId = sessionStorage.getItem('accessKeyId');
      host = sessionStorage.getItem('host');
      policy = sessionStorage.getItem('policy');
      signature = sessionStorage.getItem('signature');
      cdnUrl = sessionStorage.getItem('cdnUrl');
      this.setImage(dir, policy, OSSAccessKeyId, signature, host, cdnUrl);
    }
  }
  setImage(dir, policy, OSSAccessKeyId, signature, host, cdnUrl) {
    if (this.imagesList.length !== 0) {
      this.uploadimages(dir, policy, OSSAccessKeyId, signature, host, cdnUrl);
    } else {
      this.submitForm();
    }
  }
  uploadimages(dir, policy, OSSAccessKeyId, signature, host, cdnUrl) {

    if (this.imagesList.length === 0) {
      this.submitForm();
    }
    this.imagesList.forEach((image, index) => {
      if (image.file) {
        const formData: FormData = new FormData();
        const file = image.file;
        const md5Name = new Date().getTime().toString() + Md5.hashStr(file.name);
        formData.append('name', file.name);
        formData.append('key', `${dir}/${md5Name}`);
        formData.append('policy', policy);
        formData.append('OSSAccessKeyId', OSSAccessKeyId);
        formData.append('signature', signature);
        formData.append('success_action_status', '200');
        formData.append('file', file);
        image.cdnUrl = cdnUrl + `/${dir}/${md5Name}`;
        this.http.post(host + '/', formData).subscribe(res => {});
        if (index === this.imagesList.length - 1) {
          this.submitForm();
        }
      } else if (index === this.imagesList.length - 1) {
        this.submitForm();
      }

    });
  }

  img_order(type, i) {
    let img_temp;
    if (type === 'left') {
      img_temp = this.imagesList[i];
      this.imagesList[i] = this.imagesList[i - 1];
      this.imagesList[i - 1] = img_temp;
    } else if (type === 'right') {
      img_temp = this.imagesList[i];
      this.imagesList[i] = this.imagesList[i + 1];
      this.imagesList[i + 1] = img_temp;
    }
  }
  removeFile(i) {
      this.imagesList.splice(i, 1);
  }

  initimages() {
    this.imagesList = [];
  }

  validateHotels() {
    let validate = this._regularService.isBlank(this.hotel.name);
    if (validate) {
      this._msg.error('酒店名称不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.hotelType);
    if (validate) {
      this._msg.error('酒店类型不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.totalRanking);
    if (this.hotel.id > 0 && validate) {
      this._msg.error('评分数不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.commenterCount);
    if (this.hotel.id > 0 && validate) {
      this._msg.error('评论数不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.location);
    if (validate) {
      this._msg.error('位置描述不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.description);
    if (validate) {
      this._msg.error('酒店描述不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.managerId);
    if (validate) {
      this._msg.error('管理员不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.englishName);
    if (validate) {
      this._msg.error('酒店英文名不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.grand);
    if (validate) {
      this._msg.error('酒店星级不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotel.contact);
    if (validate) {
      this._msg.error('联系方式不能为空！');
      return false;
    }
    return true;
  }
}
