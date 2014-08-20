"use strict";
module.exports = {
  0x00: false, //Forbidden
  0x01: {//Bill-to-Bill unit
    //TODO
  },
  0x02: {//Coin Changer
    //TODO
  },
  0x03: {//Bill Validator
    states: {
      disabled: -1,
      all: 0,
      initialize: 1,
      holding: 2,
      escrow: 3,
      packed: 4,
      idling: 5,
      failure: -100
    },
    commands: {
      reset: 0x30,
      get_status: 0x31,
      set_security: 0x32,
      poll: 0x33,
      enable_bill_types: 0x34,
      stack: 0x35,
      return: 0x36,
      identification: 0x37,
      hold: 0x38,
      set_barcode_parameters: 0x39,
      extract_barcode_data: 0x3A,
      get_bill_table: 0x41,
      download: 0x50,
      get_crc32_of_the_code: 0x51,
      request_statistics: 0x60
    }
  },
  0x04: {//Card Reader
    //TODO
  },
  0x05: false, //Reserved for Future Standard Peripherals
  0x0D: false, //Reserved for Future Standard Peripherals
  0x0E: false, //Reserved for Future Broadcast Transmissions
  0x0F: false //Reserved for Future Standard Peripherals
};