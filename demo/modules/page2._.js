/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.page2', function (common_page,common_dialog) {

        return function (name) {
            return common_page([
                '<div> Page2',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="text" [value]="name">',
                '   <input type="text" [value]="name" [style.display]="name?\'block\':\'none\'">',
                '   <div [onclick]="shwo">ShowDialog</>',
                '</div>'
            ].join(''), {
                    title: 'Page2',
                    checked:false,
                    name: name,
                    shwo:function(){
                        common_dialog([
                            '<iframe [onload]="onload" width="800" height="900"></iframe>'
                            ].join(''),{onload:function(iframe){
                                var script = iframe.contentDocument.createElement('script');
                                    script.src = 'https://jira-sinodynamic.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/wnphhp/b/c/ced29afba244973b16a7e99d069f29b8/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=9571fe0b';
                                    iframe.contentDocument.head.appendChild(script);
                                    script.onload = function(){
                                        setTimeout(function(){
                                            iframe.contentDocument.getElementById('atlwdg-trigger').click();
                                        },500);
                                    }

                        }});
                    }
                });
        }
    });

})(window.$ehr);
