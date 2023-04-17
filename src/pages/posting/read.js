import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

function read() {
    // mendefenisikan state untuk menampung data dari API
    const [posts, setPosts] = useState([]);
    const [konten, setKonten] = useState([]);

    // mendefinisikan state untuk animasi loading
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // memanggil fungsi useRouter
    const reouter = useRouter();
    const { id } = reouter.query;

    // fungsi untuk memotong string
    function truncateString(str, maxLength) {
        if (str.length <= maxLength) {
            return str;
        } else {
            const truncated = str.substring(0, maxLength);
            return `${truncated}...`;
        }
    }

    // fungsi untuk redirect ke halaman lain
    const selengkapnya = (id) => {
        reouter.push("/posting/read?id=" + id);
    }

    // fungsi untuk mengambil data dari API
    const getData = async ({ id }) => {
        console.log(id);
        const request = await fetch("http://localhost:8000/api/posts/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        }).catch(err => console.log(err));
        const objek = await request.json();
        console.log(objek.data);
        setPosts(objek.data);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    // fungsi untuk mengambil data dari API
    const getSaranContent = async () => {
        const token = sessionStorage.getItem('token');
        const tokenType = sessionStorage.getItem('token_type');
        const response = await fetch('http://localhost:8000/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': tokenType + ' ' + token
            }
        }).catch(err => console.log(err));
        const objek = await response.json();
        console.log(objek.data);
        setKonten(objek.data);
    }

    // memanggil fungsi getData ketika id berubah
    useEffect(() => {
        if (id) {
            getData({ id });
            getSaranContent();
        }
    }, [id]);

    return (
        <>
            <title>Post</title>
            <Layout>
                <div className="row">
                    <div className="col-12 col-md-9">
                        <div className="card h-100 my-2 border border-0">
                            <img src={posts.image} className={"card-img-top"} alt="..." />

                            <div className="row align-items-star px-2 pt-3">
                                <div className="col-10 d-none d-lg-block">
                                    <h2 className="card-title ">{posts.title}</h2>
                                </div>
                                <div className="col-9 d-lg-none">
                                    <h2 className="card-title d-lg-none">{posts.title}</h2>
                                </div>
                                <div className="col-2 text-end">
                                    <div className={"dropdown-center"}>
                                        <button className={"btn dropdown-toggle"} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Action
                                        </button>
                                        <ul className={"dropdown-menu "}>
                                            <li><button className="dropdown-item" type="button">Edit</button></li>
                                            <li><button className="dropdown-item" type="button">Delete</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="d-none d-lg-block">
                                <div className="row align-items-start my-4 px-2">
                                    <div className="col-3">
                                        <div className="row align-items-start">
                                            <div className="col-3">
                                                <img className="rounded-circle" src="/cry.png" width="50" height="50" alt="..." />
                                            </div>
                                            <div className="col-5">
                                                <h5 className="card-title">Creator Anjay</h5>
                                            </div>
                                            <div className="col-4">
                                                <button className="btn btn-outline-primary mt-2 rounded-pill">Follow</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-7"></div>
                                    <div className="col-2">
                                        <div className="row align-items-end">
                                            <div className="col-4">
                                            </div>
                                            <div className="col-8">
                                                <button className="btn btn-outline-primary mt-2 rounded-pill">Donate</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-lg-none p-2">
                                <div className="row align-items-start my-2">
                                    <div className="col-1">
                                        <img className="rounded-circle" src="/cry.png" width="52" height="52" alt="..." />
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <h5 className="card-title mt-3">Creator Anjay</h5>
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary rounded-pill mt-2">Follow</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body bg-dark-subtle rounded-4">
                                <div className="card-text" dangerouslySetInnerHTML={{ __html: posts.content }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 h-100 col-md-3">
                        <div className="card my-2">
                            <div className="card-header">
                                Saran Konten
                            </div>
                            <ul className="list-group list-group-flush">
                                {konten.map(row => (
                                    <li key={row.id} className="list-group-item border border-0">
                                        <div className="row align-items-start">
                                            <div className="col-5 d-none d-sm-block d-md-none">
                                                <img src={row.image} className="img-thumbnail border border-0" alt="..." />
                                            </div>
                                            <div className="col-7 d-none d-sm-block d-md-none">
                                                <p className="card-text">{truncateString(row.title, 66)}.</p>
                                            </div>
                                            <div className="col d-sm-none d-md-block">
                                                <img src={row.image} className="img-thumbnail border border-0" alt="..." />
                                            </div>
                                            <div className="col d-sm-none d-md-block">
                                                <p className="card-text">{truncateString(row.title, 36)}.</p>
                                            </div>
                                        </div>
                                        <div className="d-grid gap-2 mt-2">
                                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => selengkapnya(row.id)}>Selengkapnya</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default read;