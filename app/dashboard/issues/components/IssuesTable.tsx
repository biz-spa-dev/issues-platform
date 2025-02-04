'use client'

import { useState } from "react"
import type { Issue } from "../types/issue"
import IssueRow from "./IssueRow"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import UserSelection from "./UserSelection"
import type { Assignee } from "../types/issue"
import NewIssueRow from "./NewIssueRow"

interface IssuesTableProps {
  issues?: Issue[]
}

export function IssuesTable({ issues: initialIssues = [] }: IssuesTableProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [loggedUser, setLoggedUser] = useState<Assignee>("Ben")
  const [showNewIssueRow, setShowNewIssueRow] = useState(false)

  const handleAddIssue = (newIssue: Omit<Issue, "id" | "dateOpened" | "dateUpdated">) => {
    const currentDate = new Date()
      .toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", " -")

    const issueWithId: Issue = {
      ...newIssue,
      id: issues.length + 1,
      dateOpened: currentDate,
      dateUpdated: currentDate,
    }

    setIssues([...issues, issueWithId])
    setShowNewIssueRow(false)
  }

  const handleUpdateIssue = (updatedIssue: Issue) => {
    setIssues(issues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)))
  }

  const handleDeleteIssue = (id: number) => {
    setIssueToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteIssue = () => {
    if (issueToDelete !== null) {
      setIssues(issues.filter((issue) => issue.id !== issueToDelete))
      setIsDeleteDialogOpen(false)
      setIssueToDelete(null)
      setDeletePassword("")
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <UserSelection onUserChange={setLoggedUser} />
        <Button
          onClick={() => setShowNewIssueRow(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={showNewIssueRow}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add New Issue
        </Button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-muted text-muted-foreground uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Assignee</th>
            <th className="py-3 px-6 text-left">Files</th>
            <th className="py-3 px-6 text-left">Comments</th>
            <th className="py-3 px-6 text-left">Photos</th>
          </tr>
        </thead>
        <tbody className="text-foreground text-sm font-light">
          {showNewIssueRow && <NewIssueRow onSave={handleAddIssue} onDiscard={() => setShowNewIssueRow(false)} />}
          {issues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              onEdit={handleUpdateIssue}
              onDelete={handleDeleteIssue}
              loggedUser={loggedUser}
            />
          ))}
        </tbody>
      </table>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Please enter the password to delete this issue:</p>
          <Input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter password"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteIssue}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

