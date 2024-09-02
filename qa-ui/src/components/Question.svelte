<script>
    import * as questionService from "../services/questionService.js";
    import { userUuid } from "../stores/stores.js";

    export let question;

    const upvoteQuestion = async (question) => {
        await questionService.upvoteQuestion(question, $userUuid);
    };
</script>

<div
    data-testid="question"
    class="card card-compact mb-2 flex overflow-x-auto justify-center bg-base-100 w-full shadow-sm hover:shadow-lg"
>
    <div class="card-body">
        <div class="flex flex-row items-center justify-between">
            <div class="flex items-center mr-4">
                <button
                    data-testid="like-button"
                    class="btn btn-ghost btn-sm btn-square mr-2"
                    on:click={upvoteQuestion(question)}
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
                <h1 data-testid="upvotes">{question.upvotes}</h1>
            </div>
            <a href={`answers/${question.id}`} class="text-left flex-1">
                {question.question}
            </a>
        </div>
        <div class="flex-1 text-right">
            <p class="whitespace-nowrap text-xs">{question.post_time}</p>
        </div>
    </div>
</div>
