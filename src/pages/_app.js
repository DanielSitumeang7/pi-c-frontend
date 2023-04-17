// import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import App from 'next/app';

class MyApp extends App {

  componentDidMount() {
    if (!sessionStorage.getItem("token")&& !sessionStorage.getItem("name")) {
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("name", "");
    }
    else if(!sessionStorage.getItem("token") && sessionStorage.getItem("name")) {
      sessionStorage.setItem("token", "");
    }
    else if(!sessionStorage.getItem("name") && sessionStorage.getItem("token")) {
      sessionStorage.setItem("name", "");
    }
    else if(sessionStorage.getItem("token") && sessionStorage.getItem("name")) {
      sessionStorage.setItem("token", sessionStorage.getItem("token"));
      sessionStorage.setItem("name", sessionStorage.getItem("name"));
    }
  }
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />
  }
}

export default MyApp;

// export default function App({ Component, pageProps }) {
//   const persistor = persistStore("token", "", { storage: sessionStorage });
//   return (
//     <PersistGate persistor={persistor}>
//       <Component {...pageProps} />
//     </PersistGate>
//   );
// }
