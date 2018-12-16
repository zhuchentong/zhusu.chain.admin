import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorConfig } from '../../../../common/editor/model/editor-config';
import { HotelService } from '../../../../common/services/hotel.service';
import { RegularService } from '../../../../common/services/regular.service';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { OssService } from '../../../../common/services/oss.service';
import { Md5 } from "ts-md5";
@Component({
  selector: 'hotel-edit',
  templateUrl: 'hotel-edit.component.html',
  styleUrls: ['hotel-edit.component.scss']
})
export class HotelEditComponent implements OnInit {
  hotels = {
    id: null,
    name: null,                    // 名称
    recommendationIndex: 10,       // 推荐指数
    stack: { id: null },                 // 商品区域和货架
    tag: { id: null },
    isOnSale: false,               // 是否上架
    points: 100,

    homeImageUrl: null,
    bannerImageUrls: null,

    body: '',

    attrs: null,
    addons: null
  };
  homeImage: any;
  bannerImagesList: any[] = [];
  zoneAndStackList: any[] = [];
  zoneAndStack: any[] = [];
  setting = { title: '新增', bttitle: '保存' };
  tagList: any[] = [];
  tagAttr: any[] = [];

  addonsList: any[] = [];
  editObj: any;
  editIndex = -1;
  isUpdate: boolean;
  constructor(private router: Router
    , public _msg: NzMessageService
    , private _HotelService: HotelService
    , private _regularService: RegularService
    , private _activedRoute: ActivatedRoute
    , private http: _HttpClient
    , private _sanitizer: DomSanitizer
    , private _ossService: OssService) {

    this.tagAttr = [];
    this._activedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id > 0) {
        this.hotels.id = id;
        this.getHotel();
      } else {
        this.getTagList();
      }
    });
    this.initHomeImage();
  }
  ngOnInit() {
    this.isUpdate = false;
  }


  return() {
    this.router.navigateByUrl(`/hotels`);
  }
  conf = new EditorConfig();
  markdown = '';

  // 同步属性内容
  syncModel(str): void {
    this.markdown = str;
  }

  private getTagList() {
    this._HotelService.getTagList().subscribe((res: any) => {
      res.forEach(el => {
        this.tagList.push({ value: el.id, label: el.name, attr: el.attrsDef });
      });
    });
  }

  add() {
    this.addonsList.push({ name: '', describe: '' });
    this.editObj = { name: '', describe: '' };
    this.edit(this.addonsList.length - 1);
  }

  del(index: number) {
    this.addonsList.splice(index, 1);
    this.editIndex = -1;
  }

  edit(index: number) {
    this.editObj = JSON.parse(JSON.stringify(this.addonsList[index]));
    this.editIndex = index;
  }

  save(index: number) {
    if (this.isNullAttr(index)) {
      return;
    }
    this.editIndex = -1;
  }

  cancel(index: number) {
    if (this._regularService.isBlank(this.editObj.name)) {
      this.del(index);
    } else {
      this.addonsList[index] = this.editObj;
    }
    this.editIndex = -1;
  }

  isNullAttr(index: number) {
    if (this._regularService.isBlank(this.addonsList[index].name) ||
      this._regularService.isBlank(this.addonsList[index].describe)) {
      this._msg.error('属性名或描述不能为空');
      return true;
    }
    return false;
  }

  getHotel() {
    this.initHomeImage();
    this.initBannerImages();
    this._HotelService.getHotel(this.hotels.id).subscribe((res: any) => {
      this.hotels = res;
      this.homeImage.url = this.hotels.homeImageUrl;
      this.homeImage.ossUrl = this.hotels.homeImageUrl;
      this.bannerImagesList = [];
      if (this.hotels.bannerImageUrls) {
        this.hotels.bannerImageUrls.forEach(b => {
          this.bannerImagesList.push({ url: b, file: null, filename: null, ossUrl: b });
        });
      }
      this.attrToList(this.hotels.tag.id);
      this.addonsToList();
    });
  }
  submitForm() {
    this.hotels.bannerImageUrls = [];
    this.hotels.homeImageUrl = this.homeImage.ossUrl;
    this.bannerImagesList.forEach(banner => {
      this.hotels.bannerImageUrls.push(banner.ossUrl);
    });
    if (this.bannerImagesList.length === 0) {
      this.hotels.bannerImageUrls = null;
    }
    if (this.hotels.id > 0) {
      this.hotels.tag = { id: this.hotels.tag.id };
      this._HotelService.updateHotel(this.hotels.id, this.hotels).subscribe(res => {
        this._msg.success(`修改成功！`);
        this.router.navigateByUrl(`/hotels`);
      });
    } else {
      this._HotelService.saveHotel(this.hotels).subscribe(res => {
        this._msg.success(`新增成功！`);
        this.router.navigateByUrl(`/hotels`);
      });
    }
  }

  addTagId(event) {
    this.attrToList(event[0]);
  }

  attrToList(event) {
    this.tagList = [];
    this._HotelService.getTagList().subscribe((res: any) => {
      res.forEach(el => {
        this.tagList.push({ value: el.id, label: el.name, attr: el.attrsDef });
      });
      const map = this.tagList.find(c => c.value === event).attr;
      this.hotels.attrs = map;
      this.hotels.tag.id = event;
      this.tagAttr = [];
      for (const key in map) {
        this.tagAttr.push({ name: key, describe: map[key] });
      }
    });
  }

  addonsToMap() {
    this.hotels.addons = {};
    this.addonsList.forEach(addons => {
      this.hotels.addons[addons.name] = addons.describe;
    });
  }

  addonsToList() {
    const map = this.hotels.addons;
    this.addonsList = [];
    for (const key in map) {
      this.addonsList.push({ name: key, describe: map[key] });
    }
  }

  homeImageFileChange(event: any) {
    this.initHomeImage();
    const file = event.srcElement.files[0];
    this.homeImage.file = file;
    this.homeImage.filename = file.name;
    this.homeImage.url = this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  bannerImagesFileChange(event: any, index) {
    if (index !== -1) {
      this.bannerImagesList[index] = {
        url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[0])),
        file: event.srcElement.files[0],
        filename: event.srcElement.files[0].name,
        ossUrl: null
      };
    } else {
      for (let i = 0; i < event.srcElement.files.length; i++) {
        this.bannerImagesList.push({
          url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[i])),
          file: event.srcElement.files[i],
          filename: event.srcElement.files[i].name,
          ossUrl: null
        });
      }
    }
  }

  uploadToOss() {
    this.addonsToMap();
    this.hotels.stack = { id: null };
    this.hotels.stack.id = this.zoneAndStack[2];
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
        this.setImage(dir, policy, OSSAccessKeyId, signature, host);
      });
    } else {
      dir = sessionStorage.getItem('dir');
      OSSAccessKeyId = sessionStorage.getItem('accessKeyId');
      host = sessionStorage.getItem('host');
      policy = sessionStorage.getItem('policy');
      signature = sessionStorage.getItem('signature');
      cdnUrl = sessionStorage.getItem('cdnUrl');
      this.setImage(dir, policy, OSSAccessKeyId, signature, host);
    }
  }
  setImage(dir, policy, OSSAccessKeyId, signature, host) {
    if (this.homeImage.file) {
      this.uploadHomeImage(dir, policy, OSSAccessKeyId, signature, host);
    } else if (this.bannerImagesList.length !== 0) {
      this.uploadBannerImages(dir, policy, OSSAccessKeyId, signature, host);
    } else {
      this.submitForm();
    }
  }

  uploadHomeImage(dir, policy, OSSAccessKeyId, signature, host) {
    const formData: FormData = new FormData();
    const file = this.homeImage.file;
    const md5Name = new Date().getTime().toString() + Md5.hashStr(file.name);
    formData.append('name', file.name);
    formData.append('key', `${dir}/${md5Name}`);
    formData.append('policy', policy);
    formData.append('OSSAccessKeyId', OSSAccessKeyId);
    formData.append('signature', signature);
    formData.append('success_action_status', '200');
    formData.append('file', file);

    this.http.post(host + '/', formData).subscribe(res => {
      this.homeImage.ossUrl = `${host}/${dir}/${md5Name}`;
      this.uploadBannerImages(dir, policy, OSSAccessKeyId, signature, host);
    });
  }
  uploadBannerImages(dir, policy, OSSAccessKeyId, signature, host) {
    console.log(this.homeImage.ossUrl);

    if (this.bannerImagesList.length === 0) {
      this.submitForm();
    }
    this.bannerImagesList.forEach((banner, index) => {
      if (banner.file) {
        const formData: FormData = new FormData();
        const file = banner.file;
        const md5Name = new Date().getTime().toString() + Md5.hashStr(file.name);
        formData.append('name', file.name);
        formData.append('key', `${dir}/${md5Name}`);
        formData.append('policy', policy);
        formData.append('OSSAccessKeyId', OSSAccessKeyId);
        formData.append('signature', signature);
        formData.append('success_action_status', '200');
        formData.append('file', file);
        this.http.post(host + '/', formData).subscribe(res => {
          banner.ossUrl = host + `/${dir}/${md5Name}`;
          if (index === this.bannerImagesList.length - 1) {
            this.submitForm();
          }
        });
      } else if (index === this.bannerImagesList.length - 1) {
        this.submitForm();
      }

    });
  }

  img_order(type, i) {
    let img_temp;
    if (type === 'left') {
      img_temp = this.bannerImagesList[i];
      this.bannerImagesList[i] = this.bannerImagesList[i - 1];
      this.bannerImagesList[i - 1] = img_temp;
    } else if (type === 'right') {
      img_temp = this.bannerImagesList[i];
      this.bannerImagesList[i] = this.bannerImagesList[i + 1];
      this.bannerImagesList[i + 1] = img_temp;
    }
  }
  removeFile(type, i) {
    if (type === 'homeImage') {
      this.initHomeImage();
    } else if (type === 'bannerImages') {
      this.bannerImagesList.splice(i, 1);
    }
  }

  initHomeImage() {
    this.homeImage = {
      url: null,
      file: null,
      filename: null,
      ossUrl: null
    };
  }
  initBannerImages() {
    this.bannerImagesList = [];
  }

  validateHotels() {
    let validate = this._regularService.isBlank(this.hotels.name);
    if (validate) {
      this._msg.error('商品名称不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotels.stack.id);
    if (validate) {
      this._msg.error('区域/货架不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotels.recommendationIndex);
    if (validate) {
      this._msg.error('推荐指数不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotels.points);
    if (validate) {
      this._msg.error('信用分不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotels.tag.id);
    if (validate) {
      this._msg.error('商品分类不能为空！');
      return false;
    }
    validate = this._regularService.isBlank(this.hotels.body);
    if (validate) {
      this._msg.error('商品详情不能为空！');
      return false;
    }
    return true;
  }
}
