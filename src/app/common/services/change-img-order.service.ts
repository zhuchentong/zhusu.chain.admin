import { Injectable } from '@angular/core';
@Injectable()
export class ChangeImgOrderService {

    constructor() {
    };
    changeOrder(img_list, imgType, type, i) {
        if (imgType === 'setting') {
            if (type === 'left') {
                var img_setting = { content: null, link: null }
                img_setting.content = img_list[i].content
                img_list[i].content = img_list[i - 1].content
                img_list[i - 1].content = img_setting.content

                img_setting.link = img_list[i].link
                img_list[i].link = img_list[i - 1].link
                img_list[i - 1].link = img_setting.link
            } else {
                var img_setting = { content: null, link: null }
                img_setting.content = img_list[i].content
                img_list[i].content = img_list[i + 1].content
                img_list[i + 1].content = img_setting.content

                img_setting.link = img_list[i].link
                img_list[i].link = img_list[i + 1].link
                img_list[i + 1].link = img_setting.link
            }
        } else if (type === 'left') {
            var img_temp
            //点击左侧按钮，图片向左移动一位
            img_temp = img_list[i]
            img_list[i] = img_list[i - 1]
            img_list[i - 1] = img_temp
        } else {
            //点击右侧按钮，图片向右移动一位
            img_temp = img_list[i]
            img_list[i] = img_list[i + 1]
            img_list[i + 1] = img_temp
        }
    }
}
