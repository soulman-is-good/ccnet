var ccnet = require('../'),
  ccnet = new ccnet({device:'/dev/ttyS0', type:0x03});

ccnet.execute('RESET',function(err){
    if(err){
        console.error(err);
    } else {
        console.log('RESET finished');
    }
});