import { Component,OnInit } from '@angular/core';
import * as format from 'date-fns/format';
import { WalletService } from '../../../common/services/wallet.service';
import { DatePipe } from '@angular/common';
import { RegularService } from '../../../common/services/regular.service';
@Component({
    moduleId: module.id,
    selector: 'wallet',
    templateUrl: 'wallet.component.html',
    styleUrls: ['wallet.component.scss']
})
export class WalletComponent implements OnInit{
  visitData:any[]=[]
  webSite:any[]=[]

  txLogList:any[]=[];
  count:number;
  pageindex = 1
  q = {
    max: 5,
    offset: 0,
    tx:'',
    src:'',
    dest:'',
    done:'',
    usage:'',
    startTime:'',
    endTime:''
  }
  usageList:any[]=[];
  usageMap:any;
  doneList:any[]=[];
  loading = true;
  dateFormat:any;
  date:any;
  constructor(private _walletService: WalletService
             ,private _datePipe: DatePipe
             ,private _regularService: RegularService) {

    this.dateFormat = 'yyyy/MM/dd';
    this.usageMap = {'PLEDGE': '质押', 'REFUND': '取回', 'SELL':'卖', 'BUY':'买'};
    this.usageList = [{label:'全部',value:''},
                      {label:'质押',value:'PLEDGE'},
                      {label:'取回',value:'REFUND'},
                      {label:'卖',value:'SELL'},
                      {label:'买',value:'BUY'}]
    this.doneList = [{label:'全部',value:''},
                      {label:'是',value:'true'},
                      {label:'否',value:'false'}]
  }
  ngOnInit() { 
    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      this.visitData.push({
          x: format(new Date(beginDay + (1000 * 60 * 60 * 24 * i)), 'YYYY-MM-DD'),
          y: Math.floor(Math.random() * 100) + 10,
      });
    }
    this.webSite = this.visitData.slice(0, 10);
    this.getList();
  }

  getList() {
    this.loading = true;
    for (var i in this.q) {
      if (this._regularService.isBlank(this.q[i])) {
        delete this.q["" + i + ""]
      }
    }
    this._walletService.getTxLogList(this.q).subscribe((res:any)=>{
      this.txLogList = res.txLogList;
      this.count = res.txLogCount
      this.loading = false;
    })
  }

  pageIndexChange(pageindex: number) {
    this.q.offset = this.q.max * (pageindex - 1)
    this.getList()
  }

  searchData() {
    this.q.offset = 0;
    this.pageindex = 1;
    this.getList();
  }
  selectDate() {
    console.log(this.date)
    this.q.startTime = this._datePipe.transform(this.date[0], 'yyyy-MM-dd HH:mm');
    this.q.endTime = this._datePipe.transform(this.date[1], 'yyyy-MM-dd HH:mm');
    this.searchData()
  }
}
