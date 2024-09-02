import { serve } from "./deps.js";
import { cacheMethodCalls } from "./util/cacheUtil.js";
import * as qaController from "./controllers/qaController.js";

const cachedQaController = cacheMethodCalls(qaController, ["postQuestion", "upvoteQuestion", "postAnswer", "upvoteAnswer"]);

const sockets = new Set();

const sendSocketMessage = async (message) => {
  console.log("message in socket:");
  console.log(JSON.stringify(message));

  sockets.forEach((socket) => {
    socket.send(JSON.stringify(message));
  });
};

const handleOpenSocket = async (request, mappingResult) => {
  console.log("Opening connection");

  const { socket, response } = Deno.upgradeWebSocket(request);
  sockets.add(socket);

  socket.onclose = () => {
    sockets.delete(socket);
  };
  return response;
};

const handleRoot = async (request, mappingResult) => {
  return new Response(JSON.stringify("ROOT"));
};

const handleGetCourses = async (request, mappingResult) => {
  const result = await cachedQaController.getCourses(request, mappingResult);
  return new Response(JSON.stringify(result));
};

const handleGetCourse = async (request, mappingResult) => {
  const result = await cachedQaController.getCourse(request, mappingResult);
  return new Response(JSON.stringify(result));
};


const handleGetQuestions = async (request, mappingResult) => {
  const result = await cachedQaController.getQuestions(request, mappingResult);
  return new Response(JSON.stringify(result));
};

const handleGetQuestion = async (request, mappingResult) => {
  const result = await cachedQaController.getQuestion(request, mappingResult);
  return new Response(JSON.stringify(result));
};

const handlePostQuestion = async (request, mappingResult) => {
  const new_question = await cachedQaController.postQuestion(request, mappingResult, sockets);
  if (new_question !== "wait") {
    await sendSocketMessage(new_question);
  }
  return new Response(JSON.stringify(new_question));
};

const handleUpvoteQuestion = async (request, mappingResult) => {
  const result = await cachedQaController.upvoteQuestion(request, mappingResult);
  return new Response(JSON.stringify(result));
};


const handleGetAnswers = async (request, mappingResult) => {
  console.log("result");
  const result = await cachedQaController.getAnswers(request, mappingResult);
  return new Response(JSON.stringify(result));
};

const handlePostAnswer = async (request, mappingResult) => {
  const new_answer = await cachedQaController.postAnswer(request, mappingResult);
  if (new_answer !== "wait") {
    await sendSocketMessage(new_answer);
  }
  return new Response(JSON.stringify(new_answer));
};

const handleUpvoteAnswer = async (request, mappingResult) => {
  const result = await cachedQaController.upvoteAnswer(request, mappingResult);
  return new Response(JSON.stringify(result));
};


const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleRoot,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses/:id" }),
    fn: handleGetCourse,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses" }),
    fn: handleGetCourses,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/questions/:id" }),
    fn: handleGetQuestions,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/question/:id" }),
    fn: handleGetQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/questions" }),
    fn: handlePostQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/question" }),
    fn: handleUpvoteQuestion,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/answers/:id" }),
    fn: handleGetAnswers,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/answers" }),
    fn: handlePostAnswer,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/answer" }),
    fn: handleUpvoteAnswer,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/ws" }),
    fn: handleOpenSocket,
  }
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );
  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    return new Response(e.stack, { status: 500 });
  }
};


const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
