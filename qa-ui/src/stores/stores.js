import { readable, writable } from 'svelte/store';

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}

export const userUuid = readable(user);

let initial_courses = [];
let initial_questions = [];
let initial_answers = [];

export let courses = writable(initial_courses);
export let questions = writable(initial_questions);
export let answers = writable(initial_answers);

const coursesStore = () => {
  return {
    set: (value) => {
      courses.set(value);
    },
    purge: () => {
      courses.set([]);
    }
  }
}

const questionsStore = () => {
  return {
    set: (value) => {
      questions.set(value);
    },
    add: (value) => {
      questions.update(currentQuestions => {
        const newQuestions = [value, ...currentQuestions];
        return newQuestions;
      });
    },
    upvote: (id) => {
      questions.update(currentQuestions => {

        const newQuestions = currentQuestions.map(question => ({ ...question }));

        newQuestions.forEach(question => {
          if (question.id === id) {
            question.upvotes += 1;
          }
        });
        return newQuestions;
      });
    },
    sort: () => {
      questions.update(currentQuestions => {
        const newQuestions = currentQuestions.map(question => ({ ...question }));
        newQuestions.sort(function (x, y) {
          return new Date(y.upvote_time) - new Date(x.upvote_time);
        })
        return newQuestions;
      })
    },
    purge: () => {
      questions.set([]);
    }
  }
}

const answersStore = () => {
  return {
    set: (value) => {
      answers.set(value);
    },
    add: (value) => {
      answers.update(currentAnswers => {
        const newAnswers = [value, ...currentAnswers];
        return newAnswers;
      });
    },
    upvote: (id) => {
      answers.update(currentAnswers => {

        const newAnswers = currentAnswers.map(answer => ({ ...answer }));

        newAnswers.forEach(answer => {
          if (answer.id === id) {
            answer.upvotes += 1;
          }
        });
        return newAnswers;
      });
    },
    sort: () => {
      answers.update(currentAnswers => {
        const newAnswers = currentAnswers.map(answer => ({ ...answer }));
        newAnswers.sort(function (x, y) {
          return new Date(y.upvote_time) - new Date(x.upvote_time);
        })
        return newAnswers;
      })
    },
    purge: () => {
      answers.set([]);
    }
  }
}

export { coursesStore, questionsStore, answersStore }