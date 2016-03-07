var storage = {};

var storageMock = {
    setItem: function (key, value) {
        storage[key] = value || '';
    },
    getItem: function (key) {
        return storage[key] || null;
    },
    removeItem: function (key) {
        delete storage[key];
    },
    key: function (i) {
        var keys = Object.keys(storage);
        return keys[i] || null;
    },
    clear: function () {
        storage = {};
    }
};

module.exports = storageMock;