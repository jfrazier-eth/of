import { createRoot } from "react-dom/client";

import { Admin } from "./admin";
import { AdminContextProvider } from "./context/admin";
import { PromptContextProvider } from "./context/prompts";

const Home = () => {
  return (
    <AdminContextProvider>
      <PromptContextProvider>
        <Admin></Admin>
      </PromptContextProvider>
    </AdminContextProvider>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container!);
root.render(<Home />);
