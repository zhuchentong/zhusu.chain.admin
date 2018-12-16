import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { SettingsService } from '../../common/services/settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OssService } from '../../common/services/oss.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  splashImagesList: any[] = [];
  setting = { bttitle: '保存' };
  isUpdate: boolean;
  deleted: any[] = [];
  constructor(private http: _HttpClient
    , public _msg: NzMessageService
    , private _settingsService: SettingsService
    , private _sanitizer: DomSanitizer
    , private _ossService: OssService
  ) {
    this.isUpdate = false;
  }

  ngOnInit() {
    this.getSplash();
  }

  getSplash() {
    this.initSplashImages();
    this._settingsService.getSplash().subscribe((res: any) => {
      res.forEach(splash => {
        this.splashImagesList.push({
          id: splash.id,
          url: splash.url,
          file: null
        });
      });
    });
  }

  submitForm() {
    if (this.splashImagesList.length === 0) {
      this.deleted.forEach(element => {
        this._settingsService.deleteSplash(element).subscribe(res => { });
      });
      this.initDeleted();
    } else if (this.splashImagesList.length > 0) {
    // if (this.splashImagesList.length > 0) {
    //   this.splashImagesList.forEach(splash => {
    //     splash.id = this.splashImagesList.indexOf(splash);
    //     this._settingsService.updateSplash(splash.id, splash).subscribe(res => {
    //       this._msg.success(`修改成功！`);
    //     });
    //   });
    // } else {
      this.splashImagesList.forEach(splash => {
        if (splash.id && splash.file) {
          // 修改
          this._settingsService.updateSplash(splash.id, { url: splash.cdnUrl }).subscribe(res => { });
          console.log(splash.cdnUrl);
        } else if (!splash.id && splash.file) {
          // 新增
          this._settingsService.saveSplash({ url: splash.cdnUrl }).subscribe(res => { });
        } else if (splash.id && !splash.file) {
          this.deleted.forEach(element => {
            this._settingsService.deleteSplash(element).subscribe(res => { });
          });
          this.initDeleted();
        }
      });
    }
  }

  splashImagesFileChange(event: any, index) {
    if (index !== -1) {
      this.splashImagesList[index] = {
        id: this.splashImagesList[index].id,
        url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[0])),
        file: event.srcElement.files[0],
        filename: event.srcElement.files[0].name,
        ossUrl: null
      };
      console.log(this.splashImagesList[index].id);
    } else {
      for (let i = 0; i < event.srcElement.files.length; i++) {
        this.splashImagesList.push({
          id: null,
          url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.srcElement.files[i])),
          file: event.srcElement.files[i],
          filename: event.srcElement.files[i].name,
          ossUrl: null
        });
        console.log(this.splashImagesList);
      }
    }
  }

  uploadToOss() {
    let expire = sessionStorage.getItem('expire');
    let now = new Date().getTime().toString();
    let dir
    let OSSAccessKeyId
    let host
    let policy
    let signature
    let cdnUrl
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
    if (this.splashImagesList.length !== 0) {
      this.uploadsplashImages(dir, policy, OSSAccessKeyId, signature, host, cdnUrl);
    } else {
      this.submitForm();
    }
  }

  uploadsplashImages(dir, policy, OSSAccessKeyId, signature, host, cdnUrl) {

    if (this.splashImagesList.length === 0) {
      this.submitForm();
    }
    this.splashImagesList.forEach((splash, index) => {
      if (splash.file) {
        const formData: FormData = new FormData();
        const file = splash.file;
        const md5Name = new Date().getTime().toString() + Md5.hashStr(file.name);
        formData.append('name', file.name);
        formData.append('key', `${dir}/${md5Name}`);
        formData.append('policy', policy);
        formData.append('OSSAccessKeyId', OSSAccessKeyId);
        formData.append('signature', signature);
        formData.append('success_action_status', '200');
        formData.append('file', file);
        const urljoin = require('url-join');
        splash.cdnUrl = urljoin(cdnUrl, `/${dir}/${md5Name}`);
        this.http.post(host + '/', formData).subscribe(res => { });
        if (index === this.splashImagesList.length - 1) {
          this.submitForm();
        }
      } else if (index === this.splashImagesList.length - 1) {
        this.submitForm();
      }

    });
  }

  removeFile(type, i, id) {
    if (type === 'splashImages') {
      this.splashImagesList.splice(i, 1);
      this.deleted.push(id);
    }
  }

  initSplashImages() {
    this.splashImagesList = [];
  }

  initDeleted() {
    this.deleted = [];
  }

}
