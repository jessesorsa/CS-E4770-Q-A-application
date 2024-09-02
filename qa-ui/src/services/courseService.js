import { coursesStore } from "../stores/stores";
const courseStore = coursesStore();

const qaApiTest = async () => {
    console.log("test");
    const response = await fetch(`/qa-api`);
    const res = await response.json();
    console.log(res);
}

const getCourses = async () => {
    const response = await fetch(`/qa-api/courses`);
    const course_list = await response.json();
    courseStore.set(course_list);
}

const getCourse = async (id) => {
    const response = await fetch(`/qa-api/courses/${id}`);
    return await response.json();
}



export { getCourses, getCourse, qaApiTest }