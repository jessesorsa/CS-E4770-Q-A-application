<script>
    import * as answerService from "../services/answerService.js";
    export let answer;

    const upvoteAnswer = async (answer) => {
        await answerService.upvoteAnswer(answer);
    };
</script>

<div
    class="card card-compact my-1 flex overflow-x-auto justify-center bg-base-100 w-full shadow-sm hover:shadow-lg"
>
    <div class="card-body">
        <div class="flex flex-row items-center justify-between">
            <div class="flex items-center mr-8">
                <button
                    class="btn btn-ghost btn-sm btn-circle"
                    on:click={upvoteAnswer(answer)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="M18 15l-6-6-6 6" /></svg
                    >
                </button>
                <h1>{answer.upvotes}</h1>
            </div>
            <h1 class="text-left flex-1">{answer.answer}</h1>
        </div>
        <div class="flex-1 text-right">
            <p class="whitespace-nowrap text-xs">{answer.post_time}r</p>
        </div>
    </div>
</div>
