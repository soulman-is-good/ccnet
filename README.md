CashCode NET protocol nodejs implementation
=============================================

Introduction
-------------
We have searched the web for implementation of ccnet protocol for nodejs to no
avail. So we decided to write our owns. Banal decision you think, yes.


Installation
-------------

```javascript
npm install ccnet
```

Usage
-----

```javascript
//open serial port /dev/ttyS0 as Bill validator(0x03 - from CCNET documentation)
var ccnet = require('ccnet'),
  ccnet = new ccnet({device:'/dev/ttyS0', type:0x03});

ccnet.execute('RESET',function(err){
    if(err){
        console.error(err);
    } else {
        console.log(');
    }
});
//OR just
ccnet.reset(function(err){
//...
});
```