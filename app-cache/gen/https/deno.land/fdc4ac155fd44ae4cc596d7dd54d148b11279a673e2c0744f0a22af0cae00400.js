import { RedisConnection } from "./connection.ts";
import { DefaultExecutor } from "./executor.ts";
import { createRedisPipeline } from "./pipeline.ts";
import { psubscribe, subscribe } from "./pubsub.ts";
import { convertMap, isCondArray, isNumber, isString, parseXGroupDetail, parseXId, parseXMessage, parseXPendingConsumers, parseXPendingCounts, parseXReadReply, rawnum, rawstr, xidstr } from "./stream.ts";
const binaryCommandOptions = {
    returnUint8Arrays: true
};
class RedisImpl {
    executor;
    get isClosed() {
        return this.executor.connection.isClosed;
    }
    get isConnected() {
        return this.executor.connection.isConnected;
    }
    constructor(executor){
        this.executor = executor;
    }
    sendCommand(command, args, options) {
        return this.executor.sendCommand(command, args, options);
    }
    connect() {
        return this.executor.connection.connect();
    }
    close() {
        return this.executor.close();
    }
    [Symbol.dispose]() {
        return this.close();
    }
    async execReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execStatusReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execIntegerReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execBinaryReply(command, ...args) {
        const reply = await this.executor.sendCommand(command, args, binaryCommandOptions);
        return reply;
    }
    async execBulkReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execArrayReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execIntegerOrNilReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    async execStatusOrNilReply(command, ...args) {
        const reply = await this.executor.exec(command, ...args);
        return reply;
    }
    aclCat(categoryname) {
        if (categoryname !== undefined) {
            return this.execArrayReply("ACL", "CAT", categoryname);
        }
        return this.execArrayReply("ACL", "CAT");
    }
    aclDelUser(...usernames) {
        return this.execIntegerReply("ACL", "DELUSER", ...usernames);
    }
    aclGenPass(bits) {
        if (bits !== undefined) {
            return this.execBulkReply("ACL", "GENPASS", bits);
        }
        return this.execBulkReply("ACL", "GENPASS");
    }
    aclGetUser(username) {
        return this.execArrayReply("ACL", "GETUSER", username);
    }
    aclHelp() {
        return this.execArrayReply("ACL", "HELP");
    }
    aclList() {
        return this.execArrayReply("ACL", "LIST");
    }
    aclLoad() {
        return this.execStatusReply("ACL", "LOAD");
    }
    aclLog(param) {
        if (param === "RESET") {
            return this.execStatusReply("ACL", "LOG", "RESET");
        }
        return this.execArrayReply("ACL", "LOG", param);
    }
    aclSave() {
        return this.execStatusReply("ACL", "SAVE");
    }
    aclSetUser(username, ...rules) {
        return this.execStatusReply("ACL", "SETUSER", username, ...rules);
    }
    aclUsers() {
        return this.execArrayReply("ACL", "USERS");
    }
    aclWhoami() {
        return this.execBulkReply("ACL", "WHOAMI");
    }
    append(key, value) {
        return this.execIntegerReply("APPEND", key, value);
    }
    auth(param1, param2) {
        if (param2 !== undefined) {
            return this.execStatusReply("AUTH", param1, param2);
        }
        return this.execStatusReply("AUTH", param1);
    }
    bgrewriteaof() {
        return this.execStatusReply("BGREWRITEAOF");
    }
    bgsave() {
        return this.execStatusReply("BGSAVE");
    }
    bitcount(key, start, end) {
        if (start !== undefined && end !== undefined) {
            return this.execIntegerReply("BITCOUNT", key, start, end);
        }
        return this.execIntegerReply("BITCOUNT", key);
    }
    bitfield(key, opts) {
        const args = [
            key
        ];
        if (opts?.get) {
            const { type , offset  } = opts.get;
            args.push("GET", type, offset);
        }
        if (opts?.set) {
            const { type , offset , value  } = opts.set;
            args.push("SET", type, offset, value);
        }
        if (opts?.incrby) {
            const { type , offset , increment  } = opts.incrby;
            args.push("INCRBY", type, offset, increment);
        }
        if (opts?.overflow) {
            args.push("OVERFLOW", opts.overflow);
        }
        return this.execArrayReply("BITFIELD", ...args);
    }
    bitop(operation, destkey, ...keys) {
        return this.execIntegerReply("BITOP", operation, destkey, ...keys);
    }
    bitpos(key, bit, start, end) {
        if (start !== undefined && end !== undefined) {
            return this.execIntegerReply("BITPOS", key, bit, start, end);
        }
        if (start !== undefined) {
            return this.execIntegerReply("BITPOS", key, bit, start);
        }
        return this.execIntegerReply("BITPOS", key, bit);
    }
    blpop(timeout, ...keys) {
        return this.execArrayReply("BLPOP", ...keys, timeout);
    }
    brpop(timeout, ...keys) {
        return this.execArrayReply("BRPOP", ...keys, timeout);
    }
    brpoplpush(source, destination, timeout) {
        return this.execBulkReply("BRPOPLPUSH", source, destination, timeout);
    }
    bzpopmin(timeout, ...keys) {
        return this.execArrayReply("BZPOPMIN", ...keys, timeout);
    }
    bzpopmax(timeout, ...keys) {
        return this.execArrayReply("BZPOPMAX", ...keys, timeout);
    }
    clientCaching(mode) {
        return this.execStatusReply("CLIENT", "CACHING", mode);
    }
    clientGetName() {
        return this.execBulkReply("CLIENT", "GETNAME");
    }
    clientGetRedir() {
        return this.execIntegerReply("CLIENT", "GETREDIR");
    }
    clientID() {
        return this.execIntegerReply("CLIENT", "ID");
    }
    clientInfo() {
        return this.execBulkReply("CLIENT", "INFO");
    }
    clientKill(opts) {
        const args = [];
        if (opts.addr) {
            args.push("ADDR", opts.addr);
        }
        if (opts.laddr) {
            args.push("LADDR", opts.laddr);
        }
        if (opts.id) {
            args.push("ID", opts.id);
        }
        if (opts.type) {
            args.push("TYPE", opts.type);
        }
        if (opts.user) {
            args.push("USER", opts.user);
        }
        if (opts.skipme) {
            args.push("SKIPME", opts.skipme);
        }
        return this.execIntegerReply("CLIENT", "KILL", ...args);
    }
    clientList(opts) {
        if (opts && opts.type && opts.ids) {
            throw new Error("only one of `type` or `ids` can be specified");
        }
        if (opts && opts.type) {
            return this.execBulkReply("CLIENT", "LIST", "TYPE", opts.type);
        }
        if (opts && opts.ids) {
            return this.execBulkReply("CLIENT", "LIST", "ID", ...opts.ids);
        }
        return this.execBulkReply("CLIENT", "LIST");
    }
    clientPause(timeout, mode) {
        if (mode) {
            return this.execStatusReply("CLIENT", "PAUSE", timeout, mode);
        }
        return this.execStatusReply("CLIENT", "PAUSE", timeout);
    }
    clientSetName(connectionName) {
        return this.execStatusReply("CLIENT", "SETNAME", connectionName);
    }
    clientTracking(opts) {
        const args = [
            opts.mode
        ];
        if (opts.redirect) {
            args.push("REDIRECT", opts.redirect);
        }
        if (opts.prefixes) {
            opts.prefixes.forEach((prefix)=>{
                args.push("PREFIX");
                args.push(prefix);
            });
        }
        if (opts.bcast) {
            args.push("BCAST");
        }
        if (opts.optIn) {
            args.push("OPTIN");
        }
        if (opts.optOut) {
            args.push("OPTOUT");
        }
        if (opts.noLoop) {
            args.push("NOLOOP");
        }
        return this.execStatusReply("CLIENT", "TRACKING", ...args);
    }
    clientTrackingInfo() {
        return this.execArrayReply("CLIENT", "TRACKINGINFO");
    }
    clientUnblock(id, behaviour) {
        if (behaviour) {
            return this.execIntegerReply("CLIENT", "UNBLOCK", id, behaviour);
        }
        return this.execIntegerReply("CLIENT", "UNBLOCK", id);
    }
    clientUnpause() {
        return this.execStatusReply("CLIENT", "UNPAUSE");
    }
    asking() {
        return this.execStatusReply("ASKING");
    }
    clusterAddSlots(...slots) {
        return this.execStatusReply("CLUSTER", "ADDSLOTS", ...slots);
    }
    clusterCountFailureReports(nodeId) {
        return this.execIntegerReply("CLUSTER", "COUNT-FAILURE-REPORTS", nodeId);
    }
    clusterCountKeysInSlot(slot) {
        return this.execIntegerReply("CLUSTER", "COUNTKEYSINSLOT", slot);
    }
    clusterDelSlots(...slots) {
        return this.execStatusReply("CLUSTER", "DELSLOTS", ...slots);
    }
    clusterFailover(mode) {
        if (mode) {
            return this.execStatusReply("CLUSTER", "FAILOVER", mode);
        }
        return this.execStatusReply("CLUSTER", "FAILOVER");
    }
    clusterFlushSlots() {
        return this.execStatusReply("CLUSTER", "FLUSHSLOTS");
    }
    clusterForget(nodeId) {
        return this.execStatusReply("CLUSTER", "FORGET", nodeId);
    }
    clusterGetKeysInSlot(slot, count) {
        return this.execArrayReply("CLUSTER", "GETKEYSINSLOT", slot, count);
    }
    clusterInfo() {
        return this.execStatusReply("CLUSTER", "INFO");
    }
    clusterKeySlot(key) {
        return this.execIntegerReply("CLUSTER", "KEYSLOT", key);
    }
    clusterMeet(ip, port) {
        return this.execStatusReply("CLUSTER", "MEET", ip, port);
    }
    clusterMyID() {
        return this.execStatusReply("CLUSTER", "MYID");
    }
    clusterNodes() {
        return this.execBulkReply("CLUSTER", "NODES");
    }
    clusterReplicas(nodeId) {
        return this.execArrayReply("CLUSTER", "REPLICAS", nodeId);
    }
    clusterReplicate(nodeId) {
        return this.execStatusReply("CLUSTER", "REPLICATE", nodeId);
    }
    clusterReset(mode) {
        if (mode) {
            return this.execStatusReply("CLUSTER", "RESET", mode);
        }
        return this.execStatusReply("CLUSTER", "RESET");
    }
    clusterSaveConfig() {
        return this.execStatusReply("CLUSTER", "SAVECONFIG");
    }
    clusterSetSlot(slot, subcommand, nodeId) {
        if (nodeId !== undefined) {
            return this.execStatusReply("CLUSTER", "SETSLOT", slot, subcommand, nodeId);
        }
        return this.execStatusReply("CLUSTER", "SETSLOT", slot, subcommand);
    }
    clusterSlaves(nodeId) {
        return this.execArrayReply("CLUSTER", "SLAVES", nodeId);
    }
    clusterSlots() {
        return this.execArrayReply("CLUSTER", "SLOTS");
    }
    command() {
        return this.execArrayReply("COMMAND");
    }
    commandCount() {
        return this.execIntegerReply("COMMAND", "COUNT");
    }
    commandGetKeys() {
        return this.execArrayReply("COMMAND", "GETKEYS");
    }
    commandInfo(...commandNames) {
        return this.execArrayReply("COMMAND", "INFO", ...commandNames);
    }
    configGet(parameter) {
        return this.execArrayReply("CONFIG", "GET", parameter);
    }
    configResetStat() {
        return this.execStatusReply("CONFIG", "RESETSTAT");
    }
    configRewrite() {
        return this.execStatusReply("CONFIG", "REWRITE");
    }
    configSet(parameter, value) {
        return this.execStatusReply("CONFIG", "SET", parameter, value);
    }
    dbsize() {
        return this.execIntegerReply("DBSIZE");
    }
    debugObject(key) {
        return this.execStatusReply("DEBUG", "OBJECT", key);
    }
    debugSegfault() {
        return this.execStatusReply("DEBUG", "SEGFAULT");
    }
    decr(key) {
        return this.execIntegerReply("DECR", key);
    }
    decrby(key, decrement) {
        return this.execIntegerReply("DECRBY", key, decrement);
    }
    del(...keys) {
        return this.execIntegerReply("DEL", ...keys);
    }
    discard() {
        return this.execStatusReply("DISCARD");
    }
    dump(key) {
        return this.execBinaryReply("DUMP", key);
    }
    echo(message) {
        return this.execBulkReply("ECHO", message);
    }
    eval(script, keys, args) {
        return this.execReply("EVAL", script, keys.length, ...keys, ...args);
    }
    evalsha(sha1, keys, args) {
        return this.execReply("EVALSHA", sha1, keys.length, ...keys, ...args);
    }
    exec() {
        return this.execArrayReply("EXEC");
    }
    exists(...keys) {
        return this.execIntegerReply("EXISTS", ...keys);
    }
    expire(key, seconds) {
        return this.execIntegerReply("EXPIRE", key, seconds);
    }
    expireat(key, timestamp) {
        return this.execIntegerReply("EXPIREAT", key, timestamp);
    }
    flushall(async) {
        if (async) {
            return this.execStatusReply("FLUSHALL", "ASYNC");
        }
        return this.execStatusReply("FLUSHALL");
    }
    flushdb(async) {
        if (async) {
            return this.execStatusReply("FLUSHDB", "ASYNC");
        }
        return this.execStatusReply("FLUSHDB");
    }
    // deno-lint-ignore no-explicit-any
    geoadd(key, ...params) {
        const args = [
            key
        ];
        if (Array.isArray(params[0])) {
            args.push(...params.flatMap((e)=>e));
        } else if (typeof params[0] === "object") {
            for (const [member, lnglat] of Object.entries(params[0])){
                args.push(...lnglat, member);
            }
        } else {
            args.push(...params);
        }
        return this.execIntegerReply("GEOADD", ...args);
    }
    geohash(key, ...members) {
        return this.execArrayReply("GEOHASH", key, ...members);
    }
    geopos(key, ...members) {
        return this.execArrayReply("GEOPOS", key, ...members);
    }
    geodist(key, member1, member2, unit) {
        if (unit) {
            return this.execBulkReply("GEODIST", key, member1, member2, unit);
        }
        return this.execBulkReply("GEODIST", key, member1, member2);
    }
    georadius(key, longitude, latitude, radius, unit, opts) {
        const args = this.pushGeoRadiusOpts([
            key,
            longitude,
            latitude,
            radius,
            unit
        ], opts);
        return this.execArrayReply("GEORADIUS", ...args);
    }
    georadiusbymember(key, member, radius, unit, opts) {
        const args = this.pushGeoRadiusOpts([
            key,
            member,
            radius,
            unit
        ], opts);
        return this.execArrayReply("GEORADIUSBYMEMBER", ...args);
    }
    pushGeoRadiusOpts(args, opts) {
        if (opts?.withCoord) {
            args.push("WITHCOORD");
        }
        if (opts?.withDist) {
            args.push("WITHDIST");
        }
        if (opts?.withHash) {
            args.push("WITHHASH");
        }
        if (opts?.count !== undefined) {
            args.push(opts.count);
        }
        if (opts?.sort) {
            args.push(opts.sort);
        }
        if (opts?.store !== undefined) {
            args.push(opts.store);
        }
        if (opts?.storeDist !== undefined) {
            args.push(opts.storeDist);
        }
        return args;
    }
    get(key) {
        return this.execBulkReply("GET", key);
    }
    getbit(key, offset) {
        return this.execIntegerReply("GETBIT", key, offset);
    }
    getrange(key, start, end) {
        return this.execBulkReply("GETRANGE", key, start, end);
    }
    getset(key, value) {
        return this.execBulkReply("GETSET", key, value);
    }
    hdel(key, ...fields) {
        return this.execIntegerReply("HDEL", key, ...fields);
    }
    hexists(key, field) {
        return this.execIntegerReply("HEXISTS", key, field);
    }
    hget(key, field) {
        return this.execBulkReply("HGET", key, field);
    }
    hgetall(key) {
        return this.execArrayReply("HGETALL", key);
    }
    hincrby(key, field, increment) {
        return this.execIntegerReply("HINCRBY", key, field, increment);
    }
    hincrbyfloat(key, field, increment) {
        return this.execBulkReply("HINCRBYFLOAT", key, field, increment);
    }
    hkeys(key) {
        return this.execArrayReply("HKEYS", key);
    }
    hlen(key) {
        return this.execIntegerReply("HLEN", key);
    }
    hmget(key, ...fields) {
        return this.execArrayReply("HMGET", key, ...fields);
    }
    // deno-lint-ignore no-explicit-any
    hmset(key, ...params) {
        const args = [
            key
        ];
        if (Array.isArray(params[0])) {
            args.push(...params.flatMap((e)=>e));
        } else if (typeof params[0] === "object") {
            for (const [field, value] of Object.entries(params[0])){
                args.push(field, value);
            }
        } else {
            args.push(...params);
        }
        return this.execStatusReply("HMSET", ...args);
    }
    // deno-lint-ignore no-explicit-any
    hset(key, ...params) {
        const args = [
            key
        ];
        if (Array.isArray(params[0])) {
            args.push(...params.flatMap((e)=>e));
        } else if (typeof params[0] === "object") {
            for (const [field, value] of Object.entries(params[0])){
                args.push(field, value);
            }
        } else {
            args.push(...params);
        }
        return this.execIntegerReply("HSET", ...args);
    }
    hsetnx(key, field, value) {
        return this.execIntegerReply("HSETNX", key, field, value);
    }
    hstrlen(key, field) {
        return this.execIntegerReply("HSTRLEN", key, field);
    }
    hvals(key) {
        return this.execArrayReply("HVALS", key);
    }
    incr(key) {
        return this.execIntegerReply("INCR", key);
    }
    incrby(key, increment) {
        return this.execIntegerReply("INCRBY", key, increment);
    }
    incrbyfloat(key, increment) {
        return this.execBulkReply("INCRBYFLOAT", key, increment);
    }
    info(section) {
        if (section !== undefined) {
            return this.execStatusReply("INFO", section);
        }
        return this.execStatusReply("INFO");
    }
    keys(pattern) {
        return this.execArrayReply("KEYS", pattern);
    }
    lastsave() {
        return this.execIntegerReply("LASTSAVE");
    }
    lindex(key, index) {
        return this.execBulkReply("LINDEX", key, index);
    }
    linsert(key, loc, pivot, value) {
        return this.execIntegerReply("LINSERT", key, loc, pivot, value);
    }
    llen(key) {
        return this.execIntegerReply("LLEN", key);
    }
    lpop(key) {
        return this.execBulkReply("LPOP", key);
    }
    lpos(key, element, opts) {
        const args = [
            element
        ];
        if (opts?.rank != null) {
            args.push("RANK", String(opts.rank));
        }
        if (opts?.count != null) {
            args.push("COUNT", String(opts.count));
        }
        if (opts?.maxlen != null) {
            args.push("MAXLEN", String(opts.maxlen));
        }
        return opts?.count == null ? this.execIntegerReply("LPOS", key, ...args) : this.execArrayReply("LPOS", key, ...args);
    }
    lpush(key, ...elements) {
        return this.execIntegerReply("LPUSH", key, ...elements);
    }
    lpushx(key, ...elements) {
        return this.execIntegerReply("LPUSHX", key, ...elements);
    }
    lrange(key, start, stop) {
        return this.execArrayReply("LRANGE", key, start, stop);
    }
    lrem(key, count, element) {
        return this.execIntegerReply("LREM", key, count, element);
    }
    lset(key, index, element) {
        return this.execStatusReply("LSET", key, index, element);
    }
    ltrim(key, start, stop) {
        return this.execStatusReply("LTRIM", key, start, stop);
    }
    memoryDoctor() {
        return this.execBulkReply("MEMORY", "DOCTOR");
    }
    memoryHelp() {
        return this.execArrayReply("MEMORY", "HELP");
    }
    memoryMallocStats() {
        return this.execBulkReply("MEMORY", "MALLOC", "STATS");
    }
    memoryPurge() {
        return this.execStatusReply("MEMORY", "PURGE");
    }
    memoryStats() {
        return this.execArrayReply("MEMORY", "STATS");
    }
    memoryUsage(key, opts) {
        const args = [
            key
        ];
        if (opts?.samples !== undefined) {
            args.push("SAMPLES", opts.samples);
        }
        return this.execIntegerReply("MEMORY", "USAGE", ...args);
    }
    mget(...keys) {
        return this.execArrayReply("MGET", ...keys);
    }
    migrate(host, port, key, destinationDB, timeout, opts) {
        const args = [
            host,
            port,
            key,
            destinationDB,
            timeout
        ];
        if (opts?.copy) {
            args.push("COPY");
        }
        if (opts?.replace) {
            args.push("REPLACE");
        }
        if (opts?.auth !== undefined) {
            args.push("AUTH", opts.auth);
        }
        if (opts?.keys) {
            args.push("KEYS", ...opts.keys);
        }
        return this.execStatusReply("MIGRATE", ...args);
    }
    moduleList() {
        return this.execArrayReply("MODULE", "LIST");
    }
    moduleLoad(path, ...args) {
        return this.execStatusReply("MODULE", "LOAD", path, ...args);
    }
    moduleUnload(name) {
        return this.execStatusReply("MODULE", "UNLOAD", name);
    }
    monitor() {
        throw new Error("not supported yet");
    }
    move(key, db) {
        return this.execIntegerReply("MOVE", key, db);
    }
    // deno-lint-ignore no-explicit-any
    mset(...params) {
        const args = [];
        if (Array.isArray(params[0])) {
            args.push(...params.flatMap((e)=>e));
        } else if (typeof params[0] === "object") {
            for (const [key, value] of Object.entries(params[0])){
                args.push(key, value);
            }
        } else {
            args.push(...params);
        }
        return this.execStatusReply("MSET", ...args);
    }
    // deno-lint-ignore no-explicit-any
    msetnx(...params) {
        const args = [];
        if (Array.isArray(params[0])) {
            args.push(...params.flatMap((e)=>e));
        } else if (typeof params[0] === "object") {
            for (const [key, value] of Object.entries(params[0])){
                args.push(key, value);
            }
        } else {
            args.push(...params);
        }
        return this.execIntegerReply("MSETNX", ...args);
    }
    multi() {
        return this.execStatusReply("MULTI");
    }
    objectEncoding(key) {
        return this.execBulkReply("OBJECT", "ENCODING", key);
    }
    objectFreq(key) {
        return this.execIntegerOrNilReply("OBJECT", "FREQ", key);
    }
    objectHelp() {
        return this.execArrayReply("OBJECT", "HELP");
    }
    objectIdletime(key) {
        return this.execIntegerOrNilReply("OBJECT", "IDLETIME", key);
    }
    objectRefCount(key) {
        return this.execIntegerOrNilReply("OBJECT", "REFCOUNT", key);
    }
    persist(key) {
        return this.execIntegerReply("PERSIST", key);
    }
    pexpire(key, milliseconds) {
        return this.execIntegerReply("PEXPIRE", key, milliseconds);
    }
    pexpireat(key, millisecondsTimestamp) {
        return this.execIntegerReply("PEXPIREAT", key, millisecondsTimestamp);
    }
    pfadd(key, ...elements) {
        return this.execIntegerReply("PFADD", key, ...elements);
    }
    pfcount(...keys) {
        return this.execIntegerReply("PFCOUNT", ...keys);
    }
    pfmerge(destkey, ...sourcekeys) {
        return this.execStatusReply("PFMERGE", destkey, ...sourcekeys);
    }
    ping(message) {
        if (message) {
            return this.execBulkReply("PING", message);
        }
        return this.execStatusReply("PING");
    }
    psetex(key, milliseconds, value) {
        return this.execStatusReply("PSETEX", key, milliseconds, value);
    }
    publish(channel, message) {
        return this.execIntegerReply("PUBLISH", channel, message);
    }
    // deno-lint-ignore no-explicit-any
    #subscription;
    async subscribe(...channels) {
        if (this.#subscription) {
            await this.#subscription.subscribe(...channels);
            return this.#subscription;
        }
        const subscription = await subscribe(this.executor, ...channels);
        this.#subscription = subscription;
        return subscription;
    }
    async psubscribe(...patterns) {
        if (this.#subscription) {
            await this.#subscription.psubscribe(...patterns);
            return this.#subscription;
        }
        const subscription = await psubscribe(this.executor, ...patterns);
        this.#subscription = subscription;
        return subscription;
    }
    pubsubChannels(pattern) {
        if (pattern !== undefined) {
            return this.execArrayReply("PUBSUB", "CHANNELS", pattern);
        }
        return this.execArrayReply("PUBSUB", "CHANNELS");
    }
    pubsubNumpat() {
        return this.execIntegerReply("PUBSUB", "NUMPAT");
    }
    pubsubNumsub(...channels) {
        return this.execArrayReply("PUBSUB", "NUMSUB", ...channels);
    }
    pttl(key) {
        return this.execIntegerReply("PTTL", key);
    }
    quit() {
        return this.execStatusReply("QUIT").finally(()=>this.close());
    }
    randomkey() {
        return this.execBulkReply("RANDOMKEY");
    }
    readonly() {
        return this.execStatusReply("READONLY");
    }
    readwrite() {
        return this.execStatusReply("READWRITE");
    }
    rename(key, newkey) {
        return this.execStatusReply("RENAME", key, newkey);
    }
    renamenx(key, newkey) {
        return this.execIntegerReply("RENAMENX", key, newkey);
    }
    restore(key, ttl, serializedValue, opts) {
        const args = [
            key,
            ttl,
            serializedValue
        ];
        if (opts?.replace) {
            args.push("REPLACE");
        }
        if (opts?.absttl) {
            args.push("ABSTTL");
        }
        if (opts?.idletime !== undefined) {
            args.push("IDLETIME", opts.idletime);
        }
        if (opts?.freq !== undefined) {
            args.push("FREQ", opts.freq);
        }
        return this.execStatusReply("RESTORE", ...args);
    }
    role() {
        return this.execArrayReply("ROLE");
    }
    rpop(key) {
        return this.execBulkReply("RPOP", key);
    }
    rpoplpush(source, destination) {
        return this.execBulkReply("RPOPLPUSH", source, destination);
    }
    rpush(key, ...elements) {
        return this.execIntegerReply("RPUSH", key, ...elements);
    }
    rpushx(key, ...elements) {
        return this.execIntegerReply("RPUSHX", key, ...elements);
    }
    sadd(key, ...members) {
        return this.execIntegerReply("SADD", key, ...members);
    }
    save() {
        return this.execStatusReply("SAVE");
    }
    scard(key) {
        return this.execIntegerReply("SCARD", key);
    }
    scriptDebug(mode) {
        return this.execStatusReply("SCRIPT", "DEBUG", mode);
    }
    scriptExists(...sha1s) {
        return this.execArrayReply("SCRIPT", "EXISTS", ...sha1s);
    }
    scriptFlush() {
        return this.execStatusReply("SCRIPT", "FLUSH");
    }
    scriptKill() {
        return this.execStatusReply("SCRIPT", "KILL");
    }
    scriptLoad(script) {
        return this.execStatusReply("SCRIPT", "LOAD", script);
    }
    sdiff(...keys) {
        return this.execArrayReply("SDIFF", ...keys);
    }
    sdiffstore(destination, ...keys) {
        return this.execIntegerReply("SDIFFSTORE", destination, ...keys);
    }
    select(index) {
        return this.execStatusReply("SELECT", index);
    }
    set(key, value, opts) {
        const args = [
            key,
            value
        ];
        if (opts?.ex !== undefined) {
            args.push("EX", opts.ex);
        } else if (opts?.px !== undefined) {
            args.push("PX", opts.px);
        }
        if (opts?.keepttl) {
            args.push("KEEPTTL");
        }
        if (opts?.mode) {
            args.push(opts.mode);
            return this.execStatusOrNilReply("SET", ...args);
        }
        return this.execStatusReply("SET", ...args);
    }
    setbit(key, offset, value) {
        return this.execIntegerReply("SETBIT", key, offset, value);
    }
    setex(key, seconds, value) {
        return this.execStatusReply("SETEX", key, seconds, value);
    }
    setnx(key, value) {
        return this.execIntegerReply("SETNX", key, value);
    }
    setrange(key, offset, value) {
        return this.execIntegerReply("SETRANGE", key, offset, value);
    }
    shutdown(mode) {
        if (mode) {
            return this.execStatusReply("SHUTDOWN", mode);
        }
        return this.execStatusReply("SHUTDOWN");
    }
    sinter(...keys) {
        return this.execArrayReply("SINTER", ...keys);
    }
    sinterstore(destination, ...keys) {
        return this.execIntegerReply("SINTERSTORE", destination, ...keys);
    }
    sismember(key, member) {
        return this.execIntegerReply("SISMEMBER", key, member);
    }
    slaveof(host, port) {
        return this.execStatusReply("SLAVEOF", host, port);
    }
    slaveofNoOne() {
        return this.execStatusReply("SLAVEOF", "NO ONE");
    }
    replicaof(host, port) {
        return this.execStatusReply("REPLICAOF", host, port);
    }
    replicaofNoOne() {
        return this.execStatusReply("REPLICAOF", "NO ONE");
    }
    slowlog(subcommand, ...args) {
        return this.execArrayReply("SLOWLOG", subcommand, ...args);
    }
    smembers(key) {
        return this.execArrayReply("SMEMBERS", key);
    }
    smove(source, destination, member) {
        return this.execIntegerReply("SMOVE", source, destination, member);
    }
    sort(key, opts) {
        const args = [
            key
        ];
        if (opts?.by !== undefined) {
            args.push("BY", opts.by);
        }
        if (opts?.limit) {
            args.push("LIMIT", opts.limit.offset, opts.limit.count);
        }
        if (opts?.patterns) {
            args.push(...opts.patterns.flatMap((pattern)=>[
                    "GET",
                    pattern
                ]));
        }
        if (opts?.order) {
            args.push(opts.order);
        }
        if (opts?.alpha) {
            args.push("ALPHA");
        }
        if (opts?.destination !== undefined) {
            args.push("STORE", opts.destination);
            return this.execIntegerReply("SORT", ...args);
        }
        return this.execArrayReply("SORT", ...args);
    }
    spop(key, count) {
        if (count !== undefined) {
            return this.execArrayReply("SPOP", key, count);
        }
        return this.execBulkReply("SPOP", key);
    }
    srandmember(key, count) {
        if (count !== undefined) {
            return this.execArrayReply("SRANDMEMBER", key, count);
        }
        return this.execBulkReply("SRANDMEMBER", key);
    }
    srem(key, ...members) {
        return this.execIntegerReply("SREM", key, ...members);
    }
    stralgo(algorithm, target, a, b, opts) {
        const args = [];
        if (opts?.idx) {
            args.push("IDX");
        }
        if (opts?.len) {
            args.push("LEN");
        }
        if (opts?.withmatchlen) {
            args.push("WITHMATCHLEN");
        }
        if (opts?.minmatchlen) {
            args.push("MINMATCHLEN");
            args.push(opts.minmatchlen);
        }
        return this.execReply("STRALGO", algorithm, target, a, b, ...args);
    }
    strlen(key) {
        return this.execIntegerReply("STRLEN", key);
    }
    sunion(...keys) {
        return this.execArrayReply("SUNION", ...keys);
    }
    sunionstore(destination, ...keys) {
        return this.execIntegerReply("SUNIONSTORE", destination, ...keys);
    }
    swapdb(index1, index2) {
        return this.execStatusReply("SWAPDB", index1, index2);
    }
    sync() {
        throw new Error("not implemented");
    }
    time() {
        return this.execArrayReply("TIME");
    }
    touch(...keys) {
        return this.execIntegerReply("TOUCH", ...keys);
    }
    ttl(key) {
        return this.execIntegerReply("TTL", key);
    }
    type(key) {
        return this.execStatusReply("TYPE", key);
    }
    unlink(...keys) {
        return this.execIntegerReply("UNLINK", ...keys);
    }
    unwatch() {
        return this.execStatusReply("UNWATCH");
    }
    wait(numreplicas, timeout) {
        return this.execIntegerReply("WAIT", numreplicas, timeout);
    }
    watch(...keys) {
        return this.execStatusReply("WATCH", ...keys);
    }
    xack(key, group, ...xids) {
        return this.execIntegerReply("XACK", key, group, ...xids.map((xid)=>xidstr(xid)));
    }
    xadd(key, xid, fieldValues, maxlen = undefined) {
        const args = [
            key
        ];
        if (maxlen) {
            args.push("MAXLEN");
            if (maxlen.approx) {
                args.push("~");
            }
            args.push(maxlen.elements.toString());
        }
        args.push(xidstr(xid));
        if (fieldValues instanceof Map) {
            for (const [f, v] of fieldValues){
                args.push(f);
                args.push(v);
            }
        } else {
            for (const [f, v] of Object.entries(fieldValues)){
                args.push(f);
                args.push(v);
            }
        }
        return this.execBulkReply("XADD", ...args).then((rawId)=>parseXId(rawId));
    }
    xclaim(key, opts, ...xids) {
        const args = [];
        if (opts.idle) {
            args.push("IDLE");
            args.push(opts.idle);
        }
        if (opts.time) {
            args.push("TIME");
            args.push(opts.time);
        }
        if (opts.retryCount) {
            args.push("RETRYCOUNT");
            args.push(opts.retryCount);
        }
        if (opts.force) {
            args.push("FORCE");
        }
        if (opts.justXId) {
            args.push("JUSTID");
        }
        return this.execArrayReply("XCLAIM", key, opts.group, opts.consumer, opts.minIdleTime, ...xids.map((xid)=>xidstr(xid)), ...args).then((raw)=>{
            if (opts.justXId) {
                const xids = [];
                for (const r of raw){
                    if (typeof r === "string") {
                        xids.push(parseXId(r));
                    }
                }
                const payload = {
                    kind: "justxid",
                    xids
                };
                return payload;
            }
            const messages = [];
            for (const r of raw){
                if (typeof r !== "string") {
                    messages.push(parseXMessage(r));
                }
            }
            const payload = {
                kind: "messages",
                messages
            };
            return payload;
        });
    }
    xdel(key, ...xids) {
        return this.execIntegerReply("XDEL", key, ...xids.map((rawId)=>xidstr(rawId)));
    }
    xlen(key) {
        return this.execIntegerReply("XLEN", key);
    }
    xgroupCreate(key, groupName, xid, mkstream) {
        const args = [];
        if (mkstream) {
            args.push("MKSTREAM");
        }
        return this.execStatusReply("XGROUP", "CREATE", key, groupName, xidstr(xid), ...args);
    }
    xgroupDelConsumer(key, groupName, consumerName) {
        return this.execIntegerReply("XGROUP", "DELCONSUMER", key, groupName, consumerName);
    }
    xgroupDestroy(key, groupName) {
        return this.execIntegerReply("XGROUP", "DESTROY", key, groupName);
    }
    xgroupHelp() {
        return this.execBulkReply("XGROUP", "HELP");
    }
    xgroupSetID(key, groupName, xid) {
        return this.execStatusReply("XGROUP", "SETID", key, groupName, xidstr(xid));
    }
    xinfoStream(key) {
        return this.execArrayReply("XINFO", "STREAM", key).then((raw)=>{
            // Note that you should not rely on the fields
            // exact position, nor on the number of fields,
            // new fields may be added in the future.
            const data = convertMap(raw);
            const firstEntry = parseXMessage(data.get("first-entry"));
            const lastEntry = parseXMessage(data.get("last-entry"));
            return {
                length: rawnum(data.get("length") ?? null),
                radixTreeKeys: rawnum(data.get("radix-tree-keys") ?? null),
                radixTreeNodes: rawnum(data.get("radix-tree-nodes") ?? null),
                groups: rawnum(data.get("groups") ?? null),
                lastGeneratedId: parseXId(rawstr(data.get("last-generated-id") ?? null)),
                firstEntry,
                lastEntry
            };
        });
    }
    xinfoStreamFull(key, count) {
        const args = [];
        if (count !== undefined) {
            args.push("COUNT");
            args.push(count);
        }
        return this.execArrayReply("XINFO", "STREAM", key, "FULL", ...args).then((raw)=>{
            // Note that you should not rely on the fields
            // exact position, nor on the number of fields,
            // new fields may be added in the future.
            if (raw == null) throw "no data";
            const data = convertMap(raw);
            if (data === undefined) throw "no data converted";
            const entries = data.get("entries").map((raw)=>parseXMessage(raw));
            return {
                length: rawnum(data.get("length") ?? null),
                radixTreeKeys: rawnum(data.get("radix-tree-keys") ?? null),
                radixTreeNodes: rawnum(data.get("radix-tree-nodes") ?? null),
                lastGeneratedId: parseXId(rawstr(data.get("last-generated-id") ?? null)),
                entries,
                groups: parseXGroupDetail(data.get("groups"))
            };
        });
    }
    xinfoGroups(key) {
        return this.execArrayReply("XINFO", "GROUPS", key).then((raws)=>raws.map((raw)=>{
                const data = convertMap(raw);
                return {
                    name: rawstr(data.get("name") ?? null),
                    consumers: rawnum(data.get("consumers") ?? null),
                    pending: rawnum(data.get("pending") ?? null),
                    lastDeliveredId: parseXId(rawstr(data.get("last-delivered-id") ?? null))
                };
            }));
    }
    xinfoConsumers(key, group) {
        return this.execArrayReply("XINFO", "CONSUMERS", key, group).then((raws)=>raws.map((raw)=>{
                const data = convertMap(raw);
                return {
                    name: rawstr(data.get("name") ?? null),
                    pending: rawnum(data.get("pending") ?? null),
                    idle: rawnum(data.get("idle") ?? null)
                };
            }));
    }
    xpending(key, group) {
        return this.execArrayReply("XPENDING", key, group).then((raw)=>{
            if (isNumber(raw[0]) && isString(raw[1]) && isString(raw[2]) && isCondArray(raw[3])) {
                return {
                    count: raw[0],
                    startId: parseXId(raw[1]),
                    endId: parseXId(raw[2]),
                    consumers: parseXPendingConsumers(raw[3])
                };
            } else {
                throw "parse err";
            }
        });
    }
    xpendingCount(key, group, startEndCount, consumer) {
        const args = [];
        args.push(xidstr(startEndCount.start));
        args.push(xidstr(startEndCount.end));
        args.push(startEndCount.count);
        if (consumer) {
            args.push(consumer);
        }
        return this.execArrayReply("XPENDING", key, group, ...args).then((raw)=>parseXPendingCounts(raw));
    }
    xrange(key, start, end, count) {
        const args = [
            key,
            xidstr(start),
            xidstr(end)
        ];
        if (count !== undefined) {
            args.push("COUNT");
            args.push(count);
        }
        return this.execArrayReply("XRANGE", ...args).then((raw)=>raw.map((m)=>parseXMessage(m)));
    }
    xrevrange(key, start, end, count) {
        const args = [
            key,
            xidstr(start),
            xidstr(end)
        ];
        if (count !== undefined) {
            args.push("COUNT");
            args.push(count);
        }
        return this.execArrayReply("XREVRANGE", ...args).then((raw)=>raw.map((m)=>parseXMessage(m)));
    }
    xread(keyXIds, opts) {
        const args = [];
        if (opts) {
            if (opts.count !== undefined) {
                args.push("COUNT");
                args.push(opts.count);
            }
            if (opts.block !== undefined) {
                args.push("BLOCK");
                args.push(opts.block);
            }
        }
        args.push("STREAMS");
        const theKeys = [];
        const theXIds = [];
        for (const a of keyXIds){
            if (a instanceof Array) {
                // XKeyIdLike
                theKeys.push(a[0]);
                theXIds.push(xidstr(a[1]));
            } else {
                // XKeyId
                theKeys.push(a.key);
                theXIds.push(xidstr(a.xid));
            }
        }
        return this.execArrayReply("XREAD", ...args.concat(theKeys).concat(theXIds)).then((raw)=>parseXReadReply(raw));
    }
    xreadgroup(keyXIds, { group , consumer , count , block  }) {
        const args = [
            "GROUP",
            group,
            consumer
        ];
        if (count !== undefined) {
            args.push("COUNT");
            args.push(count);
        }
        if (block !== undefined) {
            args.push("BLOCK");
            args.push(block);
        }
        args.push("STREAMS");
        const theKeys = [];
        const theXIds = [];
        for (const a of keyXIds){
            if (a instanceof Array) {
                // XKeyIdGroupLike
                theKeys.push(a[0]);
                theXIds.push(a[1] === ">" ? ">" : xidstr(a[1]));
            } else {
                // XKeyIdGroup
                theKeys.push(a.key);
                theXIds.push(a.xid === ">" ? ">" : xidstr(a.xid));
            }
        }
        return this.execArrayReply("XREADGROUP", ...args.concat(theKeys).concat(theXIds)).then((raw)=>parseXReadReply(raw));
    }
    xtrim(key, maxlen) {
        const args = [];
        if (maxlen.approx) {
            args.push("~");
        }
        args.push(maxlen.elements);
        return this.execIntegerReply("XTRIM", key, "MAXLEN", ...args);
    }
    zadd(key, param1, param2, opts) {
        const args = [
            key
        ];
        if (Array.isArray(param1)) {
            this.pushZAddOpts(args, param2);
            args.push(...param1.flatMap((e)=>e));
            opts = param2;
        } else if (typeof param1 === "object") {
            this.pushZAddOpts(args, param2);
            for (const [member, score] of Object.entries(param1)){
                args.push(score, member);
            }
        } else {
            this.pushZAddOpts(args, opts);
            args.push(param1, param2);
        }
        return this.execIntegerReply("ZADD", ...args);
    }
    pushZAddOpts(args, opts) {
        if (opts?.mode) {
            args.push(opts.mode);
        }
        if (opts?.ch) {
            args.push("CH");
        }
    }
    zaddIncr(key, score, member, opts) {
        const args = [
            key
        ];
        this.pushZAddOpts(args, opts);
        args.push("INCR", score, member);
        return this.execBulkReply("ZADD", ...args);
    }
    zcard(key) {
        return this.execIntegerReply("ZCARD", key);
    }
    zcount(key, min, max) {
        return this.execIntegerReply("ZCOUNT", key, min, max);
    }
    zincrby(key, increment, member) {
        return this.execBulkReply("ZINCRBY", key, increment, member);
    }
    zinter(keys, opts) {
        const args = this.pushZStoreArgs([], keys, opts);
        if (opts?.withScore) {
            args.push("WITHSCORES");
        }
        return this.execArrayReply("ZINTER", ...args);
    }
    zinterstore(destination, keys, opts) {
        const args = this.pushZStoreArgs([
            destination
        ], keys, opts);
        return this.execIntegerReply("ZINTERSTORE", ...args);
    }
    zunionstore(destination, keys, opts) {
        const args = this.pushZStoreArgs([
            destination
        ], keys, opts);
        return this.execIntegerReply("ZUNIONSTORE", ...args);
    }
    pushZStoreArgs(args, keys, opts) {
        if (Array.isArray(keys)) {
            args.push(keys.length);
            if (Array.isArray(keys[0])) {
                keys = keys;
                args.push(...keys.map((e)=>e[0]));
                args.push("WEIGHTS");
                args.push(...keys.map((e)=>e[1]));
            } else {
                args.push(...keys);
            }
        } else {
            args.push(Object.keys(keys).length);
            args.push(...Object.keys(keys));
            args.push("WEIGHTS");
            args.push(...Object.values(keys));
        }
        if (opts?.aggregate) {
            args.push("AGGREGATE", opts.aggregate);
        }
        return args;
    }
    zlexcount(key, min, max) {
        return this.execIntegerReply("ZLEXCOUNT", key, min, max);
    }
    zpopmax(key, count) {
        if (count !== undefined) {
            return this.execArrayReply("ZPOPMAX", key, count);
        }
        return this.execArrayReply("ZPOPMAX", key);
    }
    zpopmin(key, count) {
        if (count !== undefined) {
            return this.execArrayReply("ZPOPMIN", key, count);
        }
        return this.execArrayReply("ZPOPMIN", key);
    }
    zrange(key, start, stop, opts) {
        const args = this.pushZRangeOpts([
            key,
            start,
            stop
        ], opts);
        return this.execArrayReply("ZRANGE", ...args);
    }
    zrangebylex(key, min, max, opts) {
        const args = this.pushZRangeOpts([
            key,
            min,
            max
        ], opts);
        return this.execArrayReply("ZRANGEBYLEX", ...args);
    }
    zrangebyscore(key, min, max, opts) {
        const args = this.pushZRangeOpts([
            key,
            min,
            max
        ], opts);
        return this.execArrayReply("ZRANGEBYSCORE", ...args);
    }
    zrank(key, member) {
        return this.execIntegerOrNilReply("ZRANK", key, member);
    }
    zrem(key, ...members) {
        return this.execIntegerReply("ZREM", key, ...members);
    }
    zremrangebylex(key, min, max) {
        return this.execIntegerReply("ZREMRANGEBYLEX", key, min, max);
    }
    zremrangebyrank(key, start, stop) {
        return this.execIntegerReply("ZREMRANGEBYRANK", key, start, stop);
    }
    zremrangebyscore(key, min, max) {
        return this.execIntegerReply("ZREMRANGEBYSCORE", key, min, max);
    }
    zrevrange(key, start, stop, opts) {
        const args = this.pushZRangeOpts([
            key,
            start,
            stop
        ], opts);
        return this.execArrayReply("ZREVRANGE", ...args);
    }
    zrevrangebylex(key, max, min, opts) {
        const args = this.pushZRangeOpts([
            key,
            min,
            max
        ], opts);
        return this.execArrayReply("ZREVRANGEBYLEX", ...args);
    }
    zrevrangebyscore(key, max, min, opts) {
        const args = this.pushZRangeOpts([
            key,
            max,
            min
        ], opts);
        return this.execArrayReply("ZREVRANGEBYSCORE", ...args);
    }
    pushZRangeOpts(args, opts) {
        if (opts?.withScore) {
            args.push("WITHSCORES");
        }
        if (opts?.limit) {
            args.push("LIMIT", opts.limit.offset, opts.limit.count);
        }
        return args;
    }
    zrevrank(key, member) {
        return this.execIntegerOrNilReply("ZREVRANK", key, member);
    }
    zscore(key, member) {
        return this.execBulkReply("ZSCORE", key, member);
    }
    scan(cursor, opts) {
        const args = this.pushScanOpts([
            cursor
        ], opts);
        return this.execArrayReply("SCAN", ...args);
    }
    sscan(key, cursor, opts) {
        const args = this.pushScanOpts([
            key,
            cursor
        ], opts);
        return this.execArrayReply("SSCAN", ...args);
    }
    hscan(key, cursor, opts) {
        const args = this.pushScanOpts([
            key,
            cursor
        ], opts);
        return this.execArrayReply("HSCAN", ...args);
    }
    zscan(key, cursor, opts) {
        const args = this.pushScanOpts([
            key,
            cursor
        ], opts);
        return this.execArrayReply("ZSCAN", ...args);
    }
    pushScanOpts(args, opts) {
        if (opts?.pattern !== undefined) {
            args.push("MATCH", opts.pattern);
        }
        if (opts?.count !== undefined) {
            args.push("COUNT", opts.count);
        }
        if (opts?.type !== undefined) {
            args.push("TYPE", opts.type);
        }
        return args;
    }
    tx() {
        return createRedisPipeline(this.executor.connection, true);
    }
    pipeline() {
        return createRedisPipeline(this.executor.connection);
    }
}
/**
 * Connect to Redis server
 * @param options
 * @example
 * ```ts
 * import { connect } from "./mod.ts";
 * const conn1 = await connect({hostname: "127.0.0.1", port: 6379}); // -> TCP, 127.0.0.1:6379
 * const conn2 = await connect({hostname: "redis.proxy", port: 443, tls: true}); // -> TLS, redis.proxy:443
 * ```
 */ export async function connect(options) {
    const connection = createRedisConnection(options);
    await connection.connect();
    const executor = new DefaultExecutor(connection);
    return create(executor);
}
/**
 * Create a lazy Redis client that will not establish a connection until a command is actually executed.
 *
 * ```ts
 * import { createLazyClient } from "./mod.ts";
 *
 * const client = createLazyClient({ hostname: "127.0.0.1", port: 6379 });
 * console.assert(!client.isConnected);
 * await client.get("foo");
 * console.assert(client.isConnected);
 * ```
 */ export function createLazyClient(options) {
    const connection = createRedisConnection(options);
    const executor = createLazyExecutor(connection);
    return create(executor);
}
/**
 * Create a redis client from `CommandExecutor`
 */ export function create(executor) {
    return new RedisImpl(executor);
}
/**
 * Extract RedisConnectOptions from redis URL
 * @param url
 * @example
 * ```ts
 * import { parseURL } from "./mod.ts";
 *
 * parseURL("redis://foo:bar@localhost:6379/1"); // -> {hostname: "localhost", port: "6379", tls: false, db: 1, name: foo, password: bar}
 * parseURL("rediss://127.0.0.1:443/?db=2&password=bar"); // -> {hostname: "127.0.0.1", port: "443", tls: true, db: 2, name: undefined, password: bar}
 * ```
 */ export function parseURL(url) {
    const { protocol , hostname , port , username , password , pathname , searchParams  } = new URL(url);
    const db = pathname.replace("/", "") !== "" ? pathname.replace("/", "") : searchParams.get("db") ?? undefined;
    return {
        hostname: hostname !== "" ? hostname : "localhost",
        port: port !== "" ? parseInt(port, 10) : 6379,
        tls: protocol == "rediss:" ? true : searchParams.get("ssl") === "true",
        db: db ? parseInt(db, 10) : undefined,
        name: username !== "" ? username : undefined,
        password: password !== "" ? password : searchParams.get("password") ?? undefined
    };
}
function createRedisConnection(options) {
    const { hostname , port =6379 , ...opts } = options;
    return new RedisConnection(hostname, port, opts);
}
function createLazyExecutor(connection) {
    let executor = null;
    return {
        get connection () {
            return connection;
        },
        exec (command, ...args) {
            return this.sendCommand(command, args);
        },
        async sendCommand (command, args, options) {
            if (!executor) {
                executor = new DefaultExecutor(connection);
                if (!connection.isConnected) {
                    await connection.connect();
                }
            }
            return executor.sendCommand(command, args, options);
        },
        close () {
            if (executor) {
                return executor.close();
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvcmVkaXNAdjAuMzIuNC9yZWRpcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIEFDTExvZ01vZGUsXG4gIEJpdGZpZWxkT3B0cyxcbiAgQml0ZmllbGRXaXRoT3ZlcmZsb3dPcHRzLFxuICBDbGllbnRDYWNoaW5nTW9kZSxcbiAgQ2xpZW50S2lsbE9wdHMsXG4gIENsaWVudExpc3RPcHRzLFxuICBDbGllbnRQYXVzZU1vZGUsXG4gIENsaWVudFRyYWNraW5nT3B0cyxcbiAgQ2xpZW50VW5ibG9ja2luZ0JlaGF2aW91cixcbiAgQ2x1c3RlckZhaWxvdmVyTW9kZSxcbiAgQ2x1c3RlclJlc2V0TW9kZSxcbiAgQ2x1c3RlclNldFNsb3RTdWJjb21tYW5kLFxuICBHZW9SYWRpdXNPcHRzLFxuICBHZW9Vbml0LFxuICBIU2Nhbk9wdHMsXG4gIExJbnNlcnRMb2NhdGlvbixcbiAgTFBvc09wdHMsXG4gIExQb3NXaXRoQ291bnRPcHRzLFxuICBNZW1vcnlVc2FnZU9wdHMsXG4gIE1pZ3JhdGVPcHRzLFxuICBSZWRpc0NvbW1hbmRzLFxuICBSZXN0b3JlT3B0cyxcbiAgU2Nhbk9wdHMsXG4gIFNjcmlwdERlYnVnTW9kZSxcbiAgU2V0T3B0cyxcbiAgU2V0V2l0aE1vZGVPcHRzLFxuICBTaHV0ZG93bk1vZGUsXG4gIFNvcnRPcHRzLFxuICBTb3J0V2l0aERlc3RpbmF0aW9uT3B0cyxcbiAgU1NjYW5PcHRzLFxuICBTdHJhbGdvQWxnb3JpdGhtLFxuICBTdHJhbGdvT3B0cyxcbiAgU3RyYWxnb1RhcmdldCxcbiAgWkFkZE9wdHMsXG4gIFpJbnRlck9wdHMsXG4gIFpJbnRlcnN0b3JlT3B0cyxcbiAgWlJhbmdlQnlMZXhPcHRzLFxuICBaUmFuZ2VCeVNjb3JlT3B0cyxcbiAgWlJhbmdlT3B0cyxcbiAgWlNjYW5PcHRzLFxuICBaVW5pb25zdG9yZU9wdHMsXG59IGZyb20gXCIuL2NvbW1hbmQudHNcIjtcbmltcG9ydCB7IFJlZGlzQ29ubmVjdGlvbiB9IGZyb20gXCIuL2Nvbm5lY3Rpb24udHNcIjtcbmltcG9ydCB0eXBlIHsgQ29ubmVjdGlvbiwgU2VuZENvbW1hbmRPcHRpb25zIH0gZnJvbSBcIi4vY29ubmVjdGlvbi50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZWRpc0Nvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSBcIi4vY29ubmVjdGlvbi50c1wiO1xuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yLCBEZWZhdWx0RXhlY3V0b3IgfSBmcm9tIFwiLi9leGVjdXRvci50c1wiO1xuaW1wb3J0IHR5cGUge1xuICBCaW5hcnksXG4gIEJ1bGssXG4gIEJ1bGtOaWwsXG4gIEJ1bGtTdHJpbmcsXG4gIENvbmRpdGlvbmFsQXJyYXksXG4gIEludGVnZXIsXG4gIFJhdyxcbiAgUmVkaXNSZXBseSxcbiAgUmVkaXNWYWx1ZSxcbiAgU2ltcGxlU3RyaW5nLFxufSBmcm9tIFwiLi9wcm90b2NvbC9zaGFyZWQvdHlwZXMudHNcIjtcbmltcG9ydCB7IGNyZWF0ZVJlZGlzUGlwZWxpbmUgfSBmcm9tIFwiLi9waXBlbGluZS50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZWRpc1N1YnNjcmlwdGlvbiB9IGZyb20gXCIuL3B1YnN1Yi50c1wiO1xuaW1wb3J0IHsgcHN1YnNjcmliZSwgc3Vic2NyaWJlIH0gZnJvbSBcIi4vcHVic3ViLnRzXCI7XG5pbXBvcnQge1xuICBjb252ZXJ0TWFwLFxuICBpc0NvbmRBcnJheSxcbiAgaXNOdW1iZXIsXG4gIGlzU3RyaW5nLFxuICBwYXJzZVhHcm91cERldGFpbCxcbiAgcGFyc2VYSWQsXG4gIHBhcnNlWE1lc3NhZ2UsXG4gIHBhcnNlWFBlbmRpbmdDb25zdW1lcnMsXG4gIHBhcnNlWFBlbmRpbmdDb3VudHMsXG4gIHBhcnNlWFJlYWRSZXBseSxcbiAgcmF3bnVtLFxuICByYXdzdHIsXG4gIFN0YXJ0RW5kQ291bnQsXG4gIFhBZGRGaWVsZFZhbHVlcyxcbiAgWENsYWltSnVzdFhJZCxcbiAgWENsYWltTWVzc2FnZXMsXG4gIFhDbGFpbU9wdHMsXG4gIFhJZCxcbiAgWElkQWRkLFxuICBYSWRJbnB1dCxcbiAgWElkTmVnLFxuICBYSWRQb3MsXG4gIHhpZHN0cixcbiAgWEtleUlkLFxuICBYS2V5SWRHcm91cCxcbiAgWEtleUlkR3JvdXBMaWtlLFxuICBYS2V5SWRMaWtlLFxuICBYTWF4bGVuLFxuICBYUmVhZEdyb3VwT3B0cyxcbiAgWFJlYWRJZERhdGEsXG4gIFhSZWFkT3B0cyxcbiAgWFJlYWRTdHJlYW1SYXcsXG59IGZyb20gXCIuL3N0cmVhbS50c1wiO1xuXG5jb25zdCBiaW5hcnlDb21tYW5kT3B0aW9ucyA9IHtcbiAgcmV0dXJuVWludDhBcnJheXM6IHRydWUsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZGlzIGV4dGVuZHMgUmVkaXNDb21tYW5kcyB7XG4gIHJlYWRvbmx5IGlzQ2xvc2VkOiBib29sZWFuO1xuICByZWFkb25seSBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogTG93IGxldmVsIGludGVyZmFjZSBmb3IgUmVkaXMgc2VydmVyXG4gICAqL1xuICBzZW5kQ29tbWFuZChcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgYXJncz86IFJlZGlzVmFsdWVbXSxcbiAgICBvcHRpb25zPzogU2VuZENvbW1hbmRPcHRpb25zLFxuICApOiBQcm9taXNlPFJlZGlzUmVwbHk+O1xuICBjb25uZWN0KCk6IFByb21pc2U8dm9pZD47XG4gIGNsb3NlKCk6IHZvaWQ7XG4gIFtTeW1ib2wuZGlzcG9zZV0oKTogdm9pZDtcbn1cblxuY2xhc3MgUmVkaXNJbXBsIGltcGxlbWVudHMgUmVkaXMge1xuICBwcml2YXRlIHJlYWRvbmx5IGV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3I7XG5cbiAgZ2V0IGlzQ2xvc2VkKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dG9yLmNvbm5lY3Rpb24uaXNDbG9zZWQ7XG4gIH1cblxuICBnZXQgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0b3IuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3IpIHtcbiAgICB0aGlzLmV4ZWN1dG9yID0gZXhlY3V0b3I7XG4gIH1cblxuICBzZW5kQ29tbWFuZChcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgYXJncz86IFJlZGlzVmFsdWVbXSxcbiAgICBvcHRpb25zPzogU2VuZENvbW1hbmRPcHRpb25zLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRvci5zZW5kQ29tbWFuZChjb21tYW5kLCBhcmdzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0b3IuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRvci5jbG9zZSgpO1xuICB9XG5cbiAgW1N5bWJvbC5kaXNwb3NlXSgpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgYXN5bmMgZXhlY1JlcGx5PFQgZXh0ZW5kcyBSYXcgPSBSYXc+KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCB0aGlzLmV4ZWN1dG9yLmV4ZWMoXG4gICAgICBjb21tYW5kLFxuICAgICAgLi4uYXJncyxcbiAgICApO1xuICAgIHJldHVybiByZXBseSBhcyBUO1xuICB9XG5cbiAgYXN5bmMgZXhlY1N0YXR1c1JlcGx5KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxTaW1wbGVTdHJpbmc+IHtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHRoaXMuZXhlY3V0b3IuZXhlYyhjb21tYW5kLCAuLi5hcmdzKTtcbiAgICByZXR1cm4gcmVwbHkgYXMgU2ltcGxlU3RyaW5nO1xuICB9XG5cbiAgYXN5bmMgZXhlY0ludGVnZXJSZXBseShcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgLi4uYXJnczogUmVkaXNWYWx1ZVtdXG4gICk6IFByb21pc2U8SW50ZWdlcj4ge1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgdGhpcy5leGVjdXRvci5leGVjKGNvbW1hbmQsIC4uLmFyZ3MpO1xuICAgIHJldHVybiByZXBseSBhcyBJbnRlZ2VyO1xuICB9XG5cbiAgYXN5bmMgZXhlY0JpbmFyeVJlcGx5KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxCaW5hcnkgfCBCdWxrTmlsPiB7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCB0aGlzLmV4ZWN1dG9yLnNlbmRDb21tYW5kKFxuICAgICAgY29tbWFuZCxcbiAgICAgIGFyZ3MsXG4gICAgICBiaW5hcnlDb21tYW5kT3B0aW9ucyxcbiAgICApO1xuICAgIHJldHVybiByZXBseSBhcyBCaW5hcnkgfCBCdWxrTmlsO1xuICB9XG5cbiAgYXN5bmMgZXhlY0J1bGtSZXBseTxUIGV4dGVuZHMgQnVsayA9IEJ1bGs+KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCB0aGlzLmV4ZWN1dG9yLmV4ZWMoY29tbWFuZCwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlcGx5IGFzIFQ7XG4gIH1cblxuICBhc3luYyBleGVjQXJyYXlSZXBseTxUIGV4dGVuZHMgUmF3ID0gUmF3PihcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgLi4uYXJnczogUmVkaXNWYWx1ZVtdXG4gICk6IFByb21pc2U8VFtdPiB7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCB0aGlzLmV4ZWN1dG9yLmV4ZWMoY29tbWFuZCwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlcGx5IGFzIEFycmF5PFQ+O1xuICB9XG5cbiAgYXN5bmMgZXhlY0ludGVnZXJPck5pbFJlcGx5KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxJbnRlZ2VyIHwgQnVsa05pbD4ge1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgdGhpcy5leGVjdXRvci5leGVjKGNvbW1hbmQsIC4uLmFyZ3MpO1xuICAgIHJldHVybiByZXBseSBhcyBJbnRlZ2VyIHwgQnVsa05pbDtcbiAgfVxuXG4gIGFzeW5jIGV4ZWNTdGF0dXNPck5pbFJlcGx5KFxuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBSZWRpc1ZhbHVlW11cbiAgKTogUHJvbWlzZTxTaW1wbGVTdHJpbmcgfCBCdWxrTmlsPiB7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCB0aGlzLmV4ZWN1dG9yLmV4ZWMoY29tbWFuZCwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlcGx5IGFzIFNpbXBsZVN0cmluZyB8IEJ1bGtOaWw7XG4gIH1cblxuICBhY2xDYXQoY2F0ZWdvcnluYW1lPzogc3RyaW5nKSB7XG4gICAgaWYgKGNhdGVnb3J5bmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkFDTFwiLCBcIkNBVFwiLCBjYXRlZ29yeW5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkFDTFwiLCBcIkNBVFwiKTtcbiAgfVxuXG4gIGFjbERlbFVzZXIoLi4udXNlcm5hbWVzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJBQ0xcIiwgXCJERUxVU0VSXCIsIC4uLnVzZXJuYW1lcyk7XG4gIH1cblxuICBhY2xHZW5QYXNzKGJpdHM/OiBudW1iZXIpIHtcbiAgICBpZiAoYml0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5PEJ1bGtTdHJpbmc+KFwiQUNMXCIsIFwiR0VOUEFTU1wiLCBiaXRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcIkFDTFwiLCBcIkdFTlBBU1NcIik7XG4gIH1cblxuICBhY2xHZXRVc2VyKHVzZXJuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nIHwgQnVsa1N0cmluZ1tdPihcbiAgICAgIFwiQUNMXCIsXG4gICAgICBcIkdFVFVTRVJcIixcbiAgICAgIHVzZXJuYW1lLFxuICAgICk7XG4gIH1cblxuICBhY2xIZWxwKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiQUNMXCIsIFwiSEVMUFwiKTtcbiAgfVxuXG4gIGFjbExpc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJBQ0xcIiwgXCJMSVNUXCIpO1xuICB9XG5cbiAgYWNsTG9hZCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJBQ0xcIiwgXCJMT0FEXCIpO1xuICB9XG5cbiAgYWNsTG9nKGNvdW50OiBudW1iZXIpOiBQcm9taXNlPEJ1bGtTdHJpbmdbXT47XG4gIGFjbExvZyhtb2RlOiBBQ0xMb2dNb2RlKTogUHJvbWlzZTxTaW1wbGVTdHJpbmc+O1xuICBhY2xMb2cocGFyYW06IG51bWJlciB8IEFDTExvZ01vZGUpIHtcbiAgICBpZiAocGFyYW0gPT09IFwiUkVTRVRcIikge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQUNMXCIsIFwiTE9HXCIsIFwiUkVTRVRcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiQUNMXCIsIFwiTE9HXCIsIHBhcmFtKTtcbiAgfVxuXG4gIGFjbFNhdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQUNMXCIsIFwiU0FWRVwiKTtcbiAgfVxuXG4gIGFjbFNldFVzZXIodXNlcm5hbWU6IHN0cmluZywgLi4ucnVsZXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQUNMXCIsIFwiU0VUVVNFUlwiLCB1c2VybmFtZSwgLi4ucnVsZXMpO1xuICB9XG5cbiAgYWNsVXNlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJBQ0xcIiwgXCJVU0VSU1wiKTtcbiAgfVxuXG4gIGFjbFdob2FtaSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5PEJ1bGtTdHJpbmc+KFwiQUNMXCIsIFwiV0hPQU1JXCIpO1xuICB9XG5cbiAgYXBwZW5kKGtleTogc3RyaW5nLCB2YWx1ZTogUmVkaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJBUFBFTkRcIiwga2V5LCB2YWx1ZSk7XG4gIH1cblxuICBhdXRoKHBhcmFtMTogUmVkaXNWYWx1ZSwgcGFyYW0yPzogUmVkaXNWYWx1ZSkge1xuICAgIGlmIChwYXJhbTIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQVVUSFwiLCBwYXJhbTEsIHBhcmFtMik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkFVVEhcIiwgcGFyYW0xKTtcbiAgfVxuXG4gIGJncmV3cml0ZWFvZigpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJCR1JFV1JJVEVBT0ZcIik7XG4gIH1cblxuICBiZ3NhdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQkdTQVZFXCIpO1xuICB9XG5cbiAgYml0Y291bnQoa2V5OiBzdHJpbmcsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpIHtcbiAgICBpZiAoc3RhcnQgIT09IHVuZGVmaW5lZCAmJiBlbmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkJJVENPVU5UXCIsIGtleSwgc3RhcnQsIGVuZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJCSVRDT1VOVFwiLCBrZXkpO1xuICB9XG5cbiAgYml0ZmllbGQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgb3B0cz86IEJpdGZpZWxkT3B0cyB8IEJpdGZpZWxkV2l0aE92ZXJmbG93T3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJnczogKG51bWJlciB8IHN0cmluZylbXSA9IFtrZXldO1xuICAgIGlmIChvcHRzPy5nZXQpIHtcbiAgICAgIGNvbnN0IHsgdHlwZSwgb2Zmc2V0IH0gPSBvcHRzLmdldDtcbiAgICAgIGFyZ3MucHVzaChcIkdFVFwiLCB0eXBlLCBvZmZzZXQpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uc2V0KSB7XG4gICAgICBjb25zdCB7IHR5cGUsIG9mZnNldCwgdmFsdWUgfSA9IG9wdHMuc2V0O1xuICAgICAgYXJncy5wdXNoKFwiU0VUXCIsIHR5cGUsIG9mZnNldCwgdmFsdWUpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uaW5jcmJ5KSB7XG4gICAgICBjb25zdCB7IHR5cGUsIG9mZnNldCwgaW5jcmVtZW50IH0gPSBvcHRzLmluY3JieTtcbiAgICAgIGFyZ3MucHVzaChcIklOQ1JCWVwiLCB0eXBlLCBvZmZzZXQsIGluY3JlbWVudCk7XG4gICAgfVxuICAgIGlmICgob3B0cyBhcyBCaXRmaWVsZFdpdGhPdmVyZmxvd09wdHMpPy5vdmVyZmxvdykge1xuICAgICAgYXJncy5wdXNoKFwiT1ZFUkZMT1dcIiwgKG9wdHMgYXMgQml0ZmllbGRXaXRoT3ZlcmZsb3dPcHRzKS5vdmVyZmxvdyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEludGVnZXI+KFwiQklURklFTERcIiwgLi4uYXJncyk7XG4gIH1cblxuICBiaXRvcChvcGVyYXRpb246IHN0cmluZywgZGVzdGtleTogc3RyaW5nLCAuLi5rZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJCSVRPUFwiLCBvcGVyYXRpb24sIGRlc3RrZXksIC4uLmtleXMpO1xuICB9XG5cbiAgYml0cG9zKGtleTogc3RyaW5nLCBiaXQ6IG51bWJlciwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikge1xuICAgIGlmIChzdGFydCAhPT0gdW5kZWZpbmVkICYmIGVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiQklUUE9TXCIsIGtleSwgYml0LCBzdGFydCwgZW5kKTtcbiAgICB9XG4gICAgaWYgKHN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJCSVRQT1NcIiwga2V5LCBiaXQsIHN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkJJVFBPU1wiLCBrZXksIGJpdCk7XG4gIH1cblxuICBibHBvcCh0aW1lb3V0OiBudW1iZXIsIC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJCTFBPUFwiLCAuLi5rZXlzLCB0aW1lb3V0KSBhcyBQcm9taXNlPFxuICAgICAgW0J1bGtTdHJpbmcsIEJ1bGtTdHJpbmddIHwgQnVsa05pbFxuICAgID47XG4gIH1cblxuICBicnBvcCh0aW1lb3V0OiBudW1iZXIsIC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJCUlBPUFwiLCAuLi5rZXlzLCB0aW1lb3V0KSBhcyBQcm9taXNlPFxuICAgICAgW0J1bGtTdHJpbmcsIEJ1bGtTdHJpbmddIHwgQnVsa05pbFxuICAgID47XG4gIH1cblxuICBicnBvcGxwdXNoKHNvdXJjZTogc3RyaW5nLCBkZXN0aW5hdGlvbjogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiQlJQT1BMUFVTSFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uLCB0aW1lb3V0KTtcbiAgfVxuXG4gIGJ6cG9wbWluKHRpbWVvdXQ6IG51bWJlciwgLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkJaUE9QTUlOXCIsIC4uLmtleXMsIHRpbWVvdXQpIGFzIFByb21pc2U8XG4gICAgICBbQnVsa1N0cmluZywgQnVsa1N0cmluZywgQnVsa1N0cmluZ10gfCBCdWxrTmlsXG4gICAgPjtcbiAgfVxuXG4gIGJ6cG9wbWF4KHRpbWVvdXQ6IG51bWJlciwgLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkJaUE9QTUFYXCIsIC4uLmtleXMsIHRpbWVvdXQpIGFzIFByb21pc2U8XG4gICAgICBbQnVsa1N0cmluZywgQnVsa1N0cmluZywgQnVsa1N0cmluZ10gfCBCdWxrTmlsXG4gICAgPjtcbiAgfVxuXG4gIGNsaWVudENhY2hpbmcobW9kZTogQ2xpZW50Q2FjaGluZ01vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTElFTlRcIiwgXCJDQUNISU5HXCIsIG1vZGUpO1xuICB9XG5cbiAgY2xpZW50R2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiQ0xJRU5UXCIsIFwiR0VUTkFNRVwiKTtcbiAgfVxuXG4gIGNsaWVudEdldFJlZGlyKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJDTElFTlRcIiwgXCJHRVRSRURJUlwiKTtcbiAgfVxuXG4gIGNsaWVudElEKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJDTElFTlRcIiwgXCJJRFwiKTtcbiAgfVxuXG4gIGNsaWVudEluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkNMSUVOVFwiLCBcIklORk9cIik7XG4gIH1cblxuICBjbGllbnRLaWxsKG9wdHM6IENsaWVudEtpbGxPcHRzKSB7XG4gICAgY29uc3QgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuICAgIGlmIChvcHRzLmFkZHIpIHtcbiAgICAgIGFyZ3MucHVzaChcIkFERFJcIiwgb3B0cy5hZGRyKTtcbiAgICB9XG4gICAgaWYgKG9wdHMubGFkZHIpIHtcbiAgICAgIGFyZ3MucHVzaChcIkxBRERSXCIsIG9wdHMubGFkZHIpO1xuICAgIH1cbiAgICBpZiAob3B0cy5pZCkge1xuICAgICAgYXJncy5wdXNoKFwiSURcIiwgb3B0cy5pZCk7XG4gICAgfVxuICAgIGlmIChvcHRzLnR5cGUpIHtcbiAgICAgIGFyZ3MucHVzaChcIlRZUEVcIiwgb3B0cy50eXBlKTtcbiAgICB9XG4gICAgaWYgKG9wdHMudXNlcikge1xuICAgICAgYXJncy5wdXNoKFwiVVNFUlwiLCBvcHRzLnVzZXIpO1xuICAgIH1cbiAgICBpZiAob3B0cy5za2lwbWUpIHtcbiAgICAgIGFyZ3MucHVzaChcIlNLSVBNRVwiLCBvcHRzLnNraXBtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJDTElFTlRcIiwgXCJLSUxMXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgY2xpZW50TGlzdChvcHRzPzogQ2xpZW50TGlzdE9wdHMpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLnR5cGUgJiYgb3B0cy5pZHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9ubHkgb25lIG9mIGB0eXBlYCBvciBgaWRzYCBjYW4gYmUgc3BlY2lmaWVkXCIpO1xuICAgIH1cbiAgICBpZiAob3B0cyAmJiBvcHRzLnR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHkoXCJDTElFTlRcIiwgXCJMSVNUXCIsIFwiVFlQRVwiLCBvcHRzLnR5cGUpO1xuICAgIH1cbiAgICBpZiAob3B0cyAmJiBvcHRzLmlkcykge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkNMSUVOVFwiLCBcIkxJU1RcIiwgXCJJRFwiLCAuLi5vcHRzLmlkcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHkoXCJDTElFTlRcIiwgXCJMSVNUXCIpO1xuICB9XG5cbiAgY2xpZW50UGF1c2UodGltZW91dDogbnVtYmVyLCBtb2RlPzogQ2xpZW50UGF1c2VNb2RlKSB7XG4gICAgaWYgKG1vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkNMSUVOVFwiLCBcIlBBVVNFXCIsIHRpbWVvdXQsIG1vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTElFTlRcIiwgXCJQQVVTRVwiLCB0aW1lb3V0KTtcbiAgfVxuXG4gIGNsaWVudFNldE5hbWUoY29ubmVjdGlvbk5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkNMSUVOVFwiLCBcIlNFVE5BTUVcIiwgY29ubmVjdGlvbk5hbWUpO1xuICB9XG5cbiAgY2xpZW50VHJhY2tpbmcob3B0czogQ2xpZW50VHJhY2tpbmdPcHRzKSB7XG4gICAgY29uc3QgYXJnczogKG51bWJlciB8IHN0cmluZylbXSA9IFtvcHRzLm1vZGVdO1xuICAgIGlmIChvcHRzLnJlZGlyZWN0KSB7XG4gICAgICBhcmdzLnB1c2goXCJSRURJUkVDVFwiLCBvcHRzLnJlZGlyZWN0KTtcbiAgICB9XG4gICAgaWYgKG9wdHMucHJlZml4ZXMpIHtcbiAgICAgIG9wdHMucHJlZml4ZXMuZm9yRWFjaCgocHJlZml4KSA9PiB7XG4gICAgICAgIGFyZ3MucHVzaChcIlBSRUZJWFwiKTtcbiAgICAgICAgYXJncy5wdXNoKHByZWZpeCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdHMuYmNhc3QpIHtcbiAgICAgIGFyZ3MucHVzaChcIkJDQVNUXCIpO1xuICAgIH1cbiAgICBpZiAob3B0cy5vcHRJbikge1xuICAgICAgYXJncy5wdXNoKFwiT1BUSU5cIik7XG4gICAgfVxuICAgIGlmIChvcHRzLm9wdE91dCkge1xuICAgICAgYXJncy5wdXNoKFwiT1BUT1VUXCIpO1xuICAgIH1cbiAgICBpZiAob3B0cy5ub0xvb3ApIHtcbiAgICAgIGFyZ3MucHVzaChcIk5PTE9PUFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ0xJRU5UXCIsIFwiVFJBQ0tJTkdcIiwgLi4uYXJncyk7XG4gIH1cblxuICBjbGllbnRUcmFja2luZ0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJDTElFTlRcIiwgXCJUUkFDS0lOR0lORk9cIik7XG4gIH1cblxuICBjbGllbnRVbmJsb2NrKFxuICAgIGlkOiBudW1iZXIsXG4gICAgYmVoYXZpb3VyPzogQ2xpZW50VW5ibG9ja2luZ0JlaGF2aW91cixcbiAgKTogUHJvbWlzZTxJbnRlZ2VyPiB7XG4gICAgaWYgKGJlaGF2aW91cikge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkNMSUVOVFwiLCBcIlVOQkxPQ0tcIiwgaWQsIGJlaGF2aW91cik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJDTElFTlRcIiwgXCJVTkJMT0NLXCIsIGlkKTtcbiAgfVxuXG4gIGNsaWVudFVucGF1c2UoKTogUHJvbWlzZTxTaW1wbGVTdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTElFTlRcIiwgXCJVTlBBVVNFXCIpO1xuICB9XG5cbiAgYXNraW5nKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkFTS0lOR1wiKTtcbiAgfVxuXG4gIGNsdXN0ZXJBZGRTbG90cyguLi5zbG90czogbnVtYmVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiQUREU0xPVFNcIiwgLi4uc2xvdHMpO1xuICB9XG5cbiAgY2x1c3RlckNvdW50RmFpbHVyZVJlcG9ydHMobm9kZUlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiQ0xVU1RFUlwiLCBcIkNPVU5ULUZBSUxVUkUtUkVQT1JUU1wiLCBub2RlSWQpO1xuICB9XG5cbiAgY2x1c3RlckNvdW50S2V5c0luU2xvdChzbG90OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiQ0xVU1RFUlwiLCBcIkNPVU5US0VZU0lOU0xPVFwiLCBzbG90KTtcbiAgfVxuXG4gIGNsdXN0ZXJEZWxTbG90cyguLi5zbG90czogbnVtYmVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiREVMU0xPVFNcIiwgLi4uc2xvdHMpO1xuICB9XG5cbiAgY2x1c3RlckZhaWxvdmVyKG1vZGU/OiBDbHVzdGVyRmFpbG92ZXJNb2RlKSB7XG4gICAgaWYgKG1vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkNMVVNURVJcIiwgXCJGQUlMT1ZFUlwiLCBtb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ0xVU1RFUlwiLCBcIkZBSUxPVkVSXCIpO1xuICB9XG5cbiAgY2x1c3RlckZsdXNoU2xvdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ0xVU1RFUlwiLCBcIkZMVVNIU0xPVFNcIik7XG4gIH1cblxuICBjbHVzdGVyRm9yZ2V0KG5vZGVJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ0xVU1RFUlwiLCBcIkZPUkdFVFwiLCBub2RlSWQpO1xuICB9XG5cbiAgY2x1c3RlckdldEtleXNJblNsb3Qoc2xvdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXG4gICAgICBcIkNMVVNURVJcIixcbiAgICAgIFwiR0VUS0VZU0lOU0xPVFwiLFxuICAgICAgc2xvdCxcbiAgICAgIGNvdW50LFxuICAgICk7XG4gIH1cblxuICBjbHVzdGVySW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiSU5GT1wiKTtcbiAgfVxuXG4gIGNsdXN0ZXJLZXlTbG90KGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkNMVVNURVJcIiwgXCJLRVlTTE9UXCIsIGtleSk7XG4gIH1cblxuICBjbHVzdGVyTWVldChpcDogc3RyaW5nLCBwb3J0OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiTUVFVFwiLCBpcCwgcG9ydCk7XG4gIH1cblxuICBjbHVzdGVyTXlJRCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiTVlJRFwiKTtcbiAgfVxuXG4gIGNsdXN0ZXJOb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5PEJ1bGtTdHJpbmc+KFwiQ0xVU1RFUlwiLCBcIk5PREVTXCIpO1xuICB9XG5cbiAgY2x1c3RlclJlcGxpY2FzKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJDTFVTVEVSXCIsIFwiUkVQTElDQVNcIiwgbm9kZUlkKTtcbiAgfVxuXG4gIGNsdXN0ZXJSZXBsaWNhdGUobm9kZUlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiUkVQTElDQVRFXCIsIG5vZGVJZCk7XG4gIH1cblxuICBjbHVzdGVyUmVzZXQobW9kZT86IENsdXN0ZXJSZXNldE1vZGUpIHtcbiAgICBpZiAobW9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ0xVU1RFUlwiLCBcIlJFU0VUXCIsIG1vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiUkVTRVRcIik7XG4gIH1cblxuICBjbHVzdGVyU2F2ZUNvbmZpZygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiU0FWRUNPTkZJR1wiKTtcbiAgfVxuXG4gIGNsdXN0ZXJTZXRTbG90KFxuICAgIHNsb3Q6IG51bWJlcixcbiAgICBzdWJjb21tYW5kOiBDbHVzdGVyU2V0U2xvdFN1YmNvbW1hbmQsXG4gICAgbm9kZUlkPzogc3RyaW5nLFxuICApIHtcbiAgICBpZiAobm9kZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcbiAgICAgICAgXCJDTFVTVEVSXCIsXG4gICAgICAgIFwiU0VUU0xPVFwiLFxuICAgICAgICBzbG90LFxuICAgICAgICBzdWJjb21tYW5kLFxuICAgICAgICBub2RlSWQsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJDTFVTVEVSXCIsIFwiU0VUU0xPVFwiLCBzbG90LCBzdWJjb21tYW5kKTtcbiAgfVxuXG4gIGNsdXN0ZXJTbGF2ZXMobm9kZUlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkNMVVNURVJcIiwgXCJTTEFWRVNcIiwgbm9kZUlkKTtcbiAgfVxuXG4gIGNsdXN0ZXJTbG90cygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkNMVVNURVJcIiwgXCJTTE9UU1wiKTtcbiAgfVxuXG4gIGNvbW1hbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJDT01NQU5EXCIpIGFzIFByb21pc2U8XG4gICAgICBbQnVsa1N0cmluZywgSW50ZWdlciwgQnVsa1N0cmluZ1tdLCBJbnRlZ2VyLCBJbnRlZ2VyLCBJbnRlZ2VyXVtdXG4gICAgPjtcbiAgfVxuXG4gIGNvbW1hbmRDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiQ09NTUFORFwiLCBcIkNPVU5UXCIpO1xuICB9XG5cbiAgY29tbWFuZEdldEtleXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJDT01NQU5EXCIsIFwiR0VUS0VZU1wiKTtcbiAgfVxuXG4gIGNvbW1hbmRJbmZvKC4uLmNvbW1hbmROYW1lczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkNPTU1BTkRcIiwgXCJJTkZPXCIsIC4uLmNvbW1hbmROYW1lcykgYXMgUHJvbWlzZTxcbiAgICAgIChcbiAgICAgICAgfCBbQnVsa1N0cmluZywgSW50ZWdlciwgQnVsa1N0cmluZ1tdLCBJbnRlZ2VyLCBJbnRlZ2VyLCBJbnRlZ2VyXVxuICAgICAgICB8IEJ1bGtOaWxcbiAgICAgIClbXVxuICAgID47XG4gIH1cblxuICBjb25maWdHZXQocGFyYW1ldGVyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkNPTkZJR1wiLCBcIkdFVFwiLCBwYXJhbWV0ZXIpO1xuICB9XG5cbiAgY29uZmlnUmVzZXRTdGF0KCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkNPTkZJR1wiLCBcIlJFU0VUU1RBVFwiKTtcbiAgfVxuXG4gIGNvbmZpZ1Jld3JpdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiQ09ORklHXCIsIFwiUkVXUklURVwiKTtcbiAgfVxuXG4gIGNvbmZpZ1NldChwYXJhbWV0ZXI6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkNPTkZJR1wiLCBcIlNFVFwiLCBwYXJhbWV0ZXIsIHZhbHVlKTtcbiAgfVxuXG4gIGRic2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiREJTSVpFXCIpO1xuICB9XG5cbiAgZGVidWdPYmplY3Qoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJERUJVR1wiLCBcIk9CSkVDVFwiLCBrZXkpO1xuICB9XG5cbiAgZGVidWdTZWdmYXVsdCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJERUJVR1wiLCBcIlNFR0ZBVUxUXCIpO1xuICB9XG5cbiAgZGVjcihrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJERUNSXCIsIGtleSk7XG4gIH1cblxuICBkZWNyYnkoa2V5OiBzdHJpbmcsIGRlY3JlbWVudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkRFQ1JCWVwiLCBrZXksIGRlY3JlbWVudCk7XG4gIH1cblxuICBkZWwoLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiREVMXCIsIC4uLmtleXMpO1xuICB9XG5cbiAgZGlzY2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJESVNDQVJEXCIpO1xuICB9XG5cbiAgZHVtcChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNCaW5hcnlSZXBseShcIkRVTVBcIiwga2V5KTtcbiAgfVxuXG4gIGVjaG8obWVzc2FnZTogUmVkaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHk8QnVsa1N0cmluZz4oXCJFQ0hPXCIsIG1lc3NhZ2UpO1xuICB9XG5cbiAgZXZhbChzY3JpcHQ6IHN0cmluZywga2V5czogc3RyaW5nW10sIGFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1JlcGx5KFxuICAgICAgXCJFVkFMXCIsXG4gICAgICBzY3JpcHQsXG4gICAgICBrZXlzLmxlbmd0aCxcbiAgICAgIC4uLmtleXMsXG4gICAgICAuLi5hcmdzLFxuICAgICk7XG4gIH1cblxuICBldmFsc2hhKHNoYTE6IHN0cmluZywga2V5czogc3RyaW5nW10sIGFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1JlcGx5KFxuICAgICAgXCJFVkFMU0hBXCIsXG4gICAgICBzaGExLFxuICAgICAga2V5cy5sZW5ndGgsXG4gICAgICAuLi5rZXlzLFxuICAgICAgLi4uYXJncyxcbiAgICApO1xuICB9XG5cbiAgZXhlYygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkVYRUNcIik7XG4gIH1cblxuICBleGlzdHMoLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiRVhJU1RTXCIsIC4uLmtleXMpO1xuICB9XG5cbiAgZXhwaXJlKGtleTogc3RyaW5nLCBzZWNvbmRzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiRVhQSVJFXCIsIGtleSwgc2Vjb25kcyk7XG4gIH1cblxuICBleHBpcmVhdChrZXk6IHN0cmluZywgdGltZXN0YW1wOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiRVhQSVJFQVRcIiwga2V5LCB0aW1lc3RhbXApO1xuICB9XG5cbiAgZmx1c2hhbGwoYXN5bmM/OiBib29sZWFuKSB7XG4gICAgaWYgKGFzeW5jKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJGTFVTSEFMTFwiLCBcIkFTWU5DXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJGTFVTSEFMTFwiKTtcbiAgfVxuXG4gIGZsdXNoZGIoYXN5bmM/OiBib29sZWFuKSB7XG4gICAgaWYgKGFzeW5jKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJGTFVTSERCXCIsIFwiQVNZTkNcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkZMVVNIREJcIik7XG4gIH1cblxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBnZW9hZGQoa2V5OiBzdHJpbmcsIC4uLnBhcmFtczogYW55W10pIHtcbiAgICBjb25zdCBhcmdzOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gW2tleV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zWzBdKSkge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcy5mbGF0TWFwKChlKSA9PiBlKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zWzBdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmb3IgKGNvbnN0IFttZW1iZXIsIGxuZ2xhdF0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zWzBdKSkge1xuICAgICAgICBhcmdzLnB1c2goLi4uKGxuZ2xhdCBhcyBbbnVtYmVyLCBudW1iZXJdKSwgbWVtYmVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJHRU9BRERcIiwgLi4uYXJncyk7XG4gIH1cblxuICBnZW9oYXNoKGtleTogc3RyaW5nLCAuLi5tZW1iZXJzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGs+KFwiR0VPSEFTSFwiLCBrZXksIC4uLm1lbWJlcnMpO1xuICB9XG5cbiAgZ2VvcG9zKGtleTogc3RyaW5nLCAuLi5tZW1iZXJzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5KFwiR0VPUE9TXCIsIGtleSwgLi4ubWVtYmVycykgYXMgUHJvbWlzZTxcbiAgICAgIChbQnVsa1N0cmluZywgQnVsa1N0cmluZ10gfCBCdWxrTmlsIHwgW10pW11cbiAgICA+O1xuICB9XG5cbiAgZ2VvZGlzdChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBtZW1iZXIxOiBzdHJpbmcsXG4gICAgbWVtYmVyMjogc3RyaW5nLFxuICAgIHVuaXQ/OiBHZW9Vbml0LFxuICApIHtcbiAgICBpZiAodW5pdCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkdFT0RJU1RcIiwga2V5LCBtZW1iZXIxLCBtZW1iZXIyLCB1bml0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkdFT0RJU1RcIiwga2V5LCBtZW1iZXIxLCBtZW1iZXIyKTtcbiAgfVxuXG4gIGdlb3JhZGl1cyhcbiAgICBrZXk6IHN0cmluZyxcbiAgICBsb25naXR1ZGU6IG51bWJlcixcbiAgICBsYXRpdHVkZTogbnVtYmVyLFxuICAgIHJhZGl1czogbnVtYmVyLFxuICAgIHVuaXQ6IFwibVwiIHwgXCJrbVwiIHwgXCJmdFwiIHwgXCJtaVwiLFxuICAgIG9wdHM/OiBHZW9SYWRpdXNPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoR2VvUmFkaXVzT3B0cyhcbiAgICAgIFtrZXksIGxvbmdpdHVkZSwgbGF0aXR1ZGUsIHJhZGl1cywgdW5pdF0sXG4gICAgICBvcHRzLFxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJHRU9SQURJVVNcIiwgLi4uYXJncyk7XG4gIH1cblxuICBnZW9yYWRpdXNieW1lbWJlcihcbiAgICBrZXk6IHN0cmluZyxcbiAgICBtZW1iZXI6IHN0cmluZyxcbiAgICByYWRpdXM6IG51bWJlcixcbiAgICB1bml0OiBHZW9Vbml0LFxuICAgIG9wdHM/OiBHZW9SYWRpdXNPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoR2VvUmFkaXVzT3B0cyhba2V5LCBtZW1iZXIsIHJhZGl1cywgdW5pdF0sIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5KFwiR0VPUkFESVVTQllNRU1CRVJcIiwgLi4uYXJncyk7XG4gIH1cblxuICBwcml2YXRlIHB1c2hHZW9SYWRpdXNPcHRzKFxuICAgIGFyZ3M6IChzdHJpbmcgfCBudW1iZXIpW10sXG4gICAgb3B0cz86IEdlb1JhZGl1c09wdHMsXG4gICkge1xuICAgIGlmIChvcHRzPy53aXRoQ29vcmQpIHtcbiAgICAgIGFyZ3MucHVzaChcIldJVEhDT09SRFwiKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LndpdGhEaXN0KSB7XG4gICAgICBhcmdzLnB1c2goXCJXSVRIRElTVFwiKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LndpdGhIYXNoKSB7XG4gICAgICBhcmdzLnB1c2goXCJXSVRISEFTSFwiKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LmNvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChvcHRzLmNvdW50KTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LnNvcnQpIHtcbiAgICAgIGFyZ3MucHVzaChvcHRzLnNvcnQpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uc3RvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJncy5wdXNoKG9wdHMuc3RvcmUpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uc3RvcmVEaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChvcHRzLnN0b3JlRGlzdCk7XG4gICAgfVxuICAgIHJldHVybiBhcmdzO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkdFVFwiLCBrZXkpO1xuICB9XG5cbiAgZ2V0Yml0KGtleTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJHRVRCSVRcIiwga2V5LCBvZmZzZXQpO1xuICB9XG5cbiAgZ2V0cmFuZ2Uoa2V5OiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcIkdFVFJBTkdFXCIsIGtleSwgc3RhcnQsIGVuZCk7XG4gIH1cblxuICBnZXRzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBSZWRpc1ZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkdFVFNFVFwiLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGhkZWwoa2V5OiBzdHJpbmcsIC4uLmZpZWxkczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiSERFTFwiLCBrZXksIC4uLmZpZWxkcyk7XG4gIH1cblxuICBoZXhpc3RzKGtleTogc3RyaW5nLCBmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkhFWElTVFNcIiwga2V5LCBmaWVsZCk7XG4gIH1cblxuICBoZ2V0KGtleTogc3RyaW5nLCBmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIkhHRVRcIiwga2V5LCBmaWVsZCk7XG4gIH1cblxuICBoZ2V0YWxsKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJIR0VUQUxMXCIsIGtleSk7XG4gIH1cblxuICBoaW5jcmJ5KGtleTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCBpbmNyZW1lbnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJISU5DUkJZXCIsIGtleSwgZmllbGQsIGluY3JlbWVudCk7XG4gIH1cblxuICBoaW5jcmJ5ZmxvYXQoa2V5OiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcsIGluY3JlbWVudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcbiAgICAgIFwiSElOQ1JCWUZMT0FUXCIsXG4gICAgICBrZXksXG4gICAgICBmaWVsZCxcbiAgICAgIGluY3JlbWVudCxcbiAgICApO1xuICB9XG5cbiAgaGtleXMoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkhLRVlTXCIsIGtleSk7XG4gIH1cblxuICBobGVuKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkhMRU5cIiwga2V5KTtcbiAgfVxuXG4gIGhtZ2V0KGtleTogc3RyaW5nLCAuLi5maWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsaz4oXCJITUdFVFwiLCBrZXksIC4uLmZpZWxkcyk7XG4gIH1cblxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBobXNldChrZXk6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIGNvbnN0IGFyZ3MgPSBba2V5XSBhcyBSZWRpc1ZhbHVlW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zWzBdKSkge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcy5mbGF0TWFwKChlKSA9PiBlKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zWzBdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmb3IgKGNvbnN0IFtmaWVsZCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBhcmFtc1swXSkpIHtcbiAgICAgICAgYXJncy5wdXNoKGZpZWxkLCB2YWx1ZSBhcyBSZWRpc1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkhNU0VUXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgaHNldChrZXk6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIGNvbnN0IGFyZ3MgPSBba2V5XSBhcyBSZWRpc1ZhbHVlW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zWzBdKSkge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcy5mbGF0TWFwKChlKSA9PiBlKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zWzBdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmb3IgKGNvbnN0IFtmaWVsZCwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBhcmFtc1swXSkpIHtcbiAgICAgICAgYXJncy5wdXNoKGZpZWxkLCB2YWx1ZSBhcyBSZWRpc1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJIU0VUXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgaHNldG54KGtleTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCB2YWx1ZTogUmVkaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJIU0VUTlhcIiwga2V5LCBmaWVsZCwgdmFsdWUpO1xuICB9XG5cbiAgaHN0cmxlbihrZXk6IHN0cmluZywgZmllbGQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJIU1RSTEVOXCIsIGtleSwgZmllbGQpO1xuICB9XG5cbiAgaHZhbHMoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIkhWQUxTXCIsIGtleSk7XG4gIH1cblxuICBpbmNyKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIklOQ1JcIiwga2V5KTtcbiAgfVxuXG4gIGluY3JieShrZXk6IHN0cmluZywgaW5jcmVtZW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiSU5DUkJZXCIsIGtleSwgaW5jcmVtZW50KTtcbiAgfVxuXG4gIGluY3JieWZsb2F0KGtleTogc3RyaW5nLCBpbmNyZW1lbnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHk8QnVsa1N0cmluZz4oXCJJTkNSQllGTE9BVFwiLCBrZXksIGluY3JlbWVudCk7XG4gIH1cblxuICBpbmZvKHNlY3Rpb24/OiBzdHJpbmcpIHtcbiAgICBpZiAoc2VjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJJTkZPXCIsIHNlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJJTkZPXCIpO1xuICB9XG5cbiAga2V5cyhwYXR0ZXJuOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIktFWVNcIiwgcGF0dGVybik7XG4gIH1cblxuICBsYXN0c2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiTEFTVFNBVkVcIik7XG4gIH1cblxuICBsaW5kZXgoa2V5OiBzdHJpbmcsIGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiTElOREVYXCIsIGtleSwgaW5kZXgpO1xuICB9XG5cbiAgbGluc2VydChrZXk6IHN0cmluZywgbG9jOiBMSW5zZXJ0TG9jYXRpb24sIHBpdm90OiBzdHJpbmcsIHZhbHVlOiBSZWRpc1ZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkxJTlNFUlRcIiwga2V5LCBsb2MsIHBpdm90LCB2YWx1ZSk7XG4gIH1cblxuICBsbGVuKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkxMRU5cIiwga2V5KTtcbiAgfVxuXG4gIGxwb3Aoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiTFBPUFwiLCBrZXkpO1xuICB9XG5cbiAgbHBvcyhcbiAgICBrZXk6IHN0cmluZyxcbiAgICBlbGVtZW50OiBSZWRpc1ZhbHVlLFxuICAgIG9wdHM/OiBMUG9zT3B0cyxcbiAgKTogUHJvbWlzZTxJbnRlZ2VyIHwgQnVsa05pbD47XG5cbiAgbHBvcyhcbiAgICBrZXk6IHN0cmluZyxcbiAgICBlbGVtZW50OiBSZWRpc1ZhbHVlLFxuICAgIG9wdHM6IExQb3NXaXRoQ291bnRPcHRzLFxuICApOiBQcm9taXNlPEludGVnZXJbXT47XG5cbiAgbHBvcyhcbiAgICBrZXk6IHN0cmluZyxcbiAgICBlbGVtZW50OiBSZWRpc1ZhbHVlLFxuICAgIG9wdHM/OiBMUG9zT3B0cyB8IExQb3NXaXRoQ291bnRPcHRzLFxuICApOiBQcm9taXNlPEludGVnZXIgfCBCdWxrTmlsIHwgSW50ZWdlcltdPiB7XG4gICAgY29uc3QgYXJncyA9IFtlbGVtZW50XTtcbiAgICBpZiAob3B0cz8ucmFuayAhPSBudWxsKSB7XG4gICAgICBhcmdzLnB1c2goXCJSQU5LXCIsIFN0cmluZyhvcHRzLnJhbmspKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cz8uY291bnQgIT0gbnVsbCkge1xuICAgICAgYXJncy5wdXNoKFwiQ09VTlRcIiwgU3RyaW5nKG9wdHMuY291bnQpKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cz8ubWF4bGVuICE9IG51bGwpIHtcbiAgICAgIGFyZ3MucHVzaChcIk1BWExFTlwiLCBTdHJpbmcob3B0cy5tYXhsZW4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0cz8uY291bnQgPT0gbnVsbFxuICAgICAgPyB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJMUE9TXCIsIGtleSwgLi4uYXJncylcbiAgICAgIDogdGhpcy5leGVjQXJyYXlSZXBseTxJbnRlZ2VyPihcIkxQT1NcIiwga2V5LCAuLi5hcmdzKTtcbiAgfVxuXG4gIGxwdXNoKGtleTogc3RyaW5nLCAuLi5lbGVtZW50czogUmVkaXNWYWx1ZVtdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkxQVVNIXCIsIGtleSwgLi4uZWxlbWVudHMpO1xuICB9XG5cbiAgbHB1c2h4KGtleTogc3RyaW5nLCAuLi5lbGVtZW50czogUmVkaXNWYWx1ZVtdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIkxQVVNIWFwiLCBrZXksIC4uLmVsZW1lbnRzKTtcbiAgfVxuXG4gIGxyYW5nZShrZXk6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgc3RvcDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJMUkFOR0VcIiwga2V5LCBzdGFydCwgc3RvcCk7XG4gIH1cblxuICBscmVtKGtleTogc3RyaW5nLCBjb3VudDogbnVtYmVyLCBlbGVtZW50OiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiTFJFTVwiLCBrZXksIGNvdW50LCBlbGVtZW50KTtcbiAgfVxuXG4gIGxzZXQoa2V5OiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGVsZW1lbnQ6IHN0cmluZyB8IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIkxTRVRcIiwga2V5LCBpbmRleCwgZWxlbWVudCk7XG4gIH1cblxuICBsdHJpbShrZXk6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgc3RvcDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiTFRSSU1cIiwga2V5LCBzdGFydCwgc3RvcCk7XG4gIH1cblxuICBtZW1vcnlEb2N0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcIk1FTU9SWVwiLCBcIkRPQ1RPUlwiKTtcbiAgfVxuXG4gIG1lbW9yeUhlbHAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJNRU1PUllcIiwgXCJIRUxQXCIpO1xuICB9XG5cbiAgbWVtb3J5TWFsbG9jU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcIk1FTU9SWVwiLCBcIk1BTExPQ1wiLCBcIlNUQVRTXCIpO1xuICB9XG5cbiAgbWVtb3J5UHVyZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiTUVNT1JZXCIsIFwiUFVSR0VcIik7XG4gIH1cblxuICBtZW1vcnlTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIk1FTU9SWVwiLCBcIlNUQVRTXCIpO1xuICB9XG5cbiAgbWVtb3J5VXNhZ2Uoa2V5OiBzdHJpbmcsIG9wdHM/OiBNZW1vcnlVc2FnZU9wdHMpIHtcbiAgICBjb25zdCBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdID0gW2tleV07XG4gICAgaWYgKG9wdHM/LnNhbXBsZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJncy5wdXNoKFwiU0FNUExFU1wiLCBvcHRzLnNhbXBsZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiTUVNT1JZXCIsIFwiVVNBR0VcIiwgLi4uYXJncyk7XG4gIH1cblxuICBtZ2V0KC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsaz4oXCJNR0VUXCIsIC4uLmtleXMpO1xuICB9XG5cbiAgbWlncmF0ZShcbiAgICBob3N0OiBzdHJpbmcsXG4gICAgcG9ydDogbnVtYmVyLFxuICAgIGtleTogc3RyaW5nLFxuICAgIGRlc3RpbmF0aW9uREI6IHN0cmluZyxcbiAgICB0aW1lb3V0OiBudW1iZXIsXG4gICAgb3B0cz86IE1pZ3JhdGVPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gW2hvc3QsIHBvcnQsIGtleSwgZGVzdGluYXRpb25EQiwgdGltZW91dF07XG4gICAgaWYgKG9wdHM/LmNvcHkpIHtcbiAgICAgIGFyZ3MucHVzaChcIkNPUFlcIik7XG4gICAgfVxuICAgIGlmIChvcHRzPy5yZXBsYWNlKSB7XG4gICAgICBhcmdzLnB1c2goXCJSRVBMQUNFXCIpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uYXV0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJBVVRIXCIsIG9wdHMuYXV0aCk7XG4gICAgfVxuICAgIGlmIChvcHRzPy5rZXlzKSB7XG4gICAgICBhcmdzLnB1c2goXCJLRVlTXCIsIC4uLm9wdHMua2V5cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIk1JR1JBVEVcIiwgLi4uYXJncyk7XG4gIH1cblxuICBtb2R1bGVMaXN0KCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiTU9EVUxFXCIsIFwiTElTVFwiKTtcbiAgfVxuXG4gIG1vZHVsZUxvYWQocGF0aDogc3RyaW5nLCAuLi5hcmdzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIk1PRFVMRVwiLCBcIkxPQURcIiwgcGF0aCwgLi4uYXJncyk7XG4gIH1cblxuICBtb2R1bGVVbmxvYWQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiTU9EVUxFXCIsIFwiVU5MT0FEXCIsIG5hbWUpO1xuICB9XG5cbiAgbW9uaXRvcigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgfVxuXG4gIG1vdmUoa2V5OiBzdHJpbmcsIGRiOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiTU9WRVwiLCBrZXksIGRiKTtcbiAgfVxuXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIG1zZXQoLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIGNvbnN0IGFyZ3M6IFJlZGlzVmFsdWVbXSA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtc1swXSkpIHtcbiAgICAgIGFyZ3MucHVzaCguLi5wYXJhbXMuZmxhdE1hcCgoZSkgPT4gZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtc1swXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zWzBdKSkge1xuICAgICAgICBhcmdzLnB1c2goa2V5LCB2YWx1ZSBhcyBSZWRpc1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIk1TRVRcIiwgLi4uYXJncyk7XG4gIH1cblxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBtc2V0bngoLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIGNvbnN0IGFyZ3M6IFJlZGlzVmFsdWVbXSA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtc1swXSkpIHtcbiAgICAgIGFyZ3MucHVzaCguLi5wYXJhbXMuZmxhdE1hcCgoZSkgPT4gZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtc1swXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zWzBdKSkge1xuICAgICAgICBhcmdzLnB1c2goa2V5LCB2YWx1ZSBhcyBSZWRpc1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKC4uLnBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJNU0VUTlhcIiwgLi4uYXJncyk7XG4gIH1cblxuICBtdWx0aSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJNVUxUSVwiKTtcbiAgfVxuXG4gIG9iamVjdEVuY29kaW5nKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIk9CSkVDVFwiLCBcIkVOQ09ESU5HXCIsIGtleSk7XG4gIH1cblxuICBvYmplY3RGcmVxKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJPck5pbFJlcGx5KFwiT0JKRUNUXCIsIFwiRlJFUVwiLCBrZXkpO1xuICB9XG5cbiAgb2JqZWN0SGVscCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIk9CSkVDVFwiLCBcIkhFTFBcIik7XG4gIH1cblxuICBvYmplY3RJZGxldGltZShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyT3JOaWxSZXBseShcIk9CSkVDVFwiLCBcIklETEVUSU1FXCIsIGtleSk7XG4gIH1cblxuICBvYmplY3RSZWZDb3VudChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyT3JOaWxSZXBseShcIk9CSkVDVFwiLCBcIlJFRkNPVU5UXCIsIGtleSk7XG4gIH1cblxuICBwZXJzaXN0KGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlBFUlNJU1RcIiwga2V5KTtcbiAgfVxuXG4gIHBleHBpcmUoa2V5OiBzdHJpbmcsIG1pbGxpc2Vjb25kczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlBFWFBJUkVcIiwga2V5LCBtaWxsaXNlY29uZHMpO1xuICB9XG5cbiAgcGV4cGlyZWF0KGtleTogc3RyaW5nLCBtaWxsaXNlY29uZHNUaW1lc3RhbXA6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJQRVhQSVJFQVRcIiwga2V5LCBtaWxsaXNlY29uZHNUaW1lc3RhbXApO1xuICB9XG5cbiAgcGZhZGQoa2V5OiBzdHJpbmcsIC4uLmVsZW1lbnRzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJQRkFERFwiLCBrZXksIC4uLmVsZW1lbnRzKTtcbiAgfVxuXG4gIHBmY291bnQoLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUEZDT1VOVFwiLCAuLi5rZXlzKTtcbiAgfVxuXG4gIHBmbWVyZ2UoZGVzdGtleTogc3RyaW5nLCAuLi5zb3VyY2VrZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlBGTUVSR0VcIiwgZGVzdGtleSwgLi4uc291cmNla2V5cyk7XG4gIH1cblxuICBwaW5nKG1lc3NhZ2U/OiBSZWRpc1ZhbHVlKSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHk8QnVsa1N0cmluZz4oXCJQSU5HXCIsIG1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJQSU5HXCIpO1xuICB9XG5cbiAgcHNldGV4KGtleTogc3RyaW5nLCBtaWxsaXNlY29uZHM6IG51bWJlciwgdmFsdWU6IFJlZGlzVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJQU0VURVhcIiwga2V5LCBtaWxsaXNlY29uZHMsIHZhbHVlKTtcbiAgfVxuXG4gIHB1Ymxpc2goY2hhbm5lbDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUFVCTElTSFwiLCBjaGFubmVsLCBtZXNzYWdlKTtcbiAgfVxuXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICNzdWJzY3JpcHRpb24/OiBSZWRpc1N1YnNjcmlwdGlvbjxhbnk+O1xuICBhc3luYyBzdWJzY3JpYmU8VE1lc3NhZ2UgZXh0ZW5kcyBzdHJpbmcgfCBzdHJpbmdbXSA9IHN0cmluZz4oXG4gICAgLi4uY2hhbm5lbHM6IHN0cmluZ1tdXG4gICkge1xuICAgIGlmICh0aGlzLiNzdWJzY3JpcHRpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuI3N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoLi4uY2hhbm5lbHMpO1xuICAgICAgcmV0dXJuIHRoaXMuI3N1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gYXdhaXQgc3Vic2NyaWJlPFRNZXNzYWdlPih0aGlzLmV4ZWN1dG9yLCAuLi5jaGFubmVscyk7XG4gICAgdGhpcy4jc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBhc3luYyBwc3Vic2NyaWJlPFRNZXNzYWdlIGV4dGVuZHMgc3RyaW5nIHwgc3RyaW5nW10gPSBzdHJpbmc+KFxuICAgIC4uLnBhdHRlcm5zOiBzdHJpbmdbXVxuICApIHtcbiAgICBpZiAodGhpcy4jc3Vic2NyaXB0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLiNzdWJzY3JpcHRpb24ucHN1YnNjcmliZSguLi5wYXR0ZXJucyk7XG4gICAgICByZXR1cm4gdGhpcy4jc3Vic2NyaXB0aW9uO1xuICAgIH1cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBhd2FpdCBwc3Vic2NyaWJlPFRNZXNzYWdlPih0aGlzLmV4ZWN1dG9yLCAuLi5wYXR0ZXJucyk7XG4gICAgdGhpcy4jc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBwdWJzdWJDaGFubmVscyhwYXR0ZXJuPzogc3RyaW5nKSB7XG4gICAgaWYgKHBhdHRlcm4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJQVUJTVUJcIiwgXCJDSEFOTkVMU1wiLCBwYXR0ZXJuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJQVUJTVUJcIiwgXCJDSEFOTkVMU1wiKTtcbiAgfVxuXG4gIHB1YnN1Yk51bXBhdCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUFVCU1VCXCIsIFwiTlVNUEFUXCIpO1xuICB9XG5cbiAgcHVic3ViTnVtc3ViKC4uLmNoYW5uZWxzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmcgfCBJbnRlZ2VyPihcbiAgICAgIFwiUFVCU1VCXCIsXG4gICAgICBcIk5VTVNVQlwiLFxuICAgICAgLi4uY2hhbm5lbHMsXG4gICAgKTtcbiAgfVxuXG4gIHB0dGwoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUFRUTFwiLCBrZXkpO1xuICB9XG5cbiAgcXVpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJRVUlUXCIpLmZpbmFsbHkoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgfVxuXG4gIHJhbmRvbWtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiUkFORE9NS0VZXCIpO1xuICB9XG5cbiAgcmVhZG9ubHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiUkVBRE9OTFlcIik7XG4gIH1cblxuICByZWFkd3JpdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiUkVBRFdSSVRFXCIpO1xuICB9XG5cbiAgcmVuYW1lKGtleTogc3RyaW5nLCBuZXdrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlJFTkFNRVwiLCBrZXksIG5ld2tleSk7XG4gIH1cblxuICByZW5hbWVueChrZXk6IHN0cmluZywgbmV3a2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUkVOQU1FTlhcIiwga2V5LCBuZXdrZXkpO1xuICB9XG5cbiAgcmVzdG9yZShcbiAgICBrZXk6IHN0cmluZyxcbiAgICB0dGw6IG51bWJlcixcbiAgICBzZXJpYWxpemVkVmFsdWU6IEJpbmFyeSxcbiAgICBvcHRzPzogUmVzdG9yZU9wdHMsXG4gICkge1xuICAgIGNvbnN0IGFyZ3MgPSBba2V5LCB0dGwsIHNlcmlhbGl6ZWRWYWx1ZV07XG4gICAgaWYgKG9wdHM/LnJlcGxhY2UpIHtcbiAgICAgIGFyZ3MucHVzaChcIlJFUExBQ0VcIik7XG4gICAgfVxuICAgIGlmIChvcHRzPy5hYnN0dGwpIHtcbiAgICAgIGFyZ3MucHVzaChcIkFCU1RUTFwiKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LmlkbGV0aW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChcIklETEVUSU1FXCIsIG9wdHMuaWRsZXRpbWUpO1xuICAgIH1cbiAgICBpZiAob3B0cz8uZnJlcSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJGUkVRXCIsIG9wdHMuZnJlcSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlJFU1RPUkVcIiwgLi4uYXJncyk7XG4gIH1cblxuICByb2xlKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5KFwiUk9MRVwiKSBhcyBQcm9taXNlPFxuICAgICAgfCBbXCJtYXN0ZXJcIiwgSW50ZWdlciwgQnVsa1N0cmluZ1tdW11dXG4gICAgICB8IFtcInNsYXZlXCIsIEJ1bGtTdHJpbmcsIEludGVnZXIsIEJ1bGtTdHJpbmcsIEludGVnZXJdXG4gICAgICB8IFtcInNlbnRpbmVsXCIsIEJ1bGtTdHJpbmdbXV1cbiAgICA+O1xuICB9XG5cbiAgcnBvcChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHkoXCJSUE9QXCIsIGtleSk7XG4gIH1cblxuICBycG9wbHB1c2goc291cmNlOiBzdHJpbmcsIGRlc3RpbmF0aW9uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiUlBPUExQVVNIXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcnB1c2goa2V5OiBzdHJpbmcsIC4uLmVsZW1lbnRzOiBSZWRpc1ZhbHVlW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUlBVU0hcIiwga2V5LCAuLi5lbGVtZW50cyk7XG4gIH1cblxuICBycHVzaHgoa2V5OiBzdHJpbmcsIC4uLmVsZW1lbnRzOiBSZWRpc1ZhbHVlW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiUlBVU0hYXCIsIGtleSwgLi4uZWxlbWVudHMpO1xuICB9XG5cbiAgc2FkZChrZXk6IHN0cmluZywgLi4ubWVtYmVyczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU0FERFwiLCBrZXksIC4uLm1lbWJlcnMpO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJTQVZFXCIpO1xuICB9XG5cbiAgc2NhcmQoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU0NBUkRcIiwga2V5KTtcbiAgfVxuXG4gIHNjcmlwdERlYnVnKG1vZGU6IFNjcmlwdERlYnVnTW9kZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNDUklQVFwiLCBcIkRFQlVHXCIsIG1vZGUpO1xuICB9XG5cbiAgc2NyaXB0RXhpc3RzKC4uLnNoYTFzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEludGVnZXI+KFwiU0NSSVBUXCIsIFwiRVhJU1RTXCIsIC4uLnNoYTFzKTtcbiAgfVxuXG4gIHNjcmlwdEZsdXNoKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNDUklQVFwiLCBcIkZMVVNIXCIpO1xuICB9XG5cbiAgc2NyaXB0S2lsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJTQ1JJUFRcIiwgXCJLSUxMXCIpO1xuICB9XG5cbiAgc2NyaXB0TG9hZChzY3JpcHQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNDUklQVFwiLCBcIkxPQURcIiwgc2NyaXB0KTtcbiAgfVxuXG4gIHNkaWZmKC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJTRElGRlwiLCAuLi5rZXlzKTtcbiAgfVxuXG4gIHNkaWZmc3RvcmUoZGVzdGluYXRpb246IHN0cmluZywgLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU0RJRkZTVE9SRVwiLCBkZXN0aW5hdGlvbiwgLi4ua2V5cyk7XG4gIH1cblxuICBzZWxlY3QoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNFTEVDVFwiLCBpbmRleCk7XG4gIH1cblxuICBzZXQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgdmFsdWU6IFJlZGlzVmFsdWUsXG4gICAgb3B0cz86IFNldE9wdHMsXG4gICk6IFByb21pc2U8U2ltcGxlU3RyaW5nPjtcbiAgc2V0KFxuICAgIGtleTogc3RyaW5nLFxuICAgIHZhbHVlOiBSZWRpc1ZhbHVlLFxuICAgIG9wdHM/OiBTZXRXaXRoTW9kZU9wdHMsXG4gICk6IFByb21pc2U8U2ltcGxlU3RyaW5nIHwgQnVsa05pbD47XG4gIHNldChcbiAgICBrZXk6IHN0cmluZyxcbiAgICB2YWx1ZTogUmVkaXNWYWx1ZSxcbiAgICBvcHRzPzogU2V0T3B0cyB8IFNldFdpdGhNb2RlT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJnczogUmVkaXNWYWx1ZVtdID0gW2tleSwgdmFsdWVdO1xuICAgIGlmIChvcHRzPy5leCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJFWFwiLCBvcHRzLmV4KTtcbiAgICB9IGVsc2UgaWYgKG9wdHM/LnB4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChcIlBYXCIsIG9wdHMucHgpO1xuICAgIH1cbiAgICBpZiAob3B0cz8ua2VlcHR0bCkge1xuICAgICAgYXJncy5wdXNoKFwiS0VFUFRUTFwiKTtcbiAgICB9XG4gICAgaWYgKChvcHRzIGFzIFNldFdpdGhNb2RlT3B0cyk/Lm1vZGUpIHtcbiAgICAgIGFyZ3MucHVzaCgob3B0cyBhcyBTZXRXaXRoTW9kZU9wdHMpLm1vZGUpO1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c09yTmlsUmVwbHkoXCJTRVRcIiwgLi4uYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNFVFwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHNldGJpdChrZXk6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBSZWRpc1ZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlNFVEJJVFwiLCBrZXksIG9mZnNldCwgdmFsdWUpO1xuICB9XG5cbiAgc2V0ZXgoa2V5OiBzdHJpbmcsIHNlY29uZHM6IG51bWJlciwgdmFsdWU6IFJlZGlzVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJTRVRFWFwiLCBrZXksIHNlY29uZHMsIHZhbHVlKTtcbiAgfVxuXG4gIHNldG54KGtleTogc3RyaW5nLCB2YWx1ZTogUmVkaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJTRVROWFwiLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHNldHJhbmdlKGtleTogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgdmFsdWU6IFJlZGlzVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU0VUUkFOR0VcIiwga2V5LCBvZmZzZXQsIHZhbHVlKTtcbiAgfVxuXG4gIHNodXRkb3duKG1vZGU/OiBTaHV0ZG93bk1vZGUpIHtcbiAgICBpZiAobW9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiU0hVVERPV05cIiwgbW9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcIlNIVVRET1dOXCIpO1xuICB9XG5cbiAgc2ludGVyKC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJTSU5URVJcIiwgLi4ua2V5cyk7XG4gIH1cblxuICBzaW50ZXJzdG9yZShkZXN0aW5hdGlvbjogc3RyaW5nLCAuLi5rZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJTSU5URVJTVE9SRVwiLCBkZXN0aW5hdGlvbiwgLi4ua2V5cyk7XG4gIH1cblxuICBzaXNtZW1iZXIoa2V5OiBzdHJpbmcsIG1lbWJlcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlNJU01FTUJFUlwiLCBrZXksIG1lbWJlcik7XG4gIH1cblxuICBzbGF2ZW9mKGhvc3Q6IHN0cmluZywgcG9ydDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiU0xBVkVPRlwiLCBob3N0LCBwb3J0KTtcbiAgfVxuXG4gIHNsYXZlb2ZOb09uZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJTTEFWRU9GXCIsIFwiTk8gT05FXCIpO1xuICB9XG5cbiAgcmVwbGljYW9mKGhvc3Q6IHN0cmluZywgcG9ydDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiUkVQTElDQU9GXCIsIGhvc3QsIHBvcnQpO1xuICB9XG5cbiAgcmVwbGljYW9mTm9PbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiUkVQTElDQU9GXCIsIFwiTk8gT05FXCIpO1xuICB9XG5cbiAgc2xvd2xvZyhzdWJjb21tYW5kOiBzdHJpbmcsIC4uLmFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJTTE9XTE9HXCIsIHN1YmNvbW1hbmQsIC4uLmFyZ3MpO1xuICB9XG5cbiAgc21lbWJlcnMoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlNNRU1CRVJTXCIsIGtleSk7XG4gIH1cblxuICBzbW92ZShzb3VyY2U6IHN0cmluZywgZGVzdGluYXRpb246IHN0cmluZywgbWVtYmVyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU01PVkVcIiwgc291cmNlLCBkZXN0aW5hdGlvbiwgbWVtYmVyKTtcbiAgfVxuXG4gIHNvcnQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgb3B0cz86IFNvcnRPcHRzLFxuICApOiBQcm9taXNlPEJ1bGtTdHJpbmdbXT47XG4gIHNvcnQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgb3B0cz86IFNvcnRXaXRoRGVzdGluYXRpb25PcHRzLFxuICApOiBQcm9taXNlPEludGVnZXI+O1xuICBzb3J0KFxuICAgIGtleTogc3RyaW5nLFxuICAgIG9wdHM/OiBTb3J0T3B0cyB8IFNvcnRXaXRoRGVzdGluYXRpb25PcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdID0gW2tleV07XG4gICAgaWYgKG9wdHM/LmJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChcIkJZXCIsIG9wdHMuYnkpO1xuICAgIH1cbiAgICBpZiAob3B0cz8ubGltaXQpIHtcbiAgICAgIGFyZ3MucHVzaChcIkxJTUlUXCIsIG9wdHMubGltaXQub2Zmc2V0LCBvcHRzLmxpbWl0LmNvdW50KTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LnBhdHRlcm5zKSB7XG4gICAgICBhcmdzLnB1c2goLi4ub3B0cy5wYXR0ZXJucy5mbGF0TWFwKChwYXR0ZXJuKSA9PiBbXCJHRVRcIiwgcGF0dGVybl0pKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/Lm9yZGVyKSB7XG4gICAgICBhcmdzLnB1c2gob3B0cy5vcmRlcik7XG4gICAgfVxuICAgIGlmIChvcHRzPy5hbHBoYSkge1xuICAgICAgYXJncy5wdXNoKFwiQUxQSEFcIik7XG4gICAgfVxuICAgIGlmICgob3B0cyBhcyBTb3J0V2l0aERlc3RpbmF0aW9uT3B0cyk/LmRlc3RpbmF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChcIlNUT1JFXCIsIChvcHRzIGFzIFNvcnRXaXRoRGVzdGluYXRpb25PcHRzKS5kZXN0aW5hdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiU09SVFwiLCAuLi5hcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJTT1JUXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgc3BvcChrZXk6IHN0cmluZyk6IFByb21pc2U8QnVsaz47XG4gIHNwb3Aoa2V5OiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBQcm9taXNlPEJ1bGtTdHJpbmdbXT47XG4gIHNwb3Aoa2V5OiBzdHJpbmcsIGNvdW50PzogbnVtYmVyKSB7XG4gICAgaWYgKGNvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiU1BPUFwiLCBrZXksIGNvdW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIlNQT1BcIiwga2V5KTtcbiAgfVxuXG4gIHNyYW5kbWVtYmVyKGtleTogc3RyaW5nKTogUHJvbWlzZTxCdWxrPjtcbiAgc3JhbmRtZW1iZXIoa2V5OiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBQcm9taXNlPEJ1bGtTdHJpbmdbXT47XG4gIHNyYW5kbWVtYmVyKGtleTogc3RyaW5nLCBjb3VudD86IG51bWJlcikge1xuICAgIGlmIChjb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlNSQU5ETUVNQkVSXCIsIGtleSwgY291bnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiU1JBTkRNRU1CRVJcIiwga2V5KTtcbiAgfVxuXG4gIHNyZW0oa2V5OiBzdHJpbmcsIC4uLm1lbWJlcnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlNSRU1cIiwga2V5LCAuLi5tZW1iZXJzKTtcbiAgfVxuXG4gIHN0cmFsZ28oXG4gICAgYWxnb3JpdGhtOiBTdHJhbGdvQWxnb3JpdGhtLFxuICAgIHRhcmdldDogU3RyYWxnb1RhcmdldCxcbiAgICBhOiBzdHJpbmcsXG4gICAgYjogc3RyaW5nLFxuICApOiBQcm9taXNlPEJ1bGs+O1xuXG4gIHN0cmFsZ28oXG4gICAgYWxnb3JpdGhtOiBTdHJhbGdvQWxnb3JpdGhtLFxuICAgIHRhcmdldDogU3RyYWxnb1RhcmdldCxcbiAgICBhOiBzdHJpbmcsXG4gICAgYjogc3RyaW5nLFxuICAgIG9wdHM/OiB7IGxlbjogdHJ1ZSB9LFxuICApOiBQcm9taXNlPEludGVnZXI+O1xuXG4gIHN0cmFsZ28oXG4gICAgYWxnb3JpdGhtOiBTdHJhbGdvQWxnb3JpdGhtLFxuICAgIHRhcmdldDogU3RyYWxnb1RhcmdldCxcbiAgICBhOiBzdHJpbmcsXG4gICAgYjogc3RyaW5nLFxuICAgIG9wdHM/OiB7IGlkeDogdHJ1ZSB9LFxuICApOiBQcm9taXNlPFxuICAgIFtcbiAgICAgIHN0cmluZywgLy9gXCJtYXRjaGVzXCJgXG4gICAgICBBcnJheTxbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV0+LFxuICAgICAgc3RyaW5nLCAvLyBgXCJsZW5cImBcbiAgICAgIEludGVnZXIsXG4gICAgXVxuICA+O1xuXG4gIHN0cmFsZ28oXG4gICAgYWxnb3JpdGhtOiBTdHJhbGdvQWxnb3JpdGhtLFxuICAgIHRhcmdldDogU3RyYWxnb1RhcmdldCxcbiAgICBhOiBzdHJpbmcsXG4gICAgYjogc3RyaW5nLFxuICAgIG9wdHM/OiB7IGlkeDogdHJ1ZTsgd2l0aG1hdGNobGVuOiB0cnVlIH0sXG4gICk6IFByb21pc2U8XG4gICAgW1xuICAgICAgc3RyaW5nLCAvLyBgXCJtYXRjaGVzXCJgXG4gICAgICBBcnJheTxbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXSwgbnVtYmVyXT4sXG4gICAgICBzdHJpbmcsIC8vIGBcImxlblwiYFxuICAgICAgSW50ZWdlcixcbiAgICBdXG4gID47XG5cbiAgc3RyYWxnbyhcbiAgICBhbGdvcml0aG06IFN0cmFsZ29BbGdvcml0aG0sXG4gICAgdGFyZ2V0OiBTdHJhbGdvVGFyZ2V0LFxuICAgIGE6IHN0cmluZyxcbiAgICBiOiBzdHJpbmcsXG4gICAgb3B0cz86IFN0cmFsZ29PcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzOiAobnVtYmVyIHwgc3RyaW5nKVtdID0gW107XG4gICAgaWYgKG9wdHM/LmlkeCkge1xuICAgICAgYXJncy5wdXNoKFwiSURYXCIpO1xuICAgIH1cbiAgICBpZiAob3B0cz8ubGVuKSB7XG4gICAgICBhcmdzLnB1c2goXCJMRU5cIik7XG4gICAgfVxuICAgIGlmIChvcHRzPy53aXRobWF0Y2hsZW4pIHtcbiAgICAgIGFyZ3MucHVzaChcIldJVEhNQVRDSExFTlwiKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/Lm1pbm1hdGNobGVuKSB7XG4gICAgICBhcmdzLnB1c2goXCJNSU5NQVRDSExFTlwiKTtcbiAgICAgIGFyZ3MucHVzaChvcHRzLm1pbm1hdGNobGVuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY1JlcGx5PEJ1bGsgfCBJbnRlZ2VyIHwgQ29uZGl0aW9uYWxBcnJheT4oXG4gICAgICBcIlNUUkFMR09cIixcbiAgICAgIGFsZ29yaXRobSxcbiAgICAgIHRhcmdldCxcbiAgICAgIGEsXG4gICAgICBiLFxuICAgICAgLi4uYXJncyxcbiAgICApO1xuICB9XG5cbiAgc3RybGVuKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlNUUkxFTlwiLCBrZXkpO1xuICB9XG5cbiAgc3VuaW9uKC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJTVU5JT05cIiwgLi4ua2V5cyk7XG4gIH1cblxuICBzdW5pb25zdG9yZShkZXN0aW5hdGlvbjogc3RyaW5nLCAuLi5rZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJTVU5JT05TVE9SRVwiLCBkZXN0aW5hdGlvbiwgLi4ua2V5cyk7XG4gIH1cblxuICBzd2FwZGIoaW5kZXgxOiBudW1iZXIsIGluZGV4MjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiU1dBUERCXCIsIGluZGV4MSwgaW5kZXgyKTtcbiAgfVxuXG4gIHN5bmMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIlRJTUVcIikgYXMgUHJvbWlzZTxbQnVsa1N0cmluZywgQnVsa1N0cmluZ10+O1xuICB9XG5cbiAgdG91Y2goLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiVE9VQ0hcIiwgLi4ua2V5cyk7XG4gIH1cblxuICB0dGwoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiVFRMXCIsIGtleSk7XG4gIH1cblxuICB0eXBlKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiVFlQRVwiLCBrZXkpO1xuICB9XG5cbiAgdW5saW5rKC4uLmtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlVOTElOS1wiLCAuLi5rZXlzKTtcbiAgfVxuXG4gIHVud2F0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFwiVU5XQVRDSFwiKTtcbiAgfVxuXG4gIHdhaXQobnVtcmVwbGljYXM6IG51bWJlciwgdGltZW91dDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIldBSVRcIiwgbnVtcmVwbGljYXMsIHRpbWVvdXQpO1xuICB9XG5cbiAgd2F0Y2goLi4ua2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjU3RhdHVzUmVwbHkoXCJXQVRDSFwiLCAuLi5rZXlzKTtcbiAgfVxuXG4gIHhhY2soa2V5OiBzdHJpbmcsIGdyb3VwOiBzdHJpbmcsIC4uLnhpZHM6IFhJZElucHV0W10pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFxuICAgICAgXCJYQUNLXCIsXG4gICAgICBrZXksXG4gICAgICBncm91cCxcbiAgICAgIC4uLnhpZHMubWFwKCh4aWQpID0+IHhpZHN0cih4aWQpKSxcbiAgICApO1xuICB9XG5cbiAgeGFkZChcbiAgICBrZXk6IHN0cmluZyxcbiAgICB4aWQ6IFhJZEFkZCxcbiAgICBmaWVsZFZhbHVlczogWEFkZEZpZWxkVmFsdWVzLFxuICAgIG1heGxlbjogWE1heGxlbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgKSB7XG4gICAgY29uc3QgYXJnczogUmVkaXNWYWx1ZVtdID0gW2tleV07XG5cbiAgICBpZiAobWF4bGVuKSB7XG4gICAgICBhcmdzLnB1c2goXCJNQVhMRU5cIik7XG4gICAgICBpZiAobWF4bGVuLmFwcHJveCkge1xuICAgICAgICBhcmdzLnB1c2goXCJ+XCIpO1xuICAgICAgfVxuICAgICAgYXJncy5wdXNoKG1heGxlbi5lbGVtZW50cy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goeGlkc3RyKHhpZCkpO1xuXG4gICAgaWYgKGZpZWxkVmFsdWVzIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtmLCB2XSBvZiBmaWVsZFZhbHVlcykge1xuICAgICAgICBhcmdzLnB1c2goZik7XG4gICAgICAgIGFyZ3MucHVzaCh2KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBbZiwgdl0gb2YgT2JqZWN0LmVudHJpZXMoZmllbGRWYWx1ZXMpKSB7XG4gICAgICAgIGFyZ3MucHVzaChmKTtcbiAgICAgICAgYXJncy5wdXNoKHYpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHk8QnVsa1N0cmluZz4oXG4gICAgICBcIlhBRERcIixcbiAgICAgIC4uLmFyZ3MsXG4gICAgKS50aGVuKChyYXdJZCkgPT4gcGFyc2VYSWQocmF3SWQpKTtcbiAgfVxuXG4gIHhjbGFpbShrZXk6IHN0cmluZywgb3B0czogWENsYWltT3B0cywgLi4ueGlkczogWElkSW5wdXRbXSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBpZiAob3B0cy5pZGxlKSB7XG4gICAgICBhcmdzLnB1c2goXCJJRExFXCIpO1xuICAgICAgYXJncy5wdXNoKG9wdHMuaWRsZSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMudGltZSkge1xuICAgICAgYXJncy5wdXNoKFwiVElNRVwiKTtcbiAgICAgIGFyZ3MucHVzaChvcHRzLnRpbWUpO1xuICAgIH1cblxuICAgIGlmIChvcHRzLnJldHJ5Q291bnQpIHtcbiAgICAgIGFyZ3MucHVzaChcIlJFVFJZQ09VTlRcIik7XG4gICAgICBhcmdzLnB1c2gob3B0cy5yZXRyeUNvdW50KTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5mb3JjZSkge1xuICAgICAgYXJncy5wdXNoKFwiRk9SQ0VcIik7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuanVzdFhJZCkge1xuICAgICAgYXJncy5wdXNoKFwiSlVTVElEXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PFhSZWFkSWREYXRhIHwgQnVsa1N0cmluZz4oXG4gICAgICBcIlhDTEFJTVwiLFxuICAgICAga2V5LFxuICAgICAgb3B0cy5ncm91cCxcbiAgICAgIG9wdHMuY29uc3VtZXIsXG4gICAgICBvcHRzLm1pbklkbGVUaW1lLFxuICAgICAgLi4ueGlkcy5tYXAoKHhpZCkgPT4geGlkc3RyKHhpZCkpLFxuICAgICAgLi4uYXJncyxcbiAgICApLnRoZW4oKHJhdykgPT4ge1xuICAgICAgaWYgKG9wdHMuanVzdFhJZCkge1xuICAgICAgICBjb25zdCB4aWRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgciBvZiByYXcpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHhpZHMucHVzaChwYXJzZVhJZChyKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBheWxvYWQ6IFhDbGFpbUp1c3RYSWQgPSB7IGtpbmQ6IFwianVzdHhpZFwiLCB4aWRzIH07XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCByIG9mIHJhdykge1xuICAgICAgICBpZiAodHlwZW9mIHIgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKHBhcnNlWE1lc3NhZ2UocikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBwYXlsb2FkOiBYQ2xhaW1NZXNzYWdlcyA9IHsga2luZDogXCJtZXNzYWdlc1wiLCBtZXNzYWdlcyB9O1xuICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfSk7XG4gIH1cblxuICB4ZGVsKGtleTogc3RyaW5nLCAuLi54aWRzOiBYSWRJbnB1dFtdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcbiAgICAgIFwiWERFTFwiLFxuICAgICAga2V5LFxuICAgICAgLi4ueGlkcy5tYXAoKHJhd0lkKSA9PiB4aWRzdHIocmF3SWQpKSxcbiAgICApO1xuICB9XG5cbiAgeGxlbihrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJYTEVOXCIsIGtleSk7XG4gIH1cblxuICB4Z3JvdXBDcmVhdGUoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgeGlkOiBYSWRJbnB1dCB8IFwiJFwiLFxuICAgIG1rc3RyZWFtPzogYm9vbGVhbixcbiAgKSB7XG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGlmIChta3N0cmVhbSkge1xuICAgICAgYXJncy5wdXNoKFwiTUtTVFJFQU1cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlY1N0YXR1c1JlcGx5KFxuICAgICAgXCJYR1JPVVBcIixcbiAgICAgIFwiQ1JFQVRFXCIsXG4gICAgICBrZXksXG4gICAgICBncm91cE5hbWUsXG4gICAgICB4aWRzdHIoeGlkKSxcbiAgICAgIC4uLmFyZ3MsXG4gICAgKTtcbiAgfVxuXG4gIHhncm91cERlbENvbnN1bWVyKFxuICAgIGtleTogc3RyaW5nLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGNvbnN1bWVyTmFtZTogc3RyaW5nLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFxuICAgICAgXCJYR1JPVVBcIixcbiAgICAgIFwiREVMQ09OU1VNRVJcIixcbiAgICAgIGtleSxcbiAgICAgIGdyb3VwTmFtZSxcbiAgICAgIGNvbnN1bWVyTmFtZSxcbiAgICApO1xuICB9XG5cbiAgeGdyb3VwRGVzdHJveShrZXk6IHN0cmluZywgZ3JvdXBOYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWEdST1VQXCIsIFwiREVTVFJPWVwiLCBrZXksIGdyb3VwTmFtZSk7XG4gIH1cblxuICB4Z3JvdXBIZWxwKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNCdWxrUmVwbHk8QnVsa1N0cmluZz4oXCJYR1JPVVBcIiwgXCJIRUxQXCIpO1xuICB9XG5cbiAgeGdyb3VwU2V0SUQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgeGlkOiBYSWQsXG4gICkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNTdGF0dXNSZXBseShcbiAgICAgIFwiWEdST1VQXCIsXG4gICAgICBcIlNFVElEXCIsXG4gICAgICBrZXksXG4gICAgICBncm91cE5hbWUsXG4gICAgICB4aWRzdHIoeGlkKSxcbiAgICApO1xuICB9XG5cbiAgeGluZm9TdHJlYW0oa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxSYXc+KFwiWElORk9cIiwgXCJTVFJFQU1cIiwga2V5KS50aGVuKFxuICAgICAgKHJhdykgPT4ge1xuICAgICAgICAvLyBOb3RlIHRoYXQgeW91IHNob3VsZCBub3QgcmVseSBvbiB0aGUgZmllbGRzXG4gICAgICAgIC8vIGV4YWN0IHBvc2l0aW9uLCBub3Igb24gdGhlIG51bWJlciBvZiBmaWVsZHMsXG4gICAgICAgIC8vIG5ldyBmaWVsZHMgbWF5IGJlIGFkZGVkIGluIHRoZSBmdXR1cmUuXG4gICAgICAgIGNvbnN0IGRhdGE6IE1hcDxzdHJpbmcsIFJhdz4gPSBjb252ZXJ0TWFwKHJhdyk7XG5cbiAgICAgICAgY29uc3QgZmlyc3RFbnRyeSA9IHBhcnNlWE1lc3NhZ2UoXG4gICAgICAgICAgZGF0YS5nZXQoXCJmaXJzdC1lbnRyeVwiKSBhcyBYUmVhZElkRGF0YSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbGFzdEVudHJ5ID0gcGFyc2VYTWVzc2FnZShcbiAgICAgICAgICBkYXRhLmdldChcImxhc3QtZW50cnlcIikgYXMgWFJlYWRJZERhdGEsXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsZW5ndGg6IHJhd251bShkYXRhLmdldChcImxlbmd0aFwiKSA/PyBudWxsKSxcbiAgICAgICAgICByYWRpeFRyZWVLZXlzOiByYXdudW0oZGF0YS5nZXQoXCJyYWRpeC10cmVlLWtleXNcIikgPz8gbnVsbCksXG4gICAgICAgICAgcmFkaXhUcmVlTm9kZXM6IHJhd251bShkYXRhLmdldChcInJhZGl4LXRyZWUtbm9kZXNcIikgPz8gbnVsbCksXG4gICAgICAgICAgZ3JvdXBzOiByYXdudW0oZGF0YS5nZXQoXCJncm91cHNcIikgPz8gbnVsbCksXG4gICAgICAgICAgbGFzdEdlbmVyYXRlZElkOiBwYXJzZVhJZChcbiAgICAgICAgICAgIHJhd3N0cihkYXRhLmdldChcImxhc3QtZ2VuZXJhdGVkLWlkXCIpID8/IG51bGwpLFxuICAgICAgICAgICksXG4gICAgICAgICAgZmlyc3RFbnRyeSxcbiAgICAgICAgICBsYXN0RW50cnksXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICB4aW5mb1N0cmVhbUZ1bGwoa2V5OiBzdHJpbmcsIGNvdW50PzogbnVtYmVyKSB7XG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGlmIChjb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJDT1VOVFwiKTtcbiAgICAgIGFyZ3MucHVzaChjb3VudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PFJhdz4oXCJYSU5GT1wiLCBcIlNUUkVBTVwiLCBrZXksIFwiRlVMTFwiLCAuLi5hcmdzKVxuICAgICAgLnRoZW4oXG4gICAgICAgIChyYXcpID0+IHtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgeW91IHNob3VsZCBub3QgcmVseSBvbiB0aGUgZmllbGRzXG4gICAgICAgICAgLy8gZXhhY3QgcG9zaXRpb24sIG5vciBvbiB0aGUgbnVtYmVyIG9mIGZpZWxkcyxcbiAgICAgICAgICAvLyBuZXcgZmllbGRzIG1heSBiZSBhZGRlZCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgIGlmIChyYXcgPT0gbnVsbCkgdGhyb3cgXCJubyBkYXRhXCI7XG5cbiAgICAgICAgICBjb25zdCBkYXRhOiBNYXA8c3RyaW5nLCBSYXc+ID0gY29udmVydE1hcChyYXcpO1xuICAgICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHRocm93IFwibm8gZGF0YSBjb252ZXJ0ZWRcIjtcblxuICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSAoZGF0YS5nZXQoXCJlbnRyaWVzXCIpIGFzIENvbmRpdGlvbmFsQXJyYXkpLm1hcCgoXG4gICAgICAgICAgICByYXc6IFJhdyxcbiAgICAgICAgICApID0+IHBhcnNlWE1lc3NhZ2UocmF3IGFzIFhSZWFkSWREYXRhKSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlbmd0aDogcmF3bnVtKGRhdGEuZ2V0KFwibGVuZ3RoXCIpID8/IG51bGwpLFxuICAgICAgICAgICAgcmFkaXhUcmVlS2V5czogcmF3bnVtKGRhdGEuZ2V0KFwicmFkaXgtdHJlZS1rZXlzXCIpID8/IG51bGwpLFxuICAgICAgICAgICAgcmFkaXhUcmVlTm9kZXM6IHJhd251bShkYXRhLmdldChcInJhZGl4LXRyZWUtbm9kZXNcIikgPz8gbnVsbCksXG4gICAgICAgICAgICBsYXN0R2VuZXJhdGVkSWQ6IHBhcnNlWElkKFxuICAgICAgICAgICAgICByYXdzdHIoZGF0YS5nZXQoXCJsYXN0LWdlbmVyYXRlZC1pZFwiKSA/PyBudWxsKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBlbnRyaWVzLFxuICAgICAgICAgICAgZ3JvdXBzOiBwYXJzZVhHcm91cERldGFpbChkYXRhLmdldChcImdyb3Vwc1wiKSBhcyBDb25kaXRpb25hbEFycmF5KSxcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgKTtcbiAgfVxuXG4gIHhpbmZvR3JvdXBzKGtleTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8Q29uZGl0aW9uYWxBcnJheT4oXCJYSU5GT1wiLCBcIkdST1VQU1wiLCBrZXkpLnRoZW4oXG4gICAgICAocmF3cykgPT5cbiAgICAgICAgcmF3cy5tYXAoKHJhdykgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBjb252ZXJ0TWFwKHJhdyk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHJhd3N0cihkYXRhLmdldChcIm5hbWVcIikgPz8gbnVsbCksXG4gICAgICAgICAgICBjb25zdW1lcnM6IHJhd251bShkYXRhLmdldChcImNvbnN1bWVyc1wiKSA/PyBudWxsKSxcbiAgICAgICAgICAgIHBlbmRpbmc6IHJhd251bShkYXRhLmdldChcInBlbmRpbmdcIikgPz8gbnVsbCksXG4gICAgICAgICAgICBsYXN0RGVsaXZlcmVkSWQ6IHBhcnNlWElkKFxuICAgICAgICAgICAgICByYXdzdHIoZGF0YS5nZXQoXCJsYXN0LWRlbGl2ZXJlZC1pZFwiKSA/PyBudWxsKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHhpbmZvQ29uc3VtZXJzKGtleTogc3RyaW5nLCBncm91cDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8Q29uZGl0aW9uYWxBcnJheT4oXG4gICAgICBcIlhJTkZPXCIsXG4gICAgICBcIkNPTlNVTUVSU1wiLFxuICAgICAga2V5LFxuICAgICAgZ3JvdXAsXG4gICAgKS50aGVuKFxuICAgICAgKHJhd3MpID0+XG4gICAgICAgIHJhd3MubWFwKChyYXcpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gY29udmVydE1hcChyYXcpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiByYXdzdHIoZGF0YS5nZXQoXCJuYW1lXCIpID8/IG51bGwpLFxuICAgICAgICAgICAgcGVuZGluZzogcmF3bnVtKGRhdGEuZ2V0KFwicGVuZGluZ1wiKSA/PyBudWxsKSxcbiAgICAgICAgICAgIGlkbGU6IHJhd251bShkYXRhLmdldChcImlkbGVcIikgPz8gbnVsbCksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHhwZW5kaW5nKFxuICAgIGtleTogc3RyaW5nLFxuICAgIGdyb3VwOiBzdHJpbmcsXG4gICkge1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PFJhdz4oXCJYUEVORElOR1wiLCBrZXksIGdyb3VwKVxuICAgICAgLnRoZW4oKHJhdykgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNOdW1iZXIocmF3WzBdKSAmJiBpc1N0cmluZyhyYXdbMV0pICYmXG4gICAgICAgICAgaXNTdHJpbmcocmF3WzJdKSAmJiBpc0NvbmRBcnJheShyYXdbM10pXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3VudDogcmF3WzBdLFxuICAgICAgICAgICAgc3RhcnRJZDogcGFyc2VYSWQocmF3WzFdKSxcbiAgICAgICAgICAgIGVuZElkOiBwYXJzZVhJZChyYXdbMl0pLFxuICAgICAgICAgICAgY29uc3VtZXJzOiBwYXJzZVhQZW5kaW5nQ29uc3VtZXJzKHJhd1szXSksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBcInBhcnNlIGVyclwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHhwZW5kaW5nQ291bnQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgZ3JvdXA6IHN0cmluZyxcbiAgICBzdGFydEVuZENvdW50OiBTdGFydEVuZENvdW50LFxuICAgIGNvbnN1bWVyPzogc3RyaW5nLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgYXJncy5wdXNoKHhpZHN0cihzdGFydEVuZENvdW50LnN0YXJ0KSk7XG4gICAgYXJncy5wdXNoKHhpZHN0cihzdGFydEVuZENvdW50LmVuZCkpO1xuICAgIGFyZ3MucHVzaChzdGFydEVuZENvdW50LmNvdW50KTtcblxuICAgIGlmIChjb25zdW1lcikge1xuICAgICAgYXJncy5wdXNoKGNvbnN1bWVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxSYXc+KFwiWFBFTkRJTkdcIiwga2V5LCBncm91cCwgLi4uYXJncylcbiAgICAgIC50aGVuKChyYXcpID0+IHBhcnNlWFBlbmRpbmdDb3VudHMocmF3KSk7XG4gIH1cblxuICB4cmFuZ2UoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgc3RhcnQ6IFhJZE5lZyxcbiAgICBlbmQ6IFhJZFBvcyxcbiAgICBjb3VudD86IG51bWJlcixcbiAgKSB7XG4gICAgY29uc3QgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtrZXksIHhpZHN0cihzdGFydCksIHhpZHN0cihlbmQpXTtcbiAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJncy5wdXNoKFwiQ09VTlRcIik7XG4gICAgICBhcmdzLnB1c2goY291bnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxYUmVhZElkRGF0YT4oXCJYUkFOR0VcIiwgLi4uYXJncykudGhlbihcbiAgICAgIChyYXcpID0+IHJhdy5tYXAoKG0pID0+IHBhcnNlWE1lc3NhZ2UobSkpLFxuICAgICk7XG4gIH1cblxuICB4cmV2cmFuZ2UoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgc3RhcnQ6IFhJZFBvcyxcbiAgICBlbmQ6IFhJZE5lZyxcbiAgICBjb3VudD86IG51bWJlcixcbiAgKSB7XG4gICAgY29uc3QgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtrZXksIHhpZHN0cihzdGFydCksIHhpZHN0cihlbmQpXTtcbiAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJncy5wdXNoKFwiQ09VTlRcIik7XG4gICAgICBhcmdzLnB1c2goY291bnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxYUmVhZElkRGF0YT4oXCJYUkVWUkFOR0VcIiwgLi4uYXJncykudGhlbihcbiAgICAgIChyYXcpID0+IHJhdy5tYXAoKG0pID0+IHBhcnNlWE1lc3NhZ2UobSkpLFxuICAgICk7XG4gIH1cblxuICB4cmVhZChcbiAgICBrZXlYSWRzOiAoWEtleUlkIHwgWEtleUlkTGlrZSlbXSxcbiAgICBvcHRzPzogWFJlYWRPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgIGlmIChvcHRzLmNvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXJncy5wdXNoKFwiQ09VTlRcIik7XG4gICAgICAgIGFyZ3MucHVzaChvcHRzLmNvdW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXJncy5wdXNoKFwiQkxPQ0tcIik7XG4gICAgICAgIGFyZ3MucHVzaChvcHRzLmJsb2NrKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXJncy5wdXNoKFwiU1RSRUFNU1wiKTtcblxuICAgIGNvbnN0IHRoZUtleXMgPSBbXTtcbiAgICBjb25zdCB0aGVYSWRzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGEgb2Yga2V5WElkcykge1xuICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAvLyBYS2V5SWRMaWtlXG4gICAgICAgIHRoZUtleXMucHVzaChhWzBdKTtcbiAgICAgICAgdGhlWElkcy5wdXNoKHhpZHN0cihhWzFdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBYS2V5SWRcbiAgICAgICAgdGhlS2V5cy5wdXNoKGEua2V5KTtcbiAgICAgICAgdGhlWElkcy5wdXNoKHhpZHN0cihhLnhpZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PFhSZWFkU3RyZWFtUmF3PihcbiAgICAgIFwiWFJFQURcIixcbiAgICAgIC4uLmFyZ3MuY29uY2F0KHRoZUtleXMpLmNvbmNhdCh0aGVYSWRzKSxcbiAgICApLnRoZW4oKHJhdykgPT4gcGFyc2VYUmVhZFJlcGx5KHJhdykpO1xuICB9XG5cbiAgeHJlYWRncm91cChcbiAgICBrZXlYSWRzOiAoWEtleUlkR3JvdXAgfCBYS2V5SWRHcm91cExpa2UpW10sXG4gICAgeyBncm91cCwgY29uc3VtZXIsIGNvdW50LCBibG9jayB9OiBYUmVhZEdyb3VwT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtcbiAgICAgIFwiR1JPVVBcIixcbiAgICAgIGdyb3VwLFxuICAgICAgY29uc3VtZXIsXG4gICAgXTtcblxuICAgIGlmIChjb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJDT1VOVFwiKTtcbiAgICAgIGFyZ3MucHVzaChjb3VudCk7XG4gICAgfVxuICAgIGlmIChibG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJCTE9DS1wiKTtcbiAgICAgIGFyZ3MucHVzaChibG9jayk7XG4gICAgfVxuXG4gICAgYXJncy5wdXNoKFwiU1RSRUFNU1wiKTtcblxuICAgIGNvbnN0IHRoZUtleXMgPSBbXTtcbiAgICBjb25zdCB0aGVYSWRzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGEgb2Yga2V5WElkcykge1xuICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAvLyBYS2V5SWRHcm91cExpa2VcbiAgICAgICAgdGhlS2V5cy5wdXNoKGFbMF0pO1xuICAgICAgICB0aGVYSWRzLnB1c2goYVsxXSA9PT0gXCI+XCIgPyBcIj5cIiA6IHhpZHN0cihhWzFdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBYS2V5SWRHcm91cFxuICAgICAgICB0aGVLZXlzLnB1c2goYS5rZXkpO1xuICAgICAgICB0aGVYSWRzLnB1c2goYS54aWQgPT09IFwiPlwiID8gXCI+XCIgOiB4aWRzdHIoYS54aWQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxYUmVhZFN0cmVhbVJhdz4oXG4gICAgICBcIlhSRUFER1JPVVBcIixcbiAgICAgIC4uLmFyZ3MuY29uY2F0KHRoZUtleXMpLmNvbmNhdCh0aGVYSWRzKSxcbiAgICApLnRoZW4oKHJhdykgPT4gcGFyc2VYUmVhZFJlcGx5KHJhdykpO1xuICB9XG5cbiAgeHRyaW0oa2V5OiBzdHJpbmcsIG1heGxlbjogWE1heGxlbikge1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBpZiAobWF4bGVuLmFwcHJveCkge1xuICAgICAgYXJncy5wdXNoKFwiflwiKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2gobWF4bGVuLmVsZW1lbnRzKTtcblxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJYVFJJTVwiLCBrZXksIFwiTUFYTEVOXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgemFkZChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBzY29yZTogbnVtYmVyLFxuICAgIG1lbWJlcjogc3RyaW5nLFxuICAgIG9wdHM/OiBaQWRkT3B0cyxcbiAgKTogUHJvbWlzZTxJbnRlZ2VyPjtcbiAgemFkZChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBzY29yZU1lbWJlcnM6IFtudW1iZXIsIHN0cmluZ11bXSxcbiAgICBvcHRzPzogWkFkZE9wdHMsXG4gICk6IFByb21pc2U8SW50ZWdlcj47XG4gIHphZGQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgbWVtYmVyU2NvcmVzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+LFxuICAgIG9wdHM/OiBaQWRkT3B0cyxcbiAgKTogUHJvbWlzZTxJbnRlZ2VyPjtcbiAgemFkZChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBwYXJhbTE6IG51bWJlciB8IFtudW1iZXIsIHN0cmluZ11bXSB8IFJlY29yZDxzdHJpbmcsIG51bWJlcj4sXG4gICAgcGFyYW0yPzogc3RyaW5nIHwgWkFkZE9wdHMsXG4gICAgb3B0cz86IFpBZGRPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gW2tleV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW0xKSkge1xuICAgICAgdGhpcy5wdXNoWkFkZE9wdHMoYXJncywgcGFyYW0yIGFzIFpBZGRPcHRzKTtcbiAgICAgIGFyZ3MucHVzaCguLi5wYXJhbTEuZmxhdE1hcCgoZSkgPT4gZSkpO1xuICAgICAgb3B0cyA9IHBhcmFtMiBhcyBaQWRkT3B0cztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbTEgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHRoaXMucHVzaFpBZGRPcHRzKGFyZ3MsIHBhcmFtMiBhcyBaQWRkT3B0cyk7XG4gICAgICBmb3IgKGNvbnN0IFttZW1iZXIsIHNjb3JlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbTEpKSB7XG4gICAgICAgIGFyZ3MucHVzaChzY29yZSBhcyBudW1iZXIsIG1lbWJlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVzaFpBZGRPcHRzKGFyZ3MsIG9wdHMpO1xuICAgICAgYXJncy5wdXNoKHBhcmFtMSwgcGFyYW0yIGFzIHN0cmluZyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJaQUREXCIsIC4uLmFyZ3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBwdXNoWkFkZE9wdHMoXG4gICAgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSxcbiAgICBvcHRzPzogWkFkZE9wdHMsXG4gICk6IHZvaWQge1xuICAgIGlmIChvcHRzPy5tb2RlKSB7XG4gICAgICBhcmdzLnB1c2gob3B0cy5tb2RlKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LmNoKSB7XG4gICAgICBhcmdzLnB1c2goXCJDSFwiKTtcbiAgICB9XG4gIH1cblxuICB6YWRkSW5jcihcbiAgICBrZXk6IHN0cmluZyxcbiAgICBzY29yZTogbnVtYmVyLFxuICAgIG1lbWJlcjogc3RyaW5nLFxuICAgIG9wdHM/OiBaQWRkT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJnczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtrZXldO1xuICAgIHRoaXMucHVzaFpBZGRPcHRzKGFyZ3MsIG9wdHMpO1xuICAgIGFyZ3MucHVzaChcIklOQ1JcIiwgc2NvcmUsIG1lbWJlcik7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseShcIlpBRERcIiwgLi4uYXJncyk7XG4gIH1cblxuICB6Y2FyZChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJaQ0FSRFwiLCBrZXkpO1xuICB9XG5cbiAgemNvdW50KGtleTogc3RyaW5nLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWkNPVU5UXCIsIGtleSwgbWluLCBtYXgpO1xuICB9XG5cbiAgemluY3JieShrZXk6IHN0cmluZywgaW5jcmVtZW50OiBudW1iZXIsIG1lbWJlcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0J1bGtSZXBseTxCdWxrU3RyaW5nPihcIlpJTkNSQllcIiwga2V5LCBpbmNyZW1lbnQsIG1lbWJlcik7XG4gIH1cblxuICB6aW50ZXIoXG4gICAga2V5czogc3RyaW5nW10gfCBbc3RyaW5nLCBudW1iZXJdW10gfCBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+LFxuICAgIG9wdHM/OiBaSW50ZXJPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoWlN0b3JlQXJncyhbXSwga2V5cywgb3B0cyk7XG4gICAgaWYgKG9wdHM/LndpdGhTY29yZSkge1xuICAgICAgYXJncy5wdXNoKFwiV0lUSFNDT1JFU1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJaSU5URVJcIiwgLi4uYXJncyk7XG4gIH1cblxuICB6aW50ZXJzdG9yZShcbiAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgIGtleXM6IHN0cmluZ1tdIHwgW3N0cmluZywgbnVtYmVyXVtdIHwgUmVjb3JkPHN0cmluZywgbnVtYmVyPixcbiAgICBvcHRzPzogWkludGVyc3RvcmVPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoWlN0b3JlQXJncyhbZGVzdGluYXRpb25dLCBrZXlzLCBvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWklOVEVSU1RPUkVcIiwgLi4uYXJncyk7XG4gIH1cblxuICB6dW5pb25zdG9yZShcbiAgICBkZXN0aW5hdGlvbjogc3RyaW5nLFxuICAgIGtleXM6IHN0cmluZ1tdIHwgW3N0cmluZywgbnVtYmVyXVtdIHwgUmVjb3JkPHN0cmluZywgbnVtYmVyPixcbiAgICBvcHRzPzogWlVuaW9uc3RvcmVPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoWlN0b3JlQXJncyhbZGVzdGluYXRpb25dLCBrZXlzLCBvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWlVOSU9OU1RPUkVcIiwgLi4uYXJncyk7XG4gIH1cblxuICBwcml2YXRlIHB1c2haU3RvcmVBcmdzKFxuICAgIGFyZ3M6IChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAga2V5czogc3RyaW5nW10gfCBbc3RyaW5nLCBudW1iZXJdW10gfCBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+LFxuICAgIG9wdHM/OiBaSW50ZXJzdG9yZU9wdHMgfCBaVW5pb25zdG9yZU9wdHMsXG4gICkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgICBhcmdzLnB1c2goa2V5cy5sZW5ndGgpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5c1swXSkpIHtcbiAgICAgICAga2V5cyA9IGtleXMgYXMgW3N0cmluZywgbnVtYmVyXVtdO1xuICAgICAgICBhcmdzLnB1c2goLi4ua2V5cy5tYXAoKGUpID0+IGVbMF0pKTtcbiAgICAgICAgYXJncy5wdXNoKFwiV0VJR0hUU1wiKTtcbiAgICAgICAgYXJncy5wdXNoKC4uLmtleXMubWFwKChlKSA9PiBlWzFdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2goLi4uKGtleXMgYXMgc3RyaW5nW10pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKE9iamVjdC5rZXlzKGtleXMpLmxlbmd0aCk7XG4gICAgICBhcmdzLnB1c2goLi4uT2JqZWN0LmtleXMoa2V5cykpO1xuICAgICAgYXJncy5wdXNoKFwiV0VJR0hUU1wiKTtcbiAgICAgIGFyZ3MucHVzaCguLi5PYmplY3QudmFsdWVzKGtleXMpKTtcbiAgICB9XG4gICAgaWYgKG9wdHM/LmFnZ3JlZ2F0ZSkge1xuICAgICAgYXJncy5wdXNoKFwiQUdHUkVHQVRFXCIsIG9wdHMuYWdncmVnYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICB6bGV4Y291bnQoa2V5OiBzdHJpbmcsIG1pbjogc3RyaW5nLCBtYXg6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJaTEVYQ09VTlRcIiwga2V5LCBtaW4sIG1heCk7XG4gIH1cblxuICB6cG9wbWF4KGtleTogc3RyaW5nLCBjb3VudD86IG51bWJlcikge1xuICAgIGlmIChjb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlpQT1BNQVhcIiwga2V5LCBjb3VudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiWlBPUE1BWFwiLCBrZXkpO1xuICB9XG5cbiAgenBvcG1pbihrZXk6IHN0cmluZywgY291bnQ/OiBudW1iZXIpIHtcbiAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJaUE9QTUlOXCIsIGtleSwgY291bnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlpQT1BNSU5cIiwga2V5KTtcbiAgfVxuXG4gIHpyYW5nZShcbiAgICBrZXk6IHN0cmluZyxcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIHN0b3A6IG51bWJlcixcbiAgICBvcHRzPzogWlJhbmdlT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMucHVzaFpSYW5nZU9wdHMoW2tleSwgc3RhcnQsIHN0b3BdLCBvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlpSQU5HRVwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHpyYW5nZWJ5bGV4KFxuICAgIGtleTogc3RyaW5nLFxuICAgIG1pbjogc3RyaW5nLFxuICAgIG1heDogc3RyaW5nLFxuICAgIG9wdHM/OiBaUmFuZ2VCeUxleE9wdHMsXG4gICkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLnB1c2haUmFuZ2VPcHRzKFtrZXksIG1pbiwgbWF4XSwgb3B0cyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJaUkFOR0VCWUxFWFwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHpyYW5nZWJ5c2NvcmUoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgbWluOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgbWF4OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgb3B0cz86IFpSYW5nZUJ5U2NvcmVPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoWlJhbmdlT3B0cyhba2V5LCBtaW4sIG1heF0sIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiWlJBTkdFQllTQ09SRVwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHpyYW5rKGtleTogc3RyaW5nLCBtZW1iZXI6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyT3JOaWxSZXBseShcIlpSQU5LXCIsIGtleSwgbWVtYmVyKTtcbiAgfVxuXG4gIHpyZW0oa2V5OiBzdHJpbmcsIC4uLm1lbWJlcnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0ludGVnZXJSZXBseShcIlpSRU1cIiwga2V5LCAuLi5tZW1iZXJzKTtcbiAgfVxuXG4gIHpyZW1yYW5nZWJ5bGV4KGtleTogc3RyaW5nLCBtaW46IHN0cmluZywgbWF4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWlJFTVJBTkdFQllMRVhcIiwga2V5LCBtaW4sIG1heCk7XG4gIH1cblxuICB6cmVtcmFuZ2VieXJhbmsoa2V5OiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIHN0b3A6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyUmVwbHkoXCJaUkVNUkFOR0VCWVJBTktcIiwga2V5LCBzdGFydCwgc3RvcCk7XG4gIH1cblxuICB6cmVtcmFuZ2VieXNjb3JlKGtleTogc3RyaW5nLCBtaW46IG51bWJlciB8IHN0cmluZywgbWF4OiBudW1iZXIgfCBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjSW50ZWdlclJlcGx5KFwiWlJFTVJBTkdFQllTQ09SRVwiLCBrZXksIG1pbiwgbWF4KTtcbiAgfVxuXG4gIHpyZXZyYW5nZShcbiAgICBrZXk6IHN0cmluZyxcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIHN0b3A6IG51bWJlcixcbiAgICBvcHRzPzogWlJhbmdlT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMucHVzaFpSYW5nZU9wdHMoW2tleSwgc3RhcnQsIHN0b3BdLCBvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseTxCdWxrU3RyaW5nPihcIlpSRVZSQU5HRVwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHpyZXZyYW5nZWJ5bGV4KFxuICAgIGtleTogc3RyaW5nLFxuICAgIG1heDogc3RyaW5nLFxuICAgIG1pbjogc3RyaW5nLFxuICAgIG9wdHM/OiBaUmFuZ2VCeUxleE9wdHMsXG4gICkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLnB1c2haUmFuZ2VPcHRzKFtrZXksIG1pbiwgbWF4XSwgb3B0cyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHk8QnVsa1N0cmluZz4oXCJaUkVWUkFOR0VCWUxFWFwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHpyZXZyYW5nZWJ5c2NvcmUoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgbWF4OiBudW1iZXIsXG4gICAgbWluOiBudW1iZXIsXG4gICAgb3B0cz86IFpSYW5nZUJ5U2NvcmVPcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoWlJhbmdlT3B0cyhba2V5LCBtYXgsIG1pbl0sIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5PEJ1bGtTdHJpbmc+KFwiWlJFVlJBTkdFQllTQ09SRVwiLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHByaXZhdGUgcHVzaFpSYW5nZU9wdHMoXG4gICAgYXJnczogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRzPzogWlJhbmdlT3B0cyB8IFpSYW5nZUJ5TGV4T3B0cyB8IFpSYW5nZUJ5U2NvcmVPcHRzLFxuICApIHtcbiAgICBpZiAoKG9wdHMgYXMgWlJhbmdlQnlTY29yZU9wdHMpPy53aXRoU2NvcmUpIHtcbiAgICAgIGFyZ3MucHVzaChcIldJVEhTQ09SRVNcIik7XG4gICAgfVxuICAgIGlmICgob3B0cyBhcyBaUmFuZ2VCeVNjb3JlT3B0cyk/LmxpbWl0KSB7XG4gICAgICBhcmdzLnB1c2goXG4gICAgICAgIFwiTElNSVRcIixcbiAgICAgICAgKG9wdHMgYXMgWlJhbmdlQnlTY29yZU9wdHMpLmxpbWl0IS5vZmZzZXQsXG4gICAgICAgIChvcHRzIGFzIFpSYW5nZUJ5U2NvcmVPcHRzKS5saW1pdCEuY291bnQsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gYXJncztcbiAgfVxuXG4gIHpyZXZyYW5rKGtleTogc3RyaW5nLCBtZW1iZXI6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmV4ZWNJbnRlZ2VyT3JOaWxSZXBseShcIlpSRVZSQU5LXCIsIGtleSwgbWVtYmVyKTtcbiAgfVxuXG4gIHpzY29yZShrZXk6IHN0cmluZywgbWVtYmVyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjQnVsa1JlcGx5KFwiWlNDT1JFXCIsIGtleSwgbWVtYmVyKTtcbiAgfVxuXG4gIHNjYW4oXG4gICAgY3Vyc29yOiBudW1iZXIsXG4gICAgb3B0cz86IFNjYW5PcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoU2Nhbk9wdHMoW2N1cnNvcl0sIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5KFwiU0NBTlwiLCAuLi5hcmdzKSBhcyBQcm9taXNlPFxuICAgICAgW0J1bGtTdHJpbmcsIEJ1bGtTdHJpbmdbXV1cbiAgICA+O1xuICB9XG5cbiAgc3NjYW4oXG4gICAga2V5OiBzdHJpbmcsXG4gICAgY3Vyc29yOiBudW1iZXIsXG4gICAgb3B0cz86IFNTY2FuT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMucHVzaFNjYW5PcHRzKFtrZXksIGN1cnNvcl0sIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLmV4ZWNBcnJheVJlcGx5KFwiU1NDQU5cIiwgLi4uYXJncykgYXMgUHJvbWlzZTxcbiAgICAgIFtCdWxrU3RyaW5nLCBCdWxrU3RyaW5nW11dXG4gICAgPjtcbiAgfVxuXG4gIGhzY2FuKFxuICAgIGtleTogc3RyaW5nLFxuICAgIGN1cnNvcjogbnVtYmVyLFxuICAgIG9wdHM/OiBIU2Nhbk9wdHMsXG4gICkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLnB1c2hTY2FuT3B0cyhba2V5LCBjdXJzb3JdLCBvcHRzKTtcbiAgICByZXR1cm4gdGhpcy5leGVjQXJyYXlSZXBseShcIkhTQ0FOXCIsIC4uLmFyZ3MpIGFzIFByb21pc2U8XG4gICAgICBbQnVsa1N0cmluZywgQnVsa1N0cmluZ1tdXVxuICAgID47XG4gIH1cblxuICB6c2NhbihcbiAgICBrZXk6IHN0cmluZyxcbiAgICBjdXJzb3I6IG51bWJlcixcbiAgICBvcHRzPzogWlNjYW5PcHRzLFxuICApIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5wdXNoU2Nhbk9wdHMoW2tleSwgY3Vyc29yXSwgb3B0cyk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY0FycmF5UmVwbHkoXCJaU0NBTlwiLCAuLi5hcmdzKSBhcyBQcm9taXNlPFxuICAgICAgW0J1bGtTdHJpbmcsIEJ1bGtTdHJpbmdbXV1cbiAgICA+O1xuICB9XG5cbiAgcHJpdmF0ZSBwdXNoU2Nhbk9wdHMoXG4gICAgYXJnczogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBvcHRzPzogU2Nhbk9wdHMgfCBIU2Nhbk9wdHMgfCBaU2Nhbk9wdHMgfCBTU2Nhbk9wdHMsXG4gICkge1xuICAgIGlmIChvcHRzPy5wYXR0ZXJuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MucHVzaChcIk1BVENIXCIsIG9wdHMucGF0dGVybik7XG4gICAgfVxuICAgIGlmIChvcHRzPy5jb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJDT1VOVFwiLCBvcHRzLmNvdW50KTtcbiAgICB9XG4gICAgaWYgKChvcHRzIGFzIFNjYW5PcHRzKT8udHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzLnB1c2goXCJUWVBFXCIsIChvcHRzIGFzIFNjYW5PcHRzKS50eXBlISk7XG4gICAgfVxuICAgIHJldHVybiBhcmdzO1xuICB9XG5cbiAgdHgoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVJlZGlzUGlwZWxpbmUodGhpcy5leGVjdXRvci5jb25uZWN0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIHBpcGVsaW5lKCkge1xuICAgIHJldHVybiBjcmVhdGVSZWRpc1BpcGVsaW5lKHRoaXMuZXhlY3V0b3IuY29ubmVjdGlvbik7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWRpc0Nvbm5lY3RPcHRpb25zIGV4dGVuZHMgUmVkaXNDb25uZWN0aW9uT3B0aW9ucyB7XG4gIGhvc3RuYW1lOiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXIgfCBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29ubmVjdCB0byBSZWRpcyBzZXJ2ZXJcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAZXhhbXBsZVxuICogYGBgdHNcbiAqIGltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwiLi9tb2QudHNcIjtcbiAqIGNvbnN0IGNvbm4xID0gYXdhaXQgY29ubmVjdCh7aG9zdG5hbWU6IFwiMTI3LjAuMC4xXCIsIHBvcnQ6IDYzNzl9KTsgLy8gLT4gVENQLCAxMjcuMC4wLjE6NjM3OVxuICogY29uc3QgY29ubjIgPSBhd2FpdCBjb25uZWN0KHtob3N0bmFtZTogXCJyZWRpcy5wcm94eVwiLCBwb3J0OiA0NDMsIHRsczogdHJ1ZX0pOyAvLyAtPiBUTFMsIHJlZGlzLnByb3h5OjQ0M1xuICogYGBgXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0KG9wdGlvbnM6IFJlZGlzQ29ubmVjdE9wdGlvbnMpOiBQcm9taXNlPFJlZGlzPiB7XG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBjcmVhdGVSZWRpc0Nvbm5lY3Rpb24ob3B0aW9ucyk7XG4gIGF3YWl0IGNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICBjb25zdCBleGVjdXRvciA9IG5ldyBEZWZhdWx0RXhlY3V0b3IoY29ubmVjdGlvbik7XG4gIHJldHVybiBjcmVhdGUoZXhlY3V0b3IpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGxhenkgUmVkaXMgY2xpZW50IHRoYXQgd2lsbCBub3QgZXN0YWJsaXNoIGEgY29ubmVjdGlvbiB1bnRpbCBhIGNvbW1hbmQgaXMgYWN0dWFsbHkgZXhlY3V0ZWQuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IGNyZWF0ZUxhenlDbGllbnQgfSBmcm9tIFwiLi9tb2QudHNcIjtcbiAqXG4gKiBjb25zdCBjbGllbnQgPSBjcmVhdGVMYXp5Q2xpZW50KHsgaG9zdG5hbWU6IFwiMTI3LjAuMC4xXCIsIHBvcnQ6IDYzNzkgfSk7XG4gKiBjb25zb2xlLmFzc2VydCghY2xpZW50LmlzQ29ubmVjdGVkKTtcbiAqIGF3YWl0IGNsaWVudC5nZXQoXCJmb29cIik7XG4gKiBjb25zb2xlLmFzc2VydChjbGllbnQuaXNDb25uZWN0ZWQpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMYXp5Q2xpZW50KG9wdGlvbnM6IFJlZGlzQ29ubmVjdE9wdGlvbnMpOiBSZWRpcyB7XG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBjcmVhdGVSZWRpc0Nvbm5lY3Rpb24ob3B0aW9ucyk7XG4gIGNvbnN0IGV4ZWN1dG9yID0gY3JlYXRlTGF6eUV4ZWN1dG9yKGNvbm5lY3Rpb24pO1xuICByZXR1cm4gY3JlYXRlKGV4ZWN1dG9yKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSByZWRpcyBjbGllbnQgZnJvbSBgQ29tbWFuZEV4ZWN1dG9yYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3IpOiBSZWRpcyB7XG4gIHJldHVybiBuZXcgUmVkaXNJbXBsKGV4ZWN1dG9yKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IFJlZGlzQ29ubmVjdE9wdGlvbnMgZnJvbSByZWRpcyBVUkxcbiAqIEBwYXJhbSB1cmxcbiAqIEBleGFtcGxlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgcGFyc2VVUkwgfSBmcm9tIFwiLi9tb2QudHNcIjtcbiAqXG4gKiBwYXJzZVVSTChcInJlZGlzOi8vZm9vOmJhckBsb2NhbGhvc3Q6NjM3OS8xXCIpOyAvLyAtPiB7aG9zdG5hbWU6IFwibG9jYWxob3N0XCIsIHBvcnQ6IFwiNjM3OVwiLCB0bHM6IGZhbHNlLCBkYjogMSwgbmFtZTogZm9vLCBwYXNzd29yZDogYmFyfVxuICogcGFyc2VVUkwoXCJyZWRpc3M6Ly8xMjcuMC4wLjE6NDQzLz9kYj0yJnBhc3N3b3JkPWJhclwiKTsgLy8gLT4ge2hvc3RuYW1lOiBcIjEyNy4wLjAuMVwiLCBwb3J0OiBcIjQ0M1wiLCB0bHM6IHRydWUsIGRiOiAyLCBuYW1lOiB1bmRlZmluZWQsIHBhc3N3b3JkOiBiYXJ9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVVJMKHVybDogc3RyaW5nKTogUmVkaXNDb25uZWN0T3B0aW9ucyB7XG4gIGNvbnN0IHtcbiAgICBwcm90b2NvbCxcbiAgICBob3N0bmFtZSxcbiAgICBwb3J0LFxuICAgIHVzZXJuYW1lLFxuICAgIHBhc3N3b3JkLFxuICAgIHBhdGhuYW1lLFxuICAgIHNlYXJjaFBhcmFtcyxcbiAgfSA9IG5ldyBVUkwodXJsKTtcbiAgY29uc3QgZGIgPSBwYXRobmFtZS5yZXBsYWNlKFwiL1wiLCBcIlwiKSAhPT0gXCJcIlxuICAgID8gcGF0aG5hbWUucmVwbGFjZShcIi9cIiwgXCJcIilcbiAgICA6IHNlYXJjaFBhcmFtcy5nZXQoXCJkYlwiKSA/PyB1bmRlZmluZWQ7XG4gIHJldHVybiB7XG4gICAgaG9zdG5hbWU6IGhvc3RuYW1lICE9PSBcIlwiID8gaG9zdG5hbWUgOiBcImxvY2FsaG9zdFwiLFxuICAgIHBvcnQ6IHBvcnQgIT09IFwiXCIgPyBwYXJzZUludChwb3J0LCAxMCkgOiA2Mzc5LFxuICAgIHRsczogcHJvdG9jb2wgPT0gXCJyZWRpc3M6XCIgPyB0cnVlIDogc2VhcmNoUGFyYW1zLmdldChcInNzbFwiKSA9PT0gXCJ0cnVlXCIsXG4gICAgZGI6IGRiID8gcGFyc2VJbnQoZGIsIDEwKSA6IHVuZGVmaW5lZCxcbiAgICBuYW1lOiB1c2VybmFtZSAhPT0gXCJcIiA/IHVzZXJuYW1lIDogdW5kZWZpbmVkLFxuICAgIHBhc3N3b3JkOiBwYXNzd29yZCAhPT0gXCJcIlxuICAgICAgPyBwYXNzd29yZFxuICAgICAgOiBzZWFyY2hQYXJhbXMuZ2V0KFwicGFzc3dvcmRcIikgPz8gdW5kZWZpbmVkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZWRpc0Nvbm5lY3Rpb24ob3B0aW9uczogUmVkaXNDb25uZWN0T3B0aW9ucyk6IENvbm5lY3Rpb24ge1xuICBjb25zdCB7IGhvc3RuYW1lLCBwb3J0ID0gNjM3OSwgLi4ub3B0cyB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIG5ldyBSZWRpc0Nvbm5lY3Rpb24oaG9zdG5hbWUsIHBvcnQsIG9wdHMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMYXp5RXhlY3V0b3IoY29ubmVjdGlvbjogQ29ubmVjdGlvbik6IENvbW1hbmRFeGVjdXRvciB7XG4gIGxldCBleGVjdXRvcjogQ29tbWFuZEV4ZWN1dG9yIHwgbnVsbCA9IG51bGw7XG4gIHJldHVybiB7XG4gICAgZ2V0IGNvbm5lY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgICB9LFxuICAgIGV4ZWMoY29tbWFuZCwgLi4uYXJncykge1xuICAgICAgcmV0dXJuIHRoaXMuc2VuZENvbW1hbmQoY29tbWFuZCwgYXJncyk7XG4gICAgfSxcbiAgICBhc3luYyBzZW5kQ29tbWFuZChjb21tYW5kLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIWV4ZWN1dG9yKSB7XG4gICAgICAgIGV4ZWN1dG9yID0gbmV3IERlZmF1bHRFeGVjdXRvcihjb25uZWN0aW9uKTtcbiAgICAgICAgaWYgKCFjb25uZWN0aW9uLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgYXdhaXQgY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBleGVjdXRvci5zZW5kQ29tbWFuZChjb21tYW5kLCBhcmdzLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGNsb3NlKCkge1xuICAgICAgaWYgKGV4ZWN1dG9yKSB7XG4gICAgICAgIHJldHVybiBleGVjdXRvci5jbG9zZSgpO1xuICAgICAgfVxuICAg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