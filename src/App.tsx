import React from "react";
import LandingPage from "./pages/landingPage";
import { AppShell, Header, Image } from "@mantine/core";

function App() {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Image
            src="/revcast-logo.svg"
            alt="Revcast Logo"
            width="142"
            height="28"
          />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
        position: "absolute",
      })}
    >
      <LandingPage />
    </AppShell>
  );
}

export default App;
