import { sql } from "../database/database.js";

const fetchAllCourses = async () => {
    return await sql`SELECT * FROM courses;`;
};

const fetchCourse = async (id) => {
    return await sql`SELECT * FROM courses WHERE id = ${id};`;
};

export { fetchAllCourses, fetchCourse };