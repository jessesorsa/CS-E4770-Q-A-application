import { exponentialBackoff } from "./backoff.ts";
import { ErrorReplyError, isRetriableError } from "./errors.ts";
import { kUnstableCreateProtocol, kUnstablePipeline, kUnstableReadReply, kUnstableWriteCommand } from "./internal/symbols.ts";
import { Protocol as DenoStreamsProtocol } from "./protocol/deno_streams/mod.ts";
import { delay } from "./vendor/https/deno.land/std/async/delay.ts";
export const kEmptyRedisArgs = [];
export class RedisConnection {
    name;
    maxRetryCount;
    hostname;
    port;
    _isClosed;
    _isConnected;
    backoff;
    commandQueue;
    #conn;
    #protocol;
    get isClosed() {
        return this._isClosed;
    }
    get isConnected() {
        return this._isConnected;
    }
    get isRetriable() {
        return this.maxRetryCount > 0;
    }
    constructor(hostname, port, options){
        this.options = options;
        this.name = null;
        this.maxRetryCount = 10;
        this._isClosed = false;
        this._isConnected = false;
        this.commandQueue = [];
        this.hostname = hostname;
        this.port = port;
        if (options.name) {
            this.name = options.name;
        }
        if (options.maxRetryCount != null) {
            this.maxRetryCount = options.maxRetryCount;
        }
        this.backoff = options.backoff ?? exponentialBackoff();
    }
    async authenticate(username, password) {
        try {
            password && username ? await this.sendCommand("AUTH", [
                username,
                password
            ], {
                inline: true
            }) : await this.sendCommand("AUTH", [
                password
            ], {
                inline: true
            });
        } catch (error) {
            if (error instanceof ErrorReplyError) {
                throw new AuthenticationError("Authentication failed", {
                    cause: error
                });
            } else {
                throw error;
            }
        }
    }
    async selectDb(db = this.options.db) {
        if (!db) throw new Error("The database index is undefined.");
        await this.sendCommand("SELECT", [
            db
        ], {
            inline: true
        });
    }
    enqueueCommand(command) {
        this.commandQueue.push(command);
        if (this.commandQueue.length === 1) {
            this.processCommandQueue();
        }
    }
    sendCommand(command, args, options) {
        const execute = ()=>this.#protocol.sendCommand(command, args ?? kEmptyRedisArgs, options?.returnUint8Arrays);
        if (options?.inline) {
            return execute();
        }
        const { promise , resolve , reject  } = Promise.withResolvers();
        this.enqueueCommand({
            execute,
            resolve,
            reject
        });
        return promise;
    }
    [kUnstableReadReply](returnsUint8Arrays) {
        return this.#protocol.readReply(returnsUint8Arrays);
    }
    [kUnstablePipeline](commands) {
        const { promise , resolve , reject  } = Promise.withResolvers();
        const execute = ()=>this.#protocol.pipeline(commands);
        this.enqueueCommand({
            execute,
            resolve,
            reject
        });
        return promise;
    }
    [kUnstableWriteCommand](command) {
        return this.#protocol.writeCommand(command);
    }
    /**
   * Connect to Redis server
   */ async connect() {
        await this.#connect(0);
    }
    async #connect(retryCount) {
        try {
            const dialOpts = {
                hostname: this.hostname,
                port: parsePortLike(this.port)
            };
            const conn = this.options?.tls ? await Deno.connectTls(dialOpts) : await Deno.connect(dialOpts);
            this.#conn = conn;
            this.#protocol = this.options?.[kUnstableCreateProtocol]?.(conn) ?? new DenoStreamsProtocol(conn);
            this._isClosed = false;
            this._isConnected = true;
            try {
                if (this.options.password != null) {
                    await this.authenticate(this.options.username, this.options.password);
                }
                if (this.options.db) {
                    await this.selectDb(this.options.db);
                }
            } catch (error) {
                this.close();
                throw error;
            }
            this.#enableHealthCheckIfNeeded();
        } catch (error) {
            if (error instanceof AuthenticationError) {
                throw error.cause ?? error;
            }
            const backoff = this.backoff(retryCount);
            retryCount++;
            if (retryCount >= this.maxRetryCount) {
                throw error;
            }
            await delay(backoff);
            await this.#connect(retryCount);
        }
    }
    close() {
        this._isClosed = true;
        this._isConnected = false;
        try {
            this.#conn.close();
        } catch (error) {
            if (!(error instanceof Deno.errors.BadResource)) throw error;
        }
    }
    async reconnect() {
        try {
            await this.sendCommand("PING");
            this._isConnected = true;
        } catch (_error) {
            this.close();
            await this.connect();
            await this.sendCommand("PING");
        }
    }
    async processCommandQueue() {
        const [command] = this.commandQueue;
        if (!command) return;
        try {
            const reply = await command.execute();
            command.resolve(reply);
        } catch (error) {
            if (!isRetriableError(error) || this.isManuallyClosedByUser()) {
                return command.reject(error);
            }
            for(let i = 0; i < this.maxRetryCount; i++){
                // Try to reconnect to the server and retry the command
                this.close();
                try {
                    await this.connect();
                    const reply = await command.execute();
                    return command.resolve(reply);
                } catch  {
                    const backoff = this.backoff(i);
                    await delay(backoff);
                }
            }
            command.reject(error);
        } finally{
            this.commandQueue.shift();
            this.processCommandQueue();
        }
    }
    isManuallyClosedByUser() {
        return this._isClosed && !this._isConnected;
    }
    #enableHealthCheckIfNeeded() {
        const { healthCheckInterval  } = this.options;
        if (healthCheckInterval == null) {
            return;
        }
        const ping = async ()=>{
            if (this.isManuallyClosedByUser()) {
                return;
            }
            try {
                await this.sendCommand("PING");
                this._isConnected = true;
            } catch  {
                // TODO: notify the user of an error
                this._isConnected = false;
            } finally{
                setTimeout(ping, healthCheckInterval);
            }
        };
        setTimeout(ping, healthCheckInterval);
    }
    options;
}
class AuthenticationError extends Error {
}
function parsePortLike(port) {
    let parsedPort;
    if (typeof port === "string") {
        parsedPort = parseInt(port);
    } else if (typeof port === "number") {
        parsedPort = port;
    } else {
        parsedPort = 6379;
    }
    if (!Number.isSafeInteger(parsedPort)) {
        throw new Error("Port is invalid");
    }
    return parsedPort;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvcmVkaXNAdjAuMzIuNC9jb25uZWN0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQmFja29mZiB9IGZyb20gXCIuL2JhY2tvZmYudHNcIjtcbmltcG9ydCB7IGV4cG9uZW50aWFsQmFja29mZiB9IGZyb20gXCIuL2JhY2tvZmYudHNcIjtcbmltcG9ydCB7IEVycm9yUmVwbHlFcnJvciwgaXNSZXRyaWFibGVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy50c1wiO1xuaW1wb3J0IHtcbiAga1Vuc3RhYmxlQ3JlYXRlUHJvdG9jb2wsXG4gIGtVbnN0YWJsZVBpcGVsaW5lLFxuICBrVW5zdGFibGVSZWFkUmVwbHksXG4gIGtVbnN0YWJsZVdyaXRlQ29tbWFuZCxcbn0gZnJvbSBcIi4vaW50ZXJuYWwvc3ltYm9scy50c1wiO1xuaW1wb3J0IHsgUHJvdG9jb2wgYXMgRGVub1N0cmVhbXNQcm90b2NvbCB9IGZyb20gXCIuL3Byb3RvY29sL2Rlbm9fc3RyZWFtcy9tb2QudHNcIjtcbmltcG9ydCB0eXBlIHsgQ29tbWFuZCwgUHJvdG9jb2wgfSBmcm9tIFwiLi9wcm90b2NvbC9zaGFyZWQvcHJvdG9jb2wudHNcIjtcbmltcG9ydCB0eXBlIHsgUmVkaXNSZXBseSwgUmVkaXNWYWx1ZSB9IGZyb20gXCIuL3Byb3RvY29sL3NoYXJlZC90eXBlcy50c1wiO1xuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi92ZW5kb3IvaHR0cHMvZGVuby5sYW5kL3N0ZC9hc3luYy9kZWxheS50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlbmRDb21tYW5kT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgb3B0aW9uIGlzIHNldCwgc2ltcGxlIG9yIGJ1bGsgc3RyaW5nIHJlcGxpZXMgYXJlIHJldHVybmVkIGFzIGBVaW50OEFycmF5YCB0eXBlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmV0dXJuVWludDhBcnJheXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgb3B0aW9uIGlzIHNldCwgdGhlIGNvbW1hbmQgaXMgZXhlY3V0ZWQgZGlyZWN0bHkgd2l0aG91dCBxdWV1ZWluZy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGlubGluZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvbiB7XG4gIGlzQ2xvc2VkOiBib29sZWFuO1xuICBpc0Nvbm5lY3RlZDogYm9vbGVhbjtcbiAgY2xvc2UoKTogdm9pZDtcbiAgY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+O1xuICByZWNvbm5lY3QoKTogUHJvbWlzZTx2b2lkPjtcbiAgc2VuZENvbW1hbmQoXG4gICAgY29tbWFuZDogc3RyaW5nLFxuICAgIGFyZ3M/OiBBcnJheTxSZWRpc1ZhbHVlPixcbiAgICBvcHRpb25zPzogU2VuZENvbW1hbmRPcHRpb25zLFxuICApOiBQcm9taXNlPFJlZGlzUmVwbHk+O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFtrVW5zdGFibGVSZWFkUmVwbHldKHJldHVybnNVaW50OEFycmF5cz86IGJvb2xlYW4pOiBQcm9taXNlPFJlZGlzUmVwbHk+O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFtrVW5zdGFibGVXcml0ZUNvbW1hbmRdKGNvbW1hbmQ6IENvbW1hbmQpOiBQcm9taXNlPHZvaWQ+O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFtrVW5zdGFibGVQaXBlbGluZV0oXG4gICAgY29tbWFuZHM6IEFycmF5PENvbW1hbmQ+LFxuICApOiBQcm9taXNlPEFycmF5PFJlZGlzUmVwbHkgfCBFcnJvclJlcGx5RXJyb3I+Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWRpc0Nvbm5lY3Rpb25PcHRpb25zIHtcbiAgdGxzPzogYm9vbGVhbjtcbiAgZGI/OiBudW1iZXI7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbiAgLyoqXG4gICAqIEBkZWZhdWx0IDEwXG4gICAqL1xuICBtYXhSZXRyeUNvdW50PzogbnVtYmVyO1xuICBiYWNrb2ZmPzogQmFja29mZjtcbiAgLyoqXG4gICAqIFdoZW4gdGhpcyBvcHRpb24gaXMgc2V0LCBhIGBQSU5HYCBjb21tYW5kIGlzIHNlbnQgZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzLlxuICAgKi9cbiAgaGVhbHRoQ2hlY2tJbnRlcnZhbD86IG51bWJlcjtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFtrVW5zdGFibGVDcmVhdGVQcm90b2NvbF0/OiAoY29ubjogRGVuby5Db25uKSA9PiBQcm90b2NvbDtcbn1cblxuZXhwb3J0IGNvbnN0IGtFbXB0eVJlZGlzQXJnczogQXJyYXk8UmVkaXNWYWx1ZT4gPSBbXTtcblxuaW50ZXJmYWNlIFBlbmRpbmdDb21tYW5kIHtcbiAgZXhlY3V0ZTogKCkgPT4gUHJvbWlzZTxSZWRpc1JlcGx5PjtcbiAgcmVzb2x2ZTogKHJlcGx5OiBSZWRpc1JlcGx5KSA9PiB2b2lkO1xuICByZWplY3Q6IChlcnJvcjogdW5rbm93bikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZGlzQ29ubmVjdGlvbiBpbXBsZW1lbnRzIENvbm5lY3Rpb24ge1xuICBuYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBtYXhSZXRyeUNvdW50ID0gMTA7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBob3N0bmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHBvcnQ6IG51bWJlciB8IHN0cmluZztcbiAgcHJpdmF0ZSBfaXNDbG9zZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBiYWNrb2ZmOiBCYWNrb2ZmO1xuXG4gIHByaXZhdGUgY29tbWFuZFF1ZXVlOiBQZW5kaW5nQ29tbWFuZFtdID0gW107XG4gICNjb25uITogRGVuby5Db25uO1xuICAjcHJvdG9jb2whOiBQcm90b2NvbDtcblxuICBnZXQgaXNDbG9zZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQ2xvc2VkO1xuICB9XG5cbiAgZ2V0IGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc0Nvbm5lY3RlZDtcbiAgfVxuXG4gIGdldCBpc1JldHJpYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tYXhSZXRyeUNvdW50ID4gMDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGhvc3RuYW1lOiBzdHJpbmcsXG4gICAgcG9ydDogbnVtYmVyIHwgc3RyaW5nLFxuICAgIHByaXZhdGUgb3B0aW9uczogUmVkaXNDb25uZWN0aW9uT3B0aW9ucyxcbiAgKSB7XG4gICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgaWYgKG9wdGlvbnMubmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5tYXhSZXRyeUNvdW50ICE9IG51bGwpIHtcbiAgICAgIHRoaXMubWF4UmV0cnlDb3VudCA9IG9wdGlvbnMubWF4UmV0cnlDb3VudDtcbiAgICB9XG4gICAgdGhpcy5iYWNrb2ZmID0gb3B0aW9ucy5iYWNrb2ZmID8/IGV4cG9uZW50aWFsQmFja29mZigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhdXRoZW50aWNhdGUoXG4gICAgdXNlcm5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBwYXNzd29yZDogc3RyaW5nLFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgcGFzc3dvcmQgJiYgdXNlcm5hbWVcbiAgICAgICAgPyBhd2FpdCB0aGlzLnNlbmRDb21tYW5kKFwiQVVUSFwiLCBbdXNlcm5hbWUsIHBhc3N3b3JkXSwgeyBpbmxpbmU6IHRydWUgfSlcbiAgICAgICAgOiBhd2FpdCB0aGlzLnNlbmRDb21tYW5kKFwiQVVUSFwiLCBbcGFzc3dvcmRdLCB7IGlubGluZTogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3JSZXBseUVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBBdXRoZW50aWNhdGlvbkVycm9yKFwiQXV0aGVudGljYXRpb24gZmFpbGVkXCIsIHtcbiAgICAgICAgICBjYXVzZTogZXJyb3IsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZWxlY3REYihcbiAgICBkYjogbnVtYmVyIHwgdW5kZWZpbmVkID0gdGhpcy5vcHRpb25zLmRiLFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWRiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZGF0YWJhc2UgaW5kZXggaXMgdW5kZWZpbmVkLlwiKTtcbiAgICBhd2FpdCB0aGlzLnNlbmRDb21tYW5kKFwiU0VMRUNUXCIsIFtkYl0sIHsgaW5saW5lOiB0cnVlIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnF1ZXVlQ29tbWFuZChcbiAgICBjb21tYW5kOiBQZW5kaW5nQ29tbWFuZCxcbiAgKSB7XG4gICAgdGhpcy5jb21tYW5kUXVldWUucHVzaChjb21tYW5kKTtcbiAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLnByb2Nlc3NDb21tYW5kUXVldWUoKTtcbiAgICB9XG4gIH1cblxuICBzZW5kQ29tbWFuZChcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgYXJncz86IEFycmF5PFJlZGlzVmFsdWU+LFxuICAgIG9wdGlvbnM/OiBTZW5kQ29tbWFuZE9wdGlvbnMsXG4gICk6IFByb21pc2U8UmVkaXNSZXBseT4ge1xuICAgIGNvbnN0IGV4ZWN1dGUgPSAoKSA9PlxuICAgICAgdGhpcy4jcHJvdG9jb2wuc2VuZENvbW1hbmQoXG4gICAgICAgIGNvbW1hbmQsXG4gICAgICAgIGFyZ3MgPz8ga0VtcHR5UmVkaXNBcmdzLFxuICAgICAgICBvcHRpb25zPy5yZXR1cm5VaW50OEFycmF5cyxcbiAgICAgICk7XG4gICAgaWYgKG9wdGlvbnM/LmlubGluZSkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGUoKTtcbiAgICB9XG4gICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlLCByZWplY3QgfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxSZWRpc1JlcGx5PigpO1xuICAgIHRoaXMuZW5xdWV1ZUNvbW1hbmQoeyBleGVjdXRlLCByZXNvbHZlLCByZWplY3QgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIFtrVW5zdGFibGVSZWFkUmVwbHldKHJldHVybnNVaW50OEFycmF5cz86IGJvb2xlYW4pOiBQcm9taXNlPFJlZGlzUmVwbHk+IHtcbiAgICByZXR1cm4gdGhpcy4jcHJvdG9jb2wucmVhZFJlcGx5KHJldHVybnNVaW50OEFycmF5cyk7XG4gIH1cblxuICBba1Vuc3RhYmxlUGlwZWxpbmVdKGNvbW1hbmRzOiBBcnJheTxDb21tYW5kPikge1xuICAgIGNvbnN0IHsgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0IH0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8XG4gICAgICBSZWRpc1JlcGx5W11cbiAgICA+KCk7XG4gICAgY29uc3QgZXhlY3V0ZSA9ICgpID0+IHRoaXMuI3Byb3RvY29sLnBpcGVsaW5lKGNvbW1hbmRzKTtcbiAgICB0aGlzLmVucXVldWVDb21tYW5kKHsgZXhlY3V0ZSwgcmVzb2x2ZSwgcmVqZWN0IH0gYXMgUGVuZGluZ0NvbW1hbmQpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgW2tVbnN0YWJsZVdyaXRlQ29tbWFuZF0oY29tbWFuZDogQ29tbWFuZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLiNwcm90b2NvbC53cml0ZUNvbW1hbmQoY29tbWFuZCk7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0byBSZWRpcyBzZXJ2ZXJcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy4jY29ubmVjdCgwKTtcbiAgfVxuXG4gIGFzeW5jICNjb25uZWN0KHJldHJ5Q291bnQ6IG51bWJlcikge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkaWFsT3B0czogRGVuby5Db25uZWN0T3B0aW9ucyA9IHtcbiAgICAgICAgaG9zdG5hbWU6IHRoaXMuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHBhcnNlUG9ydExpa2UodGhpcy5wb3J0KSxcbiAgICAgIH07XG4gICAgICBjb25zdCBjb25uOiBEZW5vLkNvbm4gPSB0aGlzLm9wdGlvbnM/LnRsc1xuICAgICAgICA/IGF3YWl0IERlbm8uY29ubmVjdFRscyhkaWFsT3B0cylcbiAgICAgICAgOiBhd2FpdCBEZW5vLmNvbm5lY3QoZGlhbE9wdHMpO1xuXG4gICAgICB0aGlzLiNjb25uID0gY29ubjtcbiAgICAgIHRoaXMuI3Byb3RvY29sID0gdGhpcy5vcHRpb25zPy5ba1Vuc3RhYmxlQ3JlYXRlUHJvdG9jb2xdPy4oY29ubikgPz9cbiAgICAgICAgbmV3IERlbm9TdHJlYW1zUHJvdG9jb2woY29ubik7XG4gICAgICB0aGlzLl9pc0Nsb3NlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhc3N3b3JkICE9IG51bGwpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZSh0aGlzLm9wdGlvbnMudXNlcm5hbWUsIHRoaXMub3B0aW9ucy5wYXNzd29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYikge1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2VsZWN0RGIodGhpcy5vcHRpb25zLmRiKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgdGhpcy4jZW5hYmxlSGVhbHRoQ2hlY2tJZk5lZWRlZCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBdXRoZW50aWNhdGlvbkVycm9yKSB7XG4gICAgICAgIHRocm93IChlcnJvci5jYXVzZSA/PyBlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJhY2tvZmYgPSB0aGlzLmJhY2tvZmYocmV0cnlDb3VudCk7XG4gICAgICByZXRyeUNvdW50Kys7XG4gICAgICBpZiAocmV0cnlDb3VudCA+PSB0aGlzLm1heFJldHJ5Q291bnQpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgICBhd2FpdCBkZWxheShiYWNrb2ZmKTtcbiAgICAgIGF3YWl0IHRoaXMuI2Nvbm5lY3QocmV0cnlDb3VudCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5faXNDbG9zZWQgPSB0cnVlO1xuICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuI2Nvbm4hLmNsb3NlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuQmFkUmVzb3VyY2UpKSB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZWNvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZENvbW1hbmQoXCJQSU5HXCIpO1xuICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikgeyAvLyBUT0RPOiBNYXliZSB3ZSBzaG91bGQgbG9nIHRoaXMgZXJyb3IuXG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIGF3YWl0IHRoaXMuc2VuZENvbW1hbmQoXCJQSU5HXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvY2Vzc0NvbW1hbmRRdWV1ZSgpIHtcbiAgICBjb25zdCBbY29tbWFuZF0gPSB0aGlzLmNvbW1hbmRRdWV1ZTtcbiAgICBpZiAoIWNvbW1hbmQpIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNvbW1hbmQuZXhlY3V0ZSgpO1xuICAgICAgY29tbWFuZC5yZXNvbHZlKHJlcGx5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKFxuICAgICAgICAhaXNSZXRyaWFibGVFcnJvcihlcnJvcikgfHxcbiAgICAgICAgdGhpcy5pc01hbnVhbGx5Q2xvc2VkQnlVc2VyKClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gY29tbWFuZC5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF4UmV0cnlDb3VudDsgaSsrKSB7XG4gICAgICAgIC8vIFRyeSB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBhbmQgcmV0cnkgdGhlIGNvbW1hbmRcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbW1hbmQucmVzb2x2ZShyZXBseSk7XG4gICAgICAgIH0gY2F0Y2ggeyAvLyBUT0RPOiB1c2UgYEFnZ3JlZ2F0ZUVycm9yYD9cbiAgICAgICAgICBjb25zdCBiYWNrb2ZmID0gdGhpcy5iYWNrb2ZmKGkpO1xuICAgICAgICAgIGF3YWl0IGRlbGF5KGJhY2tvZmYpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbW1hbmQucmVqZWN0KGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5jb21tYW5kUXVldWUuc2hpZnQoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0NvbW1hbmRRdWV1ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNNYW51YWxseUNsb3NlZEJ5VXNlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNDbG9zZWQgJiYgIXRoaXMuX2lzQ29ubmVjdGVkO1xuICB9XG5cbiAgI2VuYWJsZUhlYWx0aENoZWNrSWZOZWVkZWQoKSB7XG4gICAgY29uc3QgeyBoZWFsdGhDaGVja0ludGVydmFsIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKGhlYWx0aENoZWNrSW50ZXJ2YWwgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBpbmcgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc01hbnVhbGx5Q2xvc2VkQnlVc2VyKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLnNlbmRDb21tYW5kKFwiUElOR1wiKTtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIFRPRE86IG5vdGlmeSB0aGUgdXNlciBvZiBhbiBlcnJvclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0VGltZW91dChwaW5nLCBoZWFsdGhDaGVja0ludGVydmFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2V0VGltZW91dChwaW5nLCBoZWFsdGhDaGVja0ludGVydmFsKTtcbiAgfVxufVxuXG5jbGFzcyBBdXRoZW50aWNhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige31cblxuZnVuY3Rpb24gcGFyc2VQb3J0TGlrZShwb3J0OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBsZXQgcGFyc2VkUG9ydDogbnVtYmVyO1xuICBpZiAodHlwZW9mIHBvcnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBwYXJzZWRQb3J0ID0gcGFyc2VJbnQocG9ydCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBvcnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBwYXJzZWRQb3J0ID0gcG9ydDtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZWRQb3J0ID0gNjM3OTtcbiAgfVxuICBpZiAoIU51bWJlci5pc1NhZmVJbnRlZ2VyKHBhcnNlZFBvcnQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUG9ydCBpcyBpbnZhbGlkXCIpO1xuICB9XG4gIHJldHVybiBwYXJzZWRQb3J0O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFNBQVMsa0JBQWtCLFFBQVEsZUFBZTtBQUNsRCxTQUFTLGVBQWUsRUFBRSxnQkFBZ0IsUUFBUSxjQUFjO0FBQ2hFLFNBQ0UsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbEIscUJBQXFCLFFBQ2hCLHdCQUF3QjtBQUMvQixTQUFTLFlBQVksbUJBQW1CLFFBQVEsaUNBQWlDO0FBR2pGLFNBQVMsS0FBSyxRQUFRLDhDQUE4QztBQW1FcEUsT0FBTyxNQUFNLGtCQUFxQyxFQUFFLENBQUM7QUFRckQsT0FBTyxNQUFNO0lBQ1gsS0FBMkI7SUFDbkIsY0FBbUI7SUFFVixTQUFpQjtJQUNqQixLQUFzQjtJQUMvQixVQUFrQjtJQUNsQixhQUFxQjtJQUNyQixRQUFpQjtJQUVqQixhQUFvQztJQUM1QyxDQUFDLElBQUksQ0FBYTtJQUNsQixDQUFDLFFBQVEsQ0FBWTtJQUVyQixJQUFJLFdBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFNBQVM7SUFDdkI7SUFFQSxJQUFJLGNBQXVCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVk7SUFDMUI7SUFFQSxJQUFJLGNBQXVCO1FBQ3pCLE9B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