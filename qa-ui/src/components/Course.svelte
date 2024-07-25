<script>
    export let course;
</script>

<a href={`questions/${course.id}`}>
    <div
        class="card flex overflow-x-auto justify-center bg-base-100 w-72 min-h-36 m-3 shadow-sm hover:shadow-xl"
    >
        <div class="card-body">
            <h2 class="card-title">{course.code}</h2>
            <p>{course.course_name}</p>
        </div>
    </div>
</a>
