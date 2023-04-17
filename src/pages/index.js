import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import pic from "../../asset/pic.png";

export default function Home() {
    const [formLogin, setFormLogin] = useState({ email: "", password: "" });
    const [formRegister, setFormRegister] = useState({ name: "", email: "", password: "", c_password: "" });
    const [loader, setLoader] = useState(true);
    const [message, setMessage] = useState("");
    const [available, setAvailable] = useState(true);
    const [regisHidden, setRegisHidden] = useState(true);
    const [buttonDisable, setButtonDisable] = useState({ buttonLogin: true, buttonRegister: false });
    const [banner, setBanner] = useState("/pic.png");
    const [buttonActive, setButtonActive] = useState(
        {
            buttonLogin: "btn btn-primary rounded-pill mx-2",
            buttonRegister: "btn btn-outline-primary rounded-pill mx-2"
        }
    );
    const [formHidden, setFormHidden] = useState({ formLogin: false, formRegister: true });

    const router = useRouter();
    const hanndleClick = (e) => {
        if (available == true) {
            setAvailable(false);
        }
        else {
            setAvailable(true);
        }
    }

    const clickCekRegis = (e) => {
        if (regisHidden == true) {
            setRegisHidden(false);
        }
        else {
            setRegisHidden(true);
        }
    }

    const handleFormLogin = (e) => {
        setButtonDisable({ buttonLogin: true, buttonRegister: false });
        setButtonActive(
            {
                buttonLogin: "btn btn-primary rounded-pill mx-2",
                buttonRegister: "btn btn-outline-primary rounded-pill mx-2"
            }
        );
        setFormHidden({ formLogin: false, formRegister: true });
        setBanner("/pic.png");
    }

    const handleFormRegister = (e) => {
        setButtonDisable({ buttonLogin: false, buttonRegister: true });
        setButtonActive(
            {
                buttonLogin: "btn btn-outline-primary rounded-pill mx-2",
                buttonRegister: "btn btn-primary rounded-pill mx-2"
            }
        );
        setFormHidden({ formLogin: true, formRegister: false });
        setBanner("/regis.png");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormLogin({ ...formLogin, [name]: value });
    }

    const handleRegister = (e) => {
        const { name, value } = e.target;
        setFormRegister({ ...formRegister, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formLogin)
        }).then(setLoader(false));

        const data = await res.json();

        if (data != null) {
            // localStorage.setItem("token", data.success.token);
            sessionStorage.setItem("token", data.success.token);
            // localStorage.setItem("token_type", data.success.token_type);
            sessionStorage.setItem("token_type", data.success.token_type);
            sessionStorage.setItem("name", data.success.name);
            if (data.error != null) {
                setMessage(JSON.stringify(data.error));
            }
            if (data.success != null) {
                setMessage(JSON.stringify(data.success));
            }
            console.log(data);
            setLoader(true);
            router.push("/posting");
        }
        else {
            setMessage("Login gagal");
            setLoader(true);
        }

    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const res = await fetch("http://localhost:8000/api/registrasi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formRegister)
        }).then(setLoader(false));

        const data = await res.json();

        if (data != null) {

            if (data.error != null) {
                setMessage(data.error.name);
                setMessage(data.error.email);
                setMessage(data.error.password);
                setMessage(data.error.c_password);
            }
            if (data.success != null) {
                setMessage(JSON.stringify(data.success));
            }
            console.log(data);
            setLoader(true);
        }
        else {
            setMessage("Register gagal");
            setLoader(true);
        }

    }

    return (
        <div className="">
            <title>Login</title>
            <div className="container">
                <div className="row py-5">
                    <div className="col-3"></div>
                    <div className="col-sm-6 col-12">
                        <div className="bg-black rounded-2">
                            <img src={banner} alt="Picture of the author" className="img-fluid rounded" />
                            <center className="p-4">
                                <div className="d-grid gap-2 d-md-block">
                                    <button
                                        className={buttonActive.buttonLogin}
                                        type="button"
                                        disabled={buttonDisable.buttonLogin}
                                        onClick={handleFormLogin}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={buttonActive.buttonRegister}
                                        type="button"
                                        disabled={buttonDisable.buttonRegister}
                                        onClick={handleFormRegister}
                                    >
                                        Register
                                    </button>
                                </div>
                            </center>
                            <div className="alert alert-primary mx-3" role="alert">
                                <div className="spinner-border text-primary" role="status" hidden={loader}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                {message}
                            </div>
                            <form className="bg-dark-subtle rounded-2" hidden={formHidden.formLogin} onSubmit={handleSubmit}>
                                <div className="p-3">
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                        <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={formLogin.email} onChange={handleChange} />
                                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" name="password" value={formLogin.password} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={hanndleClick} />
                                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-outline-primary rounded-pill" disabled={available}>Submit</button>
                                    </div>
                                </div>
                            </form>
                            <form className="bg-dark-subtle rounded-2" hidden={formHidden.formRegister} onSubmit={handleRegisterSubmit}>
                                <div className="p-3">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Nama</label>
                                        <input type="text" className="form-control" id="name" name="name" onChange={handleRegister} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                        <input type="email" className="form-control" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleRegister} />
                                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                        <input type="password" name="password" className="form-control" id="exampleInputPassword1" onChange={handleRegister} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password</label>
                                        <input type="password" name="c_password" className="form-control" id="exampleInputPassword2" onChange={handleRegister} />
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={clickCekRegis} />
                                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-outline-primary rounded-pill" hidden={regisHidden}>Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    )
}

// export async function getServerSideProps() {
//     return {
//         props: {}
//     };
// }