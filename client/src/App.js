import "./App.css";
import "./App.scss";
import UserListItem from "./components/UserListItem";
import { useState, useEffect } from "react";
import axios from "axios";

import SimpleFileUpload from "react-simple-file-upload";

function App() {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(true);
  const [lastId, setlastId] = useState("");
  const [fileName, setfileName] = useState("");
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState();
  const REACT_APP_PROD_API_URL='https://userlist-back.herokuapp.com/users'
  const REACT_APP_DEV_API_URL="http://localhost:8080/users"
  const apiUrl = process.env.NODE_ENV === 'production' ? REACT_APP_PROD_API_URL : REACT_APP_DEV_API_URL;

 

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
      // eslint-disable-next-line
      axios( apiUrl, { method: "GET" }).then((res) => {
        setUsers(res.data);
        console.log(res.data)
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
    data.append('img', file)
    const res = await axios(apiUrl, {
      method: "POST",
      data,
    });
    axios( apiUrl, { method: "GET" }).then((res) => {
      setUsers(res.data);
      console.log(res.data)
      setlastId(res.data[res.data.length-1].id);
    });
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
           <SimpleFileUpload
        apiKey="584febba5229129715752516aaf76bd1"
        data-resize-width="70" data-resize-height="70"
        onSuccess={setFile}
      />
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
