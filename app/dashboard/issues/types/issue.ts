export type IssueType = "Functionality" | "Design" | "Translations"
export type IssueStatus = "Not Started" | "In Progress" | "Done"
export type Assignee = "Ben" | "Shlomi" | "Sergey" | "Rebecca" | "Shuli" | "Roi" | "Adir"

export interface StatusConfig {
  label: IssueStatus
  color: string
}

export interface AssigneeConfig {
  name: Assignee
  password: string
  color: string
  isAdmin: boolean
}

export const STATUSES: StatusConfig[] = [
  { label: "Not Started", color: "bg-red-100 text-red-800" },
  { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { label: "Done", color: "bg-green-100 text-green-800" },
]


export const ASSIGNEES: AssigneeConfig[] = [
  { name: "Ben", password: "password123", color: "bg-yellow-100 text-yellow-800", isAdmin: true },
  { name: "Rebecca", password: "password123", color: "bg-pink-100 text-pink-800", isAdmin: false },
  { name: "Shuli", password: "password123", color: "bg-purple-100 text-purple-800", isAdmin: false },
  { name: "Roi", password: "password123", color: "bg-green-100 text-green-800", isAdmin: true },
  { name: "Adir", password: "password123", color: "bg-blue-100 text-blue-800", isAdmin: false },
  { name: "Shlomi", password: "password123", color: "bg-orange-100 text-orange-800", isAdmin: false },
  { name: "Sergey", password: "password123", color: "bg-red-100 text-red-800", isAdmin: false },
]

export interface Issue {
  id: number
  type: IssueType
  name: string
  description: string
  filePaths: string[]
  elementCommandName: string
  status: IssueStatus
  dateOpened: string
  dateUpdated: string
  photos: string[]
  comments: Comment[]
  assignee: Assignee
}

export interface Comment {
  id: number
  text: string
  assignee: Assignee
  timestamp: string
}

