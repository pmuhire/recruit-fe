"use client";
import { AuthProvider } from "./AuthContext";
import { ApplicationsProvider } from "./ApplicationsContext";
import { UsersProvider } from "./usersContext";
import { JobsProvider } from "./JobContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobsProvider>
        <ApplicationsProvider>
          <UsersProvider>{children}</UsersProvider>
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}
