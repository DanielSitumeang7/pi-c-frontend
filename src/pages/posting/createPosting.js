import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function createposting() {
    const [image, setImage] = useState(null);
    const [content, setContent] = useState(null);
    const [message, setMessage] = useState(null);
    const [alerrtColor, setAlertColor] = useState("");
    const [alertHidden, setAlertHidden] = useState(true);

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];

    const handleContent = (e) => {
        setContent(e);
    }

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('image', document.getElementById('image').files[0]);
        formData.append('content', content);

        setAlertHidden(true);
        console.log(formData);

        const request = await fetch('http://localhost:8000/api/posts', {
            method: 'POST',
            body: formData
        }).catch(err => console.log(err));

        const objek = await request.json();

        console.log(objek);
        if (objek.statuscode == 200) {
            setMessage(JSON.stringify(objek.message));
            setAlertColor("alert alert-success mt-3");
        }
        else {
            setMessage([objek.data.title + " ", objek.data.image + " ", objek.data.content + " "]);
            setAlertColor("alert alert-danger mt-3");
        }
        setAlertHidden(false);
    }

    useEffect(() => {
        console.log(content);
    }, [content]);


    return (
        <>
            <title>Create Posting</title>
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col">
                        </div>
                        <div className="col-sm-6 col-12">
                            <div className={alerrtColor} role="alert" hidden={alertHidden} dangerouslySetInnerHTML={{ __html: message }}>
                            </div>
                            <div className="bg-dark-subtle rounded-2 p-3">
                                <form className="p-3" onSubmit={handleSubmit}>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" id="title" name="title" />
                                        {/* <label className="input-group-text" forhtml="inputGroupFile02">Upload</label> */}
                                    </div>
                                    <div className="input-group mb-3">
                                        <input type="file" className="form-control" name="image" id="image" onChange={handleImage} />
                                        {/* <label className="input-group-text" forhtml="inputGroupFile02">Upload</label> */}
                                    </div>
                                    <div className="mb-3">
                                        <ReactQuill theme="snow" value={content} modules={{ toolbar: toolbarOptions }} onChange={handleContent} />
                                    </div>
                                    <center>
                                        <button type="submit" className="btn btn-outline-primary rounded-pill">Submit</button>
                                    </center>
                                </form>
                            </div>
                        </div>
                        <div className="col">
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}