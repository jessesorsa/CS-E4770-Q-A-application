<script>
    import { onMount } from "svelte";
    import { courses, coursesStore } from "../stores/stores.js";
    const courseStore = coursesStore();

    import * as courseService from "../services/courseService.js";

    import Course from "./Course.svelte";

    let loading = true;

    onMount(async () => {
        await courseService.getCourses();
        loading = false;
    });
</script>

<div class="card flex mx-20 my-5 justify-center bg-base-200">
    <div class="card-body">
        <h2 class="card-title">Welcome to QA!</h2>
        <p>Choose a course below to ask questions</p>
    </div>
</div>
<div class="card flex mx-20 my-5 bg-base-200">
    <div class="flex mx-auto justify-center flex-wrap my-5">
        {#if loading === true}
            <p>Loading...</p>
        {:else}
            {#each $courses as course}
                <Course {course} />
            {/each}
        {/if}
    </div>
</div>
