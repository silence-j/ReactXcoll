var casper = require('casper').create();
casper.start('http://192.168.1.2:8080/login?from=/');
/**
 * 登录
 */
casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
    casper.evaluate(function(username, password) {
        document.querySelector('#j_username').value = username;
        document.querySelector('input[name="j_password"]').value = password;
    }, 'qiankaijie', 'qwer@1234');
    this.click('#yui-gen1-button');
});
/**
 * 点击部署按钮
 */
casper.thenOpen('http://192.168.1.2:8080/view/xcool-dev/', function() {
    casper.evaluate(function() {
        document.querySelectorAll('.icon-clock')[2].click();
    });
});

casper.run();
