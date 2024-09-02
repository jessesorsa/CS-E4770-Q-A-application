import { isRetriableError } from "./errors.ts";
import { decoder } from "./internal/encoding.ts";
import { kUnstableReadReply, kUnstableWriteCommand } from "./internal/symbols.ts";
class RedisSubscriptionImpl {
    get isConnected() {
        return this.executor.connection.isConnected;
    }
    get isClosed() {
        return this.executor.connection.isClosed;
    }
    channels;
    patterns;
    constructor(executor){
        this.executor = executor;
        this.channels = Object.create(null);
        this.patterns = Object.create(null);
    }
    async psubscribe(...patterns) {
        await this.#writeCommand("PSUBSCRIBE", patterns);
        for (const pat of patterns){
            this.patterns[pat] = true;
        }
    }
    async punsubscribe(...patterns) {
        await this.#writeCommand("PUNSUBSCRIBE", patterns);
        for (const pat of patterns){
            delete this.patterns[pat];
        }
    }
    async subscribe(...channels) {
        await this.#writeCommand("SUBSCRIBE", channels);
        for (const chan of channels){
            this.channels[chan] = true;
        }
    }
    async unsubscribe(...channels) {
        await this.#writeCommand("UNSUBSCRIBE", channels);
        for (const chan of channels){
            delete this.channels[chan];
        }
    }
    receive() {
        return this.#receive(false);
    }
    receiveBuffers() {
        return this.#receive(true);
    }
    async *#receive(binaryMode) {
        let forceReconnect = false;
        const connection = this.executor.connection;
        while(this.isConnected){
            try {
                let rep;
                try {
                    rep = await connection[kUnstableReadReply](binaryMode);
                } catch (err) {
                    if (this.isClosed) {
                        break;
                    }
                    throw err; // Connection may have been unintentionally closed.
                }
                const event = rep[0] instanceof Uint8Array ? decoder.decode(rep[0]) : rep[0];
                if (event === "message" && rep.length === 3) {
                    const channel = rep[1] instanceof Uint8Array ? decoder.decode(rep[1]) : rep[1];
                    const message = rep[2];
                    yield {
                        channel,
                        message
                    };
                } else if (event === "pmessage" && rep.length === 4) {
                    const pattern = rep[1] instanceof Uint8Array ? decoder.decode(rep[1]) : rep[1];
                    const channel = rep[2] instanceof Uint8Array ? decoder.decode(rep[2]) : rep[2];
                    const message = rep[3];
                    yield {
                        pattern,
                        channel,
                        message
                    };
                }
            } catch (error) {
                if (isRetriableError(error)) {
                    forceReconnect = true;
                } else throw error;
            } finally{
                if (!this.isClosed && !this.isConnected || forceReconnect) {
                    forceReconnect = false;
                    await connection.reconnect();
                    if (Object.keys(this.channels).length > 0) {
                        await this.subscribe(...Object.keys(this.channels));
                    }
                    if (Object.keys(this.patterns).length > 0) {
                        await this.psubscribe(...Object.keys(this.patterns));
                    }
                }
            }
        }
    }
    close() {
        this.executor.connection.close();
    }
    async #writeCommand(command, args) {
        await this.executor.connection[kUnstableWriteCommand]({
            command,
            args
        });
    }
    executor;
}
export async function subscribe(executor, ...channels) {
    const sub = new RedisSubscriptionImpl(executor);
    await sub.subscribe(...channels);
    return sub;
}
export async function psubscribe(executor, ...patterns) {
    const sub = new RedisSubscriptionImpl(executor);
    await sub.psubscribe(...patterns);
    return sub;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvcmVkaXNAdjAuMzIuNC9wdWJzdWIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDb21tYW5kRXhlY3V0b3IgfSBmcm9tIFwiLi9leGVjdXRvci50c1wiO1xuaW1wb3J0IHsgaXNSZXRyaWFibGVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy50c1wiO1xuaW1wb3J0IHR5cGUgeyBCaW5hcnkgfSBmcm9tIFwiLi9wcm90b2NvbC9zaGFyZWQvdHlwZXMudHNcIjtcbmltcG9ydCB7IGRlY29kZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9lbmNvZGluZy50c1wiO1xuaW1wb3J0IHtcbiAga1Vuc3RhYmxlUmVhZFJlcGx5LFxuICBrVW5zdGFibGVXcml0ZUNvbW1hbmQsXG59IGZyb20gXCIuL2ludGVybmFsL3N5bWJvbHMudHNcIjtcblxudHlwZSBEZWZhdWx0TWVzc2FnZVR5cGUgPSBzdHJpbmc7XG50eXBlIFZhbGlkTWVzc2FnZVR5cGUgPSBzdHJpbmcgfCBzdHJpbmdbXTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWRpc1N1YnNjcmlwdGlvbjxcbiAgVE1lc3NhZ2UgZXh0ZW5kcyBWYWxpZE1lc3NhZ2VUeXBlID0gRGVmYXVsdE1lc3NhZ2VUeXBlLFxuPiB7XG4gIHJlYWRvbmx5IGlzQ2xvc2VkOiBib29sZWFuO1xuICByZWNlaXZlKCk6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxSZWRpc1B1YlN1Yk1lc3NhZ2U8VE1lc3NhZ2U+PjtcbiAgcmVjZWl2ZUJ1ZmZlcnMoKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFJlZGlzUHViU3ViTWVzc2FnZTxCaW5hcnk+PjtcbiAgcHN1YnNjcmliZSguLi5wYXR0ZXJuczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+O1xuICBzdWJzY3JpYmUoLi4uY2hhbm5lbHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPjtcbiAgcHVuc3Vic2NyaWJlKC4uLnBhdHRlcm5zOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD47XG4gIHVuc3Vic2NyaWJlKC4uLmNoYW5uZWxzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD47XG4gIGNsb3NlKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkaXNQdWJTdWJNZXNzYWdlPFRNZXNzYWdlID0gRGVmYXVsdE1lc3NhZ2VUeXBlPiB7XG4gIHBhdHRlcm4/OiBzdHJpbmc7XG4gIGNoYW5uZWw6IHN0cmluZztcbiAgbWVzc2FnZTogVE1lc3NhZ2U7XG59XG5cbmNsYXNzIFJlZGlzU3Vic2NyaXB0aW9uSW1wbDxcbiAgVE1lc3NhZ2UgZXh0ZW5kcyBWYWxpZE1lc3NhZ2VUeXBlID0gRGVmYXVsdE1lc3NhZ2VUeXBlLFxuPiBpbXBsZW1lbnRzIFJlZGlzU3Vic2NyaXB0aW9uPFRNZXNzYWdlPiB7XG4gIGdldCBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRvci5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgZ2V0IGlzQ2xvc2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dG9yLmNvbm5lY3Rpb24uaXNDbG9zZWQ7XG4gIH1cblxuICBwcml2YXRlIGNoYW5uZWxzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcHJpdmF0ZSBwYXR0ZXJucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBleGVjdXRvcjogQ29tbWFuZEV4ZWN1dG9yKSB7fVxuXG4gIGFzeW5jIHBzdWJzY3JpYmUoLi4ucGF0dGVybnM6IHN0cmluZ1tdKSB7XG4gICAgYXdhaXQgdGhpcy4jd3JpdGVDb21tYW5kKFwiUFNVQlNDUklCRVwiLCBwYXR0ZXJucyk7XG4gICAgZm9yIChjb25zdCBwYXQgb2YgcGF0dGVybnMpIHtcbiAgICAgIHRoaXMucGF0dGVybnNbcGF0XSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHVuc3Vic2NyaWJlKC4uLnBhdHRlcm5zOiBzdHJpbmdbXSkge1xuICAgIGF3YWl0IHRoaXMuI3dyaXRlQ29tbWFuZChcIlBVTlNVQlNDUklCRVwiLCBwYXR0ZXJucyk7XG4gICAgZm9yIChjb25zdCBwYXQgb2YgcGF0dGVybnMpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnBhdHRlcm5zW3BhdF07XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3Vic2NyaWJlKC4uLmNoYW5uZWxzOiBzdHJpbmdbXSkge1xuICAgIGF3YWl0IHRoaXMuI3dyaXRlQ29tbWFuZChcIlNVQlNDUklCRVwiLCBjaGFubmVscyk7XG4gICAgZm9yIChjb25zdCBjaGFuIG9mIGNoYW5uZWxzKSB7XG4gICAgICB0aGlzLmNoYW5uZWxzW2NoYW5dID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB1bnN1YnNjcmliZSguLi5jaGFubmVsczogc3RyaW5nW10pIHtcbiAgICBhd2FpdCB0aGlzLiN3cml0ZUNvbW1hbmQoXCJVTlNVQlNDUklCRVwiLCBjaGFubmVscyk7XG4gICAgZm9yIChjb25zdCBjaGFuIG9mIGNoYW5uZWxzKSB7XG4gICAgICBkZWxldGUgdGhpcy5jaGFubmVsc1tjaGFuXTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlKCk6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxSZWRpc1B1YlN1Yk1lc3NhZ2U8VE1lc3NhZ2U+PiB7XG4gICAgcmV0dXJuIHRoaXMuI3JlY2VpdmUoZmFsc2UpO1xuICB9XG5cbiAgcmVjZWl2ZUJ1ZmZlcnMoKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFJlZGlzUHViU3ViTWVzc2FnZTxCaW5hcnk+PiB7XG4gICAgcmV0dXJuIHRoaXMuI3JlY2VpdmUodHJ1ZSk7XG4gIH1cblxuICBhc3luYyAqI3JlY2VpdmU8XG4gICAgVCA9IFRNZXNzYWdlLFxuICA+KFxuICAgIGJpbmFyeU1vZGU6IGJvb2xlYW4sXG4gICk6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxcbiAgICBSZWRpc1B1YlN1Yk1lc3NhZ2U8VD5cbiAgPiB7XG4gICAgbGV0IGZvcmNlUmVjb25uZWN0ID0gZmFsc2U7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuZXhlY3V0b3IuY29ubmVjdGlvbjtcbiAgICB3aGlsZSAodGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlcDogW3N0cmluZyB8IEJpbmFyeSwgc3RyaW5nIHwgQmluYXJ5LCBUXSB8IFtcbiAgICAgICAgICBzdHJpbmcgfCBCaW5hcnksXG4gICAgICAgICAgc3RyaW5nIHwgQmluYXJ5LFxuICAgICAgICAgIHN0cmluZyB8IEJpbmFyeSxcbiAgICAgICAgICBULFxuICAgICAgICBdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlcCA9IGF3YWl0IGNvbm5lY3Rpb25ba1Vuc3RhYmxlUmVhZFJlcGx5XShiaW5hcnlNb2RlKSBhcyB0eXBlb2YgcmVwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0Nsb3NlZCkge1xuICAgICAgICAgICAgLy8gQ29ubmVjdGlvbiBhbHJlYWR5IGNsb3NlZCBieSB0aGUgdXNlci5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlcnI7IC8vIENvbm5lY3Rpb24gbWF5IGhhdmUgYmVlbiB1bmludGVudGlvbmFsbHkgY2xvc2VkLlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnQgPSByZXBbMF0gaW5zdGFuY2VvZiBVaW50OEFycmF5XG4gICAgICAgICAgPyBkZWNvZGVyLmRlY29kZShyZXBbMF0pXG4gICAgICAgICAgOiByZXBbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50ID09PSBcIm1lc3NhZ2VcIiAmJiByZXAubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgY29uc3QgY2hhbm5lbCA9IHJlcFsxXSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXlcbiAgICAgICAgICAgID8gZGVjb2Rlci5kZWNvZGUocmVwWzFdKVxuICAgICAgICAgICAgOiByZXBbMV07XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlcFsyXTtcbiAgICAgICAgICB5aWVsZCB7XG4gICAgICAgICAgICBjaGFubmVsLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcInBtZXNzYWdlXCIgJiYgcmVwLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSByZXBbMV0gaW5zdGFuY2VvZiBVaW50OEFycmF5XG4gICAgICAgICAgICA/IGRlY29kZXIuZGVjb2RlKHJlcFsxXSlcbiAgICAgICAgICAgIDogcmVwWzFdO1xuICAgICAgICAgIGNvbnN0IGNoYW5uZWwgPSByZXBbMl0gaW5zdGFuY2VvZiBVaW50OEFycmF5XG4gICAgICAgICAgICA/IGRlY29kZXIuZGVjb2RlKHJlcFsyXSlcbiAgICAgICAgICAgIDogcmVwWzJdO1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXBbM107XG4gICAgICAgICAgeWllbGQge1xuICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgIGNoYW5uZWwsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChpc1JldHJpYWJsZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgIGZvcmNlUmVjb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHRocm93IGVycm9yO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKCghdGhpcy5pc0Nsb3NlZCAmJiAhdGhpcy5pc0Nvbm5lY3RlZCkgfHwgZm9yY2VSZWNvbm5lY3QpIHtcbiAgICAgICAgICBmb3JjZVJlY29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgIGF3YWl0IGNvbm5lY3Rpb24ucmVjb25uZWN0KCk7XG5cbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5jaGFubmVscykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zdWJzY3JpYmUoLi4uT2JqZWN0LmtleXModGhpcy5jaGFubmVscykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5wYXR0ZXJucykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wc3Vic2NyaWJlKC4uLk9iamVjdC5rZXlzKHRoaXMucGF0dGVybnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmV4ZWN1dG9yLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgfVxuXG4gIGFzeW5jICN3cml0ZUNvbW1hbmQoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBBcnJheTxzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5leGVjdXRvci5jb25uZWN0aW9uW2tVbnN0YWJsZVdyaXRlQ29tbWFuZF0oeyBjb21tYW5kLCBhcmdzIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJzY3JpYmU8XG4gIFRNZXNzYWdlIGV4dGVuZHMgVmFsaWRNZXNzYWdlVHlwZSA9IERlZmF1bHRNZXNzYWdlVHlwZSxcbj4oXG4gIGV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3IsXG4gIC4uLmNoYW5uZWxzOiBzdHJpbmdbXVxuKTogUHJvbWlzZTxSZWRpc1N1YnNjcmlwdGlvbjxUTWVzc2FnZT4+IHtcbiAgY29uc3Qgc3ViID0gbmV3IFJlZGlzU3Vic2NyaXB0aW9uSW1wbDxUTWVzc2FnZT4oZXhlY3V0b3IpO1xuICBhd2FpdCBzdWIuc3Vic2NyaWJlKC4uLmNoYW5uZWxzKTtcbiAgcmV0dXJuIHN1Yjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBzdWJzY3JpYmU8XG4gIFRNZXNzYWdlIGV4dGVuZHMgVmFsaWRNZXNzYWdlVHlwZSA9IERlZmF1bHRNZXNzYWdlVHlwZSxcbj4oXG4gIGV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3IsXG4gIC4uLnBhdHRlcm5zOiBzdHJpbmdbXVxuKTogUHJvbWlzZTxSZWRpc1N1YnNjcmlwdGlvbjxUTWVzc2FnZT4+IHtcbiAgY29uc3Qgc3ViID0gbmV3IFJlZGlzU3Vic2NyaXB0aW9uSW1wbDxUTWVzc2FnZT4oZXhlY3V0b3IpO1xuICBhd2FpdCBzdWIucHN1YnNjcmliZSguLi5wYXR0ZXJucyk7XG4gIHJldHVybiBzdWI7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsU0FBUyxnQkFBZ0IsUUFBUSxjQUFjO0FBRS9DLFNBQVMsT0FBTyxRQUFRLHlCQUF5QjtBQUNqRCxTQUNFLGtCQUFrQixFQUNsQixxQkFBcUIsUUFDaEIsd0JBQXdCO0FBd0IvQixNQUFNO0lBR0osSUFBSSxjQUF1QjtRQUN6QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVc7SUFDN0M7SUFFQSxJQUFJLFdBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUTtJQUMxQztJQUVRLFNBQStCO0lBQy9CLFNBQStCO0lBRXZDLFlBQW9CLFNBQTJCO3dCQUEzQjthQUhaLFdBQVcsT0FBTyxNQUFNLENBQUMsSUFBSTthQUM3QixXQUFXLE9BQU8sTUFBTSxDQUFDLElBQUk7SUFFVztJQUVoRCxNQUFNLFdBQVcsR0FBRyxRQUFrQixFQUFFO1FBQ3RDLE1BQU0sSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWM7UUFDdkMsS0FBSyxNQUFNLE9BQU8sU0FBVTtZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJO1FBQzNCO0lBQ0Y7SUFFQSxNQUFNLGFBQWEsR0FBRyxRQUFrQixFQUFFO1FBQ3hDLE1BQU0sSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFnQjtRQUN6QyxLQUFLLE1BQU0sT0FBTyxTQUFVO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1FBQzNCO0lBQ0Y7SUFF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