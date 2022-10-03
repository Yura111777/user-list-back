import "./App.css";
import "./App.scss";
import UserListItem from "./components/UserListItem";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(true);
  const [lastId, setlastId] = useState("");
  const [fileName, setfileName] = useState("");
  const [inputs, setInputs] = useState({});
  const REACT_APP_PROD_API_URL='https://633a90a70f3c381c4e5afb9e--bejewelled-macaron-62e8d9.netlify.app/users'
  const REACT_APP_DEV_API_URL="http://localhost:8080/users"
  const apiUrl = process.env.NODE_ENV === 'production' ? REACT_APP_PROD_API_URL : REACT_APP_DEV_API_URL;

  console.log(process.env.NODE_ENV)

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if(name === 'photo'){
        value = event.target.files[0]
        console.log(value)
        setfileName(value.name)
    }
    setInputs((values) => ({ ...values, [name]: value }));
  };
  useEffect(() => {
    try {
      axios( apiUrl, { method: "GET" }).then((res) => {
        setUsers(res.data);
        setlastId(res.data[res.data.length-1].id);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const showMore = async () => {
    const data = await axios(apiUrl, {
      method: "GET",
      params: {
        id: lastId,
      },
    });

    setUsers((prev) => [...prev, ...data.data]);
    setlastId(data.data[data.data.length - 1].id);
    if (data.data.length < 6) {
      setActive(false);
    }
    console.log(data);
  };
  const createUser = async (e) => {
    e.preventDefault();
    console.log(inputs);
    const data = new FormData();
    for ( var key in inputs ) {
      data.append(key, inputs[key]);
  }
    const res = await axios(apiUrl, {
      method: "POST",
      data,
    });
    console.log(res)
  };
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={createUser}>
          <input
            type="text"
            onChange={handleChange}
            name="name"
            placeholder="Name"
          />
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            onChange={handleChange}
            type="position"
            name="position"
            placeholder="Job title"
          />
          <input onChange={handleChange} type="file" name="photo" id="file" />
          <label htmlFor="file">Load image  <span>{fileName}</span></label>
          <button type="submit">Submit</button>
        </form>
        <ul>
          {users.map((el) => (
            <UserListItem
              key={el.id}
              img={el.img}
              name={el.name}
              email={el.email}
              positions={el.positions?.position}
            />
          ))}
          {active && (
            <li>
              <button onClick={showMore}>Show more</button>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;
