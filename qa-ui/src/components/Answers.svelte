<script>
    import { onMount } from "svelte";
    import { answers, answersStore, userUuid } from "../stores/stores.js";
    const answerStore = answersStore();
    import Answer from "./Answer.svelte";

    import * as answerService from "../services/answerService.js";
    import * as questionService from "../services/questionService.js";

    export let id;

    let loading = true;
    let question = "";
    let text = "";
    let showAlert = false;
    let ws;
    let offset;
    const alertDuration = 3000;

    const sendAnswer = async (question) => {
        const result = await answerService.sendAnswer(
            question,
            $userUuid,
            text,
        );
        text = "";
        console.log(result);
        if (result === "wait") {
            showAlert = true;
            setTimeout(() => {
                showAlert = false;
            }, alertDuration);
        }
    };

    onMount(async () => {
        const result = await questionService.getQuestion(id);
        question = result[0];
        offset = 0;
        await answerService.getAnswers(id, offset);
        loading = false;

        const host = window.location.hostname;
        ws = new WebSocket(`ws://${host}:7800/qa-api/ws`);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log(entry);
                    loadMore();
                }
            });
        });

        observer.observe(document.getElementById("list-end"));

        ws.onmessage = (event) => {
            const event_data = JSON.parse(event.data);
            if (event_data.answer && event_data.question_id === question.id) {
                answerStore.add_answer(event_data);
                answerStore.sort();
            }
        };

        ws.onerror = (event) => {
            console.log(event);
        };

        return () => {
            if (ws.readyState === 1) {
                ws.close();
            }
        };
    });

    const loadMore = async () => {
        offset += 20;
        await answerService.getAnswers(id, offset);
    };
</script>

{#if showAlert}
    <div
        data-testid="submission-limit-alert"
        class="toast toast-top toast-center"
    >
        <div class="alert">
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
                ><circle cx="12" cy="12" r="10"></circle><line
                    x1="12"
                    y1="16"
                    x2="12"
                    y2="12"
                ></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg
            >
            <span>Only one post per minute.</span>
        </div>
    </div>
{/if}

<div class="card flex mx-20 my-5 justify-center bg-base-200">
    <div class="card-body">
        {#if loading === true}
            <p>Loading...</p>
        {:else}
            <h2 class="card-title">{question.question}</h2>
        {/if}
        <label
            class="input flex rounded-full w-full mt-10 items-center justify-end"
        >
            <input
                type="text"
                class="grow"
                placeholder="Answer..."
                bind:value={text}
            />
            <div class="flex justify-end">
                <button
                    data-testid="send-answer"
                    class="btn btn-circle btn-sm bg-base-200"
                    on:click={sendAnswer(question)}
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
            </div>
        </label>
    </div>
</div>
<div class="card flex mx-20 my-5 bg-base-200 py-8 px-8">
    <div class="flex justify-center flex-col">
        <h2 class="mb-5">Previous answers</h2>
        {#if loading === true}
            <p>Loading...</p>
        {:else}
            {#each $answers as answer}
                <Answer {answer} />
            {/each}
        {/if}
        <div id="list-end"></div>
    </div>
</div>
