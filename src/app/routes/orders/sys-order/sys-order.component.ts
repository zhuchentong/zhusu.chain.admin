import { Component } from '@angular/core';
import { OrderService } from '../../../common/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from '../../../common/services/wallet.service';
import { UserService } from '../../../common/services/user.service';
import { EmitService } from '../../../common/services/emit.service';
@Component({
    moduleId: module.id,
    selector: 'sys-order',
    templateUrl: 'sys-order.component.html',
    styleUrls: ['sys-order.component.scss']
})
export class SysOrderComponent {

    orderList: any[] = [];
    count: number;
    pageindex = 1;
    q = {
        max: 10,
        offset: 0,
        status: ''
    };
    loading = true;
    details_isVisible = false;

    executionList: any[] = [];
    executionStepList: any[] = [];
    currentStep: number;
    statusList = [
        { label: '全部', value: '' },
        { label: '创建', value: 'CREATED' },
        { label: '确认', value: 'CONFIRMED' },
        { label: '入住', value: 'CHECKIN' },
        { label: '离开', value: 'CHECKOUT' },
        { label: '取消', value: 'CANCELED' },
    ];
    statusMap: any;

    order: any;

    constructor(private _orderService: OrderService
        , private _walletService: WalletService
        , private router: Router
        , private _emitService: EmitService) {
        this.statusMap = {
            'CREATED': '创建', 'CONFIRMED': '确认', 'CHECKIN': '入住',
            'CHECKOUT': '离开', 'CANCELED': '取消'
        };

        this.initData();
    }
    initData() {
        this.order = {
            id: null,
            orderNo: null,
            status: null,
            points: 0,
            address: null,
            invoice: null,
            billing: null,
            confirmedBySeller: null,
            dateCreated: null,
            dateSigned: null,
            buyer: {
                username: null,
                displayName: null
            },
            seller: {
                username: null,
                displayName: null
            },
            deadlineP1: null,
            paymentP1: null,
            deadlineP2: null,
            paymentP2: null,
            deadline: null
        };
        this.executionStepList = [
            { text: '买家下单', time: null },
            { text: '卖家未签单', time: null },
            { text: '买家未付首款,卖家未确认', time: null },
            { text: '卖家未发货,买家未确认', time: null },
            { text: '买家未付尾款,卖家未确认', time: null },
            { text: '交易未完成', time: null }];
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this._orderService.getOrderList(this.q).subscribe((res: any) => {
            this.orderList = res.orderList;
            this.count = res.orderCount;
            this.loading = false;
        });
    }

    pageIndexChange(pageindex: number) {
        this.q.offset = this.q.max * (pageindex - 1);
        this.getData();
    }

    selectStatus() {
        this.pageindex = 1;
        this.q.offset = 0;
        this.getData();
    }

    clickBtn(type) {

    }
    showDetail(id) {
        this.initData();
        this.details_isVisible = true;
        this.getOrderDetail(id);

    }

    handleCancelDetail() {
        this.details_isVisible = false;
    }

    getOrderDetail(id) {
        this._orderService.getOrder(id).subscribe((res: any) => {
            this.order = res;
            this.order.billing = this.order.billing ? JSON.stringify(this.order.billing) : '无';
            this.getExecution(this.order);
        });
    }

    getExecution(order) {
        this.currentStep = 0;
        this.executionStepList = [
            { text: '买家已下单,卖家未签单', time: null, title: '签单' },
            { text: '卖家未质押,卖家未质押', time: null, title: '质押' },
            { text: '买家未付首款,卖家未确认', time: null, title: '首付款' },
            { text: '卖家未发货,买家未确认', time: null, title: '已发货' },
            { text: '买家未付尾款,卖家未确认', time: null, title: '尾款' },
            { text: '交易未完成', time: null, title: '完成' }]

        console.log(this.executionStepList)
        this._orderService.getOrderExecutionByOrder(order.id).subscribe((res: any) => {
            this.executionList = res;
            this.executionStepList[0].time = order.dateCreated;
            if (order.confirmedBySeller) {
                this.executionList.length === 0 ? this.currentStep = 1 : '';
                this.executionStepList[0].text = '买家已下单,卖家已签单';
                this.executionStepList[0].time = order.dateSigned;
            }
            if (order.buyerTx1) {
                this.executionStepList[1].text = '买家已质押,卖家未质押';
                this.executionStepList[1].time = order.buyerTx1.dateCreated;
            }
            if (order.sellerTx1) {
                this.executionStepList[1].text = '买家已质押,卖家已质押';
                this.executionStepList[1].time = order.sellerTx1.dateCreated;
            }
            this.executionList.forEach(e => {
                this.currentStep = this.executionList.length + 2;
                if (e.status === 'PAYMENT_P1') {
                    this.executionStepList[2].time = e.lastUpdated
                    this.executionStepList[2].text = '买家已付首款,卖家已确认'
                    if (e.signer === undefined) {
                        this.executionStepList[2] = { text: '买家已付首款,卖家未确认', time: null, title: '首付款' }
                        return;
                    }
                }
                if (e.status === 'DELIVERED') {
                    this.executionStepList[3].time = e.lastUpdated
                    this.executionStepList[3].text = '卖家已发货,买家已确认'
                    if (e.signer === undefined) {
                        this.executionStepList[3] = { text: '卖家已发货,买家未确认', time: null, title: '已发货' }
                        return;
                    }
                }
                if (e.status === 'PAYMENT_P2') {
                    this.executionStepList[4].time = e.lastUpdated
                    this.executionStepList[4].text = '买家已付尾款,卖家已确认'
                    if (e.signer === undefined) {
                        this.executionStepList[4] = { text: '买家已付尾款,卖家未确认', time: null, title: '尾款' }
                        return;
                    }
                    if (e.signer) {
                        this.executionStepList[5].time = e.lastUpdated
                        this.executionStepList[5].text = '交易完成'
                        return;
                    }
                }
            })
            console.log(this.executionStepList)
            this.executionStepList.sort(function (a, b) {
                if (a.time === null && b.time !== null) {
                    return 1
                } else {
                    if (a.time && b.time) {
                        let d1 = new Date(a.time);
                        let d2 = new Date(b.time);
                        return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
                    }
                }
                return 0;
            });
            console.log(this.executionStepList)
        })

    }

    clickTab(type) {
        
    }

    showUserDetail(id) {
        this._emitService.eventEmit.emit({ type: 'userDetail', id: id });
    }
}
