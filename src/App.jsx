import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Axios from "axios";
import Auth from "./Auth";
import Products from "./Products";


const API_URL = `http://localhost:8080`;

const App = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const btnHandler = async () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        alert("Data masuk!");
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        for (const key in err) {
          console.log(key);
        }
        console.log(err.toJSON());
      });

    // try {
    //   const response = await Axios.post(`${API_URL}/projects`, {
    //     name: text,
    //   });

    //   console.log(response);
    //   alert("Data terkirim!");
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onChangeTextHandler = (e) => {
    // setstate
    setText(e.target.value);
  };

  return (
    // <div>
    //   <h1>Hello world!</h1>
    //   <h2>{text}</h2>
    //   <input type="button" value="Click me" onClick={btnHandler} />
    //   <input
    //     type="text"
    //     placeholder="Project Name"
    //     onChange={onChangeTextHandler}
    //   />
    //   {data.map((val) => {
    //     return <p>{val.productName}</p>;
    //   })}
    // </div>
    <>
     {/* <Auth /> */}
    <Products />
    </>
  );
};

export default App;