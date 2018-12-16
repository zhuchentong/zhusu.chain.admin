import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tx-log',
    templateUrl: 'tx-log.component.html',
    styleUrls: ['tx-log.component.scss']
})
export class TxLogComponent implements OnInit{
  dataSet = [];
  ngOnInit() { 
    for (let i = 1; i < 10; ++i) {
      this.dataSet.push({
        id       : i,
        tx      : '5551234567'+i,
        address  : '1234567890'+i,
        dateCreated : '2014-12-24 23:12:0'+i,
        tokens : i*10 - 30 +1,
        done : i > 5? true:false
        });
      }
  }
}