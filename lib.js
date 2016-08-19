"use strict";

let SVCNAME = "com.roonlabs.transport:1";

function oid(z) {
    if (typeof(z) == 'string') return z;
    return z.output_id;
}


function RoonApiTransport(core) {
    this.core = core;
}

RoonApiTransport.services = [ { name: SVCNAME } ];

RoonApiTransport.prototype.mute = function(z, how, cb) {
    this.core.moo.send_request(SVCNAME+"/mute",
                               {
                                   output_id: oid(z),
                                   how:       how
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.change_volume = function(z, how, value, cb) {
    this.core.moo.send_request(SVCNAME+"/change_volume",
                               {
                                   output_id: oid(z),
                                   how:       how,
                                   value:     value
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.seek = function(z, how, seconds, cb) {
    this.core.moo.send_request(SVCNAME+"/seek",
                               {
                                   zone_or_output_id: oid(z),
                                   how:             how,
                                   seconds:         seconds
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.control = function(z, control, cb) {
    this.core.moo.send_request(SVCNAME+"/control",
                               {
                                   zone_or_output_id: oid(z),
                                   control:           control
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};

exports = module.exports = RoonApiTransport;
