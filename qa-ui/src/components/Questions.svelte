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
    let showAlert = false;
    let ws;
    let offset;
    let y;
    let h;
    let listElement;
    const alertDuration = 3000;

    const sendQuestion = async (course) => {
        const result = await questionService.sendQuestion(
            course,
            $userUuid,
            text,
        );
        console.log(result);
        text = "";
        if (result === "wait") {
            showAlert = true;
            setTimeout(() => {
                showAlert = false;
            }, alertDuration);
        }
    };

    onMount(async () => {
        const result = await courseService.getCourse(id);
        course = result[0];
        offset = 0;
        console.log("onmount");
        await questionService.getQuestions(id, offset);
        loading = false;

        const host = window.location.hostname;
        ws = new WebSocket(`ws://${host}:7800/qa-api/ws`);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log(entry);
                        loadMore();
                    }
                });
            },
            { threshold: 1 },
        );

        observer.observe(document.getElementById("list-end"));

        ws.onmessage = (event) => {
            const event_data = JSON.parse(event.data);
            if (event_data.question && event_data.course_id === course.id) {
                questionStore.add_question(event_data);
                questionStore.sort();
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
        console.log("loading more");
        offset += 20;
        await questionService.getQuestions(id, offset);
    };
</script>

{#if showAlert}
    <div class="toast toast-top toast-center">
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
                    data-testid="send-question"
                    class="btn btn-circle btn-sm bg-base-200"
                    on:click={sendQuestion(course)}
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
            <div bind:this={listElement}>
                {#each $questions as question}
                    <Question {question} />
                {/each}
            </div>
        {/if}
        <div id="list-end"></div>
    </div>
</div>
