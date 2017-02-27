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


/**
 * Roon API Transport Service
 * @class RoonApiTransport
 * @param {Core} core - The Core providing the service
 */
function RoonApiTransport(core) {
    this.core = core;
}

RoonApiTransport.services = [ { name: SVCNAME } ];

/**
 * Mute all zones.
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.mute_all = function(cb) {
    this.core.moo.send_request(SVCNAME+"/mute_all",
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
/**
 * Unmute all zones.
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.unmute_all = function(cb) {
    this.core.moo.send_request(SVCNAME+"/unmute_all",
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
/**
 * Pause all zones.
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.pause_all = function(cb) {
    this.core.moo.send_request(SVCNAME+"/pause_all",
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
/**
 * Mute/unmute a zone.
 * @param {Zone} zone - The zone to mute.
 * @param {('mute'|'unmute')} how - The action to take
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.mute = function(z, how, cb) {
    if (!z) { if (cb) cb(false); return; }
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
/**
 * Change the volume of a zone.
 * @param {Zone} zone - The zone
 * @param {('absolute'|'relative'|'relative_step')} how - How to interpret the volume
 * @param {number} volume - The new volume value, or the increment value or step
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.change_volume = function(z, how, seconds, cb) {
    if (!z) { if (cb) cb(false); return; }
    this.core.moo.send_request(SVCNAME+"/change_volume",
                               {
                                   output_id: oid(z),
                                   how:       how,
                                   seconds:   seconds
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
/**
 * Seek to a time position within the now playing media
 * @param {Zone} zone - The zone
 * @param {('relative'|'absolute')} how - How to interpret the target seek position
 * @param {number} seconds - The target seek position
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.seek = function(z, how, seconds, cb) {
    if (!z) { if (cb) cb(false); return; }
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
/**
 * Execute a transport control on a zone.
 *
 * <p>Be sure that `is_<control>_allowed` is true on your {Zone} before allowing the user to operate controls</p>
 *
 * @param {Zone} zone - The zone
 * @param {('play'|'pause'|'playpause'|'stop'|'previous'|'next')} control - The control desired
 * <pre>
 * "play" - If paused or stopped, start playback
 * "pause" - If playing or loading, pause playback
 * "playpause" - If paused or stopped, start playback. If playing or loading, pause playback.
 * "stop" - Stop playback and release the audio device immediately
 * "previous" - Go to the start of the current track, or to the previous track
 * "next" - Advance to the next track
 * </pre>
 *
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.control = function(z, control, cb) {
    if (!z) { if (cb) cb(false); return; }
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
/**
 * Transfer the current queue from one zone to another
 *
 * @param {Zone} fromz - The source zone
 * @param {Zone} toz - The destination zone
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.transfer_zone = function(fromz, toz, cb) {
    if (!fromz || !toz) { if (cb) cb(false); return; }
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
/**
 * Create a group of synchronized zones
 *
 * @param {Zone[]} outputs - The zones to group. The first zone's queue is preserved.
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.group_outputs = function(outputs, cb) {
    if (!outputs) { if (cb) cb(false); return; }
    this.core.moo.send_request(SVCNAME+"/group_outputs",
                               {
                                   output_ids: outputs.reduce((p,e) => p.push(oid(e)) && p, []),
                               },
                               (msg, body) => {
                                   if (cb)
                                       cb(msg && msg.name == "Success" ? false : (msg ? msg.name : "NetworkError"));
                               });
};
/**
 * Ungroup zones
 *
 * @param {Zone[]} outputs - The zones to ungroup.
 * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
 */
RoonApiTransport.prototype.ungroup_outputs = function(outputs, cb) {
    if (!outputs) { if (cb) cb(false); return; }
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
    if (!z) { if (cb) cb(false); return; }
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
RoonApiTransport.prototype.subscribe_zones    = function(cb) {
    this.core.moo._subscribe_helper(SVCNAME, "zones",
                                    (response, msg) => {
                                        if (response == "Subscribed") {
                                            this._zones = msg.zones.reduce((p,e) => (p[e.zone_id] = e) && p, {});

                                        } else if (response == "Changed") {
                                            if (msg.zones_removed) msg.zones_removed.forEach(e => delete(this._zones[e.zone_id]));
                                            if (msg.zones_added)   msg.zones_added  .forEach(e => this._zones[e.zone_id] = e);
                                            if (msg.zones_changed) msg.zones_changed.forEach(e => this._zones[e.zone_id] = e);

                                        } else if (response == "Unsubscribed") {
                                            delete(this._zones);
                                        }
                                        cb(response, msg);
                                    });
}

RoonApiTransport.prototype.zone_by_zone_id = function(zone_id) {
    if (!this._zones) return null;
    for (var x in this._zones) if (x == zone_id) return this._zones[x];
    return null;
}
RoonApiTransport.prototype.zone_by_output_id = function(output_id) {
    if (!this._zones) return null;
    for (var x in this._zones) for (var y in this._zones[x].outputs) if (this._zones[x].outputs[y].output_id == output_id) return this._zones[x];
    return null;
}
RoonApiTransport.prototype.zone_by_object = function(zone_or_output) {
    if (zone_or_output.zone_id)   return this.zone_by_zone_id  (zone_or_output.zone_id);
    if (zone_or_output.output_id) return this.zone_by_output_id(zone_or_output.output_id);
    return null;
}

exports = module.exports = RoonApiTransport;
