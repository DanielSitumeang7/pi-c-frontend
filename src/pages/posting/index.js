import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/Posting.module.css';

function lamanPosting() {
    const router = useRouter();
    const [posting, setPosting] = useState([]);
    const [message, setMessage] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [namaUser, setNamaUser] = useState();

    // fungsi untuk memotong string
    function truncateString(str, maxLength) {
        if (str.length <= maxLength) {
            return str;
        } else {
            const truncated = str.substring(0, maxLength);
            return `${truncated}...`;
        }
    }

    // fungsi untuk mengambil data posting
    const getData = async () => {
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
        setMessage(objek.message);
        setPosting(objek.data);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    // fungsi untuk mengambil data user
    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
        else {
            getData();
            setNamaUser(sessionStorage.getItem('name'));
        }
    }, [mounted]);

    // fungsi untuk mengarahkan ke laman baca posting
    const handleRedirect = (id) => {
        router.push('/posting/read?id=' + id);
    }

    return (
        <>
            <title>Home</title>
            <Layout>
                <div className="bg-dark-subtle rounded-2 d-none d-lg-block">
                    <div className='row my-3 p-5'>
                        <div className='col-4'>
                            <img src="/welcome_message.png" className="img-thumbnail rounded-5 bg-primary-subtle" alt="..." />
                        </div>
                        <div className='col-8'>
                            <div className='p-5'>
                                <blockquote className="blockquote">
                                    <h1>Selamat Datang</h1>
                                </blockquote>
                                <figcaption className="blockquote-footer">
                                    <h4>
                                        <span className="badge bg-info">
                                            <cite title="Source Title">{namaUser}</cite>
                                            <center>
                                                <p className='text-white'>
                                                    {message}
                                                </p>
                                            </center>
                                        </span>
                                    </h4>
                                </figcaption>
                                <h5 className='card-text'>
                                    Selamat datang kembali! Kami senang melihat Anda kembali di platform kami. Jika Anda memerlukan bantuan atau memiliki pertanyaan tentang penggunaan platform kami, jangan ragu untuk menghubungi tim dukungan kami. Kami siap membantu Anda dengan segala hal yang kami bisa.
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className='row row-cols-1 row-cols-md-3 g-4 my-3'>
                        {posting.map(post => (
                            <div key={post.id} className='col'>
                                <div className='card h-100 bg-dark-subtle'>
                                    <div className={styles.skeletonloader + ' ' + styles.skeletonimg}></div>
                                    <div className='card-body'>
                                        <div className='skleton-loader skeleton-content'></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
                            {posting.map(post => (
                                <div key={post.id} className="col">
                                    <div className="card h-100 bg-dark-subtle">
                                        <img src={post.image} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">{truncateString(post.title, 30)}</h5>
                                        </div>
                                        <div className='card-footer'>
                                            <center>
                                                <button className="btn btn-outline-primary rounded-pill" onClick={() => handleRedirect(post.id)}>Selengkapnya</button>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Layout>
        </>
    )
}

export default lamanPosting;