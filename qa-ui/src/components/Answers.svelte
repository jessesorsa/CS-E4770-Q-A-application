<script>
    import { onMount } from "svelte";
    import { answers, answersStore, userUuid } from "../stores/stores.js";
    const answerStore = answersStore();
    import Answer from "./Answer.svelte";

    import * as answerService from "../services/answerService.js";
    import * as questionService from "../services/questionService.js";
    //import * as courseService from "../services/courseService.js";

    export let id;

    let loading = true;
    let question = "";
    let text = "";
    let ws;

    const sendAnswer = async (text, question) => {
        await answerService.sendAnswer(question, $userUuid, text);
        text = "";
    };

    onMount(async () => {
        const result = await questionService.getQuestion(id);
        question = result[0];
        await answerService.getAnswers(id);
        loading = false;

        const host = window.location.hostname;
        ws = new WebSocket(`ws://${host}:7800/qa-api/ws`);

        ws.onmessage = (event) => {
            const event_data = JSON.parse(event.data);
            answerStore.add(event_data);
            answerStore.sort();
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
</script>

<div class="card flex mx-20 my-5 justify-center bg-base-200">
    <div class="card-body">
        {#if loading === true}
            <p>Loading...</p>
        {:else}
            <!--<h2 class="card-title">{course.code}</h2>-->
            <!--<p>{course.course_name}</p>-->
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
                    class="btn btn-circle btn-sm bg-base-200"
                    on:click={sendAnswer(text, question)}
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
    </div>
</div>
