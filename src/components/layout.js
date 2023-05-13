import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "@sweetalert2/theme-dark/dark.scss";
import Swal from 'sweetalert2/dist/sweetalert2.js';

const Layout = ({ children }) => {
    const router = useRouter();
    const [sessionValue, setSessionValue] = useState(null);
    const [activation, setActivation] = useState(
        {
            home: "nav-link active",
            create_posting : "nav-link",
        }
    );

    const clickNavigation = (link) => {
        router.push(link);
    }

    const handleNavbar = () => {
        if (router.pathname === "/posting") {
            setActivation({
                home: "nav-link active",
                create_posting : "nav-link",
            });
        }
        else if (router.pathname === "/posting/createPosting") {
            setActivation({
                home: "nav-link",
                create_posting : "nav-link active",
            });
        }
    }

    // fungsi untuk keluar dari aplikasi
    const keluar = () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda akan keluar dari aplikasi ini!",
            imageUrl:"/cry.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            confirmButtonText: 'Ya, keluar!',
            showCancelButton: true,
            cancelButtonText: 'Tidak, batalkan!',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            // jika tombol ya ditekan
            if (result.isConfirmed) {
                // menghapus isi dari sessionStorage
                sessionStorage.clear();
                router.push("/");
            }
        });
    }
            
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        window.sessionStorage.setItem("token", token);
        if (!token) {
            router.push("/");
        }
        else {
            setSessionValue(token);
        }
        handleNavbar();
    }, []);

    useEffect(() => {
        if (sessionValue) {
            window.sessionStorage.setItem("token", sessionValue);
        }
    }, [sessionValue]);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark-subtle">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <button type="" className={activation.home} onClick={() => clickNavigation('/posting')} >Home</button>
                            </li>
                            <li className="nav-item">
                                <button type="button" className={activation.create_posting} onClick={() => clickNavigation('/posting/createPosting')}>Create Posting</button>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <button type="button" className="btn btn-outline-seccondary" onClick={()=>keluar()}>logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="container py-4">
                {children}
            </main>
        </>
    );
}

export default Layout;