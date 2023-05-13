import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-dark/dark.scss';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function read() {
    // mendefenisikan state untuk menampung data dari API
    const [posts, setPosts] = useState([]);
    const [konten, setKonten] = useState([]);
    const [teksKonten, setTeksKonten] = useState(null);
    const [judul, setJudul] = useState("");

    // mendefinisikan state untuk text editor
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

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

    // fungsi untuk memanggil popup konfirmasi penghapusan konten dengan sweetalert2
    const konfirmasiHapusKonten = () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda akan menghapus konten ini!",
            imageUrl:"/confirmation.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            confirmButtonText: 'Ya, hapus!',
            showCancelButton: true,
            cancelButtonText: 'Tidak, batalkan!',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                hapusKonten(id);
            }
        });
    }

    // fungsi untuk menghapus konten
    const hapusKonten = async (id) => {
        const request = await fetch("http://localhost:8000/api/posts/" + id, {
            method: "DELETE"
        }).catch(err => console.log(err));
        const response = await request.json();
        console.log(response);
        reouter.push("/posting");
    }

    // fungsi untuk redirect ke halaman lain
    const selengkapnya = (id) => {
        reouter.push("/posting/read?id=" + id);
    }

    // fungsi untuk mengahndle perubahan pada text editor
    const handleChangeContent = (e) => {
        setTeksKonten(e);
    }

    const handleChangeTitle = (e) => {
        setJudul(e.target.value);
    }

    // fungsi untuk mengirim data ke API
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('content', teksKonten);
        formData.append('image', document.getElementById('image').files[0]);
        formData.append('_method', 'PUT');

        console.log(formData);

        const request = await fetch("http://localhost:8000/api/posts/"+id, {
            method: "POST",
            body: formData
        }).catch(err => console.log(err));
        
        const response = await request.json();
        console.log(response);
        getData({ id });
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
        setTeksKonten(objek.data.content);
        setJudul(objek.data.title);
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
        setKonten(objek.data);
        console.log(objek.data);
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
                                            <li><button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></li>
                                            <li><button className="dropdown-item" type="button" onClick={konfirmasiHapusKonten}>Delete</button></li>
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
                        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editModalLabel">Edit Post</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="p-3" onSubmit={handleSubmit}>
                                            <div className="input-group mb-3">
                                                <label className="input-group-text" forhtml="title">Title</label>
                                                <input type="text" className="form-control" id="title" name="title" value={judul} onChange={handleChangeTitle} />
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="file" className="form-control" name="image" id="image" />
                                                {/* <label className="input-group-text" forhtml="inputGroupFile02">Upload</label> */}
                                            </div>
                                            <div className="mb-3">
                                                <ReactQuill theme="snow" value={teksKonten} modules={{ toolbar: toolbarOptions }} onChange={handleChangeContent} />
                                            </div>
                                            <center>
                                                <button type="submit" className="btn btn-outline-primary rounded-pill">Submit</button>
                                            </center>
                                        </form>
                                    </div>
                                </div>
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