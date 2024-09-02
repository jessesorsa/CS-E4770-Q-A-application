import { kEmptyRedisArgs } from "./connection.ts";
import { okReply } from "./protocol/shared/types.ts";
import { create } from "./redis.ts";
import { kUnstablePipeline } from "./internal/symbols.ts";
export function createRedisPipeline(connection, tx = false) {
    const executor = new PipelineExecutor(connection, tx);
    function flush() {
        return executor.flush();
    }
    const client = create(executor);
    return Object.assign(client, {
        flush
    });
}
export class PipelineExecutor {
    commands;
    queue;
    constructor(connection, tx){
        this.connection = connection;
        this.tx = tx;
        this.commands = [];
        this.queue = [];
    }
    exec(command, ...args) {
        return this.sendCommand(command, args);
    }
    sendCommand(command, args, options) {
        this.commands.push({
            command,
            args: args ?? kEmptyRedisArgs,
            returnUint8Arrays: options?.returnUint8Arrays
        });
        return Promise.resolve(okReply);
    }
    close() {
        return this.connection.close();
    }
    flush() {
        if (this.tx) {
            this.commands.unshift({
                command: "MULTI",
                args: []
            });
            this.commands.push({
                command: "EXEC",
                args: []
            });
        }
        const { promise , resolve , reject  } = Promise.withResolvers();
        this.queue.push({
            commands: [
                ...this.commands
            ],
            resolve,
            reject
        });
        if (this.queue.length === 1) {
            this.dequeue();
        }
        this.commands = [];
        return promise;
    }
    dequeue() {
        const [e] = this.queue;
        if (!e) return;
        this.connection[kUnstablePipeline](e.commands).then(e.resolve).catch(e.reject).finally(()=>{
            this.queue.shift();
            this.dequeue();
        });
    }
    connection;
    tx;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvcmVkaXNAdjAuMzIuNC9waXBlbGluZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbm5lY3Rpb24sIFNlbmRDb21tYW5kT3B0aW9ucyB9IGZyb20gXCIuL2Nvbm5lY3Rpb24udHNcIjtcbmltcG9ydCB7IGtFbXB0eVJlZGlzQXJncyB9IGZyb20gXCIuL2Nvbm5lY3Rpb24udHNcIjtcbmltcG9ydCB7IENvbW1hbmRFeGVjdXRvciB9IGZyb20gXCIuL2V4ZWN1dG9yLnRzXCI7XG5pbXBvcnQge1xuICBva1JlcGx5LFxuICBSYXdPckVycm9yLFxuICBSZWRpc1JlcGx5LFxuICBSZWRpc1ZhbHVlLFxufSBmcm9tIFwiLi9wcm90b2NvbC9zaGFyZWQvdHlwZXMudHNcIjtcbmltcG9ydCB7IGNyZWF0ZSwgUmVkaXMgfSBmcm9tIFwiLi9yZWRpcy50c1wiO1xuaW1wb3J0IHsga1Vuc3RhYmxlUGlwZWxpbmUgfSBmcm9tIFwiLi9pbnRlcm5hbC9zeW1ib2xzLnRzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkaXNQaXBlbGluZSBleHRlbmRzIFJlZGlzIHtcbiAgZmx1c2goKTogUHJvbWlzZTxSYXdPckVycm9yW10+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVkaXNQaXBlbGluZShcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbixcbiAgdHggPSBmYWxzZSxcbik6IFJlZGlzUGlwZWxpbmUge1xuICBjb25zdCBleGVjdXRvciA9IG5ldyBQaXBlbGluZUV4ZWN1dG9yKGNvbm5lY3Rpb24sIHR4KTtcbiAgZnVuY3Rpb24gZmx1c2goKTogUHJvbWlzZTxSYXdPckVycm9yW10+IHtcbiAgICByZXR1cm4gZXhlY3V0b3IuZmx1c2goKTtcbiAgfVxuICBjb25zdCBjbGllbnQgPSBjcmVhdGUoZXhlY3V0b3IpO1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihjbGllbnQsIHsgZmx1c2ggfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUV4ZWN1dG9yIGltcGxlbWVudHMgQ29tbWFuZEV4ZWN1dG9yIHtcbiAgcHJpdmF0ZSBjb21tYW5kczoge1xuICAgIGNvbW1hbmQ6IHN0cmluZztcbiAgICBhcmdzOiBSZWRpc1ZhbHVlW107XG4gICAgcmV0dXJuVWludDhBcnJheXM/OiBib29sZWFuO1xuICB9W10gPSBbXTtcbiAgcHJpdmF0ZSBxdWV1ZToge1xuICAgIGNvbW1hbmRzOiB7XG4gICAgICBjb21tYW5kOiBzdHJpbmc7XG4gICAgICBhcmdzOiBSZWRpc1ZhbHVlW107XG4gICAgICByZXR1cm5VaW50OEFycmF5cz86IGJvb2xlYW47XG4gICAgfVtdO1xuICAgIHJlc29sdmU6ICh2YWx1ZTogUmF3T3JFcnJvcltdKSA9PiB2b2lkO1xuICAgIHJlamVjdDogKGVycm9yOiB1bmtub3duKSA9PiB2b2lkO1xuICB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBjb25uZWN0aW9uOiBDb25uZWN0aW9uLFxuICAgIHByaXZhdGUgdHg6IGJvb2xlYW4sXG4gICkge1xuICB9XG5cbiAgZXhlYyhcbiAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgLi4uYXJnczogUmVkaXNWYWx1ZVtdXG4gICk6IFByb21pc2U8UmVkaXNSZXBseT4ge1xuICAgIHJldHVybiB0aGlzLnNlbmRDb21tYW5kKGNvbW1hbmQsIGFyZ3MpO1xuICB9XG5cbiAgc2VuZENvbW1hbmQoXG4gICAgY29tbWFuZDogc3RyaW5nLFxuICAgIGFyZ3M/OiBSZWRpc1ZhbHVlW10sXG4gICAgb3B0aW9ucz86IFNlbmRDb21tYW5kT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxSZWRpc1JlcGx5PiB7XG4gICAgdGhpcy5jb21tYW5kcy5wdXNoKHtcbiAgICAgIGNvbW1hbmQsXG4gICAgICBhcmdzOiBhcmdzID8/IGtFbXB0eVJlZGlzQXJncyxcbiAgICAgIHJldHVyblVpbnQ4QXJyYXlzOiBvcHRpb25zPy5yZXR1cm5VaW50OEFycmF5cyxcbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9rUmVwbHkpO1xuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICB9XG5cbiAgZmx1c2goKTogUHJvbWlzZTxSYXdPckVycm9yW10+IHtcbiAgICBpZiAodGhpcy50eCkge1xuICAgICAgdGhpcy5jb21tYW5kcy51bnNoaWZ0KHsgY29tbWFuZDogXCJNVUxUSVwiLCBhcmdzOiBbXSB9KTtcbiAgICAgIHRoaXMuY29tbWFuZHMucHVzaCh7IGNvbW1hbmQ6IFwiRVhFQ1wiLCBhcmdzOiBbXSB9KTtcbiAgICB9XG4gICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlLCByZWplY3QgfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxSYXdPckVycm9yW10+KCk7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKHsgY29tbWFuZHM6IFsuLi50aGlzLmNvbW1hbmRzXSwgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5kZXF1ZXVlKCk7XG4gICAgfVxuICAgIHRoaXMuY29tbWFuZHMgPSBbXTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHByaXZhdGUgZGVxdWV1ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBbZV0gPSB0aGlzLnF1ZXVlO1xuICAgIGlmICghZSkgcmV0dXJuO1xuICAgIHRoaXMuY29ubmVjdGlvbltrVW5zdGFibGVQaXBlbGluZV0oZS5jb21tYW5kcylcbiAgICAgIC50aGVuKGUucmVzb2x2ZSlcbiAgICAgIC5jYXRjaChlLnJlamVjdClcbiAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsU0FBUyxlQUFlLFFBQVEsa0JBQWtCO0FBRWxELFNBQ0UsT0FBTyxRQUlGLDZCQUE2QjtBQUNwQyxTQUFTLE1BQU0sUUFBZSxhQUFhO0FBQzNDLFNBQVMsaUJBQWlCLFFBQVEsd0JBQXdCO0FBTTFELE9BQU8sU0FBUyxvQkFDZCxVQUFzQixFQUN0QixLQUFLLEtBQUssRUFDSztJQUNmLE1BQU0sV0FBVyxJQUFJLGlCQUFpQixZQUFZO0lBQ2xELFNBQVMsUUFBK0I7UUFDdEMsT0FBTyxTQUFTLEtBQUs7SUFDdkI7SUFDQSxNQUFNLFNBQVMsT0FBTztJQUN0QixPQUFPLE9BQU8sTUFBTSxDQUFDLFFBQVE7UUFBRTtJQUFNO0FBQ3ZDLENBQUM7QUFFRCxPQUFPLE1BQU07SUFDSCxTQUlDO0lBQ0QsTUFRQztJQUVULFlBQ1csWUFDRCxHQUNSOzBCQUZTO2tCQUNEO2FBakJGLFdBSUYsRUFBRTthQUNBLFFBUUYsRUFBRTtJQU1SO0lBRUEsS0FDRSxPQUFlLEVBQ2YsR0FBRyxJQUFrQixFQUNBO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO0lBQ25DO0lBRUEsWUFDRSxPQUFlLEVBQ2YsSUFBbUIsRUFDbkIsT0FBNEIsRUFDUDtRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUNqQjtZQUNBLE1BQU0sUUFBUTtZQUNkLG1CQUFtQixTQUFTO1FBQzlCO1FBQ0EsT0FBTyxRQUFRLE9BQU8sQ0FBQztJQUN6QjtJQUVBLFFBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSztJQUM5QjtJQUVBLFFBQStCO1FBQzdCLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFFLFNBQVM7Z0JBQVMsTUFBTSxFQUFFO1lBQUM7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsU0FBUztnQkFBUSxNQUFNLEVBQUU7WUFBQztRQUNqRCxDQUFDO1FBQ0QsTUFBTSxFQUFFLFFBQU8sRUFBRSxRQUFPLEVBQUUsT0FBTSxFQUFFLEdBQUcsUUFBUSxhQUFhO1FBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVTttQkFBSSxJQUFJLENBQUMsUUFBUTthQUFDO1lBQUU7WUFBUztRQUFPO1FBQ2hFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssR0FBRztZQUMzQixJQUFJLENBQUMsT0FBTztRQUNkLENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUU7UUFDbEIsT0FBTztJQUNUO0lBRVEsVUFBZ0I7UUFDdEIsTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSztRQUN0QixJQUFJLENBQUMsR0FBRztRQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQzFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFDZCxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQ2QsT0FBTyxDQUFDLElBQU07WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFDaEIsSUFBSSxDQUFDLE9BQU87UUFDZDtJQUNKO0lBckRXO0lBQ0Q7QUFxRFosQ0FBQyJ9