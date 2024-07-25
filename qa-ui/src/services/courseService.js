import { coursesStore } from "../stores/stores";
const courseStore = coursesStore();

const getCourses = async () => {
    const response = await fetch(`/qa-api/courses`);
    const course_list = await response.json();
    courseStore.set(course_list);
}

const getCourse = async (id) => {
    const response = await fetch(`/qa-api/courses/${id}`);
    return await response.json();
}



export { getCourses, getCourse }