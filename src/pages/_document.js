import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body data-bs-theme="dark">
        <Main />
        <NextScript/>
      </body>
      <script src='/bootstrap.bundle.min.js'></script>
    </Html>
  )
}

// import Document, { Html, Head, Main, NextScript } from 'next/document';

// class MyDocument extends Document {
//   render() {
//     return (
//       <Html>
//         <Head />
//         <body data-bs-theme="dark">
//           <Main/>
//           <NextScript />
//           <script src="/bootstrap.min.js"></script>
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;


