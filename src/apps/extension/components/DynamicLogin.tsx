import dynamic from "next/dynamic";

const DynamicLogin = dynamic(() => import("./Login"), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default DynamicLogin;
