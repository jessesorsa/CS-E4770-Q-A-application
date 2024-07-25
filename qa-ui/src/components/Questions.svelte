<script>
    import { onMount, onDestroy } from "svelte";
    import { questions, questionsStore, userUuid } from "../stores/stores.js";
    const questionStore = questionsStore();

    import Question from "./Question.svelte";

    import * as questionService from "../services/questionService.js";
    import * as courseService from "../services/courseService.js";

    export let id;

    let loading = true;
    let course = "";
    let text = "";
    let ws;

    const sendQuestion = async (text, course) => {
        await questionService.sendQuestion(course, $userUuid, text);
        text = "";
    };

    onMount(async () => {
        const result = await courseService.getCourse(id);
        course = result[0];
        console.log("onmount");
        await questionService.getQuestions(id);
        loading = false;

        const host = window.location.hostname;
        ws = new WebSocket(`ws://${host}:7800/qa-api/ws`);

        ws.onmessage = (event) => {
            const event_data = JSON.parse(event.data);
            console.log(event_data);
            questionStore.add(event_data);
            questionStore.sort();
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
            <h2 class="card-title">{course.code}</h2>
            <p>{course.course_name}</p>
        {/if}
        <label
            class="input flex rounded-full w-full mt-10 items-center justify-end"
        >
            <input
                type="text"
                class="grow"
                placeholder="Ask a question..."
                bind:value={text}
            />
            <div class="flex justify-end">
                <button
                    class="btn btn-circle btn-sm bg-base-200"
                    on:click={sendQuestion(text, course)}
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
        {#if loading === true}
            <p>Loading...</p>
        {:else}
            {#each $questions as question}
                <Question {question} />
            {/each}
        {/if}
    </div>
</div>
