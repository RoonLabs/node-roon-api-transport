"use strict";

let SVCNAME = "com.roonlabs.transport:1";

function oid(o) {
    if (typeof(o) == 'string') return o;
    return o.output_id;
}
function zoid(zo) {
    if (typeof(o) == 'string') return o;
    if (zo.output_id) return zo.output_id;
    return zo.zone_id;
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
                                   zone_or_output_id: zoid(z),
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
                                   zone_or_output_id: zoid(z),
                                   control:           control
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.transfer_zone = function(fromz, toz, cb) {
    this.core.moo.send_request(SVCNAME+"/transfer_zone",
                               {
                                   from_zone_or_output_id: zoid(fromz),
                                   to_zone_or_output_id:   zoid(toz),
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.group_outputs = function(outputs, cb) {
    this.core.moo.send_request(SVCNAME+"/group_outputs",
                               {
                                   output_ids: outputs.reduce((p,e) => p.push(oid(e)) && p, []),
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.ungroup_outputs = function(outputs, cb) {
    this.core.moo.send_request(SVCNAME+"/ungroup_outputs",
                               {
                                   output_ids: outputs.reduce((p,e) => p.push(oid(e)) && p, []),
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
RoonApiTransport.prototype.change_settings = function(z, settings, cb) {
    settings = Object.assign({ zone_or_output_id: zoid(z) }, settings);
    this.core.moo.send_request(SVCNAME+"/change_settings",
                               settings,
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};

RoonApiTransport.prototype.get_zones = function(cb) {
    this.core.moo.send_request(SVCNAME+"/get_zones",
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"), msg.body);
                               });
};
RoonApiTransport.prototype.get_outputs = function(cb) {
    this.core.moo.send_request(SVCNAME+"/get_outputs",
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"), msg.body);
                               });
};

RoonApiTransport.prototype.subscribe_outputs  = function(cb) { this.core.moo._subscribe_helper(SVCNAME, "outputs", cb); }
RoonApiTransport.prototype.subscribe_zones    = function(cb) { this.core.moo._subscribe_helper(SVCNAME, "zones",   cb); }

exports = module.exports = RoonApiTransport;
