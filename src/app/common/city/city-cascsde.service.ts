import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { data } from './city-cascade-data';
import { CommonService } from '../services/common.service';

@Injectable()
export class CityCascsdeService implements OnInit {

  data: any;
  constructor(private _commonService: CommonService) {
    this.data = data;
  }

  ngOnInit() {
  }
  getCityCascsde() {
    return this.data;
  }

  getCode(value) {
    const arr = [];
    value.forEach(v => {
      const temp = v.split('-');
      temp.forEach(t => {
        arr.push(t + '');
      });
    });
    let code = this._commonService.getUniqueArr(arr);
    let deconsteIndex = [];
    const copyCode = JSON.parse(JSON.stringify(code));
    code.forEach((c: String, indexc) => {
      copyCode.forEach((o, indexo) => {
        if (indexc !== indexo) {
          if (o.startsWith(c + '')) {
            deconsteIndex.push(indexc);
          }
        }
      });
    });
    deconsteIndex = this._commonService.getUniqueArr(deconsteIndex);
    deconsteIndex.forEach(d => {
      code[d] = '';
    });
    code = code.filter(c => c !== '');
    return code;
  }
}
