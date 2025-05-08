import "./App.css";
import { User } from "./user.js";
import { useEffect, useState, createContext } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./pages/home";
import { Profile } from "./skill surf/profile.js";
import { SkillSurf } from "./skillsurf.js";
import { Signup } from "./skill surf/signup.js";
import { Signin } from "./skill surf/signin.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchResults } from "./skill surf/search.js";
export const AppContext = createContext();

function App() {
  const client = new QueryClient();
  const users = [
    { name: "pedro ", age: 157 },
    { name: "joe ", age: 162 },
    { name: "raph ", age: 3 },
    { name: "mema ", age: 5 },
  ];
  let [green, setGreen] = useState("green");
  let [count, setCount] = useState(0);
  let [todoList, setTodolist] = useState([]);
  let [newTask, setNewTask] = useState("");
  let [name, setName] = useState("");
  let [predictedAge, setPredictedAge] = useState(null);
  let [excuse1, setExcuse] = useState("");
  let [username, setUsername] = useState("joe");

  const addTask = () => {
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask,
      completed: false,
    };
    setTodolist([...todoList, task]);
  };
  const handleChange = (event) => {
    setNewTask(event.target.value);
  };
  const deleteTask = (id) => {
    setTodolist(todoList.filter((task) => task.id !== id));
  };
  const completeTask = (id) => {
    setTodolist(
      todoList.map((task) => {
        return task.id === id ? { ...task, completed: true } : task;
      })
    );
  };
  const fetchData = () => {
    Axios.get(`https://api.agify.io/?name=${name}`).then((res) => {
      setPredictedAge(res.data);
    });
  };
  return (
    <AppContext.Provider value={{ green, setGreen, username, setUsername }}>
      <Router>
        <div className="App">
          <QueryClientProvider client={client}>
            <Routes>
              <Route path="/" element={<SkillSurf></SkillSurf>} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/hello world"
                element={
                  <div>
                    <div className="header">
                      <h1 id="name" style={{ color: green }}>
                        Skill Surf
                      </h1>
                      <div className="excuse">
                        <h1>generate an excuse</h1>
                        <button
                          onClick={() => {
                            setExcuse(
                              Axios.get(
                                `https://excuser-three.vercel.app/v1/excuse/office`
                              ).then((res) => {
                                setExcuse(res.data[0].excuse);
                              })
                            );
                          }}
                        >
                          office
                        </button>
                        <button
                          onClick={() => {
                            Axios.get(
                              `https://excuser-three.vercel.app/v1/excuse/family`
                            ).then((res) => {
                              setExcuse(res.data[0].excuse);
                            });
                          }}
                        >
                          family
                        </button>
                        <button
                          onClick={() => {
                            setExcuse(
                              Axios.get(
                                `https://excuser-three.vercel.app/v1/excuse/party`
                              ).then((res) => {
                                setExcuse(res.data[0].excuse);
                              })
                            );
                          }}
                        >
                          party
                        </button>
                      </div>

                      <button
                        className="butt1"
                        onClick={() => {
                          setGreen(green === "green" ? "red" : "green");
                        }}
                      >
                        {green}
                      </button>
                      <div className="math">
                        <button
                          onClick={() => {
                            setCount(count + 1);
                          }}
                        >
                          increase
                        </button>
                        <button
                          onClick={() => {
                            setCount(count - 1);
                          }}
                        >
                          decrease
                        </button>
                        <button
                          onClick={() => {
                            setCount(0);
                          }}
                        >
                          reset
                        </button>
                      </div>
                      <div className="task">
                        <input onChange={handleChange}></input>
                        <button onClick={addTask}>add tasks</button>
                      </div>
                      <div className="cats">
                        <input
                          onChange={(event) => {
                            setName(event.target.value);
                          }}
                        />
                        <button onClick={fetchData}>predict age</button>
                      </div>
                    </div>
                    <h3>excuse:{excuse1}</h3>
                    <p className="age">name: {predictedAge?.name}</p>
                    <p className="age">predicted age: {predictedAge?.age}</p>
                    <p className="age">count: {predictedAge?.count}</p>
                    <h1 style={{ color: green }}>color</h1>
                    <h1 style={{ color: green }}>
                      <Job salary={1000} position="manager" company="amazon" />
                    </h1>
                    {users.map((user, key) =>
                      user.age >= 18 ? (
                        <h1 key="key">
                          <User name={user.name} age={user.age} />
                        </h1>
                      ) : (
                        <h1></h1>
                      )
                    )}
                    {count}
                    <div className="app2">
                      {todoList.map((task) => {
                        return (
                          <div className="list">
                            <h1
                              className="tasks"
                              style={{
                                backgroundColor:
                                  task.completed === true ? "green" : "",
                              }}
                            >
                              {task.taskName}
                            </h1>
                            <button onClick={() => completeTask(task.id)}>
                              complete
                            </button>
                            <button onClick={() => deleteTask(task.id)}>
                              {" "}
                              X
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                }
              />
            </Routes>
          </QueryClientProvider>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

const Job = (props) => {
  return (
    <div>
      <h1>{props.salary}</h1>
      <h1>{props.position}</h1>
      <h1>{props.company}</h1>
    </div>
  );
};

export default App;
