import { IssuesTable } from "./components/IssuesTable"
import type { Issue } from "./types/issue"

const sampleIssues: Issue[] = [
  {
    id: 1,
    type: "Functionality",
    name: "Login not working",
    description: "Users are unable to log in using their credentials",
    filePaths: ["src/components/Login.tsx", "src/api/auth.ts"],
    elementCommandName: "LoginForm",
    status: "In Progress",
    dateOpened: "15/05/2023 - 09:30",
    dateUpdated: "16/05/2023 - 14:45",
    photos: [],
    comments: [],
    assignee: "Ben",
  },
  {
    id: 2,
    type: "Design",
    name: "Improve button contrast",
    description: "The primary button doesn't have enough contrast with the background",
    filePaths: ["src/components/Button.tsx", "src/styles/variables.css"],
    elementCommandName: "PrimaryButton",
    status: "Not Started",
    dateOpened: "17/05/2023 - 11:15",
    dateUpdated: "17/05/2023 - 11:15",
    photos: [],
    comments: [],
    assignee: "Shlomi",
  },
]

export default function IssuesPage() {
  return (
    <div className="p-6">
      <IssuesTable issues={sampleIssues} />
    </div>
  )
}

