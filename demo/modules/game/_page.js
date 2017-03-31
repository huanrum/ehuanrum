/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game', ['common_page','common_dialog',function (common_page,common_dialog) {

        return function (name) {
            return common_page([
                '<div>',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="text" [value]="name">',
                '   <input type="text" [value]="name" [style.display]="name?\'block\':\'none\'">',
                '   <br>',
                '   <button [onclick]="shwo">ShowDialog</button>',
                '</div>'
            ].join(''), {
                    title: 'Game',
                    checked:false,
                    name: name,
                    shwo:function(){
                        common_dialog([
                            '<iframe [onload]="onload" width="800" height="900"></iframe>'
                            ].join(''),{onload:function(iframe){
                                var self = this;
                                var script = iframe.contentDocument.createElement('script');
                                    script.src = 'https://jira-sinodynamic.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/wnphhp/b/c/ced29afba244973b16a7e99d069f29b8/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=9571fe0b';
                                    iframe.contentDocument.head.appendChild(script);
                                    script.onload = function(){
                                        setTimeout(function(){
                                            iframe.contentDocument.getElementById('atlwdg-trigger').click();
                                            iframe.contentWindow.addEventListener("message",function(e){
                                                //alert(e.data);
                                                //cancelFeedbackDialog
                                                if(e.data === 'cancelFeedbackDialog'){
                                                    self.$close();
                                                }
                                            });
                                        },500);
                                    }

                        }});
                    }
                });
        }
    }]);

})(window.$ehr);
