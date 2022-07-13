//清除空格
String.prototype.trimSpace = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

