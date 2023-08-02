import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.13.0/firebase-auth-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.js"></script>
        <link
          type="text/css"
          rel="stylesheet"
          href="https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
